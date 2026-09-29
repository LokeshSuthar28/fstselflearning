import { createAuthClient } from "better-auth/react";

/**
 * Better Auth Client Instance
 * Used by Client Components to query sessions, sign in, sign out, and read user role metadata.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const { useSession, signIn, signOut, signUp } = authClient;
