import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import connectDB from "./lib/dbConnection";
import User from "./lib/models/userModel";
import bcryptjs from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
        role: {},
      },
      async authorize({ email, password, role }) {
        let user = null;

        try {
          await connectDB();
          user = await User.findOne({ email, role }).select("+password");

          if (!user) {
            throw new Error("User not found");
          }

          const isPasswordValid = await bcryptjs.compare(
            password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          return { id: user._id, email: user.email, role: user.role };
        } catch (error) {
          console.error("Authorization error:", error);
          // Returning null is enough to signal an error to the client
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 3 * 60 * 60, // 3 hours
  },

  // ✅ NOTE: The complex cookie configuration has been removed.
  // Auth.js will automatically set secure, httpOnly cookies in production
  // based on the `AUTH_URL` environment variable. This is simpler and less error-prone.

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
      }
      if (token.role) {
        session.user.role = token.role;
      }
      return session;
    },
  },

  // Ensure this environment variable is set in Vercel
  secret: process.env.AUTH_SECRET,

  debug: process.env.NODE_ENV === "development",
});