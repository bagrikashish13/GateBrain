# UNIX Inode structure & disk block accesses

## TL;DR
Pointers per block $P = \frac{\text{Block Size}}{\text{Pointer Size}}$. Assuming the inode is in memory: Direct blocks take 1 disk access, Single indirect take 2, Double indirect take 3, and Triple indirect take 4.

## Core idea
- **Pointers per disk block:**
  $$P = \frac{B}{\text{pointer size}}$$
  Example: For $4\text{ KB}$ blocks and $4\text{ B}$ pointers, $P = \frac{4096}{4} = 1024 = 2^{10}$.
- **Storage capacity by pointer level:**
  - *Direct ($D$ pointers):* $D \times B$
  - *Single indirect ($1$ pointer):* $P \times B$
  - *Double indirect ($1$ pointer):* $P^2 \times B$
  - *Triple indirect ($1$ pointer):* $P^3 \times B$
  - **Max file size:** $(D + P + P^2 + P^3) \times B$.
- **Disk accesses to read byte at logical block $B_i = \lfloor \text{offset} / B \rfloor$ (Inode in memory):**
  | Block Index Range | Addressing Region | Disk Accesses Required |
  |---|---|---|
  | $0 \le B_i < D$ | Direct | **1** (Data block) |
  | $D \le B_i < D + P$ | Single Indirect | **2** (1 Index block + 1 Data block) |
  | $D + P \le B_i < D + P + P^2$ | Double Indirect | **3** (2 Index blocks + 1 Data block) |
  | $B_i \ge D + P + P^2$ | Triple Indirect | **4** (3 Index blocks + 1 Data block) |

## Where I got confused → what made it click
- **Offset to block mapping:**
  - *Confusion:* Getting confused between byte offset and block number.
  - *The click:* Always convert byte offset to block index first: $B_i = \lfloor \text{byte offset} / \text{block size} \rfloor$. Then compare $B_i$ sequentially against cumulative block capacities: Direct ($< D$), Single Indirect ($< D + P$), Double Indirect ($< D + P + P^2$).
- **Double indirect tree structure:**
  - *Confusion:* Wondering how blocks beyond single indirect land in double indirect and why it takes 3 accesses.
  - *The click:* Double indirect is a 2-tier tree: 1 pointer in inode $\to$ Level-1 index block ($P$ pointers) $\to$ Level-2 index blocks ($P$ pointers each) $\to$ $P^2$ data blocks! It holds a massive $P^2$ blocks, and requires 3 disk accesses (Level-1 Index + Level-2 Index + Data block).

## GATE traps
- **Inode in memory vs on disk:** Standard GATE questions assume the inode is already in RAM. If the inode is NOT in memory, add $+1$ disk access to all operations to fetch the inode block.
- **Maximum file size limit:** Two ceilings apply in practice:
  1. The inode architectural limit: $(D + P + P^2 + P^3) \times B$.
  2. The disk pointer addressability limit: $2^{\text{pointer bits}} \times B$.
  The true maximum file size is $\min(\text{inode limit}, \text{addressability limit})$.
- **Units in calculations:** Watch for byte offsets specified in $\text{MB}$ or $\text{KB}$ ($1\text{ MB} = 1024\text{ KB} = 1024 \times 1024\text{ B}$).

## Example
**Mock 02 Q5:** $B = 4\text{ KB}$, pointer $= 4\text{ B} \implies P = 1024$. Inode has 12 direct, 1 single, 1 double, 1 triple.
- **Byte offset $30\text{ KB}$:** Block index $= \lfloor 30 / 4 \rfloor = 7$. Since $7 < 12$ (direct), exactly **1 disk access** is required.
- **Byte offset $20\text{ MB}$:** Block index $= \frac{20 \times 1024}{4} = 5120$.
  - Direct: $0$ to $11$.
  - Single indirect: $12$ to $1035$.
  - Double indirect: $1036$ to $1049611$.
  - Since $1036 \le 5120 \le 1049611$, it is in double indirect $\implies$ exactly **3 disk accesses** are required.
