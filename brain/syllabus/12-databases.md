# Part 12 · Databases

Official GATE 2027 wording (Section 9): "ER-model. Relational model: relational algebra, tuple calculus, SQL. Integrity constraints, normal forms. File organization, indexing (e.g., B and B+ trees). Transactions and concurrency control."

2nd block, every day, side by side with Aptitude and Compiler Design (AGENTS.md 2.9). Rebuilt from zero on 19 Nov 2026: the student is assumed to know nothing of databases, and earlier progress does not count.
Weight from the papers: 7.1 marks a paper since 2014, 7.3 since 2021. Transactions and concurrency control are about 1.7 of it, functional dependencies and normal forms 1.6, SQL 1.3, relational algebra and calculus 1.1, indexing and B+ trees 0.9, the ER model 0.3, keys and integrity 0.2.
**Queries are built as one structure, because a pile of separate rules is what makes SQL confusing.** Relational algebra comes first: it is small (a handful of operators on sets) and every SQL question is checked against its algebra meaning. SQL then hangs every rule on one spine, the order a query is evaluated in: FROM → WHERE → GROUP BY → HAVING → SELECT → DISTINCT → ORDER BY. Unit DB05 is that spine on one table plus NULLs; DB06 adds groups and joins; DB07 adds subqueries, each kind with its exact rules (IN, ANY/ALL with the empty-set cases, EXISTS, NOT EXISTS as "for all"). Tuple calculus comes last, read against the algebra and SQL already known.
Order: the relational model and keys (everything uses them); queries (algebra, SQL, calculus), the block she finds hardest, while it is fresh; transactions and concurrency control (the heaviest, needing only the basics); functional dependencies and normal forms; file organisation, indexing and B+ trees; the ER model last (the lightest, and its table counts use keys and normal forms).
How to read this file: `##` is a topic (a unit), `###` a subtopic, each `-` line one minor topic to teach, in this order. Nothing here uses an idea before the line that teaches it: `npm run check:syllabus` proves it.
Letters: **T** concept, **Q** question pattern from real PYQs, **N** never asked yet but inside the syllabus, **L** legacy (old papers or the old syllabus). `Teaches:` names the concepts a line introduces (`concepts.json`). PYQ ids are newest first.

## DB01 · The relational model
notes: dbms/02-relational-algebra-calculus
hours: 1.5

### Relations
- DB01.1 T A database keeps data so many programs can share it; a DBMS is the software that stores, queries and protects it.
- DB01.2 T The relational model: data lives in relations (tables); a row is a tuple, a column an attribute, and each attribute draws its values from a domain. Teaches: rel-model
- DB01.3 T Degree (arity) is the number of attributes, cardinality the number of tuples; the schema is the structure, the instance the data in it at one moment.
- DB01.4 T A relation is a set: no two tuples are identical, and neither row order nor column order matters.
- DB01.5 T Every cell holds one atomic value (no lists, no nested tables); NULL marks a value that is missing or does not apply. Teaches: null
- DB01.6 T Three levels (external views, logical schema, physical storage); logical data independence (change the logical schema without touching views) is harder than physical (change storage without touching the logical schema).
- DB01.7 Q Terms of the relational model: degree, cardinality, schema vs instance, data independence. PYQ: 2026s2-5, 2023-6, 1994-3.11

## DB02 · Keys and integrity
notes: dbms/02-relational-algebra-calculus
hours: 2

### Keys
- DB02.1 T Superkey: a set of attributes whose values identify a tuple; candidate key: a minimal superkey (drop any attribute and it stops being one); primary key: the candidate key chosen; prime attribute: one that belongs to some candidate key. Teaches: keys
- DB02.2 T Keys come from the rules of the data, never from one instance: an instance can show a set is not a key, but never prove it is one.
- DB02.3 Q Prime attributes, candidate keys and NULLs in keys: which statements hold. PYQ: 2011-12, 1994-3.7
- DB02.4 T A set is a superkey exactly when it contains a candidate key.
- DB02.5 Q Is this set a superkey. PYQ: 2016s1-21
- DB02.6 T Counting superkeys: with one candidate key of k attributes among n, there are 2^(n−k); with several keys, count the supersets of each and remove the overlap (inclusion–exclusion).
- DB02.7 Q Count the superkeys of a relation. PYQ: 2026s1-55, 2014s2-21

