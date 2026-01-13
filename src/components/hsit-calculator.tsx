"use client"

import { useState, useRef } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Slider } from "@/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calculator, Info, TrendingUp, Shield, Wallet, User } from "lucide-react"
import { ResultsChart, SavingsBreakdown } from "@/components/results-charts"
import { SaveResultsDialog } from "@/components/save-results-dialog"
import jsPDF from "jspdf"
import html2canvas from "html2canvas"

const formSchema = z.object({
  age: z.number().min(18).max(100),
  gender: z.enum(["male", "female"]),
  hasHSITPlan: z.boolean(),
  currentMonthlyPremium: z.number().optional(),
  hasDeductible: z.boolean().optional(),
  deductibleAmount: z.number().optional(),
  coInsurancePercentage: z.number().min(0).max(100).optional(),
  criticalIllnessCover: z.number().optional(),
})

type FormData = z.infer<typeof formSchema>

interface CalculatorResults {
  monthlySavingsNeeded: number
  yearlySavingsNeeded: number
  lowInflationPremium: number
  highInflationPremium: number
  expectedOOP: number
  projectedSavings: number
  guidanceMessages: string[]
}

export default function HSITCalculator() {
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<CalculatorResults | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [formData, setFormData] = useState<FormData | null>(null)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const resultsRef = useRef<HTMLDivElement>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      age: 30,
      gender: "male",
      hasHSITPlan: false,
      currentMonthlyPremium: 200,
      hasDeductible: false,
      deductibleAmount: 500,
      coInsurancePercentage: 0,
      criticalIllnessCover: 0,
    },
  })

  const hasHSITPlan = form.watch("hasHSITPlan")
  const hasDeductible = form.watch("hasDeductible")

  const onSubmit = async (data: FormData) => {
    setIsCalculating(true)
    setFormData(data)
    try {
      const response = await fetch("/api/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const calculationResults = await response.json()
        setResults(calculationResults)
        setShowResults(true)

        // Auto-scroll to results section after a short delay
        setTimeout(() => {
          resultsRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          })
        }, 300)
      }
    } catch (error) {
      console.error("Calculation error:", error)
    } finally {
      setIsCalculating(false)
    }
  }

  const getAgeGuidance = (age: number) => {
    if (age < 30) {
      return "Do you know that healthcare costs are rising? Start protecting your health early."
    } else if (age < 40) {
      return "Your healthcare needs are evolving. Ensure your coverage keeps pace."
    } else if (age < 50) {
      return "Health risks increase with age. Review your coverage adequacy."
    } else {
      return "Healthcare planning is crucial at this stage. Protect your retirement savings."
    }
  }

  const handleDownloadPDF = async () => {
    if (!resultsRef.current || !results || !formData) return;

    try {
      const element = resultsRef.current;

      // Pre-compute all styles to avoid oklch issues
      const elementsWithStyles: Array<{ element: HTMLElement, styles: { color?: string, backgroundColor?: string, borderColor?: string } }> = [];
      const allElements = element.querySelectorAll('*');

      allElements.forEach((el) => {
        const htmlEl = el as HTMLElement;
        const computedStyle = window.getComputedStyle(htmlEl);
        elementsWithStyles.push({
          element: htmlEl,
          styles: {
            color: computedStyle.color,
            backgroundColor: computedStyle.backgroundColor,
            borderColor: computedStyle.borderColor,
          }
        });
      });

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        onclone: (clonedDoc) => {
          // Apply pre-computed styles to cloned elements
          const clonedElements = clonedDoc.querySelectorAll('*');
          clonedElements.forEach((clonedEl, index) => {
            if (elementsWithStyles[index]) {
              const htmlEl = clonedEl as HTMLElement;
              const styles = elementsWithStyles[index].styles;

              if (styles.color) htmlEl.style.color = styles.color;
              if (styles.backgroundColor) htmlEl.style.backgroundColor = styles.backgroundColor;
              if (styles.borderColor) htmlEl.style.borderColor = styles.borderColor;
            }
          });
        }
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, "PNG", imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`HSIT-Results-${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an error generating the PDF. Please try again.");
    }
  };

  const handleSendEmail = () => {
    if (!results || !formData) return;

    const subject = encodeURIComponent("My HSIT Preparedness Results");
    const body = encodeURIComponent(`
HSIT Preparedness Calculator Results
=====================================

Personal Information:
- Age: ${formData.age} years
- Gender: ${formData.gender}
- Has HSIT Plan: ${formData.hasHSITPlan ? "Yes" : "No"}
${formData.currentMonthlyPremium ? `- Current Monthly Premium: RM ${formData.currentMonthlyPremium.toFixed(2)}` : ""}

Results:
- Monthly Savings Needed: RM ${results.monthlySavingsNeeded.toFixed(2)}
- Yearly Savings Needed: RM ${results.yearlySavingsNeeded.toFixed(2)}
- Projected Savings by Age 75: RM ${results.projectedSavings.toFixed(0)}
- Low Inflation Premium (5%): RM ${results.lowInflationPremium.toFixed(2)}
- High Inflation Premium (8%): RM ${results.highInflationPremium.toFixed(2)}
${results.expectedOOP > 0 ? `- Expected Out-of-Pocket: RM ${results.expectedOOP.toFixed(2)}` : ""}

Guidance:
${results.guidanceMessages.map((msg, i) => `${i + 1}. ${msg}`).join("\n")}

---
Generated by HSIT Preparedness Calculator
    `.trim());

    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };


  if (!hasHSITPlan && showResults) {
    return (
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <Shield className="h-5 w-5" />
              HSIT Protection Guidance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Without insurance, even a single hospital admission could cost several months of income.
                Building an emergency buffer or exploring affordable HSIT protection can help.
              </AlertDescription>
            </Alert>
            <div className="bg-white p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Recommended Actions:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Start building an emergency healthcare fund (3-6 months of expenses)</li>
                <li>• Research affordable HSIT plans available in your age group</li>
                <li>• Consider basic hospitalization coverage to protect against major expenses</li>
                <li>• Explore group insurance options through professional associations</li>
              </ul>
            </div>
            <Button
              onClick={() => {
                setShowResults(false)
                form.setValue("hasHSITPlan", true)
              }}
              className="w-full"
            >
              Explore HSIT Plan Options
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowResults(false)}
              className="w-full"
            >
              Back to Calculator
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Main render - single page with form and results
  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gradient drop-shadow-sm">
          HSIT Preparedness Calculator
        </h1>
        <p className="text-slate-600 max-w-2xl mx-auto text-lg leading-relaxed">
          Plan your healthcare future with Takaful4All. Build awareness and set aside savings early for future medical needs.
        </p>
      </div>

      {/* Form Section */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card className="glass-card premium-shadow overflow-hidden group pt-0">
            <CardHeader className="bg-premium-gradient text-white py-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Age Slider */}
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      What is your age?
                    </FormLabel>
                    <div className="flex items-center gap-4" suppressHydrationWarning>
                      <FormControl className="flex-1">
                        <Slider
                          min={18}
                          max={100}
                          step={1}
                          value={[field.value]}
                          onValueChange={(value) => field.onChange(value[0])}
                          className="w-full [&_[role=slider]]:bg-primary [&_[role=slider]]:border-primary"
                        />
                      </FormControl>
                      <Input
                        type="number"
                        min={18}
                        max={100}
                        value={field.value}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '') {
                            field.onChange(18);
                          } else {
                            const num = parseInt(val);
                            if (!isNaN(num)) {
                              field.onChange(num);
                            }
                          }
                        }}
                        onBlur={(e) => {
                          const val = parseInt(e.target.value);
                          if (isNaN(val) || val < 18) {
                            field.onChange(18);
                          } else if (val > 100) {
                            field.onChange(100);
                          }
                        }}
                        className="w-20"
                        suppressHydrationWarning
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>18</span>
                      <span>100</span>
                    </div>
                    <p className="text-sm text-blue-600 mt-2">
                      {getAgeGuidance(field.value)}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Gender */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">What is your gender?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-row space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="male" id="male" />
                          <FormLabel htmlFor="male" className="font-normal">Male</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="female" id="female" />
                          <FormLabel htmlFor="female" className="font-normal">Female</FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* HSIT Plan */}
              <FormField
                control={form.control}
                name="hasHSITPlan"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">Do you have a HSIT plan?</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(value === "true")}
                        value={field.value.toString()}
                        className="flex flex-row space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="has-plan" />
                          <FormLabel htmlFor="has-plan" className="font-normal">Yes</FormLabel>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="no-plan" />
                          <FormLabel htmlFor="no-plan" className="font-normal">No</FormLabel>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {hasHSITPlan && (
            <>
              <Card className="glass-card premium-shadow overflow-hidden group pt-0">
                <CardHeader className="bg-premium-gradient text-white py-4">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Current Coverage Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Current Monthly Premium */}
                  <FormField
                    control={form.control}
                    name="currentMonthlyPremium"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base font-medium">
                          How much are you currently paying for your HSIT plan (monthly)?
                        </FormLabel>
                        <div className="flex items-center gap-4" suppressHydrationWarning>
                          <FormControl className="flex-1">
                            <Slider
                              min={50}
                              max={2000}
                              step={10}
                              value={[field.value || 200]}
                              onValueChange={(value) => field.onChange(value[0])}
                              className="w-full"
                            />
                          </FormControl>
                          <Input
                            type="number"
                            min={50}
                            max={2000}
                            step={10}
                            value={field.value || 200}
                            onChange={(e) => {
                              const val = e.target.value;
                              if (val === '') {
                                field.onChange(50);
                              } else {
                                const num = parseInt(val);
                                if (!isNaN(num)) {
                                  field.onChange(num);
                                }
                              }
                            }}
                            onBlur={(e) => {
                              const val = parseInt(e.target.value);
                              if (isNaN(val) || val < 50) {
                                field.onChange(50);
                              } else if (val > 2000) {
                                field.onChange(2000);
                              }
                            }}
                            className="w-24"
                            placeholder="RM"
                            suppressHydrationWarning
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>RM 50</span>
                          <span>RM 2,000</span>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Separator />

                  {/* Copayment Features */}
                  <div className="space-y-4">
                    <h3 className="text-base font-medium">Does your HSIT plan have a copayment feature? (Optional)</h3>

                    <FormField
                      control={form.control}
                      name="hasDeductible"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="has-deductible"
                                checked={field.value || false}
                                onChange={(e) => field.onChange(e.target.checked)}
                                className="rounded"
                              />
                              <FormLabel htmlFor="has-deductible" className="font-normal">
                                My plan has deductible/co-insurance features
                              </FormLabel>
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {hasDeductible && (
                      <div className="space-y-4 pl-6">
                        <FormField
                          control={form.control}
                          name="deductibleAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Deductible Amount (RM)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="500"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  onFocus={(e) => e.target.select()}
                                  suppressHydrationWarning
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="coInsurancePercentage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Co-insurance/Takaful (%)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  min="0"
                                  max="100"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                  onFocus={(e) => e.target.select()}
                                  suppressHydrationWarning
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Critical Illness Cover */}
                  <FormField
                    control={form.control}
                    name="criticalIllnessCover"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How much existing Critical Illness (CI) cover do you have? (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="0"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            onFocus={(e) => e.target.select()}
                            suppressHydrationWarning
                          />
                        </FormControl>
                        <p className="text-sm text-muted-foreground">Enter amount in RM</p>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </>
          )}

          <Button type="submit" className="w-full text-lg py-8 font-bold gold-accent rounded-2xl shadow-xl hover:scale-[1.02] transition-all" size="lg" disabled={isCalculating}>
            {isCalculating ? "Calculating Your Future..." : "Calculate My HSIT Preparedness"}
          </Button>
        </form>
      </Form>

      {/* Results Section - Appears below form after calculation */}
      {showResults && results && (
        <div ref={resultsRef} className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Separator className="my-8" />

          <Card className="glass-card premium-shadow overflow-hidden pt-0">
            <CardHeader className="bg-premium-gradient text-white py-4">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Calculator className="h-6 w-6" />
                Your HSIT Preparedness Results
              </CardTitle>
              <CardDescription className="text-white/80">
                Personalized recommendations based on your current situation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Results */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-blue-50/50 border-blue-200 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Wallet className="h-5 w-5 text-[#008BA1]" />
                      <h3 className="font-bold text-[#005C6A]">Monthly Savings Needed</h3>
                    </div>
                    <p className="text-3xl font-black text-[#008BA1]">
                      RM {results.monthlySavingsNeeded.toFixed(2)}
                    </p>
                    <p className="text-sm font-medium text-[#005C6A]/70">
                      RM {results.yearlySavingsNeeded.toFixed(2)} per year
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-yellow-50/50 border-yellow-200 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-5 w-5 text-[#FFB300]" />
                      <h3 className="font-bold text-[#8C6200]">Projected Savings</h3>
                    </div>
                    <p className="text-3xl font-black text-[#FFB300]">
                      RM {results.projectedSavings.toFixed(0)}
                    </p>
                    <p className="text-sm font-medium text-[#8C6200]/70">
                      By age 75 with 4% growth
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Future Premiums */}
              <Card className="border-slate-100 bg-slate-50/30">
                <CardHeader>
                  <CardTitle className="text-lg">Future Premium Projections (to age 75)</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-orange-50 rounded-lg">
                      <h4 className="font-semibold text-orange-800 mb-1">Low Inflation (5%)</h4>
                      <p className="text-xl font-bold text-orange-900">
                        RM {results.lowInflationPremium.toFixed(2)}
                      </p>
                      <p className="text-sm text-orange-700">Monthly premium at age 75</p>
                    </div>
                    <div className="p-4 bg-red-50 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-1">High Inflation (8%)</h4>
                      <p className="text-xl font-bold text-red-900">
                        RM {results.highInflationPremium.toFixed(2)}
                      </p>
                      <p className="text-sm text-red-700">Monthly premium at age 75</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Premium Projection Chart */}
              {formData && formData.currentMonthlyPremium && (
                <ResultsChart
                  currentAge={formData.age}
                  currentPremium={formData.currentMonthlyPremium}
                  lowInflationPremium={results.lowInflationPremium}
                  highInflationPremium={results.highInflationPremium}
                />
              )}

              {/* Savings Breakdown Chart */}
              <SavingsBreakdown
                monthlySavingsNeeded={results.monthlySavingsNeeded}
                yearlySavingsNeeded={results.yearlySavingsNeeded}
                projectedSavings={results.projectedSavings}
              />

              {/* Out-of-Pocket Exposure */}
              {results.expectedOOP > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Expected Out-of-Pocket Exposure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <p className="text-xl font-bold text-yellow-900">
                        RM {results.expectedOOP.toFixed(2)}
                      </p>
                      <p className="text-sm text-yellow-700">
                        Total projected out-of-pocket costs to age 75
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Guidance Messages */}
              {results.guidanceMessages.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Personalized Guidance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {results.guidanceMessages.map((message, index) => (
                        <Alert key={index} className="bg-white/50 border-primary/20 hover:bg-white/80 transition-colors">
                          <Info className="h-4 w-4 text-primary" />
                          <AlertDescription className="text-slate-700">{message}</AlertDescription>
                        </Alert>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    setShowResults(false)
                    setResults(null)
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                  }}
                  className="flex-1"
                >
                  Clear Results
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => setShowSaveDialog(true)}>
                  Save Results
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Save Results Dialog */}
          <SaveResultsDialog
            open={showSaveDialog}
            onOpenChange={setShowSaveDialog}
            onDownloadPDF={handleDownloadPDF}
            onSendEmail={handleSendEmail}
          />
        </div>
      )}
    </div>
  )
}