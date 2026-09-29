"use server";

import { revalidatePath } from "next/cache";
import { preorderSchema, type PreorderSchemaType } from "@/schemas/preorder.schema";
import type { ActionResponse, PreorderRecord } from "@/lib/types";
import { submitPreorder } from "@/lib/api";

/**
 * Native Next.js Server Action — securely processes limited-edition
 * sneaker pre-orders by delegating to the backend via POST /api/preorder.
 *
 * ARCHITECTURAL NOTES:
 * 1. 'use server' keeps this as a typed RPC callable from the client form.
 * 2. Zod validation runs server-side before any network call.
 * 3. The backend's createSneakerPreOrder action handles: Better Auth session
 *    verification, RBAC enforcement, Prisma mutation, and Resend email dispatch.
 * 4. Response is re-mapped into the frontend's ActionResponse<PreorderRecord>
 *    shape so the PreorderForm component requires zero changes.
 */
export async function reservePreorderAction(
  rawData: PreorderSchemaType
): Promise<ActionResponse<PreorderRecord>> {
  // 1. Backend payload sanitization and validation with Shared Zod Schema
  const validationResult = preorderSchema.safeParse(rawData);

  if (!validationResult.success) {
    const fieldErrors = validationResult.error.flatten().fieldErrors;
    return {
      success: false,
      message: "Server payload verification failed. Please review your submission.",
      errors: fieldErrors,
    };
  }

  const validData = validationResult.data;

  // 2. Map frontend preorder schema → backend CreatePreOrderInput
  const backendPayload = {
    modelName: validData.shoeModel,
    edition: "Limited Edition Zero-G Drop 2026",
    size: validData.shoeSize,
    quantity: 1,
    unitPrice: 240, // Default price; ideally passed from the selected product
    shippingAddress: {
      street: "N/A",
      city: "N/A",
      state: "N/A",
      postalCode: validData.shippingZip,
      country: "US",
    },
  };

  // 3. POST to backend /api/preorder
  const { data, error, status } = await submitPreorder(backendPayload);

  if (error || !data?.success) {
    // Surface role/auth errors meaningfully
    if (status === 401) {
      return {
        success: false,
        message: "You must be logged in to reserve a pre-order slot.",
      };
    }
    if (status === 403) {
      return {
        success: false,
        message:
          "Guest accounts cannot place pre-orders. Please upgrade to a Member tier.",
      };
    }
    return {
      success: false,
      message: data?.error || error || "Pre-order reservation failed. Please try again.",
    };
  }

  // 4. Re-validate App Router cache
  revalidatePath("/");

  // 5. Map backend response → frontend PreorderRecord shape
  const reservationRecord: PreorderRecord = {
    reservationId: data.orderNumber ?? `SHS-${Math.floor(100000 + Math.random() * 900000)}`,
    queueSpotNumber: Math.floor(128 + Math.random() * 200), // Queue position estimate
    customerName: validData.customerName,
    email: validData.email,
    shoeModel: validData.shoeModel,
    shoeSize: validData.shoeSize,
    preferredColor: validData.preferredColor,
    estimatedDelivery: "October 2026 (Priority Zero-G Drop)",
    createdAt: data.createdAt ?? new Date().toISOString(),
  };

  return {
    success: true,
    message: `Spot secured! Priority access code: ${reservationRecord.reservationId}`,
    data: reservationRecord,
  };
}

