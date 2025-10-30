import type { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { SupabaseAdapter } from "@next-auth/supabase-adapter"
import { supabase } from "@/lib/db"

const isProd = process.env.NODE_ENV === "production"

export const authOptions: NextAuthOptions = {
  adapter: SupabaseAdapter({
    url: process.env.SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "select_account",
          ...(isProd ? { hd: "hafs.hs.kr" } : {}),
        },
      },
    }),
  ],
  logger: {
    error(code: string, metadata?: unknown) { console.error(code, metadata) }
  },
  callbacks: {
    async session({ session }) {
      try {
        if (session?.user?.email) {
          const { data, error } = await supabase
            .schema("next_auth")
            .from("users")
            .select("classId, grade, class, name")
            .eq("email", session.user.email)
            .single()
          
          if (!error && data) {
            session.user.name = data.name
            session.user.username = String(session.user.name).replace(/\d+/g, '')
            session.user.studentId = String(String(session.user.name).match(/\d+/g))
            session.user.classId = data.classId
            session.user.grade = data.grade
            session.user.class = data.class
          }
        }
      } catch (e) {
        console.error("session callback error:", e)
      }
      return session
    }
  }
}