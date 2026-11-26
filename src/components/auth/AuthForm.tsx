"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Logo } from "@/components/site/Logo";

type Mode = "login" | "signup" | "forgot" | "reset";
const TITLES: Record<Mode, string> = { login: "Sign in to RestockIQ", signup: "Create your free workspace", forgot: "Reset your password", reset: "Choose a new password" };

export function AuthForm({ mode, configured }: { mode: Mode; configured: boolean }) {
  const router = useRouter();
  const sp = useSearchParams();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(sp.get("error") === "not_configured" ? "Authentication is not configured yet (missing Supabase environment variables)." : "");
  const [info, setInfo] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!configured) { setErr("Authentication is not configured yet (missing Supabase environment variables)."); return; }
    setBusy(true); setErr(""); setInfo("");
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    const sb = createClient();
    const origin = window.location.origin;
    if (mode === "login") {
      const { error } = await sb.auth.signInWithPassword({ email: f.email, password: f.password });
      if (error) setErr(error.message); else { router.push(sp.get("next") || "/app"); router.refresh(); }
    } else if (mode === "signup") {
      const { data, error } = await sb.auth.signUp({ email: f.email, password: f.password, options: { data: { full_name: f.full_name, org_name: f.org_name }, emailRedirectTo: `${origin}/auth/callback` } });
      if (error) setErr(error.message);
      else if (data.session) { router.push("/app"); router.refresh(); }
      else setInfo("Check your inbox to confirm your email, then sign in.");
    } else if (mode === "forgot") {
      const { error } = await sb.auth.resetPasswordForEmail(f.email, { redirectTo: `${origin}/auth/callback?next=/reset-password` });
      if (error) setErr(error.message); else setInfo("If that email exists, a reset link is on its way.");
    } else {
      const { error } = await sb.auth.updateUser({ password: f.password });
      if (error) setErr(error.message); else { setInfo("Password updated."); setTimeout(() => router.push("/app"), 800); }
    }
    setBusy(false);
  }

  return (
    <div className="hero-grid flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <Link href="/" className="mb-8"><Logo /></Link>
      <form onSubmit={submit} className="card w-full max-w-md space-y-4 p-8 shadow-lg">
        <h1 className="text-2xl font-bold">{TITLES[mode]}</h1>
        {mode === "signup" && (<><input name="full_name" required placeholder="Full name" className="field" /><input name="org_name" required placeholder="Company" className="field" /></>)}
        {mode !== "reset" && <input name="email" type="email" required placeholder="Email" className="field" autoComplete="email" />}
        {mode !== "forgot" && <input name="password" type="password" required minLength={8} placeholder={mode === "reset" ? "New password (8+ characters)" : "Password"} className="field" autoComplete={mode === "login" ? "current-password" : "new-password"} />}
        {err && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{err}</p>}
        {info && <p className="rounded-lg bg-sky p-3 text-sm">{info}</p>}
        <button disabled={busy} className="btn btn-primary w-full">{busy ? "Please wait…" : mode === "login" ? "Sign in" : mode === "signup" ? "Create account" : mode === "forgot" ? "Send reset link" : "Update password"}</button>
        <div className="space-y-1 text-center text-sm text-muted">
          {mode === "login" && (<><Link className="font-bold text-brand" href="/forgot-password">Forgot password?</Link><div>New here? <Link className="font-bold text-brand" href="/signup">Create an account</Link></div></>)}
          {mode === "signup" && <div>Already have an account? <Link className="font-bold text-brand" href="/login">Sign in</Link></div>}
          {mode === "forgot" && <Link className="font-bold text-brand" href="/login">Back to sign in</Link>}
        </div>
      </form>
    </div>
  );
}
