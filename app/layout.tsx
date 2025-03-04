import type React from "react"
import { Inter } from "next/font/google"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { AuthProvider } from "@/components/AuthProvider"
import { ThemeProvider } from "next-themes"
import "@/app/globals.css" // Ensure global CSS is imported

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Amya Blogs",
  name : "Amya Bogs Positive Blogs Mindful blogs for a better life",
  description: "Amya Bogs Positive Blogs Mindful blogs for a better life",
  image: "@public/maxresdefault.jpg"
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class">
          <AuthProvider>
            <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
              <Header />
              <main className="flex-grow container mx-auto px-4 py-8">{children}</main>
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}