"use client";

import * as React from "react";
import Link from "next/link";
import { mockDb } from "@/lib/data-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
  const [currentRole, setCurrentRole] = React.useState<"ADMIN" | "MEMBER" | "GUEST">("ADMIN");
  const [apiResponse, setApiResponse] = React.useState<{ endpoint: string; status: number; data: unknown } | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const cookie = document.cookie;
    if (cookie.includes("mock_session_admin")) {
      setCurrentRole("ADMIN");
    } else if (cookie.includes("mock_session_guest")) {
      setCurrentRole("GUEST");
    } else if (cookie.includes("mock_session_member")) {
      setCurrentRole("MEMBER");
    }
  }, []);

  const switchPersona = (role: "ADMIN" | "MEMBER" | "GUEST") => {
    setCurrentRole(role);
    document.cookie = `better-auth.session_token=mock_session_${role.toLowerCase()}; path=/; max-age=86400`;
    document.cookie = `mock_session_${role.toLowerCase()}=1; path=/; max-age=86400`;
    window.location.reload();
  };

  const testEndpoint = async (url: string) => {
    setLoading(true);
    setApiResponse(null);
    try {
      const res = await fetch(url, {
        headers: {
          "x-mock-role": currentRole,
        },
      });
      const data = await res.json().catch(() => ({ statusText: res.statusText }));
      setApiResponse({ endpoint: url, status: res.status, data });
    } catch (err: unknown) {
      setApiResponse({
        endpoint: url,
        status: 500,
        data: { error: err instanceof Error ? err.message : "Fetch failed" },
      });
    } finally {
      setLoading(false);
    }
  };

  const users = mockDb.getUsers();
  const transactions = mockDb.getTransactions();
  const auditLogs = mockDb.getAuditLogs();
  const totalRevenue = transactions.reduce((acc, t) => acc + t.totalAmount, 0);

  return (
    <div className="container py-8 space-y-6 max-w-5xl font-mono">
      {/* Admin Header */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-4 flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">
            System Administration
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-stone-900 dark:text-white">
            Admin Console
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Role-Based Access Control inspection and system metrics overview.
          </p>
        </div>

        <Link href="/records">
          <Button variant="outline" size="sm" className="rounded-none text-xs uppercase h-8">
            Ledger Explorer
          </Button>
        </Link>
      </div>

      {/* Non-Admin Warning */}
      {currentRole !== "ADMIN" && (
        <div className="p-3.5 border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-900 flex items-start justify-between gap-4 text-xs">
          <div className="space-y-1">
            <p className="font-bold uppercase text-stone-900 dark:text-stone-100">
              Current Session: {currentRole} (Admin Access Required for /api/admin)
            </p>
            <p className="text-stone-500">
              Elevate to Neo Vance (Admin) to execute admin routes with HTTP 200 authorization.
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => switchPersona("ADMIN")}
            className="rounded-none text-xs uppercase h-8 bg-stone-900 hover:bg-stone-800 text-white dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200 shrink-0"
          >
            Switch to Admin
          </Button>
        </div>
      )}

      {/* KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="p-3.5 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
          <div className="text-[10px] uppercase tracking-widest text-stone-500">
            Total Accounts
          </div>
          <div className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            {users.length}
          </div>
        </div>

        <div className="p-3.5 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
          <div className="text-[10px] uppercase tracking-widest text-stone-500">
            Pre-Orders
          </div>
          <div className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            {transactions.length}
          </div>
        </div>

        <div className="p-3.5 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
          <div className="text-[10px] uppercase tracking-widest text-stone-500">
            Gross Volume
          </div>
          <div className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            ${totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        </div>

        <div className="p-3.5 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
          <div className="text-[10px] uppercase tracking-widest text-stone-500">
            Audit Logs
          </div>
          <div className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-1">
            {auditLogs.length}
          </div>
        </div>
      </div>

      {/* Testing Console */}
      <Card className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-none shadow-sm">
        <CardHeader className="p-4 border-b border-stone-200 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              RBAC Endpoint Testing
            </CardTitle>
            <span className="text-[10px] text-stone-500">
              Role: <strong className="text-stone-900 dark:text-stone-100">{currentRole}</strong>
            </span>
          </div>
          <CardDescription className="text-[11px] font-mono text-stone-500 mt-0.5">
            Test how Edge middleware and handlers enforce role permissions.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 space-y-3">
          {/* Persona selector */}
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setCurrentRole("MEMBER")}
              className={`px-2.5 py-1 text-xs border uppercase transition-colors ${
                currentRole === "MEMBER"
                  ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold border-stone-900 dark:border-white"
                  : "border-stone-200 dark:border-stone-800 text-stone-500"
              }`}
            >
              Member (Trinity Cole)
            </button>
            <button
              onClick={() => setCurrentRole("ADMIN")}
              className={`px-2.5 py-1 text-xs border uppercase transition-colors ${
                currentRole === "ADMIN"
                  ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold border-stone-900 dark:border-white"
                  : "border-stone-200 dark:border-stone-800 text-stone-500"
              }`}
            >
              Admin (Neo Vance)
            </button>
            <button
              onClick={() => setCurrentRole("GUEST")}
              className={`px-2.5 py-1 text-xs border uppercase transition-colors ${
                currentRole === "GUEST"
                  ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold border-stone-900 dark:border-white"
                  : "border-stone-200 dark:border-stone-800 text-stone-500"
              }`}
            >
              Guest (Cipher Smith)
            </button>
          </div>

          {/* Trigger buttons */}
          <div className="flex flex-wrap gap-2 pt-1">
            <Button
              size="sm"
              onClick={() => testEndpoint("/api/transactions")}
              disabled={loading}
              className="rounded-none text-xs uppercase h-8 bg-stone-900 hover:bg-stone-800 text-white dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
            >
              GET /api/transactions
            </Button>
            <Button
              size="sm"
              onClick={() => testEndpoint("/api/admin")}
              disabled={loading}
              className="rounded-none text-xs uppercase h-8 border border-stone-300 dark:border-stone-700 bg-transparent text-stone-900 dark:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              GET /api/admin
            </Button>
          </div>

          {/* Response Inspector */}
          {apiResponse && (
            <div className="p-3 border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs space-y-1.5 mt-3">
              <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-1.5 text-[11px]">
                <span>
                  ENDPOINT: <strong>{apiResponse.endpoint}</strong> (Role: {currentRole})
                </span>
                <span className="font-bold">
                  STATUS: {apiResponse.status} {apiResponse.status === 200 ? "[GRANTED]" : "[BLOCKED]"}
                </span>
              </div>
              <pre className="overflow-x-auto max-h-56 text-[11px] text-stone-700 dark:text-stone-300">
                {JSON.stringify(apiResponse.data, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Global Pre-Orders Stream */}
      <div className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
        <div className="p-3 border-b border-stone-200 dark:border-stone-800 text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
          Global Pre-Order Stream [{transactions.length}]
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 text-stone-500 uppercase text-[10px]">
              <tr>
                <th className="p-2.5">Order Number</th>
                <th className="p-2.5">Timestamp</th>
                <th className="p-2.5">Model</th>
                <th className="p-2.5">User</th>
                <th className="p-2.5">Amount</th>
                <th className="p-2.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-mono">
              {transactions.slice(0, 10).map((t) => (
                <tr key={t.id} className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                  <td className="p-2.5 font-bold text-stone-900 dark:text-stone-100">{t.orderNumber}</td>
                  <td className="p-2.5 text-[11px] text-stone-500">
                    {new Date(t.createdAt).toISOString()}
                  </td>
                  <td className="p-2.5">{t.modelName}</td>
                  <td className="p-2.5 text-stone-500">{t.userName || t.userEmail}</td>
                  <td className="p-2.5 font-bold">${t.totalAmount.toFixed(2)}</td>
                  <td className="p-2.5">
                    <span className="border border-stone-200 dark:border-stone-700 px-1.5 py-0.5 text-[10px]">
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
