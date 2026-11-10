import { describe, expect, it } from "vitest";
import { parseTest, type Test } from "./format";
import { mixFor, qualityErrors } from "./quality";

function test(levels: string[], opts: { level?: string; subject?: string; pyq?: string } = {}): Test {
  const qs = levels.map(
    (d, i) => `## Q${i + 1}
type: NAT
marks: 1
subject: ${opts.subject ?? "programming-ds"}
answer: ${i}
${d ? `difficulty: ${d}\n` : ""}${d === "hard" && opts.pyq !== "" ? `pyq: ${opts.pyq ?? "2017s1-53"}\n` : ""}
Question ${i + 1} about something different each time, number ${i}.
`,
  );
  const r = parseTest("t", `---\ntitle: T\nduration: 30\n${opts.level ? `level: ${opts.level}\n` : ""}---\n\n${qs.join("\n")}`);
  if (!r.ok) throw new Error(r.errors.join(", "));
  return r.test;
}
const known = new Set(["2017s1-53"]);
const indexed = new Set(["programming-ds", "algorithms"]);
const ten = (hard: number, easy: number) => [...Array(hard).fill("hard"), ...Array(easy).fill("easy"), ...Array(10 - hard - easy).fill("medium")];

describe("mixFor", () => {
  it("asks for GATE's mix: about 20% hard, at most 40% easy", () => {
    expect(mixFor(10, "gate")).toEqual({ hardMin: 2, easyMax: 4 });
    expect(mixFor(5, "gate")).toEqual({ hardMin: 1, easyMax: 2 });
    expect(mixFor(65, "gate")).toEqual({ hardMin: 13, easyMax: 26 });
  });
  it("asks for more hard questions in a tougher paper", () => {
    expect(mixFor(10, "tougher")).toEqual({ hardMin: 4, easyMax: 2 });
  });
});

describe("qualityErrors", () => {
  it("passes a GATE-level test", () => {
    expect(qualityErrors(test(ten(2, 3)), known, indexed)).toEqual([]);
  });
  it("needs a difficulty on every question", () => {
    expect(qualityErrors(test(["", ...ten(2, 3).slice(1)]), known, indexed)[0]).toMatch(/^Q1: add "difficulty/);
  });
  it("fails a test without enough hard questions, or with too many easy ones", () => {
    expect(qualityErrors(test(ten(1, 3)), known, indexed).join(" ")).toMatch(/1 hard question; .* at least 2/);
    expect(qualityErrors(test(ten(2, 6)), known, indexed).join(" ")).toMatch(/6 easy questions; .* at most 4/);
    expect(qualityErrors(test(ten(2, 3), { level: "tougher" }), known, indexed).join(" ")).toMatch(/tougher test of 10 needs at least 4/);
  });
  it("needs a real PYQ behind every hard question", () => {
    expect(qualityErrors(test(ten(2, 3), { pyq: "" }), known, indexed).join(" ")).toMatch(/names the real PYQ/);
    expect(qualityErrors(test(ten(2, 3), { pyq: "2099-1" }), known, indexed).join(" ")).toMatch(/isn't in brain\/syllabus\/pyq-index/);
    expect(qualityErrors(test(ten(2, 3), { subject: "os", pyq: "GATE 2019 Q23" }), known, indexed)).toEqual([]);
    expect(qualityErrors(test(ten(2, 3), { subject: "os", pyq: "the deadlock one" }), known, indexed).join(" ")).toMatch(/with its year/);
  });
});
