---
title: DBMS · Queries Master Mock
duration: 60
created: 2026-10-26
description: Comprehensive mock test covering Relational Algebra, TRC, DRC, SQL, 3VL, division, joins, and aggregates.
---

## Q1
type: MCQ
marks: 1
subject: dbms
topic: relational-algebra-calculus
answer: A

Let $R(A, B)$ and $S(B, C)$ be two relations. Consider three statements regarding relational algebra expressions:
I. $\sigma_{A = 10 \wedge C = 20}(R \bowtie S) \equiv \sigma_{A = 10}(R) \bowtie \sigma_{C = 20}(S)$
II. $\pi_{A}(R - S') \equiv \pi_A(R) - \pi_A(S')$, where $S'(A, B)$ is union-compatible with $R(A, B)$.
III. $\pi_{A, B}(R \bowtie S) \equiv R \ltimes S$

Which of the above statements is/are ALWAYS TRUE for arbitrary relation instances?

(A) I and III only
(B) I and II only
(C) III only
(D) I, II, and III

### Solution
Let us analyze each statement individually:

1. **Statement I is TRUE**:
   The selection condition is a conjunction of two independent predicates: $A = 10$ (which depends solely on attributes of $R$) and $C = 20$ (which depends solely on attributes of $S$). By the selection pushdown equivalence of relational algebra:
   $$\sigma_{c_1 \wedge c_2}(R \bowtie S) \equiv \sigma_{c_1}(R) \bowtie \sigma_{c_2}(S)$$
   when $c_1$ involves only attributes of $R$ and $c_2$ involves only attributes of $S$.

