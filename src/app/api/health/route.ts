import { existsSync } from "node:fs";
import { connection } from "next/server";
import { brainPath } from "@/lib/repo/paths";

// Unauthenticated (excluded in proxy.ts). Used by the Docker healthcheck.
export async function GET() {
  await connection();
  const ok = existsSync(brainPath("subjects.json"));
  return Response.json({ ok }, { status: ok ? 200 : 503 });
}
