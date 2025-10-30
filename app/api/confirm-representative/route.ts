import { apiHandler } from "@/lib/apiHandler"
import { confirmRepresentative } from "@/services/confirm-representative"

export const POST = apiHandler(async (session, req) => {
  return await confirmRepresentative(session, req)
})
