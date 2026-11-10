# Part 13 · Theory of Computation

Official GATE 2027 wording (Section 6): "Regular expressions and finite automata. Context-free grammars and push-down automata. Regular and context-free languages, pumping lemma. Turing machines and undecidability."

Anytime track: no dates, never in the day's plan. The student finished TOC before this syllabus existed, so every concept line is marked seen (one hard check each, teach only what the check exposes) and the PYQ patterns are the practice: she solves them herself.
Weight from the papers: 7.4 marks a paper since 2014, 7.4 since 2021. Regular languages (automata, expressions, minimal DFAs, closure, non-regularity) are about 3.2 of it, context-free grammars, PDAs and CFLs 1.7, Turing machines and decidability 1.6, classifying languages across the hierarchy 1.0.
Order: the subject is one chain, and the heaviest part comes first anyway: languages and DFAs, NFAs, regular expressions, minimal DFAs, closure and non-regular languages; then grammars, PDAs and context-free languages; then Turing machines, decidability, and the whole hierarchy at the end, where classification questions mix every class.
How to read this file: `##` is a topic (a unit), `###` a subtopic, each `-` line one minor topic, in this order. Nothing here uses an idea before the line that teaches it: `npm run check:syllabus` proves it.
Letters: **T** concept, **Q** question pattern from real PYQs, **N** never asked yet but inside the syllabus, **L** legacy (old papers, the old syllabus, or another subject's material filed under TOC). `Teaches:` names the concepts a line introduces (`concepts.json`).
PYQ ids are newest first. See `README.md` for the rules and `npm run syllabus -- next toc` for the next step. Derivations, parse trees and ambiguity are taught in Compiler Design (CD02); here they are only used.

## TC01 · Languages and DFAs
notes: toc/01-regular-expressions-finite-automata
hours: 1.5

### Strings and languages
- TC01.1 T An alphabet Σ is a finite set of symbols, a string a finite sequence of them (ε is the empty string), and a language any set of strings over Σ. Teaches: language-ops
- TC01.2 T Operations on languages: union, concatenation LM = {xy : x ∈ L, y ∈ M}, powers L^k, and the Kleene star L* = L^0 ∪ L^1 ∪ …, where L^0 = {ε}.
- TC01.3 T ∅ and {ε} differ: ∅L = ∅ but {ε}L = L, and ∅* = {ε}.

### DFAs
- TC01.4 T A DFA (Q, Σ, δ, q0, F) has exactly one move for every state and symbol; it accepts a string if the run ends in a final state. Teaches: dfa
- TC01.5 T A language is regular if some DFA accepts it. Teaches: regular-lang
- TC01.6 T Design by remembering only what matters: a remainder (counting mod k), the last few symbols, or how much of a pattern has been seen; a dead state catches everything hopeless.
- TC01.7 T Swapping the final and non-final states of a complete DFA accepts the complement. Teaches: complement
- TC01.8 Q What language a DFA accepts, or which DFA accepts a described language. PYQ: 2025s1-40, 2021s1-38, 2012-46, 2009-41, IT2007-47, 2005-53, 2004-86, IT2004-41
- TC01.9 Q Count the strings of a given length that a DFA accepts. PYQ: 2021s2-17, 2003-50
- TC01.10 Q Language operations: ∅ and {ε}, powers, the star, membership in L*. PYQ: 2018-52, 2013-8, 2012-25
- TC01.11 L Construct a DFA for a described language (old descriptive style). PYQ: 2001-5, 1993-27

### Machines with output
- TC01.12 T A Mealy machine's output depends on the state and the input symbol, a Moore machine's on the state alone: DFAs that write instead of accept. Teaches: transducer
- TC01.13 Q What a machine with outputs computes (sums, complements), or which machine produces a described output. PYQ: 2021s2-28, 2005-63, 2002-2.5
- TC01.14 L Next-state equations of a state machine (Digital Logic material, asked under TOC). PYQ: IT2006-37

## TC02 · NFAs and the subset construction
notes: toc/01-regular-expressions-finite-automata
hours: 1.5

### NFAs
- TC02.1 T An NFA may have several moves, or none, for a state and symbol, and ε-moves; it accepts if some run ends in a final state. Teaches: nfa
- TC02.2 T Subset construction: each DFA state is a set of NFA states (with everything reachable by ε-moves), so an n-state NFA needs at most 2^n DFA states; NFAs and DFAs accept exactly the same languages.
- TC02.3 T Swapping the final states of an NFA does not complement its language: determinise first.
- TC02.4 T The ε-closure of a set of states is everything reachable from it by ε-moves alone; the extended transition function reads a symbol and then takes the ε-closure.
- TC02.5 Q Trace an NFA: the reachable states for an input, the extended transition function, the language accepted, statements about NFAs. PYQ: 2017s2-39, 2016s2-42, 2014s1-16, IT2006-3, IT2005-37
- TC02.6 Q The complement of an NFA's language, or what changing its final states does. PYQ: 2012-12, 2003-55
- TC02.7 Q Compare the languages of two automata: equal, subset, disjoint. PYQ: 2026s2-37, IT2008-36
- TC02.8 L Construct an NFA or convert one (old descriptive style). PYQ: 1988-15

## TC03 · Regular expressions and regular grammars
notes: toc/01-regular-expressions-finite-automata
hours: 2

### Regular expressions
- TC03.1 T Regular expressions build languages from ∅, ε and single symbols with union (+), concatenation and star. Teaches: regex
- TC03.2 T Kleene's theorem: regular expressions, DFAs and NFAs describe exactly the same languages, the regular ones.
- TC03.3 T Identities: (r*)* = r*, (r + s)* = (r*s*)*, r(sr)* = (rs)*r, ∅* = ε; but (rs)* ≠ r*s* and (r + s)* ≠ r* + s*.
- TC03.4 Q Which expression describes a language (counts, forbidden substrings, divisibility, identifiers), or what an expression describes. PYQ: 2023-9, 2021s2-47, 2020-7, 2016s1-18, 2010-39, 2009-15, IT2008-5, IT2005-5, 1997-6.4, 1995-1.9
- TC03.5 Q Equivalent expressions and identities; which strings belong; how the sets of two expressions relate. PYQ: IT2007-73, IT2004-7, 2003-14, 2000-1.4, 1998-1.9, 1998-1.12, 1996-1.8, 1992-02.xvii, 1991-03.xiii
- TC03.6 Q Count the strings of a length in an expression's language, or find the shortest string not in it. PYQ: 2024s2-52, 2024s1-51, 2014s3-15
- TC03.7 T Automaton to expression: eliminate states one at a time (or read the loops off a small DFA); expression to automaton: build an ε-NFA piece by piece.
- TC03.8 Q The expression for a given DFA or NFA (or for its complement), or the automaton for a given expression. PYQ: 2024s2-31, 2024s2-12, 2023-4, 2022-2, 2014s1-36, 2008-52, IT2008-32, 2007-74, IT2007-72, IT2007-71, IT2006-5, 1994-2.10
- TC03.9 L Write an expression or an automaton for a described set (old descriptive style). PYQ: 2002-21, 1998-3b, 1987-10d

### Regular grammars
- TC03.10 T A right-linear grammar (A → aB or A → a, ε allowed) generates exactly the regular languages: each non-terminal is a state. Teaches: regular-grammar
- TC03.11 Q What a regular grammar generates. PYQ: 2015s2-35, IT2005-39
- TC03.12 L Is the language of a grammar regular (old descriptive style). PYQ: 1990-15a

## TC04 · Minimal DFAs
notes: toc/01-regular-expressions-finite-automata
hours: 2

### Minimisation
- TC04.1 T Two states are equivalent if every string takes both to acceptance or both to rejection; merging equivalent states (after dropping unreachable ones) gives the minimal DFA, which is unique. Teaches: minimal-dfa
- TC04.2 T Myhill–Nerode: the minimal DFA has one state per class of strings that no suffix can tell apart; a language is regular exactly when it has finitely many classes.
- TC04.3 T Counting conditions multiply: 'a's mod m and b's mod n' needs m × n states; a condition on the k-th symbol from the start needs about k + 2, from the end 2^k.
- TC04.4 Q The number of states in the minimal DFA for a described language or expression. PYQ: 2025s2-50, 2023-53, 2020-51, 2019-48, 2017s2-25, 2017s1-22, 2016s2-16, 2015s3-18, 2015s2-53, 2011-42, 2007-29, 2006-34, 2002-2.13, 2001-2.5, 1999-1.4, 1998-2.5
- TC04.5 Q Minimise a given DFA or machine: which states are distinguishable, which machine is the minimal one, what a two-state minimal DFA allows. PYQ: 2025s1-49, 2024s1-40, 2011-45, 2007-75, IT2006-29, 2000-2.8
- TC04.6 Q Bounds: the minimal DFA against the NFA, and the fewest NFA states for a language. PYQ: 2026s1-16, 2025s1-18, 2018-6, 2010-41, IT2008-6, 2001-1.6, 1987-2j
- TC04.7 L Design, convert or minimise a machine (old descriptive style). PYQ: 1998-4, 1997-70, 1997-20, 1991-17.b

## TC05 · Closure and non-regular languages
notes: toc/02-regular-languages
hours: 2.5

### Closure
- TC05.1 T Regular languages are closed under union, intersection, complement, difference, concatenation, star, reversal, prefixes and suffixes. Teaches: lang-closure
- TC05.2 T Intersection by the product construction: run both DFAs together on pairs of states; for ∩ a pair is final when both parts are, for ∪ when either is.
- TC05.3 Q Product automata, and the minimal DFA of a combination. PYQ: 2015s1-52, 2008-49, IT2007-50
- TC05.4 T Closure works one way: a regular union or intersection says nothing about the parts; a subset of a regular language need not be regular, but every finite language is; an infinite union of regular languages need not be regular.
- TC05.5 Q Which statements about regular languages and their combinations always hold. PYQ: 2024s1-13, 2021s2-9, 2020-8, 2007-7, IT2006-30, 1998-2.6, 1990-3.viii, 1987-2h, 1987-2i
- TC05.6 Q Constructions on a regular language (repeat, prefix, suffix, half, reversal): which stay regular. PYQ: 2019-7, IT2006-81, IT2006-80, 1997-21
- TC05.7 L Closure and constructions (old descriptive style). PYQ: 1999-6, 1996-12

### Non-regular languages
- TC05.8 T A finite automaton has bounded memory, so a language that needs unbounded counting or matching (a^n b^n, ww, ww^R, a^(n²), a^p for prime p) is not regular.
- TC05.9 T Pumping lemma: for a regular L there is a p such that every w ∈ L with |w| ≥ p splits as xyz with |xy| ≤ p, |y| ≥ 1 and xy^i z ∈ L for all i; it proves languages non-regular. Teaches: pumping
- TC05.10 Q Is the language regular: conditions on counts, matching halves, reversals, unary lengths, numbers in binary. PYQ: 2025s2-42, 2025s1-34, 2015s2-51, 2014s2-36, 2014s2-15, 2014s1-15, 2008-53, IT2008-35, 2007-31, 2006-29, 2001-2.6, 2001-1.4, 1998-1.10, 1996-1.10, 1995-2.24
- TC05.11 Q Pumping lengths. PYQ: 2019-15

## TC06 · Context-free grammars
notes: toc/03-context-free-grammars-pda
hours: 1.5

### Grammars
- TC06.1 T A context-free grammar has productions A → α with one non-terminal on the left; the languages they generate are the context-free languages (CFLs), and every regular language is one. Teaches: cfg, cfl
- TC06.2 T Derivations, parse trees and ambiguity are as in Compiler Design (CD02): a grammar is ambiguous if some string has two parse trees.
- TC06.3 T Read a grammar's language by tracking what each non-terminal adds: S → aSb pairs symbols, S → SS concatenates, S → aSa | bSb | a | b gives odd palindromes.
- TC06.4 Q What language a grammar generates, or which grammar generates a language. PYQ: 2026s1-42, 2025s1-9, 2023-29, 2017s2-16, 2017s1-10, 2016s1-42, 2016s1-16, 2009-12, IT2008-34, IT2007-46, IT2006-34, 2000-1.5, 1995-2.20
- TC06.5 Q Which strings a grammar generates, and whether it is ambiguous. PYQ: 2026s1-15, 2017s1-34, IT2007-49, IT2007-48, IT2006-4
- TC06.6 N Chomsky normal form: every production is A → BC or A → a, so deriving a string of length n takes exactly 2n − 1 steps.
- TC06.7 L Construct a machine and read a grammar (old descriptive style). PYQ: 2000-7

## TC07 · Pushdown automata
notes: toc/03-context-free-grammars-pda
hours: 1.5

### PDAs
- TC07.1 T A pushdown automaton is an NFA with a stack: each move reads an input symbol (or ε), pops the top of the stack and pushes a string. Teaches: pda
- TC07.2 T Nondeterministic PDAs accept exactly the CFLs; acceptance by final state and by empty stack are equally powerful.
- TC07.3 Q What language a PDA accepts, or how many strings of a length it accepts. PYQ: 2023-30, 2021s1-51, 2015s1-51, IT2006-33, IT2004-40
- TC07.4 Q Acceptance by final state vs empty stack. PYQ: 1999-1.6
- TC07.5 T Deterministic PDAs accept the deterministic CFLs (DCFLs), a proper subset of the CFLs: a^n b^n and wcw^R are deterministic, ww^R is not (the machine can't tell where the middle is). Teaches: dpda
- TC07.6 Q Which languages a deterministic PDA accepts; deterministic vs nondeterministic PDAs; what a one-state PDA or a grammar's language allows. PYQ: IT2006-31, 2005-54, IT2005-38, 2003-51, 1997-6.6
- TC07.7 L Construct or complete a PDA (old descriptive style). PYQ: 2001-6, 2000-8, 1998-13, 1996-13

## TC08 · Context-free languages
notes: toc/04-context-free-languages
hours: 2.5

### Which languages are context-free
- TC08.1 T A PDA has one stack, so it can match one pair of counts (a^n b^n, a^n b^m c^(n+m)) or a string with its reverse, but not three equal counts (a^n b^n c^n) or a copy (ww).
- TC08.2 T Pumping lemma for CFLs: every long enough w ∈ L splits as uvxyz with |vxy| ≤ p, |vy| ≥ 1 and uv^i xy^i z ∈ L for all i.
- TC08.3 Q Is the language context-free (and is it regular): counting conditions, reversals, copies, bounded counts. PYQ: 2026s2-38, 2025s1-35, 2022-37, 2021s2-41, 2020-32, 2019-31, 2018-35, 2016s2-43, 2015s3-32, 2010-40, IT2008-33, 2006-19, IT2005-6
- TC08.4 Q Is a context-free language deterministic: where the middle is marked, unions of different shapes. PYQ: 2022-38, 2020-10, 2014s3-36, 2005-57
- TC08.5 Q Match languages with the programming-language checks they model. PYQ: 2008-51
- TC08.6 Q What the two pumping lemmas do and don't prove. PYQ: IT2005-40
- TC08.7 L Prove a language is not context-free, or classify one (old descriptive style). PYQ: 1999-7, 1988-2ix

### Closure
- TC08.8 T CFLs are closed under union, concatenation, star, reversal and intersection with a regular language, but not under intersection or complement; DCFLs are closed under complement.
- TC08.9 Q Closure rules: which operations keep CFLs context-free, what a regular language combined with a CFL gives, which statements about CFLs hold. PYQ: 2026s1-41, 2021s2-12, 2021s1-1, 2017s2-04, IT2006-32, IT2005-4, IT2004-9, 2001-1.5, 1999-2.4, 1999-1.5, 1996-2.9, 1996-2.8, 1992-02.xix, 1989-3.ii, 1987-2k
- TC08.10 Q Combine specific languages: is their union, intersection or complement context-free or regular. PYQ: 2017s1-38, 2016s2-17, 2013-33, 2011-24

## TC09 · Turing machines and RE languages
notes: toc/05-turing-machines-undecidability
hours: 1.5

### Turing machines
- TC09.1 T A Turing machine has a finite control and an infinite tape it can read, write and move along both ways; on an input it accepts, rejects, or runs forever. Teaches: tm
- TC09.2 T Multi-tape and nondeterministic Turing machines recognise exactly the same languages as the basic one (the Church–Turing thesis).
- TC09.3 Q Trace a small Turing machine. PYQ: 2003-53
- TC09.4 L Turing machines with a read-only input and constant work space (old descriptive style). PYQ: 1991-17.a

### Recursive and recursively enumerable languages
- TC09.5 T A language is recursively enumerable (Turing-recognisable) if some TM accepts exactly its strings, and recursive (decidable) if some TM also halts on every input; recursive ⊂ RE. Teaches: re
- TC09.6 T L is recursive exactly when both L and its complement are RE; recursive languages are closed under complement, RE languages are not; a language whose strings can be listed in lexicographic order is recursive.
- TC09.7 Q Where nondeterminism adds power: none for finite automata and Turing machines, some for pushdown automata. PYQ: 2011-8, 2009-16, 2008-48, 1998-1.11, 1994-1.16, 1992-02.xx
- TC09.8 Q Complements and combinations of recursive and RE languages, and what deciding a language means. PYQ: 2026s2-3, 2022-13, 2015s1-3, 2014s1-35, 2013-17, 2010-17, 2005-56, 2004-89, 2003-15, 2002-2.14, 1987-2l

### Countability and the hierarchy
- TC09.9 T Countability: Σ* and the set of all Turing machines are countable, but the set of all languages over Σ is not, so most languages are not even RE. Teaches: countable
- TC09.10 Q Which sets are countable. PYQ: 2019-34, 2014s3-16, 1997-3.4
- TC09.11 T The Chomsky hierarchy: regular ⊂ deterministic CFL ⊂ CFL ⊂ context-sensitive ⊂ recursive ⊂ RE (type 3, 2, 1 and 0 grammars, type 0 being unrestricted); a^n b^n c^n and a^p (p prime) are context-sensitive but not context-free. Teaches: csl
- TC09.12 Q Where recursive and RE languages sit: their closure, their size, and which types they contain. PYQ: 2018-7, 2008-13, 1990-3.vi

## TC10 · Decidability
notes: toc/05-turing-machines-undecidability
hours: 2

### Undecidable problems
- TC10.1 T The halting problem (does M halt on w?) is undecidable but RE: run M and accept if it halts; its complement is not RE. Teaches: undecidability
- TC10.2 T Rice's theorem: any nontrivial property of the language a TM accepts (empty, regular, finite…) is undecidable; questions about a bounded number of steps are decidable.
- TC10.3 T For CFGs, membership and emptiness are decidable; ambiguity, L(G) = Σ*, equivalence and 'is L(G) regular' are not; for DFAs and regular expressions nearly everything is decidable.
- TC10.4 T A question about a machine's first k steps is decidable: in k steps it reads at most k input symbols, so only finitely many inputs need checking.
- TC10.5 Q Which problems about Turing machines are decidable, RE, or neither. PYQ: 2022-36, 2021s1-39, 2021s1-12, 2020-26, 2016s2-44, 2014s2-35, 2003-54, 2001-2.7, 1997-6.5, 1990-3.vii, 1987-2m
- TC10.6 Q Which problems about grammars and automata are decidable. PYQ: 2025s2-15, 2018-36, 2017s2-41, 2016s1-17, 2014s3-35, 2013-41, 2012-24, 2008-10, 2007-6, 2000-2.9, 1996-1.9, 1989-3.iii
- TC10.7 T A language defined by an unknown fact (whether P = NP, say) is still decidable when every possible answer gives a decidable language: one of the candidate machines decides it, even if we don't know which.
- TC10.8 Q Decidability puzzles: a language defined by an open question, subsets of infinite regular languages, a definition hiding a finite answer. PYQ: 2021s2-36, 2015s2-21, 2003-13

### Reductions
- TC10.9 T A reduction A ≤ B turns instances of A into instances of B: if B is decidable (or RE), so is A; if A is undecidable (or not RE), so is B. Teaches: reduction
- TC10.10 Q What a reduction proves. PYQ: 2017s1-39, 2016s1-44, 2014s2-16, 2005-45
- TC10.11 L Prove undecidability, state the halting problem, or decide an odd set (old descriptive style). PYQ: 2002-14, 2001-7, 1999-10, 1994-19, 1988-2viii
- TC10.12 L P, NP and polynomial-time reductions (outside the 2027 syllabus). PYQ: 2015s3-53, 2003-52, 1995-11

## TC11 · The whole hierarchy
notes: toc/05-turing-machines-undecidability
hours: 1.5

### Classifying languages
- TC11.1 T Classify from the bottom: finite or bounded memory means regular, one stack means context-free, anything an always-halting algorithm decides is recursive.
- TC11.2 Q Classify a language anywhere in the hierarchy (including the language of a given PDA, or one with a bounded stack). PYQ: 2025s2-14, 2017s2-40, 2016s1-43, 2013-32, 2011-26, 2009-40, 2008-9, 2007-30, 2006-30, 2005-55, 2004-87, 2002-1.7, 1991-03.xiv
- TC11.3 Q Closure across the whole hierarchy: unions and intersections of regular, context-free, recursive and RE languages. PYQ: 2025s2-20, 2023-14, 2017s1-37, 2016s2-18, 2006-33
- TC11.4 L Classify a language or prove a closure property (old descriptive style). PYQ: 1992-16, 1987-1.xiii
