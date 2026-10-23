"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronRight, FileText, Search, X } from "lucide-react";
import { cn } from "cn";
import { SubjectMarker } from "@/components/subject-marker";
import { noteHref, prettyName, splitNumbered } from "@/lib/brain/names";

export type TreeNote = { id: string; title: string; recall: number | null };
export type TreeFolder = { name: string; path: string; count: number; colour: string; label?: string; folders: TreeFolder[]; notes: TreeNote[] };

const STORE = "gatebrain.notes.open";
const ancestors = (rel: string) => rel.split("/").map((_, i, a) => a.slice(0, i + 1).join("/"));

function readSaved(): string | null {
  try {
    return localStorage.getItem(STORE);
  } catch {
    return null; // private mode: just use the defaults
  }
}
const noSubscribe = () => () => {};

/** Subjects → sections → notes. Tap a folder to open it, a note to read it. */
export function NotesTree({ tree }: { tree: TreeFolder[] }) {
  const at = useSearchParams().get("at");
  const saved = useSyncExternalStore(noSubscribe, readSaved, () => null);
  const [touched, setTouched] = useState<Set<string> | null>(null);
  const [query, setQuery] = useState("");
  const still = useReducedMotion();

  const open = useMemo(() => {
    if (touched) return touched;
    // Default: every subject and section that has notes is open.
    const withNotes = (fs: TreeFolder[]): string[] => fs.filter((f) => f.count > 0).flatMap((f) => [f.path, ...withNotes(f.folders)]);
    let base: string[] = withNotes(tree);
    try {
      if (saved) base = JSON.parse(saved) as string[];
    } catch {
      // bad JSON: defaults
    }
    return new Set([...base, ...(at ? ancestors(at) : [])]);
  }, [touched, saved, tree, at]);

  useEffect(() => {
    if (at) document.getElementById(`f:${at}`)?.scrollIntoView({ block: "center" });
  }, [at]);

  const toggle = (path: string) => {
    const next = new Set(open);
    if (next.has(path)) next.delete(path);
    else next.add(path);
    setTouched(next);
    try {
      localStorage.setItem(STORE, JSON.stringify([...next]));
    } catch {
      // not saved, fine
    }
  };

  const q = query.trim().toLowerCase();
  const results = useMemo(() => (q ? flatten(tree).filter((n) => `${n.title} ${n.id}`.toLowerCase().includes(q)) : []), [tree, q]);

  return (
    <div className="grid gap-4">
      <label className="relative block lg:max-w-[420px]">
        <span className="sr-only">Search notes</span>
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 stroke-[1.75] text-faint" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes"
          className="h-11 w-full border border-line-2 bg-raised pr-10 pl-9 text-base outline-none placeholder:text-faint focus-visible:border-act md:text-sm [&::-webkit-search-cancel-button]:hidden"
        />
        {query && (
          <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="absolute top-1/2 right-1 grid size-9 -translate-y-1/2 place-items-center text-faint hover:text-fg">
            <X className="size-4 stroke-[1.75]" aria-hidden />
          </button>
        )}
      </label>

      {q ? (
        results.length ? (
          <ul className="grid border-t border-line lg:grid-cols-2 lg:gap-x-8">
            {results.slice(0, 60).map((n) => (
              <li key={n.id} className="border-b border-line">
                <Link href={noteHref(n.id)} className="grid gap-0.5 py-2.5 transition-colors hover:bg-raised/60">
                  <span className="flex min-w-0 items-center gap-2.5">
                    <span className="grid size-4 flex-none place-items-center">
                      <SubjectMarker colour={n.colour} />
                    </span>
                    <span className="min-w-0 flex-1 truncate text-[14px]">{n.title}</span>
                    <Recall value={n.recall} />
                  </span>
                  <span className="truncate pl-[26px] text-[11.5px] text-faint">{n.id.split("/").slice(0, -1).map(prettyName).join(" / ")}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[13px] text-faint">Nothing matches &ldquo;{query}&rdquo;.</p>
        )
      ) : (
        <div className="border-t border-line lg:columns-2 lg:gap-x-8 lg:border-t-0" role="tree" aria-label="Subjects">
          {tree.map((s) => (
            <div key={s.path} className="lg:mb-6 lg:break-inside-avoid lg:border-t lg:border-line">
              <Folder folder={s} open={open} toggle={toggle} at={at} animate={touched !== null && !still} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function flatten(folders: TreeFolder[]): (TreeNote & { colour: string })[] {
  return folders.flatMap((f) => [...f.notes.map((n) => ({ ...n, colour: f.colour })), ...flatten(f.folders)]);
}

function Folder({ folder, open, toggle, at, animate }: { folder: TreeFolder; open: Set<string>; toggle: (p: string) => void; at: string | null; animate: boolean }) {
  const isOpen = open.has(folder.path);
  const top = !folder.path.includes("/");
  const { num } = splitNumbered(folder.name);
  return (
    <div role="treeitem" aria-expanded={isOpen} aria-selected={false}>
      <button
        type="button"
        id={`f:${folder.path}`}
        onClick={() => toggle(folder.path)}
        className={cn("flex min-h-12 w-full items-center gap-2.5 border-b border-line text-left transition-colors hover:bg-raised/60", at === folder.path && "bg-raised")}
      >
        <ChevronRight className={cn("size-4 flex-none stroke-[1.75] text-faint transition-transform duration-200", isOpen && "rotate-90 text-fg")} aria-hidden />
        <span className="flex min-w-0 flex-1 items-baseline gap-2">
          {!top && num && <span className="num text-[12px] text-faint">{num}</span>}
          <span className={cn("truncate font-medium", top ? "text-[15px]" : "text-[14px]", folder.count === 0 && "text-muted-foreground")}>
            {folder.label ?? prettyName(folder.name)}
          </span>
        </span>
        {top && <SubjectMarker colour={folder.colour} />}
        <span className="num min-w-6 text-right text-[13px] text-faint">{folder.count}</span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="kids"
            role="group"
            initial={animate ? { height: 0, opacity: 0 } : false}
            animate={{ height: "auto", opacity: 1 }}
            exit={animate ? { height: 0, opacity: 0 } : undefined}
            transition={{ duration: 0.22, ease: [0.2, 0.7, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="ml-[7px] border-l border-line-2 pl-3">
              {folder.folders.map((f) => (
                <Folder key={f.path} folder={f} open={open} toggle={toggle} at={at} animate={animate} />
              ))}
              {folder.notes.map((n) => (
                <Link key={n.id} href={noteHref(n.id)} role="treeitem" aria-selected={false} className="flex min-h-12 items-center gap-2.5 border-b border-line transition-colors hover:bg-raised/60">
                  <FileText className="size-4 flex-none stroke-[1.6] text-faint" aria-hidden />
                  <span className="min-w-0 flex-1 truncate text-[14px]">{n.title}</span>
                  <Recall value={n.recall} />
                </Link>
              ))}
              {!folder.folders.length && !folder.notes.length && <p className="border-b border-line py-2.5 text-[12.5px] text-faint">Empty</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Recall({ value }: { value: number | null }) {
  return <span className={cn("num w-11 flex-none text-right text-[14px] font-semibold", value !== null && value < 0.75 && "text-alert")}>{value === null ? "—" : `${Math.round(value * 100)}%`}</span>;
}
