import { apiHandler } from "@/lib/apiHandler"
import { randomizeSeat } from "@/services/randomize-seat"

export const POST = apiHandler(async (session) => {
  return await randomizeSeat(session)
})
