# Cyclicity, Remainders & Exponent Comparisons

## TL;DR
Last digit repeats in cycles of 1, 2, or 4 (rem 0 means 4th power). For remainders, target $\pm 1$ ($(-1)^{\text{odd}} \equiv M-1$). To compare large powers, match exponents via HCF; for roots/surds, raise to the LCM of the root indices.

## Core idea
- **Cyclicity of unit digits ($a^b$):**
  - **Cycle 1:** $0, 1, 5, 6$ never change.
  - **Cycle 2:** $4^{\text{odd}} = 4, 4^{\text{even}} = 6$; $9^{\text{odd}} = 9, 9^{\text{even}} = 1$.
  - **Cycle 4:** $2, 3, 7, 8$. Divide power by 4:
    - Remainder 1, 2, 3 $\implies a^1, a^2, a^3$.
    - Remainder 0 $\implies a^4$ (full cycle completed).
- **Remainder arithmetic & the $\pm 1$ bridge:**
  - When dividing $A^b$ by $M$, find a small power of $A$ congruent to $+1$ or $-1 \pmod M$.
  - If base $\equiv -1 \pmod M$: $(-1)^{\text{even}} = +1$, $(-1)^{\text{odd}} = -1 \equiv M - 1$.
  - Remainder rule: When dividing by $M$, the remainder must strictly satisfy $0 \le r < M$.
- **HCF difference trick (Aptitude shortcut):**
  - HCF of a set of numbers is equal to, or a factor of, the difference between the two closest numbers.
- **Comparing powers ($A^x$ vs $B^y$):**
  - Find $\text{HCF}(x, y) = k$. Rewrite as $(A^{x/k})^k$ vs $(B^{y/k})^k$. Compare the inside bases.
- **Comparing surds ($\sqrt[n]{A}$ vs $\sqrt[m]{B}$):**
  - Write as $A^{1/n}$ vs $B^{1/m}$. Find $\text{LCM}(n, m) = L$. Raise both to power $L$: $(A^{1/n})^L = A^{L/n}$ vs $(B^{1/m})^L = B^{L/m}$. Compare values.
- **Rationalizing surd denominators (Telescoping sums):**
  - For fractions $\frac{1}{\sqrt{k+1} + \sqrt{k}}$, multiply numerator and denominator by the conjugate $(\sqrt{k+1} - \sqrt{k})$.
  - Denominator becomes $(k+1) - k = 1$, reducing the fraction to $\sqrt{k+1} - \sqrt{k}$.
  - In a continuous sum from $1$ to $N$, all intermediate terms cancel: only $-\sqrt{1} + \sqrt{N+1}$ remains.

## Where I got confused → what made it click
- **Telescoping series with roots:** Never take LCM across radical fractions. Rationalize each term with its conjugate $(\sqrt{a} - \sqrt{b})$; adjacent terms cancel in pairs leaving just the very first and very last root.
- **Remainder 0 in cyclicity:** Remainder 0 doesn't mean power 0 (which gives 1); it means the 4th position of the cycle.
- **Negative remainders are intermediate tools:** When $(-1)^{\text{odd}} = -1$, add the divisor to get the positive remainder (e.g. $-1 + 4 = 3$; $-1 + 7 = 6$).
- **Borrowing in subtraction:** When subtracting unit digits $(2 - 7)$, borrow 1 from the tens place: $12 - 7 = 5$.
- **HCF by difference:** Don't do long ladder divisions on powers; take the difference of the closest two numbers and check if it divides them.
- **Leftover exponents (uneven division):** When the exponent doesn't divide evenly by the target power (e.g. $3^{62}$ with $3^3 \equiv -1$), write $62 = 3 \times 20 + 2$. Split into $(3^3)^{20} \times 3^2 = 1 \times 9 \equiv 2 \pmod 7$.
- **Base reduction chaining:** If $3^2 \equiv 2 \pmod 7$, then $3^{60} = (3^2)^{30} \equiv 2^{30} \pmod 7$. Chain directly back into $2^3 \equiv 1 \implies (2^3)^{10} \equiv 1$.

## GATE traps
- **Remainder cannot equal or exceed divisor:** If dividing by 3, answers like 3 or 4 are impossible by definition ($0 \le r < 3$).
- **Surds vs. Whole powers:** Whole powers use HCF to pull exponents down; fractional powers (surds) use LCM to scale powers up to integers.
- **The calculator sinkhole trap:** Giant powers ($2^{60}, 3^{60}$) will overflow or round on the on-screen calculator. If a question has giant exponents, it is strictly testing a modular pattern, never a raw calculation.

## Example
> **Question (GATE):** What is the remainder when $2^{100}$ is divided by $3$?  
> (A) 0 &nbsp;&nbsp; (B) 1 &nbsp;&nbsp; (C) 2 &nbsp;&nbsp; (D) 3  
> **Solution:** (B). $2 \equiv -1 \pmod 3 \implies 2^{100} \equiv (-1)^{100} = 1$.
