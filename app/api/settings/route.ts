import { apiHandler } from "@/lib/apiHandler"
import { getGeneralSettings, writeGeneralSettings } from "@/services/settings/general"

export const GET = apiHandler(async (session) => {
  return await getGeneralSettings(session)
})

export const POST = apiHandler(async (session, req) => {
  return await writeGeneralSettings(session, req)
})
