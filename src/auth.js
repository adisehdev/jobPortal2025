import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import connectDB from "./lib/dbConnection";
import User from "./lib/models/userModel";
import bcryptjs from "bcryptjs";

// Determine if the environment is production
const isProduction = process.env.NODE_ENV === "production";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: { email: {}, password: {}, role: {} },
      async authorize({ email, password, role }) {
        try {
          await connectDB();
          const user = await User.findOne({ email, role }).select("+password");
          if (!user) return null;

          const isPasswordValid = await bcryptjs.compare(password, user.password);
          if (!isPasswordValid) return null;

          return { id: user._id, email: user.email, role: user.role };
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  
  // ✅ Explicitly configure cookie settings
  useSecureCookies: isProduction, // Use secure cookies in production
  cookies: {
    sessionToken: {
      // Use a secure prefix in production, but not in development
      name: `${isProduction ? "__Secure-" : ""}authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        // The 'secure' property is essential for __Secure- cookies
        secure: isProduction,
      },
    },
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
});