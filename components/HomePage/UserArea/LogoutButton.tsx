"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useProgress } from "@bprogress/next"

export function LogoutButton() {
  const { start, stop } = useProgress()

  const handleClick = async () => {
    start()
    await signOut()
    stop()
  }

  return (
    <Button
      variant="outline"
      size="default"
      onClick={handleClick}
      className="rounded-full px-3 py-1.5"
    >
      <LogOut className="w-4 h-4 mr-1.5" />
      로그아웃
    </Button>
  )
}
