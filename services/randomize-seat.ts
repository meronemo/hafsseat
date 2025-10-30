import { supabase } from "@/lib/db"
import { PostgrestError } from "@supabase/supabase-js"
import { type Session } from "next-auth"
import { Settings, Student } from "@/types/settings"

function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

async function makeNewSeat(
  settings: Settings,
  students: Student[],
  seat: (Student | null)[][] | null,
  applyRules: boolean
) {
  const rows = settings.rows
  const cols = settings.columns
  const avoidBackRow = settings.avoidBackRow

  let newSeat: (Student | null)[][] = Array.from({ length: rows }, () =>
    Array(cols).fill(null)
  )

  let seatPool: [number, number][] = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      seatPool.push([r, c]);
    }
  }
  seatPool = shuffle(seatPool)
  
  if (!seat || !applyRules || !avoidBackRow) { // if applyRules is false or no avoidBackRow rule
    for (let i=0; i<students.length; i++) { 
      let newRow = seatPool[i][0]
      let newCol = seatPool[i][1]
      newSeat[newRow][newCol] = students[i]
    }
  } else { // avoidBackRow rule applied
    for (let r=rows-1; r>=0; r--) {
      for (let c=0; c<cols; c++) {
        let newRow = 0
        let newCol = 0
        let idx = 0
        if (avoidBackRow && r === rows-1) {
          while (seatPool[idx][0] === rows-1) {
            idx++
          }
        }
        newRow = seatPool[idx][0]
        newCol = seatPool[idx][1]
        newSeat[newRow][newCol] = seat[r][c]
        seatPool.splice(idx, 1)
      }
    }
  }

  return newSeat
}

function validateNewSeat(
  settings: Settings,
  oldSeat: (Student | null)[][] | null,
  newSeat: (Student | null)[][],
  applyRules: boolean
): boolean {
  if (oldSeat === null || !applyRules) return true

  const rows = settings.rows
  const cols = settings.columns
  const avoidSameSeat = settings.avoidSameSeat
  const avoidSamePartner = settings.avoidSamePartner

  // Check avoidSameSeat rule
  if (avoidSameSeat) {
    for (let r=0; r<rows; r++) {
      for (let c=0; c<cols; c++) {
        if (oldSeat[r][c] && newSeat[r][c]) {
          if (oldSeat[r][c]?.number === newSeat[r][c]?.number) {
            return false
          }
        }
      }
    }
  }

  // Check avoidSamePartner rule
  if (avoidSamePartner) {
    const oldPairs: Set<string> = new Set()
    for (let r=0; r<rows; r++) {
      for (let c=0; c<cols-1; c+=2) {
        const student1 = oldSeat[r][c]
        const student2 = oldSeat[r][c+1]
        if (student1 && student2) {
          const pair = [student1.number, student2.number].sort((a, b) => a - b).join('-')
          oldPairs.add(pair)
        }
      }
    }

    // Check if any new partner pairs match old pairs
    for (let r=0; r<rows; r++) {
      for (let c=0; c<cols-1; c+=2) {
        const student1 = newSeat[r][c]
        const student2 = newSeat[r][c+1]
        if (student1 && student2) {
          const pair = [student1.number, student2.number].sort((a, b) => a - b).join('-')
          if (oldPairs.has(pair)) {
            return false
          }
        }
      }
    }
  }

  return true
}

async function randomize(
  settings: Settings,
  students: Student[],
  seat: (Student | null)[][] | null,
  applyRules: boolean
) {
  let newSeat: (Student | null)[][] = []
  let attempts = 0
  const maxAttempts = 1000

  do {
    newSeat = await makeNewSeat(settings, students, seat, applyRules)
    attempts++
    if (attempts >= maxAttempts) {
      console.warn(`Failed to generate valid seat after ${maxAttempts} attempts`)
      break
    }
  } while (!validateNewSeat(settings, seat, newSeat, applyRules))
    
  return newSeat
}

export async function randomizeSeat(session: Session) {
  const classId = session.user.classId
  const { data, error: e1 } = await supabase
    .schema("next_auth")
    .from("classes")
    .select("settings, students, seat")
    .eq("id", classId)
  if (!data) throw new Error("Class settings, students data is null")
  if (e1) throw new Error((e1 as PostgrestError).message)
  
  const settings = data[0].settings
  const students = data[0].students.data
  const studentsChanged = data[0].students.changed
  const seat = data[0].seat

  const applyRules = !(!seat || settings.changed || studentsChanged) // true if current seat is not blank or setting is not changed or students is not changed
  const newSeat = await randomize(settings, students, seat, applyRules)
  
  const now = new Date()
  const dateString = `${now.getFullYear()}. ${now.getMonth() + 1}. ${now.getDate()}.`
  
  // reset changed flags
  const updatedSettings = { ...data[0].settings, changed: false }
  const updatedStudents = { ...data[0].students, changed: false }
  
  const { error: e2 } = await supabase
    .schema("next_auth")
    .from("classes")
    .update({ 
      seat: newSeat, 
      date: dateString,
      settings: updatedSettings,
      students: updatedStudents
    })
    .eq("id", classId)
  if (e2) throw new Error(e2.message)

  return { ok: true }
}