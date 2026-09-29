import Link from "next/link";

interface UnauthorizedPageProps {
  searchParams: Promise<{ reason?: string }>;
}

export default async function UnauthorizedPage({ searchParams }: UnauthorizedPageProps) {
  const { reason } = await searchParams;

  let title = "ACCESS DENIED";
  let description = "You do not have the required security credentials to access this sector.";

  if (reason === "admin_only") {
    title = "ADMIN PRIVILEGES REQUIRED";
    description = "This sector is restricted strictly to Lead Architects and Admins (Role: ADMIN).";
  } else if (reason === "guest_upgrade_required") {
    title = "MEMBER TIER REQUIRED";
    description = "Guest accounts cannot reserve sneakers or query transaction ledgers. Upgrade to Member tier to proceed.";
  }

  return (
    <main style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", color: "#292524" }}>
      <div
        style={{
          maxWidth: "480px",
          width: "100%",
          backgroundColor: "#ffffff",
          border: "1px solid #fecaca",
          borderRadius: "14px",
          padding: "36px",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(220, 38, 38, 0.06)",
        }}
      >
        <span style={{ fontSize: "11px", color: "#dc2626", fontWeight: 800, letterSpacing: "2px" }}>
          SECURITY PROTOCOL // RBAC GATE
        </span>
        <h1 style={{ color: "#1c1917", fontSize: "24px", margin: "12px 0 16px 0", fontWeight: 800 }}>{title}</h1>
        <p style={{ color: "#78716c", fontSize: "14px", lineHeight: "22px", margin: "0 0 28px 0" }}>
          {description}
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link
            href="/"
            style={{
              padding: "10px 20px",
              backgroundColor: "#f5f0e6",
              border: "1px solid #e7e2d9",
              color: "#44403c",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            ← Return to Hub
          </Link>
          <Link
            href="/login"
            style={{
              padding: "10px 20px",
              backgroundColor: "#ea580c",
              color: "#ffffff",
              borderRadius: "6px",
              fontSize: "13px",
              fontWeight: 700,
              boxShadow: "0 2px 8px rgba(234, 88, 12, 0.25)",
            }}
          >
            Switch Account / Sign In →
          </Link>
        </div>
      </div>
    </main>
  );
}
