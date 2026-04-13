// app/api/invoices/[id]/pdf/route.ts
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";
import { renderInvoicePdf } from "@/server/pdf/invoice";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const invoice = await db.invoice.findUnique({
    where: { id },
    include: {
      client: true,
      lines: {
        orderBy: { sortOrder: "asc" },
        include: { taxes: { include: { taxRate: true } } },
      },
    },
  });

  if (!invoice) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const companyName = (await db.setting.findUnique({ where: { key: "company_name" } }))?.value ?? "Akritos";
  const companyAddress = (await db.setting.findUnique({ where: { key: "company_address" } }))?.value ?? null;

  const lines = invoice.lines.map((l) => ({
    description: l.description,
    quantity: Number(l.quantity),
    unitPrice: Number(l.unitPrice),
    lineTotal: Number(l.lineTotal),
    taxes: l.taxes.map((t) => ({ name: t.taxRate.name, amount: Number(t.taxAmount) })),
  }));

  const subtotal = lines.reduce((s, l) => s + l.lineTotal, 0);
  const taxTotal = lines.reduce((s, l) => s + l.taxes.reduce((ts, t) => ts + t.amount, 0), 0);

  const buffer = await renderInvoicePdf({
    invoiceNumber: invoice.invoiceNumber,
    issueDate: invoice.issueDate,
    dueDate: invoice.dueDate,
    paidAt: invoice.paidAt,
    companyName,
    companyAddress,
    clientName: invoice.client.name,
    clientEmail: invoice.client.email,
    clientAddress: null,
    lines,
    subtotal,
    taxTotal,
    total: Number(invoice.total),
    currency: invoice.currency,
    notes: invoice.notes,
  });

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="${invoice.invoiceNumber}.pdf"`,
    },
  });
}
