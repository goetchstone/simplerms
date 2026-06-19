// scripts/gen-brand-assets.mjs
// One-off generator for the static brand rasters: og-default.png (the Open
// Graph / Twitter card and the JSON-LD Article image fallback) and logo.png
// (the JSON-LD Organization logo). Re-run when the brand card changes:
//   npx tsx scripts/gen-brand-assets.mjs
// Uses next/og (already a dependency) so there's no new tooling to maintain.

import { createElement as h } from "react";
import { ImageResponse } from "next/og";
import { writeFile } from "node:fs/promises";

const MIDNIGHT = "#1C1F2E";
const GOLD = "#C8A96E";
const BONE = "#E8E4DC";

const ogCard = h(
  "div",
  {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      padding: 80,
      background: MIDNIGHT,
      color: BONE,
    },
  },
  [
    h("div", { key: "top", style: { display: "flex", alignItems: "center", gap: 16 } }, [
      h("div", { key: "m", style: { width: 36, height: 36, background: GOLD, borderRadius: 2 } }),
      h("div", { key: "w", style: { fontSize: 22, letterSpacing: "0.2em", textTransform: "uppercase", color: GOLD } }, "Akritos"),
    ]),
    h("div", { key: "mid", style: { display: "flex", flexDirection: "column", gap: 24 } }, [
      h("div", { key: "h", style: { fontSize: 60, fontWeight: 500, lineHeight: 1.1, maxWidth: 920 } }, "Technology Partners for Small Business"),
      h("div", { key: "s", style: { fontSize: 28, color: "rgba(232, 228, 220, 0.6)", maxWidth: 920, lineHeight: 1.4 } }, "Apple Business, MDM, infrastructure, e-commerce — published rates, zero vendor markup, no lock-in."),
    ]),
    h("div", { key: "url", style: { fontSize: 20, color: "rgba(232, 228, 220, 0.4)" } }, "akritos.com"),
  ]
);

const logoMark = h(
  "div",
  {
    style: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 28,
      background: MIDNIGHT,
    },
  },
  [
    h("div", { key: "m", style: { width: 96, height: 96, background: GOLD, borderRadius: 6 } }),
    h("div", { key: "w", style: { fontSize: 64, fontWeight: 600, letterSpacing: "0.12em", color: BONE } }, "AKRITOS"),
  ]
);

async function toPng(node, size) {
  const res = new ImageResponse(node, size);
  return Buffer.from(await res.arrayBuffer());
}

await writeFile("public/og-default.png", await toPng(ogCard, { width: 1200, height: 630 }));
await writeFile("public/logo.png", await toPng(logoMark, { width: 512, height: 512 }));
console.log("wrote public/og-default.png and public/logo.png");
