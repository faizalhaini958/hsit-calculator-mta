"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

interface PremiumProjectionData {
  age: number
  lowInflation: number
  highInflation: number
}

interface ResultsChartProps {
  currentAge: number
  currentPremium: number
  lowInflationPremium: number
  highInflationPremium: number
}

export function ResultsChart({
  currentAge,
  currentPremium,
  lowInflationPremium,
  highInflationPremium
}: ResultsChartProps) {
  // Generate data points for the chart
  const generateChartData = (): PremiumProjectionData[] => {
    const data: PremiumProjectionData[] = []
    const startAge = currentAge
    const endAge = 75

    for (let age = startAge; age <= endAge; age += 5) {
      const yearsFromNow = age - startAge

      // Calculate premiums at this age
      const lowInflation = currentPremium * Math.pow(1.05, yearsFromNow) * (1 + (age - 30) * 0.08)
      const highInflation = currentPremium * Math.pow(1.08, yearsFromNow) * (1 + (age - 30) * 0.08)

      data.push({
        age,
        lowInflation: Math.round(lowInflation),
        highInflation: Math.round(highInflation)
      })
    }

    return data
  }

  const chartData = generateChartData()

  return (
    <Card className="glass-card premium-shadow overflow-hidden">
      <CardHeader className="bg-premium-gradient text-white">
        <CardTitle className="text-lg">Premium Projection to Age 75</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={320}>
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis
              dataKey="age"
              label={{ value: 'Age', position: 'insideBottom', offset: -10, fontStyle: 'italic' }}
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              tickFormatter={(value) => value.toLocaleString()}
              width={80}
              label={{
                value: 'Monthly Premium (RM)',
                angle: -90,
                position: 'insideLeft',
                offset: -10,
                style: { textAnchor: 'middle', fill: '#64748b', fontSize: 13, fontWeight: 500 }
              }}
              tick={{ fontSize: 12, fill: '#64748b' }}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                backdropFilter: 'blur(4px)'
              }}
              formatter={(value: number) => [`RM ${value.toLocaleString()}`, '']}
              labelFormatter={(label) => `Age ${label}`}
              itemStyle={{ fontWeight: 600 }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{ paddingBottom: '20px' }}
            />
            <Line
              type="monotone"
              dataKey="lowInflation"
              stroke="oklch(0.55 0.15 200)"
              strokeWidth={3}
              dot={{ fill: 'oklch(0.55 0.15 200)', r: 4 }}
              activeDot={{ r: 7, strokeWidth: 2, stroke: '#fff' }}
              name="Low Inflation (5%)"
            />
            <Line
              type="monotone"
              dataKey="highInflation"
              stroke="oklch(0.55 0.18 243)"
              strokeWidth={3}
              dot={{ fill: 'oklch(0.55 0.18 243)', r: 4 }}
              activeDot={{ r: 7, strokeWidth: 2, stroke: '#fff' }}
              name="High Inflation (8%)"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

interface SavingsBreakdownProps {
  monthlySavingsNeeded: number
  yearlySavingsNeeded: number
  projectedSavings: number
}

export function SavingsBreakdown({
  monthlySavingsNeeded,
  yearlySavingsNeeded,
  projectedSavings
}: SavingsBreakdownProps) {
  // Format currency with millions notation
  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `RM ${(value / 1000000).toFixed(2)}M`
    }
    return `RM ${value.toLocaleString('en-MY', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  // Calculate percentages relative to projected savings (largest value)
  const maxValue = projectedSavings
  const monthlyPercent = (monthlySavingsNeeded / maxValue) * 100
  const yearlyPercent = (yearlySavingsNeeded / maxValue) * 100

  return (
    <Card className="glass-card premium-shadow overflow-hidden">
      <CardHeader className="bg-premium-gradient text-white">
        <CardTitle className="text-lg">Savings Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {/* Monthly Savings */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-gray-700">Monthly Savings Needed</span>
              <span className="text-lg font-bold text-blue-600">{formatCurrency(monthlySavingsNeeded)}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-7 relative overflow-hidden border border-gray-200">
              <div
                className="bg-gradient-to-r from-[#008BA1] to-[#005C6A] h-full flex items-center justify-end pr-2 transition-all duration-700 ease-out"
                style={{ width: `${Math.max(monthlyPercent, 3)}%` }}
              >
                {monthlyPercent > 12 && (
                  <span className="text-white text-xs font-semibold">{monthlyPercent.toFixed(1)}%</span>
                )}
              </div>
              {monthlyPercent <= 12 && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-600">
                  {monthlyPercent.toFixed(1)}%
                </span>
              )}
            </div>
          </div>

          {/* Yearly Savings */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-gray-700">Yearly Savings Needed</span>
              <span className="text-lg font-bold text-green-600">{formatCurrency(yearlySavingsNeeded)}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-7 relative overflow-hidden border border-gray-200">
              <div
                className="bg-gradient-to-r from-[#1E88E5] to-[#1565C0] h-full flex items-center justify-end pr-2 transition-all duration-700 ease-out"
                style={{ width: `${Math.max(yearlyPercent, 3)}%` }}
              >
                {yearlyPercent > 12 && (
                  <span className="text-white text-xs font-semibold">{yearlyPercent.toFixed(1)}%</span>
                )}
              </div>
              {yearlyPercent <= 12 && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-semibold text-gray-600">
                  {yearlyPercent.toFixed(1)}%
                </span>
              )}
            </div>
          </div>

          {/* Projected Savings */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline">
              <span className="text-sm font-medium text-gray-700">Projected by Age 75</span>
              <span className="text-lg font-bold text-purple-600">{formatCurrency(projectedSavings)}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-7 relative overflow-hidden border border-gray-200">
              <div
                className="gold-accent h-full flex items-center justify-end pr-2 transition-all duration-700 ease-out shadow-none"
                style={{ width: '100%' }}
              >
                <span className="text-white text-xs font-bold">100%</span>
              </div>
            </div>
          </div>

          {/* Info note */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-xs text-blue-800 leading-relaxed">
              <strong>Note:</strong> Percentages show relative comparison to projected savings. The projected amount is significantly larger due to compound growth over time.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}