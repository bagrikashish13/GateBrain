# Part 5 · Compiler Design

Official GATE 2027 wording (Section 7): "Lexical analysis, parsing, syntax-directed translation. Runtime environments. Intermediate code generation. Local optimisation, Data flow analyses: constant propagation, liveness analysis, common sub expression elimination."

Taught in the 2nd slot (AGENTS.md 2.9), alongside the main block. Weight from the papers: 5.9 marks a paper since 2014, 7.1 since 2021. Parsing (LL(1), LR items and tables, comparing parsers) is about half of it; syntax-directed translation and the back end (three-address code, DAGs, basic blocks, liveness) share the rest.
Units CD01 to CD06 were studied in lectures before this syllabus existed, so their items are marked seen: one hard check each, teach only what the check exposes. CD07 onwards is new.
How to read this file: `##` is a topic (a unit), `###` a subtopic, each `-` line one minor topic to teach, in this order. Nothing here uses an idea before the line that teaches it: `npm run check:syllabus` proves it.
Letters: **T** concept, **Q** question pattern from real PYQs, **N** never asked yet but inside the syllabus, **L** legacy (old papers or the old syllabus). `Teaches:` names the concepts a line introduces (`concepts.json`).
PYQ ids are newest first. See `README.md` for the rules and `npm run syllabus` for the next step. Parameter passing and static and dynamic scoping are taught in P10 (Programming in C), with their PYQs.

## CD01 · Phases and lexical analysis
notes: compiler-design/01-lexical-analysis
hours: 1.5

### The phases
- CD01.1 T The phases in order: lexical, syntax and semantic analysis, intermediate code generation, optimisation, code generation; the symbol table and error handler serve all of them. Teaches: phases, ir
- CD01.2 T Front end (depends on the source language) vs back end (depends on the target machine).
- CD01.3 T Token (the category), lexeme (the actual characters) and pattern (the rule). Teaches: token
- CD01.4 T In C: keywords, identifiers, constants, string literals, operators and punctuation are tokens; comments and white space are dropped.
- CD01.5 T What each phase takes in and gives out: characters → tokens → syntax tree → annotated tree → intermediate code → optimised code → target code.
- CD01.6 T Which phase catches which error: a malformed lexeme (bad identifier, unterminated string) is lexical, a misplaced token is syntax, a type mismatch or an undeclared name is semantic.
- CD01.7 Q Which phase does this, takes this as input, or reports this error. Front end vs back end. PYQ: 2026s1-17, 2023-1, 2021s2-3, 2017s2-05, 2005-61, 1987-1.xi
- CD01.8 T The symbol table: one entry per name with its type, scope and storage; built in the early phases and read by all the later ones.
- CD01.9 Q What the symbol table holds and which data structure keeps a name's attributes. PYQ: 2025s1-2, 2010-13

### The lexer
- CD01.10 Q Count the tokens in a C statement. A string literal is one token, however long; each comma and parenthesis is its own. PYQ: 2000-1.18
- CD01.11 T Token patterns are regular expressions and the lexer runs a DFA, so lexical analysis needs only the power of finite automata.
- CD01.12 T Keywords are recognised by the lexer, as reserved identifiers.
- CD01.13 Q What power lexical analysis needs, and where keywords are recognised. PYQ: 2011-19, 2011-1
- CD01.14 T Longest match: the lexer takes the longest prefix any pattern accepts; between patterns of equal length, the one listed first wins. Teaches: longest-match
- CD01.15 Q Split a string into tokens under given patterns using longest match, and count them. PYQ: 2026s2-25, 2018-37
- CD01.16 L Old one-liners on identifiers and compilation speed. PYQ: 1987-1.xvii

## CD02 · Grammars for parsing
notes: compiler-design/02-parsing
hours: 2.5

