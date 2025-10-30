"use client"

import { useState } from "react"
import { type Session } from "next-auth"
import { Button } from "@/components/ui/button"
import { Shuffle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface RunButtonProps {
  session: Session | null
  disabled?: boolean
}

export function RunButton({ session, disabled = false }: RunButtonProps) {
  const [isRunning, setIsRunning] = useState(false)
  const router = useRouter()

  if (!session) return null

  const handleRun = async () => {
    setIsRunning(true)
    const res = await fetch("/api/randomize-seat", {
      method: "POST"
    })
    
    if (res.ok) {
      router.push("/seat")
    } else {
      const error = await res.json()
      console.error(error)
    }
    setIsRunning(false)
  }

  return (
    <Button
      size="lg"
      onClick={handleRun}
      disabled={isRunning || disabled}
      className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all"
    >
      {isRunning ? (
        <div className="flex gap-2 items-center">
          <Loader2 className="w-5 h-5 animate-spin" />
          <p>자리 배치 실행 중</p>
        </div>
      ) : (
        <div className="flex gap-2 items-center">
          <Shuffle className="w-5 h-5 mr-2" />
          <p>자리 배치 실행</p>
        </div>
      )}
    </Button>
  )
}
