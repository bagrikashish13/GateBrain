# Part 6 · Digital Logic

Official GATE 2027 wording (Section 2): "Boolean algebra and minimization – algebraic technique, Karnaugh map, tabular method. Design of combinational and sequential circuits. Number representation and arithmetic (fixed and floating point)."

Main block, after Algorithms. Weight from the papers: 6.2 marks a paper since 2014, 6.8 since 2021. The two big blocks are number representation (2's complement, overflow, IEEE 754: about 2 marks a paper) and Boolean minimisation (K-maps, minimal SOP, prime implicants: about 2); then multiplexers, counters and flip-flops. That is the order here.
Memory chips and address decoding (filed under Digital Logic by GATE Overflow) are taught in COA, Part 7, with memory interfacing.
How to read this file: `##` is a topic (a unit), `###` a subtopic, each `-` line one minor topic to teach, in this order. Nothing here uses an idea before the line that teaches it: `npm run check:syllabus` proves it.
Letters: **T** concept, **Q** question pattern from real PYQs, **N** never asked yet but inside the syllabus, **L** legacy (old papers or the old syllabus). `Teaches:` names the concepts a line introduces (`concepts.json`).
PYQ ids are newest first. See `README.md` for the rules and `npm run syllabus` for the next step. 2's complement itself was met in C (P01); here it becomes arithmetic.

## DL01 · Number systems
notes: digital-logic/01-number-systems
hours: 1.5

### Positional notation
- DL01.1 T A numeral in radix r is worth Σ dᵢ·rⁱ, each digit from 0 to r−1; digits after the point carry negative powers. Teaches: radix-notation
- DL01.2 T Converting: repeated division by r for the integer part, repeated multiplication for the fraction; binary ↔ octal ↔ hexadecimal by grouping 3 or 4 bits from the point.
- DL01.3 Q Convert between radices; which numerals are equal; count the 1s in a binary representation. PYQ: 2024s2-39, 2023-22, 2021s2-18, 2021s1-6, 2017s2-1, 2009-5, IT2007-42, 2005-17, IT2005-47, IT2004-43, 2002-1.14, 1998-1.17, 1995-2.12, 1993-6.5, 1991-01.iii
- DL01.4 T An unknown radix: write both sides as polynomials in r and solve; every digit must be smaller than its radix, which limits the solutions.
- DL01.5 Q Find the radix, or count the solutions of an equation between radices. PYQ: 2015s3-35, 2014s2-8, 2014s1-8, 2008-6, 2004-19, 1997-5.4, 1988-2.vi
- DL01.6 Q Count numbers by a property of their binary representation. PYQ: 2019-22
- DL01.7 T Byte order: little endian stores the least significant byte at the lowest address, big endian the most significant.
- DL01.8 Q The value of a multi-byte integer read in each byte order. PYQ: 2021s2-44
- DL01.9 L Old: a conversion routine written out in code. PYQ: 1995-18

## DL02 · Signed integers and binary arithmetic
notes: digital-logic/02-signed-numbers
hours: 2

### Representations
- DL02.1 T Sign-magnitude and 1's complement: a sign bit, two zeros, range −(2ⁿ⁻¹−1) to 2ⁿ⁻¹−1. Teaches: sign-magnitude
- DL02.2 T 2's complement: invert and add 1 (or take 2ⁿ − x).
- DL02.3 T In 2's complement the range is −2ⁿ⁻¹ to 2ⁿ⁻¹−1 with one zero, and the top bit weighs −2ⁿ⁻¹.
- DL02.4 Q Write a number in 2's complement (binary or hex), or read a pattern back. PYQ: 2025s1-15, 2019-4, 2016s1-07, 2010-8, 2002-1.15, 2001-2.10, 2000-1.6
- DL02.5 Q Range and count of representable values; which representations have two zeros. PYQ: 2016s2-09, 2013-4, 2005-16, 1999-2.17, 1998-2.20, 1994-2.7
- DL02.6 T Sign extension: copy the top bit to widen a 2's complement number without changing its value.
- DL02.7 Q Where sign extension is needed. PYQ: 2002-1.16

### Addition, subtraction and overflow
- DL02.8 T Half adder: sum = a ⊕ b, carry = ab. Teaches: adder
- DL02.9 T Full adder: sum = a ⊕ b ⊕ c, carry = ab + c(a ⊕ b).
- DL02.10 T A ripple-carry adder chains n full adders, the carry passing through every stage.
- DL02.11 T Add in 2's complement and drop the carry out of the top bit; subtract by adding the 2's complement of the subtrahend (invert and set the first carry-in to 1).
- DL02.12 T Overflow: two operands of the same sign give a result of the other sign; equivalently, the carry into the top bit differs from the carry out of it (c_in ⊕ c_out).
- DL02.13 T The carry flag means unsigned overflow; the overflow flag means signed overflow.
- DL02.14 Q Which additions or subtractions overflow, in 2's complement or sign-magnitude; the flags after an operation. PYQ: 2026s2-18, 2026s1-12, 2024s1-3, 2022-8, 2019-8, 2017s1-9, IT2008-15, 2006-39, IT2006-7, 2004-66, IT2004-42, 2003-9, 2002-1.21, 1992-4.a, 1990-1.viii
- DL02.15 T Booth's recoding of the multiplier: scan bit pairs (qᵢ, qᵢ₋₁) with q₋₁ = 0; 10 means subtract the multiplicand, 01 means add, 00 and 11 just shift; alternating bits are the worst case. Teaches: booth
- DL02.16 Q Booth's recoding of a number, and how many additions and subtractions a multiplication takes. PYQ: 2025s2-22, IT2008-42, IT2006-38, IT2005-8, 1999-1.20, 1996-1.23, 1990-8b
- DL02.17 Q A bit of a product, written as a function of the inputs. PYQ: 1991-01.v

## DL03 · Fixed and floating point
notes: digital-logic/03-floating-point
hours: 2

### Fixed point
- DL03.1 T Fixed point: i integer bits and f fraction bits; the value is the integer read off the bits divided by 2ᶠ, so the resolution is 2⁻ᶠ and the largest unsigned value 2ⁱ − 2⁻ᶠ.
- DL03.2 Q Value, range and resolution of a fixed-point format. PYQ: 2018-33, 2017s1-7

### IEEE 754 single precision
- DL03.3 T IEEE 754 single precision: 1 sign bit, 8 exponent bits with bias 127, 23 fraction bits and a hidden leading 1: value = (−1)ˢ × 1.f × 2^(e−127). Teaches: ieee754
- DL03.4 T Special exponents: e = 0 gives zero and denormals (0.f × 2⁻¹²⁶); e = 255 gives infinity (f = 0) and NaN.
- DL03.5 T The largest normal single is ≈ (2 − 2⁻²³) × 2¹²⁷, the smallest normal 2⁻¹²⁶.
- DL03.6 Q Decode a bit pattern (often given in hex) into its decimal value. PYQ: 2026s2-24, 2021s1-24, 2017s2-12, 2008-4, IT2008-7
- DL03.7 Q Encode a value; the largest of several stored numbers; the fields for 0.5 or a given value. PYQ: 2024s2-4, 2021s2-4, 2014s2-45, 2012-7
- DL03.8 Q Arithmetic on stored floating-point numbers: sums and products, rounding, results that lose precision. PYQ: 2026s1-26, 2025s2-39, 2023-35, 2022-31, 2020-29, 2004-28, 2000-2.14

### Other floating-point formats
- DL03.9 T Older formats from the papers: an excess-N exponent (stored = true + N), a pure-fraction mantissa, normalisation (leading digit nonzero), base 2 or 16; work out range and precision from the fields.
- DL03.10 Q Range, precision or the bit pattern of a number in a given floating-point format. PYQ: 2005-85.a, 2005-85.b, 2003-43, 2002-9, 1997-72, 1996-1.25, 1990-1.iv.a, 1990-1.iv.b, 1989-1.vi, 1987-1.vii

## DL04 · Boolean algebra
notes: digital-logic/04-boolean-algebra
hours: 1.5

### Laws
- DL04.1 T The laws: identity, complement, idempotence, absorption (x + xy = x), De Morgan, consensus (xy + x′z + yz = xy + x′z). Teaches: boolean-algebra
- DL04.2 T Duality: swap + and ·, 0 and 1; a valid law stays valid.
- DL04.3 Q Which identity is valid; simplify an expression algebraically; the dual of a function. PYQ: 2026s2-6, 2026s1-11, 2025s2-40, 2024s2-20, 2021s1-42, 2019-6, 2017s2-27, 2014s2-6, 2008-26, 2007-32, IT2005-7, 2004-17, IT2004-44, 2002-2.3, 1999-1.7, 1987-12.a
- DL04.4 T XOR and XNOR: x ⊕ y = x′y + xy′; associative and commutative; x ⊕ x = 0, x ⊕ 1 = x′, x ⊕ 0 = x.
- DL04.5 T An XOR of many variables is 1 when an odd number of them are 1.
- DL04.6 Q XOR and XNOR identities, and new operators defined by a table or by rules. PYQ: 2018-4, 2016s2-08, 2016s1-06, 2014s3-55, 2013-21, 2012-6, 2007-33, 1998-1.13, 1997-2.1, 1994-4, 1988-2.iii
- DL04.7 Q Which operation is commutative but not associative; solve simultaneous Boolean equations. PYQ: 2000-2.10, 1998-2.8, 1995-2.5, 1992-02.i, 1989-5.a

### Counting functions and completeness
- DL04.8 T There are 2^(2ⁿ) Boolean functions of n variables.
- DL04.9 T Count functions with a property by fixing the rows the property ties together: a self-dual function is fixed by half its table.
- DL04.10 Q Count functions with a property (self-dual, neutral, …). PYQ: 1989-4.x, 1987-1.II
- DL04.11 T A set of operations is functionally complete when it can build NOT and AND (or NOT and OR). Teaches: functional-completeness
- DL04.12 T NAND alone and NOR alone are complete; {AND, OR} and {XOR} are not.
- DL04.13 Q Which sets of gates or operations are functionally complete. PYQ: 2015s1-39, IT2008-1, 1998-5, 1989-4.iii

## DL05 · Canonical forms and minimisation
notes: digital-logic/05-minimisation
hours: 2.5

### Canonical forms
- DL05.1 T Minterms (rows where f = 1) and maxterms (rows where f = 0); canonical SOP f = Σm(…) and POS f = ΠM(…) use complementary lists. Teaches: minterm
- DL05.2 Q The minterm list of an expression or a gate circuit; combining functions given as minterm lists. PYQ: 2025s1-14, 2024s2-40, 2020-28, 2019-30, 2015s3-44, 2015s2-37, 2010-6, 2008-8, 2002-2.1, 1988-2.v
- DL05.3 Q Conjunctive and disjunctive normal forms of formulas. PYQ: 2007-48

### Karnaugh maps
- DL05.4 T K-maps for 3 and 4 variables: rows and columns in Gray-code order, so neighbours differ in one variable; groups of 1, 2, 4, 8 adjacent cells, wrapping round the edges. Teaches: kmap
- DL05.5 T A don't-care joins a group only if it helps.
- DL05.6 T An implicant is any group of 1s; a prime implicant cannot be enlarged; an essential prime implicant covers a 1 no other prime covers. Teaches: prime-implicant
- DL05.7 T Minimal SOP = all essentials + the fewest other primes for the rest.
- DL05.8 Q Minimal SOP from a K-map, a minterm list or a set of conditions, with don't-cares. PYQ: 2026s2-30, 2026s1-38, 2025s2-33, 2025s1-32, 2024s1-37, 2021s2-52, 2018-49, 2014s3-7, 2014s1-7, 2012-30, 2011-14, 2008-5, IT2008-8, 2007-9, IT2006-35, 2005-18, 2002-1.12, 2001-1.11, 2000-2.11, 1999-1.8, 1998-2.7, 1995-15.b, 1992-01.i, 1991-5.b, 1988-3a.b
- DL05.9 Q Count the prime implicants or the essential prime implicants. PYQ: 2015s3-43, IT2007-79, IT2007-78, 2004-59, 1997-5.1
- DL05.10 T Minimal POS: group the 0s and complement; literal count = the number of literals in the expression.
- DL05.11 Q Minimal POS, or the literal count of a minimal form; self-dual functions. PYQ: 2017s2-28, 2003-45, 2001-10, 1997-71, 1996-2.24, 1990-5.a
- DL05.12 N The tabular (Quine–McCluskey) method: list minterms by number of 1s, merge pairs that differ in one bit, repeat; then a prime implicant chart picks the cover. In the 2027 wording, never asked yet.

### Gate counts
- DL05.13 T NAND-only and NOR-only circuits: a minimal SOP maps onto two levels of NAND, a minimal POS onto two levels of NOR; count gates and inverters.
- DL05.14 Q The fewest gates (NAND, NOR or 2-input) for a function. PYQ: 2019-50, 2017s1-21, 2009-6, IT2007-38, 2004-58, IT2004-8, 2000-9, 1995-15.a, 1987-16.a
- DL05.15 L Static hazards (no longer in the syllabus wording). PYQ: 2006-38

## DL06 · Combinational circuits
notes: digital-logic/06-combinational-circuits
hours: 2

### Decoders and multiplexers
- DL06.1 T A decoder with n inputs has 2ⁿ outputs, one per minterm; enable inputs let small decoders build a big one. Teaches: decoder
- DL06.2 T An encoder does the reverse; a priority encoder reports the highest active input.
- DL06.3 Q Decoders: how many to build a bigger one; the lines needed to address a memory. PYQ: 2020-20, 2007-8
- DL06.4 T A 2ⁿ-to-1 multiplexer has n select lines: output = Σ (minterm of the selects) · (its data input). Teaches: mux
- DL06.5 T Feeding a variable or its complement to the data inputs makes any function of n + 1 variables.
- DL06.6 Q The function a multiplexer circuit computes (cascades, decoders in front); implement a function with a multiplexer; select lines needed. PYQ: 2026s2-49, 2024s1-54, 2023-34, 2021s2-5, 2020-19, 2016s1-30, 2014s1-45, 2010-9, 2007-34, IT2007-8, IT2005-48, 2004-60, 2002-2.2, 2001-2.11, 1998-1.14, 1990-5.b, 1987-1.IV

### Arithmetic circuits
- DL06.7 T Carry look-ahead: Gᵢ = aᵢbᵢ, Pᵢ = aᵢ ⊕ bᵢ, cᵢ₊₁ = Gᵢ + Pᵢcᵢ expanded so every carry is two levels of gates; with limited fan-in the depth grows as log n, against n stages for ripple carry.
- DL06.8 Q Delay and gate counts of ripple-carry and carry look-ahead adders; the generate and propagate functions. PYQ: 2016s2-07, 2016s1-33, 2015s2-48, 2007-35, 2006-36, 2004-62, 2003-46, 1999-2.16, 1997-2.5, 1990-1.i, 1988-4ii
- DL06.9 Q Array multipliers: delay and size. PYQ: 2003-11, 1999-1.21
- DL06.10 T A ROM is a truth table: n inputs and m outputs need 2ⁿ words of m bits.
- DL06.11 Q ROM size to implement a function such as a multiplier. PYQ: 2012-19, IT2004-10, 1996-1.21, 1993-6.6
- DL06.12 Q Gray code and code converters. PYQ: 2006-40

### Analysing circuits
- DL06.13 T Analyse a circuit block by block from the inputs (gates, decoders, multiplexers, adders), then simplify.
- DL06.14 T With gate delays, an output can glitch while signals race along paths of different length.
- DL06.15 Q The output function of a combinational circuit; what changes once gates have delays. PYQ: 2025s2-21, 2024s1-18, 2013-5, 2011-13, 2010-31, IT2008-9, IT2007-45, 2006-35, IT2006-36, 2005-15, IT2005-43, IT2005-10, 2003-47, 2002-7, 1997-5.5, 1996-5, 1996-2.22, 1996-2.21, 1994-1.8, 1993-6.1, 1991-5.a, 1990-3.i
- DL06.16 Q Which building blocks (multiplexers, half adders, XOR gates with constants) can implement every function. PYQ: 1999-2.9, 1993-9, 1992-02.ii

## DL07 · Sequential circuits
notes: digital-logic/07-sequential-circuits
hours: 2.5

### State and memory
- DL07.1 T A sequential circuit's output depends on its state as well as its inputs: a state table or state diagram lists the next state and output for each state and input. Teaches: seq-machine
- DL07.2 T A Moore machine's output depends on the state alone, a Mealy machine's on the state and the input.
- DL07.3 T An SR latch from two cross-coupled NAND gates is active low: S = R = 0 is forbidden, S = R = 1 holds. Teaches: flip-flop
- DL07.4 T A flip-flop changes only on a clock edge.
- DL07.5 Q What an SR latch does for a sequence of inputs. PYQ: IT2007-7, 2004-18
- DL07.6 T Characteristic equations: D: Q⁺ = D; T: Q⁺ = T ⊕ Q; JK: Q⁺ = JQ′ + K′Q (J = K = 1 toggles).
- DL07.7 T Excitation tables give the inputs for a wanted change, which is how one flip-flop is built from another.
- DL07.8 Q Trace a circuit of flip-flops and gates: the state sequence, or the outputs after some clock edges; a multiplexer fed back on itself. PYQ: 2025s1-50, 2023-33, 2023-11, 2018-22, 2017s1-33, 2015s1-37, 2014s3-45, 2014s3-8, 2011-51, 2011-50, 2010-32, 2006-37, 2005-64, 2005-62, 2001-2.8, 2001-2.12, 2000-2.12, 1999-2.8, 1994-11, 1993-19

### Counters
- DL07.9 T A mod-N counter needs ⌈log₂ N⌉ flip-flops, more if the sequence repeats a state. Teaches: counter-circuit
- DL07.10 T Synchronous counters clock every flip-flop together; ripple counters clock each from the previous one, so each stage halves the frequency.
- DL07.11 T Ring counter: n flip-flops, n states.
- DL07.12 T Johnson (twisted ring) counter: n flip-flops, 2n states.
- DL07.13 T Saturating counters stop at the end instead of wrapping.
- DL07.14 Q The count sequence, modulus, frequency or the fewest flip-flops for a counter. PYQ: 2026s1-27, 2025s2-24, 2021s1-28, 2017s2-42, 2016s1-8, 2015s2-7, 2015s1-20, 2014s2-7, 2011-15, IT2008-37, 2007-36, 2006-8, IT2005-11, 2004-61, 2002-8, 1998-16, 1994-2.1, 1991-5.c, 1990-5.c, 1987-1.III
- DL07.15 T Shift registers move every bit one place per clock; a linear feedback shift register feeds an XOR of some bits back in. Teaches: shift-register
- DL07.16 Q Contents of a shift register or LFSR after some clocks. PYQ: IT2007-40, 1993-6.3, 1991-06.a, 1987-13.a

### Sequential machines
- DL07.17 T Designing a sequential circuit: draw the state diagram, assign states to flip-flop values, derive each flip-flop input from the excitation table, minimise.
- DL07.18 T A sequence detector remembers just enough of the input.
- DL07.19 Q Sequential machines: state tables, sequence detectors, the fewest states, what a circuit's state diagram does. PYQ: 2022-30, 2009-27, 2003-44, 2001-11, 1996-24.a, 1996-24.b, 1996-2.23, 1995-2.23, 1994-3.3, 1993-6.2, 1989-4.ix, 1987-10c
- DL07.20 L Synchronous vs asynchronous circuits, old one-liners. PYQ: 1991-03.ii
