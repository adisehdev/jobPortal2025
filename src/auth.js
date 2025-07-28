import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectDB } from "./lib/dbConnection";
import { User } from "./lib/models/userModel";
import bcryptjs from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // GoogleProvider configuration (commented out)
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // }),
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
          // Find user by email
          user = await User.findOne({ email,role }).select("+password");

          if (!user) {
            throw new Error("User not found");
          }

          // Validate password
          const isPasswordValid = await bcryptjs.compare(
            password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error("Invalid password");
          }

          // Return user object with id, email, and role
          return { id: user._id, email: user.email, role: user.role };
        } catch (error) {
          console.error("Authorization error:", error);
          return null;
        }
      },
    }),
  ],
  
  // ADD THIS SESSION OBJECT
  session: {
    strategy: "jwt",
    maxAge: 3 * 60 * 60, // 3 hours in seconds
  },

  callbacks: {
    // Modify JWT to include user role
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // Add role from JWT to session object
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
});