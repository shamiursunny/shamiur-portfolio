import { NextAuthOptions } from "next-auth"
import { db } from "@/lib/db"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    {
      id: "credentials",
      name: "credentials",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        console.log("Auth attempt:", credentials?.email)
        
        if (!credentials?.email || !credentials?.password) {
          console.log("Missing credentials")
          return null
        }

        try {
          // Find user in database
          const user = await db.user.findUnique({
            where: {
              email: credentials.email
            }
          })

          console.log("User found:", !!user)

          if (!user || !user.password) {
            console.log("No user or password")
            return null
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          console.log("Password valid:", isPasswordValid)

          if (!isPasswordValid) {
            return null
          }

          console.log("Authentication successful for:", user.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
          }
        } catch (error) {
          console.error("Auth error:", error)
          return null
        }
      }
    }
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  // Disable CSRF in development
  ...(process.env.NODE_ENV === "development" && {
    events: {
      async signIn(message) {
        console.log("Sign in event:", message)
      },
      async signOut(message) {
        console.log("Sign out event:", message)
      }
    }
  }),
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        (session.user as any).id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
    async redirect({ url, baseUrl }) {
      // Redirect to static dashboard after login
      return baseUrl + "/static-dashboard"
    },
  },
}