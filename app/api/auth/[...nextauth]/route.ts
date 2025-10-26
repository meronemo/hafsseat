import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { SupabaseAdapter } from "@next-auth/supabase-adapter"

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
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };