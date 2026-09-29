import { createStore } from "zustand/vanilla";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  GenderCategory,
  SneakerColor,
  SneakerFilterState,
  SneakerFilterStore,
} from "@/lib/types";

export type { SneakerFilterStore };

export const defaultFilterState: SneakerFilterState = {
  gender: "All",
  selectedSizes: [9, 10], // Default popular sizes
  selectedColors: [],
  sortBy: "featured",
  hasHydrated: false,
};

/**
 * Factory function creating a scoped Zustand store instance for Sneaker Shop filters.
 *
 * ARCHITECTURAL REQUIREMENTS:
 * 1. Persistent Storage: Uses Zustand `persist` with `localStorage` so that when a user
 *    navigates away to another page or reloads, their Gender, Size, and Color selections remain intact.
 * 2. SSR Isolation: By generating the store via a factory function rather than a global singleton,
 *    we prevent cross-request contamination in Next.js Server Components.
 * 3. `skipHydration: true`: Prevents immediate synchronous hydration during server render,
 *    ensuring the server and initial client render produce identical HTML to eliminate hydration errors.
 */
export const createSneakerFilterStore = (
  initState: SneakerFilterState = defaultFilterState
) => {
  return createStore<SneakerFilterStore>()(
    persist(
      (set, get) => ({
        ...initState,

        setGender: (gender: GenderCategory | "All") => {
          set({ gender });
        },

        toggleSize: (size: number) => {
          const current = get().selectedSizes;
          if (current.includes(size)) {
            set({ selectedSizes: current.filter((s) => s !== size) });
          } else {
            set({ selectedSizes: [...current, size].sort((a, b) => a - b) });
          }
        },

        toggleColor: (color: SneakerColor) => {
          const current = get().selectedColors;
          if (current.includes(color)) {
            set({ selectedColors: current.filter((c) => c !== color) });
          } else {
            set({ selectedColors: [...current, color] });
          }
        },

        setSortBy: (sortBy) => {
          set({ sortBy });
        },

        resetFilters: () => {
          set({
            gender: "All",
            selectedSizes: [],
            selectedColors: [],
            sortBy: "featured",
          });
        },

        setHasHydrated: (status: boolean) => {
          set({ hasHydrated: status });
        },
      }),
      {
        name: "step-high-sneakers-filter-storage",
        storage: createJSONStorage(() => {
          if (typeof window !== "undefined") {
            return window.localStorage;
          }
          return {
            getItem: () => null,
            setItem: () => null,
            removeItem: () => null,
          };
        }),
        skipHydration: true,
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      }
    )
  );
};
