import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { describe, expect, it } from "vitest";

// Antigravity's documented limits (antigravity.google/docs/rules): a file over 24,000 bytes is cut off, a rule
// without valid frontmatter is silently dropped, and always-on rules share 20,000 tokens. Breaking any of
// these makes agents forget instructions with no error anywhere, so the tests fail instead.

const RULES = ".agents/rules";
const TRIGGERS = ["always_on", "model_decision", "glob", "manual"];
const ruleFiles = readdirSync(RULES).filter((f) => f.endsWith(".md"));

describe("what Antigravity can read", () => {
  it("AGENTS.md fits under the per-file limit", () => {
    expect(statSync("AGENTS.md").size).toBeLessThan(24_000);
  });

  it.each(ruleFiles)("%s has frontmatter with a valid trigger", (file) => {
    const { data } = matter(readFileSync(join(RULES, file), "utf8"));
    expect(TRIGGERS).toContain(data.trigger);
    expect(statSync(join(RULES, file)).size).toBeLessThan(24_000);
  });

  it("always-on rules fit the shared budget", () => {
    const alwaysOn = ruleFiles.filter((f) => matter(readFileSync(join(RULES, f), "utf8")).data.trigger === "always_on");
    const bytes = statSync("AGENTS.md").size + alwaysOn.reduce((s, f) => s + statSync(join(RULES, f)).size, 0);
    expect(bytes / 4).toBeLessThan(20_000); // about 4 bytes per token
  });

  it("every agent is pointed at the syllabus", () => {
    expect(readFileSync("AGENTS.md", "utf8")).toContain("npm run syllabus");
    const rule = matter(readFileSync(join(RULES, "dsa-syllabus.md"), "utf8"));
    expect(rule.data.trigger).toBe("always_on");
    expect(rule.content).toContain("npm run syllabus");
  });
});
