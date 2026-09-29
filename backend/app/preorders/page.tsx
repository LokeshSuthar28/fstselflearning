"use client";

import { useState } from "react";
import Link from "next/link";
import { createSneakerPreOrder } from "@/actions/preorder";

export default function PreOrdersPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; orderNumber?: string; error?: string } | null>(null);

  const handleTestOrder = async () => {
    setLoading(true);
    setResult(null);

    const res = await createSneakerPreOrder({
      modelName: "QUANTUM CYBER-PULSE 9000",
      edition: "Obsidian Stealth Matrix",
      size: 10.5,
      quantity: 1,
      unitPrice: 320.0,
      shippingAddress: {
        street: "777 Neon Boulevard, Sector 9",
        city: "Neo Kyoto",
        state: "NK",
        postalCode: "94016",
        country: "US",
      },
    });

    setResult(res);
    setLoading(false);
  };

  return (
    <main style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px", color: "#292524" }}>
      <div style={{ borderBottom: "1px solid #e7e2d9", paddingBottom: "20px", marginBottom: "28px" }}>
        <p style={{ color: "#ea580c", fontSize: "11px", letterSpacing: "3px", fontWeight: 700, textTransform: "uppercase", margin: 0 }}>
          STEP HIGH // VAULT RESERVATION
        </p>
        <h1 style={{ fontSize: "30px", fontWeight: 800, margin: "6px 0", color: "#1c1917" }}>Sneaker Pre-Order Portal</h1>
        <p style={{ color: "#78716c", fontSize: "14px", margin: 0 }}>
          Protected by Next.js Server Action (`'use server'`) with RBAC & Resend Email Lifecycle Dispatch
        </p>
      </div>

      <div style={{ backgroundColor: "#ffffff", border: "1px solid #e7e2d9", borderRadius: "12px", padding: "32px", marginBottom: "24px", boxShadow: "0 4px 16px rgba(41, 37, 36, 0.04)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
          <div>
            <span style={{ fontSize: "11px", color: "#ea580c", fontWeight: 700, letterSpacing: "1px" }}>LIMITED EDITION RELEASE</span>
            <h2 style={{ fontSize: "22px", margin: "4px 0", color: "#1c1917", fontWeight: 800 }}>QUANTUM CYBER-PULSE 9000</h2>
            <p style={{ color: "#78716c", fontSize: "13px", margin: 0 }}>Obsidian Stealth Matrix // Size 10.5 US</p>
          </div>
          <span style={{ fontSize: "24px", fontWeight: 800, color: "#15803d", fontFamily: "monospace" }}>$320.00</span>
        </div>

        <button
          onClick={handleTestOrder}
          disabled={loading}
          style={{
            padding: "14px 28px",
            backgroundColor: loading ? "#e7e2d9" : "#ea580c",
            color: loading ? "#78716c" : "#ffffff",
            border: "none",
            borderRadius: "6px",
            fontWeight: 800,
            fontSize: "13px",
            cursor: loading ? "not-allowed" : "pointer",
            width: "100%",
            boxShadow: "0 2px 8px rgba(234, 88, 12, 0.25)",
            transition: "all 0.15s ease",
          }}
        >
          {loading ? "TRANSACTING WITH PRISMA & RESEND..." : "TRIGGER PROTECTED SERVER ACTION PRE-ORDER →"}
        </button>

        {result && (
          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              borderRadius: "8px",
              backgroundColor: result.success ? "#dcfce7" : "#fee2e2",
              border: result.success ? "1px solid #bbf7d0" : "1px solid #fecaca",
            }}
          >
            <p style={{ margin: "0 0 6px 0", fontWeight: 700, color: result.success ? "#15803d" : "#b91c1c" }}>
              {result.success ? "✓ PRE-ORDER ALLOCATED & EMAIL DISPATCHED" : "✗ AUTHORIZATION OR MUTATION ERROR"}
            </p>
            <p style={{ margin: 0, fontSize: "13px", color: "#292524", fontFamily: "monospace" }}>
              {result.success
                ? `Order Number: ${result.orderNumber} | Transaction committed & audit record written.`
                : result.error}
            </p>
          </div>
        )}
      </div>

      <div style={{ display: "flex", gap: "16px" }}>
        <Link href="/" style={{ fontSize: "13px", color: "#ea580c", fontWeight: 600, textDecoration: "underline" }}>
          ← Back to Architecture Dashboard
        </Link>
        <Link href="/records" style={{ fontSize: "13px", color: "#16a34a", fontWeight: 600, textDecoration: "underline" }}>
          View All Recorded Entries →
        </Link>
      </div>
    </main>
  );
}
