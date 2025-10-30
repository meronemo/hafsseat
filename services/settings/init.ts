import { supabase } from "@/lib/db"
import { type Session } from "next-auth"
import { defaultSettings, defaultStudents } from "@/types/settings"

export async function initSettings(session: Session) {
  const userClassId = session.user.classId
  
  const { error } = await supabase
    .schema("next_auth")
    .from("classes")
    .update({settings: defaultSettings, students: defaultStudents})
    .eq("id", userClassId)

  if (error) throw new Error(error.message)
  return { ok: true }
}