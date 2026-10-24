# Binary buddy system

## TL;DR
Allocates memory in powers of 2 ($2^k \ge S$). A block splits into equal twin "buddies" (lower and higher address halves). Two adjacent free blocks merge if and only if they are true buddies ($A \oplus 2^k$).

## Core idea
- **Power-of-2 allocation:** A request of size $S$ is rounded up to the smallest $2^k \ge S$.
- **Buddy split:** A block of size $2^k$ at address range $[A, A + 2^k)$ divides into two equal buddies:
  - **Lower buddy:** $[A, A + 2^{k-1})$
  - **Higher buddy:** $[A + 2^{k-1}, A + 2^k)$
- **Buddy address formula:** For a block of size $2^k$ starting at address $A$, its unique buddy begins at:
  $$\text{Buddy}(A) = A \oplus 2^k$$
- **Coalescing (merging):** When a block is freed, it can merge with its neighbor **only** if that neighbor is its exact buddy and is also free.

## Where I got confused → what made it click
- **Lower address buddy:** Sounded like a complex addressing mode. Click: it simply means the left half of the cut (the piece starting at the smaller address).
- **Tracing allocations:** Maintain an explicit pool of free blocks by size. When a request arrives, pick the smallest available free block $\ge 2^k$ and repeatedly split the lower buddy until the exact $2^k$ size is reached.

## GATE traps
- **Adjacent does not mean buddies:** Two free 128 KB blocks at addresses `[128, 256)` and `[256, 384)` are neighbors, but $128 \oplus 128 = 0$. The buddy of 128 is 0, not 256. They **cannot** coalesce!
- **Internal fragmentation:** Equal to $\text{Allocated block size} - \text{Requested size}$. A request of 65 KB gets 128 KB, creating $128 - 65 = 63\text{ KB}$ internal fragmentation.
- **Exact powers of 2:** A request of exactly 64 KB needs $2^6 = 64\text{ KB}$ (0 internal fragmentation). A request of 64.001 KB jumps to 128 KB.

## Example
From Mock 05 (Initial: 1024 KB `[0, 1024)`):
1. $P_1$ requests 110 KB $\implies$ needs 128 KB. Split down lower buddies $\to$ allocated `[0, 128)`. Free: 128 KB `[128, 256)`, 256 KB `[256, 512)`, 512 KB `[512, 1024)`.
2. $P_2$ requests 230 KB $\implies$ needs 256 KB. Allocated `[256, 512)`.
3. $P_3$ requests 70 KB $\implies$ needs 128 KB. Allocated `[128, 256)`.
4. $P_4$ requests 55 KB $\implies$ needs 64 KB. Only `[512, 1024)` is free. Split lower buddies: `[512, 768)` $\to$ `[512, 640)` $\to$ `[512, 576)`.
   Allocated starting address = **512**. Internal fragmentation = $64 - 55 = \mathbf{9\text{ KB}}$.
