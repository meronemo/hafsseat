import { getServerSession } from "next-auth/next"
import { authOptions } from "../auth/[...nextauth]/route"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions as any)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const userEmail = session.user.email
    const userGrade = Number(body?.grade)
    const userClass = body?.class

    const { data, error: e1 } = await supabase
      .schema("next_auth")
      .from("classes")
      .select("id")
      .eq("grade", userGrade)
      .eq("class", userClass)
    
    if (!data) return NextResponse.json({ error: "Cannot fetch class id" }, { status: 400 })

    const { error: e2 } = await supabase
      .schema("next_auth")
      .from("users")
      .update({ classId: data[0].id, grade: userGrade, class: userClass })
      .eq("email", userEmail)
      .single()

    if (e1 || e2) return NextResponse.json({ error: e1 || e2 }, { status: 400 })
    return NextResponse.json({ ok: true, classId: data[0].id })
  } catch (err) {
    console.error("/api/confirm-representative error:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
