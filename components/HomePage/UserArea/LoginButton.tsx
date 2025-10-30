"use client"

import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { User } from "lucide-react"

export function LoginButton() {
  return (
    <Button
      onClick={() => signIn("google")}
      size="lg"
      className="rounded-full px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all"
    >
      <User className="w-5 h-5" />
      <span className="ml-3">로그인</span>
    </Button>
  )
}
