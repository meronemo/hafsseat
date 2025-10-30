import { type Session } from "next-auth"
import { getServerSideSession } from "./session"
import { NextResponse } from "next/server"

export function apiHandler(handler: (session: Session, req: Request) => Promise<any>) {
  return async (req: Request) => {
    try {
      const session = await getServerSideSession()
      if (!session) throw { status: 401, message: "Unauthorized" }
      const result = await handler(session, req)
      return NextResponse.json(result, { status: 200 })
    } catch (err: any) {
      const status = err.status || 500
      const message = err.message || "Internal Server Error"
      console.error("API error:", err)
      return new Response(JSON.stringify({ error: message }), { status })
    }
  }
}