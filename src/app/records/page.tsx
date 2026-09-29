"use client";

import * as React from "react";
import Link from "next/link";
import { mockDb, type MockTransaction, type MockAuditLog, type MockUser } from "@/lib/data-store";
import { createSneakerPreOrder } from "@/actions/preorder";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  Search,
  RefreshCw,
} from "lucide-react";

export default function RecordsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState<"ALL" | "TRANSACTIONS" | "AUDIT_LOGS" | "USERS">("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [transactions, setTransactions] = React.useState<MockTransaction[]>([]);
  const [auditLogs, setAuditLogs] = React.useState<MockAuditLog[]>([]);
  const [users, setUsers] = React.useState<MockUser[]>([]);
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const loadData = React.useCallback(() => {
    setTransactions(mockDb.getTransactions());
    setAuditLogs(mockDb.getAuditLogs());
    setUsers(mockDb.getUsers());
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleTriggerPreOrder = async () => {
    setIsRefreshing(true);
    const res = await createSneakerPreOrder({
      modelName: "QUANTUM FOAM V2 CARBON",
      edition: "Sub-Atomic Propulsion Matrix",
      size: 10.5,
      quantity: 1,
      unitPrice: 295.0,
      shippingAddress: {
        street: "777 Neon Boulevard, Sector 9",
        city: "Neo Kyoto",
        state: "NK",
        postalCode: "94016",
        country: "US",
      },
    });

    if (res.success) {
      toast({
        variant: "success",
        title: "Pre-Order Created",
        description: `Order ${res.orderNumber} committed to database and audit log.`,
      });
      loadData();
    } else {
      toast({
        variant: "destructive",
        title: "Action Failed",
        description: res.error,
      });
    }
    setIsRefreshing(false);
  };

  const handleSimulateDelivery = async () => {
    try {
      const latestTx = mockDb.getTransactions()[0];
      const payload = {
        type: "email.delivered",
        created_at: new Date().toISOString(),
        data: {
          created_at: new Date().toISOString(),
          email_id: `msg_mock_${Date.now()}`,
          from: "Step High Sneakers <orders@stephighsneakers.com>",
          to: [latestTx?.userEmail || "member@stephigh.com"],
          subject: `[Step High] Pre-Order Confirmed: ${latestTx?.modelName || "Zero-G Runner"}`,
        },
      };

      const res = await fetch("/api/webhooks/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        mockDb.addAuditLog({
          id: `aud_deliv_${Date.now()}`,
          userId: latestTx?.userId || "usr_trinity_vip_02",
          transactionId: latestTx?.id || "tx_sh_9001",
          action: "EMAIL_DELIVERED",
          category: "EMAIL_NOTIFICATION",
          status: "DELIVERED",
          metadata: { resendMessageId: payload.data.email_id, recipient: payload.data.to[0] },
          createdAt: new Date().toISOString(),
        });
        toast({
          variant: "success",
          title: "Webhook Processed",
          description: "Logged EMAIL_DELIVERED to AuditLog table.",
        });
        loadData();
      }
    } catch {
      toast({ variant: "destructive", title: "Simulation failed" });
    }
  };

  const handleSimulateBounce = async () => {
    try {
      const payload = {
        type: "email.bounced",
        created_at: new Date().toISOString(),
        data: {
          created_at: new Date().toISOString(),
          email_id: `msg_bounce_${Date.now()}`,
          from: "Step High Sneakers <orders@stephighsneakers.com>",
          to: ["invalid_mailbox@stephigh.com"],
          subject: "[Step High] Drop Allocation Notice",
          bounce: { message: "550 5.1.1 User unknown", type: "hard_bounce" },
        },
      };

      const res = await fetch("/api/webhooks/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        mockDb.addAuditLog({
          id: `aud_bounce_${Date.now()}`,
          userId: "usr_cipher_guest_03",
          action: "EMAIL_BOUNCED",
          category: "EMAIL_NOTIFICATION",
          status: "BOUNCED",
          metadata: { reason: "550 5.1.1 User unknown", recipient: "invalid_mailbox@stephigh.com" },
          createdAt: new Date().toISOString(),
        });
        toast({
          variant: "destructive",
          title: "Bounce Recorded",
          description: "Logged EMAIL_BOUNCED event to AuditLog table.",
        });
        loadData();
      }
    } catch {
      toast({ variant: "destructive", title: "Simulation failed" });
    }
  };

  const filteredTransactions = transactions.filter(
    (t) =>
      t.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.modelName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.userName && t.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (t.userEmail && t.userEmail.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredAudits = auditLogs.filter(
    (a) =>
      a.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container py-8 space-y-6 font-mono">
      {/* Header Banner */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-4 flex flex-col lg:flex-row justify-between lg:items-end gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-widest text-stone-500 mb-1">
            Relational Ledger Observability
          </div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-stone-900 dark:text-white">
            Records & Audit Ledger
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Database models, pre-order transactions, and Resend webhook audit events.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Button
            size="sm"
            onClick={handleTriggerPreOrder}
            disabled={isRefreshing}
            className="text-xs uppercase h-8 rounded-none bg-stone-900 hover:bg-stone-800 text-white dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
          >
            + Test Pre-Order
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSimulateDelivery}
            className="text-xs uppercase h-8 rounded-none border-stone-300 dark:border-stone-700"
          >
            Simulate Delivered
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSimulateBounce}
            className="text-xs uppercase h-8 rounded-none border-stone-300 dark:border-stone-700"
          >
            Simulate Bounce
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={loadData}
            className="h-8 w-8 text-stone-500 rounded-none"
            title="Refresh"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* KPI Metrics Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
          <span className="text-[10px] uppercase tracking-widest text-stone-500 block">
            Pre-Orders
          </span>
          <div className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
            {transactions.length}
          </div>
        </div>

        <div className="p-3.5 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
          <span className="text-[10px] uppercase tracking-widest text-stone-500 block">
            AuditLog Records
          </span>
          <div className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
            {auditLogs.length}
          </div>
        </div>

        <div className="p-3.5 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
          <span className="text-[10px] uppercase tracking-widest text-stone-500 block">
            Registered Users
          </span>
          <div className="text-xl font-bold text-stone-900 dark:text-stone-100 mt-0.5">
            {users.length}
          </div>
        </div>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 border border-stone-200 dark:border-stone-800 p-0.5 bg-stone-50 dark:bg-stone-900 w-full sm:w-auto">
          {(["ALL", "TRANSACTIONS", "AUDIT_LOGS", "USERS"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 text-[11px] font-mono uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold"
                  : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-100"
              }`}
            >
              {tab.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-stone-400" />
          <Input
            placeholder="Search query..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 bg-white dark:bg-stone-950 text-xs rounded-none border-stone-200 dark:border-stone-800 h-8 font-mono"
          />
        </div>
      </div>

      {/* Section 1: Sneaker Transactions */}
      {(activeTab === "ALL" || activeTab === "TRANSACTIONS") && (
        <section className="space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-stone-500">
            <span className="font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
              Transactions [{filteredTransactions.length}]
            </span>
            <span className="text-[10px]">Strict User FK Linked</span>
          </div>

          <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 text-stone-500 font-mono uppercase text-[10px]">
                  <th className="p-3">Order Number</th>
                  <th className="p-3">Timestamp (UTC/ISO)</th>
                  <th className="p-3">Model</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Size</th>
                  <th className="p-3">Total</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-mono">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                    <td className="p-3 font-bold text-stone-900 dark:text-stone-100">
                      {tx.orderNumber}
                    </td>
                    <td className="p-3 text-[11px] text-stone-500">
                      {new Date(tx.createdAt).toISOString()}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-stone-900 dark:text-stone-100">{tx.modelName}</div>
                      <div className="text-[10px] text-stone-400">{tx.edition}</div>
                    </td>
                    <td className="p-3">
                      <div>{tx.userName || "VIP Collector"}</div>
                      <div className="text-[10px] text-stone-400">{tx.userEmail}</div>
                    </td>
                    <td className="p-3">{tx.size} US</td>
                    <td className="p-3 font-bold">${tx.totalAmount.toFixed(2)}</td>
                    <td className="p-3">
                      <span className="border border-stone-200 dark:border-stone-700 px-1.5 py-0.5 text-[10px]">
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Section 2: Audit Logs */}
      {(activeTab === "ALL" || activeTab === "AUDIT_LOGS") && (
        <section className="space-y-2">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
            AuditLog Lifecycle & Webhook Events [{filteredAudits.length}]
          </div>

          <div className="overflow-x-auto border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-stone-800 text-stone-500 font-mono uppercase text-[10px]">
                  <th className="p-3">Log ID</th>
                  <th className="p-3">Timestamp</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Metadata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800 font-mono">
                {filteredAudits.map((log) => (
                  <tr key={log.id} className="hover:bg-stone-50 dark:hover:bg-stone-900/50">
                    <td className="p-3 text-stone-400 text-[11px]">{log.id}</td>
                    <td className="p-3 text-[11px] text-stone-500">
                      {new Date(log.createdAt).toISOString()}
                    </td>
                    <td className="p-3 font-bold">
                      {log.action}
                    </td>
                    <td className="p-3 text-stone-500 text-[11px]">{log.category}</td>
                    <td className="p-3">
                      <span className="border border-stone-200 dark:border-stone-700 px-1.5 py-0.5 text-[10px]">
                        {log.status}
                      </span>
                    </td>
                    <td className="p-3 text-[11px] text-stone-500 max-w-xs truncate">
                      {JSON.stringify(log.metadata)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Section 3: Users */}
      {(activeTab === "ALL" || activeTab === "USERS") && (
        <section className="space-y-2">
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
            Registered Accounts [{users.length}]
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="p-3 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 space-y-1.5 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 dark:text-stone-100">{u.name}</span>
                  <span className="border border-stone-200 dark:border-stone-700 px-1.5 py-0.5 text-[10px]">
                    {u.role}
                  </span>
                </div>
                <div className="text-stone-500 text-[11px] truncate">{u.email}</div>
                <div className="text-stone-400 text-[10px]">
                  Created: {new Date(u.createdAt).toISOString().split("T")[0]}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
