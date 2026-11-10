# Part 9 · Discrete Mathematics

Official GATE 2027 wording (Section 1): "Discrete Mathematics: Propositional and first order logic. Sets, relations, functions, partial orders and lattices. Monoids, Groups. Graphs: connectivity, matching, colouring. Combinatorics: counting, recurrence relations, generating functions."

Taught in the 2nd slot after Compiler Design, interleaved with Engineering Mathematics (Part 10) in one order: linear algebra, counting, probability, sets, relations and functions, graph theory, algebra, combinatorics, calculus, logic. Weight from the CS papers since 2021, marks a paper: graph theory 2.8, sets, relations, functions and groups 2.4, combinatorics 1.3, logic 0.8 (1.6 since 2014). Counting comes first because probability is built on it; logic comes last because it is asked least now.
How to read this file: `##` is a topic (a unit), `###` a subtopic, each `-` line one minor topic to teach, in this order. Nothing here uses an idea before the line that teaches it: `npm run check:syllabus` proves it.
Letters: **T** concept, **Q** question pattern from real PYQs, **N** never asked yet but inside the syllabus, **L** legacy (old papers or the old syllabus). `Teaches:` names the concepts a line introduces (`concepts.json`).
PYQ ids are newest first. See `README.md` for the rules and `npm run syllabus` for the next step. Graphs as data structures, BFS, DFS and MSTs come from Parts 3 and 4.

## CM01 · Counting
notes: discrete-maths/01-counting
hours: 2

### The rules
- CM01.1 T Sum rule and product rule; permutations P(n, r) = n!/(n − r)!; combinations C(n, r) = n!/(r!(n − r)!); arrangements of a multiset n!/(n₁! n₂! …); strings of length n over k symbols: kⁿ. Teaches: counting
- CM01.2 Q Count strings, numbers, arrangements, selections and matrices under constraints. PYQ: 2026s1-2, 2025s1-20, 2023-38, 2021s2-50, 2021s1-19, 2019-5, 2015s3-5, 2014s1-49, IT2008-25, 2007-85, 2007-84, IT2007-80, IT2005-46, 2004-75, 2003-5, 2003-4, 2001-2.1, 1999-2.2, 1998-1.23, 1994-1.15, 1991-16.a, 1991-02.iv, 1990-3.iii, 1990-3.ix, 1989-4.i
- CM01.3 T Inclusion–exclusion: |A ∪ B ∪ C| = Σ|A| − Σ|A ∩ B| + |A ∩ B ∩ C|. Teaches: inclusion-exclusion
- CM01.4 T Derangements: Dₙ = n!(1 − 1/1! + 1/2! − … ± 1/n!), the arrangements with nothing in its own place.
- CM01.5 Q Count with inclusion–exclusion: divisibility, derangements (also of words with repeated letters). PYQ: 2020-42, 2017s1-47

### Numbers
- CM01.6 T n = ∏ pᵢ^eᵢ has ∏(eᵢ + 1) divisors.
- CM01.7 T The power of a prime p in n! is Σ ⌊n/pᵏ⌋ (Legendre).
- CM01.8 T Fermat: a^(p−1) ≡ 1 (mod p) for a prime p not dividing a, which shrinks big modular powers.
- CM01.9 Q Count divisors; the power of a prime in a factorial; modular powers; sums of binomials. PYQ: 2019-21, 2016s2-29, 2015s2-9, 2015s1-26, 2014s2-49, IT2008-24, IT2007-16, IT2005-34, 1995-7

## SR01 · Sets
notes: discrete-maths/02-sets-relations-functions
hours: 1.5

