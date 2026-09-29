/**
 * Typed API client for Step High Sneakers Fullstack Application.
 * Handles unified internal routing for both Client Components and SSR.
 */

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

function getBaseUrl(): string {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  }
  return "";
}

interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: Record<string, unknown> | unknown;
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
      err instanceof Error ? err.message : "Network error";
    return { data: null, error: message, status: 0 };
  }
}

export async function fetchAdminData(mockRole?: "ADMIN" | "MEMBER" | "GUEST") {
  return apiFetch<AdminApiResponse>("/api/admin", { mockRole });
}

export async function fetchTransactions(
  mockRole?: "ADMIN" | "MEMBER" | "GUEST"
) {
  return apiFetch<TransactionsApiResponse>("/api/transactions", { mockRole });
}

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
