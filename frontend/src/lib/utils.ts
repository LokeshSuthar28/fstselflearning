import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Standard utility function for conditionally merging Tailwind classes without collisions.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
