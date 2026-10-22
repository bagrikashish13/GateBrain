# Disk Scheduling Algorithms: SCAN, LOOK, C-SCAN, C-LOOK

## TL;DR
Always sort requests first. In a single continuous direction, distance is $\text{End} - \text{Start}$. LOOK and C-LOOK stop at the furthest requests; SCAN and C-SCAN travel to physical boundaries ($0$ and $199$). Difference $(T_{\text{SCAN}} - T_{\text{LOOK}}) = 2 \times (\text{Boundary} - \text{Furthest Request})$.

## Core idea
- **Key Concepts:**
  - **Head Movement (Seek Distance):** The distance in cylinders the read/write head travels.
  - **Straight-Line Rule:** When the head moves continuously in one direction from cylinder $A$ to cylinder $B$, total distance is simply $|B - A|$ regardless of how many intermediate requests are serviced.

- **The Four Elevator Algorithms:**
  1. **LOOK (Smart Elevator):**
     - Moves in the given direction servicing requests up to the **furthest requested cylinder**.
     - Immediately reverses direction and services requests until the furthest request on the opposite side.
     - **Never touches disk boundaries (0 or Max)** unless a request specifically exists there.
  2. **SCAN (Rigid Elevator):**
     - Moves in the given direction servicing requests **all the way to the boundary cylinder** (0 or Max).
     - Reverses at the boundary and services requests in the opposite direction.
  3. **C-LOOK (Circular LOOK):**
     - Services requests in **one direction only** up to the furthest request.
     - Jumps straight back to the **furthest request on the opposite end** without servicing any requests on the return trip.
     - Continues servicing in the original direction.
  4. **C-SCAN (Circular SCAN):**
     - Services requests in one direction all the way to the **boundary** (e.g. 199).
     - Jumps all the way back to the **opposite boundary** (0) without servicing.
     - Continues servicing in the original direction.

- **The 5-Second Shortcut for $(T_{\text{SCAN}} - T_{\text{LOOK}})$:**
  - Both algorithms cover identical paths except near the turnaround boundary:
    $$\Delta = 2 \times |\text{Boundary Cylinder} - \text{Furthest Requested Cylinder}|$$

## Where I got confused → what made it click
- **Intermediate stops:**
  - *Confusion:* Spending minutes calculating $|62-50| + |64-62| + |95-64| + \dots$
  - *The click:* All intermediate stops are on a straight line! Distance is purely $\text{Destination} - \text{Start}$.
- **SCAN vs LOOK boundary:**
  - *Confusion:* Forgetting whether SCAN or LOOK touches the boundary.
  - *The click:* **LOOK** "looks" ahead: if no requests remain, it stops immediately. **SCAN** "scans" the full platter to the physical edge.

## GATE traps
- **Direction of movement:** Always verify if the question says "moving towards higher numbers" (increasing) or "moving towards cylinder 0" (decreasing).
- **Disk boundary values:** Hard disks have cylinders $0$ to $N - 1$. For a 200-cylinder disk, the boundary is **199**, not 200.
- **Return jump counting:** In C-SCAN and C-LOOK, the return trip counts toward total head movement unless the question explicitly says "service head movement only".

## Example
**GATE Mock 04 Q13:**
- Cylinders: $0$ to $199$. Current: $50$, moving towards $199$.
- Queue: $11, 34, 62, 64, 95, 119, 123, 180$.
- Furthest request in direction of movement $= 180$. Disk boundary $= 199$.
- Using the shortcut:
  $$T_{\text{SCAN}} - T_{\text{LOOK}} = 2 \times (199 - 180) = 2 \times 19 = \mathbf{38\text{ cylinders}}$$
