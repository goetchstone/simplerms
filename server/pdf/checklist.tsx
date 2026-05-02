// server/pdf/checklist.tsx
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
import { CHECKLIST, totalQuestions } from "@/lib/checklist-content";

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
    marginBottom: 8,
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
    marginBottom: 28,
    lineHeight: 1.6,
  },
  metaBox: {
    backgroundColor: "#F5F4EF",
    padding: 14,
    marginBottom: 28,
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
  categoryHeader: {
    marginTop: 24,
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#C8A96E",
  },
  categoryNumber: {
    fontSize: 9,
    color: "#C8A96E",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 500,
  },
  categoryIntro: {
    fontSize: 10,
    color: "#4A5068",
    marginBottom: 14,
    lineHeight: 1.5,
  },
  question: {
    flexDirection: "row",
    marginBottom: 12,
  },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: "#1C1F2E",
    marginRight: 10,
    marginTop: 2,
  },
  questionContent: {
    flex: 1,
  },
  questionText: {
    fontSize: 11,
    fontWeight: 500,
    marginBottom: 3,
  },
  whyText: {
    fontSize: 9,
    color: "#4A5068",
    fontStyle: "italic",
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
  ctaBox: {
    marginTop: 32,
    padding: 16,
    backgroundColor: "#1C1F2E",
    color: "#E8E4DC",
  },
  ctaTitle: {
    fontSize: 13,
    color: "#C8A96E",
    fontWeight: 500,
    marginBottom: 6,
  },
  ctaText: {
    fontSize: 10,
    color: "#E8E4DC",
    lineHeight: 1.5,
  },
});

function ChecklistDocument(): React.ReactElement {
  return (
    <Document
      title="Vendor Independence Checklist"
      author="Akritos Technology Partners"
      subject="A checklist for small business owners to identify what they own vs. what their vendors hold"
      creator="Akritos"
    >
      <Page size="LETTER" style={styles.page}>
        <Text style={styles.brand}>Akritos</Text>
        <Text style={styles.title}>The Vendor Independence Checklist</Text>
        <Text style={styles.subtitle}>
          {totalQuestions()} questions to find out what you don&apos;t actually own
        </Text>

        <Text style={styles.intro}>
          You don&apos;t need to own your whole tech stack. You need to own the
          keys to move. This checklist walks through the most common ownership
          gaps we see in small businesses — the things that quietly belong to
          your IT provider, your web designer, your marketing agency, or your
          MSP, until the day you need to leave and discover you can&apos;t.
        </Text>

        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>How to use this</Text>
          <Text style={styles.metaText}>
            Walk through each question. Check the box if you can answer it
            confidently — &quot;yes, I know who controls this and I have
            access.&quot; Leave it blank if you can&apos;t. The blanks are the
            audit. For each blank, identify who in your world would know, and
            ask them. Most of these questions are 5-minute conversations once
            you know who to call.
          </Text>
        </View>

        {CHECKLIST.map((cat, i) => (
          <View key={cat.title} wrap={i > 0}>
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryNumber}>Section {i + 1}</Text>
              <Text style={styles.categoryTitle}>{cat.title}</Text>
            </View>
            <Text style={styles.categoryIntro}>{cat.intro}</Text>

            {cat.questions.map((q) => (
              <View key={q.question} style={styles.question} wrap={false}>
                <View style={styles.checkbox} />
                <View style={styles.questionContent}>
                  <Text style={styles.questionText}>{q.question}</Text>
                  <Text style={styles.whyText}>Why this matters: {q.why}</Text>
                </View>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.ctaBox} wrap={false}>
          <Text style={styles.ctaTitle}>Want a walkthrough?</Text>
          <Text style={styles.ctaText}>
            We offer a free 30-minute consultation where we go through this
            checklist with you, identify what you&apos;re missing, and give you
            a written plan you can keep. No pitch, no pressure — even if you
            never hire us, you walk out with a clearer picture of what you
            actually own.
          </Text>
          <Text style={[styles.ctaText, { marginTop: 8 }]}>
            Book at akritos.com/book or email info@akritos.com
          </Text>
        </View>

        <Text style={styles.footer}>
          akritos.com · Vendor Independence Checklist · v1.0
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

export async function renderChecklistPdf(): Promise<Buffer> {
  const blob = await pdf(<ChecklistDocument />).toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  return Buffer.from(arrayBuffer);
}
