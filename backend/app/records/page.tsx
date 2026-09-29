import Link from "next/link";
import { mockDb } from "@/lib/data-store";

export const dynamic = "force-dynamic";

export default function RecordsPage() {
  const transactions = mockDb.getTransactions();
  const auditLogs = mockDb.getAuditLogs();
  const users = mockDb.getUsers();

  return (
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px", color: "#292524" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #e7e2d9", paddingBottom: "20px", marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <div>
          <p style={{ color: "#ea580c", fontSize: "11px", letterSpacing: "3px", fontWeight: 700, textTransform: "uppercase", margin: 0 }}>
            DATABASE & LEDGER OBSERVABILITY // DATA ENTRIES
          </p>
          <h1 style={{ fontSize: "30px", fontWeight: 800, margin: "6px 0", color: "#1c1917" }}>
            Seeded Records & Timestamp Entries
          </h1>
          <p style={{ color: "#78716c", fontSize: "14px", margin: 0 }}>
            Live view of localized relational records, pre-orders, and audit logs with exact date timestamps
          </p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <Link
            href="/"
            style={{
              padding: "9px 16px",
              backgroundColor: "#ffffff",
              border: "1px solid #d6cfc2",
              color: "#44403c",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 600,
            }}
          >
            ← Back to Hub
          </Link>
          <Link
            href="/preorders"
            style={{
              padding: "9px 16px",
              backgroundColor: "#ea580c",
              color: "#ffffff",
              borderRadius: "6px",
              fontWeight: 700,
              fontSize: "12px",
              boxShadow: "0 2px 6px rgba(234, 88, 12, 0.2)",
            }}
          >
            + Add New Pre-Order Entry
          </Link>
        </div>
      </div>

      {/* Section 1: Sneaker Transactions */}
      <section style={{ marginBottom: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
          <h2 style={{ fontSize: "18px", color: "#1c1917", margin: 0, fontWeight: 800 }}>
            👟 Sneaker Pre-Order Transactions ({transactions.length} Entries)
          </h2>
          <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: 600 }}>● Strict Foreign-Key Linked</span>
        </div>

        <div style={{ overflowX: "auto", border: "1px solid #e7e2d9", borderRadius: "10px", backgroundColor: "#ffffff", boxShadow: "0 2px 8px rgba(41, 37, 36, 0.03)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#fbf9f4", borderBottom: "1px solid #e7e2d9", color: "#57534e" }}>
                <th style={{ padding: "12px 16px" }}>ORDER #</th>
                <th style={{ padding: "12px 16px" }}>DATE & TIMESTAMP</th>
                <th style={{ padding: "12px 16px" }}>MODEL & EDITION</th>
                <th style={{ padding: "12px 16px" }}>USER / CUSTOMER</th>
                <th style={{ padding: "12px 16px" }}>SIZE</th>
                <th style={{ padding: "12px 16px" }}>TOTAL</th>
                <th style={{ padding: "12px 16px" }}>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx.id} style={{ borderBottom: "1px solid #f3eee6" }}>
                  <td style={{ padding: "12px 16px", fontFamily: "monospace", color: "#ea580c", fontWeight: "bold" }}>
                    {tx.orderNumber}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#44403c", fontFamily: "monospace" }}>
                    <span style={{ backgroundColor: "#f5f0e6", padding: "4px 8px", borderRadius: "4px", border: "1px solid #e7e2d9" }}>
                      {new Date(tx.createdAt).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ color: "#1c1917", fontWeight: 700 }}>{tx.modelName}</div>
                    <div style={{ color: "#78716c", fontSize: "11px" }}>{tx.edition}</div>
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ color: "#292524", fontWeight: 600 }}>{tx.userName || "VIP Collector"}</div>
                    <div style={{ color: "#78716c", fontSize: "11px" }}>{tx.userEmail}</div>
                  </td>
                  <td style={{ padding: "12px 16px", color: "#44403c", fontFamily: "monospace", fontWeight: 600 }}>
                    {tx.size} US
                  </td>
                  <td style={{ padding: "12px 16px", color: "#15803d", fontWeight: "bold", fontFamily: "monospace" }}>
                    ${tx.totalAmount.toFixed(2)}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "10px",
                        fontWeight: 700,
                        backgroundColor: tx.status === "CONFIRMED" ? "#dcfce7" : "#e0f2fe",
                        color: tx.status === "CONFIRMED" ? "#15803d" : "#0369a1",
                        border: tx.status === "CONFIRMED" ? "1px solid #bbf7d0" : "1px solid #bae6fd",
                      }}
                    >
                      {tx.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 2: Audit Logs & Lifecycle Entries */}
      <section style={{ marginBottom: "40px" }}>
        <h2 style={{ fontSize: "18px", color: "#1c1917", margin: "0 0 14px 0", fontWeight: 800 }}>
          📜 AuditLog Lifecycle Events ({auditLogs.length} Entries)
        </h2>

        <div style={{ overflowX: "auto", border: "1px solid #e7e2d9", borderRadius: "10px", backgroundColor: "#ffffff", boxShadow: "0 2px 8px rgba(41, 37, 36, 0.03)" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px", textAlign: "left" }}>
            <thead>
              <tr style={{ backgroundColor: "#fbf9f4", borderBottom: "1px solid #e7e2d9", color: "#57534e" }}>
                <th style={{ padding: "12px 16px" }}>LOG ID</th>
                <th style={{ padding: "12px 16px" }}>TIMESTAMP</th>
                <th style={{ padding: "12px 16px" }}>ACTION</th>
                <th style={{ padding: "12px 16px" }}>CATEGORY</th>
                <th style={{ padding: "12px 16px" }}>STATUS</th>
                <th style={{ padding: "12px 16px" }}>METADATA</th>
              </tr>
            </thead>
            <tbody>
              {auditLogs.map((log) => (
                <tr key={log.id} style={{ borderBottom: "1px solid #f3eee6" }}>
                  <td style={{ padding: "12px 16px", fontFamily: "monospace", color: "#78716c" }}>
                    {log.id}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#44403c", fontFamily: "monospace" }}>
                    {new Date(log.createdAt).toLocaleString("en-US", {
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </td>
                  <td style={{ padding: "12px 16px", fontWeight: "bold", color: log.action.includes("BOUNCED") ? "#dc2626" : log.action.includes("DELIVERED") ? "#15803d" : "#0284c7" }}>
                    {log.action}
                  </td>
                  <td style={{ padding: "12px 16px", color: "#57534e" }}>
                    {log.category}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "4px",
                        fontSize: "10px",
                        fontWeight: 700,
                        backgroundColor: log.status === "DELIVERED" || log.status === "SUCCESS" ? "#dcfce7" : "#fee2e2",
                        color: log.status === "DELIVERED" || log.status === "SUCCESS" ? "#15803d" : "#b91c1c",
                        border: log.status === "DELIVERED" || log.status === "SUCCESS" ? "1px solid #bbf7d0" : "1px solid #fecaca",
                      }}
                    >
                      {log.status}
                    </span>
                  </td>
                  <td style={{ padding: "12px 16px", fontFamily: "monospace", color: "#57534e", fontSize: "11px" }}>
                    {JSON.stringify(log.metadata)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Section 3: Users */}
      <section>
        <h2 style={{ fontSize: "18px", color: "#1c1917", margin: "0 0 14px 0", fontWeight: 800 }}>
          👤 User Accounts ({users.length} Accounts)
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "14px" }}>
          {users.map((u) => (
            <div key={u.id} style={{ backgroundColor: "#ffffff", border: "1px solid #e7e2d9", borderRadius: "8px", padding: "16px", boxShadow: "0 2px 6px rgba(41, 37, 36, 0.02)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <strong style={{ color: "#1c1917", fontSize: "14px" }}>{u.name}</strong>
                <span style={{ fontSize: "10px", padding: "2px 8px", borderRadius: "3px", backgroundColor: u.role === "ADMIN" ? "#fee2e2" : u.role === "MEMBER" ? "#dcfce7" : "#fef3c7", color: u.role === "ADMIN" ? "#b91c1c" : u.role === "MEMBER" ? "#15803d" : "#b45309", fontWeight: 700 }}>
                  {u.role}
                </span>
              </div>
              <div style={{ color: "#ea580c", fontFamily: "monospace", fontSize: "12px", marginBottom: "6px" }}>{u.email}</div>
              <div style={{ color: "#78716c", fontSize: "11px" }}>
                Joined: {new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
