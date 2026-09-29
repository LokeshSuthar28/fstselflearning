import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { resend, SENDER_EMAIL } from "@/lib/resend";
import PreOrderTemplate from "@/emails/PreOrderTemplate";
import { AuditCategory, Role, TransactionStatus } from "@prisma/client";
import { mockDb } from "@/lib/data-store";
import type { CreatePreOrderInput } from "@/actions/preorder";

export const dynamic = "force-dynamic";

/**
 * POST /api/preorder
 *
 * REST bridge that accepts pre-order payloads.
 * Implements the same auth, RBAC, Prisma mutation, and Resend email logic
 * as the Server Action.
 */

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers":
        "Content-Type, Authorization, Cookie, x-mock-role, x-user-role, x-user-id",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    // ── 1. Parse body ────────────────────────────────────────────────────────
    let body: CreatePreOrderInput;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    if (
      !body.modelName ||
      !body.size ||
      !body.quantity ||
      !body.unitPrice ||
      !body.shippingAddress
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: modelName, size, quantity, unitPrice, shippingAddress",
        },
        { status: 422 }
      );
    }

    // ── 2. Session resolution ────────────────────────────────────────────────
    const session = await auth.api
      .getSession({ headers: request.headers })
      .catch(() => null);

    const cookieHeader = request.headers.get("cookie") || "";
    let userRole = (session?.user as { role?: string })?.role?.toUpperCase();
    let userId = session?.user?.id;
    let userEmail = session?.user?.email;
    let userName = session?.user?.name;

    // Mock session simulation for local development
    if (!session?.user) {
      const headerRole =
        request.headers.get("x-mock-role") ||
        request.headers.get("x-user-role");
      if (headerRole) {
        userRole = headerRole.toUpperCase();
        userId =
          userRole === "ADMIN"
            ? "usr_neo_admin_01"
            : userRole === "MEMBER"
            ? "usr_trinity_vip_02"
            : "usr_cipher_guest_03";
        userEmail =
          userRole === "ADMIN"
            ? "admin@stephigh.com"
            : userRole === "MEMBER"
            ? "member@stephigh.com"
            : "guest@stephigh.com";
        userName =
          userRole === "ADMIN"
            ? "Neo Vance (Lead Architect)"
            : userRole === "MEMBER"
            ? "Trinity Cole (VIP Collector)"
            : "Cipher Smith (Guest)";
      } else if (cookieHeader.includes("mock_session_admin")) {
        userRole = "ADMIN";
        userId = "usr_neo_admin_01";
        userEmail = "admin@stephigh.com";
        userName = "Neo Vance (Lead Architect)";
      } else if (cookieHeader.includes("mock_session_guest")) {
        userRole = "GUEST";
        userId = "usr_cipher_guest_03";
        userEmail = "guest@stephigh.com";
        userName = "Cipher Smith (Guest)";
      } else if (cookieHeader.includes("mock_session_member")) {
        userRole = "MEMBER";
        userId = "usr_trinity_vip_02";
        userEmail = "member@stephigh.com";
        userName = "Trinity Cole (VIP Collector)";
      } else {
        userRole = "MEMBER";
        userId = "usr_trinity_vip_02";
        userEmail = "member@stephigh.com";
        userName = "Trinity Cole (VIP Collector)";
      }
    }

    // ── 3. RBAC: GUEST blocked ───────────────────────────────────────────────
    if (userRole === Role.GUEST || userRole === "GUEST") {
      try {
        await prisma.auditLog.create({
          data: {
            userId: userId || null,
            action: "PREORDER_UNAUTHORIZED_TIER",
            category: AuditCategory.AUTH_GATE,
            status: "FAILED",
            metadata: { attemptedRole: userRole, requiredRole: "MEMBER" },
          },
        });
      } catch {
        mockDb.addAuditLog({
          id: `aud_err_${Date.now()}`,
          userId,
          action: "PREORDER_UNAUTHORIZED_TIER",
          category: "AUTH_GATE",
          status: "FAILED",
          metadata: { attemptedRole: userRole, requiredRole: "MEMBER" },
          createdAt: new Date().toISOString(),
        });
      }
      return NextResponse.json(
        {
          success: false,
          error:
            "Forbidden: Guest tier cannot commit pre-orders. Please upgrade to a Member tier via /login.",
        },
        { status: 403 }
      );
    }

    // ── 4. Input validation ──────────────────────────────────────────────────
    if (!body.modelName || !body.size || body.quantity < 1 || body.unitPrice <= 0) {
      return NextResponse.json(
        { success: false, error: "Invalid pre-order parameters provided." },
        { status: 422 }
      );
    }

    const orderNumber = `SH-2026-${Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase()}`;
    const totalAmount = Number((body.unitPrice * body.quantity).toFixed(2));
    const nowIso = new Date().toISOString();
    let transactionId = `tx_${Date.now()}`;

    // ── 5. Database mutation (Prisma → mockDb fallback) ──────────────────────
    try {
      if (userId && !userId.startsWith("usr_")) {
        const newTx = await prisma.transaction.create({
          data: {
            orderNumber,
            userId,
            modelName: body.modelName,
            edition: body.edition,
            size: body.size,
            quantity: body.quantity,
            unitPrice: body.unitPrice,
            totalAmount,
            currency: "USD",
            status: TransactionStatus.CONFIRMED,
            shippingAddress: body.shippingAddress,
          },
        });
        transactionId = newTx.id;

        await prisma.auditLog.create({
          data: {
            userId,
            transactionId: newTx.id,
            action: "TRANSACTION_CREATED",
            category: AuditCategory.TRANSACTION,
            status: "SUCCESS",
            metadata: {
              orderNumber,
              totalAmount,
              currency: "USD",
              quantity: body.quantity,
            },
          },
        });
      } else {
        throw new Error("Local simulated user");
      }
    } catch {
      mockDb.addTransaction({
        id: transactionId,
        orderNumber,
        userId: userId || "usr_trinity_vip_02",
        userName: userName || "Trinity Cole",
        userEmail: userEmail || "member@stephigh.com",
        modelName: body.modelName,
        edition: body.edition,
        size: body.size,
        quantity: body.quantity,
        unitPrice: body.unitPrice,
        totalAmount,
        currency: "USD",
        status: "CONFIRMED",
        createdAt: nowIso,
        shippingAddress: body.shippingAddress,
        auditLogs: [
          {
            id: `aud_tx_${Date.now()}`,
            userId: userId || "usr_trinity_vip_02",
            transactionId,
            action: "TRANSACTION_CREATED",
            category: "TRANSACTION",
            status: "SUCCESS",
            metadata: {
              orderNumber,
              totalAmount,
              currency: "USD",
              quantity: body.quantity,
            },
            createdAt: nowIso,
          },
        ],
      });
    }

    // ── 6. Resend email dispatch ─────────────────────────────────────────────
    let resendMessageId: string | undefined;
    try {
      if (userEmail) {
        const emailResponse = await resend.emails.send({
          from: SENDER_EMAIL,
          to: [userEmail],
          subject: `[Step High] Pre-Order Confirmed: ${body.modelName} (${orderNumber})`,
          react: PreOrderTemplate({
            customerName: userName || "Valued Collector",
            orderNumber,
            modelName: body.modelName,
            edition: body.edition,
            size: body.size,
            quantity: body.quantity,
            unitPrice: body.unitPrice.toFixed(2),
            totalAmount: totalAmount.toFixed(2),
            shippingAddress: body.shippingAddress,
          }),
        });
        resendMessageId = emailResponse.data?.id;

        mockDb.addAuditLog({
          id: `aud_em_${Date.now()}`,
          userId,
          transactionId,
          action: "EMAIL_DISPATCHED",
          category: "EMAIL_NOTIFICATION",
          status: "DISPATCHED",
          metadata: { resendMessageId, recipient: userEmail, orderNumber },
          createdAt: new Date().toISOString(),
        });
      }
    } catch (emailError: unknown) {
      console.warn("⚠️ Resend dispatch warning:", emailError);
    }

    return NextResponse.json(
      { success: true, orderNumber, transactionId, resendMessageId, createdAt: nowIso },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("❌ POST /api/preorder error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error processing pre-order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
