# Part 5 · Compiler Design

Official GATE 2027 wording (Section 7): "Lexical analysis, parsing, syntax-directed translation. Runtime environments. Intermediate code generation. Local optimisation, Data flow analyses: constant propagation, liveness analysis, common sub expression elimination."

2nd block, every day, side by side with Aptitude and DBMS (AGENTS.md 2.9). Rebuilt from zero on 19 Nov 2026: the student is assumed to know nothing of compilers, so every idea is taught here before it is used, including the small pieces of strings, regular expressions, automata and grammars a compiler needs.
Weight from the papers: 5.9 marks a paper since 2014, 7.1 since 2021. Parsing (grammars, FIRST and FOLLOW, LL(1), LR items, conflicts, comparing parsers) is about half of it; syntax-directed translation and the back end (three-address code, basic blocks, DAGs, liveness) share the rest. Since 2021 every question has been inside the official wording; linkers, assemblers, macros and register allocation have not been asked since 2017 and are legacy lines.
How to read this file: `##` is a topic (a unit), `###` a subtopic, each `-` line one minor topic to teach, in this order. Nothing here uses an idea before the line that teaches it: `npm run check:syllabus` proves it.
Letters: **T** concept, **Q** question pattern from real PYQs, **N** never asked yet but inside the syllabus, **L** legacy (old papers or the old syllabus). `Teaches:` names the concepts a line introduces (`concepts.json`).
PYQ ids are newest first. See `README.md` for the rules and `npm run syllabus` for the next step. Parameter passing and static and dynamic scoping are taught in P10 (Programming in C), with their PYQs.

## CD01 · What a compiler does, and the lexer
notes: compiler-design/01-lexical-analysis
hours: 2.5

### The big picture
- CD01.1 T A compiler translates a whole program in a source language into an equivalent program in a target language (usually machine code) before it runs; an interpreter executes the source statement by statement instead.
- CD01.2 T The phases in order: lexical, syntax and semantic analysis, intermediate code generation, optimisation, code generation; the symbol table and the error handler serve all of them. Teaches: phases, ir
- CD01.3 T Analysis (the first three phases: understand the source) vs synthesis (the rest: build the target). Front end (depends on the source language) vs back end (depends on the target machine).
- CD01.4 T Token (the category, like identifier or number), lexeme (the actual characters, like `count` or `42`) and pattern (the rule that says which lexemes belong to a token). Teaches: token
- CD01.5 T What each phase takes in and gives out: characters → tokens → syntax tree → annotated syntax tree → intermediate code → optimised intermediate code → target code.
- CD01.6 Q Which phase does this, takes this as input, or comes before which. PYQ: 2023-1, 2017s2-05, 1987-1.xi

### Errors and the symbol table
- CD01.7 T Which phase catches which error: a malformed lexeme (an illegal character, an unterminated string) is lexical; tokens in an order the language forbids is syntax; well-formed but meaningless (type mismatch, undeclared name, wrong number of arguments) is semantic.
- CD01.8 T A misspelt keyword (`fro` for `for`) is still a valid identifier, so the lexer passes it and the error shows up later.
- CD01.9 Q Which phase reports the error in this program. PYQ: 2026s1-17, 2021s2-3, 2005-61
- CD01.10 T The symbol table: one entry per name with its type, scope and storage; usually a hash table; built in the early phases and read by all the later ones.
- CD01.11 Q What the symbol table holds, who builds it, and which data structure keeps a name's attributes. PYQ: 2025s1-2, 2010-13

