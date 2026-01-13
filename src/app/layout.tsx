import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HSIT Preparedness Calculator",
  description: "A comprehensive Hospitalisation and Surgical Insurance/Takaful (HSIT) Preparedness Calculator. Assess your risk, calculate premiums, and plan your healthcare savings.",
  keywords: ["HSIT", "Insurance", "Takaful", "Healthcare", "Calculator", "Malaysia", "Medical Card"],
  authors: [{ name: "HSIT Team" }],
  openGraph: {
    title: "HSIT Preparedness Calculator",
    description: "Assess your risk, calculate premiums, and plan your healthcare savings.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HSIT Preparedness Calculator",
    description: "Assess your risk, calculate premiums, and plan your healthcare savings.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        suppressHydrationWarning
      >
        <main>{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
