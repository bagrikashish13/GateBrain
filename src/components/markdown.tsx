import Link from "next/link";
import Markdown, { defaultUrlTransform } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import rehypeKatex from "rehype-katex";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { cn } from "cn";
import { MermaidDiagram } from "@/components/mermaid-diagram";
import { noteHref } from "@/lib/brain/names";
import { rehypeMermaid, rehypeNoteSections } from "@/lib/markdown/note-sections";
import { remarkWikilinks } from "@/lib/markdown/wikilinks";

type Props = {
  source: string;
  /** Brain path of the file it comes from ("notes/os/03-deadlock/x.md", "tests/mock-1.md"), for relative links and images. */
  base: string;
  /** "note": a note's own page (sections, TL;DR card). "exam": GATE's light look. "plain": compact dark. */
  variant?: "note" | "exam" | "plain";
  /** The subject colour (note pages: section markers). */
  colour?: string | null;
  /** slug → note id, for [[links]]. */
  slugs?: Map<string, string>;
  className?: string;
};

/** "notes/os/x.md" + "../img/a.png" → "notes/img/a.png"; null if it climbs out of brain/. */
export function resolveRelative(base: string, url: string): string | null {
  const parts = base.split("/").slice(0, -1);
  for (const seg of url.split(/[?#]/)[0].split("/")) {
    if (!seg || seg === ".") continue;
    if (seg === "..") {
      if (!parts.length) return null;
      parts.pop();
    } else parts.push(decodeURIComponent(seg));
  }
  return parts.join("/") || null;
}

/** His Markdown (notes, questions, solutions), rendered for phone reading. Styles in globals.css. */
export function MarkdownView({ source, base, variant = "plain", colour = null, slugs, className }: Props) {
  const resolve = (slug: string) => {
    const id = slugs?.get(slug);
    return id ? noteHref(id) : null;
  };
  const exam = variant === "exam";
  return (
    <div
      className={cn(exam ? "prose-exam" : "prose-note", variant === "note" && "note-page", className)}
      style={variant === "note" ? ({ "--note-area": colour ?? "var(--fg-faint)" } as React.CSSProperties) : undefined}
    >
      <Markdown
        remarkPlugins={[remarkGfm, remarkMath, [remarkWikilinks, { resolve }]]}
        rehypePlugins={[variant === "note" ? rehypeNoteSections : rehypeMermaid, rehypeKatex, [rehypeHighlight, { detect: false }]]}
        urlTransform={(url, key) => {
          const safe = defaultUrlTransform(url);
          if (!safe || /^[a-z][a-z0-9+.-]*:/i.test(safe) || safe.startsWith("/") || safe.startsWith("#")) return safe;
          const rel = resolveRelative(base, safe);
          if (!rel) return "";
          if (key === "src" || !rel.endsWith(".md")) return "/files/" + rel.split("/").map(encodeURIComponent).join("/");
          return rel.startsWith("notes/") ? noteHref(rel.slice("notes/".length)) : "";
        }}
        components={{
          a: ({ href = "", children, className, title }) =>
            href.startsWith("/") && !href.startsWith("/files/") ? (
              <Link href={href} className={className} title={title}>
                {children}
              </Link>
            ) : (
              <a href={href} className={className} title={title} target="_blank" rel="noreferrer">
                {children}
              </a>
            ),
          table: ({ children }) => (
            <div className="table-wrap">
              <table>{children}</table>
            </div>
          ),
          div: ({ node, className, children }) => {
            const code = node?.properties?.dataCode;
            if (className === "mermaid-block" && typeof code === "string") return <MermaidDiagram code={code} />;
            return <div className={className}>{children}</div>;
          },
        }}
      >
        {source}
      </Markdown>
    </div>
  );
}
