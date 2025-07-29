import NextAuth from "next-auth";
import CredentialProvider from "next-auth/providers/credentials";
import connectDB from "./lib/dbConnection";
import User from "./lib/models/userModel";
import bcryptjs from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    // Defines the credentials-based login provider.
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

          // Returns user object if authentication is successful.
          return { id: user._id, email: user.email, role: user.role };
        } catch (error) {
          return null; // Return null on any error.
        }
      },
    }),
  ],
  session: {
    strategy: "jwt", // Use JSON Web Tokens for session management.
  },
  callbacks: {
    // Adds user ID and role to the JWT token.
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    // Adds user ID and role to the client-side session object.
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  // Reads the secret from environment variables.
  secret: process.env.AUTH_SECRET,
});