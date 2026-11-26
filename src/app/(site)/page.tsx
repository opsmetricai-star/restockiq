import Link from "next/link";
import { HeroIllustration, CtaBand, ArrowLink, Section } from "@/components/site/Ui";
import { ValueChain } from "@/components/site/ValueChain";
import { Testimonials } from "@/components/site/Testimonials";
import { CUSTOMER_LOGOS, FEATURED_RESOURCES } from "@/lib/content";

export default function Home() {
  return (
    <>
      <section className="hero-grid">
        <div className="container-x grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div className="fade-up">
            <h1 className="h-display">An AI-native platform for end-to-end planning</h1>
            <p className="mt-6 text-[17px] leading-relaxed text-muted">RestockIQ is a unified, AI-native platform that retailers, manufacturers and wholesalers use to sharpen forecasts, right-size inventory and automate replenishment, from production to shelf.</p>
            <p className="mt-4 text-[17px] leading-relaxed text-muted">By pairing built-in machine learning and agentic AI with deep supply chain know-how, RestockIQ drives better decisions, higher product availability, stronger sales and profitable growth at scale.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/demo-request" className="btn btn-primary">Request a demo</Link>
              <Link href="/platform" className="btn btn-outline">Why RestockIQ?</Link>
            </div>
          </div>
          <HeroIllustration className="mx-auto w-full max-w-[540px]" />
        </div>
      </section>

      <Section tone="mist">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="h-display">What planning with RestockIQ looks like</h2>
          <div className="mt-8 space-y-5 text-[17px] leading-relaxed text-muted">
            <p>Forecasts get sharper because every signal (demand, supply, price, promotions) feeds one model. Inventory drops because replenishment decisions are automated and self-correcting. Waste falls because the platform sees disruption before it becomes a problem.</p>
            <p>Our predictive engine adapts to growing supply chain complexity and market volatility. It turns real-time data into unified forecasts, automated processes and clear next actions.</p>
            <p>The result is planning that connects every part of the operation: not just better reports, but decisions that move the business forward.</p>
          </div>
        </div>
      </Section>

      <Section>
        <h2 className="h-display mx-auto mb-10 max-w-3xl text-center">Explore how RestockIQ supports the entire consumer goods value chain</h2>
        <ValueChain />
      </Section>

      <Section tone="mist">
        <h2 className="mb-8 text-center text-2xl font-bold">Trusted by industry-leading retailers and manufacturers</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CUSTOMER_LOGOS.map((n) => (<div key={n} className="card flex h-20 items-center justify-center text-lg font-bold tracking-wide text-navy/70">{n}</div>))}
        </div>
        <div className="mt-8 text-center"><ArrowLink href="/customers">View all customers</ArrowLink></div>
      </Section>

      <Section>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="card bg-sky p-10">
            <div className="text-sm font-bold uppercase tracking-widest text-brand">Independent evaluation</div>
            <h2 className="mt-3 text-2xl font-bold md:text-3xl">Benchmark the platform against your own data</h2>
            <p className="mt-4 text-muted">Analyst quotes and awards will appear here once earned. Until then, run a forecast bake-off on your history and compare WAPE and bias against your current process.</p>
            <div className="mt-6"><ArrowLink href="/resources/measuring-forecast-accuracy">Read the accuracy guide</ArrowLink></div>
          </div>
          <div className="card p-10">
            <div className="text-sm font-bold uppercase tracking-widest text-brand">Connected ecosystem</div>
            <h2 className="mt-3 text-2xl font-bold md:text-3xl">Break down silos for a unified view of your supply chain</h2>
            <p className="mt-4 text-muted">The RestockIQ ecosystem connects suppliers, distributors and retailers around a shared view of demand, inventory and supply, so shoppers find the products they want however they buy.</p>
            <div className="mt-6"><ArrowLink href="/platform/integrations">Explore how</ArrowLink></div>
          </div>
        </div>
      </Section>

      <section className="bg-brand">
        <div className="container-x flex flex-col items-center justify-between gap-6 py-14 text-white md:flex-row">
          <h2 className="text-3xl font-bold">Start your journey with our unified platform</h2>
          <Link href="/signup" className="btn btn-white">Start free</Link>
        </div>
      </section>

      <Section>
        <h2 className="h-display mb-10 text-center">Why our customers love working with us</h2>
        <Testimonials />
      </Section>

      <Section tone="mist">
        <h2 className="h-display mb-10 text-center">Resources for you</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {FEATURED_RESOURCES.map((r) => (
            <Link key={r.title} href={r.href} className="card card-hover block p-7">
              <div className="mb-3 inline-block rounded-full bg-sky px-3 py-1 text-xs font-bold uppercase text-brand">{r.type}</div>
              <h3 className="text-xl font-bold leading-snug">{r.title}</h3>
              <p className="mt-3 text-muted">{r.desc}</p>
              <div className="mt-5 font-bold text-brand">Read more →</div>
            </Link>
          ))}
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
