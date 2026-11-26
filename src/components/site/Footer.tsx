import Link from "next/link";
import { Logo } from "./Logo";

const a = "text-[15px] text-white/80 hover:text-white";
const h = "mb-3 text-[15px] font-bold text-white";

export function Footer() {
  return (
    <footer className="bg-navy text-white">
      <div className="container-x py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-1">
            <Logo light />
            <p className="mt-4 max-w-xs text-[15px] text-white/70">The AI planning engine for inventory and replenishment.</p>
          </div>
          <div>
            <div className={h}>Product</div>
            <ul className="space-y-2">
              <li><Link href="/platform" className={a}>Platform</Link></li>
              <li><Link href="/solutions" className={a}>Solutions</Link></li>
              <li><Link href="/industries" className={a}>Industries</Link></li>
              <li><Link href="/pricing" className={a}>Pricing</Link></li>
            </ul>
          </div>
          <div>
            <div className={h}>Account</div>
            <ul className="space-y-2">
              <li><Link href="/signup" className={a}>Sign up</Link></li>
              <li><Link href="/login" className={a}>Sign in</Link></li>
            </ul>
          </div>
          <div>
            <div className={h}>Legal</div>
            <ul className="space-y-2">
              <li><Link href="/legal/privacy-policy" className={a}>Privacy Policy</Link></li>
              <li><Link href="/legal/terms-of-use" className={a}>Terms of Use</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-white/20 pt-6 text-[13px] text-white/70">© {new Date().getFullYear()} RestockIQ. All rights reserved.</div>
      </div>
    </footer>
  );
}
