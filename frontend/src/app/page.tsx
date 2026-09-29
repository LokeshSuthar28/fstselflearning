import { Suspense } from "react";
import { FilterPanel } from "@/components/shop/filter-panel";
import { SneakerGrid } from "@/components/shop/sneaker-grid";
import { PreorderForm } from "@/components/preorder/preorder-form";
import { PreorderSkeleton } from "@/components/preorder/preorder-skeleton";
import type { SneakerItem } from "@/lib/types";
import { Feather, Flame, Sparkles, Activity, Zap, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const SNEAKER_CATALOG: SneakerItem[] = [
  {
    id: "snk-01",
    name: "AeroStride Zero-G",
    tagline: "Sub-170g competition runner engineered with super-critical nitrogen foam.",
    price: 240,
    gender: "Men's",
    sizes: [8, 9, 10, 10.5, 11, 12],
    colors: ["Volt Neon", "Triple Black", "Cloud White"],
    weightGrams: 165,
    inStock: true,
    imageAccent: "from-amber-500/20 via-orange-600/25 to-stone-900/80",
  },
  {
    id: "snk-02",
    name: "Quantum Foam V2 Carbon",
    tagline: "Dual-density carbon propulsion plate delivering 89% kinetic energy return.",
    price: 295,
    gender: "Unisex",
    sizes: [7, 8, 9, 9.5, 10, 11],
    colors: ["Triple Black", "Lunar Grey"],
    weightGrams: 182,
    inStock: true,
    imageAccent: "from-stone-700/30 via-amber-900/20 to-stone-950",
  },
  {
    id: "snk-03",
    name: "CloudStrider Flow",
    tagline: "Ultra-cushioned marathon road shoe with zero ground-impact resistance.",
    price: 210,
    gender: "Women's",
    sizes: [7, 8, 9, 9.5, 10],
    colors: ["Cloud White", "Aurora Blue"],
    weightGrams: 158,
    inStock: true,
    imageAccent: "from-orange-400/25 via-amber-500/20 to-stone-900/80",
  },
  {
    id: "snk-04",
    name: "Graviton Pulse Track",
    tagline: "Short-distance zero-gravity spikes calibrated for maximum forward vector.",
    price: 275,
    gender: "Men's",
    sizes: [9, 10, 10.5, 11, 12],
    colors: ["Volt Neon", "Lunar Grey"],
    weightGrams: 148,
    inStock: true,
    imageAccent: "from-amber-600/30 via-orange-500/30 to-stone-950",
  },
  {
    id: "snk-05",
    name: "Apex Vapor Glide",
    tagline: "Breathable monomesh upper coupled with anti-gravity rebound cells.",
    price: 225,
    gender: "Women's",
    sizes: [7, 8, 8.5, 9, 10],
    colors: ["Triple Black", "Cloud White", "Aurora Blue"],
    weightGrams: 162,
    inStock: true,
    imageAccent: "from-rose-500/20 via-orange-500/20 to-stone-950",
  },
  {
    id: "snk-06",
    name: "Lunar Tempo Nitro",
    tagline: "Daily high-mileage trainer that cancels muscular fatigue on concrete.",
    price: 195,
    gender: "Unisex",
    sizes: [7, 8, 9, 10, 11, 12],
    colors: ["Lunar Grey", "Volt Neon"],
    weightGrams: 174,
    inStock: true,
    imageAccent: "from-amber-500/25 via-stone-700/20 to-stone-950",
  },
];

export default function ShopPage() {
  return (
    <div className="container py-8 space-y-16">
      {/* 
        ========================================================================
        1. WARM CINEMATIC HERO SECTION WITH ALABASTER VIGNETTE OVERLAY
        Image: watermarked_img_11425268321124990554.png
        ========================================================================
      */}
      <section className="relative rounded-3xl overflow-hidden border border-amber-900/10 dark:border-white/10 shadow-2xl min-h-[540px] flex items-center justify-center text-center p-6 sm:p-14">
        {/* Background Image Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
          style={{
            backgroundImage: `url('/watermarked_img_11425268321124990554.png')`,
          }}
        />

        {/* 
          WARM CINEMATIC VIGNETTE OVERLAY:
          Soft warm cream gradient allowing the shoes to stand out while ensuring rich dark contrast for typography.
        */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(254,249,240,0.30)_0%,_rgba(250,244,234,0.85)_60%,_#faf7f2_100%)] dark:bg-[radial-gradient(ellipse_at_center,_rgba(24,20,15,0.40)_0%,_rgba(24,20,15,0.85)_60%,_#181410_100%)] backdrop-blur-[1px]" />

        {/* Hero Content */}
        <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
          {/* Warm Amber Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/15 backdrop-blur-md px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-amber-800 dark:text-amber-300 shadow-sm">
            <Feather className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
            <span>Zero-Gravity Propulsion • 2026 Fleet</span>
          </div>

          {/* Warm Gradient Typography */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-widest leading-none drop-shadow-sm text-stone-900 dark:text-white">
            Defy Gravity. <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 dark:from-amber-400 dark:to-orange-400">
              Run on Pure Air.
            </span>
          </h1>

          <p className="text-stone-700 dark:text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-medium">
            Engineered with nitrogen-infused supercritical foam and aerospace-grade carbon lever plates.
            Sub-170g competition silhouettes delivering 89% kinetic rebound.
          </p>

          {/* Warm Amber CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a href="#preorder-section">
              <Button
                size="lg"
                className="h-12 px-8 font-black uppercase tracking-widest text-xs bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white shadow-[0_0_20px_rgba(245,124,0,0.35)] hover:shadow-[0_0_30px_rgba(245,124,0,0.55)] hover:scale-105 active:scale-95 transition-all duration-300 ease-out flex items-center gap-2"
              >
                <Zap className="h-4 w-4 fill-current text-white" />
                <span>Reserve Drop Allocation</span>
              </Button>
            </a>

            <a href="#collection-section">
              <Button
                variant="outline"
                size="lg"
                className="h-12 px-8 font-bold uppercase tracking-widest text-xs border-amber-900/15 dark:border-white/20 bg-white/70 dark:bg-stone-900/40 backdrop-blur-md text-foreground hover:bg-white hover:border-amber-500/50 hover:shadow-md transition-all duration-300 ease-out flex items-center gap-2"
              >
                <span>Explore Silhouettes</span>
                <ArrowDown className="h-3.5 w-3.5" />
              </Button>
            </a>
          </div>

          {/* Key Spec Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded-2xl border border-amber-900/10 dark:border-white/10 bg-white/75 dark:bg-stone-900/60 backdrop-blur-md shadow-sm flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                <Activity className="h-4 w-4" />
              </div>
              <div>
                <div className="font-bold text-xs uppercase tracking-wider text-foreground">
                  89% Energy Return
                </div>
                <div className="text-[11px] text-muted-foreground">Supercritical Foam Matrix</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-amber-900/10 dark:border-white/10 bg-white/75 dark:bg-stone-900/60 backdrop-blur-md shadow-sm flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                <Feather className="h-4 w-4" />
              </div>
              <div>
                <div className="font-bold text-xs uppercase tracking-wider text-foreground">
                  165g Featherweight
                </div>
                <div className="text-[11px] text-muted-foreground">Zero Bulk Traversal</div>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl border border-amber-900/10 dark:border-white/10 bg-white/75 dark:bg-stone-900/60 backdrop-blur-md shadow-sm flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                <Zap className="h-4 w-4" />
              </div>
              <div>
                <div className="font-bold text-xs uppercase tracking-wider text-foreground">
                  Persistent State
                </div>
                <div className="text-[11px] text-muted-foreground">Zustand Sync Active</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        2. SHOP & PERSISTENT FILTER PANEL SECTION
        ========================================================================
      */}
      <section id="collection-section" className="space-y-6 pt-4">
        <div className="border-b border-amber-900/10 dark:border-white/10 pb-4 flex flex-col sm:flex-row justify-between sm:items-end gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-widest text-stone-900 dark:text-white">
              Zero-G Silhouette Lineup
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Interactive filters persist in <span className="text-amber-600 dark:text-amber-400 font-mono font-bold">localStorage</span> across navigation visits.
            </p>
          </div>
          <div className="text-xs font-mono text-muted-foreground flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-semibold text-stone-700 dark:text-stone-300">Zustand State Synced</span>
          </div>
        </div>

        {/* Two-Column Grid: Filter Panel + Sneaker Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          <div className="lg:col-span-1">
            <FilterPanel />
          </div>
          <div className="lg:col-span-3">
            <SneakerGrid initialCatalog={SNEAKER_CATALOG} />
          </div>
        </div>
      </section>

      {/* 
        ========================================================================
        3. LIMITED EDITION PRE-ORDER (SERVER ACTION MUTATION)
        ========================================================================
      */}
      <section className="space-y-6 pt-12 border-t border-amber-900/10 dark:border-white/10">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            <Sparkles className="h-4 w-4" />
            <span>Priority Queue Allocation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-widest bg-clip-text text-transparent bg-gradient-to-r from-amber-600 via-orange-600 to-amber-800 dark:from-amber-400 dark:to-orange-400">
            Lock In Your Place In Line
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Strictly limited batch allocation. Form state is processed via native Next.js Server Actions with isomorphic Zod validation schemas.
          </p>
        </div>

        <Suspense fallback={<PreorderSkeleton />}>
          <PreorderForm />
        </Suspense>
      </section>
    </div>
  );
}
