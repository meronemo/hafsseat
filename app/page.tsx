"use client"

import { useSession } from "next-auth/react"
import { LoginButton } from "@/components/LoginButton"
import { RunButton } from "@/components/RunButton"

export default function Home() {
  const { data: session, status } = useSession();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-5xl md:text-6xl font-bold text-balance tracking-tight">HAFSSeat</h1>
        </div>

        <div className="flex justify-center">
          {status === "loading" ? (
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          ) : session ? (
            <div>
              <LoginButton />
              <RunButton />
            </div>
          ) : (
            <LoginButton />
          )}
        </div>
      </div>
    </main>
  )
}
