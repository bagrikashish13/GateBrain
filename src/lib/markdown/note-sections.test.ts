import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { describe, expect, it } from "vitest";
import { rehypeNoteSections } from "./note-sections";

// Through react-markdown, as the reader renders notes.
const html = (md: string) => renderToStaticMarkup(createElement(Markdown, { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeNoteSections] }, md));

describe("rehypeNoteSections", () => {
  it("turns the TL;DR section into one card, up to the next heading", () => {
    const out = html("## TL;DR\nThe OS is a **Referee**.\n\nSecond line.\n\n## Intuition\n- x");
    expect(out).toContain('<div class="tldr cut"><div class="tldr-k">TL;DR</div>');
    expect(out).toMatch(/Second line\.<\/p>\s*<\/div>\s*<h2>Intuition<\/h2>/);
    expect(out).not.toContain("<h2>TL;DR</h2>");
  });

  it("makes a bold opener a lead and drops its colon", () => {
    const out = html("- **Bank teller:** Ring 3 code slides a request.\n- plain item\n- **whole bold**");
    expect(out).toContain('<strong class="lead">Bank teller</strong>Ring 3 code slides a request.');
    expect(out).toContain("<li>plain item</li>");
    expect(out).toContain("<li><strong>whole bold</strong></li>");
  });

  it("finds leads in loose lists too", () => {
    const out = html("- **A:** one\n\n- **B:** two");
    expect(out).toContain('<p><strong class="lead">A</strong>one</p>');
  });

  it("swaps a mermaid block for a diagram placeholder, keeping the code", () => {
    const out = html("```mermaid\nflowchart TD\n  a --> b\n```\n\n```js\nx()\n```");
    expect(out).toContain('<div class="mermaid-block" data-code="flowchart TD\n  a --&gt; b"></div>');
    expect(out).toContain('<code class="language-js">');
  });

  it("marks the confused list and dims the arrow in the heading", () => {
    const out = html("## Where I got confused → what made it click\n- **Index vs pointer:** apps pass an index\n\n## Next\n- y");
    expect(out).toContain('<h2>Where I got confused <span class="arrow">→</span> what made it click</h2>');
    expect(out).toContain('<ul class="click">');
    expect(out).toMatch(/<h2>Next<\/h2>\s*<ul>/);
  });
});
