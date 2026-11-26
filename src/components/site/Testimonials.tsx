"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TESTIMONIALS } from "@/lib/content";

export function Testimonials() {
  const [i, setI] = useState(0);
  const t = TESTIMONIALS[i];
  const go = (d: number) => setI((i + d + TESTIMONIALS.length) % TESTIMONIALS.length);
  return (
    <div className="mx-auto max-w-4xl text-center">
      <p className="text-xl font-medium leading-relaxed md:text-2xl">&ldquo;{t.quote}&rdquo;</p>
      <div className="mt-6 font-bold">{t.name}</div>
      <div className="text-muted">{t.role}, {t.org}</div>
      <div className="mt-8 flex items-center justify-center gap-4">
        <button onClick={() => go(-1)} aria-label="Previous" className="rounded-full border border-line p-2 hover:bg-sky"><ChevronLeft /></button>
        {TESTIMONIALS.map((_, n) => (<button key={n} onClick={() => setI(n)} aria-label={`Story ${n + 1}`} className={`h-2.5 w-2.5 rounded-full ${n === i ? "bg-brand" : "bg-line"}`} />))}
        <button onClick={() => go(1)} aria-label="Next" className="rounded-full border border-line p-2 hover:bg-sky"><ChevronRight /></button>
      </div>
      <p className="mt-8 text-xs text-muted">Sample stories shown for design review. Replace with approved customer quotes before launch.</p>
    </div>
  );
}
