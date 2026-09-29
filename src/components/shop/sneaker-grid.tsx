"use client";

import * as React from "react";
import { ArrowUpRight } from "lucide-react";
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
  const [mounted, setMounted] = React.useState(false);
  const gender = useSneakerFilterStore((state) => state.gender);
  const selectedSizes = useSneakerFilterStore((state) => state.selectedSizes);
  const selectedColors = useSneakerFilterStore((state) => state.selectedColors);
  const resetFilters = useSneakerFilterStore((state) => state.resetFilters);
  const hasHydrated = useSneakerFilterStore((state) => state.hasHydrated);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const filteredSneakers = React.useMemo(() => {
    if (!mounted || !hasHydrated) return initialCatalog;

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
  }, [initialCatalog, gender, selectedSizes, selectedColors, hasHydrated, mounted]);

  const displayList = mounted && hasHydrated ? filteredSneakers : initialCatalog;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center border-b border-stone-200 dark:border-stone-800 pb-2 font-mono text-xs text-stone-500">
        <span suppressHydrationWarning>
          Showing [{displayList.length}] Silhouettes
        </span>
        <span className="text-[11px] uppercase tracking-wider">
          Supercritical Foam Tech
        </span>
      </div>

      {filteredSneakers.length === 0 ? (
        <div className="text-center py-16 border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/40 space-y-3">
          <p className="text-sm font-mono font-bold uppercase text-stone-900 dark:text-stone-100">
            No matching silhouettes found
          </p>
          <p className="text-xs font-mono text-stone-500">
            Adjust active filter parameters.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={resetFilters}
            className="rounded-none text-xs font-mono uppercase"
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredSneakers.map((sneaker) => (
            <Card
              key={sneaker.id}
              className="flex flex-col justify-between rounded-none border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-950 hover:border-stone-900 dark:hover:border-white transition-colors group"
            >
              {/* Header Canvas */}
              <div className="p-4 border-b border-stone-100 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/50">
                <div className="flex justify-between items-start font-mono text-[10px] text-stone-500 uppercase tracking-wider mb-3">
                  <span className="border border-stone-200 dark:border-stone-700 px-1.5 py-0.5 bg-white dark:bg-stone-900">
                    {sneaker.gender}
                  </span>
                  <span>{sneaker.weightGrams}g</span>
                </div>

                <div className="text-base font-bold uppercase tracking-tight text-stone-950 dark:text-white">
                  {sneaker.name}
                </div>
                <div className="text-xs text-stone-500 font-mono line-clamp-1 mt-0.5">
                  {sneaker.tagline}
                </div>
              </div>

              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-baseline font-mono">
                  <span className="text-xl font-bold text-stone-900 dark:text-stone-100">
                    ${sneaker.price}
                  </span>
                  <span className="text-[10px] uppercase text-stone-500">
                    Available for Drop
                  </span>
                </div>

                {/* Sizes Available */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block">
                    Sizes (US)
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {sneaker.sizes.map((sz) => (
                      <span
                        key={sz}
                        className={`text-[10px] font-mono px-1.5 py-0.5 border ${
                          selectedSizes.includes(sz)
                            ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold border-stone-900 dark:border-white"
                            : "bg-transparent text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800"
                        }`}
                      >
                        {sz}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Colorways */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-widest block">
                    Colorways
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {sneaker.colors.map((c) => (
                      <span
                        key={c}
                        className={`text-[10px] font-mono px-1.5 py-0.5 border ${
                          selectedColors.includes(c)
                            ? "border-stone-900 dark:border-white bg-stone-100 dark:bg-stone-800 font-bold text-stone-900 dark:text-stone-100"
                            : "border-stone-200 dark:border-stone-800 text-stone-500"
                        }`}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-9 rounded-none border-stone-200 dark:border-stone-800 text-xs font-mono uppercase tracking-wider hover:bg-stone-900 hover:text-white dark:hover:bg-white dark:hover:text-stone-900 transition-colors flex items-center justify-center gap-1"
                  onClick={() => {
                    const preorderAnchor = document.getElementById("preorder-section");
                    preorderAnchor?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  <span>Pre-Order Allocation</span>
                  <ArrowUpRight className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
