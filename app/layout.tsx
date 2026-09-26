import type React from "react"
import type { Metadata } from "next"
import { Audiowide, Rajdhani } from "next/font/google"
import { AuthProvider } from "@/context/AuthContext"
import "./globals.css"

const audiowide = Audiowide({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
})

const rajdhani = Rajdhani({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
})

export const metadata: Metadata = {
  title: { default: "CoverSmart — Your Insurance. Finally Clear.", template: "%s | CoverSmart" },
  description: "South Africa's first insurance intelligence platform. Decode policies, detect duplicate cover, audit funeral benefits, and draft regulatory complaints.",
  keywords: "insurance South Africa, funeral policy cap, policy decoder, insurance complaints, FAIS, TCF",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${audiowide.variable} ${rajdhani.variable}`}>
      <body className="antialiased" style={{ fontFamily: "var(--font-body, 'Rajdhani', sans-serif)" }}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
