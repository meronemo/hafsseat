import { apiHandler } from "@/lib/apiHandler"
import { initSettings } from "@/services/settings/init"

// called from /confirm-representative to initialize class settings data when first login
export const POST = apiHandler(async (session) => {
  return await initSettings(session)
})