### Derivations and parse trees
- CD02.1 T Leftmost and rightmost derivations, sentential forms, and the parse tree, which is the same for both orders. Teaches: derivation
- CD02.2 T Top-down parsing builds the tree from the root and follows a leftmost derivation; bottom-up parsing reduces to the start symbol and traces a rightmost derivation in reverse. Teaches: top-down
- CD02.3 T Recursive descent and predictive parsers are top-down; shift-reduce, operator precedence and LR parsers are bottom-up.
- CD02.4 Q Top-down or bottom-up, and which derivation a parser follows. PYQ: 2024s1-16, 2019-3, 2000-1.19, 1987-1.xiv
- CD02.5 Q What a grammar generates: count derivation steps or parse trees, find the language, design a grammar for a construct. PYQ: 2024s2-42, 2024s1-49, 2016s2-46, IT2008-79, IT2008-78, 2007-79, 2007-78, 2006-85, 2006-84, 2004-88, 1997-11, 1994-1.18, 1992-02.xviii

### Ambiguity
- CD02.6 T A grammar is ambiguous when some string has two parse trees (equivalently, two leftmost derivations). Teaches: ambiguity
- CD02.7 T The classic cases: E → E+E | E*E, and the dangling else.
- CD02.8 T Ambiguity is a property of the grammar; some languages are inherently ambiguous.
- CD02.9 T A grammar left- and right-recursive in the same non-terminal (A → AαA-style) is ambiguous.
- CD02.10 Q Is this grammar ambiguous, how many parse trees does a string have, how a disambiguated grammar relates to the original. PYQ: 2026s2-19, IT2007-9, 2006-32, IT2005-83a, IT2005-83b, 1999-2.15, 1996-2.10, 1990-16a, 1987-1.xii

### Left recursion and left factoring
- CD02.11 T Remove immediate left recursion: A → Aα | β becomes A → βA′, A′ → αA′ | ε. Teaches: left-recursion
- CD02.12 T Indirect left recursion is removed by substituting first.
- CD02.13 T Left factoring: A → αβ1 | αβ2 becomes A → αA′, A′ → β1 | β2, so one look-ahead symbol can choose.
- CD02.14 Q Remove left recursion, or pick the equivalent grammar free of it; which transformations are always possible. PYQ: 2017s2-32, 2016s2-45, 2008-50, 2001-18, 1998-6b
- CD02.15 L Grammar theory from old papers, from the TOC side: simplification, normal forms, which class a grammar is in. PYQ: 1998-14, 1996-11, 1995-1.10, 1994-20
- CD02.16 L Operator grammars (no ε-productions, no two adjacent non-terminals). PYQ: 2004-8

### Precedence and associativity in a grammar
- CD02.17 T Each precedence level gets its own non-terminal; operators lower in the tree bind tighter.
- CD02.18 T A left-recursive rule (E → E op T) makes op left-associative, a right-recursive one right-associative.
- CD02.19 Q Read precedence and associativity off a grammar or a parse tree, then evaluate an expression with them. PYQ: 2024s1-23, 2018-38, 2016s1-45, 2014s2-17, 2011-27, 2000-2.21, 1997-1.6, 1991-10a, 1991-10b, 1991-10c

## CD03 · FIRST, FOLLOW and LL(1)
notes: compiler-design/02-parsing
hours: 2

### FIRST and FOLLOW
- CD03.1 T FIRST(α): the terminals that can begin a string derived from α, plus ε if α can vanish. Teaches: first-set
- CD03.2 T For X1X2…, add FIRST(X2) only while the earlier symbols can derive ε.
- CD03.3 T FOLLOW(A): the terminals that can come right after A in some sentential form; $ for the start symbol. Teaches: follow-set
- CD03.4 T From B → αAβ add FIRST(β) − ε; if β can vanish (or is empty), add FOLLOW(B).
- CD03.5 Q Compute FIRST and FOLLOW sets. PYQ: 2025s1-36, 2024s1-28, 2019-19, 2017s1-17, 1992-02.xiii

### The LL(1) table
- CD03.6 T Fill M[A, a] with A → α for each a in FIRST(α); if ε is in FIRST(α), also for each b in FOLLOW(A), $ included; empty cells are syntax errors. Teaches: ll1
- CD03.7 Q Fill the missing entries of an LL(1) table. PYQ: 2024s2-30, 2021s1-31, 2012-53, 2012-52, 2006-58, 2003-56, 2001-16, 1998-22, 1995-8
- CD03.8 T A grammar is LL(1) when no cell holds two rules.
- CD03.9 T Left recursion, a common prefix, or an ambiguous grammar always breaks it; for A → α | β with α ⇒* ε, FIRST(β) and FOLLOW(A) must not meet.
- CD03.10 Q Is this grammar LL(1), why not, and what is enough to make it so. PYQ: 2007-52, 2005-14, 2003-16
- CD03.11 T The LL(1) driver: a stack of grammar symbols and the look-ahead; expand with the table, match terminals.
- CD03.12 T Recursive descent is the same thing with one procedure per non-terminal.
- CD03.13 L Old descriptive questions: write a grammar, a syntax tree or a parser for a small language. PYQ: 1995-9, 1993-25

