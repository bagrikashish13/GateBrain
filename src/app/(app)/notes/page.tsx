import type { Metadata } from "next";
import { Suspense } from "react";
import { requireSession } from "@/lib/auth/session";
import { notesTree, type NotesFolder } from "@/lib/brain/notes";
import { subjectMap, subjectOf } from "@/lib/brain/subjects";
import { readState } from "@/lib/revision/store";
import { recallOf } from "@/lib/revision/schedule";
import { SyncButton } from "../sync-button";
import { NotesTree, type TreeFolder } from "./notes-tree";

export const metadata: Metadata = { title: "Notes · GateBrain" };

export default function NotesPage() {
  return (
    <main className="mx-auto grid w-full max-w-[430px] grid-cols-1 content-start gap-5 px-4 pt-5 pb-8">
      <Suspense
        fallback={
          <>
            <h1 className="display">Notes</h1>
            <p className="text-[13px] text-faint">Reading your notes…</p>
          </>
        }
      >
        <Notes />
      </Suspense>
    </main>
  );
}

async function Notes() {
  await requireSession();
  const now = new Date();
  const map = subjectMap();
  const toTree = (f: NotesFolder, colour: string): TreeFolder => ({
    name: f.name,
    path: f.path,
    count: f.count,
    colour,
    folders: f.folders.map((c) => toTree(c, colour)),
    notes: f.notes.map((n) => ({ id: n.id, title: n.title, recall: recallOf(readState(n.id), now) })),
  });
  const tree = notesTree().map((f) => {
    const s = subjectOf(f.name, map);
    return { ...toTree(f, s.colour), label: s.name };
  });
  const total = tree.reduce((s, f) => s + f.count, 0);

  return (
    <>
      <header className="flex items-start justify-between gap-3">
        <div className="grid gap-1.5">
          <h1 className="display">Notes</h1>
          <p className="text-[13px] text-muted-foreground">
            <span className="num font-semibold text-fg">{total}</span> {total === 1 ? "note" : "notes"} in{" "}
            <span className="num font-semibold text-fg">{tree.length}</span> {tree.length === 1 ? "subject" : "subjects"}
          </p>
        </div>
        <div className="-mt-1 -mr-2 flex items-center">
          <SyncButton />
        </div>
      </header>
      {tree.length ? (
        <Suspense fallback={null}>
          <NotesTree tree={tree} />
        </Suspense>
      ) : (
        <p className="text-[13px] text-faint">No subjects yet.</p>
      )}
    </>
  );
}
