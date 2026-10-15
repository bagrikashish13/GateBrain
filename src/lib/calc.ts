// The exam's virtual scientific calculator (pure). A small recursive-descent parser, no eval.
//   expr    = term (("+" | "-") term)*
//   term    = unary (("*" | "/" | "mod") unary)*
//   unary   = ("-" | "+") unary | power      so -2^2 = -(2^2)
//   power   = postfix ("^" unary)?           right-associative: 2^3^2 = 2^9, 2^-1 works
//   postfix = primary "!"*
//   primary = number | constant | func "(" expr ")" | "(" expr ")"

export type Angle = "deg" | "rad";
const FUNCS = ["asin", "acos", "atan", "sinh", "cosh", "tanh", "sin", "cos", "tan", "log", "ln", "sqrt", "cbrt", "exp", "abs"] as const;
type Func = (typeof FUNCS)[number];

type Tok = { t: "num"; v: number } | { t: "op"; v: string } | { t: "fn"; v: Func } | { t: "const"; v: number };

function tokenize(src: string): Tok[] {
  const out: Tok[] = [];
  const s = src.replace(/×/g, "*").replace(/÷/g, "/").replace(/−/g, "-").replace(/π/g, "pi").replace(/√/g, "sqrt").replace(/∛/g, "cbrt");
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (/\s/.test(c)) {
      i++;
      continue;
    }
    const num = /^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?/i.exec(s.slice(i));
    if (num) {
      out.push({ t: "num", v: Number(num[0]) });
      i += num[0].length;
      continue;
    }
    const word = /^[a-z]+/i.exec(s.slice(i));
    if (word) {
      const w = word[0].toLowerCase();
      if (w === "pi") out.push({ t: "const", v: Math.PI });
      else if (w === "e") out.push({ t: "const", v: Math.E });
      else if (w === "mod") out.push({ t: "op", v: "mod" });
      else if ((FUNCS as readonly string[]).includes(w)) out.push({ t: "fn", v: w as Func });
      else throw new Error(`Unknown: ${w}`);
      i += w.length;
      continue;
    }
    if ("+-*/^()!%".includes(c)) {
      out.push({ t: "op", v: c === "%" ? "mod" : c });
      i++;
      continue;
    }
    throw new Error(`Unexpected: ${c}`);
  }
  return out;
}

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new Error("n! needs a whole number ≥ 0");
  if (n > 170) return Infinity;
  let r = 1;
  for (let k = 2; k <= n; k++) r *= k;
  return r;
}

export function evaluate(src: string, angle: Angle = "deg"): number {
  const toks = tokenize(src);
  let p = 0;
  const peek = () => toks[p];
  const isOp = (v: string) => peek()?.t === "op" && peek()!.v === v;
  const toRad = (x: number) => (angle === "deg" ? (x * Math.PI) / 180 : x);
  const fromRad = (x: number) => (angle === "deg" ? (x * 180) / Math.PI : x);

  const apply = (f: Func, x: number): number => {
    switch (f) {
      case "sin":
        return Math.sin(toRad(x));
      case "cos":
        return Math.cos(toRad(x));
      case "tan":
        return Math.tan(toRad(x));
      case "asin":
        return fromRad(Math.asin(x));
      case "acos":
        return fromRad(Math.acos(x));
      case "atan":
        return fromRad(Math.atan(x));
      case "sinh":
        return Math.sinh(x);
      case "cosh":
        return Math.cosh(x);
      case "tanh":
        return Math.tanh(x);
      case "log":
        return Math.log10(x);
      case "ln":
        return Math.log(x);
      case "sqrt":
        return Math.sqrt(x);
      case "cbrt":
        return Math.cbrt(x);
      case "exp":
        return Math.exp(x);
      case "abs":
        return Math.abs(x);
    }
  };

  const expr = (): number => {
    let v = term();
    while (isOp("+") || isOp("-")) v = (toks[p++] as { v: string }).v === "+" ? v + term() : v - term();
    return v;
  };
  const term = (): number => {
    let v = unary();
    while (isOp("*") || isOp("/") || isOp("mod")) {
      const op = (toks[p++] as { v: string }).v;
      const r = unary();
      v = op === "*" ? v * r : op === "/" ? v / r : v - r * Math.floor(v / r);
    }
    return v;
  };
  const power = (): number => {
    const b = postfix();
    if (isOp("^")) {
      p++;
      return Math.pow(b, unary());
    }
    return b;
  };
  const unary = (): number => {
    if (isOp("-")) {
      p++;
      return -unary();
    }
    if (isOp("+")) {
      p++;
      return unary();
    }
    return power();
  };
  const postfix = (): number => {
    let v = primary();
    while (isOp("!")) {
      p++;
      v = factorial(v);
    }
    return v;
  };
  const primary = (): number => {
    const tok = toks[p++];
    if (!tok) throw new Error("Incomplete");
    if (tok.t === "num" || tok.t === "const") return tok.v;
    if (tok.t === "fn") {
      if (!isOp("(")) throw new Error(`${tok.v} needs (`);
      p++;
      const v = expr();
      if (!isOp(")")) throw new Error("Missing )");
      p++;
      return apply(tok.v, v);
    }
    if (tok.v === "(") {
      const v = expr();
      if (!isOp(")")) throw new Error("Missing )");
      p++;
      return v;
    }
    throw new Error(`Unexpected ${tok.v}`);
  };

  const v = expr();
  if (p < toks.length) throw new Error("Unexpected input");
  return v;
}

/** A result as the display shows it: up to 10 significant digits, no float noise. */
export function show(x: number): string {
  if (Number.isNaN(x)) return "Math error";
  if (!Number.isFinite(x)) return x > 0 ? "Infinity" : "-Infinity";
  if (Math.abs(x) < 1e-12) return "0";
  const s = Number(x.toPrecision(10)).toString();
  return s.length > 16 ? x.toExponential(8) : s;
}
