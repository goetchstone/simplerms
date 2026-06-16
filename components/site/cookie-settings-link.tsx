// components/site/cookie-settings-link.tsx
"use client";

// Footer "Cookie choices" reopener. Self-hiding: only appears once a consent
// choice exists (i.e. GA4 consent is actually in play), so it's never a dead
// link on deployments using cookieless analytics or none at all. Clicking it
// re-opens the consent banner via the shared event.

import { useEffect, useState } from "react";

export function CookieSettingsLink() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const check = () => {
      try {
        setShow(localStorage.getItem("akritos_analytics_consent") !== null);
      } catch {
        setShow(false);
      }
    };
    check();
    window.addEventListener("akritos:consent-changed", check);
    return () => window.removeEventListener("akritos:consent-changed", check);
  }, []);

  if (!show) return null;

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("akritos:open-consent"))}
      className="hover:text-bone/40"
    >
      Cookie choices
    </button>
  );
}