### Referential integrity
- DB02.8 T A foreign key is a set of attributes whose values must appear as the primary key of the referenced relation (or be NULL). A primary key can never be NULL. Teaches: foreign-key
- DB02.9 T What can break it: inserting a child tuple, or deleting (or changing the key of) a referenced parent tuple; inserting a parent or deleting a child never can.
- DB02.10 Q Which insertions and deletions can violate a foreign key; true statements about foreign keys. PYQ: DA2026-16, 2021s2-6, 2014s3-22, 1997-6.10
- DB02.11 T On deleting a referenced parent: reject (the default), CASCADE (delete the referencing tuples too, and their referencing tuples in turn), or SET NULL.
- DB02.12 Q How many tuples a cascading delete removes. PYQ: 2017s2-19, 2005-76

## DB03 · Relational algebra: the operators
notes: dbms/02-relational-algebra-calculus
hours: 2.5

### One relation at a time
- DB03.1 T Relational algebra: each operator takes relations and gives a relation, so operators compose like arithmetic; results are sets, so duplicates vanish. Teaches: rel-algebra
- DB03.2 T Selection σ_c(R): the tuples satisfying condition c (same attributes). Projection π_A(R): only the attributes A, duplicates removed. Rename ρ: give a relation or its attributes new names.

### Set operations and the product
- DB03.3 T Union, intersection and difference need union-compatible relations (the same number of attributes, with matching domains); R ∩ S = R − (R − S).
- DB03.4 T Cartesian product R × S: every tuple of R paired with every tuple of S: m·n tuples, the attributes of both.
- DB03.5 Q Express or simplify with union, intersection and difference; which projection or intersection forms are equal. PYQ: 2008-68, 1998-1.33, 1994-3.8

### Joins
- DB03.6 T Theta join R ⋈_c S = σ_c(R × S); an equijoin uses only equality; the natural join R ⋈ S matches on every attribute with the same name and keeps one copy of each. With no common attribute, the natural join is the product. Teaches: join
- DB03.7 T A NULL never matches anything in a join, not even another NULL.
- DB03.8 Q Evaluate a join expression on small tables and count the result. PYQ: DA2026-32, DA2025-52, 2024s1-25, 2019-55, 2012-50
- DB03.9 T Join sizes: if the join attribute is a key of S, each R tuple meets at most one S tuple, so |R ⋈ S| ≤ |R|; a non-NULL foreign key from R to S makes it exactly |R|; with no key the range is 0 to m·n.
- DB03.10 Q Most and fewest tuples in a join, from sizes, keys and foreign keys. PYQ: IT2006-14, 2004-14, 1999-1.18
- DB03.11 T A foreign key in algebra: π_FK(child) ⊆ π_key(parent), so π_FK(child) − π_key(parent) is always empty, the other difference need not be.
- DB03.12 Q Which expression is always empty or always holds, given a foreign key. PYQ: 2012-43, 2004-13

## DB04 · Relational algebra: the patterns GATE asks
notes: dbms/02-relational-algebra-calculus
hours: 2.5

### Self joins and extremes
- DB04.1 T To compare two tuples of one relation, join it with a renamed copy of itself. A comparison join finds the tuples that have SOME partner; subtracting that from all tuples leaves the ones with NO partner, which is how algebra says "the largest" or "older than all".
- DB04.2 Q What a self join with a comparison and a difference computes: the maximum, the minimum, "greater than all". PYQ: 2021s1-27, 2014s3-30, 2007-59, 2004-51
- DB04.3 T "At least k" needs k renamed copies (k − 1 products) and "different key" conditions: algebra has no counting.
- DB04.4 Q The fewest products needed for an "at least k" query. PYQ: 2024s2-35, 2001-21.a

### Division: "for all"
- DB04.5 T Division R(A, B) ÷ S(B): the a values paired in R with EVERY b of S. Expansion: π_A(R) − π_A((π_A(R) × S) − R). Extra pairs never disqualify an a, only missing ones do; join gives "some", division gives "all".
- DB04.6 Q Queries with "all", "every" or "only": division, its expansion, the size of a division's result. PYQ: 2022-15, 2017s1-46, 1998-27, 1997-76.b

### Outer joins
- DB04.7 T Left outer join ⟕: the join plus every unmatched left tuple padded with NULLs; right ⟖ and full ⟗ likewise; the full outer join contains the left and right ones, which contain the inner join.
- DB04.8 Q Which tuples an outer join produces; which join's result contains which. PYQ: 2015s2-32
- DB04.9 T A selection on the padded side after an outer join throws the padded tuples away again, since a condition on NULL is not true.
- DB04.10 Q Which rewriting of an outer join with a selection is equivalent, given a foreign key. PYQ: 2018-41

