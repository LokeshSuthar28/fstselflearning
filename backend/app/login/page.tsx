"use client";

import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<"ADMIN" | "MEMBER" | "GUEST">("MEMBER");

  const accounts = {
    ADMIN: { email: "admin@stephigh.com", name: "Neo Vance (Lead Architect)", tier: "ADMIN", desc: "Full administrative access to /api/admin & global pre-orders" },
    MEMBER: { email: "member@stephigh.com", name: "Trinity Cole (VIP Collector)", tier: "MEMBER", desc: "Access to /preorders, placement actions, and isolated transaction history" },
    GUEST: { email: "guest@stephigh.com", name: "Cipher Smith (Unverified Visitor)", tier: "GUEST", desc: "Blocked by Edge Middleware from placing orders or querying transactions" },
  };

  return (
    <main style={{ minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", color: "#292524" }}>
      <div
        style={{
          maxWidth: "520px",
          width: "100%",
          backgroundColor: "#ffffff",
          border: "1px solid #e7e2d9",
          borderRadius: "14px",
          padding: "36px",
          boxShadow: "0 4px 20px rgba(41, 37, 36, 0.05)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <p style={{ color: "#ea580c", fontSize: "11px", letterSpacing: "3px", fontWeight: 700, textTransform: "uppercase", margin: 0 }}>
            AUTHENTICATION MATRIX // BETTER AUTH
          </p>
          <h1 style={{ color: "#1c1917", fontSize: "26px", fontWeight: 800, margin: "8px 0" }}>
            Identity & RBAC Gateway
          </h1>
          <p style={{ color: "#78716c", fontSize: "13px", margin: 0 }}>
            Select an account tier to simulate Edge session enforcement
          </p>
        </div>

        {/* Role Selectors */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "20px" }}>
          {(["MEMBER", "ADMIN", "GUEST"] as const).map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              style={{
                padding: "10px",
                borderRadius: "6px",
                border: selectedRole === role ? "2px solid #ea580c" : "1px solid #e7e2d9",
                backgroundColor: selectedRole === role ? "#fff7ed" : "#fbf9f4",
                color: selectedRole === role ? "#ea580c" : "#78716c",
                fontWeight: 700,
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              {role}
            </button>
          ))}
        </div>

        {/* Selected Tier Card */}
        <div style={{ backgroundColor: "#fbf9f4", border: "1px solid #e7e2d9", borderRadius: "8px", padding: "18px", marginBottom: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontSize: "11px", color: "#78716c", fontWeight: 600 }}>ACCOUNT IDENTITY:</span>
            <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "4px", backgroundColor: selectedRole === "ADMIN" ? "#fee2e2" : selectedRole === "MEMBER" ? "#dcfce7" : "#fef3c7", color: selectedRole === "ADMIN" ? "#b91c1c" : selectedRole === "MEMBER" ? "#15803d" : "#b45309", fontWeight: 700 }}>
              {selectedRole}
            </span>
          </div>
          <p style={{ color: "#1c1917", fontWeight: 700, margin: "0 0 4px 0", fontSize: "15px" }}>
            {accounts[selectedRole].name}
          </p>
          <p style={{ color: "#ea580c", fontFamily: "monospace", margin: "0 0 10px 0", fontSize: "13px", fontWeight: 600 }}>
            {accounts[selectedRole].email}
          </p>
          <p style={{ color: "#78716c", fontSize: "13px", margin: 0, lineHeight: "19px" }}>
            {accounts[selectedRole].desc}
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <button
            onClick={() => {
              document.cookie = `better-auth.session_token=mock_session_${selectedRole.toLowerCase()}; path=/; max-age=86400`;
              alert(`Simulated session cookie configured for role: ${selectedRole}`);
              window.location.href = selectedRole === "ADMIN" ? "/api/admin" : "/preorders";
            }}
            style={{
              padding: "12px",
              backgroundColor: "#ea580c",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              fontWeight: 800,
              fontSize: "13px",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(234, 88, 12, 0.25)",
            }}
          >
            ACTIVATE {selectedRole} SESSION & TEST →
          </button>

          <Link
            href="/"
            style={{
              padding: "12px",
              backgroundColor: "transparent",
              color: "#78716c",
              border: "1px solid #e7e2d9",
              borderRadius: "6px",
              textAlign: "center",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            Back to Hub
          </Link>
        </div>
      </div>
    </main>
  );
}
