# DFA State Multiplication vs State Collapse

## TL;DR
Product DFA states multiply ($m \times n$) only when tracking independent, orthogonal properties (e.g. $|w|_a \bmod p$ and $|w|_b \bmod q$). When conditions share history, track the same symbol, or overlap (prefixes, suffixes, substrings), the state space collapses significantly below $m \times n$.

## Core idea
- **When States Multiply ($m \times n$):**
  - **Independent counters:** Condition 1 tracks symbol $a$, Condition 2 tracks symbol $b$.
    - Example: $|w|_a \bmod 4 = 0$ AND $|w|_b \bmod 5 = 0 \implies 4 \times 5 = 20\text{ states}$.
  - **Orthogonal properties:** Modulo arithmetic on length AND a substring check with independent transitions.

- **When States Collapse ($< m \times n$):**
  - **Same symbol modulo:** $|w| \bmod p = 0$ AND $|w| \bmod q = 0 \implies \text{lcm}(p, q)$ states (not $p \times q$).
  - **Prefix + Suffix:** Condition 1 ("starts with $a$") only matters at step 1. Once verified, the DFA only needs to remember the ending symbol.
    - Example: starts with $a$ (3) AND ends with $b$ (2) $\implies 4\text{ states}$ (not $3 \times 2 = 6$).
  - **Shared Substring Memory:** Two substring conditions on the same alphabet share the memory of the "last read symbol".
    - Example: "neither $aa$ nor $bb$" $\implies$ does not need $3 \times 3 = 9$ states; collapses to **4 states** ($q_0, q_a, q_b, q_{\text{trap}}$).
    - "contains $aa$ AND contains $bb$" $\implies$ state (just saw $a$, just saw $b$) is unreachable; collapses from 9 to **8 states**.

## Where I got confused → what made it click
- **Overestimating minimal states:**
  - *Confusion:* Using Cartesian product $m \times n$ as the answer for minimal DFA states.
  - *The click:* Product construction is an **upper bound**, not the minimal automaton! Whenever two conditions share the same alphabet stream or position, always test what *unique minimal memory* the machine needs to maintain.

## GATE traps
- **LCM vs Multiplication:**
  - If $\gcd(p, q) = 1$ (coprime): $\text{lcm}(p, q) = p \times q$.
  - If $\gcd(p, q) > 1$: $\text{lcm}(p, q) < p \times q$. Always take LCM for divisibility of the same property!
- **Overlapping strings:** In $L = \{ w \mid w \text{ starts with } ab \text{ and ends with } ba \}$, the string $aba$ satisfies both conditions with a shared $b$. Naive product $4 \times 3 = 12$ collapses to 5 states.

## Example
**GATE Mock 04 Q3:**
$L = \{ w \in \{a, b\}^* \mid w \text{ contains neither } aa \text{ nor } bb \}$.
- Start state $q_0$ (accepts $\epsilon$)
- State $q_a$ (last was $a$; on $a \to q_{\text{trap}}$, on $b \to q_b$)
- State $q_b$ (last was $b$; on $b \to q_{\text{trap}}$, on $a \to q_a$)
- State $q_{\text{trap}}$ (dead state after $aa$ or $bb$)
- **Total minimal complete DFA states $= \mathbf{4}$**.
