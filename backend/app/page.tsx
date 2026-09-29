"use client";

import Link from "next/link";
import { useState } from "react";

export default function HomePage() {
  const [activeRole, setActiveRole] = useState<"MEMBER" | "ADMIN" | "GUEST">("MEMBER");
  const [apiResponse, setApiResponse] = useState<{ endpoint: string; status: number; data: unknown } | null>(null);
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (url: string) => {
    setLoading(true);
    setApiResponse(null);
    try {
      // Pass the active role header to simulate edge RBAC enforcement
      const res = await fetch(url, {
        headers: {
          "x-mock-role": activeRole,
        },
      });
      const data = await res.json().catch(() => ({ message: res.statusText }));
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

  return (
    <main style={{ maxWidth: "1050px", margin: "0 auto", padding: "48px 24px", color: "#292524" }}>
      {/* Brand Header */}
      <div style={{ borderBottom: "1px solid #e7e2d9", paddingBottom: "24px", marginBottom: "36px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <p style={{ color: "#ea580c", fontSize: "12px", letterSpacing: "3px", fontWeight: 700, textTransform: "uppercase", margin: 0 }}>
              STEP HIGH SNEAKERS // SYSTEM INFRASTRUCTURE
            </p>
            <h1 style={{ fontSize: "36px", fontWeight: 800, margin: "8px 0", color: "#1c1917", letterSpacing: "-0.5px" }}>
              Step High Sneakers
            </h1>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link
              href="/records"
              style={{
                padding: "9px 18px",
                backgroundColor: "#16a34a",
                color: "#ffffff",
                borderRadius: "6px",
                fontWeight: 700,
                fontSize: "12px",
                boxShadow: "0 2px 6px rgba(22, 163, 74, 0.2)",
              }}
            >
              📅 View Date Entries & Records →
            </Link>
            <Link
              href="/preorders"
              style={{
                padding: "9px 18px",
                backgroundColor: "#ea580c",
                color: "#ffffff",
                borderRadius: "6px",
                fontWeight: 700,
                fontSize: "12px",
                boxShadow: "0 2px 6px rgba(234, 88, 12, 0.2)",
              }}
            >
              + Place Pre-Order Portal →
            </Link>
          </div>
        </div>
        <p style={{ color: "#78716c", fontSize: "14px", margin: "8px 0 0 0" }}>
          Relational PostgreSQL (Prisma) • Better Auth Edge RBAC • Resend Transactional Dispatch • Svix Webhook Ingestion
        </p>
      </div>

      {/* Interactive Testing Console */}
      <div style={{ backgroundColor: "#ffffff", border: "1px solid #e7e2d9", borderRadius: "12px", padding: "24px", marginBottom: "32px", boxShadow: "0 4px 16px rgba(41, 37, 36, 0.04)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "8px" }}>
          <h3 style={{ margin: 0, fontSize: "15px", color: "#ea580c", letterSpacing: "1px", textTransform: "uppercase", fontWeight: 800 }}>
            ⚡ Live RBAC & Endpoint Verification Console
          </h3>
          <span style={{ fontSize: "12px", color: "#78716c" }}>
            Choose a role below, then click an endpoint to see its live response
          </span>
        </div>

        {/* Step 1: Active Role Selector */}
        <div style={{ marginBottom: "18px", padding: "16px", backgroundColor: "#fbf9f4", borderRadius: "8px", border: "1px solid #e7e2d9" }}>
          <div style={{ fontSize: "11px", color: "#78716c", fontWeight: 700, letterSpacing: "1.5px", marginBottom: "10px", textTransform: "uppercase" }}>
            Step 1: Select Active Role For Request
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <button
              onClick={() => setActiveRole("MEMBER")}
              style={{
                padding: "9px 16px",
                borderRadius: "6px",
                border: activeRole === "MEMBER" ? "2px solid #0284c7" : "1px solid #d6cfc2",
                backgroundColor: activeRole === "MEMBER" ? "#e0f2fe" : "#ffffff",
                color: activeRole === "MEMBER" ? "#0369a1" : "#57534e",
                fontWeight: 700,
                fontSize: "12px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              ● MEMBER (Trinity Cole — Allowed Pre-Orders)
            </button>

            <button
              onClick={() => setActiveRole("ADMIN")}
              style={{
                padding: "9px 16px",
                borderRadius: "6px",
                border: activeRole === "ADMIN" ? "2px solid #16a34a" : "1px solid #d6cfc2",
                backgroundColor: activeRole === "ADMIN" ? "#dcfce7" : "#ffffff",
                color: activeRole === "ADMIN" ? "#15803d" : "#57534e",
                fontWeight: 700,
                fontSize: "12px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              ● ADMIN (Neo Vance — Full Privileges)
            </button>

            <button
              onClick={() => setActiveRole("GUEST")}
              style={{
                padding: "9px 16px",
                borderRadius: "6px",
                border: activeRole === "GUEST" ? "2px solid #dc2626" : "1px solid #d6cfc2",
                backgroundColor: activeRole === "GUEST" ? "#fee2e2" : "#ffffff",
                color: activeRole === "GUEST" ? "#b91c1c" : "#57534e",
                fontWeight: 700,
                fontSize: "12px",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              ● GUEST (Cipher Smith — Denied by RBAC Gate)
            </button>
          </div>
        </div>

        {/* Step 2: Trigger Endpoint */}
        <div style={{ fontSize: "11px", color: "#78716c", fontWeight: 700, letterSpacing: "1.5px", marginBottom: "8px", textTransform: "uppercase" }}>
          Step 2: Trigger Endpoint
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "16px" }}>
          <button
            onClick={() => testEndpoint("/api/transactions")}
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#0284c7",
              border: "none",
              color: "#ffffff",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(2, 132, 199, 0.2)",
            }}
          >
            {loading ? "Querying..." : "Test GET /api/transactions"}
          </button>

          <button
            onClick={() => testEndpoint("/api/admin")}
            disabled={loading}
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc2626",
              border: "none",
              color: "#ffffff",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(220, 38, 38, 0.2)",
            }}
          >
            {loading ? "Querying..." : "Test GET /api/admin"}
          </button>
        </div>

        {/* Response Box */}
        {apiResponse && (
          <div style={{ backgroundColor: "#f5f0e6", border: "1px solid #e3dcce", borderRadius: "8px", padding: "16px", fontFamily: "monospace", fontSize: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", borderBottom: "1px solid #dfd7c5", paddingBottom: "8px", flexWrap: "wrap", gap: "6px" }}>
              <span style={{ color: "#57534e" }}>
                ENDPOINT: <strong style={{ color: "#1c1917" }}>{apiResponse.endpoint}</strong> (Role: <span style={{ color: "#ea580c", fontWeight: 700 }}>{activeRole}</span>)
              </span>
              <span style={{ color: apiResponse.status === 200 ? "#15803d" : "#dc2626", fontWeight: "bold" }}>
                HTTP STATUS: {apiResponse.status} {apiResponse.status === 200 ? "✓ GRANTED" : "✗ BLOCKED BY RBAC"}
              </span>
            </div>
            <pre style={{ margin: 0, color: "#292524", overflowX: "auto", maxHeight: "300px" }}>
              {JSON.stringify(apiResponse.data, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Grid of Architectural Modules */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
        {/* Module 1: Relational Schema & Seeding (CO4) */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e7e2d9", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 10px rgba(41, 37, 36, 0.03)" }}>
          <span style={{ fontSize: "11px", color: "#16a34a", fontWeight: 700, letterSpacing: "1px" }}>
            PART A (CO4)
          </span>
          <h2 style={{ fontSize: "18px", margin: "8px 0 12px 0", color: "#1c1917" }}>
            Relational Schema & Seeding
          </h2>
          <p style={{ color: "#78716c", fontSize: "13px", lineHeight: "20px" }}>
            Normalized multi-entity PostgreSQL schema with strict foreign-key relations between <code style={{ color: "#ea580c" }}>User</code>, <code style={{ color: "#ea580c" }}>Role</code>, <code style={{ color: "#ea580c" }}>Transaction</code>, and <code style={{ color: "#ea580c" }}>AuditLog</code>.
          </p>
          <div style={{ marginTop: "16px", padding: "10px", backgroundColor: "#f5f0e6", borderRadius: "6px", fontFamily: "monospace", fontSize: "12px", color: "#44403c" }}>
            $ npm run check:entries
          </div>
        </div>

        {/* Module 2: RBAC Middleware Gates (CO3) */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e7e2d9", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 10px rgba(41, 37, 36, 0.03)" }}>
          <span style={{ fontSize: "11px", color: "#0284c7", fontWeight: 700, letterSpacing: "1px" }}>
            PART B (CO3)
          </span>
          <h2 style={{ fontSize: "18px", margin: "8px 0 12px 0", color: "#1c1917" }}>
            Session Enforcement & Edge RBAC
          </h2>
          <p style={{ color: "#78716c", fontSize: "13px", lineHeight: "20px" }}>
            Edge middleware proxy gate inspecting Better Auth sessions. Blocks unauthenticated users (401), denies GUEST users (403), isolates MEMBER pre-orders, and safeguards ADMIN routes.
          </p>
          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            <Link href="/records" style={{ fontSize: "12px", color: "#0284c7", fontWeight: 600, textDecoration: "underline" }}>
              /records table →
            </Link>
            <Link href="/unauthorized" style={{ fontSize: "12px", color: "#dc2626", fontWeight: 600, textDecoration: "underline" }}>
              /unauthorized gate →
            </Link>
          </div>
        </div>

        {/* Module 3: Resend & Webhook Ingestion (CO3 & CO4) */}
        <div style={{ backgroundColor: "#ffffff", border: "1px solid #e7e2d9", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 10px rgba(41, 37, 36, 0.03)" }}>
          <span style={{ fontSize: "11px", color: "#9333ea", fontWeight: 700, letterSpacing: "1px" }}>
            PART C (CO3, CO4)
          </span>
          <h2 style={{ fontSize: "18px", margin: "8px 0 12px 0", color: "#1c1917" }}>
            Resend Email & Webhook Ingestion
          </h2>
          <p style={{ color: "#78716c", fontSize: "13px", lineHeight: "20px" }}>
            Dark cyberpunk React Email pre-order notifications triggered atomically by Server Actions. Ingests Resend webhooks to log delivery and bounce events into <code style={{ color: "#ea580c" }}>AuditLog</code>.
          </p>
          <div style={{ marginTop: "16px", padding: "10px", backgroundColor: "#f5f0e6", borderRadius: "6px", fontFamily: "monospace", fontSize: "12px", color: "#44403c" }}>
            POST /api/webhooks/resend
          </div>
        </div>
      </div>
    </main>
  );
}