### Strings, patterns and the lexer
- CD01.12 T Alphabet (a finite set of symbols), string (a finite sequence of them, ε the empty string), language (a set of strings); concatenation joins two strings.
- CD01.13 T Regular expressions describe token patterns: `a|b` (either), `ab` (one then the other), `a*` (zero or more), `a+` (one or more), `a?` (zero or one), `[a-z]` (any one of a range). An identifier is `letter (letter|digit)*`.
- CD01.14 T A finite automaton reads the input one symbol at a time, moving between a fixed set of states, and accepts if it stops in an accepting state. Every regular expression has one, so the lexer is a finite automaton built from the token patterns.
- CD01.15 T Lexical analysis needs only that power: no counting, no nesting. Keywords are recognised by the lexer, as reserved identifiers looked up in a table.
- CD01.16 Q What power lexical analysis needs, and where keywords are recognised. PYQ: 2011-19, 2011-1
- CD01.17 T In C: keywords, identifiers, constants, string literals, operators and punctuation are tokens; comments and white space are dropped. A string literal is one token, however long.
- CD01.18 T Longest match (maximal munch): at each position the lexer takes the longest prefix any pattern accepts; between patterns matching the same length, the one listed first wins. Then it starts again after that lexeme. Teaches: longest-match
- CD01.19 Q Count the tokens in a statement, or split a string into tokens under given patterns. PYQ: 2026s2-25, 2018-37, 2000-1.18
- CD01.20 L Old one-liners on identifier length and compilation speed. PYQ: 1987-1.xvii

## CD02 · Grammars, derivations and ambiguity
notes: compiler-design/02-parsing
hours: 2.5

### Context-free grammars
- CD02.1 T Regular expressions cannot describe nesting (balanced parentheses, if inside if), so syntax needs a grammar: terminals (the tokens), non-terminals (syntactic categories), productions `A → α`, and a start symbol.
- CD02.2 T A derivation step replaces one non-terminal by the right side of one of its productions; the language of the grammar is every string of terminals derivable from the start symbol.
- CD02.3 T Leftmost and rightmost derivations (always expand the leftmost or the rightmost non-terminal), sentential forms (any step of a derivation), and the parse tree, which is the same for both orders. Teaches: derivation
- CD02.4 Q What a grammar generates: which string is in it, which grammar gives this language, what language this grammar gives. PYQ: 2016s2-46, IT2008-78, 2007-78, 2006-84, 2004-88, 1997-11
- CD02.5 Q Count the steps of a derivation, or the parse trees of a string. PYQ: 2024s2-42, IT2008-79, 2007-79, 2006-85
- CD02.6 T Chomsky normal form: every production is `A → BC` or `A → a`; deriving a string of length n takes exactly 2n − 1 steps (n − 1 binary steps, n terminal steps).
- CD02.7 Q Derivation length in a grammar in Chomsky normal form. PYQ: 2024s1-49, 1994-20, 1992-02.xviii
- CD02.8 L Which class (regular, context-free, context-sensitive) a set of productions is, and what context-free grammars cannot check (declaration before use). PYQ: 1995-1.10, 1994-1.18
- CD02.9 L Write a grammar for a described statement and draw its tree (old descriptive). PYQ: 1993-25

### Two ways to parse
- CD02.10 T Top-down parsing builds the tree from the root and follows a leftmost derivation; bottom-up parsing reduces the input to the start symbol and traces a rightmost derivation in reverse. Teaches: top-down
- CD02.11 T Recursive descent and predictive parsers are top-down; shift-reduce, operator precedence and LR-family parsers are bottom-up.
- CD02.12 Q Top-down or bottom-up, and which derivation a parser follows. PYQ: 2024s1-16, 2019-3, 2000-1.19, 1987-1.xiv

### Ambiguity
- CD02.13 T A grammar is ambiguous when some string has two parse trees (equivalently, two leftmost derivations, or two rightmost). Teaches: ambiguity
- CD02.14 T The classic cases: `E → E+E | E*E | id`, `S → SS | a`, and the dangling else.
- CD02.15 T Ambiguity is a property of the grammar: an ambiguous grammar can often be rewritten unambiguously for the same language, but some languages are inherently ambiguous.
- CD02.16 T A non-terminal that is left- and right-recursive at once (`A → AαA`-style) makes the grammar ambiguous; being recursive on one side only does not.
- CD02.17 Q Is this grammar ambiguous; how many parse trees a string has; the shortest ambiguous string. PYQ: 2026s2-19, 2006-32, IT2005-83a, IT2005-83b, 1998-14, 1996-2.10, 1990-16a, 1987-1.xii
- CD02.18 Q True statements about ambiguity and derivations. PYQ: IT2007-9

