import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { z } from 'zod'

const calculationSchema = z.object({
  age: z.number().min(18).max(100),
  gender: z.enum(["male", "female"]),
  hasHSITPlan: z.boolean(),
  currentMonthlyPremium: z.number().optional(),
  hasDeductible: z.boolean().optional(),
  deductibleAmount: z.number().optional(),
  coInsurancePercentage: z.number().min(0).max(100).optional(),
  criticalIllnessCover: z.number().optional(),
})

// Age factor curve for insurance premiums (relative to age 30)
function getAgeFactor(age: number): number {
  if (age < 25) return 0.7
  if (age < 30) return 0.85
  if (age < 35) return 1.0
  if (age < 40) return 1.2
  if (age < 45) return 1.5
  if (age < 50) return 1.9
  if (age < 55) return 2.4
  if (age < 60) return 3.0
  if (age < 65) return 3.8
  if (age < 70) return 4.8
  if (age < 75) return 6.0
  return 7.5
}

// Utilization and severity factors for OOP calculations
function getUtilizationFactor(age: number): number {
  if (age < 30) return 0.3
  if (age < 40) return 0.5
  if (age < 50) return 0.8
  if (age < 60) return 1.2
  if (age < 70) return 1.8
  return 2.5
}

function getSeverityFactor(age: number): number {
  if (age < 30) return 0.5
  if (age < 40) return 0.7
  if (age < 50) return 1.0
  if (age < 60) return 1.3
  if (age < 70) return 1.7
  return 2.2
}

// Calculate future premiums with inflation
function calculateFuturePremiums(
  currentAge: number,
  currentPremium: number,
  inflationRate: number
): number {
  const yearsTo75 = Math.max(0, 75 - currentAge)
  const ageFactor75 = getAgeFactor(75)
  const currentAgeFactor = getAgeFactor(currentAge)

  // Apply age factor and compound inflation
  const futurePremium = currentPremium * (ageFactor75 / currentAgeFactor) *
    Math.pow(1 + inflationRate, yearsTo75)

  return futurePremium
}

// Calculate expected out-of-pocket exposure
function calculateExpectedOOP(
  currentAge: number,
  hasDeductible: boolean,
  deductibleAmount: number = 0,
  coInsurancePercentage: number = 0
): number {
  if (!hasDeductible || (deductibleAmount === 0 && coInsurancePercentage === 0)) {
    return 0
  }

  let totalOOP = 0
  const currentYear = new Date().getFullYear()

  for (let age = currentAge; age <= 75; age++) {
    const utilization = getUtilizationFactor(age)
    const severity = getSeverityFactor(age)

    // Expected claim amount based on utilization and severity
    const expectedClaim = utilization * severity * 5000 // Base claim amount of RM 5000

    // Apply deductible and co-insurance
    const oopForYear = Math.min(deductibleAmount, expectedClaim) +
      (expectedClaim - Math.min(deductibleAmount, expectedClaim)) * (coInsurancePercentage / 100)

    // Apply claim inflation (5% per year)
    const yearsFromNow = age - currentAge
    totalOOP += oopForYear * Math.pow(1.05, yearsFromNow)
  }

  return totalOOP
}

// Calculate projected savings with growth
function calculateProjectedSavings(
  currentAge: number,
  monthlySavings: number,
  growthRate: number = 0.04
): number {
  let totalSavings = 0
  const yearsTo75 = Math.max(0, 75 - currentAge)

  for (let year = 0; year <= yearsTo75; year++) {
    // Add yearly contribution and apply growth
    totalSavings = totalSavings * (1 + growthRate) + (monthlySavings * 12)
  }

  return totalSavings
}

// Generate personalized guidance messages
function generateGuidanceMessages(data: z.infer<typeof calculationSchema>): string[] {
  const messages: string[] = []

  if (!data.hasHSITPlan) {
    messages.push("Without insurance, even a single hospital admission could cost several months of income. Building an emergency buffer or exploring affordable HSIT protection can help.")
  }

  if (data.hasDeductible && (data.deductibleAmount! > 0 || data.coInsurancePercentage! > 0)) {
    messages.push("Plans with copayment features mean you share part of each hospital bill. Make sure you have accessible savings to cover this.")
  }

  if (!data.criticalIllnessCover || data.criticalIllnessCover === 0) {
    messages.push("In the event of a critical illness, income loss can make sustaining current lifestyle and paying future premiums difficult. Consider whether a CI plan fits your needs.")
  }

  if (data.age > 40) {
    messages.push("If you have dependents, consider additional HSIT or CI coverage, savings and emergency buffer to meet potential higher healthcare needs.")
  }

  if (data.age > 50) {
    messages.push("You may need to save more or purchase HSIT plans earlier if you have higher health risks, such as pre-existing conditions, family history of chronic illnesses, or high-stress lifestyle.")
  }

  messages.push("Consider your current savings and EPF balances to meet future healthcare expenditures.")

  return messages
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = calculationSchema.parse(body)

    // Calculate future premiums
    const lowInflationPremium = validatedData.currentMonthlyPremium ?
      calculateFuturePremiums(validatedData.age, validatedData.currentMonthlyPremium, 0.05) : 0
    const highInflationPremium = validatedData.currentMonthlyPremium ?
      calculateFuturePremiums(validatedData.age, validatedData.currentMonthlyPremium, 0.08) : 0

    // Calculate expected OOP
    const expectedOOP = calculateExpectedOOP(
      validatedData.age,
      validatedData.hasDeductible || false,
      validatedData.deductibleAmount,
      validatedData.coInsurancePercentage
    )

    // Calculate recommended savings
    // Base recommendation: 20% of future premium + OOP buffer
    const monthlySavingsNeeded = Math.max(
      (lowInflationPremium * 0.2 + expectedOOP / (75 - validatedData.age) / 12),
      100 // Minimum RM 100 per month
    )
    const yearlySavingsNeeded = monthlySavingsNeeded * 12

    // Calculate projected savings
    const projectedSavings = calculateProjectedSavings(validatedData.age, monthlySavingsNeeded)

    // Generate guidance messages
    const guidanceMessages = generateGuidanceMessages(validatedData)

    // Save to database
    const savedInput = await db.hSITCalculatorInput.create({
      data: {
        age: validatedData.age,
        gender: validatedData.gender,
        hasHSITPlan: validatedData.hasHSITPlan,
        currentMonthlyPremium: validatedData.currentMonthlyPremium,
        hasDeductible: validatedData.hasDeductible,
        deductibleAmount: validatedData.deductibleAmount,
        coInsurancePercentage: validatedData.coInsurancePercentage,
        criticalIllnessCover: validatedData.criticalIllnessCover,
      }
    })

    await db.hSITCalculatorResult.create({
      data: {
        inputId: savedInput.id,
        monthlySavingsNeeded,
        yearlySavingsNeeded,
        lowInflationPremium,
        highInflationPremium,
        expectedOOP,
        projectedSavings,
        guidanceMessages: JSON.stringify(guidanceMessages),
      }
    })

    const results = {
      monthlySavingsNeeded,
      yearlySavingsNeeded,
      lowInflationPremium,
      highInflationPremium,
      expectedOOP,
      projectedSavings,
      guidanceMessages,
    }

    return NextResponse.json(results)

  } catch (error) {
    console.error('Calculation error:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}