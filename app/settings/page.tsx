"use client"

import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, Info } from "lucide-react"
import { GeneralSettings } from "./general"
import { StudentsSettings } from "./students"

export default function Settings() {
  const { data: session, status } = useSession()
  const user = session?.user as any
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("general")

  useEffect(() => {
    if (status !== "loading" && !session) {
      router.push("/")
    }
  }, [session, status, router])

  if (status === "loading") {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </main>
    )
  }

  if (!session) {
    return null
  }

  const grade = user?.grade ?? null
  const cls = user?.class ?? null
  const displayClass = grade && cls ? `${grade}학년 ${cls}반` : "학급 정보 없음"

  const tabs = [
    { id: "general", label: "일반", icon: Info },
    { id: "students", label: "학생", icon: User },
  ]

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-xl">
        <Card className="shadow-xs">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/")}
                className="rounded-full -ml-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <CardTitle className="text-2xl">학급 설정</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* User Info Section */}
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-semibold">
                  {user.username ? user.username[0] : <User className="w-6 h-6" />}
                </div>
                <div>
                  <div className="text-base font-medium">{user?.name}</div>
                  <div className="text-sm text-muted-foreground">{user?.email}</div>
                </div>
              </div>
              <div className="border-t border-border/50 pt-3">
                <div className="text-sm text-muted-foreground mb-1">학급</div>
                <div className="font-semibold">{displayClass}</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-border">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors relative ${
                      activeTab === tab.id
                        ? "text-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Tab Content */}
            <div className="py-4">
              {activeTab === "general" && (
                <GeneralSettings />
              )}
              
              {activeTab === "students" && (
                <StudentsSettings />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
