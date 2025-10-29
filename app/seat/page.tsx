"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Download, Printer, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface Student {
  number: number
  name: string
}

export default function SeatPage() {
  const router = useRouter()
  const [seat, setSeat] = useState<(Student | null)[][]>([])
  const [rows, setRows] = useState(0)
  const [cols, setCols] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/seat", {
          method: "GET",
      })
      const json = await res.json()
      if (!res.ok) {
        console.error("Failed to fetch seat:", json.error)
        setLoading(false)
        return
      }
      setSeat(json.data)
      setRows(json.data.length)
      setCols(json.data[0]?.length)
      setLoading(false)
    }
    fetchData()
  }, [])

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

          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="w-4 h-4" />
              저장
            </Button>
            <Button variant="outline" className="gap-2">
              <Printer className="w-4 h-4" />
              인쇄
            </Button>
          </div>
        </div>

        {/* Seat View Card*/}
        <Card id="seat-view" className="border-2">
          <CardHeader className="text-center border-b">
            <CardTitle className="text-4xl font-bold">1학년 6반 자리 배치도</CardTitle>
            <p className="text-muted-foreground">
              2025. 10. 29.
            </p>
          </CardHeader>

          <CardContent className="pb-3">
            <div className="mb-8 text-center">
              <div className="inline-block px-12 py-3 bg-primary/10 border-2 border-primary rounded-lg">
                <p className="text-lg font-semibold text-primary">교탁</p>
              </div>
            </div>

            {/* Seat Grid */}
            {loading ? (
              <div className="flex justify-center">
                <div className="grid gap-4 grid-cols-8">
                  {Array.from({ length: 32 }).map((_, index) => (
                    <div
                      key={index}
                      className="w-32 h-20 rounded-lg border-2 border-muted bg-muted/20"
                    >
                      <div className="h-full flex flex-col items-center justify-center gap-2 p-2 ">
                        <Skeleton className="w-16 h-4 bg-muted-foreground/20 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
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
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
