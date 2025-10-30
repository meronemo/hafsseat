import { supabase } from "@/lib/db"
import { type Session } from "next-auth"

export async function getGeneralSettings(session: Session) {
  const userClassId = session.user.classId

  const { data, error } = await supabase
    .schema("next_auth")
    .from("classes")
    .select("settings")
    .eq("id", userClassId)

  if (error) throw new Error(error.message)
  return { ok: true, settings: data[0].settings }
}

export async function writeGeneralSettings(session: Session, req: Request) {
   let body = await req.json()
  body.changed = false
  const userClassId = session.user.classId

  const { data, error: e1 } = await supabase
    .schema("next_auth")
    .from("classes")
    .select("settings")
    .eq("id", userClassId)
  if (e1) throw new Error(e1.message)

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
  if (e2) throw new Error(e2.message)
  
  return { ok: true }
}