## CD04 · Shift-reduce, LR(0) and SLR(1)
notes: compiler-design/02-parsing
hours: 2

### Handles
- CD04.1 T Shift-reduce parsing: shift input onto the stack, reduce a handle to its non-terminal, accept. Teaches: handle
- CD04.2 T A handle is the right side reduced in the reverse rightmost derivation; viable prefixes are what can sit on the stack.
- CD04.3 Q Find the handles of a right-sentential form; what is true about viable prefixes. PYQ: 2015s1-13, 2008-11, 2005-59
- CD04.4 Q Count the reductions (or shifts) a bottom-up parser makes on a string; the most it can make without ε- and unit productions. PYQ: 2020-24, 2013-9

### LR(0) items
- CD04.5 T An LR(0) item is a production with a dot. Teaches: lr0-items
- CD04.6 T CLOSURE adds B → •γ for every B right after a dot; GOTO(I, X) moves the dot over X and takes the closure; the canonical collection of item sets is the states of the LR(0) automaton.
- CD04.7 Q Count the items in a CLOSURE or GOTO set; which items share a state. PYQ: 2024s2-55, 2022-19, 2021s2-51, 2019-43, 2006-7, 1988-10ia

### LR(0) and SLR(1) tables
- CD04.8 T LR(0): a state with a complete item reduces on every symbol, so a complete item next to a shift (or another complete item) is a conflict.
- CD04.9 T SLR(1): reduce A → α only on FOLLOW(A), giving fewer conflicts than LR(0) with the same states. Teaches: slr
- CD04.10 Q Shift-reduce and reduce-reduce conflicts in a given state. PYQ: 2014s1-34, 1988-10ib

## CD05 · LR(1), LALR(1) and comparing parsers
notes: compiler-design/02-parsing
hours: 1.5

### Canonical LR(1) and LALR(1)
- CD05.1 T LR(1) items carry a look-ahead: [A → α•, a] reduces only on a. Teaches: lr1-items
- CD05.2 T Closure of [A → α•Bβ, a] adds [B → •γ, b] for b in FIRST(βa).
- CD05.3 Q Conflicts in a canonical LR(1) table. PYQ: 2026s2-31
- CD05.4 T LALR(1) merges LR(1) states with the same core (same items, different look-aheads). Teaches: lalr
- CD05.5 T Merging can create reduce-reduce conflicts but never a new shift-reduce conflict.
- CD05.6 Q What merging states with a common core can and cannot do. PYQ: 2013-40, 2008-55, 1989-1.iii

### Comparing parsers
- CD05.7 T Power: LR(0) ⊂ SLR(1) ⊂ LALR(1) ⊂ LR(1); every LL(1) grammar is LR(1).
- CD05.8 T No ambiguous grammar is LL(k) or LR(k).
- CD05.9 T Every SLR(1) grammar is unambiguous; not every unambiguous grammar is SLR(1).
- CD05.10 T States: LR(0), SLR(1) and LALR(1) have the same number; canonical LR(1) has at least as many, often far more.
- CD05.11 Q Number of states in SLR, LALR and canonical LR parsers. PYQ: 2005-60, 2003-17
- CD05.12 Q Which parsers can handle this grammar; true statements about LL, SLR, LALR and CLR. PYQ: 2026s1-18, 2025s2-41, 2025s2-30, 2021s1-5, 2017s2-6, 2015s3-31, 2015s3-16, 2010-38, 2007-53, 2007-18, 2003-57, 2002-22, 2001-1.18, 1999-1.17, 1998-1.26, 1992-02.xiv

## CD06 · Syntax-directed translation
notes: compiler-design/03-syntax-directed-translation
hours: 2

