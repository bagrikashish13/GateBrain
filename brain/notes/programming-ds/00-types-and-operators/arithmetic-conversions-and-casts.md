# Arithmetic, Conversions and Casts in C

## TL;DR
Integer division (`/`) truncates toward zero ($7/2=3$, $-7/2=-3$). Modulo (`%`) sign depends strictly on the dividend (`a % b` takes sign of `a`). Binary arithmetic associates Left-to-Right. Conversions happen per operator, not globally. Casts bind tighter than `/` (`(float)5/2 == 2.5`, `(float)(5/2) == 2.0`). For combinations ($^{n}C_3$), interleave `/ 2` then `/ 3` to prevent intermediate overflow while avoiding integer truncation.

## Core idea
- **Integer Division (`/`):**
  - Truncates toward zero: chops off the fractional portion completely.
  - $14 / 3 = 4$, $-14 / 3 = -4$.
- **Modulo Operator (`%`):**
  - Requires integer operands (compile error on float/double).
  - **Sign Rule:** `a % b` always inherits the sign of the dividend `a`:
    - $7 \mathbin{\%} -3 = \mathbf{+1}$
    - $-7 \mathbin{\%} 3 = \mathbf{-1}$
    - $-7 \mathbin{\%} -3 = \mathbf{-1}$
- **Precedence & Associativity:**
  - Precedence: `* / %` higher than `+ -`. Brackets `( )` override.
  - Associativity: Binary arithmetic operators associate **Left-to-Right ($L \rightarrow R$)**.
    - `8 / 2 * 4` $\rightarrow (8 / 2) \times 4 = \mathbf{16}$ (never $8 / 8 = 1$).
- **Implicit Conversions (Type Promotion):**
  - Happens **locally per operator**, in execution order.
  - If either operand is float/double, the other promotes to float/double for that operation.
  - Promotion does NOT propagate to independent subexpressions:
    `2 * 3 / 4 + 2.0 / 5 + 8 / 5` $\rightarrow 1 + 0.4 + 1 = \mathbf{2.4}$.
  - Integer Promotion: `char` and `short` promote to `int` before arithmetic (`sizeof(ch + 1)` is `sizeof(int)`).
- **Explicit Casts:**
  - Cast `(type)` is a unary operator and binds tighter than `* / %`.
  - `(float)5 / 2` $\rightarrow 5.0 / 2 = \mathbf{2.5}$.
  - `(float)(5 / 2)` $\rightarrow (float)(2) = \mathbf{2.0}$.
  - `(int)3.9` truncates toward zero to `3`; `(int)-3.9` truncates to `-3`.

## Where I got confused → what made it click
- **Narrowing / Demotion on assignment (`unsigned char c = 300`):**
  - *Confusion:* Why does storing 300 in an 8-bit char become 44?
  - *The click:* 300 in 16-bit binary is `00000001 00101100`. The 8-bit container literally cannot hold bits above the 8th bit, so the high bits are chopped off. Only the lower 8 bits `00101100` ($32 + 8 + 4 = 44$) are kept. It acts like an odometer rolling over every 256: $300 - 256 = 44$.
- **Why $^{n}C_3$ interleaves `/ 2` then `/ 3` (GATE 2014):**
  - *Confusion:* Why can't we divide by 3 first (`n * (n-1) / 3`)?
  - *The click:* If $n = 5$, $5 \times 4 = 20$. In C, $20 / 3$ truncates to $6$, permanently losing the $.666$ remainder! But between any 2 consecutive numbers $n, (n-1)$, one is always even $\rightarrow n(n-1)$ is always divisible by 2 with zero remainder. And across any 3 consecutive numbers, one is always a multiple of 3 $\rightarrow$ dividing by 3 after multiplying $(n-2)$ is guaranteed clean with zero remainder.

## GATE traps
- **The Modulo Divisor Sign Trap:**
  `11 % -4` is **`+3`**, NOT `-3`. The negative sign on the divisor has zero effect on the answer.
- **Associativity Left-to-Right Trap:**
  In `a / b * c`, division happens before multiplication. Writing `n / 2 * 3` means `(n / 2) * 3`, not `n / 6`.
- **The Early Division Truncation Trap:**
  Dividing before verifying mathematical divisibility loses integer precision.

## Example
**GATE CSE 2014 Set 2 · Q11:**
```c
// Best way to compute nC3 without intermediate overflow:
p = n * (n - 1) / 2 * (n - 2) / 3;
```
* `n * (n-1)` is guaranteed even $\rightarrow$ `/ 2` divides cleanly.
* `[n * (n-1) / 2] * (n-2)` restores the factor of 3 from the 3 consecutive integers $\rightarrow$ `/ 3` divides cleanly.
