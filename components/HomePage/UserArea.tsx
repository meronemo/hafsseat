"use client"

import { type Session } from "next-auth"
import { Card, CardContent } from "@/components/ui/card"
import { User } from "lucide-react"
import { LoginButton } from "./UserArea/LoginButton"
import { LogoutButton } from "./UserArea/LogoutButton"
import { SettingsButton } from "./UserArea/SettingsButton"

interface UserAreaProps {
  session: Session | null
}

export function UserArea({ session }: UserAreaProps) {
  if (!session) {
    return <LoginButton />
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

          <LogoutButton />
        </div>

        <div className="bg-muted/30 rounded-lg px-3 py-2.5 flex items-center gap-3">
          <div className="flex-1">
            <div className="text-lg font-bold">{displayClass}</div>
          </div>
          <SettingsButton />
        </div>
      </CardContent>
    </Card>
  )
}