### Attributes and actions
- CD06.1 T A syntax-directed definition attaches attributes to grammar symbols and semantic rules to productions. Teaches: sdd
- CD06.2 T Synthesized attributes come up from the children, inherited ones from the parent and siblings.
- CD06.3 T A translation scheme puts actions inside productions. Teaches: translation-scheme
- CD06.4 T In bottom-up parsing an action at the end runs when its production is reduced, so the printed order is the order of reductions.
- CD06.5 Q Evaluate an SDD on an input: the value computed at the root, or the type found. PYQ: 2024s1-27, 2023-50, 2022-55, 2021s1-26, 2005-83a, 2005-83b, 2004-45, 1998-23
- CD06.6 Q What does a translation scheme print for this input. PYQ: 2016s1-46, 2006-59, 2003-58, 1996-20, 1995-2.10

### S-attributed and L-attributed
- CD06.7 T S-attributed: synthesized attributes only, evaluated in one bottom-up pass (during LR parsing). Teaches: attributed
- CD06.8 T L-attributed: an inherited attribute may depend only on the parent's inherited attributes and on siblings to its left, so one left-to-right depth-first pass works.
- CD06.9 Q Is a definition S- or L-attributed; which attributes are inherited; when inherited attributes can be evaluated bottom-up; type declarations with inherited types. PYQ: 2026s1-43, 2025s2-12, 2024s2-19, 2020-33, 2019-36, 2003-18, 2000-19, 1998-1.27, 1992-11a

## CD07 · Intermediate code
notes: compiler-design/05-intermediate-code-generation
hours: 2

### Three-address code
- CD07.1 T Three-address code: at most one operator on the right (x = y op z), plus copies, jumps, conditional jumps, indexed assignments and calls; compiler-made temporaries (t1, t2…) hold the partial results. Teaches: tac
- CD07.2 T Quadruples (op, arg1, arg2, result), triples (no result field: refer to the triple by its number) and indirect triples (a list of pointers, easy to reorder).
- CD07.3 Q Write or complete three-address code, quadruples or triples for an expression or statement, including code generated by semantic rules. PYQ: 2024s2-33, 2003-59, 2001-17
- CD07.4 T Control flow in three-address code: if-else and loops become labels and conditional jumps; && and || become short-circuit jumps.
- CD07.5 Q Code templates for if-then-else and boolean expressions with short-circuit evaluation. PYQ: 1992-11b, 1989-4.v
- CD07.6 T Backpatching: emit jumps with their targets left empty and fill them in once the targets are known, so control flow can be translated in one pass. Teaches: backpatching
- CD07.7 Q What backpatching does and when it is needed. PYQ: 2025s2-11

### SSA form
- CD07.8 T Static single assignment: every variable is assigned exactly once; each new assignment gets a new name (x1, x2…). Teaches: ssa
- CD07.9 T Counting SSA names means counting assignments, with temporaries reused only where the answer allows.
- CD07.10 Q Convert to SSA, or count the variables or temporaries SSA needs. PYQ: 2017s1-12, 2016s1-19, 2015s1-55

### Why compilers use intermediate code
- CD07.11 T Intermediate code lets one front end serve many target machines and lets optimisation be machine-independent; it does not make parsing or error recovery easier.
- CD07.12 Q The purpose of intermediate code, and why optimisations are done on it. PYQ: 2014s3-17, 2008-12, 1994-1.12

## CD08 · Basic blocks and local optimisation
notes: compiler-design/06-code-optimization
hours: 2.5

### Basic blocks and flow graphs
- CD08.1 T Leaders: the first instruction, every jump target, and every instruction right after a jump. Teaches: basic-block
- CD08.2 T A basic block runs from a leader up to the next leader: control enters only at the top and leaves only at the bottom.
- CD08.3 Q Find the leaders and count the basic blocks. PYQ: 2025s1-42, 2024s1-29
- CD08.4 T The control-flow graph: one node per block, an edge for each possible transfer of control (the jump and the fall-through).
- CD08.5 Q Nodes, edges or paths in the control-flow graph of a piece of code. PYQ: 2017s1-43, 2015s2-29
- CD08.6 T Intermediate forms side by side: syntax tree and abstract syntax tree (structure), postfix, three-address code (instructions), control-flow graph (blocks and jumps).
- CD08.7 T The symbol table is a data structure, not an intermediate form.
- CD08.8 Q Which forms are or are not intermediate representations; the abstract syntax tree vs the control-flow graph. PYQ: 2021s2-13, 2015s2-14

