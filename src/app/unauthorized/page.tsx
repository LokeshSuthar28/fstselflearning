"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

function UnauthorizedContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  const isGuestBlocked = reason === "guest_upgrade_required";
  const isAdminOnly = reason === "admin_only";

  const handleElevateRole = (role: "ADMIN" | "MEMBER") => {
    document.cookie = `better-auth.session_token=mock_session_${role.toLowerCase()}; path=/; max-age=86400`;
    document.cookie = `mock_session_${role.toLowerCase()}=1; path=/; max-age=86400`;
    window.location.href = role === "ADMIN" ? "/admin" : "/preorders";
  };

  return (
    <Card className="w-full max-w-md bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-none shadow-sm font-mono text-left">
      <CardHeader className="p-6 border-b border-stone-200 dark:border-stone-800 space-y-1">
        <div className="text-[10px] uppercase tracking-widest text-stone-500">
          HTTP 403 Forbidden &bull; Edge RBAC
        </div>
        <CardTitle className="text-lg font-bold uppercase tracking-tight text-stone-900 dark:text-white">
          Access Denied
        </CardTitle>
        <CardDescription className="text-xs font-mono text-stone-500">
          {isGuestBlocked
            ? "Guest accounts cannot place pre-orders. Upgrade to Member tier."
            : isAdminOnly
            ? "Administrative authorization required for this resource."
            : "Required role credentials missing for this route."}
        </CardDescription>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div className="p-3 border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-xs text-stone-500 leading-relaxed">
          Active session role does not have authorization. Use the action below to elevate role credentials.
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          {isGuestBlocked && (
            <Button
              onClick={() => handleElevateRole("MEMBER")}
              className="flex-1 rounded-none text-xs font-mono uppercase h-9 bg-stone-900 hover:bg-stone-800 text-white dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
            >
              Elevate to Member
            </Button>
          )}

          {isAdminOnly && (
            <Button
              onClick={() => handleElevateRole("ADMIN")}
              className="flex-1 rounded-none text-xs font-mono uppercase h-9 bg-stone-900 hover:bg-stone-800 text-white dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
            >
              Elevate to Admin
            </Button>
          )}

          <Link href="/login" className="flex-1">
            <Button
              variant="outline"
              className="w-full rounded-none text-xs font-mono uppercase h-9 border-stone-300 dark:border-stone-700"
            >
              Identity Gate
            </Button>
          </Link>
        </div>
      </CardContent>

      <CardFooter className="bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 py-2.5 px-6 text-[10px] text-stone-500">
        <Link href="/" className="hover:underline text-stone-500">
          Return to Fleet Catalog
        </Link>
      </CardFooter>
    </Card>
  );
}

export default function UnauthorizedPage() {
  return (
    <div className="container min-h-[75vh] flex items-center justify-center py-10">
      <React.Suspense
        fallback={
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-6 w-6 animate-spin text-stone-500" />
          </div>
        }
      >
        <UnauthorizedContent />
      </React.Suspense>
    </div>
  );
}
