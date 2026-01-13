"use client"

import Image from "next/image"

export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="mt-16 py-8 glass-card border-t border-white/20">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/takaful4all-logo.png"
                            alt="Takaful4All"
                            width={120}
                            height={40}
                            className="h-8 w-auto object-contain opacity-80"
                        />
                    </div>

                    <div className="text-center md:text-right">
                        <p className="text-sm text-slate-600">
                            © {currentYear} Takaful4All. All rights reserved.
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            Plan your healthcare future with confidence
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}
