# Part 10 · Engineering Mathematics

Official GATE 2027 wording (Section 1): "Linear Algebra: Matrices, determinants, system of linear equations, eigenvalues and eigenvectors, LU decomposition. Calculus: Limits, continuity and differentiability, Maxima and minima, Mean value theorem, Integration. Probability and Statistics: Random variables, Uniform, normal, exponential, Poisson and binomial distributions. Mean, median, mode and standard deviation. Conditional probability and Bayes theorem."

Taught in the 2nd slot after Compiler Design, interleaved with Discrete Mathematics (Part 9) in one order: linear algebra, counting, probability, sets, relations and functions, graph theory, algebra, combinatorics, calculus, logic. Weight from the CS papers since 2021, marks a paper: probability 3.2, linear algebra 2.7, calculus 1.5. Eigenvalues are half of linear algebra; conditional probability, expectation and the standard distributions most of probability.
Questions from the DS&AI papers on topics outside the CS syllabus (Bayesian networks, chi-square, SVD, projections) are legacy here.
How to read this file: `##` is a topic (a unit), `###` a subtopic, each `-` line one minor topic to teach, in this order. Nothing here uses an idea before the line that teaches it: `npm run check:syllabus` proves it.
Letters: **T** concept, **Q** question pattern from real PYQs, **N** never asked yet but inside the syllabus, **L** legacy (old papers or the old syllabus). `Teaches:` names the concepts a line introduces (`concepts.json`).
PYQ ids are newest first. See `README.md` for the rules and `npm run syllabus` for the next step.

## LA01 · Matrices, determinants and rank
notes: engineering-maths/01-linear-algebra
hours: 2.5

### Matrix algebra
- LA01.1 T Matrix product (rows times columns, not commutative), transpose ((AB)ᵀ = BᵀAᵀ), identity, inverse ((AB)⁻¹ = B⁻¹A⁻¹), symmetric (A = Aᵀ), skew-symmetric, triangular, orthogonal (AᵀA = I), idempotent (A² = A). Teaches: matrix-algebra

### Determinants
- LA01.2 T det by cofactor expansion; triangular: product of the diagonal. Teaches: determinant
- LA01.3 T Swapping two rows flips the sign, scaling a row scales det, adding a multiple of a row changes nothing. det(AB) = det A · det B, det(Aᵀ) = det A, det(kA) = kⁿ det A, det(A⁻¹) = 1/det A; A is invertible iff det A ≠ 0.
- LA01.4 Q Evaluate a determinant; how row operations and products change it; when a matrix is invertible. PYQ: 2026s2-52, 2025s2-4, 2024s2-37, DA2024-25, 2023-8, 2019-9, 2014s2-4, 2013-3, IT2005-3, IT2004-32, 2000-1.3, 1998-2.2, 1997-1.3

### Rank
- LA01.5 T Vectors are linearly independent when no non-trivial combination of them is zero. Teaches: matrix-rank, vector-space
- LA01.6 T Rank = the number of independent rows (= independent columns) = the nonzero rows left after elimination. rank(AB) ≤ min(rank A, rank B); rank + nullity = number of columns.
- LA01.7 Q Rank of a matrix, of a sum or product; the null space from the rank. PYQ: 2021s2-24, 2020-27, 2017s2-22, 2002-1.1, 1998-2.1, 1995-1.24, 1994-1.9
- LA01.8 Q Matrix identities and products; powers; inverses; singular matrices; counting matrices of a kind. PYQ: 2026s1-10, DA2026-42, DA2026-11, 2025s2-1, DA2025-27, 2022-10, 2015s2-27, IT2008-29, 2006-23, 2004-27, 2004-26, IT2004-36, 2001-1.1, 1997-4.2, 1996-10, 1996-2.6, 1994-3.12, 1994-1.2, 1993-02.7, 1987-1.xxiii

## LA02 · Linear systems, LU and vector spaces
notes: engineering-maths/01-linear-algebra
hours: 2

