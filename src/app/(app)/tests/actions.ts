"use server";

import { refresh } from "next/cache";
import { redirect } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { discardAttempt, getTest, startAttempt } from "@/lib/tests/store";

/** Start (or resume) a test: the clock starts now, on this device. */
export async function startTestAction(form: FormData): Promise<void> {
  await requireSession();
  const test = getTest(String(form.get("id") ?? ""));
  if (!test) return;
  startAttempt(test);
  redirect(`/exam/${test.id}`);
}

/** Throw away a test in progress (nothing was saved to GitHub). */
export async function discardTestAction(form: FormData): Promise<void> {
  await requireSession();
  discardAttempt(String(form.get("id") ?? ""));
  refresh();
}