### Laws, reading and limits
- DB04.11 T Equivalence laws: cascade and commute selections; π_A(π_B(R)) = π_A(R) only when A ⊆ B; a selection commutes with a projection only if its condition uses kept attributes; push a selection below a join when it uses one side only (smaller join input).
- DB04.12 Q Which rewrite of an expression is valid, or cheapest. PYQ: 2014s3-21, IT2007-68, 2001-1.25, 1998-2.19
- DB04.13 Q Write an expression for a described query, or say in words what an expression computes. PYQ: DA2025-7, DA2024-16, 1996-27, 1992-13b, 1991-12.b
- DB04.14 T What basic algebra cannot do: aggregates (sum, count, average) and reachability (transitive closure) of unbounded length.
- DB04.15 Q Which queries cannot be written in relational algebra. PYQ: 2001-1.24, 2000-1.23

## DB05 · SQL: the spine, on one table
notes: dbms/03-sql
hours: 2.5

### The order a query is evaluated in
- DB05.1 T SQL is evaluated in this order, whatever order it is written in: FROM (which rows exist) → WHERE (keep rows) → grouping → group filter → SELECT (which columns) → DISTINCT → ORDER BY. Every SQL rule here hangs on one of these steps; the two grouping steps come in DB06. Teaches: sql
- DB05.2 T FROM one table and SELECT columns or expressions (`*` for all); WHERE with comparisons, AND, OR, NOT, BETWEEN (both ends included), LIKE (`%` any run, `_` one character) and IN (a list).
- DB05.3 T FROM A, B is the Cartesian product (|A|·|B| rows, all columns); a join condition in WHERE turns it into a join; k tables need k − 1 join conditions.
- DB05.4 Q Count the rows a SELECT with WHERE (and a join condition) returns on given tables. PYQ: DA2024-21, 2023-51, IT2004-74

### Duplicates: SQL works on bags
- DB05.5 T SELECT keeps duplicates unless it says DISTINCT, which removes repeated whole rows; algebra's projection always removes them. ORDER BY sorts last (ascending unless DESC).
- DB05.6 Q SQL vs algebra: duplicates, an empty table in FROM, when two forms give the same rows. PYQ: 2015s1-7, IT2005-68, 2003-30, 2000-2.25, 1999-2.25
- DB05.7 Q Say in words what a multi-table query computes. PYQ: 2003-86

### NULL and three-valued logic
- DB05.8 T Arithmetic with NULL gives NULL; a comparison with NULL is UNKNOWN, so `x = NULL` is never true: test with IS NULL. Teaches: three-valued
- DB05.9 T Three-valued logic: TRUE, FALSE, UNKNOWN; FALSE AND UNKNOWN = FALSE, TRUE OR UNKNOWN = TRUE, NOT UNKNOWN = UNKNOWN; WHERE keeps a row only when its condition is TRUE.

### Defining and changing tables
- DB05.10 T CREATE TABLE with PRIMARY KEY, UNIQUE, NOT NULL, CHECK and FOREIGN KEY … REFERENCES … ON DELETE CASCADE / SET NULL; the referenced columns must be the other table's key.
- DB05.11 Q Candidate and foreign keys read from table definitions. PYQ: DA2025-46
- DB05.12 T INSERT, UPDATE and DELETE; each statement runs on the table as it stood before that statement.
- DB05.13 Q Which updates and deletions succeed or cascade under the declared keys. PYQ: 2014s1-22, IT2004-78, 2001-2.25
- DB05.14 Q Trace a sequence of insertions and updates, then query the table. PYQ: 2011-32

## DB06 · SQL: aggregates, groups and joins
notes: dbms/03-sql
hours: 2.5

### Aggregates
- DB06.1 T COUNT, SUM, AVG, MIN and MAX run over the rows WHERE kept. COUNT(*) counts rows; COUNT(col) skips NULLs; COUNT(DISTINCT col) counts different values; the others ignore NULLs, so AVG = SUM / COUNT(col). On no rows COUNT gives 0 and the others NULL. Teaches: sql-aggregate
- DB06.2 Q NULLs inside comparisons and aggregates. PYQ: IT2004-76, 2000-2.26

