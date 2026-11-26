"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, Search, X, Globe } from "lucide-react";
import { Logo } from "./Logo";
import { SOLUTIONS, SOLUTION_GROUPS, INDUSTRIES, PLATFORM_LINKS, COMPANY_LINKS, CAREER_LINKS, TOP_LINKS } from "@/lib/content";

type Key = "platform" | "solutions" | "industries" | "company" | "careers" | null;

function Caret() {
  return <ChevronDown size={15} className="ml-1 inline" />;
}

export function Header() {
  const [open, setOpen] = useState<Key>(null);
  const [mobile, setMobile] = useState(false);
  const [mobSub, setMobSub] = useState<Key>(null);
  const trig = (k: Exclude<Key, null>) => ({
    onMouseEnter: () => setOpen(k),
    onFocus: () => setOpen(k),
  });

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white" onMouseLeave={() => setOpen(null)}>
      <div className="hidden border-b border-line lg:block">
        <div className="container-x flex justify-end gap-7 py-2 text-[13px] font-medium text-navy">
          {TOP_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-brand">{l.title}</Link>
          ))}
        </div>
      </div>
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <Link href="/" aria-label="RestockIQ home"><Logo /></Link>

        <nav className="hidden items-center gap-0 text-[15px] font-medium lg:flex" aria-label="Main">
          {([["platform", "Platform"], ["solutions", "Solutions"], ["industries", "Industries"]] as const).map(([k, label]) => (
            <button key={k} {...trig(k)} onClick={() => setOpen(open === k ? null : k)}
              className={`whitespace-nowrap rounded-md px-2.5 py-2 hover:text-brand ${open === k ? "text-brand" : ""}`} aria-expanded={open === k}>
              {label}<Caret />
            </button>
          ))}
          <Link href="/customers" className="whitespace-nowrap px-2.5 py-2 hover:text-brand" onMouseEnter={() => setOpen(null)}>Customers</Link>
          <Link href="/resources" className="whitespace-nowrap px-2.5 py-2 hover:text-brand" onMouseEnter={() => setOpen(null)}>Resources</Link>
          <Link href="/pricing" className="whitespace-nowrap px-2.5 py-2 hover:text-brand" onMouseEnter={() => setOpen(null)}>Pricing</Link>
          {([["company", "Company"], ["careers", "Careers"]] as const).map(([k, label]) => (
            <button key={k} {...trig(k)} onClick={() => setOpen(open === k ? null : k)}
              className={`whitespace-nowrap rounded-md px-2.5 py-2 hover:text-brand ${open === k ? "text-brand" : ""}`} aria-expanded={open === k}>
              {label}<Caret />
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <Link href="/search" aria-label="Search" className="hover:text-brand"><Search size={20} /></Link>
          <span className="flex items-center gap-1 text-[15px] font-medium"><Globe size={18} /> EN</span>
          <Link href="/login" className="text-[15px] font-medium hover:text-brand">Sign in</Link>
          <Link href="/demo-request" className="btn btn-primary !py-2.5">Request a demo</Link>
        </div>

        <button className="lg:hidden" onClick={() => setMobile(!mobile)} aria-label="Menu">
          {mobile ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mega panels */}
      {open && (
        <div className="absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-[0_24px_40px_rgba(10,50,86,0.12)] lg:block">
          <div className="container-x py-8">
            {open === "platform" && (
              <div className="grid grid-cols-3 gap-x-10 gap-y-5">
                {PLATFORM_LINKS.map((l) => (
                  <Link key={l.href} href={l.href} className="group block rounded-xl p-3 hover:bg-sky" onClick={() => setOpen(null)}>
                    <div className="font-bold group-hover:text-brand">{l.title}</div>
                    <div className="text-sm text-muted">{l.desc}</div>
                  </Link>
                ))}
              </div>
            )}
            {open === "solutions" && (
              <div>
                <div className="grid grid-cols-5 gap-x-8 gap-y-6">
                  {SOLUTION_GROUPS.map((g) => (
                    <div key={g}>
                      <div className="mb-2 border-b border-line pb-1 text-[13px] font-bold uppercase tracking-wide text-brand">{g}</div>
                      <ul className="space-y-1.5 text-[14px]">
                        {SOLUTIONS.filter((s) => s.group === g).map((s) => (
                          <li key={s.slug}><Link href={`/solutions/${s.slug}`} className="hover:text-brand" onClick={() => setOpen(null)}>{s.title}</Link></li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <Link href="/solutions" className="mt-6 inline-block font-bold text-brand" onClick={() => setOpen(null)}>See all Solutions →</Link>
              </div>
            )}
            {open === "industries" && (
              <div>
                <div className="grid grid-cols-4 gap-8">
                  {INDUSTRIES.map((i) => (
                    <div key={i.slug}>
                      <Link href={`/industries/${i.slug}`} className="mb-2 block border-b border-line pb-1 font-bold hover:text-brand" onClick={() => setOpen(null)}>{i.title}</Link>
                      <ul className="space-y-1.5 text-[14px]">
                        {i.children?.map((c) => (
                          <li key={c.slug}><Link href={`/industries/${i.slug}/${c.slug}`} className="hover:text-brand" onClick={() => setOpen(null)}>{c.title}</Link></li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <Link href="/industries" className="mt-6 inline-block font-bold text-brand" onClick={() => setOpen(null)}>See all Industries →</Link>
              </div>
            )}
            {open === "company" && (
              <ul className="grid grid-cols-4 gap-3">
                {COMPANY_LINKS.map((l) => (<li key={l.href}><Link href={l.href} className="block rounded-lg p-2 font-medium hover:bg-sky hover:text-brand" onClick={() => setOpen(null)}>{l.title}</Link></li>))}
              </ul>
            )}
            {open === "careers" && (
              <ul className="grid grid-cols-4 gap-3">
                {CAREER_LINKS.map((l) => (<li key={l.href}><Link href={l.href} className="block rounded-lg p-2 font-medium hover:bg-sky hover:text-brand" onClick={() => setOpen(null)}>{l.title}</Link></li>))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Mobile menu */}
      {mobile && (
        <div className="max-h-[80vh] overflow-y-auto border-t border-line bg-white px-6 pb-8 lg:hidden">
          {([["platform", "Platform"], ["solutions", "Solutions"], ["industries", "Industries"]] as const).map(([k, label]) => (
            <div key={k} className="border-b border-line">
              <button className="flex w-full items-center justify-between py-4 text-lg font-medium" onClick={() => setMobSub(mobSub === k ? null : k)}>
                {label}<ChevronDown size={18} className={mobSub === k ? "rotate-180" : ""} />
              </button>
              {mobSub === k && (
                <ul className="space-y-3 pb-4 pl-3 text-[15px]">
                  {k === "platform" && PLATFORM_LINKS.map((l) => <li key={l.href}><Link href={l.href} onClick={() => setMobile(false)}>{l.title}</Link></li>)}
                  {k === "solutions" && [<li key="all"><Link className="font-bold text-brand" href="/solutions" onClick={() => setMobile(false)}>All solutions</Link></li>, ...SOLUTIONS.map((s) => <li key={s.slug}><Link href={`/solutions/${s.slug}`} onClick={() => setMobile(false)}>{s.title}</Link></li>)]}
                  {k === "industries" && INDUSTRIES.map((i) => <li key={i.slug}><Link href={`/industries/${i.slug}`} onClick={() => setMobile(false)}>{i.title}</Link></li>)}
                </ul>
              )}
            </div>
          ))}
          {[["/customers", "Customers"], ["/resources", "Resources"], ["/pricing", "Pricing"], ["/company/about", "Company"], ["/careers", "Careers"], ["/login", "Sign in"]].map(([h, t]) => (
            <Link key={h} href={h} onClick={() => setMobile(false)} className="block border-b border-line py-4 text-lg font-medium">{t}</Link>
          ))}
          <Link href="/demo-request" onClick={() => setMobile(false)} className="btn btn-primary mt-6 w-full">Request a demo</Link>
        </div>
      )}
    </header>
  );
}
