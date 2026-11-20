---
test: dbms-ut-01
title: "DBMS · Unit Test 01 (Relational Model, Keys & Referential Integrity)"
duration: 30
marks: 15
pass: 70%
---

# DBMS · Unit Test 01 (Relational Model, Keys & Referential Integrity)

## Q1
type: MCQ
marks: 1
subject: dbms
topic: relational-algebra-calculus
syllabus: DB01.3
answer: A
difficulty: easy

Consider a relation schema `Hospital(PatientID, DoctorID, Diagnosis, RoomNo, AdmissionDate)`. At a particular time, the relation stores 340 tuples. What are the degree and the cardinality of this relation instance?

(A) Degree = 5, Cardinality = 340
(B) Degree = 340, Cardinality = 5
(C) Degree = 5, Cardinality = 5
(D) Degree = 340, Cardinality = 340

### Solution
- **Degree (or arity)** is the number of attributes in the relation schema. Here, the schema has 5 attributes: `PatientID`, `DoctorID`, `Diagnosis`, `RoomNo`, and `AdmissionDate`. Thus, $\text{Degree} = 5$.
- **Cardinality** is the number of tuples (rows) currently stored in the relation instance. Thus, $\text{Cardinality} = 340$.

Hence, (A) is correct.

## Q2
type: MCQ
marks: 1
subject: dbms
topic: relational-algebra-calculus
syllabus: DB01.7
answer: B
difficulty: easy

In the three-schema database architecture, consider the schemas in Set $X$ and their primary representations in Set $Y$:

| Set $X$ (Database Schemas) | Set $Y$ (Representations) |
| :--- | :--- |
| **I.** External schema | **P.** Conceptual tables and integrity constraints |
| **II.** Conceptual (Logical) schema | **Q.** Storage structures and access paths |
| **III.** Internal (Physical) schema | **R.** Customized user views |

Which of the following is the correct matching from Set $X$ to Set $Y$?

(A) I $\rightarrow$ P, II $\rightarrow$ Q, III $\rightarrow$ R
(B) I $\rightarrow$ R, II $\rightarrow$ P, III $\rightarrow$ Q
(C) I $\rightarrow$ R, II $\rightarrow$ Q, III $\rightarrow$ P
(D) I $\rightarrow$ Q, II $\rightarrow$ P, III $\rightarrow$ R

### Solution
In the three-schema architecture:
- **External schema (View level)** defines customized views for different user groups $\implies$ I matches R.
- **Conceptual / Logical schema** defines the logical tables, attributes, relationships, and integrity constraints $\implies$ II matches P.
- **Internal / Physical schema** defines the low-level storage structures and access paths on disk $\implies$ III matches Q.

Therefore, the correct mapping is I $\rightarrow$ R, II $\rightarrow$ P, III $\rightarrow$ Q.

Hence, (B) is correct.

## Q3
type: MSQ
marks: 1
subject: dbms
topic: relational-algebra-calculus
syllabus: DB02.3
answer: A, B, D
difficulty: medium

Consider a relation schema $R(A, B, C, D, E, F)$ where $\{A, B\}$, $\{B, C\}$, and $\{D\}$ are the candidate keys of $R$. Which of the following statements is/are **TRUE**?

(A) The prime attributes of $R$ are $A, B, C$, and $D$.
(B) Attributes $E$ and $F$ are non-prime attributes.
(C) $\{A, B, C\}$ is a candidate key of $R$.
(D) Any attribute that is part of a candidate key can never accept a NULL value if that candidate key is chosen as the primary key.

### Solution
- A **prime attribute** is an attribute that belongs to *at least one* candidate key. The candidate keys are $\{A, B\}$, $\{B, C\}$, and $\{D\}$. Their union is $\{A, B, C, D\}$. Thus, $A, B, C, D$ are prime attributes. (A is TRUE).
- A **non-prime attribute** is any attribute that does not appear in any candidate key. The attributes outside the prime set are $E$ and $F$. (B is TRUE).
- $\{A, B, C\}$ is a proper superset of candidate key $\{A, B\}$ (and also of $\{B, C\}$). By definition, a candidate key is a *minimal* superkey. Since proper subset $\{A, B\}$ is already a superkey, $\{A, B, C\}$ cannot be a candidate key; it is only a superkey. (C is FALSE).
- By the **entity integrity constraint**, no component attribute of a primary key can accept a NULL value. (D is TRUE).