### Systems of equations
- LA02.1 T Ax = b is consistent iff rank(A) = rank([A | b]); the solution is unique iff that rank equals the number of unknowns, otherwise there are infinitely many. Teaches: linear-system
- LA02.2 T Ax = 0 always has x = 0 and has a non-trivial solution iff rank(A) < n (det A = 0 when A is square).
- LA02.3 Q How many solutions a system has; the parameter values giving none, one or infinitely many. PYQ: 2026s2-21, 2025s1-13, DA2025-3, 2024s1-39, DA2024-38, 2017s1-3, 2016s2-04, 2015s3-33, 2014s1-4, 2008-3, 2005-48, 2004-71, IT2004-6, 2003-41, 1998-1.2, 1996-1.7

### LU decomposition
- LA02.4 T Gaussian elimination writes A = LU, L lower-triangular (often with 1s on its diagonal) and U upper-triangular; solve Ly = b by forward substitution, then Ux = y by back substitution. Teaches: lu
- LA02.5 Q Find L and U, solve a system with them, count the operations. PYQ: 2025s2-34, DA2025-2, 2022-35, 2015s1-18, 1998-9, 1988-16i

### Vector spaces
- LA02.6 T Span, basis and dimension; a subspace contains 0 and is closed under addition and scaling. dim(U + W) = dim U + dim W − dim(U ∩ W).
- LA02.7 Q Linear independence, subspaces and their dimensions; vectors at given angles and norms. PYQ: DA2026-12, DA2024-37, 2017s1-30, 2014s3-5, 2007-27, 1995-2.13
- LA02.8 L DS&AI-paper linear algebra outside the CS syllabus: orthonormal bases, projections, Gram matrices. PYQ: DA2025-28, DA2025-15, DA2024-39

## LA03 · Eigenvalues and eigenvectors
notes: engineering-maths/01-linear-algebra
hours: 2.5

### Finding them
- LA03.1 T Av = λv with v ≠ 0. Teaches: eigen
- LA03.2 T The eigenvalues are the roots of det(A − λI) = 0; their sum is the trace and their product the determinant.
- LA03.3 T A triangular matrix has its eigenvalues on its diagonal.
- LA03.4 Q Eigenvalues from the characteristic equation or from trace and determinant; unknown entries from given eigenvalues; multiplicity. PYQ: 2026s1-3, DA2026-55, 2025s1-31, 2024s1-2, 2019-44, 2017s2-52, 2016s1-05, 2015s2-5, 2015s1-36, 2014s2-47, 2012-11, 2011-40, 2010-29, IT2006-26, 2005-49, 2002-5a

### Properties
- LA03.5 T If A has eigenvalue λ (eigenvector v): Aᵏ has λᵏ, A⁻¹ has 1/λ, A + kI has λ + k, kA has kλ, all with the same v; Aᵀ has the same eigenvalues. det(A) = 0 iff 0 is an eigenvalue.
- LA03.6 Q Eigenvalues of powers, inverses and shifts of a matrix; which matrices have a given eigenvalue. PYQ: DA2026-36, DA2025-18, 2016s2-06, 2008-28, 2007-25
- LA03.7 T Real symmetric matrices have real eigenvalues and orthogonal eigenvectors (for distinct eigenvalues).
- LA03.8 T A rank-one matrix uvᵀ has one eigenvalue vᵀu and the rest 0.
- LA03.9 T Eigenvectors of distinct eigenvalues are independent.
- LA03.10 Q Eigenvectors, symmetric and rank-one matrices, adjacency matrices of graphs, quadratic forms. PYQ: DA2024-3, 2023-20, 2022-43, 2021s1-52, 2018-26, 2018-17, 2017s1-31, 2015s3-15, 2014s3-4, 2014s1-5, IT2007-2, 1993-01.1
- LA03.11 L Singular values, norm-preserving matrices, orthonormal systems and other DS&AI-paper extras. PYQ: DA2025-42, DA2025-40, DA2024-51

## PR01 · Probability of events
notes: engineering-maths/02-probability
hours: 2.5

### Counting outcomes
- PR01.1 T With equally likely outcomes, P(A) = favourable / total, counted with the counting rules (Part 9, CM01). Teaches: probability
- PR01.2 T P(not A) = 1 − P(A); P(A ∪ B) = P(A) + P(B) − P(A ∩ B).
- PR01.3 Q Probability by counting: dice, cards, balls, divisibility, random subsets and arrangements. PYQ: 2026s1-1, DA2026-10, DA2026-9, DA2025-35, 2024s2-8, 2024s1-17, 2018-15, 2016s1-29, 2014s2-48, 2014s2-1, 2014s1-48, 2011-34, 2010-27, IT2008-23, IT2008-2, IT2005-1, 2004-25, IT2004-1, 2001-2.4, 1998-1.1, 1997-1.1, 1996-2.7, 1996-1.5, 1995-2.14, 1995-1.18

