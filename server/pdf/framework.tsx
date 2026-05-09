// server/pdf/framework.tsx
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
import {
  FRAMEWORK_LAYERS,
  FAST_QUESTIONS,
  STAKES_MATRIX,
  DEFINITION_OF_DONE,
} from "@/lib/framework-content";

// Page distribution decided by content budget, not by topical desire.
// LETTER = 792pt height. With 56pt padding top/bottom (112pt) and ~30pt
// reserved for the footer/page number, usable content area is ~650pt.
// Layers are ~70pt each. Three layers per page = 210pt, leaves 440pt for
// page header + breathing room. That's the budget that doesn't go wonky.

const styles = StyleSheet.create({
  page: {
    paddingTop: 52,
    paddingBottom: 52,
    paddingHorizontal: 56,
    fontSize: 11,
    color: "#1C1F2E",
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },

  // ── Brand + headers ────────────────────────────────────────────────
  brand: {
    fontSize: 9,
    letterSpacing: 2,
    color: "#C8A96E",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  pageHeader: {
    fontSize: 9,
    letterSpacing: 1.5,
    color: "#C8A96E",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 500,
    marginBottom: 18,
    color: "#1C1F2E",
  },

  // ── Cover page ─────────────────────────────────────────────────────
  coverWrap: {
    flex: 1,
    justifyContent: "center",
  },
  coverTitle: {
    fontSize: 32,
    fontWeight: 500,
    marginBottom: 8,
    color: "#1C1F2E",
    lineHeight: 1.15,
  },
  coverSubtitle: {
    fontSize: 14,
    color: "#4A5068",
    marginBottom: 32,
  },
  coverIntro: {
    fontSize: 11,
    color: "#1C1F2E",
    marginBottom: 24,
    lineHeight: 1.7,
  },
  metaBox: {
    backgroundColor: "#F5F4EF",
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 2,
    borderLeftColor: "#C8A96E",
  },
  metaLabel: {
    fontSize: 8,
    letterSpacing: 1.5,
    color: "#C8A96E",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  metaText: {
    fontSize: 10,
    color: "#1C1F2E",
    lineHeight: 1.6,
  },
  whatsInsideBox: {
    marginTop: 8,
  },
  whatsInsideTitle: {
    fontSize: 11,
    fontWeight: 500,
    marginBottom: 8,
    color: "#1C1F2E",
  },
  whatsInsideRow: {
    flexDirection: "row",
    marginBottom: 4,
    fontSize: 10,
    color: "#4A5068",
  },
  whatsInsideMarker: {
    width: 14,
    color: "#C8A96E",
  },

  // ── Layer cards ────────────────────────────────────────────────────
  layer: {
    marginBottom: 16,
  },
  layerHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 4,
  },
  layerNumber: {
    fontSize: 13,
    fontWeight: 500,
    color: "#C8A96E",
    marginRight: 10,
    width: 16,
  },
  layerTitle: {
    fontSize: 12,
    fontWeight: 500,
    flex: 1,
  },
  layerPrompt: {
    fontSize: 10,
    color: "#1C1F2E",
    marginBottom: 3,
    marginLeft: 26,
  },
  layerExample: {
    fontSize: 9,
    color: "#4A5068",
    fontStyle: "italic",
    marginBottom: 6,
    marginLeft: 26,
    lineHeight: 1.45,
  },
  fillLine: {
    marginLeft: 26,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  fillLabel: {
    fontSize: 9,
    color: "#4A5068",
    marginRight: 6,
    width: 80,
  },
  fillBlank: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: "#1C1F2E",
    height: 14,
  },

  // ── Fast version box ───────────────────────────────────────────────
  fastBox: {
    marginTop: 16,
    padding: 14,
    backgroundColor: "#F5F4EF",
    borderLeftWidth: 2,
    borderLeftColor: "#C8A96E",
  },
  fastTitle: {
    fontSize: 12,
    fontWeight: 500,
    marginBottom: 6,
  },
  fastIntro: {
    fontSize: 10,
    color: "#4A5068",
    marginBottom: 8,
  },
  fastQRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  fastQNum: {
    color: "#C8A96E",
    width: 14,
    fontSize: 10,
  },
  fastQText: {
    fontSize: 10,
    fontWeight: 500,
  },

  // ── Stakes matrix table ────────────────────────────────────────────
  table: {
    marginTop: 8,
    borderWidth: 0.5,
    borderColor: "#C8A96E",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#C8A96E",
  },
  tableRowLast: {
    flexDirection: "row",
  },
  tableHeader: {
    backgroundColor: "#1C1F2E",
  },
  tableCellLevel: {
    width: "20%",
    padding: 6,
    fontSize: 10,
    fontWeight: 500,
  },
  tableCellApproach: {
    width: "30%",
    padding: 6,
    fontSize: 10,
    borderLeftWidth: 0.5,
    borderLeftColor: "#C8A96E",
  },
  tableCellExamples: {
    width: "50%",
    padding: 6,
    fontSize: 9,
    color: "#4A5068",
    borderLeftWidth: 0.5,
    borderLeftColor: "#C8A96E",
  },

  // ── Definition of Done ─────────────────────────────────────────────
  checklistSection: {
    marginBottom: 12,
  },
  checklistTitle: {
    fontSize: 12,
    fontWeight: 500,
    marginBottom: 5,
    color: "#1C1F2E",
  },
  checklistItem: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 4,
  },
  checkbox: {
    width: 9,
    height: 9,
    borderWidth: 0.5,
    borderColor: "#1C1F2E",
    marginRight: 8,
    marginTop: 3,
  },
  checklistText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.4,
  },

  // ── One Rule + CTA ─────────────────────────────────────────────────
  oneRule: {
    marginTop: 14,
    padding: 14,
    backgroundColor: "#1C1F2E",
  },
  oneRuleTitle: {
    fontSize: 9,
    color: "#C8A96E",
    fontWeight: 500,
    marginBottom: 4,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  oneRuleText: {
    fontSize: 11,
    color: "#E8E4DC",
    lineHeight: 1.5,
  },
  ctaBox: {
    marginTop: 14,
    padding: 14,
    backgroundColor: "#F5F4EF",
    borderLeftWidth: 2,
    borderLeftColor: "#C8A96E",
  },
  ctaTitle: {
    fontSize: 12,
    color: "#1C1F2E",
    fontWeight: 500,
    marginBottom: 4,
  },
  ctaText: {
    fontSize: 9,
    color: "#4A5068",
    lineHeight: 1.45,
  },
  ctaLink: {
    fontSize: 10,
    color: "#1C1F2E",
    fontWeight: 500,
    marginTop: 6,
  },

  // ── Footer / page number ───────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 28,
    left: 56,
    right: 56,
    textAlign: "center",
    fontSize: 8,
    color: "#4A5068",
    paddingTop: 6,
    borderTopWidth: 0.5,
    borderTopColor: "#E8E4DC",
  },
  pageNumber: {
    position: "absolute",
    bottom: 28,
    right: 56,
    fontSize: 8,
    color: "#4A5068",
  },
});

