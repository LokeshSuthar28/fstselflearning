# Architecture Deep Dive: React Server Components (RSC) vs. Client Components ('use client')
## Project: Step High Sneakers

## 1. Executive Summary & Component Boundary Model
In Next.js App Router, components default to **Server Components (RSC)**. They execute exclusively on the server, producing zero JavaScript footprint in the browser bundle.

The `'use client'` directive marks a **Network/Hydration Boundary**. It signifies that the component will be pre-rendered to static HTML on the server and then **hydrated** with interactive JavaScript listeners in the browser.

```
[ Next.js Server Runtime ]
┌────────────────────────────────────────────────────────┐
│  Server Component (e.g., layout.tsx, page.tsx)         │
│  - Static catalog fetching (SNEAKER_CATALOG)           │
│  - Zero client JS payload overhead                     │
│  - Renders HTML and serializes props to Flight payload │
└────────────────────────┬───────────────────────────────┘
                         │ 
                         │ Serialization Boundary (JSON-extended Flight format)
                         ▼
┌────────────────────────────────────────────────────────┐
│  Client Components ('use client')                      │
│  - FilterPanel (consumes persistent Zustand store)     │
│  - SneakerGrid (computes filtered list on client)      │
│  - PreorderForm (react-hook-form + useOptimistic)      │
└────────────────────────────────────────────────────────┘
```

---

## 2. Props Serialization Across the Hydration Boundary

When passing props from a Server Component to a Client Component (e.g. passing `initialCatalog` from `page.tsx` into `<SneakerGrid initialCatalog={SNEAKER_CATALOG} />`), arguments must be serializable across the network wire.

### Supported Data Types
- **Primitives:** `string`, `number`, `boolean`, `null`, `undefined`
- **Plain Objects & Arrays:** `Array<T>`, `{ [key: string]: Serializable }`
- **Native Promises:** Usable with React 18/19 `use()` hook
- **Server Actions:** Declared with `'use server'` and passed down as RPC references

### Unsupported Data Types & Project Solutions

#### A. JavaScript `Date` Objects
- **The Pitfall:** Passing a native `new Date()` directly across the boundary risks serialization mismatch warnings due to differences between server time (e.g., UTC) and client timezones.
- **Step High Solution:** Always serialize dates to ISO 8601 strings (`date.toISOString()`) or UNIX timestamps before returning from Server Actions or passing as props.
  ```typescript
  // In reservePreorderAction (Server Action):
  const reservationRecord: PreorderRecord = {
    ...validData,
    createdAt: new Date().toISOString(), // Safe cross-boundary string!
  };
  ```

#### B. Functions & Event Handlers
- **The Pitfall:** Closures and functions (`onClick`, `onSubmit`, `formatter()`) cannot be serialized into JSON-based network payloads. Attempting to pass a regular callback function from an RSC to a Client Component throws a runtime error:
  `Error: Functions cannot be passed directly to Client Components unless you're using a Server Action.`
- **Step High Solution:**
  - For mutations, declare them as native Server Actions with `'use server'`.
  - For client interactions, declare event handlers (`onClick={() => toggleSize(sz)}`) directly inside the `'use client'` component.

---

## 3. Hydration Mismatch & FOUC Prevention in Step High Sneakers

1. **Root `suppressHydrationWarning`:**
   ```tsx
   // src/app/layout.tsx
   <html lang="en" suppressHydrationWarning>
   ```
   `next-themes` reads system/localStorage preferences and modifies the `<html>` element `class="dark"` prior to React hydration. `suppressHydrationWarning` prevents React from flagging this intentional attribute discrepancy.

2. **Zustand `skipHydration: true` & Mount Guard:**
   Because filters are saved in `localStorage`, the client and server states could diverge on first render. In `filter-store.ts`, we set `skipHydration: true` and trigger rehydration inside a client `useEffect`. Components display a matching skeleton or fallback until `hasHydrated === true`.

3. **Composition Slot Pattern (`children`):**
   ```tsx
   <FilterStoreProvider>
     {children}
   </FilterStoreProvider>
   ```
   Passing `{children}` as React nodes preserves the server-rendered status of nested pages without causing `layout.tsx` to re-render when filter selections change.
