"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";

/** Back to wherever he came from (Today, Sky, Notes…), or to `fallback` on a fresh tab. */
export function BackLink({ fallback = "/", label = "Back" }: { fallback?: string; label?: string }) {
  const router = useRouter();
  return (
    <a
      href={fallback}
      onClick={(e) => {
        if (window.history.length > 1) {
          e.preventDefault();
          router.back();
        }
      }}
      className="-ml-1.5 flex min-h-11 w-fit items-center gap-1 text-[13px] font-medium text-muted-foreground transition-colors hover:text-fg"
    >
      <ChevronLeft className="size-[18px] stroke-[1.75]" aria-hidden />
      {label}
    </a>
  );
}
