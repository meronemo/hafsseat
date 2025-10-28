import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Settings } from "@/types/settings"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface Student {
  name: string
  number: number
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

const makeNewSeat = async (
  settings: Settings,
  students: Student[],
  seat: (Student | null)[][] | null
) => {
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

  if (!seat || !avoidBackRow) { // if no past seat exists or no avoidBackRow rule
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

const validateNewSeat = (
  settings: Settings,
  oldSeat: (Student | null)[][] | null,
  newSeat: (Student | null)[][]
): boolean => {
  if (oldSeat === null) return true

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

const randomize = async (
  settings: Settings,
  students: Student[],
  seat: (Student | null)[][] | null
) => {
  let newSeat: (Student | null)[][] = []
  let attempts = 0
  const maxAttempts = 1000

  do {
    newSeat = await makeNewSeat(settings, students, seat)
    attempts++
    if (attempts >= maxAttempts) {
      console.warn(`Failed to generate valid seat after ${maxAttempts} attempts`)
      break
    }
  } while (!validateNewSeat(settings, seat, newSeat))
    
  console.log(attempts)
  return newSeat
}

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions as any)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const classId = session.user.classId
    const { data, error: e1 } = await supabase
      .schema("next_auth")
      .from("classes")
      .select("settings, students, seat")
      .eq("id", classId)

    if (!data) return NextResponse.json({ error: "Class settings, students data is null" }, { status: 400 })
    if (e1) return NextResponse.json({ error: e1 }, { status: 400 })
    
    const seat = await randomize(data[0].settings, data[0].students, data[0].seat)
    console.log(seat)
    
    const { error } = await supabase
      .schema("next_auth")
      .from("classes")
      .update({ seat })
      .eq("id", classId)
    
    if (error) return NextResponse.json({ error: error }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("/api/randomize-seats error:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
