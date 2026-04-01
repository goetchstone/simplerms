// components/site/site-footer.tsx
import Link from "next/link";

export function SiteFooter({ companyName = "SimpleRMS" }: { companyName?: string }) {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="space-y-3">
            <p className="font-semibold text-zinc-900">{companyName}</p>
            <p className="max-w-xs text-sm leading-relaxed text-zinc-500">
              Honest work. Fair prices. People first — always.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-zinc-700">Quick links</p>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li><Link href="/book" className="hover:text-zinc-900">Book a session</Link></li>
              <li><Link href="/support" className="hover:text-zinc-900">Get support</Link></li>
              <li><Link href="/blog" className="hover:text-zinc-900">Blog</Link></li>
              <li><Link href="/portal" className="hover:text-zinc-900">Client portal</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-zinc-700">Our commitments</p>
            <ul className="space-y-2 text-sm text-zinc-500">
              <li>Living wages for every team member</li>
              <li>Radical honesty and transparency</li>
              <li>No upsells, no hidden fees</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-zinc-200 pt-6 text-sm text-zinc-400">
          © {new Date().getFullYear()} {companyName}. Built with integrity.
        </div>
      </div>
    </footer>
  );
}
