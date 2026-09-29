"use client";

import * as React from "react";
import { SlidersHorizontal, RotateCcw, Check } from "lucide-react";
import { useSneakerFilterStore } from "@/components/providers/filter-store-provider";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import type { GenderCategory, SneakerColor } from "@/lib/types";

const ALL_GENDERS: Array<GenderCategory | "All"> = [
  "All",
  "Men's",
  "Women's",
  "Unisex",
];

const AVAILABLE_SIZES = [7, 8, 9, 9.5, 10, 10.5, 11, 12];

const AVAILABLE_COLORS: SneakerColor[] = [
  "Triple Black",
  "Cloud White",
  "Volt Neon",
  "Lunar Grey",
  "Aurora Blue",
];

export function FilterPanel() {
  const [mounted, setMounted] = React.useState(false);
  const gender = useSneakerFilterStore((state) => state.gender);
  const setGender = useSneakerFilterStore((state) => state.setGender);
  const selectedSizes = useSneakerFilterStore((state) => state.selectedSizes);
  const toggleSize = useSneakerFilterStore((state) => state.toggleSize);
  const selectedColors = useSneakerFilterStore((state) => state.selectedColors);
  const toggleColor = useSneakerFilterStore((state) => state.toggleColor);
  const resetFilters = useSneakerFilterStore((state) => state.resetFilters);
  const hasHydrated = useSneakerFilterStore((state) => state.hasHydrated);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isReady = mounted && hasHydrated;

  const activeFiltersCount =
    (gender !== "All" ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length;

  return (
    <Card className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-none sticky top-20">
      <CardHeader className="p-4 border-b border-stone-200 dark:border-stone-800 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-3.5 w-3.5 text-stone-500" />
          <CardTitle className="text-xs font-mono font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100">
            Filters
          </CardTitle>
          {isReady && activeFiltersCount > 0 && (
            <span suppressHydrationWarning className="px-1.5 py-0.5 text-[10px] font-mono border border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100">
              [{activeFiltersCount}]
            </span>
          )}
        </div>

        {isReady && activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-6 px-2 text-[10px] font-mono uppercase tracking-wider text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 rounded-none"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            <span>Reset</span>
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-4 space-y-5">
        {!isReady ? (
          <div className="space-y-3 py-2 animate-pulse">
            <div className="h-3 bg-stone-200 dark:bg-stone-800 w-1/3" />
            <div className="flex gap-1.5">
              <div className="h-7 bg-stone-200 dark:bg-stone-800 w-14" />
              <div className="h-7 bg-stone-200 dark:bg-stone-800 w-14" />
            </div>
          </div>
        ) : (
          <>
            {/* 1. GENDER FILTER */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest block">
                Category
              </label>
              <div className="grid grid-cols-2 gap-1">
                {ALL_GENDERS.map((g) => {
                  const isActive = gender === g;
                  return (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`h-7 px-2 text-xs font-mono tracking-wider uppercase border transition-colors ${
                        isActive
                          ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold border-stone-900 dark:border-white"
                          : "border-stone-200 dark:border-stone-800 bg-transparent text-stone-600 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-600"
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. US SHOE SIZE FILTER */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest">
                  Size (US)
                </label>
                {selectedSizes.length > 0 && (
                  <span className="text-[10px] font-mono text-stone-900 dark:text-stone-100 font-bold">
                    {selectedSizes.join(", ")}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1">
                {AVAILABLE_SIZES.map((sz) => {
                  const isSelected = selectedSizes.includes(sz);
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => toggleSize(sz)}
                      className={`h-7 text-xs font-mono transition-colors border ${
                        isSelected
                          ? "bg-stone-900 dark:bg-white text-white dark:text-stone-900 font-bold border-stone-900 dark:border-white"
                          : "border-stone-200 dark:border-stone-800 bg-transparent text-stone-600 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-600"
                      }`}
                    >
                      {sz}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. COLORWAY FILTER */}
            <div className="space-y-2">
              <label className="text-[10px] font-mono font-bold text-stone-500 uppercase tracking-widest block">
                Colorway
              </label>
              <div className="flex flex-col gap-1">
                {AVAILABLE_COLORS.map((col) => {
                  const isSelected = selectedColors.includes(col);
                  return (
                    <button
                      key={col}
                      type="button"
                      onClick={() => toggleColor(col)}
                      className={`flex items-center justify-between px-2.5 py-1.5 text-xs font-mono border transition-colors ${
                        isSelected
                          ? "border-stone-900 dark:border-white bg-stone-100 dark:bg-stone-800 font-bold text-stone-900 dark:text-stone-100"
                          : "border-stone-200 dark:border-stone-800 bg-transparent text-stone-600 dark:text-stone-400 hover:border-stone-400 dark:hover:border-stone-600"
                      }`}
                    >
                      <span>{col}</span>
                      {isSelected && <Check className="h-3 w-3" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Persistence note */}
            <div className="border-t border-stone-100 dark:border-stone-800 pt-3 text-[10px] font-mono text-stone-400">
              State synced with local storage.
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
