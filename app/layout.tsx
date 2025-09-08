import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

export const metadata: Metadata = {
  title: "Africa Stickers - Premium Stickers & Vinyl Solutions in Tanzania",
  description:
    "Professional sticker printing, vinyl cutting, and custom graphics in Dar Es Salaam. Quality stickers for vehicles, businesses, and more.",
  generator: "v0.app",
  icons: {
    icon: "/favicon.ico",
  },
  keywords: "stickers, vinyl, printing, Tanzania, Dar Es Salaam, custom graphics, vehicle stickers",
  authors: [{ name: "Africa Stickers" }],
  openGraph: {
    title: "Africa Stickers - Premium Stickers & Vinyl Solutions",
    description: "Professional sticker printing, vinyl cutting, and custom graphics in Dar Es Salaam",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`font-sans ${geistSans.variable} ${geistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
