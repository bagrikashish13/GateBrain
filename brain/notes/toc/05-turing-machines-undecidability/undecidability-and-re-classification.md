# Undecidability and RE vs Recursive classification

## TL;DR
Syntactic properties (state count, transition structure) are decidable. Semantic properties of $L(M)$ are undecidable (Rice's Theorem). Existential properties ($w \in L$, $L \ne \emptyset$) are RE; universal/negative properties ($L = \emptyset$, $L = \Sigma^*$) are co-RE.

## Core idea
- **Syntactic vs Semantic properties:**
  - **Syntactic (Machine structure):** Examines the encoding $\langle M \rangle$ (e.g., number of states $\le 10$, has transition on symbol 0). Always **Recursive (Decidable)** because an algorithm parses the text and halts.
  - **Semantic (Language property):** Concerns the set of strings $L(M)$ accepted by $M$. Any non-trivial semantic property is **Undecidable** by Rice's Theorem.
- **The Finite Witness Test for RE (Semi-decidable):**
  - If a **YES** instance can be verified in finite time by finding a single accepted string:
    - $w \in L(M)$ ($A_{TM}$): Simulate $M$ on $w$. If it accepts, halt and say YES $\implies$ **RE, not Recursive**.
    - $L(M) \ne \emptyset$: Simulate $M$ on all strings in parallel (dovetailing). If any string accepts, halt and say YES $\implies$ **RE, not Recursive**.
- **The Complement trap (co-RE):**
  - If a problem is RE and undecidable, its complement is strictly **co-RE, NOT RE** (if both were RE, the problem would be decidable by Post's theorem):
    - $L(M) = \emptyset$: Complement of $L(M) \ne \emptyset$ $\implies$ **co-RE, NOT RE**.
    - $L(M) = \Sigma^*$: Universality/totality $\implies$ **co-RE, NOT RE**.
- **Higher-level language properties:**
  - Properties like *"Is $L(M)$ regular?"*, *"Is $L(M)$ CFL?"*, *"Is $L(M)$ recursive?"* cannot be verified by finite witnesses in either direction $\implies$ **Neither RE nor co-RE**.

## Where I got confused → what made it click
- **State count vs Language:** "States $\le 10$" sounded undecidable, but it's purely syntactic—you just count states in the description without running any tape!
- **Existential vs Universal intuition:**
  - "Does there *exist* at least one accepted string?" $\implies$ We can halt on finding it $\implies$ **RE**.
  - "Do *all* strings get rejected (empty)?" $\implies$ We can never halt because we have to check infinite strings forever $\implies$ **co-RE**.

## GATE traps
- **Rice's Theorem applicability:** Applies **strictly to the language $L(M)$**, NOT to the machine $M$. "Does $M$ take $>100$ steps on input $w$?" is syntactic/bounded execution $\implies$ Decidable.
- **Dovetailing:** Never simulate strings sequentially ($s_1$ then $s_2$); $s_1$ might loop forever! Parallel simulation (1 step of $s_1$, 1 step of $s_2 \dots$) guarantees finding any accepting computation.

## Example
**Mock 05 Q15:**
- $P_1$ ($L(M) \ne \emptyset$): **RE but not Recursive** (dovetailing witness).
- $P_2$ ($101 \in L(M)$): **RE but not Recursive** (direct simulation).
- $P_3$ ($L(M) = \emptyset$): **co-RE, not RE** (complement of $P_1$).
- $P_4$ ($|Q| \le 10$): **Recursive (decidable)** (syntactic state count).
- $P_5$ ($L(M)$ is recursive): **Neither RE nor co-RE** (semantic property of decidability).
- Total RE but not Recursive $= \mathbf{2}$.
