# Decomposition Properties & Normal Forms (3NF vs BCNF)

## TL;DR
If all attributes in a relation are prime, **3NF is unconditionally guaranteed** (BCNF is not). A binary decomposition is **lossless-join** if the common attribute is a superkey of at least one relation. An FD spanning across tables is **lost** unless the LHS can derive the common bridge attribute to trigger dependencies across the split.

## Core idea
- **Candidate Keys & Prime Attributes:**
  - Essential attributes (never on RHS of any FD) **must appear in every candidate key**.
  - **Prime Attribute:** Any attribute that belongs to *at least one* candidate key.
  - **Non-prime Attribute:** An attribute that does not belong to *any* candidate key.

- **The "All Attributes Prime" Rule:**
  - **2NF condition:** No proper subset of a candidate key can determine a non-prime attribute.
  - **3NF condition:** For every non-trivial $X \to Y$, either $X$ is a superkey OR **$Y$ is prime**.
  - **The Law:** If **all attributes are prime**, there are no non-prime attributes! Therefore, **both 2NF and 3NF hold trivially and unconditionally**.
  - **Does this guarantee BCNF? NO!** BCNF requires $X$ to be a superkey for *all* $X \to Y$. A dependency like $E \to A$ where $E$ is not a superkey still violates BCNF even if both $E$ and $A$ are prime.

- **Binary Decomposition $\{R_1, R_2\}$ Checks:**
  1. **Lossless-Join Decomposition:**
     - Must satisfy:
       $$(R_1 \cap R_2 \to R_1) \quad \text{OR} \quad (R_1 \cap R_2 \to R_2)$$
     - That is, the common attribute set must be a superkey of $R_1$ or $R_2$.
  2. **Dependency Preservation (The Bridge Rule):**
     - For any FD $X \to Y$ whose attributes are split between $R_1$ and $R_2$:
     - Compute the closure $(X)^+$ using only dependencies holding within $R_1$ and $R_2$.
     - If $X$ cannot derive the common attribute ($R_1 \cap R_2$), it can never trigger dependencies in the other relation, and the dependency is **permanently LOST**.

## Where I got confused → what made it click
- **Missing 3NF when BCNF fails:**
  - *Confusion:* Checking $A \to B$ and seeing $A$ is not a superkey, then concluding the relation is in neither BCNF nor 3NF.
  - *The click:* Remember condition 2 of 3NF: $Y$ being prime saves it! Since $B$ is part of candidate key $BC$, $B$ is prime $\implies$ 3NF holds!
- **Assuming split FDs are preserved:**
  - *Confusion:* Assuming $BC \to D$ is preserved in $R_1(A, B)$ and $R_2(A, C, D, E)$.
  - *The click:* Use the Bridge Rule. Can $B$ derive $A$? No ($A \to B$ does not go backwards). Since $B$ cannot reach bridge $A$, we can never trigger $AC \to D$. $BC \to D$ is lost.

## GATE traps
- **The "All Prime $\implies$ BCNF" fallacy:**
  - Canonical counterexample: $R(A, B, C)$ with $AB \to C$ and $C \to B$.
  - Candidate keys: $AB, AC$. All attributes $\{A, B, C\}$ are prime $\implies$ **3NF**.
  - But $C \to B$ has non-superkey LHS $\implies$ **NOT BCNF**.
- **Lossless $\ne$ Dependency Preserving:**
  - Any relation can be decomposed into 3NF such that it is BOTH lossless and dependency-preserving.
  - A decomposition into BCNF is always lossless, but **not necessarily dependency-preserving**.

## Example
**GATE Mock 04 Q11:**
- $R(A, B, C, D, E)$ with $F = \{ A \to B, \; BC \to D, \; D \to E, \; E \to A \}$.
- Keys: $AC, BC, DC, EC \implies$ all attributes prime $\implies$ **3NF, not BCNF** (Statement A: TRUE).
- Decomposition $R_1(A, B)$ and $R_2(A, C, D, E)$:
  - $R_1 \cap R_2 = \{A\}$, and $(A)^+ = \{A, B\} = R_1 \implies$ **Lossless** (Statement B: TRUE).
  - $(BC)^+$ using projected FDs cannot derive $A \implies BC \to D$ is lost $\implies$ **Not dependency-preserving** (Statement C: FALSE).
  - $R_1$ is BCNF (key $A$); $R_2$ is 3NF not BCNF (key $AC$, $E \to A$ violates BCNF) $\implies$ Statement D: TRUE.
- **Answer:** **A, B, D**.