### Conditional probability
- PR01.4 T P(A | B) = P(A ∩ B) / P(B). Teaches: conditional
- PR01.5 T A and B are independent iff P(A ∩ B) = P(A)·P(B); mutually exclusive events (P(A ∩ B) = 0) are not independent unless one has probability 0.
- PR01.6 T Total probability: P(A) = Σ P(A | Bᵢ) P(Bᵢ).
- PR01.7 Q Conditional probability, independence and total probability, including step-by-step experiments. PYQ: 2026s2-53, 2024s1-53, DA2024-48, DA2024-2, 2023-43, 2021s2-33, 2017s2-26, 2016s2-05, 2014s3-48, 2012-33, 2011-3, 2010-26, 2009-21, 2008-27, IT2006-1, 2005-51, 2003-3, 2000-2.2, 1999-2.1, 1994-2.8, 1994-2.6, 1994-1.4
- PR01.8 T Bayes' theorem: P(Bᵢ | A) = P(A | Bᵢ) P(Bᵢ) / Σⱼ P(A | Bⱼ) P(Bⱼ), turning 'probability of the evidence given the cause' into 'probability of the cause given the evidence'. Teaches: bayes
- PR01.9 Q Bayes: which box or source, given what was observed. PYQ: DA2026-47, 2025s1-22, DA2025-21, 2021s1-54, 2018-44

## PR02 · Random variables and expectation
notes: engineering-maths/02-probability
hours: 2

### Expectation and variance
- PR02.1 T A random variable assigns a number to each outcome. Teaches: random-variable
- PR02.2 T E[X] = Σ x·P(X = x); expectation is linear, E[aX + bY] = aE[X] + bE[Y], even for dependent X and Y.
- PR02.3 T Var(X) = E[X²] − (E[X])²; Var(aX + b) = a²Var(X); for independent X, Y, Var(X + Y) = Var X + Var Y.
- PR02.4 Q Expected values by linearity (indicator variables), expected waiting times, variance. PYQ: 2026s1-48, DA2025-51, DA2025-44, DA2024-55, DA2024-26, 2021s2-29, 2021s1-35, 2017s2-31, 2014s2-2, 2013-24, 2011-18, 2006-18, 2004-74, 1999-1.1
- PR02.5 T Statistics of data: mean, median, mode, variance and standard deviation; how they change when every value is shifted or scaled.
- PR02.6 Q Mean, median, mode and standard deviation of data or of a variable. PYQ: DA2026-52, 2024s2-34, 2021s2-22, 2011-33

### Discrete distributions
- PR02.7 T Bernoulli(p); binomial(n, p): P(X = k) = C(n, k) pᵏ(1 − p)ⁿ⁻ᵏ, mean np, variance np(1 − p); geometric (trials until the first success, mean 1/p); Poisson(λ): P(X = k) = e^(−λ) λᵏ / k!, mean = variance = λ. Teaches: distribution
- PR02.8 Q Binomial, geometric and Poisson probabilities and expectations. PYQ: DA2026-54, DA2026-35, DA2024-1, 2017s2-48, 2013-2, 2012-21, IT2007-57, IT2007-1, 2006-21, IT2006-22, 2005-52, IT2005-32, 2002-2.16, 1989-4.viii

## PR03 · Continuous distributions
notes: engineering-maths/02-probability
hours: 2

