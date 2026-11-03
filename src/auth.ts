import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import {
  authenticateUser,
  getUserById,
  upsertOAuthUser,
  type UserRole,
  type UserStatus,
} from "@/lib/server/users";

const providers: Provider[] = [];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  );
}

if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  );
}

providers.push(
  Credentials({
    name: "Email",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      const email = String(credentials?.email || "");
      const password = String(credentials?.password || "");
      const user = await authenticateUser(email, password);
      if (!user) return null;
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      };
    },
  }),
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET || "math12-dev-secret-change-me-in-production",
  session: { strategy: "jwt", maxAge: 60 * 60 * 24 * 14 },
  pages: {
    signIn: "/login",
  },
  providers,
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        if (account.provider === "credentials") {
          token.userId = user.id;
          token.role = user.role as UserRole;
          token.status = user.status as UserStatus;
          token.email = user.email;
          token.name = user.name;
        } else if (
          (account.provider === "google" || account.provider === "github") &&
          user.email
        ) {
          const dbUser = await upsertOAuthUser({
            email: user.email,
            name: user.name,
            provider: account.provider,
          });
          token.userId = dbUser.id;
          token.role = dbUser.role;
          token.status = dbUser.status;
          token.email = dbUser.email;
          token.name = dbUser.name;
        }
      }

      // Keep role/status in sync so admin Accept on the site takes effect
      // without requiring students (or newly promoted admins) to sign out.
      if (token.userId) {
        const fresh = await getUserById(token.userId as string);
        if (fresh) {
          token.role = fresh.role;
          token.status = fresh.status;
          token.email = fresh.email;
          token.name = fresh.name;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.userId as string) || "";
        session.user.role = (token.role as UserRole) || "student";
        session.user.status = (token.status as UserStatus) || "pending";
        if (token.email) session.user.email = token.email;
        if (token.name) session.user.name = token.name;
      }
      return session;
    },
  },
});
