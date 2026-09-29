import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Better Auth Route Handler Catch-All
 * Handles all authentication flows (login, register, logout, session verification)
 * automatically via Better Auth's Next.js adapter.
 */
export const { GET, POST } = toNextJsHandler(auth.handler);
