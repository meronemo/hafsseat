import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const isProd = process.env.NODE_ENV === "production"

export const authOptions = {
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
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };