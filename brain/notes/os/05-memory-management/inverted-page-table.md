# Inverted Page Table (IPT) & Translation

## TL;DR
An Inverted Page Table has exactly one entry per physical frame in RAM (shared by all processes). It drastically reduces page table memory in 64-bit architectures, but makes address translation slower (requires hashing) and shared memory difficult.

## Core idea
- **Traditional vs Inverted Page Table:**
  - **Traditional:** Indexed by Virtual Page Number (VPN). One page table per process. Size scales with virtual address space $\implies$ huge overhead in 64-bit architectures.
  - **Inverted (IPT):** Indexed by Physical Frame Number. Exactly **one table for the entire system**. Sized by physical memory, not virtual memory.

- **Structure of an Inverted Page Table:**
  - **Total number of entries:**
    $$\text{Entries} = \text{Total Physical Frames} = \frac{\text{Physical Address Space}}{\text{Page Size}} = 2^{\text{PAS} - \text{offset}}$$
  - **Contents of each entry:**
    1. **Process ID (PID):** Identifies which process owns this frame.
    2. **Virtual Page Number (VPN):** $\text{VAS bits} - \text{offset bits}$.
    3. **Control / Protection bits:** Valid, dirty, reference, read/write/execute.
    4. **Hash Chain Pointer:** Points to another entry in the IPT to resolve collisions:
       $$\text{Pointer bits} = \lceil \log_2(\text{Total Physical Frames}) \rceil$$
  - **Entry size (bytes):**
    $$\text{Entry size} = \left\lceil \frac{\text{PID} + \text{VPN} + \text{Control} + \text{Pointer}}{8} \right\rceil\text{ bytes}$$
  - **Total Table Size:**
    $$\text{Total IPT Size} = (\text{Total Frames}) \times (\text{Entry size in bytes})$$

- **Pros & Cons:**
  - **Pros:** Massive memory savings for large (64-bit) virtual address spaces.
  - **Cons:** Slower lookup time (must hash `(PID, VPN)` and traverse chain on TLB miss; cannot direct-index). Shared memory is difficult to support because each frame has only one entry.

## Where I got confused → what made it click
- **What determines IPT entries vs size:**
  - *Confusion:* Thinking the number of entries depends on virtual address space, or that virtual address space doesn't affect table size at all.
  - *The click:* The **number of entries** depends strictly on **Physical Frames**. But the **size of each entry** contains the **VPN**, so virtual address space width determines entry width!

## GATE traps
- **Byte rounding:** Always check if the question says "rounded up to the nearest integer byte". For example, $81\text{ bits} \implies \lceil 81/8 \rceil = 11\text{ bytes}$.
- **Chain pointer width:** The hash chain pointer addresses another slot in the IPT; its bit width is $\log_2(\text{number of frames})$.
- **Shared memory difficulty:** In traditional paging, two processes share memory easily by having entries in their separate tables point to the same frame. In IPT, each physical frame has only one entry, making shared memory complex.

## Example
**GATE Mock 04 Q10:**
- $\text{VAS} = 48\text{ bits}$, $\text{PAS} = 36\text{ bits}$, Page size $= 8\text{ KB} = 2^{13}\text{ B}$.
- $\text{PID} = 16\text{ bits}$, $\text{Control} = 7\text{ bits}$.
- $\text{Frames} = 2^{36 - 13} = 2^{23}$ entries.
- $\text{VPN} = 48 - 13 = 35\text{ bits}$.
- $\text{Pointer} = 23\text{ bits}$.
- $\text{Entry bits} = 16 + 35 + 7 + 23 = 81\text{ bits} \implies 11\text{ bytes}$.
- $\text{Total Size} = 2^{23} \times 11\text{ B} = 8\text{ MB} \times 11 = \mathbf{88\text{ MB}}$.
