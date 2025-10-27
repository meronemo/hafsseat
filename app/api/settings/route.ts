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

    const userGrade = session.user?.grade
    const userClass = session.user?.class

    const { data, error: error } = await supabase
      .schema("next_auth")
      .from("classes")
      .select("settings")
      .eq("grade", userGrade)
      .eq("class", userClass)
    
    if (!data) return NextResponse.json({ error: "Cannot fetch class id" }, { status: 400 })

    if (error) return NextResponse.json({ error: error }, { status: 400 })
    return NextResponse.json({ ok: true, settings: data[0].settings })
  } catch (err) {
    console.error("/api/settings error:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions as any)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const userClassId = session.user.classId

    const { error } = await supabase
      .schema("next_auth")
      .from("classes")
      .update({settings: body})
      .eq("id", userClassId)

    if (error) return NextResponse.json({ error: error }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("/api/settings error:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
