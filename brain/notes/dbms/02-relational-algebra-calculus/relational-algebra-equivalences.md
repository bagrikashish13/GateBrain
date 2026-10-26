# Relational algebra equivalences & semi-join

## TL;DR
Natural join is commutative and associative. Projections on join can push down only if discarded attributes aren't needed for the join condition. The semi-join $R \ltimes S = \Pi_{\text{schema}(R)}(R \bowtie S)$, so $\Pi_A(R \ltimes S) \equiv \Pi_A(R \bowtie S)$.

## Core idea
- **Natural join expansion:** $R(A, B) \bowtie S(B, C) = \Pi_{A, B, C}(\sigma_{R.B = S.B}(R \times S))$.
- **Pushing projection:** If attribute $C$ is not referenced in the final output and not part of the join condition:
  $$\Pi_A(R \bowtie S) \equiv \Pi_A(R \bowtie \Pi_B(S))$$
- **Semi-join identity:** $R \ltimes S$ is defined as the projection of $R \bowtie S$ onto $R$'s attributes:
  $$R \ltimes S = \Pi_R(R \bowtie S)$$
  Since $A \subseteq \text{schema}(R)$, applying $\Pi_A$ to both sides gives:
  $$\Pi_A(R \ltimes S) = \Pi_A(\Pi_R(R \bowtie S)) = \Pi_A(R \bowtie S)$$
- **Anti-join ($R \rhd S$ or $R \ \bar{\ltimes}\ S$):** Keeps tuples of $R$ that have **NO match** in $S$.
  $$R \rhd S = R \setminus (R \ltimes S) = R \setminus \Pi_{\text{schema}(R)}(R \bowtie S)$$
  Equivalent to SQL `NOT EXISTS`.
- **Selection push-down:** $\sigma_\theta(R \bowtie S) \equiv \sigma_\theta(R) \bowtie S$ if condition $\theta$ involves only attributes of $R$.

## Where I got confused → what made it click
- **Semi-join symbol ($\ltimes$) vs natural join ($\bowtie$):**
  - *Confusion:* Missing that $R \ltimes S$ already filters $R$ to only the tuples that have a match in $S$.
  - *The click:* Think of semi-join as an `EXISTS` subquery in SQL: `SELECT * FROM R WHERE EXISTS (SELECT 1 FROM S WHERE R.B = S.B)`. Projecting $A$ from this produces the exact same distinct $A$ values as projecting $A$ from the full join.
- **Anti-join symbol ($\rhd$ or $\bar{\ltimes}$):**
  - *Confusion:* Not recognizing $\rhd$ or writing $R \setminus (R \bowtie S)$.
  - *The click:* Anti-join $\rhd$ is simply `NOT EXISTS`. Because set difference requires union-compatibility, you cannot subtract $R \bowtie S$ directly from $R$. You subtract the semi-join: $R \setminus (R \ltimes S) = R \setminus \Pi_{\text{schema}(R)}(R \bowtie S)$.

## GATE traps
- **Anti-join syntax & union-compatibility trap:**
  - Expression $R \setminus (R \bowtie S)$ is **SYNTACTICALLY INVALID** because $R$ and $R \bowtie S$ have different schemas (violates union-compatibility).
  - Must project down to $R$'s schema first: $R \setminus \Pi_{\text{schema}(R)}(R \bowtie S) \equiv R \setminus (R \ltimes S) \equiv R \rhd S$.
- **Set difference and duplicate values trap:**
  - Expression $\Pi_A(R) \setminus \Pi_A(R \setminus (R \bowtie \Pi_B(S)))$ is NOT equivalent in general!
  - If a single $A$ value appears in multiple tuples of $R$ (one matching $S$ and one not), the set difference removes $A$ entirely.
- **Pushing projection past join without join attributes:** You cannot compute $\Pi_A(R) \bowtie \Pi_C(S)$ directly because the join attribute $B$ is lost. The join attribute must be retained until after the join.
- **Distribution of Projection ($\Pi$) over Set Operations:**
  - **Union:** $\Pi_A(R \cup S) \equiv \Pi_A(R) \cup \Pi_A(S)$ (ALWAYS EQUAL).
  - **Intersection:** $\Pi_A(R \cap S) \subseteq \Pi_A(R) \cap \Pi_A(S)$ (Subset always holds, equality may fail).
  - **Set Difference:** $\Pi_A(R) \setminus \Pi_A(S) \subseteq \Pi_A(R \setminus S)$ (Subset always holds, equality may fail).
    - Left side ($\Pi_A(R) \setminus \Pi_A(S)$): $a$ has **ZERO** matching tuples in $S$.
    - Right side ($\Pi_A(R \setminus S)$): $a$ has **AT LEAST ONE** non-matching tuple in $S$.
    - Therefore: $\Pi_A(R) \setminus \Pi_A(R \bowtie S) \subseteq \Pi_A(R \setminus (R \bowtie \Pi_B(S)))$ always holds!
- **Distribution of Selection ($\sigma$):** $\sigma$ distributes over $\cup$, $\cap$, and $\setminus$ with exact equality ($\equiv$).

## Example
**Mock 02 Q9:** $R(A, B)$ and $S(B, C)$. Which are always equivalent to $\Pi_A(R \bowtie S)$?
- $\Pi_A(R \bowtie \Pi_B(S))$: **True** (pushing projection on $S$ down to join attribute $B$).
- $\Pi_A(\sigma_{R.B = S.B}(R \times S))$: **True** (natural join definition).
- $\Pi_A(R \ltimes S)$: **True** ($\Pi_A(\Pi_{A, B}(R \bowtie S)) = \Pi_A(R \bowtie S)$).
- $\Pi_A(R) \setminus \Pi_A(R \setminus (R \bowtie \Pi_B(S)))$: **False** (fails if an $a_i$ has multiple $b$'s in $R$).
