"use client";

import { useEffect, useState, useTransition } from "react";
import { RefreshCw } from "lucide-react";
import { cn } from "cn";
import { syncAction } from "./actions";

/** Pull what other devices pushed (notes, tests, tasks), push anything pending, then re-read. */
export function SyncButton() {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  useEffect(() => {
    if (!result) return;
    const t = setTimeout(() => setResult(null), 2600);
    return () => clearTimeout(t);
  }, [result]);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => start(async () => setResult(await syncAction().catch(() => ({ ok: false, message: "Couldn't reach the app." }))))}
        disabled={pending}
        aria-label="Sync with GitHub"
        title="Sync with GitHub"
        className="grid size-11 place-items-center text-faint transition-colors hover:text-fg disabled:text-fg"
      >
        <RefreshCw className={cn("size-[19px] stroke-[1.6]", pending && "animate-spin")} aria-hidden />
      </button>
      <span
        role="status"
        className={cn(
          "pointer-events-none absolute top-full right-0 z-10 text-[11.5px] whitespace-nowrap transition-opacity",
          result || pending ? "opacity-100" : "opacity-0",
          result && !result.ok ? "text-alert" : "text-faint",
        )}
      >
        {pending ? "Syncing…" : result?.message}
      </span>
    </div>
  );
}
