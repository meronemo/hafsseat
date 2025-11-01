"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, Printer, ArrowLeft } from "lucide-react"
import { useRouter } from "@bprogress/next/app"
import { Student } from "@/types/settings"

interface TeacherDeskProps {
  viewMode?: "student" | "teacher"
}

function TeacherDesk({ viewMode }: TeacherDeskProps) {
  return (
    <div className={`${viewMode === "student" ? "mb-10" : "mt-10"} text-center`}>
      <div className="inline-block px-12 py-3 bg-primary/10 border-2 border-primary rounded-lg">
        <p className="text-lg font-semibold text-primary">교탁</p>
      </div>
    </div>
  )
}

interface SeatGridProps {
  seat: (Student | null)[][]
  cols: number
}

function SeatGrid({ seat, cols }: SeatGridProps) {
  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-4">
        {seat.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((student, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`
                  relative w-32 h-20 rounded-lg border-2 
                  flex flex-col items-center justify-center
                  transition-all print:break-inside-avoid 
                  ${
                    student
                      ? "bg-card border-primary/30"
                      : "bg-muted/20 border-dashed border-muted-foreground/20"
                  }
                  ${colIndex % 2 === 1 && colIndex < cols - 1 ? "mr-8" : "mr-2"}
                `}
              >
              {student ? (
                <>
                  <div className="absolute top-2 left-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                    {student.number}
                  </div>

                  <p className="text-lg font-semibold text-center px-2">
                    {student.name}
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">빈자리</p>
              )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

interface SeatPageProps {
  seat: (Student | null)[][]
  reverseSeat: (Student | null)[][]
  grade: number
  cls: string
  date: string
  cols: number
}

export default function SeatPage({
  seat,
  reverseSeat,
  grade,
  cls,
  date,
  cols
}: SeatPageProps) {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<"student" | "teacher">("student")

  return (
    <div className=" bg-background p-8">
      <div className="min-h-screen max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/")}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로가기
          </Button>

          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4">
            {/* Tabs */}
            <div className="flex gap-1 bg-muted p-1 rounded-lg">
              <Button
                variant={viewMode === "student" ? "default" : "ghost"}
                onClick={() => setViewMode("student")}
                size="sm"
              >
                학생용
              </Button>
              <Button
                variant={viewMode === "teacher" ? "default" : "ghost"}
                onClick={() => setViewMode("teacher")}
                size="sm"
              >
                교사용
              </Button>
            </div>

            <div className="flex gap-2 pl-4 border-l-2 border-muted-foreground/20">
              <Button 
                variant="outline" 
                size="sm"
                className="gap-2 hover:bg-primary/10"
              >
                <Download className="w-4 h-4" />
                저장
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="gap-2 hover:bg-primary/10"
              >
                <Printer className="w-4 h-4" />
                인쇄
              </Button>
            </div>
          </div>

          <div className="w-24"></div>
        </div>

        {/* Seat View Card*/}
        <Card id="seat-view" className="border-2">
          <CardHeader className="text-center border-b pb-0">
            <CardTitle className="text-4xl font-bold">{grade}학년 {cls}반 자리 배치도</CardTitle>
            <p className="text-muted-foreground">
              {date}
            </p>
          </CardHeader>
          
          {viewMode === "student" ? (
            <CardContent className="pb-3">
              <TeacherDesk viewMode={viewMode}/>
              <SeatGrid seat={seat} cols={cols} />
            </CardContent>
          ) : (
            <CardContent className="pb-3">
              <SeatGrid seat={reverseSeat} cols={cols} />
              <TeacherDesk viewMode={viewMode}/>  
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
