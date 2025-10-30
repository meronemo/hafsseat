"use client"

import { useState } from "react"
import { Student } from "@/types/settings"
import { GeneralSettings } from "@/components/Settings/GeneralSettings"
import { StudentsSettings } from "@/components/Settings/StudentsSettings"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { ArrowLeft, User, Info } from "lucide-react"

interface SettingsProps {
  user: {
    email: string
    name: string
    grade: number
    class: string
  }
  generalSettings: {
    rows: number
    columns: number
    avoidSameSeat: boolean
    avoidSamePartner: boolean
    avoidBackRow: boolean
  }
  students: Student[]
}

export default function Settings({ user, generalSettings, students }: SettingsProps) {
  const [activeTab, setActiveTab] = useState("general")
  const router = useRouter()
  const displayClass = user.grade && user.class ? `${user.grade}학년 ${user.class}반` : "학급 정보 없음"

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
                  {user.name ? user.name[0] : <User className="w-6 h-6" />}
                </div>
                <div>
                  <div className="text-base font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground">{user.email}</div>
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
                <GeneralSettings 
                  rows={generalSettings.rows}
                  columns={generalSettings.columns}
                  avoidSameSeat={generalSettings.avoidSameSeat}
                  avoidSamePartner={generalSettings.avoidSamePartner}
                  avoidBackRow={generalSettings.avoidBackRow}
                />
              )}
              
              {activeTab === "students" && (
                <StudentsSettings 
                  students={students}
                />
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
