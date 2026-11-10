# Part 12 · Databases

Official GATE 2027 wording (Section 9): "ER-model. Relational model: relational algebra, tuple calculus, SQL. Integrity constraints, normal forms. File organization, indexing (e.g., B and B+ trees). Transactions and concurrency control."

Anytime track: no dates, never in the day's plan. The student finished DBMS before this syllabus existed, so every concept line is marked seen (one hard check each, teach only what the check exposes) and the PYQ patterns are the practice: she solves them herself.
Weight from the papers: 7.1 marks a paper since 2014, 7.3 since 2021. Transactions and concurrency control are about 1.7 of it, functional dependencies and normal forms 1.6, SQL 1.3, relational algebra and calculus 1.1, indexing and B+ trees 0.9, the ER model 0.3, keys and integrity 0.2.
Order: the relational model and keys first (everything uses them); then transactions (the heaviest, and they need only the basics); relational algebra (decomposition and SQL lean on its joins); functional dependencies; normal forms and decomposition; SQL; tuple calculus (its questions compare it with SQL); file organisation and B+ trees; the ER model last (the lightest, and it maps onto everything before it).
How to read this file: `##` is a topic (a unit), `###` a subtopic, each `-` line one minor topic, in this order. Nothing here uses an idea before the line that teaches it: `npm run check:syllabus` proves it.
Letters: **T** concept, **Q** question pattern from real PYQs, **N** never asked yet but inside the syllabus, **L** legacy (old papers or the old syllabus). `Teaches:` names the concepts a line introduces (`concepts.json`).
PYQ ids are newest first. See `README.md` for the rules and `npm run syllabus -- next dbms` for the next step.

## DB01 · Relational model, keys and integrity
notes: dbms/04-functional-dependencies-normal-forms
hours: 1.5

### Relations
- DB01.1 T A relation is a set of tuples over named attributes: its degree (arity) is the number of attributes, its cardinality the number of tuples; tuples have no order and, in the model, never repeat. Teaches: rel-model
- DB01.2 T A schema describes a relation (its attributes and constraints); an instance is the set of tuples at one moment.
- DB01.3 T Logical data independence (changing the logical schema without rewriting programs) is harder to achieve than physical data independence (changing storage).
- DB01.4 Q Degree, schema vs instance, and data independence. PYQ: 2023-6, 1994-3.11

### Keys
- DB01.5 T A superkey is a set of attributes whose values identify a tuple; a candidate key is a minimal superkey; the primary key is the candidate key chosen; a prime attribute belongs to some candidate key. Teaches: keys
- DB01.6 T With n attributes and one candidate key of k attributes there are 2^(n−k) superkeys; with two candidate keys, add the two counts and subtract the superkeys that contain both (inclusion-exclusion).
- DB01.7 T An instance can disprove a key (two tuples agree on it) but never prove one: being a key is a property of the schema.

### Integrity constraints
- DB01.8 T Entity integrity: no part of a primary key is ever null. Teaches: null
- DB01.9 T Referential integrity: a foreign key value must appear as a key value in the relation it refers to (or be null). Teaches: foreign-key
- DB01.10 T Deleting a referenced tuple: on delete cascade removes the referencing tuples too (and so on down the chain), set null nulls them, and the default refuses the delete.
- DB01.11 T A relation can have several foreign keys, and a foreign key can refer to its own relation.
- DB01.12 Q Count superkeys, decide which sets are superkeys, say what an instance shows about a key, and spot prime attributes. PYQ: 2026s1-55, 2016s1-21, 2014s3-22, 2014s2-22, 2014s2-21, 2011-12, 1994-3.7
- DB01.13 Q Foreign keys: which insertions or deletions break them, which tuples a cascading delete removes, which statements about them hold. PYQ: DA2026-16, DA2025-46, 2021s2-6, 2017s2-19, 2005-76, 1997-6.10

## DB02 · Transactions and concurrency control
notes: dbms/06-transactions-concurrency-control
hours: 3

