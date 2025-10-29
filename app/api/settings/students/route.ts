import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { isEqual } from  "lodash"

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
      .select("students")
      .eq("id", userClassId)

    if (error) return NextResponse.json({ error: error }, { status: 400 })
    return NextResponse.json({ ok: true, students: data[0].students.data })
  } catch (err) {
    console.error("/api/settings/students error:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions as any)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    let body = await req.json()
    let changed = false
    const userClassId = session.user.classId

    const { data: data, error: e1 } = await supabase
      .schema("next_auth")
      .from("classes")
      .select("students")
      .eq("id", userClassId)
    if (e1) return NextResponse.json({ error: e1 }, { status: 400 })
    
    // set changed=true if students data is changed
    const currentStudentsData = data[0].students.data
    console.log(body, currentStudentsData, isEqual(body, currentStudentsData))
    if (!isEqual(body, currentStudentsData) || data[0].students.changed) {
      changed = true
    }

    const { error } = await supabase
      .schema("next_auth")
      .from("classes")
      .update({students: {
        data: body,
        changed: changed
      }})
      .eq("id", userClassId)

    if (error) return NextResponse.json({ error: error }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("/api/settings/students error:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
