"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { UserArea } from "@/components/UserArea"
import { RunButton } from "@/components/RunButton"
import { useRouter } from "next/navigation"

export default function Home() {
  const { data: session, status } = useSession()
  const user = session?.user as any
  const isFirstLogin = user && user.classId === null
  const router = useRouter()

  useEffect(() => {
    if (isFirstLogin) {
      router.push("/confirm-representative")
    }
  }, [isFirstLogin, router])

  return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-5xl md:text-6xl font-bold text-balance tracking-tight">HAFSSeat</h1>
          </div>
  
          <div className="text-center space-y-8 w-full">
            {status === "loading" ? (
              <div className="w-12 h-12 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            ) : session ? (
              <div className="space-y-6">
                <div className="text-center">
                  <UserArea />
                </div>
                <div className="text-center">
                  <RunButton />
                </div>
              </div>
            ) : (
              <UserArea />
            )}
          </div>
        </div>
      </main>
    )
}
