import type { PhrasingContent, Root } from "mdast";
import { findAndReplace } from "mdast-util-find-and-replace";
import { slugOf } from "@/lib/brain/names";

type Options = { resolve: (slug: string) => string | null };

/**
 * remark plugin: [[note]], [[note|label]], [[note#heading]] → links into the Notes reader.
 * Links to notes that don't exist yet render as muted text. Code and math are left alone
 * (their contents aren't text nodes).
 */
export function remarkWikilinks({ resolve }: Options) {
  return (tree: Root) => {
    findAndReplace(tree, [
      [
        /\[\[([^[\]|#\n]+)(?:#[^[\]|\n]*)?(?:\|([^[\]\n]*))?\]\]/g,
        (_match: string, target: string, alias: string | undefined): PhrasingContent => {
          const label = (alias ?? target).trim();
          const href = resolve(slugOf(target));
          if (!href) {
            return {
              type: "emphasis",
              data: { hName: "span", hProperties: { className: ["wikilink", "wikilink-missing"], title: "No note yet" } },
              children: [{ type: "text", value: label }],
            };
          }
          return {
            type: "link",
            url: href,
            data: { hProperties: { className: ["wikilink"] } },
            children: [{ type: "text", value: label }],
          };
        },
      ],
    ]);
  };
}
