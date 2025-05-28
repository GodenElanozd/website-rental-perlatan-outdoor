import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import type { Metadata } from "next"

// Optimize font loading
const inter = Inter({
  subsets: ["latin"],
  display: "swap", // Ensure text remains visible during webfont load
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Mountain Gear - Rental Alat Gunung",
  description: "Rental alat gunung terpercaya untuk petualangan Anda",
  generator: "v0.dev",
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={inter.variable}>
      <head>
        {/* Preload critical assets */}
        <link rel="preconnect" href="https://imagecdn.app" />
        <link rel="dns-prefetch" href="https://imagecdn.app" />

        {/* Add meta tags for better SEO and performance */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#16a34a" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