Hence, (A), (B), and (D) are correct.

## Q4
type: MCQ
marks: 1
subject: dbms
topic: relational-algebra-calculus
syllabus: DB02.5
answer: C
difficulty: medium

Consider a relation schema $R(P, Q, R, S, T, U)$ with primary key $\{P, R\}$. Which of the following attribute sets is **NOT** a superkey of $R$?

(A) $\{P, Q, R, S\}$
(B) $\{P, R, T, U\}$
(C) $\{P, Q, S, T, U\}$
(D) $\{P, Q, R, S, T, U\}$

### Solution
- An attribute set $S$ is a **superkey** if and only if it contains a candidate key (or the primary key) as a subset.
- Here, the primary key is $\{P, R\}$. Therefore, any superkey of $R$ must contain both $P$ and $R$.
- Option (A) contains $\{P, R\}$. (Superkey)
- Option (B) contains $\{P, R\}$. (Superkey)
- Option (C) $\{P, Q, S, T, U\}$ does not contain attribute $R$, so it cannot contain the key $\{P, R\}$. Thus, it is NOT a superkey.
- Option (D) contains $\{P, R\}$. (Superkey)

Hence, (C) is correct.

## Q5
type: NAT
marks: 1
subject: dbms
topic: relational-algebra-calculus
syllabus: DB02.6
answer: 8
difficulty: easy

A relation schema $R(A_1, A_2, A_3, A_4, A_5, A_6)$ with 6 attributes has exactly one candidate key $K = \{A_1, A_2, A_3\}$. What is the total number of superkeys of relation $R$?

### Solution
- The relation schema has $n = 6$ attributes: $\{A_1, A_2, A_3, A_4, A_5, A_6\}$.
- The candidate key has $k = 3$ attributes: $\{A_1, A_2, A_3\}$.
- Any superkey must contain all $k$ attributes of the candidate key. The remaining $n - k = 6 - 3 = 3$ attributes can each independently be either included or excluded.
- Total number of superkeys:
  $$2^{n - k} = 2^{6 - 3} = 2^3 = 8.$$

The 8 superkeys are: $\{A_1, A_2, A_3\}$ combined with any subset of $\{A_4, A_5, A_6\}$.

Hence, the answer is 8.

## Q6
type: NAT
marks: 2
subject: dbms
topic: relational-algebra-calculus
syllabus: DB02.7
pyq: 2026s1-55
answer: 14
difficulty: hard

Consider a relation schema $R(A, B, C, D, E)$ with 5 attributes. The only candidate keys of $R$ are $\{A, B\}$ and $\{C, D\}$. What is the total number of superkeys of relation $R$?

### Solution
- Total number of attributes $n = 5$: $\{A, B, C, D, E\}$.
- Candidate keys: $K_1 = \{A, B\}$ (size $|K_1| = 2$) and $K_2 = \{C, D\}$ (size $|K_2| = 2$).
- A set of attributes is a superkey of $R$ if and only if it contains $K_1$ or $K_2$ (or both).
- Using the Principle of Inclusion–Exclusion:
  $$\text{Total Superkeys} = |S(K_1)| + |S(K_2)| - |S(K_1 \cup K_2)|$$
  where $|S(K)| = 2^{n - |K|}$ is the number of supersets of $K$.
- Calculate each component:
  - $|S(K_1)| = 2^{5 - 2} = 2^3 = 8$
  - $|S(K_2)| = 2^{5 - 2} = 2^3 = 8$
  - $K_1 \cup K_2 = \{A, B, C, D\}$ has size $|K_1 \cup K_2| = 4$.
  - $|S(K_1 \cup K_2)| = 2^{5 - 4} = 2^1 = 2$
- Total superkeys:
  $$\text{Total} = 8 + 8 - 2 = 14.$$

