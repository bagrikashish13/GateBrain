import { describe, expect, it } from "vitest";
import { CLOSE, findRepeats, fingerprint, SAME, similarity, words } from "./similar";

const q = (text: string, options: string[] = []) => ({ text, options: options.map((t, i) => ({ key: "ABCD"[i], text: t })) });
const SJF = q("Processes P1, P2, P3 arrive at time 0 with burst times 6, 2 and 4 ms. Using non-preemptive SJF, the average waiting time in ms is ______.");
const score = (a: ReturnType<typeof q>, b: ReturnType<typeof q>) => similarity(fingerprint(a), fingerprint(b));

describe("words", () => {
  it("keeps words and numbers, drops markup", () => {
    expect(words("Find $\\frac{a}{b}$ for **x = 2.5**.")).toEqual(["find", "a", "b", "for", "x", "2.5"]);
  });
});

describe("similarity", () => {
  it("flags a copy with cosmetic edits", () => {
    const copy = q("Processes P1, P2 and P3 arrive at time 0 with burst times 6, 2 and 4 ms. Using non-preemptive SJF, the average waiting time (in ms) is ______.");
    expect(score(SJF, copy)).toBeGreaterThanOrEqual(SAME);
  });

  it("doesn't flag a different question on the same concept", () => {
    const other = q("Four jobs with burst times 8, 3, 5 and 1 ms are scheduled with preemptive SRTF; J1 arrives at 0, J2 at 1, J3 at 2 and J4 at 3. What is the average turnaround time in ms?");
    expect(score(SJF, other)).toBeLessThan(CLOSE);
  });

  it("compares the options too", () => {
    const a = q("Which of the following is true?", ["Every BCNF relation is in 3NF", "Every 3NF relation is in BCNF", "2NF implies 3NF", "1NF implies BCNF"]);
    const b = q("Which of the following is true?", ["A deadlock needs circular wait", "Paging removes internal fragmentation", "LRU suffers from Belady's anomaly", "FIFO is a stack algorithm"]);
    expect(score(a, b)).toBeLessThan(CLOSE);
    expect(score(a, { ...a })).toBe(1);
  });
});

describe("findRepeats", () => {
  it("names the earlier question each repeat matches", () => {
    const m = findRepeats([
      { id: "mock-01", questions: [{ n: 1, ...SJF }] },
      { id: "mock-02", questions: [{ n: 1, ...q("What is a semaphore used for in operating systems and process synchronization?") }, { n: 2, ...SJF }] },
    ]);
    expect(m).toEqual([{ test: "mock-02", n: 2, other: "mock-01", otherN: 1, score: 1 }]);
  });
});
