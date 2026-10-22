# Multi-level Page Table Overhead & Page Count

## TL;DR
To map a virtual memory region of size $S$ across a $k$-level page table hierarchy, calculate pages bottom-up. Leaf level needs $\lceil S / \text{PageSize} \rceil$ entries packed into $\lceil \text{LeafEntries} / \text{EntriesPerPage} \rceil$ frames. Each parent level groups pointers to the level below until the single root page table.

## Core idea
- **Virtual address breakdown:**
  - Given address width $V$ bits and page size $P = 2^p$ bytes:
    $$\text{Page Offset} = p\text{ bits}, \quad \text{Virtual Page Number (VPN)} = V - p\text{ bits}$$
  - Each page table page occupies 1 frame ($P$ bytes).
  - With Page Table Entry (PTE) size $E = 2^e$ bytes:
    $$\text{Entries per page table frame} = \frac{P}{E} = \frac{2^p}{2^e} = 2^{p - e}$$
  - Each level of the page table resolves up to $p - e$ bits of the VPN.
  - Number of levels $k = \lceil \frac{V - p}{p - e} \rceil$.

- **Counting frames bottom-up for a process of size $S$:**
  1. **Data pages:** $\text{Pages} = \lceil S / P \rceil$.
  2. **Level $k$ (Leaf tables):** Each leaf table maps $2^{p - e}$ data pages.
     $$\text{Tables}_{k} = \left\lceil \frac{\text{Pages}}{2^{p - e}} \right\rceil$$
  3. **Level $k-1$ down to Level 2:** Each table at Level $i$ holds pointers to tables at Level $i+1$. For contiguous aligned memory:
     $$\text{Tables}_{i} = \left\lceil \frac{\text{Tables}_{i+1}}{2^{p - e}} \right\rceil$$
  4. **Level 1 (Root table):** The root directory always requires **exactly 1 page table page**.
  5. **Total page table overhead:**
     $$\text{Total Frames} = \sum_{i=1}^{k} \text{Tables}_i$$

## Where I got confused → what made it click
- **Root bits vs Total frames:**
  - *Confusion:* Entering the number of bits in the top level (e.g. $36 - 30 = 6$) as the answer to "how many page table pages are required".
  - *The click:* The question asks for the **total count of physical frames** holding page tables across the entire tree, NOT the bit width of the root index! Always compute leaf tables first and climb to the root.

## GATE traps
- **Contiguous vs Non-contiguous allocation:**
  - If a $64\text{ MB}$ process is contiguous and aligned, all its Level-4 tables group into a single Level-3 page table.
  - If the process pages are scattered randomly across the 48-bit address space, every data page could theoretically require its own path of page tables, drastically increasing the count.
- **Top level always exists:** The root page table frame is allocated as soon as the process is created, even if only 1 entry inside it is valid.
- **PTE size vs Frame size:** Always verify if PTE is in bytes or bits. $4\text{ bytes} = 32\text{ bits}$.

## Example
**GATE Mock 03 Q13:** $V = 48\text{ bits}$, Page size $= 4\text{ KB} = 2^{12}\text{ B}$, $\text{PTE} = 4\text{ B} = 2^2\text{ B}$, Process size $= 64\text{ MB} = 2^{26}\text{ B}$ (contiguous, aligned).
- $\text{Offset} = 12\text{ bits}$, $\text{VPN} = 48 - 12 = 36\text{ bits}$.
- $\text{Entries per page} = \frac{4096}{4} = 1024 = 2^{10}$ entries $\implies 10\text{ bits/level}$.
- Hierarchy: $36\text{ bits} = 6\text{ (root)} + 10 + 10 + 10 \implies 4\text{ levels}$.
- $\text{Data pages} = \frac{64\text{ MB}}{4\text{ KB}} = 2^{14} = 16384\text{ pages}$.
- Level 4 (Leaf): $\frac{16384}{1024} = 16\text{ pages}$.
- Level 3: $\lceil \frac{16}{1024} \rceil = 1\text{ page}$.
- Level 2: $\lceil \frac{1}{1024} \rceil = 1\text{ page}$.
- Level 1 (Root): $1\text{ page}$.
- Total page table frames $= 16 + 1 + 1 + 1 = \mathbf{19\text{ pages}}$.
