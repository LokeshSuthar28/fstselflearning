"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const ROLES = [
  {
    role: "ADMIN",
    name: "Neo Vance",
    email: "admin@stephigh.com",
    label: "Admin Tier",
    badgeClass: "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 border-stone-300 dark:border-stone-700",
    desc: "Full administrative visibility and API control",
  },
  {
    role: "MEMBER",
    name: "Trinity Cole",
    email: "member@stephigh.com",
    label: "Member VIP",
    badgeClass: "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 border-stone-300 dark:border-stone-700",
    desc: "Priority pre-orders and isolated transaction ledger",
  },
  {
    role: "GUEST",
    name: "Cipher Smith",
    email: "guest@stephigh.com",
    label: "Guest Tier",
    badgeClass: "bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 border-stone-300 dark:border-stone-700",
    desc: "Browsing only (restricted pre-order permissions)",
  },
];

export function Navbar() {
  const pathname = usePathname();
  const [currentRole, setCurrentRole] = React.useState<"ADMIN" | "MEMBER" | "GUEST">("MEMBER");
  const [roleDropdownOpen, setRoleDropdownOpen] = React.useState(false);

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

  const switchRole = (role: "ADMIN" | "MEMBER" | "GUEST") => {
    setCurrentRole(role);
    document.cookie = `better-auth.session_token=mock_session_${role.toLowerCase()}; path=/; max-age=86400`;
    document.cookie = `mock_session_${role.toLowerCase()}=1; path=/; max-age=86400`;
    setRoleDropdownOpen(false);
    window.location.reload();
  };

  const activePersona = ROLES.find((r) => r.role === currentRole) || ROLES[1];

  const navLinks = [
    { href: "/", label: "Fleet Catalog" },
    { href: "/preorders", label: "Pre-Order" },
    { href: "/records", label: "Ledger" },
    { href: "/admin", label: "Admin" },
    { href: "/login", label: "Identity Gate" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-stone-200 dark:border-stone-800 bg-white/95 dark:bg-stone-950/95 backdrop-blur-sm">
      <div className="container flex h-14 items-center justify-between gap-4">
        {/* Minimal Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <span className="font-mono text-xs font-bold tracking-widest uppercase text-stone-950 dark:text-white">
            STEP HIGH
          </span>
          <span className="text-[10px] font-mono text-stone-500 border-l border-stone-300 dark:border-stone-700 pl-2">
            ZERO-G LAB
          </span>
        </Link>

        {/* Minimal Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1 text-xs font-mono tracking-wider uppercase transition-colors ${
                  isActive
                    ? "text-stone-950 dark:text-white font-bold border-b-2 border-stone-900 dark:border-white"
                    : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-200"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Active Role Selector */}
          <div className="relative">
            <button
              suppressHydrationWarning
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className="flex items-center gap-1.5 px-2 py-1 text-[11px] font-mono border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:border-stone-400 dark:hover:border-stone-600 transition-colors"
            >
              <span suppressHydrationWarning>{activePersona.label}</span>
              <ChevronDown className="h-3 w-3 opacity-60" />
            </button>

            {roleDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-64 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 shadow-lg p-1.5 z-50">
                <div className="px-2.5 py-1.5 border-b border-stone-100 dark:border-stone-800 mb-1">
                  <p className="text-[10px] uppercase font-mono tracking-wider text-stone-400">
                    Active Session Role
                  </p>
                  <p className="text-xs font-semibold text-stone-900 dark:text-stone-100 font-mono">
                    {activePersona.name}
                  </p>
                </div>

                <div className="space-y-0.5">
                  {ROLES.map((r) => (
                    <button
                      key={r.role}
                      onClick={() => switchRole(r.role as "ADMIN" | "MEMBER" | "GUEST")}
                      className={`w-full text-left px-2.5 py-1.5 transition-colors flex items-center justify-between text-xs font-mono ${
                        currentRole === r.role
                          ? "bg-stone-100 dark:bg-stone-800 font-bold text-stone-900 dark:text-stone-100"
                          : "hover:bg-stone-50 dark:hover:bg-stone-900 text-stone-600 dark:text-stone-400"
                      }`}
                    >
                      <div>
                        <div>{r.label}</div>
                        <div className="text-[10px] text-stone-400">{r.name}</div>
                      </div>
                      {currentRole === r.role && (
                        <span className="text-[10px] font-mono text-stone-900 dark:text-stone-100">[active]</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="mt-1 pt-1 border-t border-stone-100 dark:border-stone-800">
                  <Link
                    href="/login"
                    onClick={() => setRoleDropdownOpen(false)}
                    className="block text-center text-[10px] font-mono text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white py-1"
                  >
                    Identity Gateway &rarr;
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link href="/preorders" className="hidden sm:block">
            <Button
              size="sm"
              className="h-8 px-3 text-xs font-mono uppercase tracking-wider rounded-none bg-stone-900 hover:bg-stone-800 text-white dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200"
            >
              Pre-Order
            </Button>
          </Link>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