### Local optimisations
- CD08.9 T Within a block: constant folding, constant propagation, copy propagation, common subexpression elimination, dead-code elimination, algebraic simplification and strength reduction (x*2 → x+x, x*8 → x<<3). Teaches: local-opt
- CD08.10 Q Which optimisation applies, the code after applying it, the fewest operations needed. PYQ: 2014s3-11, 2006-55
- CD08.11 T Build the DAG of a block: leaves for initial values, one interior node per distinct operation; a repeated subexpression reuses its node, and a reassigned variable just moves its label. Teaches: expr-dag
- CD08.12 Q Nodes and edges in the DAG of a block, and what it reveals (common subexpressions, fewer instructions). PYQ: 2021s1-50, 2014s3-34, 1988-2xvii
- CD08.13 T Loop optimisations: move loop-invariant code out (code motion), replace induction-variable multiplications by additions, eliminate redundant induction variables, unroll.
- CD08.14 Q Which optimisations apply to a loop, and what the loop becomes. PYQ: 2021s2-30, 2006-60

## CD09 · Data-flow analysis
notes: compiler-design/06-code-optimization
hours: 1.5

### Liveness
- CD09.1 T A variable is live at a point if its current value may be used later on some path before it is overwritten. Teaches: liveness
- CD09.2 T Liveness flows backwards: IN[B] = USE[B] ∪ (OUT[B] − DEF[B]), OUT[B] = ∪ IN of the successors.
- CD09.3 T On a CFG with loops, iterate the equations until nothing changes.
- CD09.4 T Liveness drives register allocation and dead-code elimination: a value assigned and never live is dead.
- CD09.5 Q The live variables at a point of a CFG; liveness equations; what uses liveness. PYQ: 2026s2-35, 2025s1-3, 2023-27, 2021s2-38, 2015s1-50
- CD09.6 L Register allocation and the fewest registers for an expression or a block (code generation, outside the 2027 wording). PYQ: 2017s1-52, 2013-48, 2011-36, 2010-37, 2004-10, 1997-4.9

### Forward analyses
- CD09.7 T Constant propagation and available expressions flow forwards from the entry: a value is known (or an expression available) at a point only if it is so on every path into it. Teaches: forward-flow
- CD09.8 T Available expressions find global common subexpressions.
- CD09.9 Q Redundant expressions or known constants at points of a CFG; which analysis serves which optimisation. PYQ: 2026s1-32, 2014s1-17

## CD10 · Runtime environments and the whole compiler
notes: compiler-design/04-runtime-environments
hours: 1

### Storage at run time
- CD10.1 T Memory layout: code, static data, stack and heap.
- CD10.2 T Each call pushes an activation record: parameters, return value, return address, saved registers, control link, access link, locals and temporaries.
- CD10.3 T Static allocation cannot support recursion; stack allocation handles calls and recursion; data that outlives its call (malloc, closures) needs the heap.
- CD10.4 T Parameter passing and static vs dynamic scoping: as in P10.
- CD10.5 Q Storage allocation, activation records, and which statements about the run-time environment hold. PYQ: 2020-9, 2018-8, 2009-42

### Putting it together
- CD10.6 Q Match phases with the techniques and structures they use: regular expressions and DFAs, LALR tables, syntax trees and DAGs, data-flow analysis, graph colouring, activation records. PYQ: 2024s2-11, 2022-3, 2016s2-19, 2015s2-19, 2009-17, 1994-3.5, 1990-2.ix
- CD10.7 L Assemblers, macros, linkers and loaders (system software in the old syllabus). PYQ: 2004-9, 2003-76, 2002-2.20, 2001-1.17, 1998-1.28, 1998-1.25, 1997-1.9, 1996-2.17, 1996-2.16, 1996-1.17, 1995-1.14, 1995-1.11, 1994-18a, 1994-18b, 1994-17a, 1994-17b, 1993-7.7, 1993-7.6, 1992-03.ii, 1992-3.i, 1992-01.vii, 1992-01.viii, 1991-03.ix, 1990-4.v