### Transactions
- DB02.1 T A transaction is a unit of work that reads and writes data items and ends in commit or abort. Teaches: transaction
- DB02.2 T ACID: atomicity (all or nothing), consistency (each transaction keeps the data valid, like the sum of two accounts), isolation (as if it ran alone), durability (committed changes survive a crash).
- DB02.3 Q Which ACID property a requirement is. PYQ: 2024s2-9, 2016s1-22, 2015s2-1, IT2005-24

### Conflict serializability
- DB02.4 T A schedule interleaves the operations of several transactions; a serial schedule runs them one after another. Teaches: schedule
- DB02.5 T Two operations conflict when they belong to different transactions, touch the same item, and at least one is a write.
- DB02.6 Q When two operations conflict. PYQ: 2026s2-10
- DB02.7 T A schedule is conflict serializable if swapping adjacent non-conflicting operations can make it serial; equivalently, its precedence graph (an edge Ti → Tj for each conflict where Ti acts first) has no cycle. Teaches: conflict-serial
- DB02.8 T Every topological order of an acyclic precedence graph is a conflict-equivalent serial schedule, so counting those orders counts the equivalent serial schedules.
- DB02.9 Q Is a schedule conflict serializable; which of several schedules are. PYQ: 2025s2-43, 2021s1-32, 2020-37, 2014s3-29, 2014s1-29, 2009-43, IT2008-63, 2007-64, IT2004-77, 2003-87
- DB02.10 Q Which serial schedules are conflict equivalent to a schedule, how many there are, and how many interleavings are serializable. PYQ: 2024s1-36, 2022-29, 2017s2-44, 2016s2-22, 2010-42
- DB02.11 N View serializability: the same reads-from pairs and final writes as some serial schedule; every conflict serializable schedule is view serializable, and the extra ones contain blind writes.
- DB02.12 Q Concurrent runs that lose an update or break a rule; whether any interleaving of two transactions can be serializable. PYQ: 2025s2-17, 2012-27

### Recoverability
- DB02.13 T Recoverable: a transaction commits only after every transaction it read from has committed, so an abort never leaves a committed transaction holding dirty data. Teaches: recoverable
- DB02.14 T Cascadeless: transactions read only committed data, so one abort never forces others to roll back; strict: an item is not read or written until its last writer has committed or aborted.
- DB02.15 T Strict ⊂ cascadeless ⊂ recoverable.
- DB02.16 Q Is the schedule recoverable, cascadeless or strict (and serializable); which transactions must roll back when one aborts; what makes an error unrecoverable. PYQ: 2025s1-5, 2021s2-32, 2016s2-51, 2015s3-29, 2014s2-29, 2003-29

