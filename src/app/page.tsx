import Image from "next/image"
import HSITCalculator from "@/components/hsit-calculator"

export default function Home() {
  return (
    <div className="py-8 md:py-16">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-6 mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
          <Image
            src="/takaful4all-logo.png"
            alt="Takaful4All Logo"
            width={240}
            height={80}
            className="h-14 w-auto object-contain drop-shadow-sm"
            priority
          />

          <div className="relative w-full max-w-xl aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden glass-card premium-shadow group">
            <Image
              src="/hero-illustration.png"
              alt="Protecting Your Future"
              fill
              className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>

        {/* Calculator Section */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
          <HSITCalculator />
        </div>
      </div>
    </div>
  )
}