### GROUP BY and HAVING
- DB06.3 T GROUP BY: one output row per distinct value of the grouping columns among the rows WHERE kept; SELECT may use only grouping columns and aggregates. Grouping on a non-key (a name) merges different people.
- DB06.4 T HAVING filters groups after grouping; WHERE filters rows before. HAVING without GROUP BY treats the whole table as one group.
- DB06.5 Q Count the rows of a grouped query on given tables. PYQ: 2019-51, 2015s1-27
- DB06.6 Q Which statements about GROUP BY and HAVING hold. PYQ: 2012-15
- DB06.7 L Write SQL for a described query (old descriptive). PYQ: 2001-21.b, 2001-21.c, 1999-22.a, 1999-22.b, 1998-7.a, 1993-23, 1991-12.a

### Joins in SQL
- DB06.8 T JOIN … ON, NATURAL JOIN (common columns matched, kept once) and USING; LEFT, RIGHT and FULL OUTER JOIN pad unmatched rows with NULLs.
- DB06.9 Q Outer joins in SQL: which rows appear. PYQ: 2018-12

### Tables made by queries
- DB06.10 T A query inside another one is a subquery. In FROM (a derived table) or in WITH it is evaluated completely first and then used as a table; an average of group counts is not an average of rows. Teaches: subquery
- DB06.11 Q Evaluate nested derived tables and WITH queries. PYQ: 2017s1-23, 2016s2-52
- DB06.12 Q Which formulations give each row the size of its group. PYQ: DA2026-41
- DB06.13 Q Natural joins of derived tables, and grouped queries with a subquery. PYQ: IT2008-74, 2011-46

## DB07 · SQL: subqueries
notes: dbms/03-sql
hours: 3

### Uncorrelated subqueries
- DB07.1 T A subquery in WHERE that does not mention the outer query is evaluated once, over its own FROM and WHERE (the outer WHERE does not restrict it); a scalar subquery gives one value.
- DB07.2 Q Compare rows or groups with an aggregate subquery (MAX, AVG): whose average, which filters apply where. PYQ: DA2025-23, 2021s2-31, 2020-13, 2004-53
- DB07.3 T x IN (subquery) is true if some row equals x (pairs of columns work too); x NOT IN S means x differs from every s, so a single NULL in S makes it never true.
- DB07.4 Q Evaluate queries with IN and NOT IN, including double negation. PYQ: 2025s1-45, 2014s1-54, 2009-55

### ANY and ALL
- DB07.5 T x > ANY (S) means x > min(S); x > ALL (S) means x > max(S); `= ANY` is IN, `<> ALL` is NOT IN. On an empty S, ALL is TRUE and ANY is FALSE.
- DB07.6 Q Evaluate ANY and ALL on given tables; pick the form for "highest" or "more than every". PYQ: 2017s2-46, 2015s3-3, 2012-51, 2007-61

### Correlated subqueries and EXISTS
- DB07.7 T A correlated subquery uses the outer row, so it is re-evaluated for every outer row. EXISTS is true when the subquery returns at least one row; UNIQUE when it returns no duplicate rows.
- DB07.8 Q Evaluate EXISTS and NOT UNIQUE with a correlated subquery, or say what it means. PYQ: 2010-19, IT2005-69
- DB07.9 T NOT EXISTS (a counterexample) means "for all"; NOT EXISTS (A EXCEPT B) is true exactly when A ⊆ B (and when A is empty); double NOT EXISTS is division in SQL.
- DB07.10 Q "For all" queries written with NOT EXISTS. PYQ: 2022-46, 2014s3-54, 2002-15, 1995-27
- DB07.11 T Counting with a correlated subquery: rank = 1 + the number of strictly greater values; "fewer than k greater" picks the top k when values are distinct; with ≥ a row counts itself.
- DB07.12 Q Top-k, rank and median-style queries with correlated counts. PYQ: DA2026-50, 2006-67, 2005-77

### Equivalent forms, set operations, views
- DB07.13 T IN and EXISTS return each outer row at most once; a join repeats it once per match; COUNT(*) > 0 over a correlated subquery equals EXISTS; when the join column is a key of S, the join equals IN.
- DB07.14 Q Which SQL formulations return the same rows. PYQ: 2025s2-44, 2014s2-54, 2006-68
- DB07.15 T UNION, INTERSECT and EXCEPT need compatible columns and remove duplicates (UNION ALL keeps them); "red and green" needs INTERSECT of two queries, not one WHERE.
- DB07.16 Q Evaluate set operations, or describe nested queries with them in words. PYQ: IT2006-84, 1990-10.a, 1988-12iv
- DB07.17 T A view is a stored query used like a table.
- DB07.18 Q Define a view and query it. PYQ: 2000-22
- DB07.19 L Write algebra and SQL for described queries (old descriptive). PYQ: 1997-76.a, 1994-13, 1988-12iii

