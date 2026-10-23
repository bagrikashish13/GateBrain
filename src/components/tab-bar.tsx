"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, ClipboardCheck, Library, Route, Settings, Sun, type LucideIcon } from "lucide-react";
import { cn } from "cn";
import { Logo, Wordmark } from "@/components/logo";

// Today is the app's main screen: on a phone it sits in the middle, raised and white (action colour);
// on a laptop it leads the side rail. The tab you are on is marked in mint, the app's accent. No glow.
const TABS: { href: string; label: string; icon: LucideIcon; main?: boolean }[] = [
  { href: "/notes", label: "Notes", icon: Library },
  { href: "/revise", label: "Revise", icon: Brain },
  { href: "/", label: "Today", icon: Sun, main: true },
  { href: "/tests", label: "Tests", icon: ClipboardCheck },
  { href: "/roadmap", label: "Roadmap", icon: Route },
];
const RAIL = [TABS[2], TABS[0], TABS[1], TABS[3], TABS[4], { href: "/settings", label: "Settings", icon: Settings }];

export function TabBar() {
  return <TabBarView pathname={usePathname()} />;
}

const isOn = (href: string, pathname: string | null) => (href === "/" ? pathname === "/" : !!pathname?.startsWith(href));

/** Also the static-shell fallback (pathname null = no active tab) while the URL streams in. */
export function TabBarView({ pathname }: { pathname: string | null }) {
  return (
    <>
      <nav aria-label="Tabs" className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-void pb-[env(safe-area-inset-bottom)] lg:hidden">
        <div className="mx-auto grid h-16 max-w-[430px]" style={{ gridTemplateColumns: `repeat(${TABS.length}, 1fr)` }}>
          {TABS.map(({ href, label, icon: Icon, main }) => {
            const on = isOn(href, pathname);
            if (main) {
              return (
                <Link key={href} href={href} aria-current={on ? "page" : undefined} className="relative flex justify-center">
                  <span className="absolute -top-5">
                    <span className="cut-solid relative grid h-[62px] w-[66px] place-content-center justify-items-center gap-0.5 bg-act text-act-ink [--cut:12px]">
                      <span aria-hidden className={cn("absolute inset-x-0 bottom-0 h-[3px] bg-mint transition-opacity duration-300", on ? "opacity-100" : "opacity-0")} />
                      <Icon className="size-[22px] stroke-[2]" aria-hidden />
                      <span className="text-[11.5px] font-semibold">{label}</span>
                    </span>
                  </span>
                </Link>
              );
            }
            return (
              <Link
                key={href}
                href={href}
                aria-current={on ? "page" : undefined}
                className={cn("relative grid content-center justify-items-center gap-1 text-[11px] font-medium transition-colors", on ? "text-act" : "text-faint hover:text-muted-foreground")}
              >
                <span aria-hidden className={cn("absolute top-0 h-[2px] bg-mint transition-[width] duration-300", on ? "w-6" : "w-0")} />
                <Icon className={cn("size-5 stroke-[1.6] transition-colors", on && "text-mint")} aria-hidden />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Laptop: a rail down the left instead of the bottom bar. Settings sits at its foot. */}
      <nav aria-label="Tabs" className="fixed inset-y-0 left-0 z-20 hidden w-56 flex-col border-r border-line bg-void px-3 py-5 lg:flex">
        <Link href="/" className="mb-7 flex items-center gap-2.5 px-3">
          <Logo size={28} />
          <Wordmark className="text-[17px]" />
        </Link>
        {RAIL.map(({ href, label, icon: Icon }, i) => {
          const on = isOn(href, pathname);
          return (
            <Link
              key={href}
              href={href}
              aria-current={on ? "page" : undefined}
              className={cn(
                "relative flex h-11 items-center gap-3 px-3 text-[14px] font-medium transition-colors",
                on ? "bg-raised text-act" : "text-faint hover:bg-raised/60 hover:text-muted-foreground",
                i === RAIL.length - 1 && "mt-auto",
              )}
            >
              <span aria-hidden className={cn("absolute inset-y-0 left-0 w-[2px] bg-mint transition-opacity duration-300", on ? "opacity-100" : "opacity-0")} />
              <Icon className={cn("size-[18px] stroke-[1.6] transition-colors", on && "text-mint")} aria-hidden />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}
