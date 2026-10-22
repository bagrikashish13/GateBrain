# Page Replacement & Thrashing

## TL;DR
Stack algorithms (LRU, OPT) satisfy $M(t, n) \subseteq M(t, n+1)$ and never suffer Belady's anomaly. Clock algorithm sweeps reference bits; when all are 1, it clears all to 0 and picks the initial frame (FIFO fallback). Thrashing occurs when $\sum WSS_i > \text{Total Frames}$; local replacement isolates thrashing to the offending process.

## Core idea
- **Stack Algorithms:**
  - A page replacement algorithm is a stack algorithm if the set of pages in memory with $n$ frames is always a subset of the pages resident with $n+1$ frames for any reference string:
    $$M(t, n) \subseteq M(t, n+1)$$
  - **Guarantee:** Stack algorithms **never exhibit Belady's anomaly** (increasing physical frames never increases page faults).
  - **Members:** LRU, Optimal (OPT), LFU (with consistent recency tie-breaking).
  - **Non-stack algorithms:** FIFO, Second-Chance (Clock), Random. These can all suffer Belady's anomaly.

- **Clock (Second Chance) Algorithm:**
  - Employs a circular buffer of frames and a 1-bit reference bit $R$ per frame.
  - On page fault:
    - If $R = 0$: Replace this frame, set new page's $R = 1$, advance hand.
    - If $R = 1$: Clear $R \to 0$, advance hand to next frame ("second chance").
  - **Edge case (all $R = 1$):** If every frame has $R = 1$, the pointer makes a full $360^\circ$ sweep clearing all bits to $0$. Upon returning to the starting frame, its bit is now $0$, so that frame is replaced. The algorithm degenerates to FIFO.

- **Thrashing & Working Set Model:**
  - **Working Set Size ($WSS_i$):** Number of distinct pages accessed by process $P_i$ in the most recent time window $\Delta$.
  - **Total Frame Demand:** $D = \sum WSS_i$.
  - **Thrashing condition:** $D > \text{Total Available Physical Frames}$.
  - When thrashing occurs, processes spend almost 100% of time queued waiting for page swap I/O; CPU utilization drops toward zero.

- **Local vs Global Page Replacement:**
  - **Local replacement:** Victim frame must come from the faulting process's own allocated frame set. A process that thrashes cannot steal frames from others; thrashing is contained.
  - **Global replacement:** Victim frame can be chosen from any process. A thrashing process steals frames from healthy processes, triggering cascading thrashing across the entire system.

## Where I got confused → what made it click
- **Local replacement and thrashing:**
  - *Confusion:* Thinking local replacement allows a thrashing process to directly steal page frames from others.
  - *The click:* Frame stealing is prohibited under local replacement by definition. Thrashing can indirectly slow other processes via disk queue contention, but it cannot steal their allocated memory frames. Only global replacement allows direct frame theft.

## GATE traps
- **Belady's anomaly in Clock:** Clock approximates LRU, but because it relies on FIFO pointer movement, it is NOT a stack algorithm and can suffer Belady's anomaly.
- **Clock pointer advance:** When clearing $R = 1 \to 0$, the pointer *must* advance. It does not stop until it finds an $R = 0$.
- **Working set window $\Delta$:**
  - $\Delta$ too small $\implies$ misses portions of active locality.
  - $\Delta$ too large $\implies$ overlaps multiple distinct execution phases, wasting memory.
  - $\Delta \to \infty \implies$ working set equals the entire set of pages touched by the process.

## Example
**GATE Mock 03 Q11:**
- Statement A: "LRU and OPT are stack algorithms, never suffer Belady's anomaly." $\implies$ **TRUE**.
- Statement B: "Clock algorithm with all reference bits $= 1$ clears all to 0 and selects the initial frame." $\implies$ **TRUE**.
- Statement C: "Thrashing occurs when $\sum WSS_i > \text{Total physical frames}$." $\implies$ **TRUE**.
- Statement D: "In local page replacement, a thrashing process directly steals frames from other processes." $\implies$ **FALSE** (local replacement prevents frame theft).
