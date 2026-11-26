"use client";
import { useState } from "react";

export function DemoForm() {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("loading");
    const body = Object.fromEntries(new FormData(e.currentTarget));
    const r = await fetch("/api/demo-request", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const j = await r.json().catch(() => ({}));
    if (r.ok) setState("done");
    else { setState("error"); setMsg(j.error ?? "Something went wrong."); }
  }
  if (state === "done") return <div className="card p-8 text-center"><h3 className="text-xl font-bold">Thank you</h3><p className="mt-2 text-muted">We received your request and will be in touch shortly.</p></div>;
  return (
    <form onSubmit={submit} className="card space-y-4 p-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <input name="name" required placeholder="Full name" className="field" />
        <input name="email" type="email" required placeholder="Work email" className="field" />
        <input name="company" required placeholder="Company" className="field" />
        <select name="role" className="field" defaultValue="Retailer">{["Retailer", "Wholesaler / distributor", "Manufacturer", "Other"].map((o) => <option key={o}>{o}</option>)}</select>
      </div>
      <textarea name="message" rows={4} placeholder="What would you like to plan better?" className="field" />
      {state === "error" && <p className="text-sm text-red-600">{msg}</p>}
      <button disabled={state === "loading"} className="btn btn-primary w-full">{state === "loading" ? "Sending…" : "Request a demo"}</button>
    </form>
  );
}
