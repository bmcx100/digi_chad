import type { Metadata } from "next"
import { Geist, Geist_Mono, Concert_One } from "next/font/google"
import { TopNav } from "@/components/layout/TopNav"
import { BottomNav } from "@/components/layout/BottomNav"
import { TeamProvider } from "@/components/team/TeamProvider"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

const concertOne = Concert_One({
  variable: "--font-concert-one",
  weight: "400",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Stat in Stand",
  description: "Stat in Stand",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${concertOne.variable} antialiased`}
      >
        <TeamProvider>
          <div className="app-brand">Stat in Stand</div>
          <TopNav />
          <div className="app-content">
            {children}
          </div>
          <BottomNav />
        </TeamProvider>
      </body>
    </html>
  )
}
