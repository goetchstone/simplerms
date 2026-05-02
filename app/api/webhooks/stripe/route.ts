// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/server/db";

export const runtime = "nodejs";

// Stripe sends the raw body for signature verification — do not parse it.
export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const rawBody = await req.text();
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-04-22.dahlia" });
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const object = event.data.object as Stripe.Checkout.Session;
    const invoiceId = object.metadata?.invoiceId;

    if (invoiceId) {
      const amountPaid = (object.amount_total ?? 0) / 100;

      const invoice = await db.invoice.findUnique({ where: { id: invoiceId } });
      if (invoice) {
        const newPaidAmount = Number(invoice.paidAmount) + amountPaid;
        const isFullyPaid = newPaidAmount >= Number(invoice.total);

        await db.invoice.update({
          where: { id: invoiceId },
          data: {
            paidAmount: newPaidAmount,
            status: isFullyPaid ? "PAID" : "PARTIAL",
            ...(isFullyPaid && { paidAt: new Date() }),
          },
        });

        await db.payment.create({
          data: {
            invoiceId,
            amount: amountPaid,
            method: "STRIPE",
            reference: object.payment_intent as string ?? object.id,
            paidAt: new Date(),
          },
        });
      }
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;
    const invoiceId = charge.metadata?.invoiceId;

    if (invoiceId) {
      const refundAmount = (charge.amount_refunded ?? 0) / 100;

      const invoice = await db.invoice.findUnique({ where: { id: invoiceId } });
      if (invoice) {
        const newPaidAmount = Math.max(0, Number(invoice.paidAmount) - refundAmount);
        const newStatus = newPaidAmount <= 0 ? "SENT" : "PARTIAL";

        await db.invoice.update({
          where: { id: invoiceId },
          data: {
            paidAmount: newPaidAmount,
            status: newStatus,
            paidAt: null,
          },
        });

        await db.payment.create({
          data: {
            invoiceId,
            amount: -refundAmount,
            method: "OTHER",
            reference: charge.id,
            notes: "Stripe refund",
            paidAt: new Date(),
          },
        });
      }
    }
  }

  if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as Stripe.PaymentIntent;
    const invoiceId = intent.metadata?.invoiceId;
    const reason = intent.last_payment_error?.message ?? "Unknown failure reason";

    // Log the failure for audit trail — no invoice status change needed.
    if (invoiceId) {
      await db.auditLog.create({
        data: {
          action: "STRIPE_PAYMENT_FAILED",
          entityType: "Invoice",
          entityId: invoiceId,
          after: { reason, paymentIntentId: intent.id },
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
