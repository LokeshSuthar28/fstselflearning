import { Suspense } from "react";
import { FilterPanel } from "@/components/shop/filter-panel";
import { SneakerGrid } from "@/components/shop/sneaker-grid";
import { PreorderForm } from "@/components/preorder/preorder-form";
import { PreorderSkeleton } from "@/components/preorder/preorder-skeleton";
import type { SneakerItem } from "@/lib/types";
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
    imageAccent: "from-stone-500/10 to-stone-900/40",
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
    imageAccent: "from-stone-500/10 to-stone-900/40",
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
    imageAccent: "from-stone-500/10 to-stone-900/40",
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
    imageAccent: "from-stone-500/10 to-stone-900/40",
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
    imageAccent: "from-stone-500/10 to-stone-900/40",
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
    imageAccent: "from-stone-500/10 to-stone-900/40",
  },
];

export default function ShopPage() {
  return (
    <div className="container py-8 space-y-14">
      {/* Minimalist Hero Section */}
      <section className="relative border border-stone-200 dark:border-stone-800 min-h-[440px] flex items-center justify-center text-center p-8 sm:p-14 bg-stone-50/50 dark:bg-stone-900/30">
        <div className="relative z-10 space-y-6 max-w-3xl mx-auto">
          <div className="inline-block px-2.5 py-1 text-[11px] font-mono uppercase tracking-widest text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900">
            Zero-Gravity Propulsion &bull; 2026 Fleet
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-light uppercase tracking-tight text-stone-950 dark:text-white leading-tight">
            Defy Gravity. <br />
            <span className="font-bold tracking-normal text-stone-900 dark:text-stone-100">
              Run on Pure Air.
            </span>
          </h1>

          <p className="text-stone-600 dark:text-stone-400 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed font-mono">
            Engineered with nitrogen-infused supercritical foam and aerospace-grade carbon lever plates.
            Sub-170g competition silhouettes delivering 89% kinetic rebound.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a href="#preorder-section">
              <Button
                size="lg"
                className="h-10 px-6 font-mono uppercase tracking-wider text-xs rounded-none bg-stone-900 hover:bg-stone-800 text-white dark:bg-white dark:text-stone-900 dark:hover:bg-stone-200 transition-colors"
              >
                Reserve Pre-Order
              </Button>
            </a>

            <a href="#collection-section">
              <Button
                variant="outline"
                size="lg"
                className="h-10 px-6 font-mono uppercase tracking-wider text-xs rounded-none border-stone-300 dark:border-stone-700 bg-transparent text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                Explore Fleet
              </Button>
            </a>
          </div>

          {/* Minimalist Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-6 max-w-2xl mx-auto text-left">
            <div className="p-3 border border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-900/60 font-mono">
              <div className="font-bold text-xs uppercase text-stone-900 dark:text-stone-100">
                89% Energy Return
              </div>
              <div className="text-[10px] text-stone-500">Supercritical Matrix</div>
            </div>

            <div className="p-3 border border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-900/60 font-mono">
              <div className="font-bold text-xs uppercase text-stone-900 dark:text-stone-100">
                165g Net Weight
              </div>
              <div className="text-[10px] text-stone-500">Sub-170g Benchmark</div>
            </div>

            <div className="p-3 border border-stone-200 dark:border-stone-800 bg-white/60 dark:bg-stone-900/60 font-mono">
              <div className="font-bold text-xs uppercase text-stone-900 dark:text-stone-100">
                State Persisted
              </div>
              <div className="text-[10px] text-stone-500">Zustand Sync Active</div>
            </div>
          </div>
        </div>
      </section>

      {/* Shop & Filter Section */}
      <section id="collection-section" className="space-y-6 pt-2">
        <div className="border-b border-stone-200 dark:border-stone-800 pb-3 flex flex-col sm:flex-row justify-between sm:items-end gap-2">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-stone-900 dark:text-stone-100">
              Zero-G Silhouettes
            </h2>
            <p className="text-xs font-mono text-stone-500 mt-0.5">
              Client filter parameters persist across navigation in local storage.
            </p>
          </div>
          <div className="text-[11px] font-mono text-stone-500">
            Zustand Store Connected
          </div>
        </div>

        {/* Two-Column Grid: Filter Panel + Sneaker Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          <div className="lg:col-span-1">
            <FilterPanel />
          </div>
          <div className="lg:col-span-3">
            <SneakerGrid initialCatalog={SNEAKER_CATALOG} />
          </div>
        </div>
      </section>

      {/* Minimalist Pre-Order Section */}
      <section className="space-y-6 pt-10 border-t border-stone-200 dark:border-stone-800">
        <div className="text-center max-w-lg mx-auto space-y-1">
          <div className="text-[11px] font-mono uppercase tracking-widest text-stone-500">
            Drop Queue Allocation
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-stone-900 dark:text-white">
            Pre-Order Spot Reservation
          </h2>
          <p className="text-xs font-mono text-stone-500">
            Validated via isomorphic Zod schema and executed by native Next.js Server Action.
          </p>
        </div>

        <Suspense fallback={<PreorderSkeleton />}>
          <PreorderForm />
        </Suspense>
      </section>
    </div>
  );
}
