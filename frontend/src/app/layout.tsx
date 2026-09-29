import type { Metadata } from "next";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { FilterStoreProvider } from "@/components/providers/filter-store-provider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Zap, Footprints, ShieldCheck } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Step High Sneakers | Zero-Gravity Running Footwear",
  description:
    "Aesthetic zero-gravity running shoes engineered with supercritical nitrogen foam and carbon leverage plates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased text-foreground selection:bg-amber-500/20 selection:text-amber-800">
        {/*
          THEME PROVIDER:
          Set to 'light' default to render the warm light aesthetic immediately on first load.
        */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <FilterStoreProvider>
            <div className="relative flex min-h-screen flex-col">
              {/* 
                WARM FROSTED GLASS HEADER:
                backdrop-blur-md, bg-white/70, border-b border-amber-950/10
              */}
              <header className="sticky top-0 z-40 w-full border-b border-amber-900/10 dark:border-white/10 bg-white/75 dark:bg-stone-900/75 backdrop-blur-md transition-all duration-300">
                <div className="container flex h-16 items-center justify-between">
                  {/* Brand Logo with Warm Sunset Accent */}
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-black flex items-center justify-center shadow-[0_0_15px_rgba(245,124,0,0.35)]">
                      <Footprints className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="font-black tracking-widest text-lg sm:text-xl uppercase bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 dark:from-amber-400 dark:to-orange-400">
                        Step High
                      </span>
                      <span className="ml-2.5 text-[9px] font-mono tracking-widest uppercase bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded-full font-bold">
                        Zero-G Lab
                      </span>
                    </div>
                  </div>

                  {/* Header Actions */}
                  <div className="flex items-center gap-3">
                    <a href="#preorder-section">
                      <Button
                        size="sm"
                        className="font-bold text-xs uppercase tracking-widest bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-[0_0_15px_rgba(245,124,0,0.3)] hover:shadow-[0_0_22px_rgba(245,124,0,0.5)] transition-all duration-300 ease-out hidden sm:flex items-center gap-1.5"
                      >
                        <Zap className="h-3.5 w-3.5 fill-current" />
                        <span>Pre-Order Drop</span>
                      </Button>
                    </a>
                    <ThemeToggle />
                  </div>
                </div>
              </header>

              {/* Main App Content Area */}
              <main className="flex-1">{children}</main>

              {/* Footer */}
              <footer className="border-t border-amber-900/10 dark:border-white/10 py-8 text-center text-xs text-muted-foreground bg-stone-100/60 dark:bg-stone-900/80 backdrop-blur-md">
                <div className="container flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Footprints className="h-4 w-4 text-primary" />
                    <p className="font-black tracking-widest uppercase text-foreground">
                      STEP HIGH ZERO-G INC.
                    </p>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Next.js App Router • Persistent Zustand State • Server Actions</span>
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
