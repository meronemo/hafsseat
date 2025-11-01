"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "@bprogress/next/app"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

interface ConfirmRepresentativeProps {
  userEmail: string
  userName: string
  userGrade: number
  userClass: number
}

export default function ConfirmRepresentative({
  userEmail,
  userName,
  userGrade,
  userClass,
}: ConfirmRepresentativeProps) {
  const [section, setSection] = useState(userClass === 1 || userClass === 10 ? 'A' : '')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleConfirm = async () => {
    setIsLoading(true)
    
    try {
      const res = await fetch("/api/confirm-representative", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "grade": userGrade,
          "class": userClass + section,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        console.error(data.error)
        setIsLoading(false)
        return
      }

      // Initialize class settings data
      const res2 = await fetch("/api/settings/init", {
        method: "POST"
      })

      if (res2.ok) {
        router.push("/")
      } else {
        const data = await res2.json()
        console.error(data.error)
        setIsLoading(false)
      }
    } catch (error) {
      console.error(error)
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="flex w-full max-w-2xl space-y-8 justify-center">
        <Card className="w-full max-w-xl overflow-hidden shadow-xs">
          <CardHeader>
            <div className="flex justify-center gap-4">
              <CardTitle className="text-3xl">학급 대표자 확인</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="px-6 py-6">
            <div className="mb-4">
              <h3 className="text-sm text-muted-foreground">계정</h3>
              <div className="text-lg font-medium">{userEmail || "-"}</div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm text-muted-foreground">이름</h3>
              <div className="text-lg font-medium">{userName || "-"}</div>
            </div>

            <div className="mb-4">
              <h3 className="text-sm text-muted-foreground">학급</h3>
              <div className="text-lg font-bold">{userGrade}학년 {userClass}{section}반</div>
              {(userClass === 1 || userClass === 10) && (
                <div className="mt-3 flex gap-2">
                  <Button
                    variant={section === 'A' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSection('A')}
                  >
                    A반
                  </Button>
                  <Button
                    variant={section === 'B' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSection('B')}
                  >
                    B반
                  </Button>
                </div>
              )}
            </div>

            <p className="text-md text-muted-foreground">
              위 학급의 대표자이신가요? 한 번 확인한 이후에는 변경할 수 없습니다.
            </p>
          </CardContent>

          <CardFooter className="px-6 py-4 flex justify-end gap-3">
            <Button variant="ghost" onClick={() => signOut()}>취소</Button>
            <Button
              size="lg"
              onClick={handleConfirm}
              disabled={isLoading}
              className="px-6"
            >
              {isLoading ? "처리중..." : "맞아요"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </main>
  )
}
