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

const styles = StyleSheet.create({
  page: {
    padding: 56,
    fontSize: 11,
    color: "#1C1F2E",
    fontFamily: "Helvetica",
    lineHeight: 1.5,
  },
  brand: {
    fontSize: 9,
    letterSpacing: 2,
    color: "#C8A96E",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  title: {
    fontSize: 26,
    fontWeight: 500,
    marginBottom: 6,
    color: "#1C1F2E",
  },
  subtitle: {
    fontSize: 12,
    color: "#4A5068",
    marginBottom: 24,
  },
  intro: {
    fontSize: 11,
    color: "#1C1F2E",
    marginBottom: 24,
    lineHeight: 1.6,
  },
  metaBox: {
    backgroundColor: "#F5F4EF",
    padding: 14,
    marginBottom: 24,
    borderLeftWidth: 2,
    borderLeftColor: "#C8A96E",
  },
  metaLabel: {
    fontSize: 8,
    letterSpacing: 1.5,
    color: "#C8A96E",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  metaText: {
    fontSize: 10,
    color: "#1C1F2E",
    lineHeight: 1.5,
  },
  sectionDivider: {
    marginTop: 18,
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#C8A96E",
  },
  sectionLabel: {
    fontSize: 9,
    color: "#C8A96E",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 500,
  },
  layer: {
    marginBottom: 14,
    paddingBottom: 4,
  },
  layerHeader: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 4,
  },
  layerNumber: {
    fontSize: 14,
    fontWeight: 500,
    color: "#C8A96E",
    marginRight: 10,
    width: 18,
  },
  layerTitle: {
    fontSize: 12,
    fontWeight: 500,
    flex: 1,
  },
  layerPrompt: {
    fontSize: 10,
    color: "#1C1F2E",
    marginBottom: 4,
    marginLeft: 28,
  },
  layerExample: {
    fontSize: 9,
    color: "#4A5068",
    fontStyle: "italic",
    marginBottom: 6,
    marginLeft: 28,
    lineHeight: 1.4,
  },
  fillLine: {
    marginLeft: 28,
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "flex-end",
  },
  fillLabel: {
    fontSize: 9,
    color: "#4A5068",
    marginRight: 6,
  },
  fillBlank: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: "#1C1F2E",
    height: 12,
  },
  fastBox: {
    marginTop: 8,
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
  fastQ: {
    fontSize: 10,
    fontWeight: 500,
    marginBottom: 2,
    flexDirection: "row",
  },
  fastQNum: {
    color: "#C8A96E",
    width: 14,
  },
  table: {
    marginTop: 12,
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
    color: "#C8A96E",
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
  checklistSection: {
    marginBottom: 14,
  },
  checklistTitle: {
    fontSize: 12,
    fontWeight: 500,
    marginBottom: 6,
    color: "#1C1F2E",
  },
  checklistItem: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 4,
  },
  checkbox: {
    width: 10,
    height: 10,
    borderWidth: 0.5,
    borderColor: "#1C1F2E",
    marginRight: 8,
    marginTop: 2,
  },
  checklistText: {
    flex: 1,
    fontSize: 10,
    lineHeight: 1.4,
  },
  oneRule: {
    marginTop: 18,
    padding: 14,
    backgroundColor: "#1C1F2E",
    color: "#E8E4DC",
  },
  oneRuleTitle: {
    fontSize: 11,
    color: "#C8A96E",
    fontWeight: 500,
    marginBottom: 4,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  oneRuleText: {
    fontSize: 10,
    color: "#E8E4DC",
    lineHeight: 1.5,
  },
  ctaBox: {
    marginTop: 18,
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
    lineHeight: 1.4,
  },
  footer: {
    position: "absolute",
    bottom: 32,
    left: 56,
    right: 56,
    textAlign: "center",
    fontSize: 8,
    color: "#4A5068",
    paddingTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: "#E8E4DC",
  },
  pageNumber: {
    position: "absolute",
    bottom: 32,
    right: 56,
    fontSize: 8,
    color: "#4A5068",
  },
});

function FrameworkDocument(): React.ReactElement {
  return (
    <Document
      title="The AI Prompt Framework + Definition of Done"
      author="Akritos Technology Partners"
      subject="A 9-layer framework for prompting LLMs and a 5-section checklist for evaluating their output"
      creator="Akritos"
    >
      {/* Cover + framework start */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.brand}>Akritos · Goetch Stone · PSU MacAdmins 2026</Text>
        <Text style={styles.title}>The AI Prompt Framework</Text>
        <Text style={styles.subtitle}>
          + Definition of Done Checklist
        </Text>

        <Text style={styles.intro}>
          Most AI output is mediocre because the prompts that produced it
          didn&apos;t give the AI enough to work with. The model fills the
          gaps from training data, which means it fills them with whatever
          sounds right — confident, generic, often wrong. The fix isn&apos;t
          a smarter model. It&apos;s a habit of giving the model the
          information it needs before asking it for something.
        </Text>

        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>How to use this</Text>
          <Text style={styles.metaText}>
            For high-stakes work, walk through all 9 layers before sending
            the prompt. For low-stakes work, the 3-question fast version on
            page 3 is enough. After every AI output, run the Definition of
            Done checklist on page 4. Print this. Pin it next to your
            monitor.
          </Text>
        </View>

        <View style={styles.sectionDivider}>
          <Text style={styles.sectionLabel}>Part 1</Text>
          <Text style={styles.sectionTitle}>The 9-Layer Framework</Text>
        </View>

        {FRAMEWORK_LAYERS.slice(0, 5).map((layer) => (
          <View key={layer.number} style={styles.layer} wrap={false}>
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
        ))}

        <Text style={styles.footer}>
          akritos.com/ai-risk · The AI Prompt Framework · v1.0
        </Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>

      {/* Layers 6-9 + fast version + stakes matrix */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.brand}>The 9-Layer Framework (continued)</Text>

        {FRAMEWORK_LAYERS.slice(5).map((layer) => (
          <View key={layer.number} style={styles.layer} wrap={false}>
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
        ))}

        <View style={styles.fastBox} wrap={false}>
          <Text style={styles.fastTitle}>The Fast Version (Low Stakes)</Text>
          <Text style={styles.fastIntro}>
            When stakes are low and the domain is well-known, just answer three questions:
          </Text>
          {FAST_QUESTIONS.map((q) => (
            <View key={q.number} style={styles.fastQ}>
              <Text style={styles.fastQNum}>{q.number}.</Text>
              <Text>{q.question}</Text>
            </View>
          ))}
        </View>

        <View style={styles.sectionDivider}>
          <Text style={styles.sectionLabel}>Part 2</Text>
          <Text style={styles.sectionTitle}>When to Use Which Version</Text>
        </View>

        <View style={styles.table}>
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

        <Text style={styles.footer}>
          akritos.com/ai-risk · The AI Prompt Framework · v1.0
        </Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>

      {/* Definition of Done */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.brand}>After You Have AI Output</Text>
        <Text style={styles.title}>Definition of Done Checklist</Text>
        <Text style={styles.subtitle}>
          Use this before you accept any AI output — yours or someone else&apos;s.
        </Text>

        {DEFINITION_OF_DONE.map((section) => (
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
          <Text style={[styles.ctaText, { marginTop: 6, color: "#1C1F2E", fontWeight: 500 }]}>
            akritos.com/ai-risk · akritos.com/book
          </Text>
        </View>

        <Text style={styles.footer}>
          akritos.com/ai-risk · The AI Prompt Framework · v1.0 · Free to share
        </Text>
        <Text
          style={styles.pageNumber}
          render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          fixed
        />
      </Page>
    </Document>
  );
}

export async function renderFrameworkPdf(): Promise<Buffer> {
  const blob = await pdf(<FrameworkDocument />).toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
