import { describe, expect, it } from "vitest";
import { buildWeights, CLOSE, findPyqRepeats, findRepeats, fingerprint, preparePyqs, SAME, shapeTokens, similarity, skeleton, words } from "./similar";

const q = (text: string, options: string[] = []) => ({ text, options: options.map((t, i) => ({ key: "ABCD"[i], text: t })) });
const SJF = q("Processes P1, P2, P3 arrive at time 0 with burst times 6, 2 and 4 ms. Using non-preemptive SJF, the average waiting time in ms is ______.");
const score = (a: ReturnType<typeof q>, b: ReturnType<typeof q>) => similarity(fingerprint(a), fingerprint(b));

// The real case that slipped through: a retest question that was the first test's question with new names.
const SWAP = (f: string, g: string, [a, b, c]: string[], [x, y, z]: string[]) =>
  q(
    `Consider the following C program:
\`\`\`c
#include <stdio.h>
void ${f}(char *s1, char *s2) {
    char *tmp = s1;
    s1 = s2;
    s2 = tmp;
}
void ${g}(char **s1, char **s2) {
    char *tmp = *s1;
    *s1 = *s2;
    *s2 = tmp;
}
int main(void) {
    char *${x} = "${a}";
    char *${y} = "${b}";
    char *${z} = "${c}";
    ${f}(${x}, ${y});
    ${g}(&${x}, &${z});
    printf("%s %s %s\\n", ${x}, ${y}, ${z});
    return 0;
}
\`\`\`
What is printed by the program?`,
    [`${a} ${b} ${c}`, `${c} ${b} ${a}`, `${b} ${a} ${c}`, `${a} ${c} ${b}`],
  );
const program = (body: string) => q(`Consider the following C program:\n\`\`\`c\n#include <stdio.h>\nint main() {\n${body}\n    return 0;\n}\n\`\`\`\nWhat is the output displayed by the program?`);

describe("words", () => {
  it("keeps words and numbers, drops markup", () => {
    expect(words("Find $\\frac{a}{b}$ for **x = 2.5**.")).toEqual(["find", "a", "b", "for", "x", "2.5"]);
  });
});

describe("skeleton", () => {
  it("blanks names, numbers and strings, keeps keywords and operators", () => {
    expect(skeleton(`char *s = "Gold"; x += 42;`)).toEqual(["char", "*", "v", "=", "s", ";", "v", "+=", "0", ";"]);
  });
  it("treats inline code as code and blanks numbers in prose", () => {
    expect(shapeTokens("Let `p = a + 3` and n be 12.")).toEqual(["let", "v", "=", "v", "+", "0", "and", "n", "be", "#"]);
  });
});

describe("similarity", () => {
  it("flags a copy with cosmetic edits", () => {
    const copy = q("Processes P1, P2 and P3 arrive at time 0 with burst times 6, 2 and 4 ms. Using non-preemptive SJF, the average waiting time (in ms) is ______.");
    expect(score(SJF, copy)).toBeGreaterThanOrEqual(SAME);
  });

  it("flags a copy with different numbers", () => {
    const copy = q("Processes P1, P2, P3 arrive at time 0 with burst times 9, 3 and 5 ms. Using non-preemptive SJF, the average waiting time in ms is ______.");
    expect(score(SJF, copy)).toBeGreaterThanOrEqual(SAME);
  });

  it("flags a program with renamed functions, variables and strings", () => {
    const first = SWAP("step1", "step2", ["Red", "Green", "Blue"], ["w1", "w2", "w3"]);
    const renamed = SWAP("funcA", "funcB", ["Gold", "Silver", "Bronze"], ["s1", "s2", "s3"]);
    expect(score(first, renamed)).toBeGreaterThanOrEqual(SAME);
  });

  it("doesn't flag a different question on the same concept", () => {
    const other = q("Four jobs with burst times 8, 3, 5 and 1 ms are scheduled with preemptive SRTF; J1 arrives at 0, J2 at 1, J3 at 2 and J4 at 3. What is the average turnaround time in ms?");
    expect(score(SJF, other)).toBeLessThan(CLOSE);
  });

  it("doesn't flag two different programs that only share boilerplate, once boilerplate is weighed down", () => {
    const a = program(`    int a = 024;\n    int count = printf("%x", a);\n    printf("%d", count);`);
    const b = program(`    int a = 3, b = 2, c = 1;\n    int res = a > b ? b > c ? a + b : b - c : a < c ? a * c : b * c;\n    printf("%d", res);`);
    const others = [1, 2, 3, 4, 5, 6].map((k) => fingerprint(program(`    int x${k} = ${k};\n    while (x${k} < ${k * 10}) x${k} *= 2;\n    printf("%d", x${k});`)));
    const w = buildWeights([fingerprint(a), fingerprint(b), ...others]);
    expect(similarity(fingerprint(a), fingerprint(b), w)).toBeLessThan(CLOSE);
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

describe("findPyqRepeats", () => {
  const pyqs = preparePyqs([
    { id: "2017s1-53", title: "GATE CSE 2017 Set 1 | Question: 53", text: SWAP("p", "r", ["abc", "de", "f"], ["x", "y", "z"]).text },
    { id: "IT2007-42", title: "GATE IT 2007 | Question: 42", text: "A.   B.\nC.   D." }, // an image-only PYQ: nothing to compare
  ]);
  const w = buildWeights(pyqs.map((p) => p.fp));

  it("catches a re-skinned PYQ and ignores PYQs with no usable text", () => {
    const mine = SWAP("first", "second", ["Gold", "Silver", "Bronze"], ["a", "b", "c"]);
    const m = findPyqRepeats([{ n: 3, ...mine }, { n: 4, ...SJF }], pyqs, w);
    expect(m).toHaveLength(1);
    expect(m[0]).toMatchObject({ n: 3, pyq: "2017s1-53" });
    expect(m[0].score).toBeGreaterThanOrEqual(SAME);
  });
});
