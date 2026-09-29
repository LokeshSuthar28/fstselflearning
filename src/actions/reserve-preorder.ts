"use server";

import { revalidatePath } from "next/cache";
import { preorderSchema, type PreorderSchemaType } from "@/schemas/preorder.schema";
import type { ActionResponse, PreorderRecord } from "@/lib/types";
import { createSneakerPreOrder } from "@/actions/preorder";

/**
 * Native Next.js Server Action — securely processes limited-edition
 * sneaker pre-orders by directly invoking the backend logic.
 *
 * ARCHITECTURAL NOTES:
 * 1. 'use server' keeps this as a typed RPC callable from the client form.
 * 2. Zod validation runs server-side before any database mutation.
 * 3. Handles: Better Auth session verification, RBAC enforcement, Prisma mutation,
 *    and Resend email dispatch.
 * 4. Response is mapped into the frontend's ActionResponse<PreorderRecord> shape.
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
    unitPrice: 240,
    shippingAddress: {
      street: "777 Zero-G Way",
      city: "San Francisco",
      state: "CA",
      postalCode: validData.shippingZip,
      country: "US",
    },
  };

  // 3. Directly call createSneakerPreOrder Server Action
  const result = await createSneakerPreOrder(backendPayload);

  if (!result.success) {
    return {
      success: false,
      message: result.error || "Pre-order reservation failed. Please check your account permissions.",
    };
  }

  // 4. Re-validate App Router cache
  revalidatePath("/");
  revalidatePath("/preorders");
  revalidatePath("/records");
  revalidatePath("/admin");

  // 5. Map response → frontend PreorderRecord shape
  const reservationRecord: PreorderRecord = {
    reservationId: result.orderNumber ?? `SHS-${Math.floor(100000 + Math.random() * 900000)}`,
    queueSpotNumber: Math.floor(128 + Math.random() * 200),
    customerName: validData.customerName,
    email: validData.email,
    shoeModel: validData.shoeModel,
    shoeSize: validData.shoeSize,
    preferredColor: validData.preferredColor,
    estimatedDelivery: "October 2026 (Priority Zero-G Drop)",
    createdAt: result.createdAt ?? new Date().toISOString(),
  };

  return {
    success: true,
    message: `Spot secured! Priority access code: ${reservationRecord.reservationId}`,
    data: reservationRecord,
  };
}
