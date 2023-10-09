import NextAuth, { AuthOptions, Awaitable, RequestInternal, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/db";
import * as argon2 from "argon2";

export const authOptions: AuthOptions = {
    // Configure one or more authentication providers
    session: {
      strategy: 'jwt'
    },
    providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
              email: { label: "Email", type: "text", placeholder: "jsmith" },
              password: { label: "Password", type: "password" }
          },
          authorize: async function (credentials: Record<"email" | "password", string> | undefined, req: Pick<RequestInternal, "query" | "body" | "headers" | "method">): Awaitable<User | null> {
              const user = await prisma.user.findUnique({
                where:{
                    email: credentials?.email
                },
              })
              if(!user){
                return null
              }
              const isValidPassword = await argon2.verify(user.password,credentials.password)
              if(!isValidPassword){
                return null
              }
              delete user.password
              return user
          },
      }),
    ],
    pages: {
      signIn: "/auth",
      error: "/auth"
    },
    callbacks: {
      async session({session, token, user}) {
        // console.log("from session")
        // console.log(session, token, user)
        session.user.id = token.sub
        return session
      },
      async jwt({ token, user}) {
        // console.log("user",user)
        // console.log("token", token)
        return token
      }
    }
  }
  

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };