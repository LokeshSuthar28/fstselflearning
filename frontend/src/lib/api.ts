/**
 * Typed API client for communicating with the backend (port 3000).
 *
 * All calls go through the Next.js rewrite proxy configured in next.config.mjs,
 * so the browser always calls `/api/*` on the same origin (port 3001) and
 * Next.js transparently forwards them to `http://localhost:3000/api/*`.
 *
 * In Server Components / Server Actions, we call the backend URL directly
 * via the NEXT_PUBLIC_BACKEND_URL env var.
 */

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

/** Return the correct base URL depending on execution context */
function getBaseUrl(): string {
  // During SSR / Server Actions we call the backend directly
  if (typeof window === "undefined") {
    return BACKEND_URL;
  }
  // In the browser, use the proxy rewrite (same origin)
  return "";
}

// ─────────────────────────────────────────────────────────────────────────────
// Shared response types (mirrors backend response shapes)
// ─────────────────────────────────────────────────────────────────────────────

export interface AdminMetrics {
  totalUsers: number;
  totalTransactions: number;
  totalAuditLogs: number;
}

export interface AdminApiResponse {
  status: string;
  source: string;
  timestamp?: string;
  adminUser: { id: string; email: string; role: string; name?: string };
  metrics: AdminMetrics;
  recentTransactions?: BackendTransaction[];
  recentAuditLogs?: AuditLogEntry[];
  recentEvents?: AuditLogEntry[];
  dateEntries?: { latestTransactionDate?: string; earliestRecordDate?: string };
}

export interface AuditLogEntry {
  id: string;
  userId?: string | null;
  transactionId?: string | null;
  action: string;
  category: string;
  status: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  user?: { id: string; email: string; role: string } | null;
}

export interface BackendTransaction {
  id: string;
  orderNumber: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  modelName: string;
  edition: string;
  size: number;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  currency: string;
  status: string;
  shippingAddress?: Record<string, string>;
  createdAt: string;
  auditLogs?: AuditLogEntry[];
  user?: { id: string; name: string; email: string; role: string } | null;
}

export interface TransactionsApiResponse {
  source: string;
  scope: "ADMIN_GLOBAL_VIEW" | "MEMBER_ISOLATED_VIEW";
  count: number;
  asOf?: string;
  userId?: string;
  data: BackendTransaction[];
}

export interface PreorderApiPayload {
  modelName: string;
  edition: string;
  size: number;
  quantity: number;
  unitPrice: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface PreorderApiResponse {
  success: boolean;
  orderNumber?: string;
  transactionId?: string;
  resendMessageId?: string;
  createdAt?: string;
  error?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Generic fetch helper
// ─────────────────────────────────────────────────────────────────────────────

interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: Record<string, unknown> | unknown;
  /** Override the role header for mock session simulation */
  mockRole?: "ADMIN" | "MEMBER" | "GUEST";
}

async function apiFetch<T>(
  path: string,
  options: FetchOptions = {}
): Promise<{ data: T | null; error: string | null; status: number }> {
  const { body, mockRole, ...rest } = options;
  const base = getBaseUrl();
  const url = `${base}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(rest.headers as Record<string, string>),
  };

  // Propagate mock role header for local development session simulation
  if (mockRole) {
    headers["x-mock-role"] = mockRole;
  }

  try {
    const response = await fetch(url, {
      ...rest,
      headers,
      credentials: "include",
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });

    let data: T | null = null;
    const contentType = response.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      data = await response.json();
    }

    if (!response.ok) {
      const errMessage =
        (data as { error?: string } | null)?.error ||
        `HTTP ${response.status}`;
      return { data: null, error: errMessage, status: response.status };
    }

    return { data, error: null, status: response.status };
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Network error — backend unreachable";
    return { data: null, error: message, status: 0 };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Endpoint-specific API functions
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/admin
 * Fetches admin dashboard metrics and recent events.
 * Requires ADMIN role — backend enforces this via middleware + handler RBAC.
 */
export async function fetchAdminData(mockRole?: "ADMIN" | "MEMBER" | "GUEST") {
  return apiFetch<AdminApiResponse>("/api/admin", { mockRole });
}

/**
 * GET /api/transactions
 * Fetches transactions for the authenticated user.
 * - ADMIN: full global view
 * - MEMBER: scoped to their own userId
 * - GUEST: 403 Forbidden
 */
export async function fetchTransactions(
  mockRole?: "ADMIN" | "MEMBER" | "GUEST"
) {
  return apiFetch<TransactionsApiResponse>("/api/transactions", { mockRole });
}

/**
 * POST /api/preorder
 * Submits a sneaker pre-order to the backend.
 * The backend delegates to `createSneakerPreOrder` Server Action which
 * handles auth, Prisma mutation, and Resend email dispatch.
 */
export async function submitPreorder(
  payload: PreorderApiPayload,
  mockRole?: "ADMIN" | "MEMBER" | "GUEST"
) {
  return apiFetch<PreorderApiResponse>("/api/preorder", {
    method: "POST",
    body: payload as unknown as Record<string, unknown>,
    mockRole,
  });
}

/**
 * GET /api/auth/get-session
 * Returns the current Better Auth session from the backend.
 */
export async function getBackendSession() {
  return apiFetch<{
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
    } | null;
    session: { id: string; expiresAt: string } | null;
  }>("/api/auth/get-session");
}
