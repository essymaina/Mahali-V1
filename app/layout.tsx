import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "../components/theme-provider"
import Navbar from "../components/navbar"
import {AuthProvider} from "../components/auth-context"
import type { Metadata } from "next"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "MAHALI - Workspace Booking Platform",
  description: "Find and book workspaces across Nairobi",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          <AuthProvider>{children}</AuthProvider>
          {/* Add this div for portals */}
          <div id="radix-portal"></div>
        </ThemeProvider>
      </body>
    </html>
  )
}