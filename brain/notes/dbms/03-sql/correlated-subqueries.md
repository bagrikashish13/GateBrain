# Correlated subqueries

## TL;DR
A correlated subquery executes conceptually once per candidate row from the outer query. Precompute group aggregates by the correlation key (department, category) to instantly filter rows; watch `>=` vs `>` boundaries.

## Core idea
- **Evaluation mechanism:** The inner subquery references columns from the outer row (`E2.dept_name = E1.dept_name`). For each candidate outer row, the subquery produces a scalar value (like group average or max).
- **Optimization shortcut for GATE:** Never recompute the subquery row-by-row:
  1. Prune outer rows using independent filters first (e.g., `dept_name IN ('HR', 'IT')`).
  2. Compute the aggregate for each unique correlation group once (e.g., HR avg = 6000, IT avg = 7000).
  3. Scan the outer rows and filter them directly against their group threshold.
- **Empty subquery result:** If an outer row has no matches in the inner query, aggregate functions like `AVG` return `NULL`. `salary >= NULL` yields `UNKNOWN`, discarding the row.

## Where I got confused → what made it click
- **Stalling on long SQL queries:** Scanning 8 rows row-by-row felt slow and error-prone during the mock.
- **The click:** Group the data mentally by the correlation attribute first! Calculate the threshold per group, then compare outer rows in 10 seconds.

## GATE traps
- **Boundary equality (`>=` vs `>`):** Questions deliberately include values that match the exact average. If `salary >= AVG`, exact matches are included. If `salary > AVG`, exact matches are excluded.
- **`NOT IN` vs `NOT EXISTS` with NULLs:**
  - If a subquery returns any `NULL`, `val NOT IN (subquery)` evaluates to `UNKNOWN` for all outer rows (returns 0 rows).
  - `NOT EXISTS` checks for tuple existence rather than value equality, so it safely handles NULLs.

## Example
**Mock 05 Q10:**
- Table `Employees` with HR $\{4000, 6000, 8000\}$, IT $\{5000, 5000, 11000\}$, Sales $\{7000, 7000\}$.
- Outer filter `dept_name IN ('HR', 'IT')` discards Sales.
- Group thresholds:
  - $\text{AVG}(\text{HR}) = \frac{18000}{3} = 6000$
  - $\text{AVG}(\text{IT}) = \frac{21000}{3} = 7000$
- Condition `salary >= AVG`:
  - HR: 102 (6000) and 103 (8000) qualify.
  - IT: 106 (11000) qualifies.
- Final `SUM(salary)` $= 6000 + 8000 + 11000 = \mathbf{25000}$.
