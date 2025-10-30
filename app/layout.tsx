import type { Metadata } from "next"
import localFont from "next/font/local"
import { SessionProviderClient } from './providers/SessionProviderClient'
import { Toaster } from "sonner"
import "./globals.css"

const pretendard = localFont({
  src: "../public/fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-pretendard",
})

export const metadata: Metadata = {
  title: "HAFSSeat",
  description: "Smart classroom seating arrangement app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body
        className={`${pretendard.className} antialiased`}
      >
        <SessionProviderClient>{children}</SessionProviderClient>
        <Toaster />
      </body>
    </html>
  )
}
