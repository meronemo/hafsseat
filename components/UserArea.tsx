"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession, signIn, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { User, LogOut, Loader2, Settings } from "lucide-react"

export function UserArea() {
  const { data: session, status } = useSession()
  const [loading, setLoading] = useState(false)
  const router = useRouter()

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

  const user = session.user as any
  const grade = user?.grade ?? null
  const cls = user?.class ?? null
  const displayClass = `${grade}학년 ${cls}반`

  return (
    <Card className="w-full max-w-md mx-auto shadow-xs">
      <CardContent className="px-4 py-2">
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-base font-semibold">
              {user.username ? user.username[0] : <User className="w-5 h-5" />}
            </div>
            <div className="text-left">
              <div className="text-sm font-medium">{user?.name}</div>
              <div className="text-xs text-muted-foreground">{user?.email}</div>
            </div>
          </div>

          <Button
            variant="outline"
            size="default"
            onClick={() => signOut()}
            className="rounded-full px-3 py-1.5"
          >
            <LogOut className="w-4 h-4 mr-1.5" />
            로그아웃
          </Button>
        </div>

        <div className="bg-muted/30 rounded-lg px-3 py-2.5 flex items-center gap-3">
          <div className="flex-1">
            <div className="text-lg font-bold">{displayClass}</div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {router.push("/settings")}}
            className="rounded-full px-2.5 py-1.5 h-auto"
          >
            <Settings className="w-4 h-4 mr-1.5" />
            <span className="text-sm">설정</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}