## DB08 · Tuple relational calculus
notes: dbms/02-relational-algebra-calculus
hours: 1.5

### Reading calculus
- DB08.1 T Tuple relational calculus: {t | P(t)}, the tuples t making the formula P true, built from `t ∈ R`, comparisons, ∧, ∨, ¬, ∃ and ∀. It says what to find, not how. Teaches: trc
- DB08.2 T Translate: {t | t ∈ r ∧ P(t)} is σ_P(r); ∃u ∈ s (…) is a join; ¬∃ is "no witness", a difference.
- DB08.3 Q Evaluate a calculus expression on small relations, or translate it to algebra or words. PYQ: 2026s1-33, DA2026-49, 2025s1-29, IT2008-75, 2007-60, 1999-1.19
- DB08.4 T ∃t P(t) = ¬∀t ¬P(t) and ∀t P(t) = ¬∃t ¬P(t); division is ∀ in calculus.
- DB08.5 Q Equivalent quantifier forms; the same query in SQL, algebra and calculus. PYQ: 2013-35, 2009-45, 2008-15

### Safety and power
- DB08.6 T A safe expression has a finite answer drawn from the database; {t | ¬(t ∈ R)} is unsafe. Domain relational calculus uses attribute variables instead of tuples. Relational algebra, safe tuple calculus and safe domain calculus have the same power.
- DB08.7 Q Which expressions are safe; which languages are equally expressive. PYQ: 2017s1-41, IT2006-15, 2002-1.20, 2001-2.24

## DB09 · Transactions and serializability
notes: dbms/06-transactions-concurrency-control
hours: 3

### Transactions
- DB09.1 T A transaction is a unit of work: reads, writes, then commit or abort. ACID: atomicity (all or nothing), consistency (constraints kept), isolation (concurrent runs look serial), durability (committed changes survive crashes). Teaches: transaction
- DB09.2 Q Which ACID property a scenario shows or breaks. PYQ: 2025s2-17, 2024s2-9, 2016s1-22, 2015s2-1, IT2005-24
- DB09.3 Q Order updates run as transactions so every row changes exactly once. PYQ: IT2005-67

### Schedules and conflicts
- DB09.4 T A schedule interleaves the operations of several transactions, keeping each one's order; a serial schedule runs them one after another. Teaches: schedule
- DB09.5 T Two operations conflict when they are from different transactions, on the same item, and at least one is a write.
- DB09.6 Q When do two operations conflict. PYQ: 2026s2-10
- DB09.7 T Conflict serializable: swapping adjacent non-conflicting operations can turn it into a serial schedule. Test: the precedence graph (an edge Ti → Tj when an operation of Ti conflicts with a later one of Tj) must have no cycle. Teaches: conflict-serial
- DB09.8 Q Is a schedule conflict serializable. PYQ: 2025s2-43, 2021s1-32, 2014s3-29, 2014s1-29, 2012-27, 2009-43, 2007-64, IT2004-77, 2003-87
- DB09.9 T Every topological order of an acyclic precedence graph is a conflict-equivalent serial schedule.
- DB09.10 Q Which serial (or interleaved) schedules are conflict equivalent to a given one. PYQ: 2024s1-36, 2022-29, 2020-37, 2016s2-22, 2010-42, IT2008-63
- DB09.11 T Counting interleavings: two transactions of m and n operations have C(m + n, m) schedules; count the ones equivalent to T1;T2 and to T2;T1, removing any counted twice.
- DB09.12 Q Count the conflict-serializable schedules of given transactions. PYQ: 2017s2-44
- DB09.13 N View serializability: same initial reads, same reads-from, same final writes as a serial schedule; every conflict-serializable schedule is view serializable, and the extra ones have blind writes.

### Recoverability
- DB09.14 T Recoverable: a transaction that read another's uncommitted write commits after it. Cascadeless: reads only committed values. Strict: neither reads nor overwrites an uncommitted write. Strict ⊂ cascadeless ⊂ recoverable. Teaches: recoverable
- DB09.15 Q Is a schedule recoverable, cascadeless or strict (and serializable). PYQ: 2025s1-5, 2021s2-32, 2016s2-51, 2015s3-29, 2014s2-29, 2003-29

