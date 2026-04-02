// components/site/site-footer.tsx
import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";

export function SiteFooter({ companyName = "Akritos" }: { companyName?: string }) {
  return (
    <footer className="border-t border-bone/10 bg-midnight">
      <div className="mx-auto max-w-[1200px] px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <LogoMark size={20} color="#C8A96E" />
              <span className="text-sm font-medium tracking-[0.2em] text-bone">{companyName}</span>
            </div>
            <p className="text-xs uppercase tracking-[0.15em] text-conviction">
              Technology Partners
            </p>
            <p className="max-w-xs text-sm leading-relaxed text-bone/50">
              We fix the confusion. You keep the independence.
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-bone/40">Services</p>
            <ul className="space-y-2 text-sm text-bone/60">
              <li><Link href="/services" className="hover:text-conviction">All services</Link></li>
              <li><Link href="/pricing" className="hover:text-conviction">Pricing</Link></li>
              <li><Link href="/book" className="hover:text-conviction">Book a session</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-bone/40">Resources</p>
            <ul className="space-y-2 text-sm text-bone/60">
              <li><Link href="/support" className="hover:text-conviction">Get support</Link></li>
              <li><Link href="/blog" className="hover:text-conviction">Blog</Link></li>
              <li><Link href="/portal" className="hover:text-conviction">Client portal</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-bone/40">Our commitments</p>
            <ul className="space-y-2 text-sm text-bone/50">
              <li>Living wages for every team member</li>
              <li>No vendor lock-in, ever</li>
              <li>Published rates, no hidden fees</li>
              <li>Everything is divorceable — including us</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 border-t border-bone/10 pt-6 text-sm text-bone/30">
          © {new Date().getFullYear()} {companyName}. Built with integrity.
        </div>
      </div>
    </footer>
  );
}
