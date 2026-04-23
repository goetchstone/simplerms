// components/site/site-footer.tsx
import Link from "next/link";
import { LogoMark } from "@/components/brand/logo-mark";
import { Phone, Mail } from "lucide-react";

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
            <div className="space-y-2 text-sm text-bone/50">
              <a href="tel:+18609343410" className="flex items-center gap-2 hover:text-conviction">
                <Phone className="h-3.5 w-3.5" /> (860) 934-3410
              </a>
              <a href="mailto:info@akritos.com" className="flex items-center gap-2 hover:text-conviction">
                <Mail className="h-3.5 w-3.5" /> info@akritos.com
              </a>
            </div>
            <p className="text-xs text-bone/30">
              Remote-first · Nationwide
            </p>
            <p className="text-xs text-bone/20">
              In-person: CT · MA · RI · NYC
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-bone/40">Services</p>
            <ul className="space-y-2 text-sm text-bone/60">
              <li><Link href="/apple-business" className="hover:text-conviction">Apple Business setup</Link></li>
              <li><Link href="/services" className="hover:text-conviction">All services</Link></li>
              <li><Link href="/pricing" className="hover:text-conviction">Pricing</Link></li>
              <li><Link href="/book" className="hover:text-conviction">Book a free consultation</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-bone/40">Company</p>
            <ul className="space-y-2 text-sm text-bone/60">
              <li><Link href="/about" className="hover:text-conviction">About Goetch Stone</Link></li>
              <li><Link href="/blog" className="hover:text-conviction">Blog</Link></li>
              <li><Link href="/contact" className="hover:text-conviction">Contact</Link></li>
              <li><Link href="/careers" className="hover:text-conviction">Careers</Link></li>
              <li><Link href="/support" className="hover:text-conviction">Get support</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-xs font-medium uppercase tracking-[0.15em] text-bone/40">Commitments</p>
            <ul className="space-y-2 text-sm text-bone/50">
              <li>Published rates, no hidden fees</li>
              <li>Zero vendor markup — you verify every dollar</li>
              <li>No partnership revenue or kickbacks</li>
              <li>No vendor lock-in, ever</li>
              <li>Living wages for every team member</li>
              <li>Fully insured — COI available on request</li>
            </ul>
            <div className="pt-2">
              <a
                href="https://www.macadmins.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-bone/30 hover:text-conviction"
              >
                MacAdmins Foundation supporter ↗
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-bone/10 pt-6 sm:flex-row sm:items-center">
          <div className="text-sm text-bone/30">
            <p>© {new Date().getFullYear()} Akritos Technology Partners, LLC. Founded in Connecticut.</p>
          </div>
          <div className="flex gap-4 text-xs text-bone/20">
            <Link href="/privacy" className="hover:text-bone/40">Privacy</Link>
            <Link href="/terms" className="hover:text-bone/40">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