## CD03 · Precedence, left recursion and left factoring
notes: compiler-design/02-parsing
hours: 2

### Precedence and associativity in a grammar
- CD03.1 T Layered expression grammars (`E → E+T | T`, `T → T*F | F`, `F → (E) | id`): an operator deeper in the layers binds tighter.
- CD03.2 T A rule recursive on its left end (`E → E+T`) makes the operator left-associative; one recursive on its right end (`E → T^E`) makes it right-associative.
- CD03.3 Q Precedence and associativity of the operators in a given grammar. PYQ: 2014s2-17, 2000-2.21, 1997-1.6, 1991-10a
- CD03.4 T Evaluating under a stated table: parenthesise by precedence first, then by associativity inside one level, then compute; the usual school rules do not apply.
- CD03.5 Q Evaluate an expression, or pick its tree, under a given precedence and associativity. PYQ: 2024s1-23, 2018-38, 2016s1-45, 2011-27

### Rewriting grammars
- CD03.6 T Remove immediate left recursion: `A → Aα | β` becomes `A → βA′`, `A′ → αA′ | ε`. Teaches: left-recursion
- CD03.7 T Indirect left recursion (`A → Bd`, `B → Ae | c`): order the non-terminals, substitute the earlier ones in, then remove the immediate recursion.
- CD03.8 Q Remove left recursion, pick the equivalent grammar free of it, or spot which grammar is left-recursive. PYQ: 2017s2-32, 2016s2-45, 2001-18, 1998-6b, 1991-10c, 1991-10b
- CD03.9 T Left factoring: `A → αβ1 | αβ2` becomes `A → αA′`, `A′ → β1 | β2`, so one look-ahead symbol can choose.
- CD03.10 T Nullable non-terminals (those that can derive ε), removing ε-productions (add every version without a nullable symbol) and unit productions (`A → B`).
- CD03.11 Q Grammar transformations: removing ε- and unit productions, and which transformation theorems hold. PYQ: 2008-50, 1996-11
- CD03.12 L Operator grammars: no ε-production and no two adjacent non-terminals. PYQ: 2004-8

## CD04 · FIRST, FOLLOW and LL(1)
notes: compiler-design/02-parsing
hours: 2.5

### FIRST and FOLLOW
- CD04.1 T FIRST(α): the terminals that can begin a string derived from α, plus ε if α can vanish. Teaches: first-set
- CD04.2 T For `X1X2…Xn`, take FIRST(X1) − ε; add FIRST(X2) only while every earlier symbol is nullable; ε only if all of them are.
- CD04.3 T FOLLOW(A): the terminals that can come right after A in some sentential form; $ (end of input) for the start symbol; never ε. Teaches: follow-set
- CD04.4 T From `B → αAβ` add FIRST(β) − ε to FOLLOW(A); if β can vanish (or is empty), add all of FOLLOW(B).
- CD04.5 Q Compute FIRST and FOLLOW sets, or complete a grammar from given sets. PYQ: 2024s1-28, 2019-19, 2017s1-17
- CD04.6 Q Which rule puts what into FIRST or FOLLOW: true statements about the inclusions. PYQ: 2025s1-36, 1992-02.xiii