## DB10 · Concurrency control
notes: dbms/06-transactions-concurrency-control
hours: 2

### Locking
- DB10.1 T Shared locks (to read, many at once) and exclusive locks (to write, alone). Two-phase locking: a growing phase taking locks, then a shrinking phase releasing them, no lock after the first unlock. It guarantees conflict serializability but can deadlock and need not be recoverable. Teaches: two-phase-locking
- DB10.2 T Strict 2PL holds exclusive locks to commit (strict, so cascadeless); rigorous 2PL holds all locks to commit; conservative 2PL takes every lock at the start (deadlock-free).
- DB10.3 Q Can a schedule or a locking scheme arise under 2PL or strict 2PL. PYQ: IT2007-66, 1999-2.6
- DB10.4 T Lock granularity: finer locks (rows) give more concurrency and more overhead than coarse ones (tables).
- DB10.5 Q Which granularity allows the most concurrency. PYQ: IT2004-21

### Deadlocks and timestamps
- DB10.6 T Each transaction gets a timestamp when it starts. Wait-die: an older one waits, a younger one dies. Wound-wait: an older one wounds (aborts) the younger, a younger one waits. Waits go one way, so no deadlock; restarting with the old timestamp prevents starvation. Teaches: timestamp
- DB10.7 Q Deadlock and starvation under timestamp-based prevention. PYQ: 2017s1-42
- DB10.8 T Timestamp ordering: every conflicting operation must follow timestamp order, or its transaction rolls back; the Thomas write rule ignores an obsolete write instead, accepting some schedules that are view- but not conflict-serializable.
- DB10.9 Q Properties of 2PL, its variants and timestamp ordering. PYQ: 2024s2-17, 2019-11, 2016s1-51, 2010-20
- DB10.10 L Recovery from a log with checkpoints: what to undo and redo after a crash (outside the 2027 wording). PYQ: 2021s1-13, 2015s2-46, 2006-20 Teaches: log-recovery

## DB11 · Functional dependencies and keys
notes: dbms/04-functional-dependencies-normal-forms
hours: 2.5

### Functional dependencies
- DB11.1 T X → Y holds when any two tuples that agree on X agree on Y. It is trivial when Y ⊆ X. Like keys, an instance can disprove an FD but not prove it. Teaches: fd
- DB11.2 Q Which keys or dependencies a given instance allows. PYQ: 2014s2-22, 2002-2.25, 2000-2.24, 1987-2n
- DB11.3 T Armstrong's axioms: reflexivity, augmentation, transitivity. Derived: union (needs augmentation and transitivity), decomposition (reflexivity and transitivity), pseudo-transitivity. Not valid: X → Y and Z → Y give nothing about X and Z; XY → Z does not give X → Z.
- DB11.4 Q Which rules or implications always hold; which axioms a derived rule needs. PYQ: 2026s2-32, 2026s1-20, 2024s1-34, 1988-12i, 1988-12iia, 1988-12iib, 1988-12iic

### Attribute closure
- DB11.5 T The closure X⁺: start with X, and keep adding the right side of every FD whose left side is inside it, until nothing changes. Teaches: closure
- DB11.6 Q Which stated closure is wrong. PYQ: 2006-70
- DB11.7 T X → Y follows from F exactly when Y ⊆ X⁺; X is a superkey exactly when X⁺ is every attribute.
- DB11.8 Q Which dependencies follow from a given set. PYQ: DA2024-36, 2021s2-40, 2015s3-20, IT2005-70
- DB11.9 Q Count the dependencies of a given kind over n attributes. PYQ: 2024s2-46
- DB11.10 Q Join sizes when keys and dependencies are given. PYQ: 2010-43

### Candidate keys from dependencies
- DB11.11 T An attribute on no right side is in every key: start from those, take the closure, add attributes until it covers everything, check minimality; then look for other keys by swapping in attributes that determine a key attribute.
- DB11.12 Q Find the candidate keys, or check which option is one. PYQ: DA2026-7, 2014s1-21, IT2006-60, 2005-78, 1999-1.24
- DB11.13 Q Count the candidate keys (or superkeys) under a set of dependencies. PYQ: 2022-21, 2013-54

### Minimal cover
- DB11.14 T Minimal (canonical) cover: single attributes on the right, no extraneous attribute on any left side, no redundant dependency; check equivalence with closures.
- DB11.15 Q Pick the minimal cover, or check one. PYQ: 2017s1-16

