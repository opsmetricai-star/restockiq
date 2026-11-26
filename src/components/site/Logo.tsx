export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" aria-hidden>
      <rect x="2" y="2" width="16" height="16" rx="5" fill="#0a3256" />
      <rect x="22" y="2" width="16" height="16" rx="5" fill="#177abf" />
      <rect x="2" y="22" width="16" height="16" rx="5" fill="#177abf" />
      <rect x="22" y="22" width="16" height="16" rx="5" fill="#0a3256" />
      <path d="M12 27l4 4 8-9" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark />
      <span className={`text-[26px] font-bold tracking-wide ${light ? "text-white" : "text-navy"}`}>
        RESTOCK<span className="text-brand">IQ</span>
      </span>
    </span>
  );
}