Hence, the answer is 14.

## Q7
type: NAT
marks: 2
subject: dbms
topic: relational-algebra-calculus
syllabus: DB02.12
pyq: 2017s2-19
answer: 2
difficulty: hard

Consider two tables $R_1(A, B)$ and $R_2(C, D)$ with the following contents:

Table $R_1$:
| A | B |
| :---: | :---: |
| 1 | 10 |
| 2 | 20 |
| 3 | 10 |
| 4 | 30 |
| 5 | 20 |

Table $R_2$:
| C | D |
| :---: | :---: |
| 10 | 1 |
| 20 | 2 |
| 30 | 5 |
| 40 | 3 |

- In table $R_1$, $A$ is the primary key and $B$ is a foreign key referencing $C$ in table $R_2$ with **ON DELETE CASCADE**.
- In table $R_2$, $C$ is the primary key and $D$ is a foreign key referencing $A$ in table $R_1$ with **ON DELETE CASCADE**.

Suppose the tuple `(20, 2)` is deleted from table $R_2$.  
What is the total number of tuples remaining in table $R_1$ after all cascading deletions are complete?

### Solution
Let us trace the cascade deletions step by step:

1. **Delete `(20, 2)` from $R_2$:**
   $C = 20$ is removed from $R_2$.
2. **Cascade to $R_1$ ($B \rightarrow C$):**
   In $R_1$, attribute $B$ references $R_2.C$ with `ON DELETE CASCADE`. Any tuple in $R_1$ with $B = 20$ must be deleted:
   - `(2, 20)` has $B = 20 \implies$ deleted from $R_1$.
   - `(5, 20)` has $B = 20 \implies$ deleted from $R_1$.
   Now tuples with $A = 2$ and $A = 5$ are removed from $R_1$.
3. **Cascade back to $R_2$ ($D \rightarrow A$):**
   In $R_2$, attribute $D$ references $R_1.A$ with `ON DELETE CASCADE`. Any tuple in $R_2$ with $D = 2$ or $D = 5$ must be deleted:
   - Tuple with $C = 20$ had $D = 2$, but it was already deleted.
   - Tuple `(30, 5)` has $D = 5 \implies$ deleted from $R_2$.
   Now $C = 30$ is removed from $R_2$.
4. **Cascade again to $R_1$ ($B \rightarrow C$):**
   Any tuple in $R_1$ with $B = 30$ must be deleted:
   - Tuple `(4, 30)` has $B = 30 \implies$ deleted from $R_1$.
   Now $A = 4$ is removed from $R_1$.
5. **Check $R_2$ for further cascades:**
   In $R_2$, we check for tuples with $D = 4$.
   The remaining tuples in $R_2$ are `(10, 1)` with $D = 1$ and `(40, 3)` with $D = 3$. Neither has $D = 4$. No further deletions occur.

Final state of Table $R_1$:
- Originally: `(1, 10)`, `(2, 20)`, `(3, 10)`, `(4, 30)`, `(5, 20)`.
- Deleted: `(2, 20)`, `(5, 20)`, `(4, 30)`.
- Remaining tuples in $R_1$: `(1, 10)` and `(3, 10)`.

The total number of tuples remaining in table $R_1$ is 2.

Hence, the answer is 2.

## Q8
type: MSQ
marks: 2
subject: dbms
topic: relational-algebra-calculus
syllabus: DB02.10
answer: A, C, D
difficulty: medium

Let $P(A, B)$ be a parent relation with primary key $A$.  
Let $C(X, Y)$ be a child relation with primary key $X$, and foreign key $Y$ referencing primary key $A$ of relation $P$.  
Which of the following database operations can **POTENTIALLY VIOLATE** the referential integrity constraint?

(A) Inserting a new tuple into relation $C$
(B) Deleting an existing tuple from relation $C$
(C) Updating the attribute value of foreign key $Y$ in relation $C$
(D) Updating the attribute value of primary key $A$ in relation $P$

