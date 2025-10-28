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

const randomize = async (settings: Settings, students: Student[], seat: Student[][] | null) => {
  const rows = settings.rows
  const cols = settings.columns
  const avoidSameSeat = settings.avoidSameSeat
  const avoidSamePartner = settings.avoidSamePartner
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
