import { apiHandler } from "@/lib/apiHandler"
import { viewSeat } from "@/services/view-seat"

export const GET = apiHandler(async (session) => {
  return await viewSeat(session)
})