2. **Statement II is FALSE**:
   Projection does **not** distribute over set difference in general.
   **Counterexample:**
   Let $R = \{(1, 2), (1, 3)\}$ and $S' = \{(1, 2)\}$.
   Then $R - S' = \{(1, 3)\}$.
   Projecting on attribute $A$: $\pi_A(R - S') = \{1\}$.
   Now evaluate the right-hand side:
   $\pi_A(R) = \{1\}$ and $\pi_A(S') = \{1\}$.
   Then $\pi_A(R) - \pi_A(S') = \{1\} - \{1\} = \emptyset \neq \{1\}$.
   In general, $\pi_L(R - S') \supseteq \pi_L(R) - \pi_L(S')$, but equality is not guaranteed.

3. **Statement III is TRUE**:
   By definition of the semi-join operator:
   $$R \ltimes S = \pi_{\text{attrs}(R)}(R \bowtie S)$$
   Since the attribute set of $R$ is $\{A, B\}$, we have:
   $$\pi_{A, B}(R \bowtie S) \equiv R \ltimes S$$

Therefore, statements I and III are always true, while statement II is false. The correct option is (A).

## Q2
type: MCQ
marks: 1
subject: dbms
topic: sql
answer: A

Consider a relational table `Sample(val INT)` populated with the following 3 rows:
`{5, 15, NULL}`.

Consider three SQL queries:
```sql
-- Query 1
SELECT * FROM Sample WHERE val = 15 OR val <> 15;

-- Query 2
SELECT * FROM Sample WHERE NOT (val = NULL);

-- Query 3
SELECT * FROM Sample WHERE (val IS NULL) OR (val > 10 AND NULL = NULL);
```

Let $n_1, n_2,$ and $n_3$ denote the number of rows returned by Query 1, Query 2, and Query 3 respectively. What is the ordered tuple $(n_1, n_2, n_3)$?

(A) (2, 0, 1)
(B) (3, 3, 2)
(C) (2, 0, 2)
(D) (3, 0, 1)

### Solution
Let us trace the three-valued logic (3VL) evaluation for each query row by row:

1. **Query 1: `WHERE val = 15 OR val <> 15`**:
   - For `val = 5`: $5 = 15$ is `FALSE`; $5 \neq 15$ is `TRUE`. `FALSE OR TRUE` $\to$ `TRUE`. (Row included).
   - For `val = 15`: $15 = 15$ is `TRUE`. `TRUE OR FALSE` $\to$ `TRUE`. (Row included).
   - For `val = NULL`: $\text{NULL} = 15$ is `UNKNOWN`; $\text{NULL} \neq 15$ is `UNKNOWN`. In 3VL:
     $$\text{UNKNOWN OR UNKNOWN} = \text{UNKNOWN}$$
     A `WHERE` clause accepts only rows evaluating to `TRUE`. Rows evaluating to `FALSE` or `UNKNOWN` are eliminated.
   Therefore, Query 1 returns 2 rows ($n_1 = 2$).

2. **Query 2: `WHERE NOT (val = NULL)`**:
   In SQL, comparison with a literal `NULL` via `=` always evaluates to `UNKNOWN` (never `TRUE` or `FALSE`):
   - For all three rows, `val = NULL` evaluates to `UNKNOWN`.
   - $\text{NOT}(\text{UNKNOWN}) = \text{UNKNOWN}$.
   None of the rows evaluate to `TRUE`.
   Therefore, Query 2 returns 0 rows ($n_2 = 0$).

3. **Query 3: `WHERE (val IS NULL) OR (val > 10 AND NULL = NULL)`**:
   Note that `NULL = NULL` evaluates to `UNKNOWN`.
   - For `val = 5`:
     - `5 IS NULL` is `FALSE`.
     - `5 > 10` is `FALSE`.
     - $\text{FALSE AND (NULL = NULL)} = \text{FALSE AND UNKNOWN} = \text{FALSE}$.
     - $\text{FALSE OR FALSE} = \text{FALSE}$. (Eliminated).
   - For `val = 15`:
     - `15 IS NULL` is `FALSE`.
     - `15 > 10` is `TRUE`.
     - $\text{TRUE AND (NULL = NULL)} = \text{TRUE AND UNKNOWN} = \text{UNKNOWN}$.
     - $\text{FALSE OR UNKNOWN} = \text{UNKNOWN}$. (Eliminated).
   - For `val = NULL`:
     - `NULL IS NULL` is `TRUE`.
     - Since the left side of `OR` is `TRUE`, `TRUE OR anything` $\to$ `TRUE`. (Row included).
   Therefore, Query 3 returns 1 row ($n_3 = 1$).

Hence, $(n_1, n_2, n_3) = (2, 0, 1)$. The correct option is (A).

## Q3
type: MCQ
marks: 1
subject: dbms
topic: relational-algebra-calculus
answer: A

Which of the following queries CANNOT be expressed in standard basic Relational Algebra (using only selection $\sigma$, projection $\pi$, Cartesian product $\times$, union $\cup$, and set difference $-$)?

I. Finding the manager of the manager of an employee from an `Employee(emp_id, manager_id)` relation.
II. Finding all students who registered for every course offered in semester S1.
III. Finding all pairs of nodes $(u, v)$ such that there exists a directed path of arbitrary length from $u$ to $v$ in a graph represented by relation `Edge(src, dest)`.
IV. Finding the names of employees with the lowest salary from an `Employee(emp_name, salary)` relation.

(A) III only
(B) II and III only
(C) III and IV only
(D) I, II, and III only

### Solution
Let us analyze the expressive power of standard basic Relational Algebra:

- **Query I is expressible**:
  A chain of 2 levels of managers can be found by joining `Employee` with itself using a self-join:
  $$\pi_{E_1.\text{emp\_id}, E_3.\text{emp\_id}}(E_1 \bowtie_{E_1.\text{manager\_id} = E_2.\text{emp\_id}} E_2 \bowtie_{E_2.\text{manager\_id} = E_3.\text{emp\_id}} E_3)$$

- **Query II is expressible**:
  This is universal quantification, which is directly expressed via the relational division operator:
  $$\text{Enrollment} \div \sigma_{\text{semester} = 'S1'}(\text{Courses})$$
  Relational division is fully expressible using basic projection, Cartesian product, and set difference.

- **Query III is INEXPRESSIBLE**:
  Computing reachability between two nodes over paths of arbitrary, unbounded length is equivalent to computing the **transitive closure** of the `Edge` relation. It is a proven mathematical limitation that standard relational algebra (first-order logic) cannot express transitive closure because it lacks recursion / fixed-point operators.

- **Query IV is expressible**:
  Employees with the lowest salary can be found without aggregate functions by finding all employees except those whose salary is strictly greater than someone else's:
  $$\pi_{\text{emp\_name}}(Employee) - \pi_{E_1.\text{emp\_name}}(\sigma_{E_1.\text{salary} > E_2.\text{salary}}(E_1 \times E_2))$$

Therefore, only Query III cannot be expressed. The correct option is (A).

## Q4
type: NAT
marks: 1
subject: dbms
topic: sql
answer: 5332

Consider the relational table `Transaction(txn_id INT, amount INT, fee INT)` containing 5 rows:

| txn_id | amount | fee |
| :--- | :--- | :--- |
| 1 | 100 | 10 |
| 2 | 200 | NULL |
| 3 | NULL | 15 |
| 4 | NULL | NULL |
| 5 | 300 | 25 |

Consider the following SQL query:
```sql
SELECT 
    COUNT(*) * 1000 + 
    COUNT(amount) * 100 + 
    COUNT(fee) * 10 + 
    COUNT(amount + fee)
FROM Transaction;
```

What integer value is returned by this query?

### Solution
Let us evaluate each term of the `SELECT` expression according to SQL standard aggregation rules:

1. **`COUNT(*)`**:
   Counts all rows in the relation, regardless of whether individual columns contain NULLs:
   $$\text{COUNT}(*) = 5$$

2. **`COUNT(amount)`**:
   Counts only rows where `amount IS NOT NULL`:
   - Row 1: 100 (non-null)
   - Row 2: 200 (non-null)
   - Row 3: NULL
   - Row 4: NULL
   - Row 5: 300 (non-null)
   $$\text{COUNT}(\text{amount}) = 3$$

3. **`COUNT(fee)`**:
   Counts only rows where `fee IS NOT NULL`:
   - Row 1: 10 (non-null)
   - Row 2: NULL
   - Row 3: 15 (non-null)
   - Row 4: NULL
   - Row 5: 25 (non-null)
   $$\text{COUNT}(\text{fee}) = 3$$

4. **`COUNT(amount + fee)`**:
   In SQL arithmetic, adding `NULL` to any value yields `NULL`:
   - Row 1: $100 + 10 = 110$ (non-null)
   - Row 2: $200 + \text{NULL} = \text{NULL}$
   - Row 3: $\text{NULL} + 15 = \text{NULL}$
   - Row 4: $\text{NULL} + \text{NULL} = \text{NULL}$
   - Row 5: $300 + 25 = 325$ (non-null)
   The expression `amount + fee` evaluates to `{110, NULL, NULL, NULL, 325}`.
   `COUNT(amount + fee)` counts only non-null values:
   $$\text{COUNT}(\text{amount} + \text{fee}) = 2$$

Now calculate the total formula:
$$\text{Total} = 5 \times 1000 + 3 \times 100 + 3 \times 10 + 2 = 5000 + 300 + 30 + 2 = 5332$$

The correct integer value is 5332.

## Q5
type: MCQ
marks: 1
subject: dbms
topic: relational-algebra-calculus
answer: A

In Tuple Relational Calculus (TRC), an expression is called **safe** if all tuples in its result are guaranteed to come from the active domain of the database (values occurring in database relations or constants in the query), ensuring the result is always finite.

Let $R(A)$ and $S(A)$ be two non-empty relations where attribute $A$ has domain $\text{dom}(A) = \text{all integers}$.
Consider the following four TRC expressions:
1. $\{ t \mid \neg (t \in R) \}$
2. $\{ t \mid t \in R \vee t \in S \}$
3. $\{ t \mid t \in R \wedge \neg (t \in S) \}$
4. $\{ t \mid t \in R \vee \neg (t \in S) \}$

Which of the above expressions are **guaranteed to be SAFE**?

(A) 2 and 3 only
(B) 1, 2, and 3 only
(C) 2, 3, and 4 only
(D) 3 only

### Solution
Let us evaluate each expression against the safety criteria of Relational Calculus:

1. **Expression 1: $\{ t \mid \neg (t \in R) \}$**:
   This expression evaluates to all possible integer tuples that are NOT in $R$. Since $\text{dom}(A)$ is the set of all integers and $R$ is finite, this result contains infinitely many tuples outside the active domain of the database. Hence, it is **UNSAFE**.

2. **Expression 2: $\{ t \mid t \in R \vee t \in S \}$**:
   For any tuple $t$ to belong to the result, $t$ must belong to $R$ or belong to $S$. Because both $R$ and $S$ are finite database instances, every component of $t$ is drawn directly from $\text{dom}(R) \cup \text{dom}(S)$. This corresponds directly to $R \cup S$. Hence, it is **SAFE**.

3. **Expression 3: $\{ t \mid t \in R \wedge \neg (t \in S) \}$**:
   For any tuple $t$ to belong to the result, $t$ must satisfy $t \in R$. Even though there is a negation $\neg (t \in S)$, the conjunct $t \in R$ acts as a guard that bounds every tuple to the finite active domain of $R$. This corresponds directly to $R - S$. Hence, it is **SAFE**.

4. **Expression 4: $\{ t \mid t \in R \vee \neg (t \in S) \}$**:
   A tuple $t$ can satisfy this expression by satisfying $\neg(t \in S)$, even if $t \notin R$. Any integer that does not appear in $S$ will satisfy the condition, producing infinitely many tuples. Hence, it is **UNSAFE**.

Therefore, expressions 2 and 3 are safe, while 1 and 4 are unsafe. The correct option is (A).

## Q6
type: NAT
marks: 1
subject: dbms
topic: relational-algebra-calculus
answer: 154

Consider two relations $R(A, B)$ and $S(B, C)$ where:
- $R$ contains 45 tuples.
- $S$ contains 20 tuples.
- Attribute $B$ in relation $S$ is the primary key of $S$.
- Attribute $B$ in relation $R$ is a foreign key referencing $S(B)$, and $B$ in $R$ CANNOT be NULL (referential integrity with non-null foreign key).

Let:
- $N_1$ be the maximum possible number of tuples in the natural join $R \bowtie S$.
- $N_2$ be the minimum possible number of tuples in the natural join $R \bowtie S$.
- $N_3$ be the maximum possible number of tuples in the full outer join $R \text{ FULL OUTER JOIN } S$.

What is the value of $N_1 + N_2 + N_3$?

### Solution
Let us analyze the cardinality constraints imposed by the primary key and foreign key:

1. **Natural Join Cardinality ($N_1$ and $N_2$)**:
   - Attribute $B$ in $S$ is a primary key, meaning each value of $B$ appears at most once in $S$.
   - Attribute $B$ in $R$ is a foreign key referencing $S(B)$, and cannot be NULL.
   - Therefore, for every single tuple $r \in R$, there exists **exactly one** matching tuple $s \in S$ with $s.B = r.B$.
   - A tuple in $R$ cannot match more than 1 tuple in $S$ (because $B$ is unique in $S$).
   - A tuple in $R$ cannot fail to match a tuple in $S$ (because of foreign key referential integrity and NOT NULL constraint).
   - Hence, every tuple in $R$ joins with exactly one tuple in $S$, producing exactly 1 join tuple.
   - Therefore, the natural join $R \bowtie S$ **always** has exactly 45 tuples, regardless of data distribution:
     $$N_1 = 45, \quad N_2 = 45$$

2. **Full Outer Join Maximum Cardinality ($N_3$)**:
   A Full Outer Join retains all matched tuples plus all unmatched tuples from $R$ and all unmatched tuples from $S$:
   $$|R \text{ FULL OUTER JOIN } S| = |R \bowtie S| + (\text{unmatched } R) + (\text{unmatched } S)$$
   - From step 1, every tuple of $R$ matches, so $(\text{unmatched } R) = 0$.
   - Matched tuples $= 45$.
   - To maximize unmatched tuples from $S$, we must minimize the number of distinct $B$ values referenced by $R$.
   - Since $R$ has 45 tuples, all 45 tuples of $R$ could potentially reference the **same single key value** in $S$.
   - In that scenario, only 1 tuple of $S$ participates in matches, leaving $20 - 1 = 19$ tuples of $S$ completely unmatched.
   - These 19 unmatched tuples of $S$ are preserved in the Full Outer Join, padded with NULLs for attributes of $R$.
   - Thus, the maximum tuples in Full Outer Join is:
     $$N_3 = 45 + 0 + 19 = 64$$

3. **Sum $N_1 + N_2 + N_3$**:
   $$N_1 + N_2 + N_3 = 45 + 45 + 64 = 154$$

The correct integer value is 154.

## Q7
type: MCQ
marks: 1
subject: dbms
topic: sql
answer: A

Consider a relation `Employee(emp_id, emp_name, dept_id, salary)`.
A developer attempts to write SQL queries to find the `dept_id` and average salary of departments having an average salary greater than 50000.

Consider the following four SQL queries:
```sql
-- Query 1
SELECT dept_id, AVG(salary) AS avg_sal
FROM Employee
WHERE avg_sal > 50000
GROUP BY dept_id;

-- Query 2
SELECT dept_id, AVG(salary) AS avg_sal
FROM Employee
GROUP BY dept_id
HAVING avg_sal > 50000;

-- Query 3
SELECT dept_id, AVG(salary)
FROM Employee
GROUP BY dept_id
HAVING AVG(salary) > 50000;

-- Query 4
SELECT dept_id, emp_name, AVG(salary)
FROM Employee
GROUP BY dept_id
HAVING AVG(salary) > 50000;
```

According to standard ANSI SQL, which query is syntactically valid and correctly accomplishes the task?

(A) Query 3 only
(B) Query 2 and Query 3 only
(C) Query 1, Query 2, and Query 3
(D) Query 3 and Query 4 only

### Solution
Let us inspect the standard SQL execution pipeline:
$$\text{FROM} \longrightarrow \text{WHERE} \longrightarrow \text{GROUP BY} \longrightarrow \text{HAVING} \longrightarrow \text{SELECT} \longrightarrow \text{ORDER BY}$$

- **Query 1 is invalid**:
  `WHERE` executes before `GROUP BY` and `SELECT`. At the time `WHERE` executes:
  1. The column alias `avg_sal` does not yet exist.
  2. Aggregate functions cannot appear in the `WHERE` clause because groups have not been formed yet.

- **Query 2 is invalid in standard ANSI SQL**:
  In standard ANSI SQL, `HAVING` is logically evaluated before `SELECT`. Therefore, column aliases defined in the `SELECT` list (such as `avg_sal`) are not in scope in the `HAVING` clause. (While some proprietary database extensions allow alias resolution in `HAVING`, standard SQL strictly forbids it).

- **Query 3 is valid and correct**:
  It groups rows by `dept_id`, uses `HAVING AVG(salary) > 50000` to filter groups after aggregation, and selects `dept_id` and `AVG(salary)`.

- **Query 4 is invalid**:
  `emp_name` appears in the `SELECT` list, but is neither specified in the `GROUP BY` clause nor enclosed within an aggregate function. Since a department can contain multiple employees with distinct names, standard SQL rejects this query as ambiguous.

Therefore, only Query 3 is valid and correct according to standard SQL. The correct option is (A).

## Q8
type: MCQ
marks: 1
subject: dbms
topic: sql
answer: A

Consider two tables $P(x)$ and $Q(y)$, where:
- Table $P$ has 3 rows: $\{10, 20, 30\}$.
- Table $Q$ is currently **empty** (contains 0 rows).

Consider three SQL queries:
```sql
-- Query 1
SELECT x FROM P WHERE x > ALL (SELECT y FROM Q);

-- Query 2
SELECT x FROM P WHERE x > ANY (SELECT y FROM Q);

-- Query 3
SELECT x FROM P WHERE x NOT IN (SELECT y FROM Q);
```

How many rows are returned by Query 1, Query 2, and Query 3 respectively?

(A) 3, 0, 3
(B) 0, 0, 0
(C) 3, 3, 3
(D) 0, 3, 0

### Solution
Let us evaluate each quantified comparison operator when the subquery returns an empty set:

1. **Query 1: `WHERE x > ALL (SELECT y FROM Q)`**:
   The `ALL` predicate tests whether $x > y$ holds for every element $y \in Q$:
   $$\forall y \in Q \, (x > y)$$
   When $Q$ is empty ($Q = \emptyset$), universal quantification over the empty set is **vacuously TRUE**. There is no element in $Q$ that violates the condition $x > y$.
   Therefore, the condition evaluates to `TRUE` for all 3 rows of $P$.
   Query 1 returns 3 rows.

2. **Query 2: `WHERE x > ANY (SELECT y FROM Q)`**:
   The `ANY` (or `SOME`) predicate tests whether there exists at least one element $y \in Q$ such that $x > y$:
   $$\exists y \in Q \, (x > y)$$
   When $Q$ is empty, no such element exists. Existential quantification over the empty set is **FALSE**.
   Therefore, the condition evaluates to `FALSE` for all rows.
   Query 2 returns 0 rows.

3. **Query 3: `WHERE x NOT IN (SELECT y FROM Q)`**:
   The expression `x IN (empty_set)` evaluates to `FALSE` (since $x = y$ is false for all $y \in \emptyset$).
   Therefore, `x NOT IN (empty_set)` is equivalent to $\text{NOT}(\text{FALSE}) = \text{TRUE}$.
   Thus, the condition evaluates to `TRUE` for all 3 rows of $P$.
   Query 3 returns 3 rows.

Hence, the number of rows returned is 3, 0, and 3 respectively. The correct option is (A).

## Q9
type: MCQ
marks: 2
subject: dbms
topic: sql
answer: A

Consider the following two relational tables `Student` and `Scholarship`:

Table `Student`:
| sid | sname |
| :--- | :--- |
| 1 | Alice |
| 2 | Bob |
| 3 | Charlie |
| 4 | David |

Table `Scholarship`:
| sch_id | sid |
| :--- | :--- |
| 101 | 1 |
| 102 | 2 |
| 103 | NULL |

Consider two SQL queries intended to find students who do NOT hold any scholarship:
```sql
-- Query A
SELECT sname
FROM Student
WHERE sid NOT IN (SELECT sid FROM Scholarship);

-- Query B
SELECT sname
FROM Student S
WHERE NOT EXISTS (
    SELECT 1 
    FROM Scholarship SC 
    WHERE SC.sid = S.sid
);
```

Let $R_A$ be the result set returned by Query A, and $R_B$ be the result set returned by Query B. Which of the following statements is TRUE?

(A) $R_A = \emptyset$ (empty), while $R_B = \{\text{Charlie}, \text{David}\}$
(B) $R_A = \{\text{Charlie}, \text{David}\}$ and $R_B = \{\text{Charlie}, \text{David}\}$
(C) $R_A = \{\text{Charlie}, \text{David}\}$, while $R_B = \emptyset$ (empty)
(D) Both $R_A$ and $R_B$ are empty

### Solution
This question highlights the classic and critical **`NOT IN` with NULL** trap in SQL.

1. **Evaluation of Query A (`NOT IN`)**:
   The subquery `(SELECT sid FROM Scholarship)` produces the multiset:
   $$\{1, 2, \text{NULL}\}$$
   By definition, `sid NOT IN (1, 2, NULL)` expands logically into:
   $$(\text{sid} \neq 1) \text{ AND } (\text{sid} \neq 2) \text{ AND } (\text{sid} \neq \text{NULL})$$
   Now trace for each student:
   - For `sid = 1`: $(1 \neq 1)$ is `FALSE`. `FALSE AND ...` evaluates to `FALSE`.
   - For `sid = 2`: $(2 \neq 2)$ is `FALSE`. `FALSE AND ...` evaluates to `FALSE`.
   - For `sid = 3`:
     $$(3 \neq 1) \text{ is } \text{TRUE}$$
     $$(3 \neq 2) \text{ is } \text{TRUE}$$
     $$(3 \neq \text{NULL}) \text{ is } \textbf{UNKNOWN}$$
     $$\text{TRUE AND TRUE AND UNKNOWN} = \textbf{UNKNOWN}$$
     Since the `WHERE` clause discards any row evaluating to `UNKNOWN`, Charlie is **NOT** returned!
   - For `sid = 4`:
     $$(4 \neq 1) \text{ AND } (4 \neq 2) \text{ AND } (4 \neq \text{NULL}) = \text{TRUE AND TRUE AND UNKNOWN} = \textbf{UNKNOWN}$$
     David is also **NOT** returned!
   Consequently, Query A returns **zero rows**:
   $$R_A = \emptyset$$

2. **Evaluation of Query B (`NOT EXISTS`)**:
   `NOT EXISTS` tests whether the correlated subquery returns zero rows.
   - For `sid = 1`: `SC.sid = 1` matches tuple `(101, 1)`. Subquery produces 1 row. `NOT EXISTS` is `FALSE`.
   - For `sid = 2`: `SC.sid = 2` matches tuple `(102, 2)`. Subquery produces 1 row. `NOT EXISTS` is `FALSE`.
   - For `sid = 3`: The condition `SC.sid = 3` is tested against all rows of `Scholarship`:
     - $1 = 3 \to \text{FALSE}$
     - $2 = 3 \to \text{FALSE}$
     - $\text{NULL} = 3 \to \text{UNKNOWN}$
     The subquery `WHERE` clause filters out `UNKNOWN`. Hence, the subquery produces **0 rows**.
     Therefore, `NOT EXISTS` evaluates to **`TRUE`**. Charlie is included!
   - For `sid = 4`: Similarly, subquery produces 0 rows. `NOT EXISTS` evaluates to **`TRUE`**. David is included!
   Consequently, Query B correctly returns:
   $$R_B = \{\text{Charlie}, \text{David}\}$$

Hence, $R_A = \emptyset$ while $R_B = \{\text{Charlie}, \text{David}\}$. The correct option is (A).

## Q10
type: NAT
marks: 2
subject: dbms
topic: sql
answer: 150

Consider the relational table `Sales` with 8 rows:

| region | item | quantity |
| :--- | :--- | :--- |
| North | Pen | 10 |
| North | Book | 20 |
| North | Book | NULL |
| South | Pen | 15 |
| South | NULL | 25 |
| NULL | Book | 30 |
| NULL | Book | 40 |
| NULL | Pen | NULL |

Consider the following SQL query:
```sql
SELECT 
    region, 
    COUNT(*) AS c_all, 
    COUNT(quantity) AS c_qty, 
    SUM(COALESCE(quantity, 5)) AS total_qty
FROM Sales
GROUP BY region
HAVING COUNT(*) >= 2;
```

What is the sum of `total_qty` across all rows returned by this query?

### Solution
Let us trace the grouping, aggregate evaluation, and `HAVING` filtering step by step:

1. **How `GROUP BY` treats NULLs**:
   In SQL standard, all NULL values in a grouping attribute are treated as equal and placed into a **single group**.
   Thus, the table is divided into three distinct groups for `region`:
   - Group 1: `region = 'North'`
   - Group 2: `region = 'South'`
   - Group 3: `region IS NULL`

2. **Evaluate aggregates for each group**:
   - **Group 'North'**:
     Rows:
     1. `('North', 'Pen', 10)`
     2. `('North', 'Book', 20)`
     3. `('North', 'Book', NULL)`
     - `COUNT(*)` = 3
     - `COUNT(quantity)` = 2 (rows 1 and 2)
     - `COALESCE(quantity, 5)` values:
       - Row 1: 10
       - Row 2: 20
       - Row 3: 5 (since quantity is NULL)
       - $\text{total\_qty} = 10 + 20 + 5 = 35$

   - **Group 'South'**:
     Rows:
     4. `('South', 'Pen', 15)`
     5. `('South', NULL, 25)`
     - `COUNT(*)` = 2
     - `COUNT(quantity)` = 2
     - `COALESCE(quantity, 5)` values:
       - Row 4: 15
       - Row 5: 25
       - $\text{total\_qty} = 15 + 25 = 40$

   - **Group NULL**:
     Rows:
     6. `(NULL, 'Book', 30)`
     7. `(NULL, 'Book', 40)`
     8. `(NULL, 'Pen', NULL)`
     - `COUNT(*)` = 3
     - `COUNT(quantity)` = 2 (rows 6 and 7)
     - `COALESCE(quantity, 5)` values:
       - Row 6: 30
       - Row 7: 40
       - Row 8: 5 (since quantity is NULL)
       - $\text{total\_qty} = 30 + 40 + 5 = 75$

3. **Filter groups via `HAVING COUNT(*) >= 2`**:
   - Group 'North': `COUNT(*)` = 3 $\ge$ 2 $\implies$ **Passed** (`total_qty` = 35)
   - Group 'South': `COUNT(*)` = 2 $\ge$ 2 $\implies$ **Passed** (`total_qty` = 40)
   - Group NULL: `COUNT(*)` = 3 $\ge$ 2 $\implies$ **Passed** (`total_qty` = 75)

All three groups satisfy the `HAVING` condition.
Now sum the `total_qty` values across the returned rows:
$$\text{Sum} = 35 + 40 + 75 = 150$$

The correct integer value is 150.

## Q11
type: MSQ
marks: 2
subject: dbms
topic: relational-algebra-calculus
answer: A, B, C

Let $R(A, B)$ and $S(B)$ be two non-empty relations without NULL values.
The relational division $R \div S$ is defined to find all values of $A$ in $R$ that are associated with **every** value of $B$ in $S$.

Which of the following expressions is/are ALWAYS EQUIVALENT to $R \div S$?

(A) $\pi_A(R) - \pi_A((\pi_A(R) \times S) - R)$
(B) $\{ \langle a \rangle \mid \exists b_1 (\langle a, b_1 \rangle \in R) \wedge \forall b_2 ( \langle b_2 \rangle \in S \implies \langle a, b_2 \rangle \in R ) \}$
(C) $\{ \langle a \rangle \mid \exists b_1 (\langle a, b_1 \rangle \in R) \wedge \neg \exists b_2 ( \langle b_2 \rangle \in S \wedge \langle a, b_2 \rangle \notin R ) \}$
(D) $\{ \langle a \rangle \mid \exists b_1 (\langle a, b_1 \rangle \in R) \wedge \forall b_2 ( \langle a, b_2 \rangle \in R \implies \langle b_2 \rangle \in S ) \}$

### Solution
Let us analyze each relational expression:

1. **Option (A) is TRUE**:
   This is the canonical algebraic formulation of the division operator:
   - $\pi_A(R) \times S$: contains all possible pairs $\langle a, b \rangle$ where $a \in \pi_A(R)$ and $b \in S$.
   - $(\pi_A(R) \times S) - R$: contains all candidate pairs that **do not appear** in $R$ (the "disqualifying" pairs).
   - $\pi_A((\pi_A(R) \times S) - R)$: extracts all values of $A$ that fail to match at least one $B \in S$.
   - Subtracting this disqualifying set from $\pi_A(R)$ leaves precisely those $A$ values that are associated with **every** $B \in S$.

2. **Option (B) is TRUE**:
   In Domain Relational Calculus (DRC):
   - $\exists b_1 (\langle a, b_1 \rangle \in R)$ ensures domain independence (safety) by bounding $a$ to the active domain of $R$.
   - $\forall b_2 (\langle b_2 \rangle \in S \implies \langle a, b_2 \rangle \in R)$ states that for every $b_2$, if $b_2$ belongs to $S$, then the tuple $\langle a, b_2 \rangle$ must be present in $R$. This is the exact definition of universal quantification required for division.

3. **Option (C) is TRUE**:
   Using standard first-order logic quantifier transformation:
   $$\forall x (P(x) \implies Q(x)) \equiv \neg \exists x \neg (P(x) \implies Q(x)) \equiv \neg \exists x (P(x) \wedge \neg Q(x))$$
   Applying this identity to Option (B):
   $$\forall b_2 (\langle b_2 \rangle \in S \implies \langle a, b_2 \rangle \in R) \equiv \neg \exists b_2 (\langle b_2 \rangle \in S \wedge \langle a, b_2 \rangle \notin R)$$
   This asserts: "There does not exist any course in $S$ that student $a$ has not taken." This is completely equivalent.

4. **Option (D) is FALSE**:
   Option (D) reverses the implication:
   $$\forall b_2 (\langle a, b_2 \rangle \in R \implies \langle b_2 \rangle \in S)$$
   This expresses that student $a$ has enrolled **ONLY** in courses belonging to $S$. It does **not** require student $a$ to have enrolled in **ALL** courses in $S$. (For instance, a student enrolled in just 1 course belonging to $S$ would satisfy (D), but fail the division requirement).

Therefore, options (A), (B), and (C) are correct.

## Q12
type: NAT
marks: 2
subject: dbms
topic: relational-algebra-calculus
answer: 23

Consider two relations $R(\text{sid}, \text{cid})$ and $S(\text{cid})$ representing student course enrollments and mandatory core courses respectively.
Relation $S$ contains 3 tuples:
$$S = \{ (C1), (C2), (C3) \}$$

Relation $R$ contains the following 12 tuples:

| sid | cid |
| :--- | :--- |
| S1 | C1 |
| S1 | C2 |
| S1 | C3 |
| S1 | C4 |
| S2 | C1 |
| S2 | C2 |
| S3 | C1 |
| S3 | C2 |
| S3 | C3 |
| S4 | C2 |
| S4 | C3 |
| S4 | C5 |

Consider two relational algebra expressions:
- $E_1 = R \div S$
- $E_2 = R \div (S - \sigma_{\text{cid} = 'C3'}(S))$

Let $k_1$ be the number of tuples in $E_1$, and $k_2$ be the number of tuples in $E_2$.
What is the value of $10 \times k_1 + k_2$?

### Solution
Let us compute the results of both relational divisions:

1. **Evaluation of $E_1 = R \div S$**:
   $S = \{C1, C2, C3\}$.
   The division $R \div S$ returns all `sid` values that are paired with **all three** courses $\{C1, C2, C3\}$:
   - Student S1 is enrolled in $\{C1, C2, C3, C4\}$. Contains $\{C1, C2, C3\}$ $\implies$ **Included**.
   - Student S2 is enrolled in $\{C1, C2\}$. Missing $C3$ $\implies$ Excluded.
   - Student S3 is enrolled in $\{C1, C2, C3\}$. Contains $\{C1, C2, C3\}$ $\implies$ **Included**.
   - Student S4 is enrolled in $\{C2, C3, C5\}$. Missing $C1$ $\implies$ Excluded.
   Therefore:
   $$E_1 = \{ (S1), (S3) \}$$
   Number of tuples $k_1 = 2$.

2. **Evaluation of $E_2 = R \div (S - \sigma_{\text{cid} = 'C3'}(S))$**:
   First compute the divisor relation:
   $$S - \sigma_{\text{cid} = 'C3'}(S) = \{C1, C2, C3\} - \{C3\} = \{C1, C2\}$$
   Now find all `sid` values that are paired with **both** $\{C1, C2\}$:
   - Student S1 is enrolled in $\{C1, C2, C3, C4\}$. Contains $\{C1, C2\}$ $\implies$ **Included**.
   - Student S2 is enrolled in $\{C1, C2\}$. Contains $\{C1, C2\}$ $\implies$ **Included**.
   - Student S3 is enrolled in $\{C1, C2, C3\}$. Contains $\{C1, C2\}$ $\implies$ **Included**.
   - Student S4 is enrolled in $\{C2, C3, C5\}$. Missing $C1$ $\implies$ Excluded.
   Therefore:
   $$E_2 = \{ (S1), (S2), (S3) \}$$
   Number of tuples $k_2 = 3$.

3. **Calculate $10 \times k_1 + k_2$**:
   $$10 \times k_1 + k_2 = 10 \times 2 + 3 = 23$$

The correct integer value is 23.

## Q13
type: MCQ
marks: 2
subject: dbms
topic: sql
answer: A

Consider the relational table `ProjectStaff(emp_id, project_id, hours)` populated with the following 7 rows:

| emp_id | project_id | hours |
| :--- | :--- | :--- |
| 101 | P1 | 30 |
| 102 | P1 | 45 |
| 103 | P1 | 25 |
| 104 | P2 | 40 |
| 105 | P2 | 40 |
| 106 | P2 | 20 |
| 107 | P3 | 50 |

Consider the following SQL query:
```sql
SELECT E1.emp_id
FROM ProjectStaff E1
WHERE E1.hours > (
    SELECT AVG(E2.hours)
    FROM ProjectStaff E2
    WHERE E2.project_id = E1.project_id
);
```

Which set of `emp_id` values is returned by this query?

(A) {102, 104, 105}
(B) {102, 104, 105, 107}
(C) {102, 107}
(D) {101, 102, 104, 105}

### Solution
This is a correlated subquery that evaluates row-by-row. For each candidate employee $E_1$, the subquery calculates the average hours for all employees working on $E_1$'s project:

1. **For Project P1**:
   The employees working on P1 are 101, 102, and 103 with hours 30, 45, and 25.
   $$\text{AVG}(\text{hours}) = \frac{30 + 45 + 25}{3} = \frac{100}{3} \approx 33.33$$
   Now evaluate the condition `hours > 33.33` for each employee in P1:
   - emp_id 101: $\text{hours} = 30 > 33.33 \implies \text{FALSE}$.
   - emp_id 102: $\text{hours} = 45 > 33.33 \implies \textbf{TRUE}$. (Selected).
   - emp_id 103: $\text{hours} = 25 > 33.33 \implies \text{FALSE}$.

2. **For Project P2**:
   The employees working on P2 are 104, 105, and 106 with hours 40, 40, and 20.
   $$\text{AVG}(\text{hours}) = \frac{40 + 40 + 20}{3} = \frac{100}{3} \approx 33.33$$
   Now evaluate the condition `hours > 33.33` for each employee in P2:
   - emp_id 104: $\text{hours} = 40 > 33.33 \implies \textbf{TRUE}$. (Selected).
   - emp_id 105: $\text{hours} = 40 > 33.33 \implies \textbf{TRUE}$. (Selected).
   - emp_id 106: $\text{hours} = 20 > 33.33 \implies \text{FALSE}$.

3. **For Project P3**:
   The only employee working on P3 is 107 with hours 50.
   $$\text{AVG}(\text{hours}) = \frac{50}{1} = 50$$
   Now evaluate the condition:
   - emp_id 107: $\text{hours} = 50 > 50 \implies \text{FALSE}$ (strict inequality $>$ fails when equal!).

Therefore, the set of `emp_id` values returned is `{102, 104, 105}`. The correct option is (A).

## Q14
type: MSQ
marks: 2
subject: dbms
topic: relational-algebra-calculus
answer: A, B, C

Let $R(A, B)$ and $S(B, C)$ be two relations.
Let $\ltimes$ denote the semi-join operator, $\rhd$ denote the anti-semi-join operator, and $\rtimes$ denote the left outer join operator ($R \rtimes S$).

Which of the following relational algebra identities is/are ALWAYS TRUE for all relational instances of $R$ and $S$?

(A) $R \ltimes S \equiv \pi_{A, B}(R \bowtie S)$
(B) $R \rhd S \equiv R - (R \ltimes S)$
(C) $R \equiv (R \ltimes S) \cup (R \rhd S)$
(D) $(R \rtimes S) - (R \bowtie S) \equiv R \rhd S$

### Solution
Let us examine each algebraic identity:

1. **Option (A) is TRUE**:
   By standard definition, the semi-join of $R$ with $S$ projects the natural join onto the attribute schema of $R$:
   $$R \ltimes S = \pi_{\text{attrs}(R)}(R \bowtie S) = \pi_{A, B}(R \bowtie S)$$

2. **Option (B) is TRUE**:
   The anti-semi-join $R \rhd S$ returns all tuples in $R$ that have **no** matching tuple in $S$. Since $R \ltimes S$ contains all tuples in $R$ that **do** have a match in $S$, subtracting them from $R$ yields:
   $$R \rhd S = R - (R \ltimes S)$$

3. **Option (C) is TRUE**:
   Notice that $R \ltimes S \subseteq R$.
   By definition of set difference in (B), $R \ltimes S$ and $R \rhd S$ are disjoint subsets of $R$, and their union reconstructs the entire relation $R$:
   $$(R \ltimes S) \cup (R \rhd S) = (R \ltimes S) \cup (R - (R \ltimes S)) = R$$

4. **Option (D) is FALSE**:
   This is a subtle but critical trap regarding relation schemas:
   - The Left Outer Join $R \rtimes S$ has schema $(A, B, C)$, where unmatched tuples from $R$ have attribute $C = \text{NULL}$.
   - The Natural Join $R \bowtie S$ also has schema $(A, B, C)$.
   - Thus, $(R \rtimes S) - (R \bowtie S)$ produces tuples with schema **$(A, B, C)$**.
   - In contrast, the anti-semi-join $R \rhd S$ has schema **$(A, B)$**.
   Because their schemas have different arity and attributes, $(R \rtimes S) - (R \bowtie S)$ and $R \rhd S$ are not union-compatible, and cannot be equal.
   The correct identity requires projecting away the padded NULL attribute:
   $$\pi_{A, B}((R \rtimes S) - (R \bowtie S)) \equiv R \rhd S$$

Therefore, options (A), (B), and (C) are always true.

## Q15
type: NAT
marks: 2
subject: dbms
topic: sql
answer: 10

In SQL multiset (bag) semantics:
- For any value $x$, let $m_1(x)$ and $m_2(x)$ denote its multiplicity (count of occurrences) in bags $T_1$ and $T_2$ respectively.
- `T1 UNION ALL T2` yields multiplicity $m_1(x) + m_2(x)$.
- `T1 INTERSECT ALL T2` yields multiplicity $\min(m_1(x), m_2(x))$.
- `T1 EXCEPT ALL T2` yields multiplicity $\max(0, m_1(x) - m_2(x))$.

Consider two single-column tables $T_1(val)$ and $T_2(val)$ containing integer values:
$T_1$ contains: $\{ 2, 2, 2, 3, 3, 5, 5, 5, 5, 7 \}$
$T_2$ contains: $\{ 2, 2, 3, 3, 3, 3, 5, 5, 8 \}$

Consider the following SQL query:
```sql
(SELECT val FROM T1 EXCEPT ALL SELECT val FROM T2)
UNION ALL
(SELECT val FROM T1 INTERSECT ALL SELECT val FROM T2)
```

How many total rows are returned by this query?

### Solution
Let us analyze this problem using both direct multiplicity calculation and the fundamental multiset theorem:

**Method 1: Direct Multiplicity Calculation**
List the counts of each element in $T_1$ and $T_2$:
- For $x = 2$: $m_1(2) = 3$, $m_2(2) = 2$
- For $x = 3$: $m_1(3) = 2$, $m_2(3) = 4$
- For $x = 5$: $m_1(5) = 4$, $m_2(5) = 2$
- For $x = 7$: $m_1(7) = 1$, $m_2(7) = 0$
- For $x = 8$: $m_1(8) = 0$, $m_2(8) = 1$

Now evaluate Part 1 (`T1 EXCEPT ALL T2`):
- For 2: $\max(0, 3 - 2) = 1$
- For 3: $\max(0, 2 - 4) = 0$
- For 5: $\max(0, 4 - 2) = 2$
- For 7: $\max(0, 1 - 0) = 1$
- For 8: $\max(0, 0 - 1) = 0$
Total rows in Part 1 $= 1 + 0 + 2 + 1 + 0 = 4$ rows (tuples $\{2, 5, 5, 7\}$).

Now evaluate Part 2 (`T1 INTERSECT ALL T2`):
- For 2: $\min(3, 2) = 2$
- For 3: $\min(2, 4) = 2$
- For 5: $\min(4, 2) = 2$
- For 7: $\min(1, 0) = 0$
- For 8: $\min(0, 1) = 0$
Total rows in Part 2 $= 2 + 2 + 2 + 0 + 0 = 6$ rows (tuples $\{2, 2, 3, 3, 5, 5\}$).

Now evaluate the combined `UNION ALL`:
$$\text{Total rows} = 4 + 6 = 10$$

**Method 2: Algebraic Identity for Multisets**
Notice that for any two non-negative integers $a$ and $b$:
$$\max(0, a - b) + \min(a, b) = a$$
- If $a \ge b$: $(a - b) + b = a$.
- If $a < b$: $0 + a = a$.
Therefore, for every element $x$, the combined multiplicity in $(T_1 \text{ EXCEPT ALL } T_2) \cup_{\text{all}} (T_1 \text{ INTERSECT ALL } T_2)$ is identically equal to $m_1(x)$.
Thus, the query reproduces relation $T_1$ with its exact original cardinality:
$$|T_1| = 3 + 2 + 4 + 1 = 10 \text{ rows}$$

The correct integer value is 10.

## Q16
type: MCQ
marks: 2
subject: dbms
topic: relational-algebra-calculus
answer: A

Consider the relational database schema of an airline:
- $\text{Pilot}(\underline{\text{pid}}, \text{pname}, \text{rating})$
- $\text{Certified}(\underline{\text{pid}, \text{aid}})$
- $\text{Aircraft}(\underline{\text{aid}}, \text{aname}, \text{cruising\_range})$

We wish to express the following query in Tuple Relational Calculus (TRC):
*"Find the `pid` of all pilots who are certified to fly EVERY aircraft that has a cruising range greater than 5000 km."*

Consider the following four candidate TRC expressions:
- $Q_1$: $\{ t \mid \exists p \in \text{Pilot} (t[\text{pid}] = p[\text{pid}] \wedge \forall a \in \text{Aircraft} (a[\text{cruising\_range}] > 5000 \implies \exists c \in \text{Certified} (c[\text{pid}] = p[\text{pid}] \wedge c[\text{aid}] = a[\text{aid}]))) \}$
- $Q_2$: $\{ t \mid \exists p \in \text{Pilot} (t[\text{pid}] = p[\text{pid}] \wedge \forall a \in \text{Aircraft} (a[\text{cruising\_range}] > 5000 \wedge \exists c \in \text{Certified} (c[\text{pid}] = p[\text{pid}] \wedge c[\text{aid}] = a[\text{aid}]))) \}$
- $Q_3$: $\{ t \mid \exists p \in \text{Pilot} (t[\text{pid}] = p[\text{pid}] \wedge \neg \exists a \in \text{Aircraft} (a[\text{cruising\_range}] > 5000 \wedge \neg \exists c \in \text{Certified} (c[\text{pid}] = p[\text{pid}] \wedge c[\text{aid}] = a[\text{aid}]))) \}$
- $Q_4$: $\{ t \mid \exists p \in \text{Pilot} (t[\text{pid}] = p[\text{pid}] \wedge \forall c \in \text{Certified} (\exists a \in \text{Aircraft} (c[\text{aid}] = a[\text{aid}] \wedge a[\text{cruising\_range}] > 5000))) \}$

Which of the candidate expressions correctly represent the query?

(A) $Q_1$ and $Q_3$ only
(B) $Q_1$ only
(C) $Q_1, Q_2,$ and $Q_3$
(D) $Q_1$ and $Q_4$ only

### Solution
Let us analyze the logical formulation of each candidate expression:

1. **$Q_1$ is CORRECT**:
   The subformula:
   $$\forall a \in \text{Aircraft} (a[\text{cruising\_range}] > 5000 \implies \exists c \in \text{Certified} (c[\text{pid}] = p[\text{pid}] \wedge c[\text{aid}] = a[\text{aid}]))$$
   states that for any aircraft $a$, **if** its cruising range is $> 5000$, **then** pilot $p$ must hold a certification for that aircraft. If an aircraft has cruising range $\le 5000$, the antecedent of the implication is false, making the implication vacuously true. This exactly matches the query requirement.

2. **$Q_2$ is INCORRECT**:
   $Q_2$ uses conjunction $\wedge$ under the universal quantifier instead of implication $\implies$:
   $$\forall a \in \text{Aircraft} (a[\text{cruising\_range}] > 5000 \wedge \dots)$$
   This demands that **every single aircraft** in the entire database must have a cruising range $> 5000$. If even one short-range aircraft exists in the database, the condition fails for all pilots, producing an empty result set. (This is a famous GATE trap: $\implies$ goes with $\forall$, whereas $\wedge$ goes with $\exists$).

3. **$Q_3$ is CORRECT**:
   Using the standard duality of quantifiers:
   $$\forall x (P(x) \implies Q(x)) \equiv \neg \exists x (P(x) \wedge \neg Q(x))$$
   Here:
   - $P(a) \equiv a[\text{cruising\_range}] > 5000$
   - $Q(a) \equiv \exists c \in \text{Certified} (c[\text{pid}] = p[\text{pid}] \wedge c[\text{aid}] = a[\text{aid}])$
   $Q_3$ states: "There does NOT exist any aircraft with cruising range $> 5000$ for which pilot $p$ is NOT certified."
   This double-negated existential formula is logically identical to $Q_1$.

4. **$Q_4$ is INCORRECT**:
   $Q_4$ asserts that every aircraft pilot $p$ is certified for must have a range $> 5000$. This restricts the pilot to flying *only* long-range aircraft, but fails to check whether the pilot can fly *all* of them.

Therefore, $Q_1$ and $Q_3$ correctly express the query. The correct option is (A).

## Q17
type: NAT
marks: 2
subject: dbms
topic: sql
answer: 53

Consider two tables `Department` and `Employee`:

Table `Department`:
| dept_id | dept_name |
| :--- | :--- |
| 10 | Research |
| 20 | Sales |
| 30 | IT |
| 40 | HR |

Table `Employee`:
| emp_id | dept_id | salary |
| :--- | :--- | :--- |
| 1 | 10 | 60000 |
| 2 | 10 | 45000 |
| 3 | 20 | 70000 |
| 4 | 20 | 50000 |
| 5 | 30 | 35000 |

Consider two SQL queries:
```sql
-- Query 1
SELECT D.dept_id, E.emp_id
FROM Department D
LEFT OUTER JOIN Employee E
  ON D.dept_id = E.dept_id AND E.salary >= 50000;

-- Query 2
SELECT D.dept_id, E.emp_id
FROM Department D
LEFT OUTER JOIN Employee E
  ON D.dept_id = E.dept_id
WHERE E.salary >= 50000;
```

Let $N_1$ be the number of rows returned by Query 1, and $N_2$ be the number of rows returned by Query 2.
What is the value of $10 \times N_1 + N_2$?

### Solution
This question tests the crucial difference between filtering in the `ON` clause versus the `WHERE` clause during an outer join:

1. **Query 1 (`ON` clause filter)**:
   The filter `E.salary >= 50000` is part of the join specification:
   - For a tuple from `Department` to join with a tuple from `Employee`, both `D.dept_id = E.dept_id` and `E.salary >= 50000` must be satisfied.
   - If a department has no employee satisfying both conditions, the department is **still preserved** in the result (because of `LEFT OUTER JOIN`), padded with `NULL` for `emp_id`.

   Trace department by department:
   - `dept_id = 10`:
     - emp 1 (salary 60000 $\ge$ 50000): matches $\implies (10, 1)$
     - emp 2 (salary 45000 $\ge$ 50000 is false): does not match
     $\to$ 1 row: `(10, 1)`
   - `dept_id = 20`:
     - emp 3 (salary 70000 $\ge$ 50000): matches $\implies (20, 3)$
     - emp 4 (salary 50000 $\ge$ 50000): matches $\implies (20, 4)$
     $\to$ 2 rows: `(20, 3)`, `(20, 4)`
   - `dept_id = 30`:
     - emp 5 (salary 35000 $\ge$ 50000 is false): does not match.
     - No employee satisfies the condition. Since it is a LEFT JOIN, department 30 is preserved with NULL:
     $\to$ 1 row: `(30, NULL)`
   - `dept_id = 40`:
     - Has no employees. Department 40 is preserved with NULL:
     $\to$ 1 row: `(40, NULL)`

   Total rows returned by Query 1:
   $$N_1 = 1 + 2 + 1 + 1 = 5$$

2. **Query 2 (`WHERE` clause filter)**:
   The `LEFT OUTER JOIN` is first evaluated using only `ON D.dept_id = E.dept_id`:
   - Dept 10 joins with emp 1 (salary 60000) and emp 2 (salary 45000)
   - Dept 20 joins with emp 3 (salary 70000) and emp 4 (salary 50000)
   - Dept 30 joins with emp 5 (salary 35000)
   - Dept 40 joins with NULL (salary = NULL)

   After the join is constructed, the `WHERE E.salary >= 50000` filter is applied:
   - `(10, 1, 60000)`: $60000 \ge 50000 \to \text{TRUE} \implies$ **Kept**
   - `(10, 2, 45000)`: $45000 \ge 50000 \to \text{FALSE} \implies$ Discarded
   - `(20, 3, 70000)`: $70000 \ge 50000 \to \text{TRUE} \implies$ **Kept**
   - `(20, 4, 50000)`: $50000 \ge 50000 \to \text{TRUE} \implies$ **Kept**
   - `(30, 5, 35000)`: $35000 \ge 50000 \to \text{FALSE} \implies$ Discarded
   - `(40, NULL, NULL)`: $\text{NULL} \ge 50000 \to \text{UNKNOWN} \implies$ Discarded

   Total rows returned by Query 2:
   $$N_2 = 3$$

3. **Calculate $10 \times N_1 + N_2$**:
   $$10 \times N_1 + N_2 = 10 \times 5 + 3 = 53$$

The correct integer value is 53.

## Q18
type: MSQ
marks: 2
subject: dbms
topic: sql
answer: A, C, D

Which of the following statements regarding SQL queries, NULL semantics, and aggregate functions is/are TRUE according to standard SQL?

(A) If relation $R$ has 0 rows (is empty), then `SELECT COUNT(*) FROM R` returns a single row containing `0`, whereas `SELECT SUM(A) FROM R` returns a single row containing `NULL`.
(B) The expression `COUNT(DISTINCT A) + COUNT(DISTINCT B)` is always equal to `COUNT(DISTINCT A, B)` for any relation containing attributes $A$ and $B$.
(C) In a query containing `GROUP BY A`, every column appearing in the `SELECT` list must either appear in the `GROUP BY` clause or appear as an argument to an aggregate function.
(D) The subquery condition `EXISTS (SELECT NULL)` always evaluates to `TRUE` regardless of the contents of the database.

### Solution
Let us evaluate each statement according to the ANSI SQL standard:

1. **Statement (A) is TRUE**:
   When an aggregate query does not have a `GROUP BY` clause, it always generates **exactly one output row**, treating the entire table as a single group.
   - For an empty table, `COUNT(*)` counts the number of matching tuples, yielding `0`.
   - All other aggregate functions (`SUM`, `AVG`, `MIN`, `MAX`) return `NULL` when applied to an empty set of values.

2. **Statement (B) is FALSE**:
   `COUNT(DISTINCT A)` counts distinct individual values of $A$, and `COUNT(DISTINCT B)` counts distinct individual values of $B$. In contrast, `COUNT(DISTINCT A, B)` counts distinct **pairs** $(a, b)$.
   **Counterexample:**
   Consider relation $R$ with two tuples:
   $$(1, 10), \quad (1, 20)$$
   - Distinct $A$ values: $\{1\} \implies \text{COUNT}(\text{DISTINCT } A) = 1$.
   - Distinct $B$ values: $\{10, 20\} \implies \text{COUNT}(\text{DISTINCT } B) = 2$.
   - Left side: $1 + 2 = 3$.
   - Distinct pairs $(A, B)$: $\{(1, 10), (1, 20)\} \implies \text{COUNT}(\text{DISTINCT } A, B) = 2$.
   Since $3 \neq 2$, the identity does not hold.

3. **Statement (C) is TRUE**:
   This is the fundamental syntactic rule of SQL grouping: if an attribute is not part of the `GROUP BY` clause, multiple differing values of that attribute could exist within a single group. To produce a deterministic, single-row output per group, any such column must be aggregated.

4. **Statement (D) is TRUE**:
   The `EXISTS` predicate evaluates to `TRUE` if and only if the subquery returns at least one row:
   $$\text{cardinality}(\text{subquery}) > 0$$
   The subquery `SELECT NULL` is an uncorrelated expression that produces a result set consisting of **one row** containing the value `NULL`. Because exactly one row is generated, `EXISTS (SELECT NULL)` evaluates unconditionally to `TRUE`.

Therefore, statements (A), (C), and (D) are true.

## Q19
type: NAT
marks: 2
subject: dbms
topic: relational-algebra-calculus
answer: 4740

Consider two relations $R(A, B)$ and $S(B, C)$ where:
- Relation $R$ contains 60 tuples.
- Relation $S$ contains 40 tuples.
- Attribute $A$ is the primary key of $R$.
- Attribute $C$ is the primary key of $S$.
- Attribute $B$ is **NOT** a key in either relation, and $B$ values can be repeated or NULL.
- No foreign key constraints exist between $R$ and $S$.

Let:
- $J_{\max}$ be the maximum possible number of tuples in the natural join $R \bowtie S$.
- $J_{\min}$ be the minimum possible number of tuples in the natural join $R \bowtie S$.
- $F_{\max}$ be the maximum possible number of tuples in the full outer join $R \text{ FULL OUTER JOIN } S$.
- $F_{\min}$ be the minimum possible number of tuples in the full outer join $R \text{ FULL OUTER JOIN } S$.

What is the value of $(J_{\max} - J_{\min}) + (F_{\max} - F_{\min})$?

### Solution
Let us carefully determine the extreme cardinalities for both join operations:

1. **Natural Join Cardinality ($J_{\max}$ and $J_{\min}$)**:
   - Attribute $B$ is the common join attribute and is not a key in either relation.
   - **$J_{\max}$**: Occurs when all 60 tuples of $R$ and all 40 tuples of $S$ share the exact same non-null value for $B$ (e.g., $B = 1$). In this case, the natural join degenerates into a Cartesian product on $B$:
     $$J_{\max} = 60 \times 40 = 2400$$
   - **$J_{\min}$**: Occurs when the set of $B$ values in $R$ is completely disjoint from the set of $B$ values in $S$ (or all $B$ values are NULL, since NULL does not match NULL in natural joins):
     $$J_{\min} = 0$$
   - Thus:
     $$J_{\max} - J_{\min} = 2400 - 0 = 2400$$

2. **Full Outer Join Cardinality ($F_{\max}$ and $F_{\min}$)**:
   A Full Outer Join contains:
   $$F = |R \bowtie S| + (\text{unmatched } R) + (\text{unmatched } S)$$

   - **$F_{\max}$**:
     When $|R \bowtie S| = 2400$, all 60 tuples of $R$ and all 40 tuples of $S$ participate in matches. There are 0 unmatched tuples from $R$ and 0 unmatched tuples from $S$.
     $$F = 2400 + 0 + 0 = 2400$$
     (If fewer matches occur, say $k$ tuples of $R$ match $j$ tuples of $S$, the total is $kj + (60 - k) + (40 - j) = (k - 1)(j - 1) + 99$, which attains its maximum at $k = 60, j = 40$ yielding 2400).
     Thus:
     $$F_{\max} = 2400$$

   - **$F_{\min}$**:
     Notice that every tuple of $R$ must appear in the Full Outer Join (either as part of a join tuple or padded with NULLs).
     Because $A$ is the primary key of $R$, all 60 tuples in $R$ are distinct. Each row in the Full Outer Join can contain at most one tuple from $R$. Therefore, the Full Outer Join must contain **at least 60 rows**:
     $$F \ge |R| = 60$$
     Can $F = 60$ actually be achieved?
     Yes! Suppose 40 tuples of $R$ match the 40 tuples of $S$ in a one-to-one relationship (e.g., $B$ takes distinct values $1, 2, \dots, 40$ in both relations).
     Then:
     - 40 tuples of $R$ join with 40 tuples of $S$ to produce 40 matched join rows.
     - The remaining 20 tuples of $R$ find no match and are retained as 20 unmatched rows (padded with NULLs for $C$).
     - All 40 tuples of $S$ have found a match, so there are **0 unmatched tuples from $S$**.
     Total rows in Full Outer Join $= 40 + 20 + 0 = 60$.
     Because the result cannot be smaller than $|R| = 60$, we have:
     $$F_{\min} = 60$$
   - Thus:
     $$F_{\max} - F_{\min} = 2400 - 60 = 2340$$

3. **Calculate the final expression**:
   $$(J_{\max} - J_{\min}) + (F_{\max} - F_{\min}) = 2400 + 2340 = 4740$$

The correct integer value is 4740.

## Q20
type: MCQ
marks: 2
subject: dbms
topic: sql
answer: A

Consider the relational table `Scores(player_id, game_id, score)` populated with the following 6 rows:

| player_id | game_id | score |
| :--- | :--- | :--- |
| P1 | G1 | 80 |
| P1 | G2 | 90 |
| P2 | G1 | 70 |
| P2 | G2 | 85 |
| P3 | G1 | 95 |
| P3 | G2 | 75 |

Consider the following SQL query:
```sql
SELECT S1.player_id
FROM Scores S1
WHERE S1.score > (
    SELECT AVG(S2.score)
    FROM Scores S2
    WHERE S2.game_id = S1.game_id
)
GROUP BY S1.player_id
HAVING COUNT(*) = (
    SELECT COUNT(DISTINCT game_id)
    FROM Scores
);
```

Which player(s) is/are returned by this query?

(A) No player (empty result)
(B) P1 only
(C) P3 only
(D) P1, P2, and P3

### Solution
Let us trace the logical execution of this query step by step:

1. **Understand what the query requires**:
   - The subquery in `HAVING` computes:
     $$\text{SELECT COUNT(DISTINCT game\_id) FROM Scores} = 2 \quad (\text{games } G1 \text{ and } G2)$$
   - Therefore, the `HAVING` condition requires:
     $$\text{COUNT}(*) = 2$$
   - This means a player must produce **at least 2 qualifying rows** in the filtered `Scores` table.
   - For a player's row to qualify through the `WHERE` clause, their score in that game must be **strictly greater than the average score** for that game.
   - Hence, the query returns players who scored **strictly above average in EVERY game** present in the database.

2. **Compute game averages**:
   - **Game G1**:
     Scores: P1 (80), P2 (70), P3 (95).
     $$\text{AVG}(G1) = \frac{80 + 70 + 95}{3} = \frac{245}{3} \approx 81.67$$
     - P1: $\text{score} = 80 > 81.67 \implies \text{FALSE}$.
     - P2: $\text{score} = 70 > 81.67 \implies \text{FALSE}$.
     - P3: $\text{score} = 95 > 81.67 \implies \textbf{TRUE}$. (Qualifies).

   - **Game G2**:
     Scores: P1 (90), P2 (85), P3 (75).
     $$\text{AVG}(G2) = \frac{90 + 85 + 75}{3} = \frac{250}{3} \approx 83.33$$
     - P1: $\text{score} = 90 > 83.33 \implies \textbf{TRUE}$. (Qualifies).
     - P2: $\text{score} = 85 > 83.33 \implies \textbf{TRUE}$. (Qualifies).
     - P3: $\text{score} = 75 > 83.33 \implies \text{FALSE}$.

3. **Rows passing the `WHERE` filter**:
   The rows that satisfy the `WHERE` condition are:
   1. `(P3, G1, 95)`
   2. `(P1, G2, 90)`
   3. `(P2, G2, 85)`

4. **Group by `player_id` and evaluate `HAVING COUNT(*) = 2`**:
   - For player `P1`: $\text{COUNT}(*) = 1 \neq 2 \implies$ Discarded.
   - For player `P2`: $\text{COUNT}(*) = 1 \neq 2 \implies$ Discarded.
   - For player `P3`: $\text{COUNT}(*) = 1 \neq 2 \implies$ Discarded.

No player qualified in both games. Therefore, the query returns an **empty result set** (0 rows). The correct option is (A).
