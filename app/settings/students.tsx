"use client"

import { useState, useRef, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Loader2 } from "lucide-react"

interface Student {
  number: number
  name: string
}

export function StudentsSettings() {
  const [students, setStudents] = useState<Student[]>([])
  const [newStudentNumber, setNewStudentNumber] = useState("")
  const [newStudentName, setNewStudentName] = useState("")
  const [validationError, setValidationError] = useState("")
  const [loading, setLoading] = useState(false)
  const numberInputRef = useRef<HTMLInputElement>(null)

  const addStudent = () => {
    if (!newStudentNumber || !newStudentName) return

    const studentNumber = parseInt(newStudentNumber)
    if (isNaN(studentNumber)) return

    if (studentNumber < 1 || studentNumber > 35) {
      setValidationError("번호는 1과 35 사이여야 합니다.")
      return
    }

    if (students.some(s => s.number === studentNumber)) {
      setValidationError("이미 존재하는 번호입니다.")
      return
    }

    setValidationError("")

    const newStudent: Student = {
      number: studentNumber,
      name: newStudentName.trim()
    }

    setStudents([...students, newStudent].sort((a, b) => a.number - b.number))
    setNewStudentNumber("")
    setNewStudentName("")
  }

  const deleteStudent = (number: number) => {
    setStudents(students.filter(s => s.number !== number))
  }

  const getStudentByNumber = (number: number): Student | undefined => {
    return students.find(s => s.number === number)
  }

  const getAllStudentNames = (): string[] => {
    return students.map(s => s.name)
  }

  const getAllStudentNumbers = (): number[] => {
    return students.map(s => s.number)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addStudent()
      numberInputRef.current?.focus()
    }
  }

  const handleSave = () => {
    setLoading(true)
    return
  }

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
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">학생 목록 ({students.length}명)</h3>
        </div>
        
        {students.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">등록된 학생이 없습니다</p>
          </div>
        ) : (
          <div className="space-y-2">
            {students.map((student) => (
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
          disabled={loading}
          className="px-6"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "저장"}
        </Button>
      </div>
    </div>
  )
}