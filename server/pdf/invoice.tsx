// server/pdf/invoice.tsx
import "server-only";

import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
import { formatCurrency, formatDate } from "@/lib/utils";

export interface InvoicePdfLine {
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  taxes: { name: string; amount: number }[];
}

export interface InvoicePdfData {
  invoiceNumber: string;
  issueDate: Date;
  dueDate?: Date | null;
  paidAt?: Date | null;
  companyName: string;
  companyAddress?: string | null;
  clientName: string;
  clientEmail?: string | null;
  clientAddress?: string | null;
  lines: InvoicePdfLine[];
  subtotal: number;
  taxTotal: number;
  total: number;
  currency: string;
  notes?: string | null;
}

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#111827",
    padding: "48 48 64 48",
    lineHeight: 1.5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  company: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  companyAddress: {
    fontSize: 8,
    color: "#6b7280",
    marginTop: 4,
  },
  invoiceMeta: {
    alignItems: "flex-end",
  },
  invoiceLabel: {
    fontSize: 18,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  invoiceNumber: {
    fontSize: 9,
    color: "#6b7280",
    marginTop: 4,
  },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
  },
  billTo: {
    flex: 1,
  },
  metaBlock: {
    alignItems: "flex-end",
  },
  label: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  value: {
    fontSize: 9,
    color: "#111827",
    marginBottom: 2,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    minWidth: 160,
  },
  metaKey: {
    fontSize: 8,
    color: "#6b7280",
  },
  metaVal: {
    fontSize: 8,
    color: "#111827",
    fontFamily: "Helvetica-Bold",
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#111827",
    paddingBottom: 6,
    marginBottom: 4,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingVertical: 7,
  },
  colDescription: { flex: 3 },
  colQty: { flex: 1, textAlign: "right" },
  colPrice: { flex: 1, textAlign: "right" },
  colTotal: { flex: 1, textAlign: "right" },
  colHeader: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#6b7280",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  colCell: {
    fontSize: 9,
    color: "#111827",
  },
  taxLine: {
    fontSize: 8,
    color: "#9ca3af",
    marginTop: 1,
  },
  totals: {
    marginTop: 16,
    alignItems: "flex-end",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    minWidth: 200,
    paddingVertical: 3,
  },
  totalKey: {
    fontSize: 9,
    color: "#6b7280",
    marginRight: 32,
  },
  totalVal: {
    fontSize: 9,
    color: "#111827",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    minWidth: 200,
    borderTopWidth: 1,
    borderTopColor: "#111827",
    paddingTop: 6,
    marginTop: 4,
  },
  grandTotalKey: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginRight: 32,
  },
  grandTotalVal: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
  },
  paidBadge: {
    marginTop: 8,
    backgroundColor: "#f0fdf4",
    borderRadius: 4,
    padding: "4 10",
    alignSelf: "flex-end",
  },
  paidText: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#16a34a",
  },
  notes: {
    marginTop: 32,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  notesLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#9ca3af",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  notesText: {
    fontSize: 9,
    color: "#6b7280",
    lineHeight: 1.6,
  },
});

function InvoiceDocument({ data }: { data: InvoicePdfData }) {
  const { invoiceNumber, issueDate, dueDate, paidAt, companyName, companyAddress, clientName, clientEmail, clientAddress, lines, subtotal, taxTotal, total, currency, notes } = data;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.company}>{companyName}</Text>
            {companyAddress && (
              <Text style={styles.companyAddress}>{companyAddress}</Text>
            )}
          </View>
          <View style={styles.invoiceMeta}>
            <Text style={styles.invoiceLabel}>Invoice</Text>
            <Text style={styles.invoiceNumber}>{invoiceNumber}</Text>
          </View>
        </View>

        {/* Bill to + dates */}
        <View style={styles.section}>
          <View style={styles.billTo}>
            <Text style={styles.label}>Bill to</Text>
            <Text style={styles.value}>{clientName}</Text>
            {clientEmail && <Text style={styles.value}>{clientEmail}</Text>}
            {clientAddress && <Text style={styles.value}>{clientAddress}</Text>}
          </View>

          <View style={styles.metaBlock}>
            <View style={styles.metaRow}>
              <Text style={styles.metaKey}>Issue date</Text>
              <Text style={styles.metaVal}>{formatDate(issueDate)}</Text>
            </View>
            {dueDate && (
              <View style={styles.metaRow}>
                <Text style={styles.metaKey}>Due date</Text>
                <Text style={styles.metaVal}>{formatDate(dueDate)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Line items table */}
        <View style={styles.tableHeader}>
          <Text style={[styles.colDescription, styles.colHeader]}>Description</Text>
          <Text style={[styles.colQty, styles.colHeader]}>Qty</Text>
          <Text style={[styles.colPrice, styles.colHeader]}>Unit price</Text>
          <Text style={[styles.colTotal, styles.colHeader]}>Amount</Text>
        </View>

        {lines.map((line, i) => (
          <View key={i} style={styles.tableRow}>
            <View style={styles.colDescription}>
              <Text style={styles.colCell}>{line.description}</Text>
              {line.taxes.map((t, ti) => (
                <Text key={ti} style={styles.taxLine}>{t.name}</Text>
              ))}
            </View>
            <Text style={[styles.colQty, styles.colCell]}>{line.quantity}</Text>
            <Text style={[styles.colPrice, styles.colCell]}>
              {formatCurrency(line.unitPrice, currency)}
            </Text>
            <Text style={[styles.colTotal, styles.colCell]}>
              {formatCurrency(line.lineTotal, currency)}
            </Text>
          </View>
        ))}

        {/* Totals */}
        <View style={styles.totals}>
          <View style={styles.totalRow}>
            <Text style={styles.totalKey}>Subtotal</Text>
            <Text style={styles.totalVal}>{formatCurrency(subtotal, currency)}</Text>
          </View>
          {taxTotal > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalKey}>Tax</Text>
              <Text style={styles.totalVal}>{formatCurrency(taxTotal, currency)}</Text>
            </View>
          )}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalKey}>Total</Text>
            <Text style={styles.grandTotalVal}>{formatCurrency(total, currency)}</Text>
          </View>
          {paidAt && (
            <View style={styles.paidBadge}>
              <Text style={styles.paidText}>PAID {formatDate(paidAt)}</Text>
            </View>
          )}
        </View>

        {/* Notes */}
        {notes && (
          <View style={styles.notes}>
            <Text style={styles.notesLabel}>Notes</Text>
            <Text style={styles.notesText}>{notes}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
}

export async function renderInvoicePdf(data: InvoicePdfData): Promise<Buffer> {
  const blob = await pdf(<InvoiceDocument data={data} />).toBlob();
  return Buffer.from(await blob.arrayBuffer());
}
