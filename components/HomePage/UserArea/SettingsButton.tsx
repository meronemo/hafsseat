"use client"

import { useRouter } from "@bprogress/next/app"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"

export function SettingsButton() {
  const router = useRouter()
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => router.push("/settings")}
      className="rounded-full px-2.5 py-1.5 h-auto"
    >
      <Settings className="w-4 h-4 mr-1.5" />
      <span className="text-sm">설정</span>
    </Button>
  )
}
