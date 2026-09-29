import { z } from "zod";

/**
 * Shared Zod schema for the Step High Sneakers "Limited Edition Pre-order" form.
 *
 * CRITERIA:
 * 1. Single source of truth used by both Client (react-hook-form) and Server (Server Action).
 * 2. Validates email, shoeSize, customer name, and model selection.
 * 3. Sanitized inputs with strict type inference via z.infer.
 */
export const preorderSchema = z.object({
  customerName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters"),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address for reservation confirmation"),

  shoeModel: z.enum(
    [
      "AeroStride Zero-G",
      "Quantum Foam V2 (Carbon Edition)",
      "Graviton Pulse Track",
      "Apex Vapor Glide",
    ],
    {
      errorMap: () => ({ message: "Please select an eligible limited edition model" }),
    }
  ),

  shoeSize: z.coerce
    .number({ invalid_type_error: "Shoe size must be a valid number" })
    .min(5, "Minimum available size is US 5.0")
    .max(15, "Maximum available size is US 15.0")
    .refine((val) => val % 0.5 === 0, {
      message: "Size must be in half or full size increments (e.g. 9.5 or 10)",
    }),

  preferredColor: z.enum(
    ["Triple Black", "Cloud White", "Volt Neon", "Lunar Grey", "Aurora Blue"],
    {
      errorMap: () => ({ message: "Please choose a valid limited release colorway" }),
    }
  ),

  shippingZip: z
    .string()
    .trim()
    .min(3, "Zip / Postal code is required")
    .max(10, "Invalid postal code format"),

  agreeToTerms: z.literal(true, {
    errorMap: () => ({
      message: "You must accept the limited drop queue terms to reserve your spot",
    }),
  }),
});

export type PreorderSchemaType = z.infer<typeof preorderSchema>;
