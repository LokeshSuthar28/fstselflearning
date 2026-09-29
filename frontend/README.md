# Step High Sneakers — Next.js App Router Architecture Showcase

## Overview
**Step High Sneakers** is a high-performance, accessible Next.js web application engineered for a premium e-commerce brand renowned for weightless, zero-gravity running shoes. 

The project demonstrates:
- **Persistent Client State:** A persistent Zustand filter store tracking Gender, Size, and Color across navigation visits.
- **Isolated UI Primitives:** Accessible shadcn/ui and Radix UI components styled with Tailwind CSS.
- **Type-Safe Server Mutations:** Native Server Actions (`'use server'`) verifying input data against a shared isomorphic Zod schema.
- **Hydration & FOUC Prevention:** Theme switching with zero layout shifts and safe client store hydration.

---

## Tech Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS with modern HSL variables
- **Primitives:** shadcn/ui (@radix-ui/react-label, @radix-ui/react-slot, @radix-ui/react-toast)
- **Theming:** `next-themes` (Dark / Light / System)
- **State Management:** Zustand with `persist` middleware (localStorage)
- **Form Management:** `react-hook-form` with `@hookform/resolvers/zod`
- **Validation:** Zod (shared isomorphic schema)
- **Backend Mutations:** Next.js Server Actions (`'use server'`)

---

## File Structure

```
.
├── components.json                         # shadcn/ui configuration
├── package.json                            # Dependencies & scripts
├── postcss.config.mjs                      # PostCSS plugins
├── tailwind.config.ts                      # Tailwind CSS with dark mode class strategy
├── tsconfig.json                           # Strict TypeScript configuration
├── docs/
│   └── RSC_CLIENT_HYDRATION_BOUNDARY.md    # Boundary & serialization whitepaper
└── src/
    ├── actions/
    │   └── reserve-preorder.ts             # 'use server' Server Action for spot reservation
    ├── app/
    │   ├── globals.css                     # HSL theme variables
    │   ├── layout.tsx                      # Root layout (ThemeProvider, FilterStoreProvider, Toaster)
    │   └── page.tsx                        # RSC Shop page with Suspense pre-order section
    ├── components/
    │   ├── shop/
    │   │   ├── filter-panel.tsx            # Client filter panel consuming persistent Zustand store
    │   │   └── sneaker-grid.tsx            # Client grid reacting to persistent Zustand filters
    │   ├── preorder/
    │   │   ├── preorder-form.tsx           # Accessible react-hook-form + optimistic UI + toast
    │   │   └── preorder-skeleton.tsx       # Suspense fallback skeleton
    │   ├── providers/
    │   │   ├── filter-store-provider.tsx   # Scoped Zustand provider & atomic selector hook
    │   │   └── theme-provider.tsx          # next-themes client wrapper with FOUC prevention
    │   └── ui/
    │       ├── button.tsx                  # Radix slot button with CVA variants
    │       ├── card.tsx                    # Accessible card primitives
    │       ├── form.tsx                    # shadcn form primitives with ARIA attributes
    │       ├── input.tsx                   # Styled input primitive
    │       ├── label.tsx                   # Radix label primitive
    │       ├── skeleton.tsx                # Pulse skeleton loader
    │       ├── theme-toggle.tsx            # Hydration-safe theme toggle button
    │       ├── toast.tsx                   # Radix toast primitive components
    │       ├── toaster.tsx                 # Global toast container
    │       └── use-toast.ts                # Toast dispatcher hook
    ├── lib/
    │   ├── types.ts                        # Sneaker domain interfaces & types
    │   └── utils.ts                        # Tailwind merge helper (cn)
    └── schemas/
        └── preorder.schema.ts              # Shared Zod validation schema
```

---

## Course Outcome & Rubric Mapping

### Step 1: Part A — Accessible Primitive Integration & Hydration (CO1)
- **Configuration & Setup:** `tailwind.config.ts`, `components.json`, and `src/app/globals.css`.
- **ThemeProvider:** `src/components/providers/theme-provider.tsx` paired with `<html lang="en" suppressHydrationWarning>` in `src/app/layout.tsx` to eliminate FOUC and hydration warnings.
- **RSC vs. Client Boundary Whitepaper:** Saved at `docs/RSC_CLIENT_HYDRATION_BOUNDARY.md`. Explains prop serialization, date conversion to ISO strings, and Server Action closure passing.

### Step 2: Part B — Decoupled Client State Management (CO1, CO2)
- **Persistent Zustand Store:** `src/store/filter-store.ts` tracks Gender ("Men's", "Women's", "Unisex"), Size (e.g. 8, 9, 10), and Color (e.g. "Triple Black", "Volt Neon"). State persists in `localStorage` across page reloads.
- **Performance Architecture:** `src/components/providers/filter-store-provider.tsx` injects the store via React Context and `useRef`. Atomic selectors in `src/components/shop/filter-panel.tsx` ensure that changing a filter never re-renders the root layout.

### Step 3: Part C — End-to-End Type-Safe Server Action Form Mutation (CO2)
- **Shared Validation:** `src/schemas/preorder.schema.ts` provides isomorphic validation for customer name, email, shoe model, size, colorway, and terms agreement.
- **Client Pre-order Form:** `src/components/preorder/preorder-form.tsx` uses `react-hook-form`, `zodResolver`, and accessible shadcn form primitives (`aria-invalid`, `aria-describedby`).
- **Server Action:** `src/actions/reserve-preorder.ts` (`'use server'`) validates the incoming payload with `preorderSchema.safeParse()`, increments the reservation spot counter, and returns typed responses with ISO-formatted timestamps.
- **UX/UI Feedback:** Wrapped in `<Suspense fallback={<PreorderSkeleton />}>` in `src/app/page.tsx`. Dispatches real-time optimistic queue spot allocations using `useOptimistic` and fires feedback toasts via `useToast`.
