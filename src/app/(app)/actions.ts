"use server";

import { refresh } from "next/cache";
import { requireSession } from "@/lib/auth/session";
import { syncNow } from "@/lib/repo/git";

/** The Sync button: pull from GitHub, push what's pending, re-render with what came in. */
export async function syncAction(): Promise<{ ok: boolean; message: string }> {
  await requireSession();
  const r = await syncNow().catch((err: Error) => ({ ok: false, message: err.message.slice(0, 80) }));
  refresh();
  return r;
}
