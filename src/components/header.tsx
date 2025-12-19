"use client";

import Link from "next/link";
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Header() {
    return (
        <header className="relative w-full bg-white pt-4 pb-12 overflow-hidden">
            {/* Ribbon/Wave Background */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-primary/10" style={{
                clipPath: "polygon(0 100%, 100% 100%, 100% 40%, 0 100%)"
            }}></div>
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-primary/20" style={{
                clipPath: "polygon(0 100%, 100% 100%, 100% 60%, 0 100%)"
            }}></div>

            {/* Decorative Wave SVG */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                <svg className="relative block w-[calc(100%+1.3px)] h-[50px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-primary/10"></path>
                </svg>
            </div>

            <div className="container relative z-10 flex h-20 items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* Logo Placeholder */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="flex flex-col">
                            <span className="text-2xl font-bold text-primary italic font-serif">Celebrating</span>
                            <div className="flex items-center">
                                <span className="text-4xl font-bold text-primary">40</span>
                                <span className="text-sm ml-1 text-primary">Takaful4All</span>
                            </div>
                        </div>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-foreground/80">
                    <Link href="#" className="hover:text-primary transition-colors">ANJUNG</Link>
                    <Link href="#" className="hover:text-primary transition-colors border-b-2 border-primary pb-1 text-primary">STATISTIK</Link>
                    <Link href="#" className="hover:text-primary transition-colors">VBIT</Link>
                    <Link href="#" className="hover:text-primary transition-colors">PENASIHAT</Link>
                    <Link href="#" className="hover:text-primary transition-colors flex items-center gap-1">
                        E-PERKHIDMATAN <span className="text-[10px]">▼</span>
                    </Link>
                    <Link href="#" className="hover:text-primary transition-colors flex items-center gap-1">
                        AKADEMI MTA <span className="text-[10px]">▼</span>
                    </Link>
                    <Link href="#" className="hover:text-primary transition-colors">ACARA</Link>
                </nav>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80">
                        <Search className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80 md:hidden">
                        <Menu className="h-6 w-6" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-primary hover:text-primary/80 hidden md:flex">
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </header>
    );
}
