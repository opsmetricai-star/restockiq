import Link from "next/link";
import { Logo } from "./Logo";
import { SOLUTIONS, GUIDES, LEGAL_PAGES } from "@/lib/content";

const col = "text-[14px] leading-7 text-white/80 hover:text-white";
const head = "mb-3 text-[15px] font-bold text-white";

export function Footer() {
  const legalA = ["privacy-trust-center", "infosec-faq", "ai-governance-trust", "vulnerability-disclosure", "security-compliance"];
  const legalB = ["anti-bribery-anti-corruption", "code-of-conduct", "corporate-responsibility", "environmental", "modern-slavery-statement", "whistleblowing"];
  return (
    <footer className="bg-navy text-white">
      <div className="container-x py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div>
            <Logo light />
            <ul className="mt-6 space-y-1">
              {[["/company/about", "About us"], ["/careers", "Careers"], ["/customers", "Customers"], ["/events", "Events"], ["/demo-request", "Request a demo"], ["/resources", "Resources"], ["/platform", "Unified platform"], ["/pricing", "Pricing"]].map(([h, t]) => (
                <li key={h}><Link href={h} className={col}>{t}</Link></li>
              ))}
            </ul>
            <div className="mt-6">
              <div className={head}>Reference index</div>
              <ul><li><Link href="/resources" className={col}>RFP support: Forecasting & Replenishment</Link></li><li><Link href="/resources" className={col}>RFP support: Demand Planning & Sensing</Link></li></ul>
              <div className={`${head} mt-4`}>Vendor comparison</div>
              <ul><li><Link href="/resources" className={col}>RestockIQ vs spreadsheets</Link></li></ul>
            </div>
          </div>
          <div>
            <div className={head}>Helpful guides</div>
            <ul>{GUIDES.map((g) => (<li key={g.slug}><Link href={`/resources/${g.slug}`} className={col}>{g.title}</Link></li>))}</ul>
          </div>
          <div className="lg:col-span-2">
            <div className={head}>Our Solutions</div>
            <ul className="columns-1 gap-8 sm:columns-2">
              {SOLUTIONS.slice().sort((a, b) => a.title.localeCompare(b.title)).map((s) => (<li key={s.slug} className="break-inside-avoid"><Link href={`/solutions/${s.slug}`} className={col}>{s.title}</Link></li>))}
            </ul>
          </div>
          <div>
            <div className={head}>Security at RestockIQ</div>
            <ul>{legalA.map((s) => (<li key={s}><Link href={`/legal/${s}`} className={col}>{LEGAL_PAGES[s]}</Link></li>))}</ul>
            <div className={`${head} mt-6`}>Ethical compliance</div>
            <ul>{legalB.map((s) => (<li key={s}><Link href={`/legal/${s}`} className={col}>{LEGAL_PAGES[s]}</Link></li>))}</ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/20 pt-6 text-[13px] text-white/70 md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} RestockIQ. All rights reserved.</div>
          <div className="flex flex-wrap gap-5">
            <Link href="/legal/privacy-policy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/legal/terms-of-use" className="hover:text-white">Terms of Use</Link>
            <Link href="/sitemap.xml" className="hover:text-white">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
