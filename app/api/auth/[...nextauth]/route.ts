// @ts-nocheck
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { SupabaseAdapter } from "@next-auth/supabase-adapter"
import { createClient } from "@supabase/supabase-js"

const supabaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

const isProd = process.env.NODE_ENV === "production"

export const authOptions = {
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
    async session({ session, token, user }) {
      try {
        if (session?.user?.name) {
          try {
            session.user.username = String(session.user.name).replace(/\d+/g, "").trim()
          } catch (e) {
            session.user.username = session.user.name
          }
        }

        if (session?.user?.email) {
          const { data, error } = await supabaseAdmin
            .schema("next_auth")
            .from("users")
            .select("classId, grade, class")
            .eq("email", session.user.email)
            .single()
          
          if (!error && data) {
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

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }