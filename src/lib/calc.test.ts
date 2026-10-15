import { describe, expect, it } from "vitest";
import { evaluate, show } from "./calc";

describe("calculator", () => {
  it("follows precedence and associativity", () => {
    expect(evaluate("2+3*4")).toBe(14);
    expect(evaluate("(2+3)*4")).toBe(20);
    expect(evaluate("2^3^2")).toBe(512);
    expect(evaluate("-2^2")).toBe(-4);
    expect(evaluate("10 mod 3")).toBe(1);
    expect(evaluate("7÷2×4−1")).toBe(13);
  });

  it("does functions, constants and factorial", () => {
    expect(evaluate("sin(30)")).toBeCloseTo(0.5);
    expect(evaluate("sin(pi/6)", "rad")).toBeCloseTo(0.5);
    expect(evaluate("asin(1)")).toBeCloseTo(90);
    expect(evaluate("log(1000)")).toBeCloseTo(3);
    expect(evaluate("ln(e)")).toBeCloseTo(1);
    expect(evaluate("√(16)+∛(27)")).toBe(7);
    expect(evaluate("5!")).toBe(120);
    expect(evaluate("exp(0)")).toBe(1);
    expect(evaluate("2e3")).toBe(2000);
  });

  it("rejects nonsense", () => {
    expect(() => evaluate("2+")).toThrow();
    expect(() => evaluate("foo(2)")).toThrow();
    expect(() => evaluate("(1")).toThrow();
  });

  it("shows clean results", () => {
    expect(show(0.1 + 0.2)).toBe("0.3");
    expect(show(1 / 0)).toBe("Infinity");
    expect(show(Math.sqrt(-1))).toBe("Math error");
  });
});
