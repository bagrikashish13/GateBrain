// Pure naming helpers, safe on the client.

/** "03-deadlock" → { num: "03", slug: "deadlock" }. Folders are numbered to keep syllabus order. */
export function splitNumbered(name: string): { num: string | null; slug: string } {
  const m = /^(\d+)-(.+)$/.exec(name);
  return { num: m?.[1] ?? null, slug: m?.[2] ?? name };
}

/** "03-deadlock" → "deadlock"; "functional-dependencies-normal-forms" stays as is. Lowercase. */
export function slugOf(name: string): string {
  return splitNumbered(name.trim())
    .slug.toLowerCase()
    .replace(/\.md$/, "")
    .replace(/[\s_]+/g, "-");
}

/** "03-deadlock" → "Deadlock"; "07-file-systems-io" → "File systems io". */
export function prettyName(name: string): string {
  const s = splitNumbered(name).slug.replace(/\.md$/i, "").replace(/[-_]+/g, " ").trim();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/** The colour CSS value for a subject, grey when unknown. */
export const subjectColour = (colour: string | null | undefined) => colour ?? "var(--fg-faint)";

/** URL for a note in the reader, from its path under notes/ ("os/03-deadlock/bankers.md"). */
export const noteHref = (id: string) => "/notes/" + id.split("/").map(encodeURIComponent).join("/");

/** URL for a folder in the Notes tree (opens and scrolls to it). */
export const folderHref = (path: string) => (path ? `/notes?at=${encodeURIComponent(path)}` : "/notes");
