// GATE Overflow's public PYQ books, as text (pdftotext -layout), split into questions (pure: no fs).
// The repo is public, so it never stores this text: scripts fetch the books once per device into
// .runtime/pyq-cache/ (scripts/pyq-books.ts) and use these functions on the fly.

export type PyqRef = { id: string; paper: "CS" | "IT" | "DA"; year: number; set: number | null; q: string; title: string };
export type BookEntry = PyqRef & { section: string; topic: string; text: string; tags: string[]; line: number };

const TITLE = /GATE\s+(CSE?|IT|DA|DS&AI)\s+(\d{4})\s*(?:\|?\s*Set\s*(\d+))?\s*\|\s*Question:\s*([^,\s|]+)/;

/** "GATE CSE 2016 | Set 1 | Question: 25" → { id: "2016s1-25", … }, the ids brain/syllabus/ uses. */
export function pyqRef(title: string): PyqRef | null {
  const m = TITLE.exec(title);
  if (!m) return null;
  const paper = m[1].startsWith("CS") ? "CS" : m[1] === "IT" ? "IT" : "DA";
  const year = Number(m[2]);
  const set = m[3] ? Number(m[3]) : null;
  const q = m[4];
  const s = set ? `s${set}` : "";
  const id = paper === "CS" ? `${year}${s}-${q.replace(/-/g, ".")}` : `${paper}${year}${s}-${q}`;
  const name = paper === "CS" ? "GATE CSE" : paper === "IT" ? "GATE IT" : "GATE DS&AI";
  return { id, paper, year, set, q, title: `${name} ${year}${set ? ` Set ${set}` : ""} | Question: ${q}` };
}

const HEADING = /^\s*(\d+\.\d+\.\d+)\s+(.+?):\s+(GATE\s.+?)\s*(?:\btop\b.*)?$/;
const TAGS = /^\s*(?:gate|gatecse|gateit|gateda)[a-z0-9-]*(?:\s+[a-z0-9][a-z0-9.+#-]*)+\s*(?:https?:\/\/\S+)?\s*$/;
const STOP = /^\s*(?:Answer key\b|Answer\s*$|Answer\s+\S*$|Answer Keys\b)/;
const NOISE = (t: string) =>
  !t ||
  t.includes("Copyright GATE Overflow") ||
  /^\d+\s+.*\(\d+\)\s*\d*$/.test(t) || // running page header: "4 Programming and DS: Programming (108)   497"
  /^.*\(\d+\)\s+\d+$/.test(t) ||
  /^Practice Tests?:/.test(t);

/**
 * Every question in a book's text, in book order. Only the first occurrence of each heading counts: the
 * 2022 books repeat the headings in their answer sections.
 */
export function parseBook(raw: string): BookEntry[] {
  const lines = raw.split(/\r?\n/);
  const out: BookEntry[] = [];
  const seen = new Set<string>();
  for (let i = 0; i < lines.length; i++) {
    const h = HEADING.exec(lines[i]);
    if (!h) continue;
    const ref = pyqRef(h[3]);
    if (!ref) continue;
    const key = `${h[1]} ${ref.id}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const body: string[] = [];
    let tags: string[] = [];
    let j = i + 1;
    for (; j < lines.length; j++) {
      const t = lines[j].trim();
      if (HEADING.test(lines[j]) || STOP.test(lines[j])) break;
      if (TAGS.test(lines[j])) {
        tags = t.replace(/https?:\/\/\S+/g, "").trim().split(/\s+/);
        break;
      }
      if (!NOISE(t)) body.push(lines[j].trimEnd());
    }
    out.push({ ...ref, section: h[1], topic: h[2].trim(), text: dedent(body).trim(), tags, line: i });
    i = j - 1;
  }
  return out;
}

function dedent(lines: string[]): string {
  const pad = Math.min(...lines.filter((l) => l.trim()).map((l) => l.length - l.trimStart().length), 80);
  return lines.map((l) => l.slice(Number.isFinite(pad) ? pad : 0)).join("\n");
}

/** One text per PYQ across several books: the longest wins (the 2022 books keep the math as text). */
export function mergeBooks(books: BookEntry[][]): Map<string, BookEntry> {
  const out = new Map<string, BookEntry>();
  for (const book of books) {
    for (const e of book) {
      const had = out.get(e.id);
      if (!had || solid(e.text) > solid(had.text)) out.set(e.id, { ...e, tags: e.tags.length ? e.tags : (had?.tags ?? []) });
    }
  }
  return out;
}

const solid = (s: string) => s.replace(/\s+/g, "").length;
