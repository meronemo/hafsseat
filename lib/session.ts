import { authOptions } from "@/lib/auth"
import { type Session } from "next-auth"
import { getServerSession } from "next-auth/next"

export async function getServerSideSession(): Promise<Session | null> {
  const session = await getServerSession(authOptions)
  return session
}