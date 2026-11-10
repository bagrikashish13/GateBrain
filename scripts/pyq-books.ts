// GATE Overflow's public PYQ books: fetched once per device into .runtime/pyq-cache/ (git-ignored) and
// turned into text with pdftotext. The repo is public, so it only stores ids and links, never the text.
// Used by `npm run syllabus -- pyq` and by `npm run check:tests` (re-skinned PYQs count as repeats).
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { mergeBooks, parseBook, type BookEntry } from "../src/lib/syllabus/books";

const RELEASES = "https://github.com/GATEOverflow/GO-PDFs/releases/download";
// 2022 editions keep the math as text (questions up to 2021); 2027 editions have everything up to 2026.
export const BOOKS = {
  old: `${RELEASES}/gatecse-2022-vol1%2C2/Volume-2.pdf`, // Algorithms, CD, DS, C, TOC
  new: `${RELEASES}/gatecse-2027/filter1_volume2.pdf`,
  old1: `${RELEASES}/gatecse-2022-vol1%2C2/Volume-1.pdf`, // Discrete and engineering maths, aptitude
  new1: `${RELEASES}/gatecse-2027/filter1_volume1.pdf`,
  old3: `${RELEASES}/gatecse-2022-vol1%2C2/Volume-3.pdf`, // COA, CN, DBMS, Digital Logic, OS
  new3: `${RELEASES}/gatecse-2027/filter1_volume3.pdf`,
} as const;
export type BookName = keyof typeof BOOKS;
const PDFTOTEXT = ["pdftotext", "C:\\Program Files\\Git\\mingw64\\bin\\pdftotext.exe", "/mingw64/bin/pdftotext", "/usr/bin/pdftotext"];

/** One book's text, downloading it the first time. null when this device can't get it. */
export async function bookText(repo: string, which: BookName, quiet = false): Promise<string | null> {
  const dir = join(repo, ".runtime", "pyq-cache");
  const txt = join(dir, `${which}.txt`);
  if (existsSync(txt) && statSync(txt).size > 0) return readFileSync(txt, "utf8");
  mkdirSync(dir, { recursive: true });
  const pdf = join(dir, `${which}.pdf`);
  if (!existsSync(pdf) || statSync(pdf).size === 0) {
    if (!quiet) console.error(`Downloading GATE Overflow's book (once per device): ${BOOKS[which]}`);
    try {
      const res = await fetch(BOOKS[which]);
      if (!res.ok) return null;
      writeFileSync(pdf, Buffer.from(await res.arrayBuffer()));
    } catch {
      return null;
    }
  }
  for (const tool of PDFTOTEXT) {
    try {
      execFileSync(tool, ["-layout", pdf, txt], { stdio: "ignore" });
      return readFileSync(txt, "utf8");
    } catch {
      // try the next location
    }
  }
  return null;
}

/** Every PYQ text this device can get, one per id. `missing` lists the books it couldn't. */
export async function allPyqTexts(repo: string, which: BookName[] = ["new", "new1", "new3"]): Promise<{ texts: Map<string, BookEntry>; missing: BookName[] }> {
  const books: BookEntry[][] = [];
  const missing: BookName[] = [];
  for (const name of which) {
    const text = await bookText(repo, name, true);
    if (text) books.push(parseBook(text));
    else missing.push(name);
  }
  return { texts: mergeBooks(books), missing };
}
