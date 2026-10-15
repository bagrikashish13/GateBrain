// Rehype plugin for his notes (the notes reader, same as secondBrain). Pure, tested. Gives the reader structure the
// Markdown only implies:
// - ```mermaid blocks become <div class="mermaid-block" data-code="…"> (drawn by <MermaidDiagram>)
// - a "## TL;DR" section becomes one card: <div class="tldr cut"><div class="tldr-k">TL;DR</div>…</div>
// - a list item that opens with a bold lead ("**Bank teller:** …") gets <strong class="lead">, colon dropped
// - the list under "Where I got confused → …" gets class "click"; a "→" in a heading is wrapped (span.arrow)
// Runs before rehype-highlight, so a mermaid block is never highlighted as code.

import type { Element, ElementContent, Root, RootContent, Text } from "hast";

const TLDR = /^\s*tl\s*;?\s*dr\s*:?\s*$/i;
const CONFUSED = /confus/i;

/** Just the mermaid swap, for question text and compact views. */
export function rehypeMermaid() {
  return (tree: Root) => mermaidBlocks(tree);
}

export function rehypeNoteSections() {
  return (tree: Root) => {
    mermaidBlocks(tree);
    leads(tree);
    sections(tree);
  };
}

function isEl(n: RootContent | ElementContent | undefined, tag?: string): n is Element {
  return !!n && n.type === "element" && (!tag || n.tagName === tag);
}

const classes = (el: Element): string[] => {
  const c: unknown = el.properties?.className;
  return Array.isArray(c) ? c.map(String) : typeof c === "string" ? c.split(/\s+/) : [];
};
const addClass = (el: Element, name: string) => {
  el.properties = { ...el.properties, className: [...classes(el), name] };
};

export function textOf(n: RootContent | ElementContent | Root): string {
  if (n.type === "text") return n.value;
  if ("children" in n) return (n.children as (RootContent | ElementContent)[]).map(textOf).join("");
  return "";
}

const blank = (n: ElementContent | RootContent) => n.type === "text" && !n.value.trim();
const heading = (n: RootContent | ElementContent | undefined): number => (isEl(n) && /^h[1-6]$/.test(n.tagName) ? Number(n.tagName[1]) : 0);

/** Walk every element, parents first; `fn` may replace children of the node it's given. */
function walk(node: Root | Element, fn: (el: Element, parent: Root | Element, i: number) => void) {
  const kids = node.children as (RootContent | ElementContent)[];
  for (let i = 0; i < kids.length; i++) {
    const k = kids[i];
    if (isEl(k)) {
      fn(k, node, i);
      const now = kids[i];
      if (isEl(now)) walk(now, fn);
    }
  }
}

function mermaidBlocks(tree: Root) {
  walk(tree, (el, parent, i) => {
    if (el.tagName !== "pre") return;
    const code = el.children.find((c) => isEl(c, "code")) as Element | undefined;
    if (!code || !classes(code).includes("language-mermaid")) return;
    const block: Element = {
      type: "element",
      tagName: "div",
      properties: { className: ["mermaid-block"], dataCode: textOf(code).replace(/\n$/, "") },
      children: [],
    };
    (parent.children as (RootContent | ElementContent)[])[i] = block;
  });
}

function leads(tree: Root) {
  walk(tree, (li) => {
    if (li.tagName !== "li") return;
    // A loose list wraps the item in <p>; a task list starts with a checkbox. Look past both.
    let host: Element = li;
    let first = li.children.find((c) => !blank(c));
    if (isEl(first, "p")) {
      host = first;
      first = first.children.find((c) => !blank(c));
    }
    if (!isEl(first, "strong")) return;
    const at = host.children.indexOf(first);
    const rest = host.children.slice(at + 1);
    if (!rest.some((c) => !blank(c))) return; // a whole-bold item: no lead
    addClass(first, "lead");
    const last = first.children.at(-1);
    if (last?.type === "text") last.value = last.value.replace(/\s*[:：]\s*$/, "");
    const next = host.children[at + 1];
    if (next?.type === "text") {
      next.value = next.value.replace(/^\s*[:：]?\s*/, "");
      if (!next.value) host.children.splice(at + 1, 1);
    }
  });
}

function sections(tree: Root) {
  const kids = tree.children;
  for (let i = 0; i < kids.length; i++) {
    const h = kids[i];
    const level = heading(h);
    if (!level || !isEl(h)) continue;
    const title = textOf(h);
    if (title.includes("→")) arrow(h);

    let end = i + 1;
    while (end < kids.length && !(heading(kids[end]) && heading(kids[end]) <= level)) end++;

    if (TLDR.test(title)) {
      const body = kids.slice(i + 1, end) as ElementContent[];
      const card: Element = {
        type: "element",
        tagName: "div",
        properties: { className: ["tldr", "cut"] },
        children: [{ type: "element", tagName: "div", properties: { className: ["tldr-k"] }, children: [{ type: "text", value: "TL;DR" }] }, ...body],
      };
      kids.splice(i, end - i, card);
      continue;
    }
    if (CONFUSED.test(title)) {
      for (const n of kids.slice(i + 1, end)) if (isEl(n, "ul") || isEl(n, "ol")) addClass(n, "click");
    }
  }
}

/** "Where I got confused → what made it click": the arrow dims (span.arrow). */
function arrow(h: Element) {
  h.children = h.children.flatMap((c): ElementContent[] => {
    if (c.type !== "text" || !c.value.includes("→")) return [c];
    return c.value.split("→").flatMap((part, j) => {
      const out: ElementContent[] = [];
      if (j > 0) out.push({ type: "element", tagName: "span", properties: { className: ["arrow"] }, children: [{ type: "text", value: "→" }] });
      if (part) out.push({ type: "text", value: part } as Text);
      return out;
    });
  });
}
