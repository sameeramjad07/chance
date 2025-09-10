import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";

// Module augmentation for `next-auth` types
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role?: "user" | "admin";
      isVerified?: boolean;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/adapters" {
  interface AdapterUser {
    role?: "user" | "admin";
    isVerified?: boolean;
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string))
          .limit(1);
        if (!user || !user.passwordHash) return null;
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash,
        );
        if (!isValid) return null;
        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          role: user.role,
          isVerified: user.isVerified,
        };
      },
    }),
  ],
  adapter: DrizzleAdapter(db, {
    usersTable: users as any,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && user.email) {
        const [existingUser] = await db
          .select()
          .from(users)
          .where(eq(users.email, user.email))
          .limit(1);
        if (!existingUser) {
          // Create a new user if they don't exist
          const lastDigits = profile?.phone_number
            ? profile.phone_number.slice(-4)
            : Math.floor(1000 + Math.random() * 9000).toString();
          const baseUsername =
            `${profile?.given_name || "user"}${profile?.family_name || ""}${lastDigits}`
              .replace(/\s+/g, "")
              .toLowerCase();
          let username = baseUsername;
          let counter = 1;
          while (
            (
              await db
                .select()
                .from(users)
                .where(eq(users.username, username))
                .limit(1)
            ).length > 0
          ) {
            username = `${baseUsername}${counter}`;
            counter++;
          }
          await db.insert(users).values({
            id: user.id,
            email: user.email,
            firstName: profile?.given_name || "User",
            lastName: profile?.family_name || "",
            username,
            whatsappNumber: profile?.phone_number || "",
            profileCompleted: false,
            role: "user",
            isVerified: profile?.email_verified || false,
          });
        }
      }
      return true;
    },
    session: ({ session, user }) => {
      if (session.user && user) {
        session.user.id = user.id;
        session.user.role = (user as any).role || "user";
        session.user.isVerified = (user as any).isVerified || false;
      }
      return session;
    },
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "user";
        token.isVerified = (user as any).isVerified || false;
      }
      return token;
    },
    redirect: async ({ url, baseUrl }) => {
      // Allow relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allow URLs on the same origin
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: "/signin",
    signOut: "/signin",
  },
  session: {
    strategy: "jwt",
  },
};
