"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, Cell, LabelList } from 'recharts'

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
    <Card className="border-primary/10">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10">
        <CardTitle className="text-primary">Premium Projection to Age 75</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="age"
              label={{ value: 'Age', position: 'insideBottom', offset: -5 }}
              stroke="#6b7280"
            />
            <YAxis
              label={{ value: 'Monthly Premium (RM)', angle: -90, position: 'insideLeft' }}
              stroke="#6b7280"
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              formatter={(value: number) => [`RM ${value.toLocaleString()}`, '']}
              labelFormatter={(label) => `Age ${label}`}
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '20px' }}
              iconType="line"
            />
            <Line
              type="monotone"
              dataKey="lowInflation"
              stroke="#f97316"
              strokeWidth={3}
              name="Low Inflation (5%)"
              dot={{ fill: '#f97316', r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="highInflation"
              stroke="#dc2626"
              strokeWidth={3}
              name="High Inflation (8%)"
              dot={{ fill: '#dc2626', r: 4 }}
              activeDot={{ r: 6 }}
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
  const savingsData = [
    {
      category: 'Monthly Savings',
      amount: Math.round(monthlySavingsNeeded),
      fill: '#3b82f6'
    },
    {
      category: 'Yearly Savings',
      amount: Math.round(yearlySavingsNeeded),
      fill: '#10b981'
    },
    {
      category: 'Projected by Age 75',
      amount: Math.round(projectedSavings),
      fill: '#8b5cf6'
    }
  ]

  return (
    <Card className="border-primary/10 shadow-md">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 border-b border-primary/5 pb-4">
        <CardTitle className="text-primary text-lg font-semibold flex items-center gap-2">
          <span className="h-5 w-1 bg-primary rounded-full"></span>
          Savings Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={savingsData}
            layout="vertical"
            margin={{ top: 20, right: 120, left: 40, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e5e7eb" />
            <XAxis
              type="number"
              hide
            />
            <YAxis
              dataKey="category"
              type="category"
              width={140}
              tick={{ fill: '#4b5563', fontSize: 13, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: 'rgba(0,0,0,0.04)' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
                      <p className="font-semibold text-gray-700 mb-1">{data.category}</p>
                      <p className="text-primary font-bold text-lg">
                        RM {data.amount.toLocaleString()}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="amount"
              radius={6}
              barSize={40}
              background={{ fill: '#f3f4f6', radius: 6 }}
            >
              {savingsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <LabelList
                dataKey="amount"
                position="right"
                formatter={(value: number) => `RM ${value.toLocaleString()}`}
                style={{ fill: '#374151', fontSize: 13, fontWeight: 600 }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}