### The LL(1) table
- CD04.7 T Fill M[A, a] with `A → α` for each a in FIRST(α); if ε is in FIRST(α), also for each b in FOLLOW(A), $ included; empty cells are syntax errors. Teaches: ll1
- CD04.8 Q Fill the missing entries of an LL(1) table, or say what a given cell holds. PYQ: 2024s2-30, 2021s1-31, 2012-53, 2012-52, 2006-58, 2003-56, 2001-16, 1998-22, 1995-8
- CD04.9 T A grammar is LL(1) when no cell holds two rules: for `A → α | β`, FIRST(α) and FIRST(β) are disjoint, and if one can vanish, the other's FIRST and FOLLOW(A) are disjoint.
- CD04.10 T Left recursion, a common prefix, or ambiguity always breaks LL(1); right recursion is fine. Removing left recursion and left factoring do not make every grammar LL(1).
- CD04.11 Q Is this grammar LL(1), why not, and what is enough to make it so. PYQ: 2007-52, 2005-14, 2003-16, 1995-9
- CD04.12 T The LL(1) driver: a stack of grammar symbols and the look-ahead; expand a non-terminal on top with the table, match a terminal on top with the input.
- CD04.13 N Recursive descent: the same parser written as one procedure per non-terminal; it loops forever on left recursion.

## CD05 · Shift-reduce parsing and LR(0) items
notes: compiler-design/02-parsing
hours: 2.5

### Shift-reduce parsing
- CD05.1 T Shift-reduce parsing: shift the next token onto a stack, or reduce a right side on top of the stack to its non-terminal; accept when only the start symbol is left. Teaches: handle
- CD05.2 T A handle is the right side reduced at a step of the reverse rightmost derivation, together with its position; a right-sentential form is a step of a rightmost derivation; viable prefixes are exactly what can sit on the stack.
- CD05.3 Q Find the handles of a right-sentential form; what is true about viable prefixes. PYQ: 2015s1-13, 2008-11, 2005-59
- CD05.4 T Every reduction makes one interior node of the parse tree, so the reductions on a string count the tree's interior nodes.
- CD05.5 Q Count the reductions a bottom-up parser makes on a string, or the most it can make without ε- and unit productions. PYQ: 2020-24, 2013-9

### LR(0) items and the automaton
- CD05.6 T Augment the grammar with `S′ → S`. An LR(0) item is a production with a dot: how much of the right side has been seen. Teaches: lr0-items
- CD05.7 T CLOSURE(I): for every item with a dot before a non-terminal B, add every `B → •γ`, and repeat until nothing new appears.
- CD05.8 T GOTO(I, X): move the dot over X in every item that allows it, then take the closure.
- CD05.9 T The canonical collection: start from CLOSURE({S′ → •S}) and take GOTO on every symbol; each item set is one state of the LR(0) automaton, which recognises the viable prefixes.
- CD05.10 Q Count the items in a CLOSURE or GOTO set, or the states of the automaton. PYQ: 2024s2-55, 2022-19, 2021s2-51, 2019-43, 2006-7, 1988-10ia

### The LR(0) table
- CD05.11 T Shift entries come from GOTO on terminals, goto entries from GOTO on non-terminals; a complete item `A → α•` means reduce; `S′ → S•` means accept.
- CD05.12 T LR(0) reduces on every symbol, so a complete item beside a shift item is a shift-reduce conflict, and two complete items in one state are a reduce-reduce conflict.

## CD06 · SLR, LR(1), LALR and comparing parsers
notes: compiler-design/02-parsing
hours: 3

### SLR(1)
- CD06.1 T SLR(1): same states as LR(0), but reduce `A → α` only on the terminals in FOLLOW(A), so fewer conflicts. Teaches: slr
- CD06.2 Q Shift-reduce and reduce-reduce conflicts in a given state or table. PYQ: 2014s1-34, 1988-10ib

### Canonical LR(1)
- CD06.3 T An LR(1) item carries a look-ahead: `[A → α•, a]` reduces only on a. Teaches: lr1-items
- CD06.4 T The closure of `[A → α•Bβ, a]` adds `[B → •γ, b]` for every b in FIRST(βa).
- CD06.5 Q Conflicts in a canonical LR(1) parser. PYQ: 2026s2-31

