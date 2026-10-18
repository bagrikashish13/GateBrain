"use client";

import { useEffect, useState, useTransition } from "react";
import { Check, LoaderCircle } from "lucide-react";
import { cn } from "cn";
import { saveThemeAction } from "./actions";

type Theme = "mint" | "pink";

const THEMES: { id: Theme; name: string; accent: string; dim: string }[] = [
  { id: "mint", name: "Dark + Mint", accent: "#00fd92", dim: "#00593a" },
  { id: "pink", name: "Dark + Pink", accent: "#ff4fa3", dim: "#540d33" },
];

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("gatebrain-theme", theme);
  } catch {}
}

export function ThemePicker({ current }: { current: Theme }) {
  const [theme, setTheme] = useState<Theme>(current);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const select = (next: Theme) => {
    if (next === theme) return;
    setTheme(next);
    startTransition(async () => {
      await saveThemeAction(next);
    });
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      {THEMES.map((t) => {
        const on = theme === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => select(t.id)}
            className={cn(
              "group relative flex flex-col gap-3 p-3.5 text-left transition-colors",
              on ? "cut border-line-2 bg-raised" : "border border-line bg-panel hover:border-line-2 hover:bg-raised",
            )}
            style={on ? ({ "--cut-edge": t.accent, "--cut-fill": "var(--raised)" } as React.CSSProperties) : undefined}
          >
            <div className="flex items-center justify-between">
              {/* Swatch */}
              <div className="flex items-center gap-1.5">
                <span className="size-4 border border-line-2 bg-void" style={{ borderColor: t.accent }} />
                <span className="size-2" style={{ backgroundColor: t.accent }} />
                <span className="size-2" style={{ backgroundColor: t.dim }} />
              </div>
              {on && (
                <span className="grid size-4 place-items-center text-fg">
                  {pending ? (
                    <LoaderCircle className="size-3 animate-spin stroke-[2.5]" aria-hidden />
                  ) : (
                    <Check className="size-3.5 stroke-[2.5]" style={{ color: t.accent }} aria-hidden />
                  )}
                </span>
              )}
            </div>
            <div className="grid gap-0.5">
              <span className="font-display text-[14px] font-semibold tracking-[-0.01em] text-fg">{t.name}</span>
              <span className="font-mono text-[11px] text-faint">{t.accent}</span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
