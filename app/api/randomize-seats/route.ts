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

const randomize = async (settings: Settings, students: Student[]) => {
  const rows = settings.rows
  const cols = settings.columns
  let seats: (Student | null)[][] = []

  let nums = []
  for (let i=1; i<=students.length; i++) {
    nums.push(i)
  }
  nums = shuffle(nums)

  let idx = 0
  for (let r=0; r<rows; r++) {
    let row: (Student | null)[] = []
    for (let c=0; c<cols; c++) {
      row.push(students.find(s => s.number === nums[idx]) ?? null)
      idx++
    }
    seats.push(row)
  }

  return seats
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
      .select("settings, students")
      .eq("id", classId)

    if (!data) return NextResponse.json({ error: "Class settings, students data is null" }, { status: 400 })
    if (e1) return NextResponse.json({ error: e1 }, { status: 400 })
    
    const seat = await randomize(data[0].settings, data[0].students)
    
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
