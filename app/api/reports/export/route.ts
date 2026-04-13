// app/api/reports/export/route.ts
// CSV export for invoices, clients, and time entries.
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/server/auth";
import { db } from "@/server/db";

function toCsv(headers: string[], rows: string[][]): string {
  const escape = (v: string) => {
    if (v.includes(",") || v.includes('"') || v.includes("\n")) {
      return `"${v.replace(/"/g, '""')}"`;
    }
    return v;
  };
  const lines = [headers.map(escape).join(",")];
  for (const row of rows) {
    lines.push(row.map(escape).join(","));
  }
  return lines.join("\n");
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const type = request.nextUrl.searchParams.get("type");

  if (type === "invoices") {
    const invoices = await db.invoice.findMany({
      orderBy: { issueDate: "desc" },
      include: { client: { select: { name: true } } },
    });

    const csv = toCsv(
      ["Invoice #", "Client", "Status", "Issue Date", "Due Date", "Subtotal", "Tax", "Total", "Paid", "Currency"],
      invoices.map((i) => [
        i.invoiceNumber,
        i.client.name,
        i.status,
        i.issueDate.toISOString().split("T")[0],
        i.dueDate?.toISOString().split("T")[0] ?? "",
        String(Number(i.subtotal)),
        String(Number(i.taxTotal)),
        String(Number(i.total)),
        String(Number(i.paidAmount)),
        i.currency,
      ])
    );

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="invoices-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  }

  if (type === "clients") {
    const clients = await db.client.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { invoices: true, tickets: true } } },
    });

    const csv = toCsv(
      ["Name", "Company", "Email", "Phone", "Active", "Invoices", "Tickets"],
      clients.map((c) => [
        c.name,
        c.company ?? "",
        c.email ?? "",
        c.phone ?? "",
        c.isActive ? "Yes" : "No",
        String(c._count.invoices),
        String(c._count.tickets),
      ])
    );

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="clients-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  }

  if (type === "time") {
    const entries = await db.timeEntry.findMany({
      orderBy: { date: "desc" },
      include: {
        user: { select: { name: true } },
        client: { select: { name: true } },
      },
    });

    const csv = toCsv(
      ["Date", "Staff", "Client", "Description", "Hours", "Billable"],
      entries.map((e) => [
        e.date.toISOString().split("T")[0],
        e.user.name ?? "",
        e.client?.name ?? "",
        e.description,
        String((e.minutes / 60).toFixed(2)),
        e.isBillable ? "Yes" : "No",
      ])
    );

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="time-entries-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  }

  return NextResponse.json(
    { error: "Invalid type. Use ?type=invoices, ?type=clients, or ?type=time" },
    { status: 400 }
  );
}