const Footer = () => (
  <>
    <Text style={styles.footer} fixed>
      akritos.com/ai-risk · The AI Prompt Framework · v1.0 · Free to share
    </Text>
    <Text
      style={styles.pageNumber}
      render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      fixed
    />
  </>
);

const LayerBlock = ({ layer }: { layer: typeof FRAMEWORK_LAYERS[number] }) => (
  // wrap={false} ONLY on individual layers — small enough to not waste pages
  <View style={styles.layer} wrap={false}>
    <View style={styles.layerHeader}>
      <Text style={styles.layerNumber}>{layer.number}</Text>
      <Text style={styles.layerTitle}>{layer.title}</Text>
    </View>
    <Text style={styles.layerPrompt}>{layer.prompt}</Text>
    <Text style={styles.layerExample}>{layer.example}</Text>
    {layer.blanks?.map((blank, i) => (
      <View key={i} style={styles.fillLine}>
        {blank && <Text style={styles.fillLabel}>{blank}</Text>}
        <View style={styles.fillBlank} />
      </View>
    ))}
  </View>
);

function FrameworkDocument(): React.ReactElement {
  // Layer distribution: 3 per page on pages 2-4 = 9 layers across 3 pages.
  // Generous breathing room, fillable, no wrap-induced page gaps.
  const layersPage2 = FRAMEWORK_LAYERS.slice(0, 3);
  const layersPage3 = FRAMEWORK_LAYERS.slice(3, 6);
  const layersPage4 = FRAMEWORK_LAYERS.slice(6, 9);

  // Definition of Done: 5 sections distributed over 2 pages so each has room.
  const dodPage5 = DEFINITION_OF_DONE.slice(0, 3);
  const dodPage6 = DEFINITION_OF_DONE.slice(3, 5);

  return (
    <Document
      title="The AI Prompt Framework + Definition of Done"
      author="Akritos Technology Partners"
      subject="A 9-layer framework for prompting LLMs and a 5-section checklist for evaluating their output"
      creator="Akritos"
    >
      {/* PAGE 1 — Cover (centered, breathing room) */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.brand}>Akritos · Goetch Stone · PSU MacAdmins 2026</Text>

        <View style={styles.coverWrap}>
          <Text style={styles.coverTitle}>
            The AI Prompt{"\n"}Framework
          </Text>
          <Text style={styles.coverSubtitle}>
            + Definition of Done Checklist
          </Text>

          <Text style={styles.coverIntro}>
            Most AI output is mediocre because the prompts that produced it
            didn&apos;t give the AI enough to work with. The model fills the
            gaps from training data — confident, generic, often wrong. The fix
            isn&apos;t a smarter model. It&apos;s a habit of giving the model
            the information it needs before asking it for something.
          </Text>

          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>How to use this</Text>
            <Text style={styles.metaText}>
              For high-stakes work, walk through all 9 layers before sending
              the prompt. For low-stakes work, the 3-question fast version is
              enough. After every AI output, run the Definition of Done
              checklist. Print this. Pin it next to your monitor.
            </Text>
          </View>

          <View style={styles.whatsInsideBox}>
            <Text style={styles.whatsInsideTitle}>What&apos;s inside</Text>
            <View style={styles.whatsInsideRow}>
              <Text style={styles.whatsInsideMarker}>·</Text>
              <Text>The 9-Layer Framework (pp. 2–4) — fillable worksheet</Text>
            </View>
            <View style={styles.whatsInsideRow}>
              <Text style={styles.whatsInsideMarker}>·</Text>
              <Text>The Fast Version + Stakes Matrix (p. 4)</Text>
            </View>
            <View style={styles.whatsInsideRow}>
              <Text style={styles.whatsInsideMarker}>·</Text>
              <Text>Definition of Done Checklist (pp. 5–6)</Text>
            </View>
          </View>
        </View>

        <Footer />
      </Page>

      {/* PAGE 2 — Framework Layers 1-3 */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.pageHeader}>Part 1 · Build the Prompt</Text>
        <Text style={styles.pageTitle}>The 9-Layer Framework</Text>
        {layersPage2.map((layer) => (
          <LayerBlock key={layer.number} layer={layer} />
        ))}
        <Footer />
      </Page>

      {/* PAGE 3 — Framework Layers 4-6 */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.pageHeader}>Part 1 · Build the Prompt (continued)</Text>
        <Text style={styles.pageTitle}>The 9-Layer Framework</Text>
        {layersPage3.map((layer) => (
          <LayerBlock key={layer.number} layer={layer} />
        ))}
        <Footer />
      </Page>

      {/* PAGE 4 — Layers 7-9 + Fast Version + Stakes Matrix */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.pageHeader}>Part 1 · Build the Prompt (continued)</Text>
        <Text style={styles.pageTitle}>Layers 7–9 + Fast Version</Text>
        {layersPage4.map((layer) => (
          <LayerBlock key={layer.number} layer={layer} />
        ))}

        <View style={styles.fastBox} wrap={false}>
          <Text style={styles.fastTitle}>The Fast Version (Low Stakes)</Text>
          <Text style={styles.fastIntro}>
            When stakes are low and the domain is well-known, just answer three:
          </Text>
          {FAST_QUESTIONS.map((q) => (
            <View key={q.number} style={styles.fastQRow}>
              <Text style={styles.fastQNum}>{q.number}.</Text>
              <Text style={styles.fastQText}>{q.question}</Text>
            </View>
          ))}
        </View>

        <Footer />
      </Page>

      {/* PAGE 5 — Stakes Matrix + Definition of Done sections 1-3 */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.pageHeader}>Part 2 · Evaluate the Output</Text>
        <Text style={styles.pageTitle}>When to Use Which Version</Text>

        <View style={styles.table} wrap={false}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCellLevel, { color: "#C8A96E" }]}>Stakes</Text>
            <Text style={[styles.tableCellApproach, { color: "#C8A96E" }]}>Approach</Text>
            <Text style={[styles.tableCellExamples, { color: "#C8A96E" }]}>Examples</Text>
          </View>
          {STAKES_MATRIX.map((row, i) => (
            <View
              key={row.level}
              style={i === STAKES_MATRIX.length - 1 ? styles.tableRowLast : styles.tableRow}
            >
              <Text style={styles.tableCellLevel}>{row.level}</Text>
              <Text style={styles.tableCellApproach}>{row.approach}</Text>
              <Text style={styles.tableCellExamples}>{row.examples}</Text>
            </View>
          ))}
        </View>

        <Text style={[styles.pageTitle, { marginTop: 24 }]}>Definition of Done</Text>

        {dodPage5.map((section) => (
          <View key={section.title} style={styles.checklistSection} wrap={false}>
            <Text style={styles.checklistTitle}>{section.title}</Text>
            {section.items.map((item, i) => (
              <View key={i} style={styles.checklistItem}>
                <View style={styles.checkbox} />
                <Text style={styles.checklistText}>{item}</Text>
              </View>
            ))}
          </View>
        ))}

        <Footer />
      </Page>

      {/* PAGE 6 — Definition of Done sections 4-5 + One Rule + CTA */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.pageHeader}>Part 2 · Evaluate the Output (continued)</Text>
        <Text style={styles.pageTitle}>Definition of Done (continued)</Text>

        {dodPage6.map((section) => (
          <View key={section.title} style={styles.checklistSection} wrap={false}>
            <Text style={styles.checklistTitle}>{section.title}</Text>
            {section.items.map((item, i) => (
              <View key={i} style={styles.checklistItem}>
                <View style={styles.checkbox} />
                <Text style={styles.checklistText}>{item}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.oneRule} wrap={false}>
          <Text style={styles.oneRuleTitle}>The One Rule</Text>
          <Text style={styles.oneRuleText}>
            If the output looks finished but you can&apos;t explain WHY each
            recommendation is correct, it&apos;s not done. It&apos;s just polished.
          </Text>
        </View>

        <View style={styles.ctaBox} wrap={false}>
          <Text style={styles.ctaTitle}>Want help putting this in your business?</Text>
          <Text style={styles.ctaText}>
            We help leadership teams put guardrails on AI use — policy, workflow
            review, vendor evaluation, training. The point isn&apos;t to be
            anti-AI; it&apos;s to make sure AI works for your business instead
            of generating polished problems that surface six months later.
          </Text>
          <Text style={styles.ctaLink}>akritos.com/ai-risk · akritos.com/book</Text>
        </View>

        <Footer />
      </Page>
    </Document>
  );
}

export async function renderFrameworkPdf(): Promise<Buffer> {
  const blob = await pdf(<FrameworkDocument />).toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
