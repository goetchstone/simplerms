// server/stripe/index.ts
import "server-only";
import Stripe from "stripe";

// Initialized lazily so the build succeeds without STRIPE_SECRET_KEY in the
// build environment. The key is required at runtime when Stripe is called.
let _stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
    _stripe = new Stripe(key, { apiVersion: "2026-04-22.dahlia", typescript: true });
  }
  return _stripe;
}

export interface CreatePaymentLinkParams {
  invoiceId: string;
  invoiceNumber: string;
  clientName: string;
  amountCents: number;
  currency: string;
  description?: string;
}

export interface PaymentLink {
  id: string;
  url: string;
}

// Creates a Stripe Payment Link for a single fixed-price invoice.
// Idempotency keys prevent duplicate charges on network retries.
export async function createInvoicePaymentLink(
  params: CreatePaymentLinkParams
): Promise<PaymentLink> {
  const stripe = getStripe();
  const { invoiceId, invoiceNumber, clientName, amountCents, currency, description } = params;

  const price = await stripe.prices.create(
    {
      currency: currency.toLowerCase(),
      unit_amount: amountCents,
      product_data: {
        name: `Invoice ${invoiceNumber}`,
        metadata: { invoiceId },
      },
    },
    { idempotencyKey: `price-${invoiceId}` }
  );

  const link = await stripe.paymentLinks.create(
    {
      line_items: [{ price: price.id, quantity: 1 }],
      metadata: { invoiceId, invoiceNumber, clientName },
      after_completion: {
        type: "redirect",
        redirect: { url: `${process.env.NEXT_PUBLIC_APP_URL}/portal/invoices/paid` },
      },
      ...(description && { custom_text: { submit: { message: description } } }),
    },
    { idempotencyKey: `link-${invoiceId}` }
  );

  return { id: link.id, url: link.url };
}

export async function deactivatePaymentLink(linkId: string): Promise<void> {
  await getStripe().paymentLinks.update(linkId, { active: false });
}
