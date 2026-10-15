# Syllogisms and deduction

## TL;DR
Translate premises into **set intersections and subsets**. A conclusion is valid only if it holds across *every* possible Venn diagram configuration satisfying the premises.

## Core idea
- **Standard propositions as sets:**
  - *All $A$ are $B$:* $A \subseteq B$.
  - *Some $A$ are $B$:* $A \cap B \neq \emptyset$.
  - *No $A$ is $B$:* $A \cap B = \emptyset$.
  - *Some $A$ are not $B$:* $A \setminus B \neq \emptyset$.
- **Chain of deduction:**
  - If $P \cap R \neq \emptyset$ (some $P$ are $R$), and $R \cap A = \emptyset$ (no $R$ is $A$), then any element $x \in (P \cap R)$ must satisfy $x \notin A$.
  - Therefore, $P \setminus A \neq \emptyset \implies$ **"Some $P$ are not $A$"** is guaranteed.

## Where I got confused → what made it click
- **Assuming disjointness:** Concluding "No $E$ is $A$" because $E$ and $A$ were never mentioned together $\to$ Unconnected terms in premises may freely overlap or remain disjoint; unless a premise explicitly forbids overlap, you cannot conclude "No $E$ is $A$".

## GATE traps
- **The "Some $\implies$ All" fallacy:** If some $P$ are $R$, it does not imply all $R$ are $P$, nor does it imply all $P$ are $R$.
- **Leaping across subsets:** If $E \subseteq P$ and some $P$ are $R$, $E$ and $R$ do not necessarily intersect.

## Example
**Problem (GATE CSE):**
1. All engineers are problem solvers ($E \subseteq P$).
2. Some problem solvers are researchers ($P \cap R \neq \emptyset$).
3. No researcher is an artist ($R \cap A = \emptyset$).

**Valid deduction:**
The overlap between problem solvers and researchers ($P \cap R$) contains at least one entity. That entity is in $P$ but cannot be in $A$ because $R$ and $A$ share no members. Hence, **"Some problem solvers are not artists"** is logically sound.
