# SQL NULL Semantics, Aggregates & Three-Valued Logic (3VL)

## TL;DR
`COUNT(*)` counts all rows; `COUNT(column)` and all other aggregates (`SUM`, `AVG`, `MIN`, `MAX`) strictly ignore NULLs. Comparisons with NULL yield `UNKNOWN`; the `WHERE` clause accepts only `TRUE`, so both $P$ and $\text{NOT}(P)$ discard NULL rows.

## Core idea
- **Aggregates with NULL:**
  - `COUNT(*)`: Returns total row count in the table/group, regardless of NULLs.
  - `COUNT(A)`: Returns the count of **non-NULL** values in column $A$.
  - `SUM(A)`: Sums non-NULL values.
  - `AVG(A)`: Computes $\frac{\text{SUM}(A)}{\text{COUNT}(A)}$, dividing by non-NULL count, NOT total rows.
  - **All-NULL column/group:**
    - `COUNT(A) = 0`
    - `SUM(A) = NULL` (NOT 0!)
    - `AVG(A) = NULL`
    - `MIN(A) = MAX(A) = NULL`

- **Three-Valued Logic (3VL):**
  - Any arithmetic with NULL ($A + \text{NULL}$, $5 \times \text{NULL}$) $\implies \text{NULL}$.
  - Any comparison with NULL ($A = \text{NULL}$, $A > 10$, $\text{NULL} = \text{NULL}$) $\implies \mathbf{\text{UNKNOWN}}$ ($U$).
  - **The Mental Shortcut:** Assign $\text{TRUE} = 1$, $\text{UNKNOWN} = 0.5$, $\text{FALSE} = 0$.
    - $\text{AND} = \min(A, B) \implies \text{TRUE AND } U = \min(1, 0.5) = U$; $\text{FALSE AND } U = \min(0, 0.5) = 0$.
    - $\text{OR} = \max(A, B) \implies \text{TRUE OR } U = \max(1, 0.5) = 1$; $\text{FALSE OR } U = \max(0, 0.5) = U$.
    - $\text{NOT}(A) = 1 - A \implies \mathbf{\text{NOT}(U) = 1 - 0.5 = 0.5} \ (U)$.
  - **The `WHERE` clause filter:** Discards any row that evaluates to `FALSE` or `UNKNOWN`. Only rows evaluating to `TRUE` survive.

- **The `IS` Operator (State Inspector):**
  - `IS` inspects the state of a box, NOT values. It **never returns UNKNOWN** (strictly `TRUE` or `FALSE`).
  - `A IS NULL` / `A IS NOT NULL`: Always use instead of `= NULL` or `!= NULL`.
  - `(expr) IS UNKNOWN` / `IS TRUE` / `IS FALSE`: Tests the outcome of a 3VL expression.
  - `A IS NOT DISTINCT FROM B`: Treats two `NULL`s as equal ($\text{NULL} \text{ IS NOT DISTINCT FROM } \text{NULL} \implies \text{TRUE}$).

- **Subquery Predicates with NULL:**
  - `IN`: Expands with `OR` ($\max$). If at least one element matches, it returns `TRUE`.
  - `NOT IN`: Expands with `AND` ($\min$). If the set contains any `NULL`, it can **never be TRUE** $\implies$ returns 0 rows!
  - `ANY` / `SOME`: `= ANY` is `IN`; `> ANY` means `> MIN(...)`.
  - `ALL`: `<> ALL` is `NOT IN`; `> ALL` means `> MAX(...)`.
  - `EXISTS` / `NOT EXISTS`: Checks row count ($\ge 1$ vs $0$). **Immune to NULLs** and never returns `UNKNOWN`.

## Where I got confused → what made it click
- **`COUNT(*)` vs `COUNT(col)`:**
  - *Confusion:* Seeing 6 surviving rows and taking `COUNT(points) = 6`, giving $40 + 6 \times 10 = 100$.
  - *The click:* `COUNT(*)` counts rows; `COUNT(points)` counts only valid numbers. With four NULLs and two numbers, `COUNT(points) = 2`, giving $40 + 20 = 60$.
- **`= NULL` vs `IS NULL`:**
  - *Confusion:* Writing `WHERE col = NULL` expecting it to match nulls.
  - *The click:* `=` asks for value equality and yields `UNKNOWN`. `IS` inspects state directly and strictly returns `TRUE` or `FALSE`.

## GATE traps
- **The `NOT IN (..., NULL)` Trap:**
  - `WHERE col NOT IN (10, 20, NULL)` always returns **0 rows**, because $(col \neq \text{NULL})$ evaluates to `UNKNOWN`, making the entire `AND` condition either `FALSE` or `UNKNOWN`. Use `NOT EXISTS` instead.
- **Empty Subquery Trap (`ANY` vs `ALL`):**
  - `x > ANY (empty)` evaluates to **`FALSE`** (no witness exists).
  - `x > ALL (empty)` evaluates to **`TRUE`** (vacuously true!).
- **Complementary WHERE queries:**
  - `SELECT COUNT(*) WHERE A > 50` + `SELECT COUNT(*) WHERE NOT(A > 50)` **does NOT equal total rows** if any NULL exists! The NULL rows evaluate to `UNKNOWN` in both and are excluded from both.
- **`COALESCE` vs `NULLIF`:**
  - `COALESCE(x, y)` returns the first non-NULL argument (`COALESCE(NULL, 0) = 0`).
  - `NULLIF(x, y)` returns `NULL` if $x = y$, else returns $x$.

## Example
**GATE Mock 04 Q8:**
- Table `Scores` with 6 surviving rows under `WHERE team = 'Beta' OR points IS NULL`.
- `points` values: $\{ \text{NULL}, \; 15, \; \text{NULL}, \; 25, \; \text{NULL}, \; \text{NULL} \}$.
- $\text{SUM}(\text{COALESCE}(\text{points}, 0)) = 0 + 15 + 0 + 25 + 0 + 0 = 40$.
- $\text{COUNT}(\text{points}) = 2$ (only rows 15 and 25).
- Result $= 40 + 2 \times 10 = \mathbf{60}$.
