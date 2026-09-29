"use client";

import {
  type ReactNode,
  createContext,
  useRef,
  useContext,
  useEffect,
} from "react";
import { useStore } from "zustand";
import {
  type SneakerFilterStore,
  createSneakerFilterStore,
  defaultFilterState,
} from "@/store/filter-store";

export type SneakerFilterStoreApi = ReturnType<typeof createSneakerFilterStore>;

export const SneakerFilterStoreContext = createContext<
  SneakerFilterStoreApi | undefined
>(undefined);

export interface FilterStoreProviderProps {
  children: ReactNode;
}

/**
 * FilterStoreProvider encapsulates the Zustand store within a React Context.
 *
 * PERFORMANCE & ARCHITECTURAL HIGHLIGHTS:
 * 1. Safe Layout Injection: By instantiating the store once in `useRef` and passing `children`,
 *    the root layout (`layout.tsx`) remains purely a server layout and never re-renders when
 *    filters change.
 * 2. Hydration Isolation: Explicit rehydration occurs in a browser-only `useEffect`. This ensures
 *    initial server-rendered HTML perfectly aligns with the client pre-hydration tree, eliminating
 *    React hydration mismatch errors.
 * 3. Scoped Atomic Selectors: Components consume slices via `useSneakerFilterStore((state) => state.gender)`
 *    so components only re-render when their observed slice changes.
 */
export const FilterStoreProvider = ({ children }: FilterStoreProviderProps) => {
  const storeRef = useRef<SneakerFilterStoreApi>();

  if (!storeRef.current) {
    storeRef.current = createSneakerFilterStore(defaultFilterState);
  }

  useEffect(() => {
    // Explicit rehydration triggered strictly on client mount
    if (storeRef.current) {
      storeRef.current.persist.rehydrate();
      storeRef.current.getState().setHasHydrated(true);
    }
  }, []);

  return (
    <SneakerFilterStoreContext.Provider value={storeRef.current}>
      {children}
    </SneakerFilterStoreContext.Provider>
  );
};

/**
 * Custom hook with strict type inference and atomic selector subscription.
 */
export const useSneakerFilterStore = <T,>(
  selector: (store: SneakerFilterStore) => T
): T => {
  const context = useContext(SneakerFilterStoreContext);

  if (!context) {
    throw new Error(
      "useSneakerFilterStore must be used within an enclosing FilterStoreProvider"
    );
  }

  return useStore(context, selector);
};
