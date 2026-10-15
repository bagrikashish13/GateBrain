# Distinct distributions and PIE

## TL;DR
Distributing $n$ distinct balls into $k$ distinct non-empty boxes equals the number of **surjective (onto) mappings**. Solve via the **Principle of Inclusion-Exclusion (PIE)**: $k^n - \binom{k}{1}(k-1)^n + \binom{k}{2}(k-2)^n - \dots$.

## Core idea
- **Surjective functions:** Placing $n$ distinct items into $k$ distinct labeled boxes with zero empty boxes is equivalent to counting onto functions $f: \{1, \dots, n\} \to \{1, \dots, k\}$.
- **PIE formula:**
  $$N = \sum_{j=0}^{k} (-1)^j \binom{k}{j} (k - j)^n = k! \cdot S(n, k)$$
  where $S(n, k)$ is the Stirling number of the second kind.
- **Identical vs distinct items:**
  | Items | Boxes | Non-empty constraint formula |
  | :--- | :--- | :--- |
  | **Distinct** | **Distinct** | $k^n - \binom{k}{1}(k-1)^n + \binom{k}{2}(k-2)^n - \dots$ |
  | **Identical** | **Distinct** | Stars & bars: $\binom{n - 1}{k - 1}$ |
  | **Distinct** | **Identical** | Stirling numbers of 2nd kind: $S(n, k)$ |

## Where I got confused → what made it click
- **Stars and bars vs PIE:** Using $\binom{n-1}{k-1}$ for distinct items $\to$ Stars and bars only works when the items are *identical* (e.g. identical coins). When balls are distinguishable (numbered 1 to 5), swapping ball 1 and ball 2 gives a different assignment.

## GATE traps
- **Confusing distinct with identical:** Distributing 5 distinct balls into 3 boxes gives $150$ ways, whereas distributing 5 identical coins into 3 boxes gives $\binom{5-1}{3-1} = \binom{4}{2} = 6$ ways.
- **Forgetting signs in PIE:** The signs strictly alternate: $+$ for 0 empty, $-$ for 1 empty, $+$ for 2 empty, $-$ for 3 empty.

## Example
**Problem (GATE CSE):** Distribute 5 distinct balls into 3 distinct boxes such that no box is empty.

Using PIE with $n = 5, k = 3$:
$$N = 3^5 - \binom{3}{1} 2^5 + \binom{3}{2} 1^5 - \binom{3}{3} 0^5$$
$$N = 243 - 3(32) + 3(1) - 0 = 243 - 96 + 3 = 150$$
