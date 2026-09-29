import { Resend } from "resend";

if (!process.env.RESEND_API_KEY && process.env.NODE_ENV === "production") {
  console.warn("⚠️ Warning: RESEND_API_KEY environment variable is not defined.");
}

export const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_fallback_for_build");
export const SENDER_EMAIL = process.env.EMAIL_FROM || "Step High Sneakers <orders@stephighsneakers.com>";
