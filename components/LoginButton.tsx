"use client"

import { useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { User, LogOut, Loader2 } from "lucide-react"

export function LoginButton() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)

  if (status === "loading") {
    return (
      <div className="inline-flex items-center gap-3">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" aria-hidden />
      </div>
    )
  }

  if (!session) {
    return (
      <Button
        onClick={() => {
          setLoading(true)
          signIn("google").finally(() => setLoading(false))
        }}
        size="lg"
        className="rounded-full px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <User className="w-5 h-5" />
        )}
        <span className="ml-3">로그인</span>
      </Button>
    )
  }

  return (
    <div className="inline-flex items-center gap-4">
      <div className="flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-primary/10 text-primary flex items-center justify-center text-m font-semibold">
          {session.user.username ? session.user.username[0] : <User className="w-4 h-4" />}
        </div>
        <div className="hidden sm:block text-left">
          <div className="text-m font-medium">{session.user?.name}</div>
          <div className="text-sm text-muted-foreground">{session.user?.email}</div>
        </div>
      </div>

      <Button
        variant="outline"
        size="lg"
        onClick={() => signOut()}
        className="rounded-full px-6 py-2"
        aria-label="Sign out"
      >
        <LogOut className="w-4 h-4 mr-2" />
        로그아웃
      </Button>
    </div>
  )
}