import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

export function HeroIllustration({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 560 420" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#177abf" /><stop offset="1" stopColor="#0a3256" />
        </linearGradient>
      </defs>
      <circle cx="300" cy="215" r="180" fill="#e8f2fa" />
      <rect x="90" y="250" width="380" height="14" rx="7" fill="#c9deee" />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => {
        const h = [90, 140, 110, 180, 150, 210, 170][i];
        return <rect key={i} x={110 + i * 50} y={250 - h} width="30" height={h} rx="8" fill={i % 2 ? "#177abf" : "#0a3256"} opacity={i === 5 ? 1 : 0.85} />;
      })}
      <path d="M115 150 C 190 90, 250 170, 320 110 S 430 60, 462 70" stroke="url(#g1)" strokeWidth="5" strokeLinecap="round" fill="none" strokeDasharray="1 11" />
      <circle cx="462" cy="70" r="12" fill="#177abf" /><circle cx="462" cy="70" r="5" fill="#fff" />
      <g transform="translate(300 300)">
        <rect x="-150" y="0" width="300" height="84" rx="18" fill="#fff" stroke="#c9deee" strokeWidth="2" />
        {[0, 1, 2, 3].map((i) => (<rect key={i} x={-130 + i * 68} y="18" width="52" height="48" rx="10" fill={i === 1 ? "#177abf" : "#e8f2fa"} />))}
        <path d="M-70 42l10 10 18-22" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(80 60)"><rect width="150" height="64" rx="14" fill="#fff" stroke="#c9deee" strokeWidth="2" /><rect x="14" y="16" width="70" height="8" rx="4" fill="#0a3256" /><rect x="14" y="34" width="110" height="8" rx="4" fill="#c9deee" /><rect x="14" y="48" width="50" height="6" rx="3" fill="#177abf" /></g>
    </svg>
  );
}

export function PageHero({ eyebrow, title, children, cta = true, image = true }: { eyebrow?: string; title: ReactNode; children?: ReactNode; cta?: boolean; image?: boolean }) {
  return (
    <section className="hero-grid border-b border-line">
      <div className="container-x grid items-center gap-10 py-16 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div className="fade-up">
          {eyebrow && <div className="mb-3 text-sm font-bold uppercase tracking-widest text-brand">{eyebrow}</div>}
          <h1 className="h-display">{title}</h1>
          {children && <div className="mt-6 max-w-[640px] space-y-4 text-[17px] leading-relaxed text-muted">{children}</div>}
          {cta && (
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/signup" className="btn btn-primary">Create account</Link>
              <Link href="/login" className="btn btn-outline">Sign in</Link>
            </div>
          )}
        </div>
        {image && <HeroIllustration className="mx-auto hidden w-full max-w-[520px] lg:block" />}
      </div>
    </section>
  );
}

export function CtaBand({ title = "Put an AI planning engine behind every inventory decision", text = "Create an account, load your catalogue and sales history, and RestockIQ produces forecasts, reorder points and purchase orders for every SKU.", primary = { href: "/signup", label: "Create account" }, secondary = { href: "/login", label: "Sign in" } }: { title?: string; text?: string; primary?: { href: string; label: string }; secondary?: { href: string; label: string } }) {
  return (
    <section className="bg-navy">
      <div className="container-x py-20 text-center">
        <h2 className="mx-auto max-w-3xl text-3xl font-bold text-white md:text-4xl">{title}</h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-white/80">{text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href={primary.href} className="btn btn-primary">{primary.label}</Link>
          <Link href={secondary.href} className="btn btn-white">{secondary.label}</Link>
        </div>
      </div>
    </section>
  );
}

export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-2 font-bold text-brand">
      {children}<ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

export function Section({ children, tone = "white", className = "" }: { children: ReactNode; tone?: "white" | "mist"; className?: string }) {
  return (
    <section className={`${tone === "mist" ? "bg-mist" : "bg-white"} ${className}`}>
      <div className="container-x py-16 md:py-20">{children}</div>
    </section>
  );
}