### Solution
- Referential integrity requires that every non-NULL value of foreign key $Y$ in child $C$ must exist in the primary key $A$ of parent $P$.
- **(A) Insert into $C$:** Can violate if the inserted tuple contains a $Y$ value that does not exist in $P.A$. (Can violate).
- **(B) Delete from $C$:** Removing a child record only removes a reference; it can never produce an orphaned reference in any table. (Cannot violate).
- **(C) Update $Y$ in $C$:** Changing the foreign key value in a child tuple can introduce a value not present in $P.A$. (Can violate).
- **(D) Update $A$ in $P$:** Changing a primary key value in parent $P$ leaves any child tuples referencing the old value with invalid (dangling) references unless cascading updates are configured. (Can violate).

Hence, (A), (C), and (D) are correct.

## Q9
type: MCQ
marks: 2
subject: dbms
topic: relational-algebra-calculus
syllabus: DB01.4
answer: A
difficulty: medium

Consider the following statements regarding the relational data model:

- $S_1$: In a formal relation, the ordering of columns (attributes) is significant, and two relations with identical sets of tuples but different attribute orders are considered distinct relations.
- $S_2$: In a formal relation, duplicate tuples are allowed as long as no candidate key has been defined.
- $S_3$: Every attribute value in a valid relational tuple must be atomic.

Which of the statement(s) above is/are **TRUE**?

(A) Only $S_3$
(B) $S_1$ and $S_3$
(C) $S_2$ and $S_3$
(D) $S_1, S_2$, and $S_3$

### Solution
- **$S_1$ is FALSE:** In the formal relational model, a relation schema is defined as a set of attributes, not an ordered list. Attribute ordering does not matter; changing column order yields the exact same relation.
- **$S_2$ is FALSE:** In the formal relational model, a relation instance is mathematically defined as a set of tuples. Since sets by definition contain no duplicate elements, duplicate tuples are strictly forbidden in any valid relation, regardless of whether a key has been explicitly designated.
- **$S_3$ is TRUE:** Every cell in a relational tuple must contain an atomic (indivisible) value drawn from its domain (fundamental atomicity rule of the relational model).

Therefore, only $S_3$ is true.

Hence, (A) is correct.

## Q10
type: MCQ
marks: 2
subject: dbms
topic: relational-algebra-calculus
syllabus: DB02.11
answer: C
difficulty: medium

Consider a relation `Employee(EmpID, Name, ManagerID)` where `EmpID` is the primary key, and `ManagerID` is a self-referencing foreign key referencing `EmpID` within the same table. The foreign key constraint is defined with `ON DELETE SET NULL`.

The table currently contains the following records:

| EmpID | Name | ManagerID |
| :---: | :---: | :---: |
| 1 | Alice | NULL |
| 2 | Bob | 1 |
| 3 | Carol | 1 |
| 4 | Dave | 2 |
| 5 | Eve | 4 |

If the tuple corresponding to `EmpID = 1` is deleted, which of the following statements correctly describes the state of the relation after the operation?

(A) Tuples for Bob, Carol, Dave, and Eve are all recursively deleted from the table.
(B) The deletion of Alice is rejected and fails because active references exist.
(C) Only Alice is deleted; the `ManagerID` of Bob and Carol becomes `NULL`, while Dave and Eve remain completely unchanged.
(D) Only Alice is deleted; the `ManagerID` of Bob, Carol, Dave, and Eve all become `NULL`.

### Solution
- `ON DELETE SET NULL` specifies that when a referenced parent record is deleted, any child records directly referencing it have their foreign key attribute set to `NULL` instead of being deleted.
- Here, `EmpID = 1` (Alice) is deleted.
- The records that directly reference `EmpID = 1` are Bob (`ManagerID = 1`) and Carol (`ManagerID = 1`).
- Therefore, the `ManagerID` values for Bob and Carol are updated to `NULL`.
- Bob and Carol are NOT deleted. Because Bob is not deleted, Dave's reference (`ManagerID = 2`) remains entirely valid and untouched.
- Similarly, Eve's reference (`ManagerID = 4`) remains entirely valid and untouched.
- Thus, only Alice's row is deleted, Bob and Carol have `ManagerID = NULL`, and Dave and Eve are unchanged.

Hence, (C) is correct.
