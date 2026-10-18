# Chomsky Normal Form (CNF)

## TL;DR
Every production in CNF is strictly $A \to BC$ or $A \to a$. Deriving any string $w$ of length $n = |w| \ge 1$ takes exactly $2n - 1$ steps ($n - 1$ non-terminal splits + $n$ terminal conversions).

## Core idea
- **Production format:** Only two types allowed:
  - $A \to BC$ ($A, B, C \in V$, where $B, C$ cannot be start symbol if start derives $\epsilon$)
  - $A \to a$ ($a \in T$)
- **Derivation steps formula:**
  - Start with 1 non-terminal ($S$).
  - Each $A \to BC$ rule replaces 1 non-terminal with 2, increasing total non-terminals by $+1$. To reach $n$ non-terminals requires $n - 1$ steps.
  - Each $A \to a$ rule replaces 1 non-terminal with 1 terminal. Converting all $n$ non-terminals requires $n$ steps.
  - **Total steps:** $(n - 1) + n = 2n - 1$.
- **Parse tree height:**
  - A derivation tree in CNF is a binary tree where internal nodes have 2 children and pre-terminal nodes have 1 child.
  - Minimum height for yield of length $n$: $\lceil \log_2 n \rceil + 1$.
  - Maximum height for yield of length $n$: $n$.

## Where I got confused → what made it click
- **Derivation steps vs tree height:**
  - *Confusion:* Memorising $2n - 1$ and mixing it up with tree height or length of parse.
  - *The click:* Derivation steps are strictly count of rule applications. Think of it as: $n - 1$ additions to split into $n$ leaves, plus $n$ terminal replacements. It holds for *every* string of length $n$, regardless of grammar ambiguity or derivation order (leftmost vs rightmost).

## GATE traps
- **Off-by-one error:** Forgetting the $-1$ and answering $2n$. Remember that you start with 1 symbol ($S$), not 0, so only $n - 1$ splits are needed.
- **Empty string $\epsilon$:** If $\epsilon \in L(G)$, the rule $S \to \epsilon$ is permitted, but $S$ must never appear on the RHS of any production.
- **GNF contrast (Greibach Normal Form):** Every rule in GNF is $A \to a\alpha$ (where $\alpha \in V^*$). In standard GNF ($A \to a V^*$), deriving a string of length $n$ takes exactly $n$ steps because each step generates exactly 1 terminal.
- **2-GNF ($A \to aBC$):** Derivation steps $= \frac{n - 1}{2} + \dots$ (watch the production form before applying the formula).

## Example
**GATE 2020 / Mock Q12:** Let $G$ be a CFG in CNF. How many derivation steps are needed to derive a string of length $|w| = 18$?
- $n = 18$
- Total steps $= 2n - 1 = 2(18) - 1 = 35$.
- Splitting steps ($A \to BC$): $18 - 1 = 17$.
- Terminal replacement steps ($A \to a$): $18$.
- Total $= 17 + 18 = 35$.
