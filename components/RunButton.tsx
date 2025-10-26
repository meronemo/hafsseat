"use client"

import { Button } from "@/components/ui/button"
import { Shuffle } from "lucide-react"
import { useState } from "react"

export function RunButton() {
  const [isRunning, setIsRunning] = useState(false)

  const handleRun = async () => {
    setIsRunning(true)

    // Simulate randomization process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsRunning(false)
  }

  return (
    <Button
      size="lg"
      onClick={handleRun}
      disabled={isRunning}
      className="text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all"
    >
      <Shuffle className="w-5 h-5 mr-2" />
      {isRunning ? "실행 중..." : "자리 배치 실행"}
    </Button>
  )
}
