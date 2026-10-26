# CFG String Counting & Linear Grammar Inequalities

## TL;DR
Never draw parse trees manually to count strings of length $L$. Determine the string shape $a^n b^m$, find the inequality bounds between $n$ and $m$ from the recursive productions, substitute $m = L - n$, and count valid integer values of $n$.

## Core idea
- **Step 1: Characterize the string shape:**
  - Grammars of the form $S \to a^p S b^q \mid \dots \mid a^u b^v$ push all $a$'s to the front and all $b$'s to the rear.
  - Every derived string has the shape $a^n b^m$.

- **Step 2: Establish the inequality between $n$ and $m$ (Account for Base Case!):**
  - Track how many $b$'s accompany each $a$ during $k$ recursive steps:
    - If base production is $S \to a^u b^v$, after $k$ recursive applications:
      $$n = u + k \cdot p \implies k = \frac{n - u}{p}$$
    - Then total $b$'s are:
      $$m = v + k \cdot q = v + q \left(\frac{n - u}{p}\right)$$
  - Example with $S \to aSb \mid aSbb \mid ab$ ($u=1, v=1, p=1$):
    - Minimum $b$'s ($q=1$): $m \ge 1 + 1(n - 1) = n$.
    - Maximum $b$'s ($q=2$): $m \le 1 + 2(n - 1) = \mathbf{2n - 1}$ (NOT $2n$!).
  - Combined inequality:
    $$n \le m \le 2n - 1$$

- **Step 3: Solve for strings of length $L$:**
  - Total length $|w| = n + m = L \implies m = L - n$.
  - Substitute into bounds:
    $$\alpha \cdot n + c_1 \le L - n \le \beta \cdot n + c_2$$
  - Solve for $n$ and find valid integers $\lceil n_{\min} \rceil \le n \le \lfloor n_{\max} \rfloor$.

## Where I got confused → what made it click
- **Manual derivation tree enumeration:**
  - *Confusion:* Drawing recursive parse trees for length 8 or 10, taking 6+ minutes, and constantly worrying about duplicates.
  - *The click:* All strings are of the form $a^n b^m$. Once $n$ is chosen, $m = L - n$ is fixed! There is zero chance of duplicates; simply find how many integer values of $n$ satisfy the bounding inequality.
- **The Base-Case Offset Trap ($2n$ vs $2n - 1$):**
  - *Confusion:* Using $m \le 2n$ blindly from the production $aSbb$.
  - *The click:* The base case $S \to ab$ only supplies 1 $b$ for its 1 $a$! If you do $k$ recursive steps, $n = k + 1 \implies k = n - 1$. The maximum $b$'s are $1 + 2(n - 1) = 2n - 1$. For example, $n=1 \implies m \le 1$ ($ab$), $n=2 \implies m \le 3$ ($a^2 b^3$), never $a^2 b^4$!

## GATE traps
- **Base case offset:** Always write $k = n - u$ and check the exact max/min $b$'s: $m_{\max} = v + q_{\max}(n - u)$. A missing $-1$ shifts the interval bound and gives wrong counts!
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
