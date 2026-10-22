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
  - Any comparison with NULL ($A = \text{NULL}$, $A > 10$, $\text{NULL} = \text{NULL}$) $\implies \mathbf{\text{UNKNOWN}}$.
  - Truth table with `UNKNOWN` ($U$):
    - $\text{TRUE AND } U = U$
    - $\text{FALSE AND } U = \text{FALSE}$
    - $\text{TRUE OR } U = \text{TRUE}$
    - $\text{FALSE OR } U = U$
    - $\mathbf{\text{NOT}(U) = U}$
  - **The `WHERE` clause filter:** Discards any row that evaluates to `FALSE` or `UNKNOWN`. Only rows evaluating to `TRUE` survive.
  - **Testing for NULL:** Always use `A IS NULL` or `A IS NOT NULL`. Never use `A = NULL` (always evaluates to `UNKNOWN`).

## Where I got confused → what made it click
- **`COUNT(*)` vs `COUNT(col)`:**
  - *Confusion:* Seeing 6 surviving rows and taking `COUNT(points) = 6`, giving $40 + 6 \times 10 = 100$.
  - *The click:* `COUNT(*)` counts rows; `COUNT(points)` counts only valid numbers. With four NULLs and two numbers, `COUNT(points) = 2`, giving $40 + 20 = 60$.

## GATE traps
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
