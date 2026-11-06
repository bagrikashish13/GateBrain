import type { Catalog, Item, Pyq, Sequence } from "./syllabus";

// Topological order for the syllabus (pure: no fs). brain/syllabus/concepts.json names every idea a
// student has to be taught before it can appear, and how to spot it in text or code. Each concept is
// taught by exactly one item ("Teaches: cast"). The rule, checked by `npm run check:syllabus`: no item's
// text, and none of the PYQs it cites, may use a concept that is taught later. Written tests are held to
// the same rule, so a question can never use something the student hasn't met.

export type Concept = { id: string; name: string; code: string[]; words: string[] };
export type Compiled = { id: string; name: string; patterns: RegExp[] };

export function compileConcepts(list: Concept[]): Compiled[] {
  return list.map((c) => ({ id: c.id, name: c.name, patterns: [...c.code.map((p) => new RegExp(p)), ...c.words.map((p) => new RegExp(p, "i"))] }));
}

/** The concepts a piece of text or code uses. */
export function conceptsIn(text: string, compiled: Compiled[]): string[] {
  return compiled.filter((c) => c.patterns.some((p) => p.test(text))).map((c) => c.id);
}

export type Order = {
  items: Item[]; // every item in teaching order
  position: Map<string, number>; // item id → its place in that order
  teacher: Map<string, Item>; // concept id → the item that teaches it
};

export function teachingOrder(catalog: Catalog, sequence: Sequence): Order {
  const items = sequence.steps.flatMap((s) => ("unit" in s ? (catalog.units.get(s.unit)?.items ?? []) : []));
  const teacher = new Map<string, Item>();
  for (const item of items) for (const c of item.teaches) if (!teacher.has(c)) teacher.set(c, item);
  return { items, position: new Map(items.map((i, n) => [i.id, n])), teacher };
}

/** Everything an item leans on: what its text mentions and what its PYQs really need. */
export function usesOf(item: Item, pyqs: Map<string, Pyq>, compiled: Compiled[]): string[] {
  const out = new Set(conceptsIn(item.text, compiled));
  for (const id of item.pyqs) for (const c of pyqs.get(id)?.uses ?? []) out.add(c);
  return [...out];
}

/** Every place the syllabus uses an idea before teaching it. Empty = the order is topological. */
export function orderErrors(catalog: Catalog, pyqs: Map<string, Pyq>, sequence: Sequence, concepts: Concept[]): string[] {
  const out: string[] = [];
  const known = new Map(concepts.map((c) => [c.id, c]));
  const order = teachingOrder(catalog, sequence);
  const compiled = compileConcepts(concepts);

  const taughtBy = new Map<string, string[]>();
  for (const item of order.items) {
    for (const c of item.teaches) {
      if (!known.has(c)) out.push(`${item.id}: "Teaches: ${c}" is not in concepts.json.`);
      taughtBy.set(c, [...(taughtBy.get(c) ?? []), item.id]);
    }
  }
  for (const [c, ids] of taughtBy) if (ids.length > 1) out.push(`Concept ${c} is taught twice: ${ids.join(", ")}.`);
  for (const c of concepts) if (!taughtBy.has(c.id)) out.push(`Concept ${c.id} is never taught: add "Teaches: ${c.id}" to the item that introduces it.`);

  const nameOf = (c: string) => known.get(c)?.name ?? c;
  const position = order.position;
  const later = (c: string, item: Item) => {
    const t = order.teacher.get(c);
    return t && position.get(t.id)! > position.get(item.id)! ? t : null;
  };
  for (const item of order.items) {
    for (const c of conceptsIn(item.text, compiled)) {
      const t = later(c, item);
      if (t) out.push(`${item.id} mentions ${nameOf(c)}, which is taught later, at ${t.id}.`);
    }
    for (const id of item.pyqs) {
      for (const c of pyqs.get(id)?.uses ?? []) {
        if (!known.has(c)) out.push(`PYQ ${id}: unknown concept "${c}" in its uses.`);
        const t = later(c, item);
        if (t) out.push(`${item.id} cites PYQ ${id}, which needs ${nameOf(c)}, taught later, at ${t.id}.`);
      }
    }
  }
  return out;
}

/** How much the order check actually looked at, for the summary line. */
export function orderCoverage(catalog: Catalog, pyqs: Map<string, Pyq>, sequence: Sequence, concepts: Concept[]): { concepts: number; links: number } {
  const compiled = compileConcepts(concepts);
  const { items } = teachingOrder(catalog, sequence);
  const links = items.reduce((n, item) => n + conceptsIn(item.text, compiled).length + item.pyqs.reduce((m, id) => m + (pyqs.get(id)?.uses?.length ?? 0), 0), 0);
  return { concepts: concepts.length, links };
}
