"use client";

import * as React from "react";
import { Feather, Flame, ArrowUpRight } from "lucide-react";
import { useSneakerFilterStore } from "@/components/providers/filter-store-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import type { SneakerItem } from "@/lib/types";

interface SneakerGridProps {
  initialCatalog: SneakerItem[];
}

export function SneakerGrid({ initialCatalog }: SneakerGridProps) {
  const gender = useSneakerFilterStore((state) => state.gender);
  const selectedSizes = useSneakerFilterStore((state) => state.selectedSizes);
  const selectedColors = useSneakerFilterStore((state) => state.selectedColors);
  const resetFilters = useSneakerFilterStore((state) => state.resetFilters);
  const hasHydrated = useSneakerFilterStore((state) => state.hasHydrated);

  const filteredSneakers = React.useMemo(() => {
    if (!hasHydrated) return initialCatalog;

    return initialCatalog.filter((sneaker) => {
      if (gender !== "All" && sneaker.gender !== "Unisex" && sneaker.gender !== gender) {
        return false;
      }

      if (selectedSizes.length > 0) {
        const hasMatchingSize = selectedSizes.some((sz) =>
          sneaker.sizes.includes(sz)
        );
        if (!hasMatchingSize) return false;
      }

      if (selectedColors.length > 0) {
        const hasMatchingColor = selectedColors.some((col) =>
          sneaker.colors.includes(col)
        );
        if (!hasMatchingColor) return false;
      }

      return true;
    });
  }, [initialCatalog, gender, selectedSizes, selectedColors, hasHydrated]);

  return (
    <div className="space-y-5">
      <div className="flex justify-between items-center border-b border-amber-900/10 dark:border-white/10 pb-3">
        <span className="text-xs uppercase tracking-widest font-mono text-muted-foreground">
          Showing <strong className="text-amber-600 dark:text-amber-400">{filteredSneakers.length}</strong> Zero-G Silhouettes
        </span>
        <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-1.5 uppercase tracking-wider font-mono">
          <Feather className="h-3.5 w-3.5" />
          <span>Super-Critical Foam Tech</span>
        </span>
      </div>

      {filteredSneakers.length === 0 ? (
        <div className="text-center py-20 border border-amber-900/10 dark:border-white/10 rounded-2xl backdrop-blur-md bg-white/70 dark:bg-stone-900/50 space-y-4 shadow-xl">
          <p className="text-base font-bold uppercase tracking-wider text-foreground">No matching silhouettes found.</p>
          <p className="text-xs text-muted-foreground">
            Adjust your active gender, size, or colorway filter selections.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-50 hover:shadow-sm transition-all duration-300 ease-out uppercase tracking-widest text-xs"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSneakers.map((sneaker) => (
            <Card
              key={sneaker.id}
              className="flex flex-col justify-between backdrop-blur-md bg-white/80 dark:bg-stone-900/60 border border-amber-900/10 dark:border-white/10 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 transition-all duration-300 ease-out group overflow-hidden rounded-2xl"
            >
              {/* Dynamic Gradient Sneaker Header Canvas */}
              <div
                className={`h-44 p-4 flex flex-col justify-between relative overflow-hidden bg-gradient-to-br ${sneaker.imageAccent}`}
              >
                <div className="flex justify-between items-start z-10">
                  <span className="text-[10px] font-mono font-black uppercase tracking-widest bg-stone-950/80 text-amber-300 border border-amber-500/30 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm">
                    {sneaker.gender}
                  </span>
                  <div className="flex items-center gap-1 bg-stone-950/80 border border-white/10 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-mono font-bold text-white">
                    <Feather className="h-3 w-3 text-amber-400" />
                    <span>{sneaker.weightGrams}g</span>
                  </div>
                </div>

                <div className="z-10 mt-auto">
                  <div className="text-lg font-black tracking-tight uppercase text-white drop-shadow-md">
                    {sneaker.name}
                  </div>
                  <div className="text-xs text-white/90 font-medium line-clamp-1">
                    {sneaker.tagline}
                  </div>
                </div>

                <div className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-amber-500/20 blur-2xl group-hover:scale-150 transition-transform duration-500" />
              </div>

              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-mono text-2xl font-black text-foreground">
                    ${sneaker.price}
                  </span>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                    <Flame className="h-3 w-3" />
                    <span>Drop Active</span>
                  </span>
                </div>

                {/* Sizes Available */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Available US Sizes
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {sneaker.sizes.map((sz) => (
                      <span
                        key={sz}
                        className={`text-[10px] font-mono px-2 py-0.5 rounded border transition-all duration-300 ease-out ${
                          selectedSizes.includes(sz)
                            ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent font-black shadow-sm"
                            : "bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-muted-foreground border-stone-200 dark:border-white/10"
                        }`}
                      >
                        {sz}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Colorways */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Engineered Colorways
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {sneaker.colors.map((c) => (
                      <span
                        key={c}
                        className={`text-[10px] px-2 py-0.5 rounded-md border transition-all duration-300 ease-out ${
                          selectedColors.includes(c)
                            ? "border-amber-500/60 bg-amber-500/15 text-amber-900 dark:text-amber-200 font-bold"
                            : "border-stone-200 dark:border-white/10 bg-stone-100/70 dark:bg-stone-800/40 text-stone-600 dark:text-muted-foreground"
                        }`}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-5 pt-0 border-t border-amber-900/10 dark:border-white/10 bg-stone-50/60 dark:bg-stone-950/30">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-10 border-stone-200 dark:border-white/10 hover:border-amber-500/60 hover:text-amber-700 dark:hover:text-amber-300 hover:shadow-md transition-all duration-300 ease-out uppercase tracking-widest text-xs font-bold flex items-center justify-center gap-1.5 group-hover:bg-amber-500/10"
                  onClick={() => {
                    const preorderAnchor = document.getElementById("preorder-section");
                    preorderAnchor?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <span>Reserve Drop</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
