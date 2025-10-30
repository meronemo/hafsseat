import { apiHandler } from "@/lib/apiHandler"
import { getStudentsSettings, writeStudentsSettings } from "@/services/settings/students"

export const GET = apiHandler(async (session) => {
  return await getStudentsSettings(session)
})

export const POST = apiHandler(async (session, req) => {
  return await writeStudentsSettings(session, req)
})
