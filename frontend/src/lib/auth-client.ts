import { createAuthClient } from "better-auth/react";

/**
 * Better Auth Client for the Frontend
 *
 * Points to the backend's Better Auth server (port 3000).
 * In development, the Next.js rewrite proxy forwards /api/auth/* calls
 * from the frontend (port 3001) to the backend (port 3000), so we can
 * use a relative baseURL. However, Better Auth client needs an absolute
 * URL to resolve endpoint paths correctly, so we use the backend URL.
 *
 * Sessions are shared via the `better-auth` cookie which is scoped to
 * the backend domain (localhost:3000). The frontend proxy rewrite ensures
 * auth cookies are correctly forwarded.
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000",
});

export const { useSession, signIn, signOut, signUp } = authClient;
