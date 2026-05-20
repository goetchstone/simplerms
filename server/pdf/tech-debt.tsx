// server/pdf/tech-debt.tsx
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
  TECH_DEBT_CATEGORIES,
  PRINCIPLES,
  HOW_TO_USE,
} from "@/lib/tech-debt-content";

// LETTER = 792pt. With 52pt padding top/bottom and 56pt horizontal, usable
// area is ~688pt. One category per page leaves real space for handwritten
// answers — the whole point of a fillable checklist.

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
    marginBottom: 14,
    color: "#1C1F2E",
  },

  // Cover
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
    marginBottom: 28,
  },
  coverIntro: {
    fontSize: 11,
    color: "#1C1F2E",
    marginBottom: 22,
    lineHeight: 1.7,
  },
  metaBox: {
    backgroundColor: "#F5F4EF",
    padding: 16,
    marginBottom: 16,
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
  howToRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  howToMarker: {
    width: 14,
    color: "#C8A96E",
    fontSize: 10,
  },
  howToTitle: {
    fontSize: 10,
    fontWeight: 500,
    color: "#1C1F2E",
    width: 130,
  },
  howToBody: {
    flex: 1,
    fontSize: 10,
    color: "#4A5068",
    lineHeight: 1.55,
  },

  // Category page
  categoryNumber: {
    fontSize: 28,
    fontWeight: 500,
    color: "#C8A96E",
    marginRight: 12,
  },
  categoryHeaderRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 6,
  },
  categoryTitle: {
    fontSize: 22,
    fontWeight: 500,
    color: "#1C1F2E",
    flex: 1,
  },
  categoryIntro: {
    fontSize: 10.5,
    color: "#4A5068",
    marginBottom: 22,
    marginLeft: 0,
    lineHeight: 1.6,
  },
  questionBlock: {
    marginBottom: 16,
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  questionMarker: {
    width: 14,
    fontSize: 10,
    color: "#C8A96E",
  },
  questionText: {
    flex: 1,
    fontSize: 10.5,
    color: "#1C1F2E",
    lineHeight: 1.5,
  },
  answerLine: {
    marginLeft: 14,
    marginTop: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#C8A96E",
    height: 14,
  },

  // Principles page
  principleRow: {
    marginBottom: 18,
  },
  principleTitle: {
    fontSize: 12,
    fontWeight: 500,
    color: "#1C1F2E",
    marginBottom: 4,
  },
  principleBody: {
    fontSize: 10.5,
    color: "#4A5068",
    lineHeight: 1.6,
  },

  // Footer / page chrome
  footer: {
    position: "absolute",
    bottom: 24,
    left: 56,
    right: 56,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 8,
    color: "#4A5068",
  },
  pageNumber: {
    fontSize: 8,
    color: "#4A5068",
  },
});

function Footer({ pageNum, totalPages }: { pageNum: number; totalPages: number }) {
  return (
    <View style={styles.footer} fixed>
      <Text>akritos.com</Text>
      <Text style={styles.pageNumber}>{`${pageNum} / ${totalPages}`}</Text>
    </View>
  );
}

export function TechDebtChecklistDocument() {
  // 1 cover + 8 category pages + 1 principles page = 10 pages total
  const totalPages = 1 + TECH_DEBT_CATEGORIES.length + 1;

  return (
    <Document>
      {/* COVER */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.brand}>Akritos · The Tech Debt Checklist</Text>
        <View style={styles.coverWrap}>
          <Text style={styles.coverTitle}>The Tech Debt Checklist</Text>
          <Text style={styles.coverSubtitle}>
            Eight categories. Roughly forty questions. One honest hour with your business.
          </Text>

          <Text style={styles.coverIntro}>
            Every small business has tech debt. The hardware nobody planned to
            replace. The vendor whose rate quietly crept up. The backup that
            might not actually be running. The cloud account tied to a personal
            Gmail nobody can access anymore.
          </Text>

          <Text style={styles.coverIntro}>
            This checklist is how we find it before it finds you. Walk through
            it on your own, or book a free one-hour consultation and we&apos;ll
            walk it with you.
          </Text>

          <View style={styles.metaBox}>
            <Text style={styles.metaLabel}>How to use this</Text>
            {HOW_TO_USE.map((item) => (
              <View key={item.title} style={styles.howToRow}>
                <Text style={styles.howToMarker}>·</Text>
                <Text style={styles.howToTitle}>{item.title}</Text>
                <Text style={styles.howToBody}>{item.body}</Text>
              </View>
            ))}
          </View>
        </View>
        <Footer pageNum={1} totalPages={totalPages} />
      </Page>

      {/* CATEGORY PAGES — one per category, room for handwritten answers */}
      {TECH_DEBT_CATEGORIES.map((category, idx) => (
        <Page key={category.number} size="LETTER" style={styles.page}>
          <Text style={styles.pageHeader}>Tech Debt Checklist</Text>
          <View style={styles.categoryHeaderRow}>
            <Text style={styles.categoryNumber}>{category.number}.</Text>
            <Text style={styles.categoryTitle}>{category.title}</Text>
          </View>
          <Text style={styles.categoryIntro}>{category.intro}</Text>

          {category.questions.map((q, qIdx) => (
            <View key={qIdx} style={styles.questionBlock}>
              <View style={styles.questionRow}>
                <Text style={styles.questionMarker}>{"□"}</Text>
                <Text style={styles.questionText}>{q}</Text>
              </View>
              <View style={styles.answerLine} />
              <View style={styles.answerLine} />
            </View>
          ))}

          <Footer pageNum={idx + 2} totalPages={totalPages} />
        </Page>
      ))}

      {/* CLOSING — PRINCIPLES */}
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.pageHeader}>Tech Debt Checklist</Text>
        <Text style={styles.pageTitle}>Five principles that keep this from happening again</Text>

        {PRINCIPLES.map((p) => (
          <View key={p.principle} style={styles.principleRow}>
            <Text style={styles.principleTitle}>{p.principle}</Text>
            <Text style={styles.principleBody}>{p.body}</Text>
          </View>
        ))}

        <View style={[styles.metaBox, { marginTop: 20 }]}>
          <Text style={styles.metaLabel}>If you want a hand</Text>
          <Text style={styles.metaText}>
            We offer the first hour free. Same checklist, walked through your
            environment with you, ending with a clear list of what needs attention
            and what a written roadmap would cost if you want one. Book at akritos.com/book.
          </Text>
        </View>

        <Footer pageNum={totalPages} totalPages={totalPages} />
      </Page>
    </Document>
  );
}

export async function renderTechDebtPdf(): Promise<Buffer> {
  const blob = await pdf(<TechDebtChecklistDocument />).toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
