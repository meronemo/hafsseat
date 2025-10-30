// next-auth.d.ts
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null // account name
      username?: string | null // name without student id
      studentId?: string | null
      email?: string | null
      classId?: string | null
      grade?: number | null
      class?: string | null
    }
  }
}