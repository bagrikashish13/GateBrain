# Two-Phase Locking (2PL) variants

## TL;DR
All 2PL variants guarantee conflict serializability. Only Conservative 2PL prevents deadlocks. Only Strict and Rigorous 2PL prevent cascading rollbacks. Only Rigorous 2PL guarantees serialization order matches commit order.

## Core idea
- **Basic 2PL:**
  - *Growing phase:* Locks can be acquired, none released.
  - *Shrinking phase:* Locks can be released, none acquired.
  - *Guarantees:* Conflict serializable.
  - *Drawbacks:* Can deadlock; can have cascading rollbacks (dirty reads if shrinking txn aborts).
- **Strict 2PL:**
  - Basic 2PL rule + **Exclusive (X) locks held until commit/abort**.
  - *Guarantees:* Conflict serializable, **Recoverable**, and **Cascadeless** (avoids cascading aborts).
  - *Drawbacks:* Can still deadlock.
- **Rigorous 2PL (Strong Strict 2PL):**
  - **All locks (S and X) held until commit/abort**.
  - *Guarantees:* Conflict serializable, Cascadeless, and **Commit-order serializability** (serialization order matches commit order).
  - *Drawbacks:* Can still deadlock; lowest concurrency.
- **Conservative 2PL (Static 2PL):**
  - All needed locks declared and acquired **before transaction starts execution**.
  - If any lock is unavailable, releases all acquired locks and waits.
  - *Guarantees:* Conflict serializable, **Deadlock-free** (breaks Hold-and-Wait).
  - *Drawbacks:* Hard to know all locks in advance; low concurrency.

## Comparison table
| Variant | Serializability | Deadlock-free? | Cascadeless? | Serialization = Commit order? |
|---|---|---|---|---|
| **Basic** | Yes | No | No | No |
| **Strict** | Yes | No | **Yes** | No |
| **Rigorous** | Yes | No | **Yes** | **Yes** |
| **Conservative** | Yes | **Yes** | If combined with Strict | No |

## Where I got confused → what made it click
- **Deadlock freedom vs Rigorous locking:**
  - *Confusion:* Assuming holding all locks until commit (Rigorous) avoids deadlock.
  - *The click:* Rigorous locks *during* execution; two transactions can still request locks held by each other while running. *Only Conservative* acquires all locks before running, so it never holds and waits.

## GATE traps
- **"2PL is deadlock-free":** False. Standard 2PL easily deadlocks ($T_1$ holds $X$ wants $Y$; $T_2$ holds $Y$ wants $X$). Only Conservative 2PL prevents deadlocks.
- **Commit order matching:** Only Rigorous 2PL ensures transactions are serialized in their commit order. Under Strict 2PL, read locks can be released before commit, altering serialization order.
- **Cascadelessness:** Strict 2PL and Rigorous 2PL guarantee cascadeless schedules because uncommitted dirty writes cannot be read by other transactions.

## Example
**Mock 02 Q8:** Which statements are true?
- $S_1$: Basic 2PL is conflict serializable and deadlock-free $\to$ **False** (can deadlock).
- $S_2$: Strict 2PL holds exclusive locks until commit/abort, guaranteeing recoverable & cascadeless $\to$ **True**.
- $S_3$: Rigorous 2PL holds all locks until commit/abort, guaranteeing serialization order matches commit order $\to$ **True**.
- $S_4$: Conservative 2PL acquires all locks prior to execution, preventing deadlocks $\to$ **True**.
- Result: $S_2, S_3, S_4$ only (Option B).