### LALR(1)
- CD06.6 T LALR(1) merges the LR(1) states that have the same core (the same items, different look-aheads), so it has the LR(0) number of states. Teaches: lalr
- CD06.7 T Merging can create reduce-reduce conflicts but never a new shift-reduce conflict.
- CD06.8 Q What merging states with a common core can and cannot do. PYQ: 2013-40, 2008-55, 1989-1.iii
- CD06.9 T yacc builds an LALR(1) parser; on an ambiguous grammar it resolves a shift-reduce conflict by shifting (and a reduce-reduce by the earlier rule) unless precedence is declared, so operators come out right-associative with equal precedence.

### Comparing parsers
- CD06.10 T Power: LR(0) ⊂ SLR(1) ⊂ LALR(1) ⊂ LR(1); every LL(1) grammar is LR(1); any context-free grammar can be parsed in O(n³) by a general parser.
- CD06.11 T No ambiguous grammar is LL(k) or LR(k); every SLR(1) grammar is unambiguous, but not every unambiguous grammar is SLR(1).
- CD06.12 T States: LR(0), SLR(1) and LALR(1) have the same number; canonical LR(1) has at least as many, often far more.
- CD06.13 Q Number of states in SLR, LALR and canonical LR parsers. PYQ: 2005-60, 2003-17
- CD06.14 Q True statements about LL, SLR, LALR and canonical LR parsers and ambiguity. PYQ: 2026s1-18, 2021s1-5, 2017s2-6, 2015s3-16, 2007-18, 2002-22, 2001-1.18, 1999-2.15, 1999-1.17, 1998-1.26, 1992-02.xiv
- CD06.15 Q Which of LL(1), SLR(1), LALR(1), LR(1) a given grammar is. PYQ: 2025s2-41, 2025s2-30, 2015s3-31, 2010-38, 2007-53, 2003-57

## CD07 · Syntax-directed translation
notes: compiler-design/03-syntax-directed-translation
hours: 2.5

### Attributes and translation schemes
- CD07.1 T A syntax-directed definition (SDD) attaches attributes to grammar symbols and semantic rules to productions. Teaches: sdd
- CD07.2 T Synthesized attributes are computed from the children, inherited ones from the parent and siblings; an annotated parse tree shows every attribute's value; the dependency graph orders the evaluation.
- CD07.3 T Evaluate on the tree the grammar itself builds, not on the usual precedence: an operator redefined by the rules (`#` meaning ×) keeps the grammar's grouping.
- CD07.4 T A translation scheme (SDT) puts actions inside productions, at the point where they run. Teaches: translation-scheme
- CD07.5 T In bottom-up parsing an action at the end runs when its production is reduced, so the output order is the order of reductions; an action in the middle runs when the parser reaches that point.
- CD07.6 Q The value computed at the root for an input, or the attribute found. PYQ: 2024s1-27, 2023-50, 2022-55, 2004-45, 2000-19
- CD07.7 L Write an SDD for a small task (binary fractions, counting reductions; old descriptive). PYQ: 1998-23, 1992-11a

### Output of a translation scheme
- CD07.8 Q What a translation scheme prints for an input. PYQ: 2016s1-46, 2006-59, 2003-58, 1996-20, 1995-2.10
- CD07.9 Q What a yacc parser does with an ambiguous expression grammar and its actions. PYQ: 2005-83b, 2005-83a

### S-attributed and L-attributed
- CD07.10 T S-attributed: synthesized attributes only, evaluated in one bottom-up pass during LR parsing. Teaches: attributed
- CD07.11 T L-attributed: an inherited attribute may depend only on the parent's inherited attributes and on siblings to its left, so one left-to-right depth-first pass works; every S-attributed definition is L-attributed.
- CD07.12 Q Is a definition S- or L-attributed; which attributes are inherited; how inherited types are passed down a declaration list. PYQ: 2026s1-43, 2025s2-12, 2024s2-19, 2020-33, 2019-36, 2003-18

