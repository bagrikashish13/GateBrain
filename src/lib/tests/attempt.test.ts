import { describe, expect, it } from "vitest";
import { cleanResponse, cleanStates } from "./attempt";
import { parseTest } from "./format";
import { SAMPLE } from "./fixture";

const test = (() => {
  const r = parseTest("sample", SAMPLE);
  if (!r.ok) throw new Error();
  return r.test;
})();
const [mcq, msq, nat] = test.questions;

describe("cleanResponse", () => {
  it("keeps only answers that fit the question", () => {
    expect(cleanResponse(mcq, "B")).toBe("B");
    expect(cleanResponse(mcq, "E")).toBeNull();
    expect(cleanResponse(msq, "C, A")).toBe("A,C");
    expect(cleanResponse(nat, "4.5")).toBe("4.5");
    expect(cleanResponse(nat, "-.5")).toBe("-.5");
    expect(cleanResponse(nat, "4.5.1")).toBeNull();
    expect(cleanResponse(nat, "-")).toBeNull();
    expect(cleanResponse(mcq, 3)).toBeNull();
  });
});

describe("cleanStates", () => {
  it("needs one state per question and clamps the rest", () => {
    expect(cleanStates(test, [])).toBeNull();
    const s = cleanStates(test, [{ response: "B", visited: true, timeMs: -5, visits: 2 }, {}, { response: "x" }, { marked: "yes" }]);
    expect(s).toEqual([
      { response: "B", visited: true, marked: false, timeMs: 0, visits: 2 },
      { response: null, visited: false, marked: false, timeMs: 0, visits: 0 },
      { response: null, visited: false, marked: false, timeMs: 0, visits: 0 },
      { response: null, visited: false, marked: false, timeMs: 0, visits: 0 },
    ]);
  });
});
