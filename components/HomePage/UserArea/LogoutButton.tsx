"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  return (
    <Button
      variant="outline"
      size="default"
      onClick={() => signOut()}
      className="rounded-full px-3 py-1.5"
    >
      <LogOut className="w-4 h-4 mr-1.5" />
      로그아웃
    </Button>
  )
}