### Type checking
- CD07.13 T Semantic analysis checks types through semantic rules, using the symbol table: an expression's type is synthesized from its operands' types.
- CD07.14 Q Type checking with semantic rules, and when it is done. PYQ: 2021s1-26, 1998-1.27

## CD08 · Intermediate code
notes: compiler-design/05-intermediate-code-generation
hours: 2

### Three-address code
- CD08.1 T Three-address code: at most one operator on the right (`x = y op z`), plus copies, jumps, conditional jumps, indexed assignments and calls; compiler-made temporaries (t1, t2…) hold partial results. Teaches: tac
- CD08.2 T Quadruples (op, arg1, arg2, result), triples (no result field: a result is referred to by its triple's number) and indirect triples (a list of pointers, easy to reorder).
- CD08.3 Q Write or complete three-address code, quadruples or triples for an expression or statement, including code produced by semantic rules. PYQ: 2024s2-33, 2003-59, 2001-17
- CD08.4 T Control flow: if-else and loops become labels and conditional jumps; `&&` and `||` become short-circuit jumps, while non-short-circuit code evaluates every operand.
- CD08.5 Q Code templates for if-then-else, repeat-until and boolean expressions. PYQ: 1992-11b, 1989-4.v
- CD08.6 T Backpatching: emit jumps with their targets left empty and fill them in once the targets are known, so control flow is translated in one pass. Teaches: backpatching
- CD08.7 Q What backpatching does and when it is needed. PYQ: 2025s2-11

### SSA form
- CD08.8 T Static single assignment: every variable is assigned exactly once; each new assignment gets a new name (x1, x2…), and later uses take the latest name. Teaches: ssa
- CD08.9 T Counting SSA names means counting assignments; at a join of two paths a φ-function picks the right version.
- CD08.10 Q Convert to SSA, or count the variables or temporaries SSA needs. PYQ: 2017s1-12, 2016s1-19, 2015s1-55

### Why compilers use intermediate code
- CD08.11 T Intermediate code lets one front end serve many target machines and lets optimisation be machine-independent; it does not make parsing or error recovery easier.
- CD08.12 Q The purpose of intermediate code, and why optimisations are done on it. PYQ: 2014s3-17, 2008-12, 1994-1.12

## CD09 · Basic blocks and local optimisation
notes: compiler-design/06-code-optimization
hours: 2.5

### Basic blocks and flow graphs
- CD09.1 T Leaders: the first instruction, every jump target, and every instruction right after a jump (conditional or not). Teaches: basic-block
- CD09.2 T A basic block runs from a leader up to the next leader: control enters only at the top and leaves only at the bottom.
- CD09.3 Q Find the leaders and count the basic blocks. PYQ: 2025s1-42, 2024s1-29
- CD09.4 T The control-flow graph: one node per block, an edge for each possible transfer of control (the jump and the fall-through).
- CD09.5 Q Nodes, edges or paths in the control-flow graph of some code. PYQ: 2017s1-43, 2015s2-29
- CD09.6 T Intermediate forms side by side: syntax tree and abstract syntax tree (structure), postfix, three-address code (instructions), control-flow graph (blocks and jumps). The symbol table is a data structure, not an intermediate form.
- CD09.7 Q Which forms are or are not intermediate representations; the abstract syntax tree vs the control-flow graph. PYQ: 2021s2-13, 2015s2-14

### Local optimisations
- CD09.8 T Within a block: constant folding, constant propagation, copy propagation, common subexpression elimination, dead-code elimination, algebraic simplification and strength reduction (`x*2` → `x+x`, `x*8` → `x<<3`). Teaches: local-opt
- CD09.9 Q Which optimisation applies, the code after it, the fewest operations needed. PYQ: 2014s3-11, 2006-55
- CD09.10 T Build the DAG of a block: leaves for initial values, one interior node per distinct operation; a repeated subexpression reuses its node, and a reassigned variable just moves its label (an operand changed in between means a new node). Teaches: expr-dag
- CD09.11 Q Nodes and edges in the DAG of a block, and what it reveals. PYQ: 2021s1-50, 2014s3-34, 1988-2xvii
- CD09.12 T Loop optimisations: move loop-invariant code out (code motion), replace induction-variable multiplications by additions, remove redundant induction variables, unroll.
- CD09.13 Q Which optimisations apply to a loop, and what the loop becomes. PYQ: 2021s2-30, 2006-60

## CD10 · Data-flow analysis
notes: compiler-design/06-code-optimization
hours: 2

### Liveness
- CD10.1 T A variable is live at a point if its current value may be used later on some path before it is overwritten. Teaches: liveness
- CD10.2 T Liveness flows backwards: IN[B] = USE[B] ∪ (OUT[B] − DEF[B]), OUT[B] = ∪ IN of the successors. USE[B] holds the variables read in B before any write in B.
- CD10.3 T On a graph with loops, iterate the equations until nothing changes.
- CD10.4 Q The live variables at the entry or exit of the blocks of a flow graph. PYQ: 2026s2-35, 2023-27, 2015s1-50
- CD10.5 T Liveness drives register allocation and dead-code elimination: a value assigned and never live is dead.
- CD10.6 Q Liveness equations and what liveness is used for. PYQ: 2025s1-3, 2021s2-38
- CD10.7 L Register allocation and the fewest registers for an expression or a block (code generation, outside the 2027 wording). PYQ: 2017s1-52, 2013-48, 2011-36, 2010-37, 2004-10, 1997-4.9

### Forward analyses
- CD10.8 T Constant propagation and available expressions flow forwards from the entry: a value is known (or an expression available) at a point only if it is so on every path into it, so paths meet by intersection. Teaches: forward-flow
- CD10.9 T Available expressions find global common subexpressions: an expression recomputed where it is already available on every path is redundant; a write to an operand kills it.
- CD10.10 Q Redundant expressions or known constants at points of a flow graph; which analysis serves which optimisation. PYQ: 2026s1-32, 2014s1-17
- CD10.11 N Constant propagation across a flow graph: a variable is a constant at a point only if every path brings the same constant.

## CD11 · Runtime environments and the whole compiler
notes: compiler-design/04-runtime-environments
hours: 1.5

### Storage at run time
- CD11.1 T Memory layout: code, static data, stack and heap.
- CD11.2 T Each call pushes an activation record: parameters, return value, return address, saved registers, control link, access link, locals and temporaries.
- CD11.3 T Static allocation cannot support recursion; stack allocation handles calls and recursion; data that outlives its call needs the heap.
- CD11.4 T Parameter passing and static vs dynamic scoping are as in P10.
- CD11.5 Q Which statements about compilers and the run-time environment hold. PYQ: 2022-3, 2020-9, 2009-42

### Putting it together
- CD11.6 Q Match phases with the techniques and structures they use: regular expressions and automata, LALR tables, syntax trees and DAGs, data-flow analysis, graph colouring, activation records. PYQ: 2024s2-11, 2018-8, 2016s2-19, 2015s2-19, 2009-17, 1994-3.5, 1990-2.ix
- CD11.7 L Assemblers, macros, linkers and loaders (system software in the old syllabus). PYQ: 2004-9, 2003-76, 2002-2.20, 2001-1.17, 1998-1.28, 1998-1.25, 1997-1.9, 1996-2.17, 1996-2.16, 1996-1.17, 1995-1.14, 1995-1.11, 1994-18a, 1994-18b, 1994-17a, 1994-17b, 1993-7.7, 1993-7.6, 1992-03.ii, 1992-3.i, 1992-01.vii, 1992-01.viii, 1991-03.ix, 1990-4.v
