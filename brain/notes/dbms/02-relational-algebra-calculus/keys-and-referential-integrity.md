# Keys and referential integrity

## TL;DR
A superkey is any superset containing at least one candidate key. A candidate key is minimal; prime attributes belong to at least one candidate key. Foreign keys enforce referential integrity: insertions into child and deletions from parent can violate it, while deletions from child and insertions into parent never do.

## Core idea
- **Superkey vs Candidate key vs Primary key:**
  - **Superkey:** Any attribute set that uniquely identifies a tuple. $S$ is a superkey $\iff \exists$ candidate key $K \subseteq S$.
  - **Candidate key:** A minimal superkey (no proper subset is a superkey).
  - **Primary key:** The candidate key designated by the DBA/designer.
  - **Prime attribute:** Any attribute that belongs to *at least one* candidate key.
- **Instance vs Schema rules for keys:**
  - An instance with duplicate values for $X$ strictly **disproves** that $X$ is a key.
  - An instance with all distinct values for $X$ **cannot prove** that $X$ is a key (future valid inserts might duplicate). Keys come only from domain semantics.
- **Counting superkeys:**
  - Single candidate key of size $k$ out of $n$ attributes: $2^{n - k}$.
  - Two candidate keys $K_1, K_2$: By Inclusion–Exclusion:
    $$\text{Total} = 2^{n - |K_1|} + 2^{n - |K_2|} - 2^{n - |K_1 \cup K_2|}$$
- **Foreign keys & referential integrity:**
  - References the primary key (or unique key) of the referenced (parent) relation.
  - Foreign key attributes **can be NULL** (unless explicitly marked NOT NULL). Primary key attributes **can never be NULL** (entity integrity).
  - A relation can have **multiple foreign keys** and can have a **self-referencing foreign key** (e.g., manager referencing employee in the same table).
- **Integrity violations on modifications:**
  - **Never violates:** Inserting into parent, Deleting from child.
  - **Can violate:** Inserting into child (invalid FK), Deleting from parent (orphaned FK), Updating parent PK, Updating child FK.
- **ON DELETE actions on parent delete:**
  - **REJECT / RESTRICT (default):** Prevents deletion of the parent if any child references it.
  - **CASCADE:** Deletes the parent and automatically deletes all referencing child tuples (and cascades recursively).
  - **SET NULL:** Sets the child's FK attributes to NULL (no child rows are deleted!).

## Where I got confused → what made it click
- **Why insert into parent & delete from child never violate:**
  - *Confusion:* Getting mixed up about which direction causes orphan records.
  - *The click:* A child tuple needs a parent to exist. Removing a child or adding a parent never creates an orphan child.
- **Multiple candidate keys and prime attributes:**
  - *Confusion:* Thinking prime attributes must appear in *all* candidate keys.
  - *The click:* A prime attribute only needs to belong to *some* (at least one) candidate key.

## GATE traps
- **ON DELETE SET NULL vs CASCADE (GATE 2017):**
  - If parent row is deleted and the child foreign key has `ON DELETE SET NULL`, the child row is NOT deleted — its FK column simply becomes NULL. It does not trigger further cascading deletes on that child!
- **Foreign key misconceptions (GATE 2021):**
  - "A table can have at most one foreign key" is FALSE.
  - "A foreign key cannot reference the same table" is FALSE (self-referential FK is completely valid).
- **Candidate keys and instance data:**
  - A table snapshot having distinct values for a column does NOT make it a candidate key.

## Example
**GATE CSE 2026 Set 1:**  
$R(A, B, C, D)$ with candidate keys $\{A, B\}$ and $\{A, C\}$. Total superkeys:  
$|S(AB)| + |S(AC)| - |S(ABC)| = 2^{4-2} + 2^{4-2} - 2^{4-3} = 4 + 4 - 2 = 6$.

**GATE CSE 2005:**  
Self-referencing table $T(A, C)$ with $A$ as PK and $C$ as FK referencing $A$ (`ON DELETE CASCADE`).  
Deleting $(2, 4)$ cascades to $(5, 2)$ and $(7, 2)$, which recursively cascades to $(9, 5)$.
