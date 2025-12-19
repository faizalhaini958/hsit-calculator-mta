import HSITCalculator from "@/components/hsit-calculator"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto">
        <HSITCalculator />
      </div>
    </div>
  )
}