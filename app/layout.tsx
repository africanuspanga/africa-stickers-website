import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Suspense } from "react"
import "./globals.css"
import { BusinessStructuredData } from "@/components/structured-data"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
})

export const metadata: Metadata = {
  title: "Africa Stickers - Premium Stickers & Vinyl Solutions in Tanzania",
  description:
    "Professional sticker printing, vinyl cutting, and custom graphics in Dar Es Salaam. Quality stickers for vehicles, businesses, and more.",
  generator: "v0.app",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  keywords:
    "stickers, vinyl, printing, Tanzania, Dar Es Salaam, custom graphics, vehicle stickers, reflective tape, frosted film, tinted film",
  authors: [{ name: "Africa Stickers" }],
  openGraph: {
    title: "Africa Stickers - Premium Stickers & Vinyl Solutions",
    description: "Professional sticker printing, vinyl cutting, and custom graphics in Dar Es Salaam, Tanzania",
    type: "website",
    url: "https://www.africastickers.co.tz",
    siteName: "Africa Stickers",
    locale: "en_US",
    images: [
      {
        url: "/images/logo.png",
        width: 1200,
        height: 630,
        alt: "Africa Stickers - Premium Vinyl Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Africa Stickers - Premium Stickers & Vinyl Solutions",
    description: "Professional sticker printing, vinyl cutting, and custom graphics in Dar Es Salaam, Tanzania",
    images: ["/images/logo.png"],
  },
  metadataBase: new URL("https://www.africastickers.co.tz"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-placeholder", // You can add this later
  },
  category: "business",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable} ${jetbrainsMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <BusinessStructuredData />
      </body>
    </html>
  )
}
