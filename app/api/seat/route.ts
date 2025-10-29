import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

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
    console.log(data)
    return NextResponse.json({ ok: true, grade: data[0].grade, class: data[0].class, seat: data[0].seat, date: data[0].date })
  } catch (err) {
    console.error("/api/settings error:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
