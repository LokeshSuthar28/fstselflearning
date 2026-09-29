"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function LoginContent() {
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/";
  const [selectedRole, setSelectedRole] = React.useState<"ADMIN" | "MEMBER" | "GUEST">("MEMBER");

  const accounts = {
    ADMIN: {
      email: "admin@stephigh.com",
      name: "Neo Vance",
      title: "Lead Architect & Admin",
      tier: "ADMIN",
      desc: "Full administrative access to /api/admin, analytics, global pre-orders, and audit trail.",
    },
    MEMBER: {
      email: "member@stephigh.com",
      name: "Trinity Cole",
      title: "VIP Collector & Member",
      tier: "MEMBER",
      desc: "Priority pre-orders, /preorders vault access, and isolated transaction history.",
    },
    GUEST: {
      email: "guest@stephigh.com",
      name: "Cipher Smith",
      title: "Unverified Visitor",
      tier: "GUEST",
      desc: "Browsing only. Edge middleware blocks guest accounts from placing orders or querying transactions.",
    },
  };

  const handleActivateSession = () => {
    document.cookie = `better-auth.session_token=mock_session_${selectedRole.toLowerCase()}; path=/; max-age=86400`;
    document.cookie = `mock_session_${selectedRole.toLowerCase()}=1; path=/; max-age=86400`;

    const destination =
      selectedRole === "ADMIN" && redirectTarget === "/"
        ? "/admin"
        : redirectTarget;

    window.location.href = destination;
  };

  return (
    <Card className="w-full max-w-md bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-none shadow-sm font-mono">
      <CardHeader className="p-6 border-b border-stone-200 dark:border-stone-800 space-y-1">
        <div className="text-[10px] uppercase tracking-widest text-stone-500">
          Better Auth RBAC
        </div>
        <CardTitle className="text-lg font-bold uppercase tracking-tight text-stone-900 dark:text-white">
          Identity Gateway
        </CardTitle>
        <CardDescription className="text-xs font-mono text-stone-500">
          Select an account role to simulate Edge session enforcement.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        {/* Role selector tabs */}
        <div className="grid grid-cols-3 gap-1">
          {(["MEMBER", "ADMIN", "GUEST"] as const).map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`p-2 border text-center transition-colors ${
                selectedRole === role
                  ? "border-stone-900 dark:border-white bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold"
                  : "border-stone-200 dark:border-stone-800 text-stone-500 hover:border-stone-400 dark:hover:border-stone-600"
              }`}
            >
              <div className="text-xs font-mono uppercase">{role}</div>
            </button>
          ))}
        </div>

        {/* Details Card */}
        <div className="p-3 border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase text-stone-500">
              Identity
            </span>
            <span className="border border-stone-300 dark:border-stone-700 px-1.5 py-0.5 text-[10px] font-bold">
              {selectedRole}
            </span>
          </div>

          <div>
            <div className="font-bold text-stone-900 dark:text-stone-100">{accounts[selectedRole].name}</div>
            <div className="text-[11px] text-stone-500">{accounts[selectedRole].email}</div>
          </div>

          <p className="text-[11px] text-stone-500 leading-relaxed border-t border-stone-200 dark:border-stone-800 pt-2">
            {accounts[selectedRole].desc}
          </p>
        </div>

        {/* Action button */}
        <Button
          onClick={handleActivateSession}
          className="w-full h-10 font-mono uppercase tracking-wider text-xs rounded-none bg-stone-900 hover:bg-stone-800 text-white dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200 transition-colors"
        >
          <span>Activate {selectedRole} Session</span>
        </Button>
      </CardContent>

      <CardFooter className="bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 py-2.5 px-6 text-[10px] text-stone-500 flex items-center justify-between">
        <Link href="/" className="hover:underline text-stone-500">
          Return to Catalog
        </Link>
        <span>Session TTL: 24h</span>
      </CardFooter>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <div className="container min-h-[75vh] flex items-center justify-center py-10">
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-stone-500" />
          </div>
        }
      >
        <LoginContent />
      </React.Suspense>
    </div>
  );
}
