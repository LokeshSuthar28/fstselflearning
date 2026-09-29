import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { FilterStoreProvider } from "@/components/providers/filter-store-provider";
import { Toaster } from "@/components/ui/toaster";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Step High Sneakers | Zero-Gravity Running Footwear",
  description:
    "Zero-gravity running shoes engineered with supercritical nitrogen foam, normalized PostgreSQL Prisma backend, Better Auth Edge RBAC, and Resend lifecycle notifications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <FilterStoreProvider>
            <div className="relative flex min-h-screen flex-col">
              {/* Minimal Navigation Bar */}
              <Navbar />

              {/* Main Content Area */}
              <main className="flex-1">{children}</main>

              {/* Minimalist Footer */}
              <footer className="border-t border-stone-200 dark:border-stone-800 py-8 text-center text-xs text-stone-500 bg-stone-50 dark:bg-stone-950 font-mono">
                <div className="container space-y-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold tracking-widest uppercase text-stone-900 dark:text-stone-100">
                        STEP HIGH ZERO-G
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-5 text-[11px] text-stone-500">
                      <Link href="/" className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                        Catalog
                      </Link>
                      <Link href="/preorders" className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                        Pre-Orders
                      </Link>
                      <Link href="/records" className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                        Ledger
                      </Link>
                      <Link href="/admin" className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                        Admin Hub
                      </Link>
                      <Link href="/login" className="hover:text-stone-900 dark:hover:text-stone-100 transition-colors">
                        Identity Gate
                      </Link>
                    </div>
                  </div>

                  <div className="border-t border-stone-200 dark:border-stone-800 pt-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-stone-400">
                    <div>
                      PostgreSQL &bull; Prisma ORM &bull; Better Auth RBAC &bull; Resend Webhooks
                    </div>
                    <div>
                      Next.js App Router Architecture
                    </div>
                  </div>
                </div>
              </footer>
            </div>

            <Toaster />
          </FilterStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