### Densities
- PR03.1 T A continuous variable has a density f ≥ 0 with total area 1: P(a ≤ X ≤ b) = ∫ₐᵇ f(x) dx, and the CDF F(x) = P(X ≤ x). Teaches: integration
- PR03.2 T The integrals GATE needs here are of polynomials and of e^(−λx).
- PR03.3 Q Probabilities, constants and expectations from a density or a CDF. PYQ: 2026s2-4, DA2026-44, 2025s1-48, DA2025-29, DA2025-9, 2016s1-04, 2015s3-37, 2005-12, 2003-60
- PR03.4 T Uniform on [a, b]: density 1/(b − a), mean (a + b)/2, variance (b − a)²/12.
- PR03.5 T Exponential(λ): P(X > t) = e^(−λt), mean 1/λ, memoryless.
- PR03.6 T Normal(μ, σ²): symmetric about μ; standardise with Z = (X − μ)/σ.
- PR03.7 Q Uniform, exponential and normal: probabilities, expectations, broken sticks, random points and permutations. PYQ: DA2026-53, DA2026-24, DA2026-18, 2025s2-55, 2025s2-54, DA2025-31, DA2025-11, 2024s1-4, DA2024-47, DA2024-46, 2021s1-18, 2020-45, 2019-47, 2017s1-19, 2014s1-2, 2008-29, 2007-24, 2004-80, 2004-78, IT2004-33, 1998-3a
- PR03.8 L DS&AI-paper probability outside the CS syllabus: Bayesian networks, conditional expectation, chi-square, transformed normals. PYQ: DA2026-43, DA2026-34, DA2025-26, DA2025-10, DA2025-1, DA2024-54, DA2024-49, DA2024-14

## CA01 · Limits, continuity and derivatives
notes: engineering-maths/03-calculus
hours: 2

### Limits
- CA01.1 T Limits: factor and cancel, L'Hôpital's rule for 0/0 and ∞/∞ (differentiate top and bottom), the standard limits (sin x)/x → 1 and (1 + 1/n)ⁿ → e, and the one-sided limits for |x| and piecewise functions. Teaches: limit
- CA01.2 Q Evaluate a limit. PYQ: DA2025-49, DA2025-30, DA2025-22, DA2024-50, 2022-24, 2021s1-20, 2019-13, 2017s1-28, 2016s1-3, 2015s3-9, 2015s1-4, 2010-5, 2008-1, IT2007-76, 1993-02.1

### Continuity and differentiability
- CA01.3 T f is continuous at a if lim f(x) = f(a); differentiable if the left and right derivatives agree. Teaches: continuity, derivative
- CA01.4 T Differentiable implies continuous, not the reverse (|x| at 0).
- CA01.5 T Rolle's and the mean value theorem: f′(c) = (f(b) − f(a)) / (b − a) for some c in (a, b).
- CA01.6 Q Where a function is continuous or differentiable; constants that make it so; mean value theorem. PYQ: 2026s2-54, 2026s1-22, 2025s1-21, DA2025-14, 2024s1-1, DA2024-27, 2021s2-25, 2014s1-47, 2013-22, 2007-1, 1998-1.4, 1996-3
- CA01.7 Q Derivatives and the equations they satisfy. PYQ: DA2025-41, DA2025-4, 2016s2-02, 2014s1-46, 2014s1-6, 1996-1.6

### Maxima and minima
- CA01.8 T Local extrema where f′ = 0 (or f′ does not exist): f″ > 0 a minimum, f″ < 0 a maximum.
- CA01.9 T For the global maximum or minimum on a closed interval, also check the end points.
- CA01.10 Q Local and global maxima and minima; the number of extrema; roots in an interval. PYQ: 2026s1-36, DA2026-17, DA2025-39, DA2024-40, DA2024-5, 2023-18, 2020-1, 2012-9, 2008-25, IT2008-31, 1998-8, 1997-4.1, 1995-25a, 1995-1.21, 1987-1.xxvi

## CA02 · Integration
notes: engineering-maths/03-calculus
hours: 1.5

### Integrals
- CA02.1 T Standard integrals, substitution and integration by parts; definite integrals and area; even and odd functions over symmetric limits; ∫₀ᵃ f(x) dx = ∫₀ᵃ f(a − x) dx.
- CA02.2 Q Evaluate a definite integral; area under a curve; constants from integral conditions. PYQ: 2026s2-17, 2025s2-2, 2024s2-6, 2023-21, 2018-16, 2017s2-10, 2015s3-45, 2015s2-26, 2015s1-44, 2014s3-47, 2014s3-6, 2011-31, 2009-25, IT2005-35, 2000-2.3, 1993-02.6
- CA02.3 L Old polynomial and summation one-liners. PYQ: DA2026-25, 1995-2.8, 1987-1.xxii