## DB12 · Normal forms and decomposition
notes: dbms/04-functional-dependencies-normal-forms
hours: 3

### Normal forms
- DB12.1 T Redundancy causes insertion, deletion and update anomalies; decomposition removes it.
- DB12.2 T 1NF: atomic values. 2NF: no non-prime attribute depends on part of a candidate key. 3NF: for every non-trivial X → A, X is a superkey or A is prime. BCNF: for every non-trivial X → A, X is a superkey. Teaches: normal-form
- DB12.3 T BCNF ⇒ 3NF ⇒ 2NF ⇒ 1NF. A two-attribute relation is in BCNF; a relation with only prime attributes is in 3NF; if every candidate key is a single attribute, it is in 2NF.
- DB12.4 Q The highest normal form of a relation, or which schema is in 3NF but not BCNF. PYQ: 2025s2-36, DA2025-47, 2018-42, 2013-55, 2009-56, 2008-69, IT2008-62, IT2005-22, 2004-50, IT2004-75, 2003-85, 1998-26, 1997-6.9, 1995-26
- DB12.5 Q True statements about the normal forms and how they relate. PYQ: 2024s1-12, 2022-4, 2020-36, 2012-2, 2007-62, 1998-1.34, 1990-3.ii

### Decomposition
- DB12.6 T Lossless join: joining the pieces gives back exactly r (never fewer tuples; a lossy one gives extra, spurious tuples). Two pieces are lossless when R1 ∩ R2 → R1 or R1 ∩ R2 → R2. Teaches: lossless
- DB12.7 Q Is a decomposition lossless, and how r relates to the join of its projections. PYQ: 2025s1-37, 2021s1-33, IT2008-61, 2005-30, 2002-16, 1999-2.7
- DB12.8 T Dependency preserving: the dependencies that hold inside each piece (project F⁺, not just F) together imply F; otherwise checking a dependency needs a join.
- DB12.9 Q Is a decomposition dependency preserving (and in BCNF); what a non-preserving one costs. PYQ: DA2025-6, 2019-32
- DB12.10 T A lossless, dependency-preserving 3NF decomposition always exists; BCNF is always reachable losslessly, but not always with dependencies preserved.
- DB12.11 Q Which decompositions always exist. PYQ: 2026s1-21, 2014s1-30, 2005-29, 2002-2.24, 2002-1.19, 2001-2.23, 1994-3.6
- DB12.12 Q Which normal form a redesigned schema gains. PYQ: 2016s1-23
- DB12.13 L Old descriptive questions on given tables: keys, dependencies and queries. PYQ: 1993-24
- DB12.14 L Multivalued dependencies and 4NF. PYQ: IT2007-67

## DB13 · File organisation and indexing
notes: dbms/05-file-organization-indexing
hours: 2

### Files on disk
- DB13.1 T Data sits in disk blocks; with unspanned records the blocking factor is ⌊block size / record size⌋ and the file needs ⌈records / blocking factor⌉ blocks; cost is counted in block accesses. Teaches: file-org
- DB13.2 T A heap file needs a linear scan; a file sorted on a key allows binary search over its blocks, about ⌈log₂ b⌉ accesses.

### Indexes
- DB13.3 T An index holds (key, block pointer) entries. Primary index: on the ordering key of a sorted file, one entry per block (sparse). Clustering index: on a non-key ordering field. Secondary index: on any other field, one entry per record (dense). Teaches: index
- DB13.4 T Hash indexes serve only equality; tree indexes serve equality and ranges; a sparse index needs the file sorted on its key.
- DB13.5 Q Dense or sparse, clustered or not, primary or secondary, hash or tree: which suits which query. PYQ: 2026s2-36, 2024s2-16, 2015s1-24, 2013-15, 2011-39, 2008-16, 1998-1.35, 1989-4.xiv
- DB13.6 T A multilevel index indexes the index: divide by the index blocking factor (the fan-out) level by level until one block remains; a lookup costs one access per level plus the data block.
- DB13.7 Q Blocks of a data or index file, levels of a multilevel index, accesses for a lookup. PYQ: 2023-52, 2021s2-21, DA2024-45, 2008-70, 1993-14, 1990-10b

