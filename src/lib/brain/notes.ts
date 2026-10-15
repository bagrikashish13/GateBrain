import "server-only";

import { closeSync, openSync, readdirSync, readSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { brainPath, readBrainText, safeSegments } from "@/lib/repo/paths";
import { slugOf } from "./names";

export { noteHref } from "./names";

// brain/notes/<subject>/<NN-section>/<note>.md: his short notes, written by Claude Code /
// Antigravity. Subjects only exist once he has studied them (a folder appears). A note's id is its
// path under notes/ ("os/03-deadlock/bankers-algorithm.md"); revision state is keyed by it.

export type NoteRef = { id: string; title: string; subject: string; section: string | null };
export type NotesFolder = { name: string; path: string; notes: NoteRef[]; folders: NotesFolder[]; count: number };

const SKIP = new Set(["README.md", "readme.md", "_index.md", "AGENTS.md", "CLAUDE.md"]);

/** Title from the first 2 KB: frontmatter title, else the first # heading, else the file name. */
export function peekTitle(abs: string, file: string): string {
  let head = "";
  try {
    const fd = openSync(abs, "r");
    const buf = Buffer.alloc(2048);
    const n = readSync(fd, buf, 0, buf.length, 0);
    closeSync(fd);
    head = buf.subarray(0, n).toString("utf8").replace(/\r\n/g, "\n");
  } catch {
    return file;
  }
  return titleOf(head, file);
}

export function titleOf(text: string, file: string): string {
  try {
    const { data, content } = matter(text);
    if (typeof data.title === "string" && data.title.trim()) return data.title.trim();
    const h1 = /^#\s+(.+)$/m.exec(content);
    if (h1) return h1[1].replace(/^[^\p{L}\p{N}]+/u, "").trim();
  } catch {
    // cut-off frontmatter: fall through
  }
  const name = file.replace(/\.md$/i, "").replace(/[-_]+/g, " ");
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function walk(rel: string, name: string): NotesFolder {
  const folder: NotesFolder = { name, path: rel, notes: [], folders: [], count: 0 };
  let entries;
  try {
    entries = readdirSync(brainPath(`notes/${rel}`), { withFileTypes: true });
  } catch {
    return folder;
  }
  const [subject, section] = rel.split("/");
  for (const e of entries) {
    if (e.name.startsWith(".")) continue;
    const r = `${rel}/${e.name}`;
    if (e.isDirectory()) folder.folders.push(walk(r, e.name));
    else if (e.isFile() && e.name.toLowerCase().endsWith(".md") && !SKIP.has(e.name) && r.split("/").length > 1) {
      folder.notes.push({
        id: r,
        title: peekTitle(join(/*turbopackIgnore: true*/ brainPath(`notes/${rel}`), e.name), e.name),
        subject,
        section: r.split("/").length > 2 ? section : null,
      });
    }
  }
  folder.folders.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  folder.notes.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
  folder.count = folder.notes.length + folder.folders.reduce((s, f) => s + f.count, 0);
  return folder;
}

/** One folder per subject he has notes for (or has started: an empty subject folder counts). */
export function notesTree(): NotesFolder[] {
  let entries;
  try {
    entries = readdirSync(brainPath("notes"), { withFileTypes: true });
  } catch {
    return [];
  }
  return entries
    .filter((e) => e.isDirectory() && !e.name.startsWith("."))
    .map((e) => walk(e.name, e.name))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function allNotes(tree = notesTree()): NoteRef[] {
  const out: NoteRef[] = [];
  const add = (f: NotesFolder) => {
    out.push(...f.notes);
    f.folders.forEach(add);
  };
  tree.forEach(add);
  return out;
}

/** The section folder (with its number) for a subject + topic slug: ("os", "deadlock") → "03-deadlock". */
export function sectionFolder(subject: string, topic: string, tree = notesTree()): string | null {
  const s = tree.find((f) => f.name === subject);
  return s?.folders.find((f) => slugOf(f.name) === topic)?.name ?? null;
}

export type NoteFile = { id: string; content: string };

/** A note by its path segments under notes/. Call after requireSession(). */
export function readNote(segments: string[]): NoteFile | null {
  if (!safeSegments(segments) || !segments.at(-1)!.toLowerCase().endsWith(".md")) return null;
  const id = segments.join("/");
  const content = readBrainText(`notes/${id}`);
  return content === null ? null : { id, content };
}

