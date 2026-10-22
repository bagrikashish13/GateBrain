# CFG String Counting & Linear Grammar Inequalities

## TL;DR
Never draw parse trees manually to count strings of length $L$. Determine the string shape $a^n b^m$, find the inequality bounds between $n$ and $m$ from the recursive productions, substitute $m = L - n$, and count valid integer values of $n$.

## Core idea
- **Step 1: Characterize the string shape:**
  - Grammars of the form $S \to a^p S b^q \mid \dots \mid a^u b^v$ push all $a$'s to the front and all $b$'s to the rear.
  - Every derived string has the shape $a^n b^m$.

- **Step 2: Establish the inequality between $n$ and $m$:**
  - Track how many $b$'s accompany each $a$:
    - If the minimum expansion adds $q_1$ $b$'s per $p_1$ $a$'s: lower bound is $m \ge \frac{q_1}{p_1} n$.
    - If the maximum expansion adds $q_2$ $b$'s per $p_2$ $a$'s: upper bound is $m \le \frac{q_2}{p_2} n$.
  - Combined inequality:
    $$\alpha \cdot n \le m \le \beta \cdot n$$

- **Step 3: Solve for strings of length $L$:**
  - Total length $|w| = n + m = L \implies m = L - n$.
  - Substitute into bounds:
    $$\alpha \cdot n \le L - n \le \beta \cdot n$$
  - Solve for $n$:
    $$\frac{L}{\beta + 1} \le n \le \frac{L}{\alpha + 1}$$
  - Count the number of valid **integers** $n$ in this closed interval.
  - Because each pair $(n, m)$ produces exactly one distinct string $a^n b^m$, the count of integer values of $n$ equals the total number of distinct strings.

## Where I got confused → what made it click
- **Manual derivation tree enumeration:**
  - *Confusion:* Drawing recursive parse trees for length 8 or 10, taking 6+ minutes, and constantly worrying about duplicates.
  - *The click:* All strings are of the form $a^n b^m$. Once $n$ is chosen, $m = L - n$ is fixed! There is zero chance of duplicates; simply find how many integer values of $n$ satisfy the bounding inequality.

## GATE traps
- **Base case offset:** Verify that the base terminal production (e.g. $S \to ab$ or $S \to \epsilon$) obeys the same lower and upper ratios.
- **Strictly integer counting:** Pay attention to floor and ceiling when rounding the interval bounds:
  $$\left\lceil \frac{L}{\beta + 1} \right\rceil \le n \le \left\lfloor \frac{L}{\alpha + 1} \right\rfloor$$

## Example
**GATE Mock 04 Q6:** $S \to aSb \mid aSbb \mid ab$. Find strings of length 8.
1. Base $S \to ab$ has 1 $a$, 1 $b$.
2. Recursive rules add 1 $a$ with either 1 or 2 $b$'s $\implies n \le m \le 2n$.
3. Length $8 = n + m \implies m = 8 - n$.
4. $n \le 8 - n \le 2n \implies 2n \le 8 \implies n \le 4$ and $3n \ge 8 \implies n \ge 2.67$.
5. Valid integers: $n \in \{3, 4\}$.
   - $n=3 \implies m=5 \implies a^3 b^5$
   - $n=4 \implies m=4 \implies a^4 b^4$
6. Total distinct strings $= \mathbf{2}$.
