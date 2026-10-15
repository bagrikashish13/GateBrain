import { readFileSync } from "node:fs";
import { extname } from "node:path";
import { getSession } from "@/lib/auth/session";
import { brainPath, readBrainText, safeSegments } from "@/lib/repo/paths";

// Images (and PDFs) that notes, questions and solutions embed, served from brain/. Signed-in only;
// never the app's state folder.
const TYPES: Record<string, string> = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

export async function GET(_req: Request, ctx: RouteContext<"/files/[...path]">) {
  if (!(await getSession())) return new Response("unauthorized", { status: 401 });
  const { path } = await ctx.params;
  const type = TYPES[extname(path.at(-1) ?? "").toLowerCase()];
  if (!type || !safeSegments(path) || path[0] === "_state") return new Response("not found", { status: 404 });
  // readBrainText does the containment check (symlinks included); then read the bytes.
  if (readBrainText(path.join("/")) === null) return new Response("not found", { status: 404 });
  const body = readFileSync(brainPath(path.join("/")));
  return new Response(body, {
    headers: { "Content-Type": type, "Cache-Control": "private, max-age=300", "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'", "X-Content-Type-Options": "nosniff" },
  });
}
