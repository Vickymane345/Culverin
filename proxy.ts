import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Refreshes the Supabase session cookie on every page request and keeps
// signed-out visitors out of the dashboard and admin area.
export async function proxy(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isPrivate = path.startsWith("/dashboard") || path.startsWith("/admin");

  if (isPrivate && !user) {
    const signin = request.nextUrl.clone();
    signin.pathname = "/signin";
    signin.search = `?next=${encodeURIComponent(path)}`;
    return NextResponse.redirect(signin);
  }

  return response;
}

export const config = {
  matcher: [
    // Skip static assets, images and the OPay webhook (no session there).
    "/((?!_next/static|_next/image|favicon.ico|api/opay|api/cron|images/|videos/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|ico|txt|xml)$).*)",
  ],
};
