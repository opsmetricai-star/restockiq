/* eslint-disable @next/next/no-img-element */
export function LogoMark({ size = 40, tile = false }: { size?: number; tile?: boolean }) {
  const img = <img src="/logo.png" alt="" width={Math.round(size * 0.89)} height={size} style={{ height: size, width: "auto" }} />;
  return tile ? <span className="inline-flex items-center justify-center rounded-xl bg-white p-1.5">{img}</span> : img;
}

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={light ? 30 : 40} tile={light} />
      <span className={`text-[26px] font-bold tracking-wide ${light ? "text-white" : "text-navy"}`}>
        RESTOCK<span className="text-brand">IQ</span>
      </span>
    </span>
  );
}
