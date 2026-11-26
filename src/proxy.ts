import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refreshes the Supabase session and protects /app/* routes.
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const path = request.nextUrl.pathname;
  const protectedPath = path.startsWith("/app");

  if (!url || !anon) {
    // Supabase not configured: block the app, leave the public site working.
    if (protectedPath) return NextResponse.redirect(new URL("/login?error=not_configured", request.url));
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });
  const supabase = createServerClient(url, anon, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (list) => {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { data } = await supabase.auth.getUser();

  if (protectedPath && !data.user) {
    const to = new URL("/login", request.url);
    to.searchParams.set("next", path);
    return NextResponse.redirect(to);
  }
  if (data.user && (path === "/login" || path === "/signup")) return NextResponse.redirect(new URL("/app", request.url));
  return response;
}

export const config = { matcher: ["/app/:path*", "/login", "/signup"] };