### The cost of a query
- DB13.8 T Selectivity: an equality on an attribute with d distinct values keeps about 1/d of the tuples; independent conditions multiply.
- DB13.9 Q Estimate how many tuples a selection returns. PYQ: 2021s1-23, IT2007-65
- DB13.10 T Nested-loop join: tuple-at-a-time costs b_outer + n_outer · b_inner; block nested loop costs b_outer + b_outer · b_inner; the smaller relation outside is cheaper.
- DB13.11 Q Block accesses of nested-loop joins. PYQ: 2014s2-30, IT2005-82b, IT2005-82a
- DB13.12 Q Compare the costs of query plans. PYQ: 2006-69, IT2006-85

## DB14 · B-trees and B+ trees
notes: dbms/05-file-organization-indexing
hours: 2.5

### Structure
- DB14.1 T A B-tree keeps every leaf at the same depth; each node holds keys in order with a data pointer beside each key and child pointers between them, and stays at least half full (the root may hold one key). Teaches: btree
- DB14.2 T A B+ tree keeps data pointers only in the leaves; internal nodes only guide the search, and the leaves are linked left to right for range queries. Teaches: bplus
- DB14.3 Q Why B+ trees suit disks and ranges; true statements about them. PYQ: 2019-14, 2016s2-21, 2005-28, 2000-1.22, 1999-1.25

### Order from the block size
- DB14.4 T B+ internal node with p child pointers: p·P + (p − 1)·K ≤ B; leaf with n keys: n·(K + record pointer) + next-leaf pointer ≤ B; a B-tree node also holds a data pointer per key.
- DB14.5 Q The order, the most keys or the most pointers of a node from block, key and pointer sizes. PYQ: DA2026-22, 2017s2-49, 2015s3-46, 2007-63, IT2006-61, 2004-52, 2002-2.23, IT2004-79
- DB14.6 T Minimum fill: a non-root node with order p has at least ⌈p/2⌉ children (check the definition the question gives); the root may have just two.
- DB14.7 Q The fewest or most keys or children in a node, and where the half-full rule is relaxed. PYQ: 2024s1-11, 2010-18

### Insertion, deletion and search
- DB14.8 T Insert into the right leaf; on overflow split it: a B+ tree copies the first key of the new right node up, a B-tree moves the middle key up; splits can climb to the root and make a new root.
- DB14.9 T Delete: borrow from a sibling if it has spare keys, otherwise merge with it, which can shrink the tree.
- DB14.10 Q Insert (or delete) keys and give the resulting tree, the root, or the number of splits. PYQ: 2025s2-47, 2025s1-11, DA2026-31, 2009-44, 2008-41, IT2007-85, IT2007-84, 2003-65, 2001-22, 2000-21, 1994-14a, 1989-12a
- DB14.11 T Height and size: with fan-out f a tree of height h reaches up to f^h leaves; the fewest use the minimum fill; a search reads one node per level.
- DB14.12 Q Height, node or key counts, and disk accesses of a B or B+ tree. PYQ: 2020-54, IT2005-23, 1999-21, 1997-19, 1994-14b
- DB14.13 Q The nodes visited by an exact or range search. PYQ: 2015s2-6, 2002-17

## DB15 · The ER model
notes: dbms/01-er-model
hours: 1.5

### Entities, attributes, relationships
- DB15.1 T An entity set (a rectangle) with attributes: simple or composite, single- or multivalued, derived, and a key attribute (underlined). Teaches: er-model
- DB15.2 Q Which statement about attribute values in the ER and relational models is wrong. PYQ: 2012-14
- DB15.3 T A relationship set (a diamond) has a degree (binary, ternary), a cardinality ratio (1:1, 1:N, M:N) and participation (total, a double line, or partial); an attribute of an M:N relationship belongs to the relationship.
- DB15.4 T A weak entity has no key of its own: it is identified through its owner by an identifying relationship, with total participation, and a partial key (dashed underline).
- DB15.5 Q Weak entities, participation, cardinality and notation. PYQ: 2024s2-10, 2024s1-10, 2020-14, 2018-11, IT2005-21

### From ER to tables
- DB15.6 T Each strong entity is a table; a weak entity's table includes its owner's key; an M:N relationship gets its own table (keys of both sides); a 1:N relationship folds into the N side as a foreign key; a multivalued attribute gets its own table.
- DB15.7 Q The fewest tables for an ER diagram, possibly all in 3NF. PYQ: DA2026-51, 2015s1-41, 2008-82, 2005-75, IT2004-73
- DB15.8 Q When a relationship's table can be merged into an entity's, and with which attributes. PYQ: 2017s2-17, 2008-83
- DB15.9 L Match database terms across the whole subject (old). PYQ: 1990-2.iv
