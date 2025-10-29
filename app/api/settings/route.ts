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

    let body = await req.json()
    body.changed = false
    const userClassId = session.user.classId

    const { data, error: e1 } = await supabase
      .schema("next_auth")
      .from("classes")
      .select("settings")
      .eq("id", userClassId)
    if (e1) return NextResponse.json({ error: e1 }, { status: 400 })
    
    // set changed=true if rows or columns is changed
    const currentSettings = data[0].settings
    if (body.rows !== currentSettings.rows || body.columns !== currentSettings.columns || currentSettings.changed) {
      body.changed = true
    }

    const { error: e2 } = await supabase
      .schema("next_auth")
      .from("classes")
      .update({settings: body})
      .eq("id", userClassId)

    if (e2) return NextResponse.json({ error: e2 }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("/api/settings error:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
