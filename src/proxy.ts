import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, createSessionToken, getSessionSecret, sessionCookieOptions, shouldRefresh, verifySessionToken } from "@/lib/auth/token";

// Every route needs the session cookie except /login, the health check, static files and the PWA
// files (the browser fetches the manifest and worker without cookies).
const PUBLIC = new Set(["/offline", "/sw.js", "/manifest.webmanifest"]);

export async function proxy(request: NextRequest) {
  const host = request.headers.get("host");
  // Cloudflare tags each request with the visitor's scheme. Never take the passcode over plain http.
  // The URL is built from the Host header: in standalone, request.url carries the bind address (0.0.0.0).
  if (host && request.headers.get("cf-visitor")?.includes('"scheme":"http"')) {
    const { pathname, search } = request.nextUrl;
    return NextResponse.redirect(`https://${host}${pathname}${search}`, 308);
  }

  const secret = getSessionSecret();
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySessionToken(token, secret) : null;
  const { pathname, search } = request.nextUrl;

  if (PUBLIC.has(pathname)) return NextResponse.next();

  if (pathname === "/login") {
    return session ? NextResponse.redirect(new URL("/", request.url)) : NextResponse.next();
  }

  if (!session) {
    if (pathname.startsWith("/api/") || pathname.startsWith("/files/")) {
      return Response.json({ error: "unauthorized" }, { status: 401 });
    }
    const login = new URL("/login", request.url);
    if (pathname !== "/") login.searchParams.set("next", pathname + search);
    return NextResponse.redirect(login);
  }

  const response = NextResponse.next();
  if (shouldRefresh(session)) {
    response.cookies.set(SESSION_COOKIE, await createSessionToken(secret), sessionCookieOptions());
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api/health$|.*\.(?:ico|png|svg|webp|jpg|webmanifest|txt|xml)$).*)"],
};
