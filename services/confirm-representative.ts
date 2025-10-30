import { supabase } from "@/lib/db"
import { type Session } from "next-auth"

export async function confirmRepresentative(session: Session, req: Request) {
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
  if (e1) throw new Error(e1.message)
  
  const { error: e2 } = await supabase
    .schema("next_auth")
    .from("users")
    .update({ classId: data[0].id, grade: userGrade, class: userClass })
    .eq("email", userEmail)
    .single()
  if (e2) throw new Error(e2.message)

  return { ok: true, classId: data[0].id }
}