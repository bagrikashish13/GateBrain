import { describe, expect, it } from "vitest";
import { maxGap, preview, recallOf, review } from "./schedule";

const at = new Date("2026-10-15T10:00:00+05:30");
const days = (a: Date, b: string) => Math.round((new Date(b).getTime() - a.getTime()) / 86_400_000);

describe("revision schedule", () => {
  it("brings a note back later the better it went", () => {
    const p = preview(null, at);
    expect(p.forgot.getTime()).toBeLessThanOrEqual(p.fuzzy.getTime());
    expect(p.fuzzy.getTime()).toBeLessThanOrEqual(p.gotit.getTime());
    expect(p.gotit.getTime()).toBeLessThanOrEqual(p.easy.getTime());
    expect(p.forgot.getTime()).toBeGreaterThan(at.getTime());
  });

  it("keeps a log and grows the gap on success", () => {
    const one = review(null, "os/03-deadlock/x.md", "gotit", at);
    const later = new Date(one.card.due);
    const two = review(one, "os/03-deadlock/x.md", "gotit", later);
    expect(two.log.map((l) => l.rating)).toEqual(["gotit", "gotit"]);
    expect(days(later, two.card.due)).toBeGreaterThan(days(at, one.card.due));
    expect(recallOf(two, later)).toBeGreaterThan(0.8);
    expect(recallOf(null, at)).toBeNull();
  });

  it("never schedules past the cap or the exam", () => {
    let s = review(null, "n.md", "easy", at);
    let t = at;
    for (let i = 0; i < 8; i++) {
      t = new Date(s.card.due);
      s = review(s, "n.md", "easy", t, maxGap(10));
    }
    expect(days(t, s.card.due)).toBeLessThanOrEqual(10);
    expect(maxGap(null)).toBe(45);
    expect(maxGap(0)).toBe(1);
  });
});
