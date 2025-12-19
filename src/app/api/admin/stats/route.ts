import { NextResponse } from "next/server";
import { db as prisma } from "@/lib/db";

export async function GET() {
  try {
    const totalCalculations = await prisma.hSITCalculatorInput.count();

    const ageAggregate = await prisma.hSITCalculatorInput.aggregate({
      _avg: {
        age: true,
      },
    });

    const genderDistribution = await prisma.hSITCalculatorInput.groupBy({
      by: ["gender"],
      _count: {
        gender: true,
      },
    });

    const planCoverage = await prisma.hSITCalculatorInput.groupBy({
      by: ["hasHSITPlan"],
      _count: {
        hasHSITPlan: true,
      },
    });

    const savingsAggregate = await prisma.hSITCalculatorResult.aggregate({
      _avg: {
        monthlySavingsNeeded: true
      }
    })

    return NextResponse.json({
      totalCalculations,
      averageAge: ageAggregate._avg.age || 0,
      genderDistribution: genderDistribution.map((g) => ({
        name: g.gender,
        value: g._count.gender,
      })),
      planCoverage: planCoverage.map((p) => ({
        name: p.hasHSITPlan ? "Has Plan" : "No Plan",
        value: p._count.hasHSITPlan,
      })),
      averageMonthlySavingsNeeded: savingsAggregate._avg.monthlySavingsNeeded || 0
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 }
    );
  }
}
