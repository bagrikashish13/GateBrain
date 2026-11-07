# Operators and Precedence in C

## TL;DR
`=` is an expression yielding the stored value ($R \rightarrow L$). Compound assignment brackets the entire right side (`x *= 2 + 3` $\implies x \times 5$). Postfix `x++` yields old then increments; prefix `++x` increments then yields new. Logical `&&` and `||` short-circuit (skipped right-side side effects never run). `sizeof` is evaluated at compile-time—operands inside it are never executed (`sizeof(x++)` leaves `x` unchanged). Only 3 categories associate $R \rightarrow L$: Unary, Ternary, Assignment; all others associate $L \rightarrow R$.

## Core idea
- **Assignment as an Expression:**
  - `(x = 5)` assigns 5 to `x` and evaluates to `5`.
  - Associativity is Right-to-Left: `a = b = 5` $\implies a = (b = 5)$.
  - Compound assignment brackets the right side: `a /= 2 + 4` $\implies a = a / (2 + 4)$.
- **Increment and Decrement:**
  - `x++` (postfix): evaluates to old value, then increments `x`.
  - `++x` (prefix): increments `x` first, then evaluates to new value.
  - Modifying the same variable twice in one expression is undefined behavior (never tested in GATE).
- **Relational and Equality:**
  - Evaluates to `1` (true) or `0` (false).
  - Associativity is Left-to-Right: `3 < 2 < 1` $\implies (3 < 2) < 1 \implies 0 < 1 \implies \mathbf{1}$.
  - Signed vs Unsigned: signed promotes to unsigned (`-1 > 1u` is true!).
- **Logical Operators & Short-Circuit:**
  - `0` is false, any non-zero is true. Result is strictly `0` or `1`.
  - `0 && expr`: `expr` is skipped.
  - `non_zero || expr`: `expr` is skipped.
  - Side effects in skipped expressions never execute.
- **Bitwise Operators:**
  - `&` (AND), `|` (OR), `^` (XOR), `~` (NOT).
  - Formula: $\mathbin{\sim}x = -(x + 1)$.
  - `x << k = x \times 2^k`.
  - `x >> k = \lfloor x / 2^k \rfloor` (bits falling off the right edge are discarded, causing truncation toward floor).
  - Bitwise idioms: `v & 1` tests LSB (parity), `x & (x - 1)` clears lowest set bit (power of 2 check).
- **Ternary & Comma:**
  - `cond ? expr1 : expr2`: only one branch executes; nested ternaries associate $R \rightarrow L$.
  - Comma `,`: evaluates $L \rightarrow R$, returns rightmost value; lowest precedence of ALL operators (`x = (1, 2)` gives 2; `x = 1, 2` gives 1).
- **Compile-Time `sizeof`:**
  - Evaluates type sizes at compile time. Any expression inside `sizeof(...)` is completely ignored at runtime.

## Where I got confused → what made it click
- **Unary `+ / -` vs Binary `+ / -`:**
  - *Confusion:* Why do `+` and `-` appear twice on the precedence ladder?
  - *The click:* Unary `+ / -` operates on a single value (sign/negation) and binds tightly at Level 1 (`-5 * 2 = -10`). Binary `+ / -` sits between two values (addition/subtraction) and waits at Level 3 until multiplication finishes.
- **Why right shift floors (`x >> k`):**
  - *Confusion:* Why is right shift defined with a floor $\lfloor x / 2^k \rfloor$?
  - *The click:* Shifting right moves binary bits off the rightmost edge of the register. Those bits physically fall off into oblivion—they cannot be rounded up. Losing positive fractional bits is mathematically the floor function.
- **Associativity memory shortcut:**
  - *The click:* Do not memorize 15 separate associativities. Only **THREE** categories associate Right-to-Left ($R \rightarrow L$): Unary, Ternary (`?:`), and Assignment (`=`). Every other operator in C associates Left-to-Right ($L \rightarrow R$).

## GATE traps
- **Bitwise AND vs Equality Trap:**
  `==` binds tighter than `&`. `a & b == c` evaluates as `a & (b == c)`.
- **Shift vs Addition Trap:**
  `+` binds tighter than `<<`. `a << 1 + 2` evaluates as `a << (1 + 2) == a << 3`.
- **Assignment vs Equality Trap:**
  `==` binds tighter than `=`. `x = y == z` evaluates as `x = (y == z)`.
- **`sizeof` Side Effect Trap:**
  `sizeof(x++)` leaves `x` completely unchanged.

## Example
**GATE CSE 2017 Set 2 · Q54:**
```c
int m = 10, n, n1;
n = ++m;   // m=11, n=11
n1 = m++;  // n1=11, m=12
n--;       // n=10
--n1;      // n1=10
n -= n1;   // n = 10 - 10 = 0
printf("%d", n); // prints 0
```
