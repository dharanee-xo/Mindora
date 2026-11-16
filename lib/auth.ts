import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username and password are required.");
        }

        const cleanUsername = credentials.username.trim().toLowerCase();
        await connectToDatabase();

        let user = await User.findOne({ username: cleanUsername });

        if (!user) {
          // Seamless Zero-PII auto-registration
          const passwordHash = await bcrypt.hash(credentials.password, 10);
          user = await User.create({
            username: cleanUsername,
            passwordHash,
          });
        } else {
          // Verify existing user password
          const isValid = await bcrypt.compare(
            credentials.password,
            user.passwordHash
          );
          if (!isValid) {
            throw new Error("Invalid password for this student handle.");
          }
        }

        return {
          id: user._id.toString(),
          username: user.username,
          name: user.username,
        };
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "mindora_super_secret_key_2026",
  pages: {
    signIn: "/",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = (user as any).username || user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).username = token.username as string;
        session.user.name = token.username as string;
      }
      return session;
    },
  },
};
