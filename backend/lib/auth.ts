import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";

/**
 * Better Auth Server Configuration
 * Configures database persistence via Prisma PostgreSQL adapter and
 * extends the User schema with our custom RBAC `role` field.
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  // Allow requests from the frontend dev server (port 3001)
  trustedOrigins: [
    process.env.FRONTEND_URL || "http://localhost:3001",
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  ],

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "MEMBER",
        input: false, // Prevent users from self-assigning arbitrary roles on signup
      },
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes cookie cache for edge/middleware efficiency
    },
  },
  emailAndPassword: {
    enabled: true,
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
