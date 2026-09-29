"use client";

import * as React from "react";
import { SlidersHorizontal, RotateCcw, Check, Sparkles } from "lucide-react";
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
  const gender = useSneakerFilterStore((state) => state.gender);
  const setGender = useSneakerFilterStore((state) => state.setGender);
  const selectedSizes = useSneakerFilterStore((state) => state.selectedSizes);
  const toggleSize = useSneakerFilterStore((state) => state.toggleSize);
  const selectedColors = useSneakerFilterStore((state) => state.selectedColors);
  const toggleColor = useSneakerFilterStore((state) => state.toggleColor);
  const resetFilters = useSneakerFilterStore((state) => state.resetFilters);
  const hasHydrated = useSneakerFilterStore((state) => state.hasHydrated);

  const activeFiltersCount =
    (gender !== "All" ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length;

  return (
    <Card className="backdrop-blur-md bg-white/80 dark:bg-stone-900/60 border border-amber-900/10 dark:border-white/10 shadow-xl rounded-2xl sticky top-24 overflow-hidden transition-all duration-300 ease-out">
      <CardHeader className="p-4 border-b border-amber-900/10 dark:border-white/10 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <CardTitle className="text-xs font-black uppercase tracking-widest text-foreground">
            Zero-G Filters
          </CardTitle>
          {hasHydrated && activeFiltersCount > 0 && (
            <span className="rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 px-2 py-0.5 text-[10px] font-mono font-bold shadow-sm">
              {activeFiltersCount}
            </span>
          )}
        </div>

        {hasHydrated && activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="h-7 text-xs text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10 transition-all duration-300 ease-out flex items-center gap-1"
          >
            <RotateCcw className="h-3 w-3" />
            <span className="uppercase tracking-wider text-[10px] font-semibold">Reset</span>
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-5 space-y-6">
        {!hasHydrated ? (
          <div className="space-y-4 py-4 animate-pulse">
            <div className="h-4 bg-stone-200 dark:bg-white/10 rounded w-1/3" />
            <div className="flex gap-2">
              <div className="h-8 bg-stone-200 dark:bg-white/10 rounded w-16" />
              <div className="h-8 bg-stone-200 dark:bg-white/10 rounded w-16" />
            </div>
          </div>
        ) : (
          <>
            {/* 1. GENDER FILTER */}
            <div className="space-y-2.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                Gender Classification
              </label>
              <div className="flex flex-wrap gap-1.5">
                {ALL_GENDERS.map((g) => {
                  const isActive = gender === g;
                  return (
                    <Button
                      key={g}
                      type="button"
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => setGender(g)}
                      className={`h-8 text-xs font-bold tracking-wider uppercase transition-all duration-300 ease-out ${
                        isActive
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black shadow-[0_0_15px_rgba(245,124,0,0.35)] border-transparent"
                          : "border-stone-200 dark:border-white/10 bg-white/60 dark:bg-stone-900/40 text-stone-700 dark:text-muted-foreground hover:text-foreground hover:border-amber-500/40 hover:bg-amber-50/50"
                      }`}
                    >
                      {g}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* 2. US SHOE SIZE FILTER */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                  US Shoe Size
                </label>
                {selectedSizes.length > 0 && (
                  <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">
                    {selectedSizes.join(", ")}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-4 gap-1.5">
                {AVAILABLE_SIZES.map((sz) => {
                  const isSelected = selectedSizes.includes(sz);
                  return (
                    <Button
                      key={sz}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSize(sz)}
                      className={`h-8 text-xs font-mono font-bold transition-all duration-300 ease-out ${
                        isSelected
                          ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-[0_0_15px_rgba(245,124,0,0.35)] border-transparent font-black"
                          : "border-stone-200 dark:border-white/10 bg-white/60 dark:bg-stone-900/40 text-stone-700 dark:text-muted-foreground hover:text-foreground hover:border-amber-500/40 hover:bg-amber-50/50"
                      }`}
                    >
                      {sz}
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* 3. COLORWAY FILTER */}
            <div className="space-y-2.5">
              <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">
                Colorway
              </label>
              <div className="flex flex-col gap-1.5">
                {AVAILABLE_COLORS.map((col) => {
                  const isSelected = selectedColors.includes(col);
                  return (
                    <button
                      key={col}
                      type="button"
                      onClick={() => toggleColor(col)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs border transition-all duration-300 ease-out ${
                        isSelected
                          ? "border-amber-500/60 bg-amber-500/15 text-amber-900 dark:text-amber-200 font-bold shadow-sm"
                          : "border-stone-200 dark:border-white/10 bg-white/50 dark:bg-stone-900/30 text-stone-700 dark:text-muted-foreground hover:text-foreground hover:border-amber-400/40 hover:bg-amber-50/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`h-3 w-3 rounded-full border shadow-sm ${
                            col === "Triple Black"
                              ? "bg-stone-900 border-stone-800"
                              : col === "Cloud White"
                              ? "bg-white border-stone-300"
                              : col === "Volt Neon"
                              ? "bg-lime-400 border-lime-500 shadow-sm"
                              : col === "Lunar Grey"
                              ? "bg-stone-400 border-stone-500"
                              : "bg-cyan-500 border-cyan-600 shadow-sm"
                          }`}
                        />
                        <span className="tracking-wide font-medium">{col}</span>
                      </div>
                      {isSelected && <Check className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* PERSISTENT MEMORY GUARANTEE */}
            <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 dark:bg-amber-950/20 p-3 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2 shadow-inner">
              <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5 animate-pulse" />
              <span>
                Filters stay active via persistent <strong>localStorage</strong> when navigating across the shop.
              </span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
