// next-auth.d.ts
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null // account name
      username?: string | null // name without student id
      email?: string | null
      grade?: number | null
      class?: string | null
    }
  }
}