import { describe, expect, it } from "vitest";
import { planNew } from "./plan";

const notes = (n: number, from: string) => Array.from({ length: n }, (_, i) => ({ id: `n${i + 1}`, from }));

describe("new notes plan", () => {
  it("brings a new note up the day after it was added", () => {
    expect(planNew(notes(1, "2026-10-23"), "2026-10-22", 6, 6).get("n1")).toBe("2026-10-23");
  });

  it("spreads a big batch over the next days, in order", () => {
    const p = planNew(notes(11, "2026-10-23"), "2026-10-22", 6, 6);
    expect([...p.values()].filter((d) => d === "2026-10-23")).toHaveLength(6);
    expect(p.get("n6")).toBe("2026-10-23");
    expect(p.get("n7")).toBe("2026-10-24");
    expect(p.get("n11")).toBe("2026-10-24");
  });

  it("uses what's left of today's allowance, then a full one each day", () => {
    const p = planNew(notes(4, "2026-10-20"), "2026-10-22", 3, 1);
    expect(p.get("n1")).toBe("2026-10-22");
    expect(p.get("n2")).toBe("2026-10-23");
    expect(p.get("n4")).toBe("2026-10-23");
  });

  it("never brings a note up before its own first day", () => {
    const p = planNew([{ id: "late", from: "2026-10-30" }, { id: "soon", from: "2026-10-23" }], "2026-10-22", 6, 6);
    expect(p.get("soon")).toBe("2026-10-23");
    expect(p.get("late")).toBe("2026-10-30");
  });
});