### Locking and timestamps
- DB02.17 T Shared locks for reading, exclusive locks for writing; two-phase locking has a growing phase that only acquires locks, then a shrinking phase that only releases them. Teaches: two-phase-locking
- DB02.18 T 2PL guarantees conflict serializability but not freedom from deadlock or from cascading aborts; strict 2PL holds exclusive locks until commit, rigorous 2PL holds every lock until commit.
- DB02.19 T Finer locks (rows rather than pages or tables) allow more concurrency.
- DB02.20 Q Is a locking scheme 2PL; can a schedule arise under 2PL; what 2PL and its variants guarantee; lock granularity. PYQ: 2024s2-17, 2016s1-51, IT2007-66, IT2004-21, 1999-2.6
- DB02.21 T Timestamp ordering: each transaction gets a timestamp when it starts; an operation that comes too late (it would read or overwrite a younger transaction's work) aborts its transaction; Thomas's write rule ignores an obsolete write instead. Teaches: timestamp
- DB02.22 T Wait-die (an older requester waits, a younger one dies) and wound-wait (an older requester wounds the holder, a younger one waits) prevent deadlock; both favour older transactions.
- DB02.23 Q 2PL vs timestamp ordering, Thomas's write rule, wait-die and wound-wait: serializability, recoverability, deadlock and starvation. PYQ: 2019-11, 2017s1-42, 2010-20

### Recovery
- DB02.24 T The log records every write with its old and new value before the data changes (write-ahead logging); after a crash, committed transactions are redone and uncommitted ones undone. Teaches: log-recovery
- DB02.25 T A checkpoint limits how far back recovery must look; a crash during recovery simply reruns the same recovery, because undo and redo are idempotent.
- DB02.26 Q Which transactions to undo and redo from a log, with or without checkpoints; final values; a crash during recovery. PYQ: 2021s1-13, 2015s2-46, 2006-20

## DB03 · Relational algebra
notes: dbms/02-relational-algebra-calculus
hours: 2

### The operators
- DB03.1 T Selection σ picks tuples, projection π picks attributes (removing duplicates), rename ρ renames; union, intersection and difference need union-compatible relations. Teaches: rel-algebra
- DB03.2 T The Cartesian product pairs every tuple of r with every tuple of s (|r| × |s| tuples); a theta join is a selection on the product; the natural join matches equal values of the common attributes and keeps one copy of them. Teaches: join
- DB03.3 T Outer joins also keep the unmatched tuples of the left, the right or both relations, padding them with nulls.
- DB03.4 T Division r ÷ s gives the values of r's other attributes that appear with every tuple of s: it answers 'for all' queries.
- DB03.5 Q Evaluate an expression on given instances: the result or its number of tuples. PYQ: DA2026-32, DA2025-52, 2024s1-25, 2019-55, 2017s1-46, 2015s2-32, 2012-50, 1998-1.33
- DB03.6 Q Sizes: the largest and smallest join from keys and foreign keys, the expected size of a selection. PYQ: 2021s1-23, IT2007-68, IT2007-65, IT2006-14, 2004-14, 1999-1.18
- DB03.7 Q What an expression computes, or which expression answers a query (including 'for all' queries and what referential integrity guarantees). PYQ: DA2025-7, 2024s2-35, DA2024-16, 2022-15, 2021s1-27, 2014s3-30, 2012-43, 2008-68, 2007-59, 2004-51, 2004-13, 2001-1.25
- DB03.8 Q What relational algebra cannot express (transitive closure), and which queries need difference. PYQ: 2001-1.24, 2000-1.23
- DB03.9 Q Equivalent and optimised expressions: pushing selections and projections, spotting a wrong rewrite. PYQ: 2018-41, 2014s3-21, 1998-2.19, 1994-3.8
- DB03.10 L Writing relational algebra for queries described in words (old descriptive style). PYQ: 2001-21.a, 1998-27, 1996-27, 1992-13b, 1991-12.b

## DB04 · Functional dependencies and keys
notes: dbms/04-functional-dependencies-normal-forms
hours: 2

### Dependencies
- DB04.1 T A functional dependency X → Y holds when any two tuples that agree on X agree on Y; like a key, it is a property of the schema, so an instance can only refute it. Teaches: fd
- DB04.2 Q Which dependencies an instance satisfies or refutes. PYQ: 2002-2.25, 2000-2.24, 1987-2n
- DB04.3 T Armstrong's axioms: reflexivity (Y ⊆ X gives X → Y), augmentation (X → Y gives XZ → YZ) and transitivity; they derive union, decomposition and pseudo-transitivity.
- DB04.4 Q Which rules always hold, what is trivial, deriving a dependency, and counting dependencies of a given kind. PYQ: 2026s2-32, 2026s1-20, 2024s2-46, 2024s1-34, 1988-12i, 1988-12iia, 1988-12iib, 1988-12iic

### Closure and keys
- DB04.5 T The closure X+ is everything X determines: start with X and keep adding the right side of any dependency whose left side is already inside. Teaches: closure
- DB04.6 T X is a superkey exactly when X+ holds every attribute; candidate keys are the minimal such sets; an attribute on no right-hand side belongs to every key.
- DB04.7 Q Find, count or test candidate keys and superkeys from the dependencies; which dependencies follow from F (and which are trivial in F+). PYQ: DA2026-7, DA2024-36, 2022-21, 2021s2-40, 2015s3-20, 2014s1-21, 2013-54, 2006-70, IT2006-60, 2005-78, IT2005-70, 1999-1.24
- DB04.8 Q The largest natural join of two relations when dependencies hold. PYQ: 2010-43
- DB04.9 T Two sets of dependencies are equivalent when each implies the other; a minimal cover has single attributes on the right, no extraneous attribute on the left and no redundant dependency.
- DB04.10 Q Equivalent sets and minimal covers. PYQ: 2017s1-16

## DB05 · Normal forms and decomposition
notes: dbms/04-functional-dependencies-normal-forms
hours: 2.5

### Normal forms
- DB05.1 T 1NF: every attribute value is atomic (no sets, no repeating groups). Teaches: normal-form
- DB05.2 T 2NF: no non-prime attribute depends on a proper subset of a candidate key (no partial dependency).
- DB05.3 T 3NF: for every nontrivial X → A, X is a superkey or A is prime; equivalently, no non-prime attribute depends transitively on a key.
- DB05.4 T BCNF: for every nontrivial X → A, X is a superkey; BCNF ⊂ 3NF ⊂ 2NF ⊂ 1NF, and every relation with two attributes is in BCNF.
- DB05.5 Q The highest normal form of a relation, given its dependencies (find the keys first). PYQ: 2025s2-36, DA2025-47, 2018-42, 2016s1-23, 2014s1-30, 2013-55, 2009-56, 2008-69, IT2008-62, IT2005-22, 2004-50, IT2004-75, 2003-85, 1997-6.9, 1995-26
- DB05.6 Q Statements about normal forms: what 1NF allows, what 3NF-but-not-BCNF implies, which form is adequate, what redundancy remains. PYQ: 2024s1-12, 2020-36, 2012-2, 2007-62, 1998-1.34, 1990-3.ii

### Decomposition
- DB05.7 T Decomposing R into R1 and R2 is lossless if joining them gives back exactly R; it is lossless exactly when R1 ∩ R2 is a superkey of R1 or of R2. Teaches: lossless
- DB05.8 T A lossy decomposition's join has extra (spurious) tuples, never fewer.
- DB05.9 T Dependency preserving: the dependencies that hold inside the parts imply all of F, so every dependency can be checked without a join.
- DB05.10 T 3NF can always be reached by a lossless, dependency-preserving decomposition; BCNF always losslessly, but not always preserving dependencies.
- DB05.11 Q Is a decomposition lossless and dependency preserving, and which normal form are the parts in. PYQ: 2025s1-37, 2021s1-33, 2019-32, IT2008-61, 2005-30, 2002-16, 1999-2.7
- DB05.12 Q What always holds about decompositions: what BCNF and 3NF guarantee, what a lost dependency costs. PYQ: 2026s1-21, DA2025-6, 2022-4, 2005-29, 2002-2.24, 2002-1.19, 2001-2.23, 1994-3.6
- DB05.13 L Designing a normalised schema in words (old descriptive style). PYQ: 1998-26
- DB05.14 L Multivalued dependencies and 4NF (asked once, in an old IT paper). PYQ: IT2007-67

## DB06 · SQL
notes: dbms/03-sql
hours: 3

### Queries and duplicates
- DB06.1 T SELECT … FROM … WHERE: FROM forms the Cartesian product of its tables, WHERE filters the rows, SELECT keeps the listed columns. Teaches: sql
- DB06.2 T SQL keeps duplicate rows unless DISTINCT is used (multiset semantics), so SELECT DISTINCT … FROM r1, …, rm WHERE P equals π(σP(r1 × … × rm)), and SQL's SELECT clause is projection, not selection.
- DB06.3 Q Which relational algebra expression a query equals; duplicates; rows returned on given tables. PYQ: DA2024-21, 2023-51, 2015s1-7, 2011-32, IT2005-68, 2003-86, 2003-30, 2000-2.25, 1999-2.25
- DB06.4 T Joins in SQL: INNER JOIN … ON, NATURAL JOIN, and LEFT, RIGHT or FULL OUTER JOIN, which pad unmatched rows with NULL.
- DB06.5 Q Results of inner and outer joins on given tables. PYQ: 2018-12

### Aggregates and subqueries
- DB06.6 T Aggregates (COUNT, SUM, AVG, MIN, MAX) ignore NULLs, except COUNT(*), which counts rows. Teaches: sql-aggregate
- DB06.7 T GROUP BY forms groups and HAVING filters groups; every selected column must be grouped or aggregated; HAVING without GROUP BY treats the whole table as one group.
- DB06.8 T IN, EXISTS, ALL and ANY (SOME) test a subquery; NOT IN fails for every row once the subquery returns a NULL. Teaches: subquery
- DB06.9 T A correlated subquery refers to the outer row and is evaluated once per row: 'fewer than k rows beat this one' gives the top k.
- DB06.10 Q Aggregates, GROUP BY and HAVING: the output on given tables, or what a query computes. PYQ: DA2026-41, 2021s2-31, 2020-13, 2019-51, 2017s1-23, 2016s2-52, 2015s1-27, 2014s1-54, 2012-15, 2011-46, IT2008-74, 2006-67, 2004-53
- DB06.11 Q IN, NOT IN and EXISTS subqueries: the output on given tables, what a query computes, which queries are equivalent (with duplicates in mind). PYQ: 2025s2-44, 2025s1-45, 2022-46, 2014s3-54, 2014s2-54, 2010-19, 2009-55, 2007-61, 2006-68, IT2006-85, IT2006-84, IT2005-69
- DB06.12 Q ALL and ANY comparisons and correlated counting (the top k, more than the largest): what is returned. PYQ: DA2026-50, DA2025-23, 2017s2-46, 2015s3-3, 2012-51, 2005-77

### NULLs
- DB06.13 T A comparison with NULL is unknown; WHERE keeps only the rows where the condition is true, so unknown rows are dropped; IS NULL is the only test that finds NULLs. Teaches: three-valued
- DB06.14 Q Results of queries over NULLs: comparisons, aggregates, and conditions that turn unknown. PYQ: IT2004-78, IT2004-76, 2000-2.26

### Constraints and updates
- DB06.15 T CREATE TABLE declares primary keys, foreign keys (with ON DELETE actions) and CHECK constraints; an assertion is a CHECK over several tables.
- DB06.16 T An UPDATE's WHERE is evaluated row by row on the current data, so two updates run in the wrong order can both touch the same row.
- DB06.17 Q Constraints in SQL, cascading deletes, and the effect of inserts and updates. PYQ: 2014s1-22, IT2005-67, IT2004-74, 2001-2.25
- DB06.18 L Writing SQL (or algebra and SQL) for queries described in words (old descriptive style). PYQ: 2002-15, 2001-21.b, 2001-21.c, 2000-22, 1999-22.a, 1999-22.b, 1998-7.a, 1997-76.a, 1997-76.b, 1995-27, 1994-13, 1993-24, 1991-12.a, 1990-10.a, 1988-12iii, 1988-12iv

## DB07 · Tuple relational calculus
notes: dbms/02-relational-algebra-calculus
hours: 1

### Calculus
- DB07.1 T Tuple relational calculus describes the result by a condition: {t | P(t)}, with ∃ and ∀ ranging over the tuples of relations. Teaches: trc
- DB07.2 T ¬∀ is ∃¬, and ∀t ∈ r (P(t)) is ¬∃t ∈ r (¬P(t)): most 'which expression is equivalent' questions turn on these two.
- DB07.3 Q Which algebra expression or SQL query a calculus expression equals, or what it returns. PYQ: 2026s1-33, DA2026-49, 2025s1-29, 2013-35, 2009-45, 2008-15, IT2008-75, 2007-60, 1999-1.19
- DB07.4 T A safe expression has a finite answer drawn from values in the database; safe tuple calculus, safe domain calculus and relational algebra are equally expressive.
- DB07.5 Q Which expressions are safe; which query languages have the same power. PYQ: 2017s1-41, IT2006-15, 2002-1.20, 2001-2.24
- DB07.6 L Writing calculus for queries described in words (old descriptive style). PYQ: 1993-23

## DB08 · File organisation, indexing and B+ trees
notes: dbms/05-file-organization-indexing
hours: 3

### Files and indexes
- DB08.1 T Records live in disk blocks: blocking factor = ⌊block size ÷ record size⌋ when records don't span blocks; a heap file is unordered, a sorted file is ordered on a field. Teaches: file-org
- DB08.2 T A primary index is on the ordering key of a sorted file and is sparse (one entry per block); a clustering index is on an ordering non-key field (one entry per distinct value); a secondary index is on a non-ordering field and is dense (one entry per record). Teaches: index
- DB08.3 T Searching a sorted file by binary search costs about log2(blocks) reads; a single-level index costs log2(index blocks) + 1; a multilevel index costs one block per level plus the data block.
- DB08.4 Q Blocks needed, index sizes and the block reads a search takes with primary, clustering, secondary or multilevel indexes. PYQ: 2023-52, 2021s2-21, 2008-70, 1993-14, 1990-10b

### B-trees and B+ trees
- DB08.5 T A B-tree of order p: each node has at most p children and p − 1 keys, every node except the root is at least half full, and all leaves are at the same depth. Teaches: btree
- DB08.6 T A B+ tree keeps every key and record pointer in the leaves, which are linked for range scans; internal nodes hold only keys and child pointers, so they fit more of them (a higher fan-out). Teaches: bplus
- DB08.7 T Order from the block size: an internal node with p children needs p × (block pointer) + (p − 1) × (key) ≤ block size; a leaf needs (pairs) × (key + record pointer) + one block pointer ≤ block size.
- DB08.8 Q The order of internal and leaf nodes from block, key and pointer sizes. PYQ: DA2026-22, 2017s2-49, 2015s3-46, 2007-63, IT2006-61, 2004-52, 2002-2.23
- DB08.9 T Insertion goes into the right leaf; an overfull node splits and pushes its middle key up (a B+ leaf copies it up), and the tree grows only at the root.
- DB08.10 Q Insert keys into a B-tree or B+ tree: the tree that results, the number of splits, the nodes that change. PYQ: 2025s2-47, 2025s1-11, 2009-44, 2008-41, IT2007-85, IT2007-84, IT2005-23, 2003-65, 2001-22, 2000-21, 1994-14a, 1989-12a
- DB08.11 Q Fewest and most keys or nodes for a height; minimum occupancy; the nodes or blocks a search or range query reads. PYQ: DA2026-31, 2024s1-11, 2020-54, 2015s2-6, 2010-18, IT2004-79, 2002-17, 1999-21, 1997-19, 1994-14b
- DB08.12 Q Why B+ trees: balanced paths, few disk accesses, fast range queries. PYQ: 2019-14, 2016s2-21, 2005-28, 2000-1.22, 1999-1.25

### Choosing an access path
- DB08.13 Q Kinds of index: dense or sparse, clustered or not, on which fields; which file organisation or index speeds up a query. PYQ: 2026s2-36, 2024s2-16, DA2024-45, 2015s1-24, 2013-15, 2011-39, 2008-16, 1998-1.35, 1989-4.xiv
- DB08.14 Q Block accesses of a nested-loop join or a query plan, and which relation should be the outer one. PYQ: 2014s2-30, 2006-69, IT2005-82a, IT2005-82b

## DB09 · The ER model
notes: dbms/01-er-model
hours: 1.5

### Entities and relationships
- DB09.1 T The ER model describes entity sets (with simple or composite, single- or multivalued, and derived attributes) and the relationship sets among them. Teaches: er-model
- DB09.2 T Cardinality is one-to-one, one-to-many or many-to-many; participation is total (every entity takes part: a double line) or partial.
- DB09.3 T A weak entity set has no key of its own: it is identified by its owner's key plus its own partial key, through an identifying relationship (a double diamond) in which it participates totally.
- DB09.4 Q Weak entities, identifying relationships and ER notation; modelling a specification; statements about the ER and relational models. PYQ: 2024s2-10, 2024s1-10, 2020-14, 2012-14, IT2005-21
- DB09.5 T To tables: each strong entity set becomes a table; a many-to-many relationship gets its own table with the keys of both sides; a one-to-many relationship becomes a foreign key on the 'many' side; a one-to-one with total participation can merge into one table; a multivalued attribute gets its own table.
- DB09.6 Q The fewest tables for an ER diagram, and the attributes and keys of those tables. PYQ: DA2026-51, 2018-11, 2017s2-17, 2015s1-41, 2008-83, 2008-82, 2005-75, IT2004-73

### Putting it together
- DB09.7 Q Match terms and ideas across the subject: schemas, indexes and B-trees, query languages, closures and dependencies, joins and algebra. PYQ: 2026s2-5, 1990-2.iv
