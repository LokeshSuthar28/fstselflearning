"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";

/**
 * ThemeProvider component wrapping next-themes.
 *
 * HYDRATION & FOUC PREVENTION CRITERIA:
 * 1. 'use client' declares this as a Client Component, allowing access to window/localStorage.
 * 2. `suppressHydrationWarning` must be added to the <html> tag in root layout.tsx because
 *    next-themes updates the HTML tag attributes (class or data-theme) before React hydrates,
 *    preventing Flash of Unstyled Content (FOUC) without throwing hydration mismatch errors.
 * 3. `disableTransitionOnChange` stops CSS transitions during theme switching to eliminate visual flicker.
 */
export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
