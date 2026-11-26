"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { SOLUTIONS, SOLUTION_GROUPS, INDUSTRIES, PLATFORM_LINKS } from "@/lib/content";

type Key = "platform" | "solutions" | "industries" | null;
const LABELS = [["platform", "Platform"], ["solutions", "Solutions"], ["industries", "Industries"]] as const;

export function Header() {
  const [open, setOpen] = useState<Key>(null);
  const [mobile, setMobile] = useState(false);
  const [mobSub, setMobSub] = useState<Key>(null);
  const close = () => { setOpen(null); setMobile(false); };

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white" onMouseLeave={() => setOpen(null)}>
      <div className="container-x flex h-[76px] items-center justify-between gap-6">
        <Link href="/" aria-label="RestockIQ home" onClick={close}><Logo /></Link>

        <nav className="hidden items-center gap-1 text-[16px] font-medium lg:flex" aria-label="Main">
          {LABELS.map(([k, label]) => (
            <button key={k} onMouseEnter={() => setOpen(k)} onFocus={() => setOpen(k)} onClick={() => setOpen(open === k ? null : k)}
              className={`whitespace-nowrap rounded-md px-3 py-2 hover:text-brand ${open === k ? "text-brand" : ""}`} aria-expanded={open === k}>
              {label}<ChevronDown size={15} className="ml-1 inline" />
            </button>
          ))}
          <Link href="/pricing" className="whitespace-nowrap px-3 py-2 hover:text-brand" onMouseEnter={() => setOpen(null)}>Pricing</Link>
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <Link href="/login" className="text-[15px] font-medium hover:text-brand">Sign in</Link>
          <Link href="/signup" className="btn btn-primary !py-2.5">Sign up</Link>
        </div>

        <button className="lg:hidden" onClick={() => setMobile(!mobile)} aria-label="Menu" aria-expanded={mobile}>
          {mobile ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {open && (
        <div className="absolute inset-x-0 top-full hidden border-b border-line bg-white shadow-[0_24px_40px_rgba(10,50,86,0.12)] lg:block">
          <div className="container-x py-8">
            {open === "platform" && (
              <div className="grid grid-cols-3 gap-x-10 gap-y-5">
                {PLATFORM_LINKS.map((l) => (
                  <Link key={l.href} href={l.href} className="group block rounded-xl p-3 hover:bg-sky" onClick={close}>
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
                          <li key={s.slug}><Link href={`/solutions/${s.slug}`} className="hover:text-brand" onClick={close}>{s.title}</Link></li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <Link href="/solutions" className="mt-6 inline-block font-bold text-brand" onClick={close}>All solutions</Link>
              </div>
            )}
            {open === "industries" && (
              <div>
                <div className="grid grid-cols-4 gap-8">
                  {INDUSTRIES.map((i) => (
                    <div key={i.slug}>
                      <Link href={`/industries/${i.slug}`} className="mb-2 block border-b border-line pb-1 font-bold hover:text-brand" onClick={close}>{i.title}</Link>
                      <ul className="space-y-1.5 text-[14px]">
                        {i.children?.map((c) => (
                          <li key={c.slug}><Link href={`/industries/${i.slug}/${c.slug}`} className="hover:text-brand" onClick={close}>{c.title}</Link></li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <Link href="/industries" className="mt-6 inline-block font-bold text-brand" onClick={close}>All industries</Link>
              </div>
            )}
          </div>
        </div>
      )}

      {mobile && (
        <div className="max-h-[80vh] overflow-y-auto border-t border-line bg-white px-6 pb-8 lg:hidden">
          {LABELS.map(([k, label]) => (
            <div key={k} className="border-b border-line">
              <button className="flex w-full items-center justify-between py-4 text-lg font-medium" onClick={() => setMobSub(mobSub === k ? null : k)} aria-expanded={mobSub === k}>
                {label}<ChevronDown size={18} className={mobSub === k ? "rotate-180" : ""} />
              </button>
              {mobSub === k && (
                <ul className="space-y-3 pb-4 pl-3 text-[15px]">
                  {k === "platform" && PLATFORM_LINKS.map((l) => <li key={l.href}><Link href={l.href} onClick={close}>{l.title}</Link></li>)}
                  {k === "solutions" && [<li key="all"><Link className="font-bold text-brand" href="/solutions" onClick={close}>All solutions</Link></li>, ...SOLUTIONS.map((s) => <li key={s.slug}><Link href={`/solutions/${s.slug}`} onClick={close}>{s.title}</Link></li>)]}
                  {k === "industries" && [<li key="all"><Link className="font-bold text-brand" href="/industries" onClick={close}>All industries</Link></li>, ...INDUSTRIES.map((i) => <li key={i.slug}><Link href={`/industries/${i.slug}`} onClick={close}>{i.title}</Link></li>)]}
                </ul>
              )}
            </div>
          ))}
          <Link href="/pricing" onClick={close} className="block border-b border-line py-4 text-lg font-medium">Pricing</Link>
          <Link href="/login" onClick={close} className="block border-b border-line py-4 text-lg font-medium">Sign in</Link>
          <Link href="/signup" onClick={close} className="btn btn-primary mt-6 w-full">Sign up</Link>
        </div>
      )}
    </header>
  );
}
