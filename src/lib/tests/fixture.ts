// A small mock test used by the unit tests.
const FENCE = "```";

export const SAMPLE = `---
title: OS + DBMS · Sample
duration: 30
created: 2026-10-15
---

Instructions before Q1 are ignored.

## Q1
type: MCQ
marks: 1
subject: os
topic: Deadlock
answer: B

Which is **not** a necessary condition for deadlock?

(A) Mutual exclusion
(B) Preemption
(C) Hold and wait
(D) Circular wait

### Solution
Deadlock needs *no* preemption.

## Q2
type: MSQ
marks: 2
subject: dbms
topic: functional-dependencies-normal-forms
answer: A, C

Which are true for BCNF?

(A) Every BCNF relation is in 3NF
(B) Every 3NF relation is in BCNF
(C) BCNF removes all FD-based redundancy
(D) BCNF always preserves dependencies

### Solution
A and C.

## Q3
type: NAT
marks: 2
subject: os
topic: cpu-scheduling
answer: 4.50 to 4.60

Average waiting time (ms)?

${FENCE}
## Q9 inside a code block is not a question
(A) nor is this an option
${FENCE}

## Q4
type: MCQ
marks: 2
subject: general-aptitude
answer: (C)

Pick C.

(A) a
(B) b
(C) c
(D) d
`;
