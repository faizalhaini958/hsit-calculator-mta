"use client"

import Image from "next/image"
import HSITCalculator from "@/components/hsit-calculator"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto px-4 flex flex-col items-center justify-center py-4 md:py-8 min-h-screen">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-4 md:space-y-6 w-full max-w-4xl animate-in fade-in slide-in-from-top-4 duration-1000">
          <Image
            src="/takaful4all-logo.png"
            alt="Takaful4All Logo"
            width={240}
            height={80}
            className="h-10 md:h-14 w-auto object-contain drop-shadow-sm"
            priority
          />

          <div className="relative w-full max-h-[45vh] aspect-video rounded-3xl overflow-hidden glass-card premium-shadow group">
            <Image
              src="/hero-human.jpg"
              alt="Protecting Your Future"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          <div className="space-y-2 md:space-y-4">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-gradient drop-shadow-sm leading-tight">
              HSIT Preparedness Calculator
            </h1>
            <p className="text-slate-600 max-w-2xl mx-auto text-base md:text-lg lg:text-xl leading-relaxed">
              Plan your healthcare future with Takaful4All. Build awareness and set aside savings early for future medical needs.
            </p>
          </div>

          <button
            onClick={() => document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 md:px-10 py-3 md:py-4 bg-premium-gradient text-white rounded-2xl font-bold shadow-xl hover:scale-105 hover:shadow-2xl transition-all duration-300 group"
          >
            Mula Sekarang
            <span className="inline-block ml-2 group-hover:translate-y-1 transition-transform">↓</span>
          </button>
        </div>
      </div>

      {/* Calculator Section */}
      <div id="calculator-section" className="py-12 md:py-20 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
        <HSITCalculator />
      </div>
    </div>
  )
}
