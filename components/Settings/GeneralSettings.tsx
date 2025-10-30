"use client"

import { useState, useEffect } from "react"
import { GeneralSettingsProps } from "@/app/settings/page"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function GeneralSettings({
  rows,
  columns,
  avoidSameSeat,
  avoidSamePartner,
  avoidBackRow
}: GeneralSettingsProps) {
  const [rowsState, setRows] = useState(8)
  const [columnsState, setColumns] = useState(4)
  const [avoidSameSeatState, setAvoidSameSeat] = useState(true)
  const [avoidSamePartnerState, setAvoidSamePartner] = useState(true)
  const [avoidBackRowState, setAvoidBackRow] = useState(true) 
  const [saveLoading, setSaveLoading] = useState(false)

  const handleSave = async () => {
    setSaveLoading(true)
    const res = await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rows: rowsState,
        columns: columnsState,
        avoidSameSeat: avoidSameSeatState,
        avoidSamePartner: avoidSamePartnerState,
        avoidBackRow: avoidBackRowState
      }),
    })
    setSaveLoading(false)

    if (res.ok) {
      toast.success("설정이 저장되었습니다.")
    } else {
      const data = await res.json()
      console.log(data.error)
    }
  }

  useEffect(() => {
    setRows(rows)
    setColumns(columns)
    setAvoidSameSeat(avoidSameSeat)
    setAvoidSamePartner(avoidSamePartner)
    setAvoidBackRow(avoidBackRow)
  }, [])

  return (
    <div>
      <div className="space-y-6">
        <div className="space-y-3">
          <div>
            <h3 className="font-medium mb-1">자리 배치</h3>
            <p className="text-sm text-muted-foreground">교실의 자리 구조를 설정합니다.</p>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <label htmlFor="rows" className="text-sm text-muted-foreground whitespace-nowrap">
                행 (세로)
              </label>
              <Input
                id="rows"
                type="number"
                defaultValue={rows}
                onChange={(e) => setRows(Number(e.target.value))}
                className="w-14"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="cols" className="text-sm text-muted-foreground whitespace-nowrap">
                열 (가로)
              </label>
              <Input
                id="cols"
                type="number"
                defaultValue={columns}
                onChange={(e) => setColumns(Number(e.target.value))}
                className="w-14"
              />
            </div>
          </div>
        </div>
  
        <div className="border-t pt-6 space-y-4">
          <div>
            <h3 className="font-medium mb-1">자리 배치 규칙</h3>
            <p className="text-sm text-muted-foreground">자리 배치 시 적용할 규칙을 선택합니다.</p>
          </div>
  
          <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
            <div className="space-y-0.5">
              <label htmlFor="avoid-same-seat" className="font-medium cursor-pointer">
                같은 자리 방지
              </label>
              <p className="text-sm text-muted-foreground">
                이전에 앉았던 자리에 다시 앉지 않도록 합니다.
              </p>
            </div>
            <Switch id="avoid-same-seat" checked={avoidSameSeatState} onCheckedChange={setAvoidSameSeat} />
          </div>
  
          <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
            <div className="space-y-0.5">
              <label htmlFor="avoid-same-partner" className="font-medium cursor-pointer">
                같은 짝 방지
              </label>
              <p className="text-sm text-muted-foreground">
                이전에 짝이었던 학생과 다시 짝이 되지 않도록 합니다.
              </p>
            </div>
            <Switch id="avoid-same-partner" checked={avoidSamePartnerState} onCheckedChange={setAvoidSamePartner} />
          </div>
  
          <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors">
            <div className="space-y-0.5">
              <label htmlFor="avoid-back-row" className="font-medium cursor-pointer">
                맨 뒤 자리 중복 방지
              </label>
              <p className="text-sm text-muted-foreground">
                이전에 맨 뒤에 앉았던 학생이 다시 맨 뒤에 앉지 않도록 합니다.
              </p>
            </div>
            <Switch id="avoid-back-row" checked={avoidBackRowState} onCheckedChange={setAvoidBackRow} />
          </div>
        </div>

        <div className="space-y-2">
          <Button
            size="lg"
            onClick={handleSave}
            disabled={saveLoading}
            className="px-6"
          >
            {saveLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "저장"}
          </Button>
        </div>
      </div>
    </div>
  )
}