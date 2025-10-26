"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card"

export default function ConfirmRepresentativePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  if (!session?.user) {
    router.push("/");
    return;
  }

  const userEmail = session.user.email || "";
  const userName = session.user.name || "";
  const userStudentId = userName.replace(/\D+/g, '');
  const userGrade = Number(userStudentId[0]);
  const userClass = Number(userStudentId.slice(1,3));

  const handleCancel = async () => {
    signOut();
    router.push("/");
  }

  const handleConfirm = async () => {
    setIsLoading(true);

    const res = await fetch("/api/confirm-representative", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        "grade": userGrade,
        "class": userClass
      }),
    });

    if (res.ok) {
      router.push("/");
    } else {
      const data = await res.json();
      console.log(data.error);
      setIsLoading(false);
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
              <div className="text-lg font-bold">{userGrade}학년 {userClass}반</div>
            </div>

            <p className="text-md text-muted-foreground">위 학급의 대표자이신가요? 한 번 확인한 이후에는 변경할 수 없습니다.</p>
          </CardContent>

          <CardFooter className="px-6 py-4 flex justify-end gap-3">
            <Button variant="ghost" onClick={handleCancel}>취소</Button>
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
