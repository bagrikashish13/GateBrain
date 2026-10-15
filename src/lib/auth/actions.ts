"use server";

import { redirect } from "next/navigation";
import { clearLoginFailures, loginRetryAfter, recordLoginFailure } from "./rate-limit";
import { endSession, passcodeMatches, startSession } from "./session";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const wait = loginRetryAfter();
  if (wait > 0) {
    const minutes = Math.ceil(wait / 60_000);
    const when = minutes > 90 ? `${Math.ceil(minutes / 60)} h` : `${minutes} min`;
    return { error: `Too many wrong tries. Try again in ${when}.` };
  }

  const attempt = String(formData.get("passcode") ?? "");
  if (!passcodeMatches(attempt)) {
    recordLoginFailure();
    await new Promise((r) => setTimeout(r, 400));
    return { error: "That passcode didn't match." };
  }

  clearLoginFailures();
  await startSession();
  redirect(safeNext(formData.get("next")));
}

export async function logout(): Promise<void> {
  await endSession();
  redirect("/login");
}

// Only same-site paths, so ?next= can't bounce to another origin.
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  if (!next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return "/";
  if (next.startsWith("/login")) return "/";
  return next;
}