### Sets and their algebra
- SR01.1 T Sets, subsets, the power set (2ⁿ subsets), union, intersection, difference, complement, symmetric difference and their laws; Cartesian products; cardinality of finite sets. Teaches: set-ops
- SR01.2 Q Set identities, power sets, cardinalities and families of subsets. PYQ: 2021s2-37, 2016s2-28, 2015s3-23, 2015s2-18, 2015s1-16, 2014s2-50, 2008-2, 2006-24, 2006-22, IT2006-24, IT2006-23, 2005-8, IT2005-33, IT2004-2, 2001-3, 2001-2.2, 2000-6, 2000-2.6, 1998-2.4, 1996-1.1, 1995-25b, 1995-1.20, 1994-2.4, 1993-17, 1993-8.4, 1993-8.3
- SR01.3 T Countable and uncountable: the integers, the rationals and finite strings are countable; the reals, the subsets of ℕ and the functions ℕ → {0, 1} are uncountable (Cantor's diagonal argument).
- SR01.4 Q Which sets are countable. PYQ: 2018-27, 1994-3.9

## SR02 · Relations
notes: discrete-maths/02-sets-relations-functions
hours: 2

### Properties and counts
- SR02.1 T A relation on A is a subset of A × A. Teaches: relation
- SR02.2 T Properties: reflexive, irreflexive, symmetric, antisymmetric, asymmetric, transitive; check each on the pairs or the matrix.
- SR02.3 T A partial order is a relation that is reflexive, antisymmetric and transitive (≤ on numbers, ⊆ on sets, divides on integers); a total order also compares every pair. Teaches: poset
- SR02.4 T Counting relations on n elements: all 2^(n²); reflexive 2^(n² − n); symmetric 2^(n(n+1)/2); antisymmetric 2ⁿ · 3^(n(n−1)/2); reflexive and symmetric 2^(n(n−1)/2).
- SR02.5 Q Which properties a relation has; how many relations have given properties. PYQ: 2026s2-16, 2021s1-43, 2020-17, 2016s2-26, 2015s3-41, 2015s2-16, 2010-3, 2009-4, 2007-2, 2006-4, 2004-24, 2002-3, 2002-2.17, 2001-1.2, 2000-2.5, 1999-3, 1999-1.2, 1998-10a, 1998-10b, 1998-2.3, 1998-1.7, 1998-1.6, 1997-14, 1997-6.3, 1996-8, 1996-2.2, 1995-1.19, 1994-2.3, 1992-15.b, 1989-1.iv, 1987-9a, 1987-9e, 1987-2d

### Equivalence and closures
- SR02.6 T An equivalence relation (reflexive, symmetric, transitive) splits A into equivalence classes, and every partition comes from one.
- SR02.7 T The union of two equivalence relations need not be one; the intersection is.
- SR02.8 T Closures add the fewest pairs to get a property; the transitive closure is reachability.
- SR02.9 Q Equivalence relations and classes; unions and intersections of relations; computing closures. PYQ: 2005-42, 2005-7, IT2004-4

## SR03 · Functions
notes: discrete-maths/02-sets-relations-functions
hours: 1.5

### Kinds of functions
- SR03.1 T One-to-one (injective), onto (surjective), bijective; the inverse of a bijection. Teaches: function-kinds
- SR03.2 T For g∘f: if g∘f is onto then g is onto; if g∘f is one-to-one then f is one-to-one.
- SR03.3 Q Properties of functions and of their compositions; sets that are or are not in bijection. PYQ: 2025s1-7, 2024s1-22, 2023-39, 2021s2-11, 2016s1-28, 2015s1-5, 2014s3-2, 2005-43, IT2005-31, 2003-39, 2003-37, 2001-4, 2001-2.3, 1998-1.8, 1997-13, 1996-2.1, 1996-1.3, 1993-8.6, 1989-13c, 1988-13ii, 1987-9b
- SR03.4 T Counting functions from an m-set to an n-set: all nᵐ; one-to-one n!/(n − m)!; bijections n! (m = n); onto Σₖ (−1)ᵏ C(n, k)(n − k)ᵐ by inclusion–exclusion.
- SR03.5 Q Count functions of a kind (onto, one-to-one, with fixed points, Boolean). PYQ: DA2026-23, 2015s2-54, 2015s2-40, 2014s3-49, 2014s1-50, 2012-37, 2007-3, 2006-25, 2006-2, IT2006-6

## GT01 · Graph basics
notes: discrete-maths/03-graph-theory
hours: 2

### Degrees and special graphs
- GT01.1 T In any graph the degrees add up to 2e, so the number of odd-degree vertices is even. Teaches: graph-basics
- GT01.2 T Kₙ has n(n − 1)/2 edges; a k-regular graph on n vertices has nk/2; a bipartite graph on n vertices has at most ⌊n²/4⌋; the complement has the missing edges.
- GT01.3 Q Degrees, degree sequences (which are graphic), edge counts, adjacency-matrix facts. PYQ: 2022-42, 2022-20, 2017s2-23, 2014s2-3, 2014s1-52, 2013-25, 2010-28, 2010-1, 2009-3, 2006-73, 2006-72, 2006-71, IT2004-37, 2003-40, 2003-8, 2002-1.25, 1995-1.25, 1994-2.5, 1993-8.1, 1992-03.iii, 1991-01.xv
- GT01.4 T Isomorphic graphs have the same degree sequence, but the same degree sequence does not make them isomorphic.
- GT01.5 T A self-complementary graph has n(n − 1)/4 edges, so n ≡ 0 or 1 (mod 4).
- GT01.6 T Labelled graphs on n vertices: 2^(n(n−1)/2).
- GT01.7 Q Isomorphism, self-complementary graphs, counting labelled graphs. PYQ: 2015s2-28, 2014s2-51, 2012-38, 2012-26, 2004-79, 2001-2.15, 1994-1.6, 1990-1.viii.b
- GT01.8 L Old proofs about degrees. PYQ: 1995-24, 1991-16.b, 1987-9c

## GT02 · Connectivity, Euler circuits and spanning trees
notes: discrete-maths/03-graph-theory
hours: 2

### Connectivity
- GT02.1 T A forest on n vertices with k components has n − k edges; a connected graph needs at least n − 1. Teaches: connectivity-gt
- GT02.2 T A simple graph with more than C(n − 1, 2) edges is connected.
- GT02.3 T A bridge is an edge whose removal disconnects the graph; a cut vertex likewise.
- GT02.4 Q Edges and components, bridges and cut vertices, diameters, line graphs. PYQ: 2022-27, 2021s1-36, 2015s2-50, 2014s3-51, 2014s1-51, IT2008-27, IT2007-25, IT2005-56, IT2004-5, 1999-5, 1999-1.15, 1988-2xvi, 1987-9d
- GT02.5 T An Euler circuit exists iff the graph is connected (ignoring isolated vertices) and every degree is even; an Euler trail iff exactly 0 or 2 degrees are odd.
- GT02.6 T Hamiltonian cycles (through every vertex once) have no such simple test.
- GT02.7 Q Which graphs have Euler circuits or Hamiltonian cycles. PYQ: 2019-12, 2007-23
- GT02.8 T Spanning trees: Kₙ has nⁿ⁻² (Cayley); for a small graph count by deleting or contracting edges.
- GT02.9 T Facts about minimum spanning trees come from Algorithms.
- GT02.10 Q Count spanning trees; statements about spanning trees of weighted graphs. PYQ: 2026s2-26, 2024s2-41, 2024s1-24, 2019-38, IT2006-11

## GT03 · Planarity, colouring and matching
notes: discrete-maths/03-graph-theory
hours: 2.5

### Matching and covering
- GT03.1 T A matching is a set of edges with no shared vertex; a vertex cover touches every edge; the complement of a vertex cover is an independent set. Teaches: matching
- GT03.2 T In a bipartite graph the largest matching equals the smallest vertex cover (König); Kₙ,ₙ has n! perfect matchings.
- GT03.3 Q Matchings, perfect matchings, vertex covers and independent sets. PYQ: 2026s1-47, 2026s1-37, 2024s2-7, 2005-11, 2004-76, 2003-36

### Colouring
- GT03.4 T The chromatic number χ is the fewest colours with adjacent vertices different. χ ≤ Δ + 1; χ = 2 iff bipartite (no odd cycle); χ(Kₙ) = n; an odd cycle needs 3. Teaches: colouring
- GT03.5 Q Chromatic numbers of given graphs and families. PYQ: 2026s1-45, 2024s2-50, 2024s1-41, 2023-45, 2020-52, 2018-18, 2009-2, IT2008-3, IT2006-25, 2004-77, 2002-1.4

### Planar graphs
- GT03.6 T A connected planar graph has v − e + f = 2 (Euler). Teaches: planarity
- GT03.7 T Simple planar graphs have e ≤ 3v − 6 (e ≤ 2v − 4 without triangles) and a vertex of degree at most 5.
- GT03.8 T K₅ and K₃,₃ are not planar (Kuratowski).
- GT03.9 T Every planar graph is 4-colourable.
- GT03.10 Q Faces, edges and degrees of planar graphs; which graphs are planar. PYQ: 2022-40, 2021s1-16, 2016s2-03, 2015s1-54, 2014s3-52, 2013-26, 2012-17, 2011-17, 2008-23, 2005-47, 2005-10, 1992-02.viii, 1992-01.x, 1990-3.xi, 1989-3.vi, 1987-2e

## AL01 · Partial orders and lattices
notes: discrete-maths/04-algebra
hours: 1.5

### Posets
- AL01.1 T Hasse diagrams of partial orders: maximal and minimal elements, greatest and least, upper and lower bounds; chains and antichains; the total orders that extend a partial order are its topological orders.
- AL01.2 Q Hasse diagrams, bounds, chains, and counting the total orders compatible with a partial order. PYQ: 2024s2-24, 2007-26, IT2007-23, 2003-31, 1998-11, 1997-6.1, 1996-1.2, 1993-8.5, 1991-01.xiv

### Lattices
- AL01.3 T A lattice is a poset where every pair has a join (least upper bound) and a meet (greatest lower bound). Teaches: lattice
- AL01.4 T Distributive iff it has no sublattice shaped like M₃ or N₅; complemented if every element has a complement; Boolean = distributive and complemented.
- AL01.5 Q Is it a lattice; is it distributive or complemented; the complements of an element. PYQ: 2025s2-32, 2017s2-21, 2015s1-34, IT2008-28, 2005-9, 2004-73, 2002-4, 1999-2.3, 1997-3.3, 1994-2.9, 1992-14b, 1990-17c, 1988-1vii

## AL02 · Groups
notes: discrete-maths/04-algebra
hours: 2

### Algebraic structures
- AL02.1 T A binary operation may be closed, associative, commutative, and have an identity and inverses. Teaches: group
- AL02.2 T Closed + associative = semigroup; + identity = monoid; + inverses = group; + commutative = abelian group.
- AL02.3 Q Properties of a binary operation; is a structure a semigroup, monoid or group. PYQ: 2025s1-39, 2024s1-42, 2023-41, 2015s3-2, 2015s1-28, 2013-1, 2010-4, 2009-1, 2006-28, 2006-3, IT2006-2, 2005-46, 2003-38, 1994-2.2, 1989-1.v
- AL02.4 T The order of an element divides the order of the group, and so does the order of every subgroup (Lagrange).
- AL02.5 T A group of prime order is cyclic.
- AL02.6 T Zₙ is cyclic with φ(n) generators and one subgroup for each divisor of n.
- AL02.7 Q Subgroup sizes, cyclic groups and generators, inverses from a group table, small groups up to isomorphism. PYQ: 2024s2-53, 2022-17, 2021s1-34, 2020-18, 2019-10, 2018-19, 2014s3-50, 2014s3-3, 2009-22, 2007-21, 2005-13, 2004-72, 2003-7, 2002-1.6, 2000-4, 1999-4, 1998-12, 1997-3.1, 1996-2.4, 1996-1.4, 1995-21, 1995-2.17, 1994-1.10, 1993-28, 1992-14a, 1990-2.x, 1988-2xviii

## CM02 · Recurrences, generating functions and distributions
notes: discrete-maths/01-counting
hours: 2

### Recurrences
- CM02.1 T Solve aₙ = c₁aₙ₋₁ + c₂aₙ₋₂ from its characteristic equation: distinct roots give A·rⁿ + B·sⁿ, a repeated root (A + Bn)rⁿ.
- CM02.2 T Set up recurrences from counting: n-bit strings without two consecutive 1s follow Fibonacci.
- CM02.3 Q Solve or set up a recurrence; closed forms of sums defined recursively. PYQ: 2023-5, 2022-41, 2016s1-27, 2016s1-2, IT2004-34, 1996-9

### Generating functions
- CM02.4 T The generating function of a₀, a₁, … is Σ aₙxⁿ. Teaches: gen-function
- CM02.5 T Key forms: 1/(1 − x) = Σ xⁿ, 1/(1 − ax) = Σ aⁿxⁿ, 1/(1 − x)² = Σ (n + 1)xⁿ; a coefficient counts the ways to make up a total.
- CM02.6 Q Closed forms of generating functions and their coefficients. PYQ: 2022-26, 2018-1, 2017s2-47, 2016s1-26, 2005-50, 1987-10b

### Distributing objects
- CM02.7 T k identical balls into n distinct boxes: C(k + n − 1, n − 1) (stars and bars); distinct balls into distinct boxes: nᵏ; identical balls into identical bins: partitions of k.
- CM02.8 T Pigeonhole: more objects than boxes forces a shared box.
- CM02.9 T Catalan numbers count binary trees and balanced sequences.
- CM02.10 Q Balls into bins, the pigeonhole principle, Catalan counts. PYQ: 2022-22, 2005-44, IT2004-35, 2003-34, 2002-13, 2000-5, 2000-1.1, 1999-1.3
- CM02.11 Q Polynomials, roots and summation identities. PYQ: 2017s2-24, 2014s2-5, 2008-24, 2000-2.4, 1997-4.4, 1994-15
- CM02.12 L Proofs by induction. PYQ: 2000-3, 1995-23

## LG01 · Propositional logic
notes: discrete-maths/05-logic
hours: 2

### Formulas and equivalence
- LG01.1 T Connectives and truth tables. p → q ≡ ¬p ∨ q, false only when p is true and q false; its contrapositive ¬q → ¬p is equivalent, its converse q → p is not. Teaches: prop-logic
- LG01.2 T A tautology is always true, a contradiction never; two formulas are equivalent when their biconditional is a tautology.
- LG01.3 Q Equivalent formulas, tautologies and contradictions. PYQ: DA2024-19, 2021s2-15, 2021s1-7, 2017s1-29, 2017s1-01, 2016s2-01, 2015s1-14, 2014s2-53, 2014s1-53, 2009-24, 2008-31, 2006-27, 2005-40, 2004-70, 2002-5b, 2001-1.3, 2000-2.7, 1999-14, 1997-3.2, 1996-2.3, 1995-2.19, 1994-3.13, 1993-8.2, 1992-02.xvi, 1991-03.xii, 1990-3.x, 1989-3.v, 1988-2vii
- LG01.4 Q English statements into propositional logic; valid inferences and truth-teller puzzles. PYQ: 2024s2-2, 2017s2-11, 2016s1-1, 2015s3-24, 2015s2-3, 2014s3-1, 2012-1, IT2004-31, 2002-1.8, 1998-1.5, 1993-18, 1987-10e
- LG01.5 T Normal forms (CNF, DNF) and resolution: from (p ∨ q) and (¬p ∨ r) infer (q ∨ r); a set of clauses is unsatisfiable iff resolution derives the empty clause.
- LG01.6 Q Normal forms and resolution. PYQ: 2003-72, 1995-13

## LG02 · First-order logic
notes: discrete-maths/05-logic
hours: 2

### Quantifiers
- LG02.1 T Predicates are statements about elements of a domain, and the quantifiers ∀ and ∃ range over it. Teaches: fol
- LG02.2 T ¬∀x P(x) ≡ ∃x ¬P(x) and ¬∃x P(x) ≡ ∀x ¬P(x).
- LG02.3 T ∀ distributes over ∧ and ∃ over ∨, not the other way round.
- LG02.4 T ∃x∀y R(x, y) implies ∀y∃x R(x, y), not conversely.
- LG02.5 T Translating English: 'all A are B' is ∀x (A(x) → B(x)); 'some A are B' is ∃x (A(x) ∧ B(x)); 'not all A are B' is ∃x (A(x) ∧ ¬B(x)).
- LG02.6 Q Translate English into first-order logic. PYQ: 2026s2-1, 2025s1-38, 2014s3-53, 2014s1-1, 2013-27, 2012-13, 2010-30, 2009-23, 2008-30, 2007-22, 2006-26, 2005-41, 2004-23, IT2004-3, 1989-14a
- LG02.7 Q Valid formulas, equivalences and negations with quantifiers. PYQ: 2025s2-5, 2023-16, 2020-39, 2019-35, 2018-28, 2017s1-02, 2016s2-27, 2015s2-55, 2013-47, 2011-30, 2009-26, IT2008-22, IT2008-21, IT2007-21, IT2006-21, IT2005-36, 2003-33, 2003-32, 1992-92.xv, 1992-15.a, 1991-15.b
