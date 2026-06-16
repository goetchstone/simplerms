// components/site/consent-analytics.tsx
"use client";

// GA4 with real consent gating: the Google script is NOT loaded until the
// visitor opts in. Declining loads nothing and sets no cookies. The choice is
// stored in localStorage (not a cookie — so storing the choice itself needs no
// consent) and can be changed later via the footer "Cookie choices" link, which
// dispatches `akritos:open-consent`. After any decision we emit
// `akritos:consent-changed` so that link can reveal itself without a reload.

import Script from "next/script";
import { useEffect, useState } from "react";

const STORAGE_KEY = "akritos_analytics_consent";
type Choice = "granted" | "denied";
// "pending" = SSR / pre-hydration: render nothing so the banner never flashes
// for someone who already chose, and GA4 never loads before we've checked.
type State = "pending" | "none" | Choice;

export function ConsentAnalytics({ measurementId }: { measurementId: string }) {
  const [state, setState] = useState<State>("pending");

  useEffect(() => {
    const read = () => {
      try {
        const v = localStorage.getItem(STORAGE_KEY);
        setState(v === "granted" || v === "denied" ? v : "none");
      } catch {
        setState("none");
      }
    };
    read();
    const reopen = () => setState("none");
    window.addEventListener("akritos:open-consent", reopen);
    return () => window.removeEventListener("akritos:open-consent", reopen);
  }, []);

  function decide(next: Choice) {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage blocked — still honor the choice for this session
    }
    setState(next);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("akritos:consent-changed"));
    }
  }

  // GA4 measurement IDs are alphanumeric + hyphens (e.g. G-XXXXXXXXXX). Guard
  // before interpolating into a script tag — defense-in-depth even though the
  // value is admin-set in Settings.
  const safeId = /^[A-Za-z0-9-]+$/.test(measurementId) ? measurementId : "";

  return (
    <>
      {state === "granted" && safeId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${safeId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${safeId}');`}
          </Script>
        </>
      )}

      {state === "none" && (
        <ConsentBanner onAccept={() => decide("granted")} onDecline={() => decide("denied")} />
      )}
    </>
  );
}

function ConsentBanner({ onAccept, onDecline }: { onAccept: () => void; onDecline: () => void }) {
  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-conviction/30 bg-midnight/95 backdrop-blur"
    >
      <div className="mx-auto flex max-w-[1200px] flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-relaxed text-bone/70">
          We&apos;d like to use Google Analytics to see which pages are useful. It sets
          cookies. You can decline — the site works exactly the same, and we won&apos;t
          load anything until you choose. See our{" "}
          <a href="/privacy" className="text-conviction underline underline-offset-2">
            privacy policy
          </a>
          .
        </p>
        {/* Equal-weight choices — no dark pattern. */}
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={onDecline}
            className="border border-bone/20 px-5 py-2 text-sm font-medium text-bone transition-colors hover:border-conviction hover:text-conviction"
            style={{ borderRadius: "2px" }}
          >
            Decline
          </button>
          <button
            type="button"
            onClick={onAccept}
            className="bg-conviction px-5 py-2 text-sm font-medium text-midnight transition-colors hover:bg-conviction/90"
            style={{ borderRadius: "2px" }}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
