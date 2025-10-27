import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// called from /confirm-representative to initialize class settings data when first login
export async function POST(req: Request) {
  try {
    const session: any = await getServerSession(authOptions as any)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userClassId = session.user.classId

    const defaultData = {
      rows: 8,
      columns: 4,
      avoidSameSeat: true,
      avoidSamePartner: true,
      avoidBackRow: true,
    }

    const { error } = await supabase
      .schema("next_auth")
      .from("classes")
      .update({settings: defaultData})
      .eq("id", userClassId)

    if (error) return NextResponse.json({ error: error }, { status: 400 })
    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error("/api/settings error:", err)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
