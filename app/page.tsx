"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { UserArea } from "@/components/UserArea"
import { RunButton } from "@/components/RunButton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useRouter } from "next/navigation"
import { AlertCircleIcon } from "lucide-react"

export default function Home() {
  const { data: session, status } = useSession()
  const user = session?.user as any
  const isFirstLogin = user && user.classId === null
  const router = useRouter()
  const [isSeatNull, setIsSeatNull] = useState(false) 
  const [settingsChanged, setSettingsChanged] = useState(false)

  useEffect(() => {
    if (isFirstLogin) {
      router.push("/confirm-representative")
    }

    const checkStatus = async () => {
      const { seat } = await fetch('/api/view-seat').then(r => r.json())
      const { settings } = await fetch('/api/settings').then(r => r.json())
      const { changed: studentsChanged } = await fetch('/api/settings/students').then(r => r.json())
      setIsSeatNull(!seat)
      setSettingsChanged(settings.changed || studentsChanged)
    }
    checkStatus()
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

                {isSeatNull && (
                  <Alert className="w-fit mx-auto">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>
                      첫 자리배치 시에는 규칙이 적용되지 않습니다.
                    </AlertTitle>
                    <AlertDescription>
                      현재 자리 배치를 직접 입력하여 규칙을 적용할 수 있습니다.
                    </AlertDescription>
                  </Alert>
                )}

                {!isSeatNull && settingsChanged && (
                  <Alert className="w-fit mx-auto">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>
                      자리 구조 또는 학생 설정이 변경되어 다음 자리배치 시 규칙이 적용되지 않습니다.
                    </AlertTitle>
                    <AlertDescription>
                      변경된 설정에 맞는 자리 배치를 직접 입력하여 규칙을 적용할 수 있습니다.
                    </AlertDescription>
                  </Alert>
                )}

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
