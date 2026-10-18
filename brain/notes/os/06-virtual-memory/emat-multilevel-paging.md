# Effective Memory Access Time (EMAT) & Multi-level Paging

## TL;DR
For $k$-level paging with sequential TLB lookup: $\text{EMAT} = \text{TLB} + M + (1 - h) \cdot k \cdot M$. Every reference pays $\text{TLB} + M$, and only misses pay the extra $k$ memory accesses for page table levels.

## Core idea
- **Base parameters:**
  - $h$: TLB hit ratio ($0 \le h \le 1$).
  - $\text{TLB}$: TLB lookup time.
  - $M$: Main memory access time.
  - $k$: Number of page table levels (e.g., $k=1$ for single-level, $k=2$ for two-level).
- **Sequential TLB lookup (Standard GATE default):**
  - Hit: $\text{TLB} + M$ (1 TLB lookup + 1 memory access to fetch operand).
  - Miss: $\text{TLB} + k \cdot M + M$ (1 TLB lookup + $k$ page table memory accesses + 1 data memory access).
  - **Universal formula:**
    $$\text{EMAT} = h(\text{TLB} + M) + (1 - h)(\text{TLB} + (k + 1)M) = \mathbf{\text{TLB} + M + (1 - h) \cdot k \cdot M}$$
- **Simultaneous / Parallel TLB lookup:**
  - If TLB and memory/cache are searched concurrently:
    $$\text{EMAT} = h \cdot M + (1 - h)(k + 1)M$$
- **With Page Fault Rate ($p$):**
  - If page faults can occur with probability $p$ and service time $\text{PFST}$:
    $$\text{EMAT} = (1 - p) \cdot \text{EMAT}_{\text{no-pf}} + p \cdot \text{PFST}$$

## Where I got confused → what made it click
- **Number of memory accesses on miss:**
  - *Confusion:* Confusing total memory accesses on miss ($k + 1$) with page table memory accesses ($k$).
  - *The click:* Remember that finding the frame number is only step 1; you still have to fetch the actual data byte from physical memory! That adds the $+1$. In the simplified formula $\text{TLB} + M + (1 - h) \cdot k \cdot M$, the data fetch $M$ is factored out upfront because you *always* fetch the data word whether TLB hits or misses.

## GATE traps
- **Sequential vs Simultaneous:** Always read the question carefully. Unless "simultaneous" or "parallel" is explicitly stated, assume TLB lookup is sequential and adds to the miss penalty.
- **Inverted page table:** An inverted page table has 1 entry per physical frame, not per virtual page. Translation uses a hash table; miss or hash collision requires searching or page faulting.
- **Unit mismatch:** Watch out for $\text{ns}$ (nanoseconds) vs $\mu\text{s}$ (microseconds) vs $\text{ms}$ (milliseconds). Page fault service time is usually in $\text{ms}$ ($10^6\text{ ns}$), while memory access is in $\text{ns}$.

## Example
**Mock 02 Q4:** 2-level paging ($k = 2$), $\text{TLB} = 20\text{ ns}$, $M = 100\text{ ns}$. What minimum hit ratio $h$ guarantees $\text{EMAT} \le 160\text{ ns}$?
- Using the fast formula:
  $$\text{EMAT} = 20 + 100 + (1 - h) \cdot 2 \cdot 100 = 120 + 200(1 - h)$$
- Set constraint:
  $$120 + 200(1 - h) \le 160 \implies 200(1 - h) \le 40$$
  $$1 - h \le 0.20 \implies h \ge 0.80 = \mathbf{80\%}$$
