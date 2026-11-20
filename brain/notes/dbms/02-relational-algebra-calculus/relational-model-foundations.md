# Relational model foundations

## TL;DR
A relation is a mathematical set of tuples (no duplicates; row and column order do not matter). Degree is the number of attributes; cardinality is the number of tuples. The three-level architecture (physical, logical, external) provides physical and logical data independence, with logical being harder to achieve.

## Core idea
- **Relation, tuple, attribute, domain:** A relation is a table. Each row is a tuple, each column is an attribute, and the set of permissible atomic values for an attribute is its domain.
- **Degree vs Cardinality:**
  - **Degree (arity):** Total number of attributes (columns) in the schema.
  - **Cardinality:** Total number of tuples (rows) in the current instance.
- **Schema vs Instance:**
  - **Schema:** Blueprint/structural definition (fixed/rarely changes).
  - **Instance:** Snapshot of tuples at a given point in time (dynamic).
- **Relational set properties:**
  - No two identical tuples can exist.
  - Row order does not matter.
  - Column (attribute) order does not matter.
  - Every cell contains an **atomic** value (no nested structures).
- **Three-level schema architecture:**
  1. **Physical schema:** Storage paths, file organizations, and indexes.
  2. **Logical schema:** Tables, attributes, integrity constraints, and relationships.
  3. **External schema:** Tailored user views.
- **Data independence:**
  - **Physical data independence:** Modifying physical storage (e.g., adding an index or moving disk tracks) without changing the logical schema.
  - **Logical data independence:** Modifying the logical schema (e.g., adding an attribute or splitting a table) without rewriting external views/applications (substantially harder).

## Where I got confused → what made it click
- **Degree vs Cardinality:**
  - *Confusion:* Swapping degree and cardinality under time pressure.
  - *The click:* Degree = "Dimension of columns" (attributes in schema). Cardinality = "Count of rows" (tuples in instance).
- **Physical vs Logical data independence:**
  - *Confusion:* Forgetting which level of independence is harder.
  - *The click:* Logical is harder because application programs directly interface with logical definitions/views. Physical changes are hidden inside the storage manager.

## GATE traps
- **Duplicate rows:** Pure relational model forbids duplicate tuples; SQL tables permit them unless constrained. GATE relational model questions strictly treat relations as mathematical sets.
- **Matching three levels to components (GATE 2026):**
  - Logical $\rightarrow$ Relations.
  - Physical $\rightarrow$ File organization and indexes.
  - External $\rightarrow$ Views.

## Example
**GATE CSE 2023 (1-mark):**  
Which one refers to the degree (arity) of a relation?  
$\rightarrow$ Number of attributes of its relation schema.

**GATE CSE 2026 Set 2 (1-mark):**  
Match schemas to concepts:  
- Logical schema $\rightarrow$ Relations  
- Physical schema $\rightarrow$ File organization and indexes  
- External schema $\rightarrow$ Views
