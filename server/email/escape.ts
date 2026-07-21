// server/email/escape.ts
// Escape a user-supplied value before interpolating it into email HTML. Email
// bodies are built with template strings, so nothing escapes for us the way
// React does in the UI — every user-derived value placed into an HTML template
// (names, subjects, notes, message bodies, even the settings-driven company
// name) must pass through here. Otherwise an attacker who controls that value
// injects markup into a recipient's inbox, sent from our authenticated domain
// (phishing links, tracking pixels, spoofed content). Plain-text bodies don't
// need this; only the HTML path.
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
