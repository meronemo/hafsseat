"use client"

import { useState, useEffect, useRef, type ChangeEvent } from "react"
import { StudentsSettingsProps } from "@/app/settings/page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { Plus, Trash2, Loader2 } from "lucide-react"
import { Student } from "@/types/settings"

export function StudentsSettings({ students }: StudentsSettingsProps) {
  const [studentsState, setStudents] = useState<Student[]>([])
  const [newStudentNumber, setNewStudentNumber] = useState("")
  const [newStudentName, setNewStudentName] = useState("")
  const [validationError, setValidationError] = useState("")
  const [saveLoading, setSaveLoading] = useState(false)
  const numberInputRef = useRef<HTMLInputElement>(null)

  const addStudent = () => {
    if (!newStudentNumber || !newStudentName) return

    const studentNumber = parseInt(newStudentNumber)
    if (isNaN(studentNumber)) return

    if (studentNumber < 1 || studentNumber > 35) {
      setValidationError("번호는 1과 35 사이여야 합니다.")
      return
    }

    if (studentsState.some(s => s.number === studentNumber)) {
      setValidationError("이미 존재하는 번호입니다.")
      return
    }

    setValidationError("")

    const newStudent: Student = {
      number: studentNumber,
      name: newStudentName.trim()
    }

    setStudents([...studentsState, newStudent].sort((a, b) => a.number - b.number))
    setNewStudentNumber("")
    setNewStudentName("")
  }

  const deleteStudent = (number: number) => {
    setStudents(studentsState.filter(s => s.number !== number))
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addStudent()
      numberInputRef.current?.focus()
    }
  }

  const handleSave = async () => {
    setSaveLoading(true)

    const res = await fetch("/api/settings/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentsState.map(s => ({
        number: s.number,
        name: s.name
      }))),
    })
    setSaveLoading(false)
    if (res.ok) {
      toast.success("학생 정보가 저장되었습니다.")
    } else {
      const data = await res.json()
      console.log(data.error)
    }

    return
  }

  useEffect(() => {
    setStudents(students)
  }, [])

  return (
    <div className="space-y-4">
      {/* Add Student Form */}
      <div className="bg-muted/30 rounded-lg p-4 space-y-3">
        <h3 className="text-sm font-semibold">학생 추가</h3>
        <div className="flex gap-2">
          <Input
            ref={numberInputRef}
            type="number"
            placeholder="번호"
            value={newStudentNumber}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewStudentNumber(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-18 shadow-xs"
            min="1"
            max="35"
          />
          <Input
            type="text"
            placeholder="이름"
            value={newStudentName}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setNewStudentName(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 shadow-xs"
          />
          <Button
            onClick={addStudent}
            size="sm"
            className="rounded-full px-4 w-24"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            추가
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">{validationError}</p>
      </div>

      {/* Students List */}
      <div className="space-y-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold">학생 목록 ({studentsState.length}명)</h3>
          </div>
          
          {studentsState.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p className="text-sm">등록된 학생이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-2">
              {studentsState.map((student) => (
                <div
                  key={student.number}
                  className="flex items-center justify-between bg-muted/30 rounded-lg px-4 py-3 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                      {student.number}
                    </div>
                    <span className="font-medium">{student.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteStudent(student.number)}
                    className="rounded-full text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
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