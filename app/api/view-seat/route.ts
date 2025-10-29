import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { Student } from "@/types/settings"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function GET(req: Request) {
  try {
    const session: any = await getServerSession(authOptions as any)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userClassId = session.user.classId

    const { data, error } = await supabase
      .schema("next_auth")
      .from("classes")
      .select("grade, class, seat, date")
      .eq("id", userClassId)

    if (error) return NextResponse.json({ error: error }, { status: 400 })

    const seat = data[0].seat
    let reverseSeat: ((Student | null)[][] | null)
    if (seat) {
      reverseSeat = []
      for (let i=seat.length-1; i>=0; i--) {
        let newRow: (Student | null)[] = []
        for (let j=seat[0].length-1; j>=0; j--) {
          newRow.push(seat[i][j])
        }
        reverseSeat.push(newRow)
      }
    } else {
      reverseSeat = null
    }
    return NextResponse.json({ ok: true, grade: data[0].grade, class: data[0].class, seat: seat, reverseSeat: reverseSeat, date: data[0].date })
  } catch (err) {
    console.error("/api/settings error:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
