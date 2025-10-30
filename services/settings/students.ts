import { supabase } from "@/lib/db"
import { type Session } from "next-auth"
import { isEqual } from "lodash"

export async function getStudentsSettings(session: Session) {
  const userClassId = session.user.classId
  
  const { data, error } = await supabase
    .schema("next_auth")
    .from("classes")
    .select("students")
    .eq("id", userClassId)

  if (error) throw new Error(error.message)
  return { ok: true, students: data[0].students.data, changed: data[0].students.changed }
}

export async function writeStudentsSettings(session: Session, req: Request) {
  const userClassId = session.user.classId
  let body = await req.json()
  let changed = false
  
  const { data: data, error: e1 } = await supabase
    .schema("next_auth")
    .from("classes")
    .select("students")
    .eq("id", userClassId)
  if (e1) throw new Error(e1.message)

  const currentStudentsData = data[0].students.data
  if (!isEqual(body, currentStudentsData) || data[0].students.changed) {
    changed = true
  }

  const { error: e2 } = await supabase
    .schema("next_auth")
    .from("classes")
    .update({students: {
      data: body,
      changed: changed
    }})
    .eq("id", userClassId)
  if (e2) throw new Error(e2.message)

  return { ok: true }
}