# B+ tree node capacity and occupancy

## TL;DR
Leaf nodes store `(key, record ptr)` pairs $+ 1$ next-leaf block pointer. Internal nodes store $p$ child block pointers and $p - 1$ search keys (no record pointers). Minimum non-root occupancy is strictly $\lceil m_{\max} / 2 \rceil$ keys.

## Core idea
- **Leaf node structure:**
  - Holds $m$ pairs of `(search key, record pointer)` plus **1 block pointer** to the next leaf node.
  - Capacity inequality:
    $$m \times (\text{Key} + \text{Record ptr}) + \text{Block ptr} \le \text{Block size}$$
  - Maximum keys: $m_{\max} = \left\lfloor \frac{B - B_p}{K + R_p} \right\rfloor$
  - Minimum keys (non-root): $m_{\min} = \left\lceil \frac{m_{\max}}{2} \right\rceil$
- **Internal (non-leaf) node structure:**
  - Holds $p$ child block pointers and $p - 1$ search keys (does NOT store record pointers).
  - Capacity inequality:
    $$p \times B_p + (p - 1) \times K \le \text{Block size}$$
  - Order $p$ is the maximum child block pointers: $p = \left\lfloor \frac{B + K}{B_p + K} \right\rfloor$
  - Minimum child pointers (non-root): $\lceil p / 2 \rceil$
  - Minimum keys (non-root): $\lceil p / 2 \rceil - 1$

## Where I got confused → what made it click
- **Leaf vs Internal equations:** Leaf nodes store record pointers to reach data rows; internal nodes only store child block pointers for tree navigation.
- **Minimum keys rounding:** Always apply **ceiling** $\lceil m_{\max} / 2 \rceil$. If $m_{\max} = 85$, $85/2 = 42.5 \implies \mathbf{43}$. Taking floor $42$ means the node is less than half full, which violates B+ tree invariants.

## GATE traps
- **The floor distractor:** GATE always provides $\lfloor m_{\max} / 2 \rfloor$ as a tempting trap option.
- **Next-leaf block pointer:** Always include $+ B_p$ in the leaf node inequality; forgetting it overestimates capacity.
- **Order definition ambiguity:** In some literature, order is max child pointers $p$; in others, max keys $m$. GATE CSE consistently defines order of an internal node as the maximum number of child block pointers $p$.

## Example
**Mock 05 Q11:**
- $B = 2048\text{ B}$, $K = 16\text{ B}$, $R_p = 8\text{ B}$, $B_p = 8\text{ B}$.
- Leaf equation: $24m + 8 \le 2048 \implies 24m \le 2040 \implies m_{\max} = 85$.
- Minimum keys: $\lceil 85 / 2 \rceil = \mathbf{43}$ $\implies$ Option (A).

**Internal node order (GATE PYQ):**
- $B = 512\text{ B}$, $K = 8\text{ B}$, $B_p = 4\text{ B}$.
- $4p + 8(p - 1) \le 512 \implies 12p \le 520 \implies p = \mathbf{43}$.
