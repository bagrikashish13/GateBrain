import { PHASE_PRODUCTION_BUILD } from "next/constants";

// Runs once when a server process starts: keep the repo in sync with GitHub in the background
// (pull what other devices pushed, push anything still pending). Every 3 minutes on the server;
// in dev only on demand (the Sync button), so files don't change under him while he edits.
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return;
  if (process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD) return;
  const { startBackgroundSync } = await import("./lib/repo/git");
  const fallback = process.env.NODE_ENV === "production" ? 3 : 0;
  startBackgroundSync(Number(process.env.SYNC_MINUTES ?? fallback));
}
