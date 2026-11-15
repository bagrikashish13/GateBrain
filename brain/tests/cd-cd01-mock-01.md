---
title: Compiler Design · CD01 Sectional (Phases & Lexical Analysis)
duration: 60
created: 2026-11-15
level: tougher
description: Tough sectional mock on Unit CD01. Advanced theory MSQs, longest match traces, and phase edge cases.
---

## Q1
type: MCQ
marks: 1
subject: compiler-design
topic: lexical-analysis
syllabus: CD01.1
answer: C
difficulty: easy

Which of the following components of a standard compiler interacts with, provides services to, or is updated by EVERY phase of the compiler pipeline?

(A) The Parser and the Intermediate Code Generator
(B) The Preprocessor and the Assembler
(C) The Symbol Table and the Error Handler
(D) The Target Code Optimizer and the Linker

### Solution
The compiler is organized as a sequential pipeline of phases (Lexical $\to$ Syntax $\to$ Semantic $\to$ Intermediate Code Generation $\to$ Code Optimization $\to$ Code Generation). Across this entire pipeline, two central data/control facilities are universally shared:
1. **The Symbol Table:** Created/populated in early phases and consulted by all subsequent phases (including the Code Generator for sizing, offsets, and register assignment).
2. **The Error Handler:** Every phase can encounter and must report phase-specific errors (lexical, syntactic, semantic, etc.).

Hence, (C) is the correct answer.

## Q2
type: MSQ
marks: 2
subject: compiler-design
topic: lexical-analysis
syllabus: CD01.6
answer: A, B, C
difficulty: hard
pyq: 2026s1-17

Consider the following four erroneous program constructs in a statically typed C-like language:

- **$E_1$:** An identifier declared as `int 9count = 0;`
- **$E_2$:** A string literal written as `char *msg = "Syntax error;` without a closing quotation mark before the end of the line.
- **$E_3$:** A floating-point literal written as `float val = 45.67.89;`
- **$E_4$:** A function call `calculate(10, 20);` where `calculate` is defined with three `int` parameters.

Which of the following statements is/are **CORRECT** regarding the phases that report these errors?

(A) Both $E_1$ and $E_2$ are detected and reported during the lexical analysis phase.
(B) $E_3$ is detected during lexical analysis because no valid numeric constant pattern matches multiple decimal points.
(C) $E_4$ is detected during semantic analysis as a parameter count (arity) mismatch.
(D) $E_2$ is reported as a syntax error because quotation marks are delimiters checked by the parser.

### Solution
- **$E_1$ (`int 9count`):** In C, an identifier pattern is `[a-zA-Z_][a-zA-Z0-9_]*`. A token beginning with a digit cannot match an identifier pattern. When the lexer sees `9`, it expects a numeric constant, but encounters non-numeric characters `count`. It fails at the lexical analysis stage. Statement (A) is correct.
- **$E_2$ (`"Syntax error;`):** An unterminated string literal fails to match the regular expression pattern for string constants (`"([^"\\]|\\.)*"`). The lexer encounters a newline or EOF before the matching quote, flagging a **lexical error**. Hence, (D) is FALSE and (A) is TRUE.
- **$E_3$ (`45.67.89`):** A floating-point constant pattern allows at most one decimal point (`[0-9]+\.[0-9]+`). The presence of a second decimal point cannot form any valid token pattern; it produces a **lexical error**. Statement (B) is correct.
- **$E_4$ (`calculate(10, 20)`):** Syntactically, `calculate(10, 20)` is a completely valid function call (`ID ( expr , expr )`). The parser cannot know how many arguments `calculate` expects without checking its declaration in the symbol table. The type checker in **semantic analysis** compares the call's argument types and arity against the function prototype. Statement (C) is correct.

Correct options: (A, B, C).

## Q3
type: MCQ
marks: 1
subject: compiler-design
topic: lexical-analysis
syllabus: CD01.5
answer: B
difficulty: medium

Consider the intermediate representations passed between consecutive compiler phases:

1. **Rep 1:** Stream of tokens
2. **Rep 2:** Annotated parse / syntax tree with attribute types
3. **Rep 3:** Linear sequence of three-address code instructions
4. **Rep 4:** Abstract syntax tree

What is the correct chronological order in which these representations are produced during compilation?

(A) Rep 1 $\to$ Rep 3 $\to$ Rep 4 $\to$ Rep 2
(B) Rep 1 $\to$ Rep 4 $\to$ Rep 2 $\to$ Rep 3
(C) Rep 4 $\to$ Rep 1 $\to$ Rep 2 $\to$ Rep 3
(D) Rep 1 $\to$ Rep 2 $\to$ Rep 4 $\to$ Rep 3

### Solution
The transformation flow through the front-end phases is:
1. Source character stream $\to$ **Lexical Analyzer** $\to$ **Stream of tokens (Rep 1)**.
2. Stream of tokens $\to$ **Syntax Analyzer (Parser)** $\to$ **Abstract Syntax Tree (Rep 4)**.
3. Abstract syntax tree $\to$ **Semantic Analyzer** $\to$ **Annotated Syntax Tree (Rep 2)** (decorated with types, symbol table references, and semantic attributes).
4. Annotated syntax tree $\to$ **Intermediate Code Generator** $\to$ **Three-Address Code (Rep 3)**.

Thus, the chronological production order is Rep 1 $\to$ Rep 4 $\to$ Rep 2 $\to$ Rep 3. Hence, (B) is correct.

## Q4
type: MSQ
marks: 2
subject: compiler-design
topic: lexical-analysis
syllabus: CD01.2
answer: A, B, D
difficulty: hard
pyq: 2023-1

Which of the following statements is/are **TRUE** concerning the logical decomposition of a compiler into a Front-End and a Back-End?

(A) The front-end consists of phases that are dependent on the source programming language but independent of the target machine architecture.
(B) Intermediate code generation forms part of the compiler's front-end because its output is a target-independent representation.
(C) All code optimization passes belong strictly to the back-end because optimization must always target specific CPU registers.
(D) In an organization supporting $m$ source programming languages and $n$ target machine architectures, introducing a standardized intermediate representation reduces the required translation modules from $m \times n$ to $m + n$.

### Solution
- **Statement (A):** TRUE. The front-end (Lexical, Syntax, Semantic, IR Generation) parses and validates the source language construct without regard to the underlying hardware target.
- **Statement (B):** TRUE. Intermediate code generation translates the high-level syntax into a machine-independent intermediate representation (IR), decoupling source language semantics from machine hardware.
- **Statement (C):** FALSE. Code optimization is split into **machine-independent optimization** (which operates on the IR to eliminate common subexpressions, propagate constants, and dead-code elimination, independent of CPU registers) and **machine-dependent optimization** (which runs in the back-end for register allocation, peephole instruction selection, and pipeline scheduling).
- **Statement (D):** TRUE. Without a common IR, each language requires a dedicated code generator for each target ($m \times n$ total compilers). With a universal IR, one writes $m$ front-ends ($\text{Source} \to \text{IR}$) and $n$ back-ends ($\text{IR} \to \text{Target}$), totaling $m + n$ modules.

Hence, (A, B, D) are correct.

## Q5
type: NAT
marks: 1
subject: compiler-design
topic: lexical-analysis
syllabus: CD01.4
answer: 14
difficulty: medium

Consider the following valid line of C code:

```c
int x = printf("\"GATE\", %d/*test*/\n", y++ + ++z);
```

How many tokens are produced by the lexical analyzer for this statement?

### Solution
Let us identify each token produced by scanning the statement from left to right:
1. `int` (keyword)
2. `x` (identifier)
3. `=` (assignment operator)
4. `printf` (identifier)
5. `(` (left parenthesis)
6. `"\"GATE\", %d/*test*/\n"` (string literal — the entire quoted sequence, including escaped quotes `\"`, internal commas, and embedded comment-like text `/*test*/`, forms exactly ONE string token)
7. `,` (comma punctuation)
8. `y` (identifier)
9. `++` (post-increment operator)
10. `+` (addition operator)
11. `++` (pre-increment operator)
12. `z` (identifier)
13. `)` (right parenthesis)
14. `;` (semicolon punctuation)

Note that characters inside the string literal are not processed as separate delimiters or comments.
Total count = 14 tokens.

## Q6
type: MCQ
marks: 1
subject: compiler-design
topic: lexical-analysis
syllabus: CD01.11
answer: C
difficulty: medium

Which of the following compiler tasks CANNOT be performed by a lexical analyzer running a Deterministic Finite Automaton (DFA)?

(A) Converting numerical strings of digits into internal binary integer representations
(B) Stripping out single-line (`//`) and non-nested multi-line (`/* ... */`) comments
(C) Verifying that opening and closing parentheses `(` and `)` are properly matched and balanced across nested expressions
(D) Recognizing multicharacter compound assignment operators such as `+=`, `-=`, and `*=`

### Solution
- A DFA has a fixed, finite number of states and **no auxiliary memory or stack**.
- Checking that parentheses are balanced across arbitrary nesting depths is equivalent to recognizing the language $L = \{ (^n )^n \mid n \ge 1 \}$, which is a classic non-regular context-free language. By the pumping lemma / pigeonhole principle, a finite automaton with $k$ states cannot track an arbitrary nesting depth $> k$.
- Thus, verifying balanced parentheses requires a **Pushdown Automaton (PDA)**, which is the domain of the **Syntax Analyzer (Parser)**.
- In contrast, integer conversion, non-nested comment elimination, and compound operator recognition are all regular operations easily performed by a DFA.

Hence, (C) is correct.

## Q7
type: NAT
marks: 2
subject: compiler-design
topic: lexical-analysis
syllabus: CD01.15
answer: 3
difficulty: hard
pyq: 2018-37

A lexical analyzer recognizes tokens over the alphabet $\Sigma = \{a, b\}$ using the **longest match (maximal munch)** rule with the following three token patterns:

- **$T_1$:** $a^* b$ *(zero or more $a$'s followed by a single $b$)*
- **$T_2$:** $a b^* a$ *(an $a$, followed by zero or more $b$'s, ending in $a$)*
- **$T_3$:** $b a^* b$ *(a $b$, followed by zero or more $a$'s, ending in $b$)*

If the input string to be tokenized is:
$$\text{`a b a b a b b'}$$
*(represented as continuous string `abababb` without internal whitespace)*

What is the total number of tokens produced by the lexical analyzer?

### Solution
Input string: `a b a b a b b` (indices 0 to 6, length 7).

**Token 1 (starting at index 0):**
Candidate matches from index 0:
- $T_1 = a^*b$: matches `ab` (length 2).
- $T_2 = ab^*a$:
  - `aba` (length 3, since $a \cdot b \cdot a$ matches $ab^*a$).
  - Can it match longer? Index 3 is `b`, index 4 is `a`. Does `ababa` match $ab^*a$? No, $ab^*a$ only allows $b$'s between the two $a$'s.
  - So longest match for $T_2$ is `aba` (length 3).
- $T_3 = ba^*b$: starts with $b$, but input starts with $a$ (no match).

Comparing lengths: `aba` ($T_2$, length 3) > `ab` ($T_1$, length 2).
By longest match, **Token 1 is $T_2$**, consuming characters `aba` (indices 0, 1, 2).

Remaining string: `b a b b` (indices 3 to 6).

**Token 2 (starting at index 3):**
Candidate matches from index 3 (`b...`):
- $T_1 = a^*b$: starts with $b$ ($a^* = \epsilon$), matches single character `b` (length 1).
- $T_2 = ab^*a$: starts with $a$, but remaining string starts with $b$ (no match).
- $T_3 = ba^*b$:
  - `bab` (length 3, since $b \cdot a \cdot b$ matches $ba^*b$).
  - Can it extend to index 6 (`b`)? `babb` has a second $b$ before the end; $ba^*b$ allows only $a$'s in the middle. So it cannot extend to 4 characters.
  - Longest match for $T_3$ is `bab` (length 3).

Comparing lengths: `bab` ($T_3$, length 3) > `b` ($T_1$, length 1).
By longest match, **Token 2 is $T_3$**, consuming characters `bab` (indices 3, 4, 5).

Remaining string: `b` (index 6).

**Token 3 (starting at index 6):**
Candidate matches for single character `b`:
- $T_1 = a^*b$: with $a^* = \epsilon$, matches `b` (length 1).
- $T_2$: requires ending in $a$ (no match).
- $T_3$: requires two $b$'s ($ba^*b$, minimum length 2; no match).

Hence, **Token 3 is $T_1$**, consuming `b` (length 1).

All 7 characters are consumed:
Sequence = $T_2, T_3, T_1$.
Total number of tokens = 3.

## Q8
type: MSQ
marks: 2
subject: compiler-design
topic: lexical-analysis
syllabus: CD01.6
answer: A, B, C
difficulty: medium

Which of the following statements is/are **CORRECT** regarding compiler error detection and classification?

(A) Detecting whether a variable has been declared before its use in a function scope is performed during semantic analysis, not syntax analysis.
(B) A character in source code that does not match any regular expression pattern of the language specification triggers a lexical error.
(C) Type mismatch between the condition expression of a `while` loop and the expected boolean/scalar type is caught during semantic analysis.
(D) An expression attempting a division by zero with runtime variables (such as `x / y`) must always be halted by the compiler during syntax analysis.

### Solution
- **Statement (A):** TRUE. The parser verifies structure (`ID = EXPR;`), but checking whether `ID` exists in the current or enclosing scope requires looking up the symbol table, which is a **semantic check**.
- **Statement (B):** TRUE. The lexical analyzer's job is to partition the character stream into valid token patterns. Any stray illegal character (e.g. `@` or `$` in standard C code outside strings/comments) produces a **lexical error**.
- **Statement (C):** TRUE. Checking that an expression evaluates to a valid conditional/boolean type is part of static type checking, performed by the **semantic analyzer**.
- **Statement (D):** FALSE. When variables `x` and `y` are evaluated dynamically at run time, their runtime values cannot be known during static syntax analysis. Dynamic division by zero is a **run-time error / exception**, not a syntax error.

Hence, (A, B, C) are correct.

## Q9
type: MCQ
marks: 1
subject: compiler-design
topic: lexical-analysis
syllabus: CD01.12
answer: B
difficulty: easy

In a typical production compiler for languages like C or Java, how are reserved keywords (such as `if`, `else`, `return`) recognized?

(A) By the syntax analyzer, which treats keywords as grammar non-terminals
(B) By the lexical analyzer, which scans words using the general identifier pattern and looks them up in a reserved keyword table
(C) By the semantic analyzer, which marks keywords as immutable constants in the symbol table
(D) By the target code generator, which translates keywords directly into machine opcodes

### Solution
Rather than adding dozens of specialized states to the lexer's DFA for every keyword (which bloats the automaton), standard lexers use a clean two-step mechanism:
1. Scan any sequence of letters/digits using the standard identifier regular expression: `[a-zA-Z_][a-zA-Z0-9_]*`.
2. Before returning the token, perform a quick hash lookup in a pre-populated **table of reserved keywords**.
   - If the lexeme matches a keyword (e.g., `"return"`), return the specific token type `KEYWORD_RETURN`.
   - If not found, return the generic token type `IDENTIFIER`.

Thus, keywords are recognized during **lexical analysis** as reserved identifiers. Hence, (B) is correct.

## Q10
type: MSQ
marks: 2
subject: compiler-design
topic: lexical-analysis
syllabus: CD01.8
answer: A, B, D
difficulty: hard
pyq: 2025s1-2

Which of the following statements regarding the **Symbol Table** and its role in a compiler is/are **TRUE**?

(A) In languages supporting block-structured nested lexical scopes, the symbol table can be implemented as a stack of hash tables, one per active scope.
(B) The symbol table is accessed during the target code generation phase to retrieve variable data types, memory sizes, and relative stack offsets.
(C) The symbol table contains only user-defined variable names; function names and compiler-generated temporary variables are stored in the syntax tree.
(D) If an identifier is declared multiple times within the same lexical scope block, the semantic analyzer detects this collision by inspecting the symbol table.

### Solution
- **Statement (A):** TRUE. For nested block scopes (like C `{ ... }`), entering a new block pushes a new scope table onto the scope stack; exiting the block pops it. Lookups search from the top (innermost scope) down to the bottom (global scope).
- **Statement (B):** TRUE. The back-end target code generator must emit load/store instructions with exact byte offsets and sizes (e.g., 4 bytes for `int`, 8 bytes for `double`). These offsets and type sizes are stored in the symbol table.
- **Statement (C):** FALSE. The symbol table stores all names: variable names, function names (with parameter signatures and return types), struct definitions, type aliases (`typedef`), and compiler temporaries.
- **Statement (D):** TRUE. When a declaration is processed, the compiler queries the current scope's symbol table. If the same name already exists in the *current* scope, a redeclaration / collision semantic error is raised.

Hence, (A, B, D) are correct.

## Q11
type: MCQ
marks: 1
subject: compiler-design
topic: lexical-analysis
syllabus: CD01.1
answer: A
difficulty: medium

Lexical analyzers in practical compilers often use an input buffering scheme consisting of **two buffers of size $N$ with sentinels**. What is the primary performance benefit of using sentinels at the end of each buffer?

(A) It reduces the number of end-of-buffer boundary checks from two tests per character to one test per character on average.
(B) It allows the compiler to backtrack through the entire source file without disk access.
(C) It enables the lexer to recognize context-free grammars without a pushdown stack.
(D) It automatically expands the symbol table dynamically when buffer overflow occurs.

### Solution
In naive input buffering, for every single character read, the lexer must make two tests:
1. Check if the pointer has reached the end of the buffer.
2. Check which character was read to determine the DFA state transition.

By placing a **sentinel character** (such as EOF) at the end of each buffer half:
- The character-processing loop only checks the character value itself.
- Only when the sentinel character (`EOF`) is encountered does the lexer perform a secondary check to determine whether it has hit the real end of the source file or merely the end of the current buffer half (in which case it reloads the other buffer half).

This optimization halves the branch overhead in the inner scanning loop. Hence, (A) is correct.

## Q12
type: NAT
marks: 2
subject: compiler-design
topic: lexical-analysis
syllabus: CD01.10
answer: 19
difficulty: hard
pyq: 2000-1.18

Consider the following valid C statement containing pre-increment, post-increment, string literals, and comments:

```c
val = calc("Result: \"OK\"", 'X', a++ /* inc */ + ++b, c->d);
```

How many tokens are produced by the lexical analyzer for this statement?

### Solution
Let us trace and count each token produced:
1. `val` (identifier)
2. `=` (assignment operator)
3. `calc` (identifier)
4. `(` (left parenthesis)
5. `"Result: \"OK\""` (string literal — the escaped quotes `\"` are part of the literal; exactly 1 token)
6. `,` (comma)
7. `'X'` (character constant — exactly 1 token)
8. `,` (comma)
9. `a` (identifier)
10. `++` (post-increment operator)
    *(the comment `/* inc */` is stripped by the lexer and generates 0 tokens)*
11. `+` (addition operator)
12. `++` (pre-increment operator)
13. `b` (identifier)
14. `,` (comma)
15. `c` (identifier)
16. `->` (structure pointer member operator — treated as a single token `PTR_OP`)
17. `d` (identifier)
18. `)` (right parenthesis)
19. `;` (semicolon)

Wait! Let us recount carefully:
1: `val`
2: `=`
3: `calc`
4: `(`
5: `"Result: \"OK\""`
6: `,`
7: `'X'`
8: `,`
9: `a`
10: `++`
11: `+`
12: `++`
13: `b`
14: `,`
15: `c`
16: `->`
17: `d`
18: `)`
19: `;`

Total count = 19 tokens!
Let's double-check each element:
- `val` (1)
- `=` (2)
- `calc` (3)
- `(` (4)
- `"Result: \"OK\""` (5)
- `,` (6)
- `'X'` (7)
- `,` (8)
- `a` (9)
- `++` (10)
- `+` (11)
- `++` (12)
- `b` (13)
- `,` (14)
- `c` (15)
- `->` (16)
- `d` (17)
- `)` (18)
- `;` (19)

Total = 19 tokens.
(The answer field has been set to 19).

## Q13
type: MSQ
marks: 2
subject: compiler-design
topic: lexical-analysis
syllabus: CD01.11
answer: A, B, D
difficulty: medium

Which of the following language features CAN be verified or recognized by a standard lexical analyzer running a Deterministic Finite Automaton (DFA)?

(A) Recognizing numbers formatted in exponential scientific notation (e.g., `+3.14159e-05`)
(B) Distinguishing between single-character and multicharacter operators (such as `<` vs. `<=`, and `&` vs. `&&`)
(C) Ensuring that block comments can be nested inside other block comments to arbitrary depth (e.g., `/* level 1 /* level 2 */ */`)
(D) Recognizing character constants containing escape sequences (such as `'\n'`, `'\t'`, `'\\'`)

### Solution
- **Option (A):** CAN be recognized. The pattern `[+-]?[0-9]+(\.[0-9]+)?([eE][+-]?[0-9]+)?` is a regular expression, which directly converts to a DFA.
- **Option (B):** CAN be recognized. Multicharacter operators are recognized using DFA state transitions and the longest-match rule.
- **Option (C):** CANNOT be recognized. Arbitrary nesting of comments requires counting the number of open comment delimiters `/*` and matching them with equal closing `*/` delimiters. This is non-regular ($a^n b^n$) and requires a stack (PDA).
- **Option (D):** CAN be recognized. Escaped characters follow regular patterns (e.g. `'\\.'` or exact escape symbols), which are recognized by regular expressions.

Hence, (A, B, D) are correct.

## Q14
type: MCQ
marks: 2
subject: compiler-design
topic: lexical-analysis
syllabus: CD01.11
answer: C
difficulty: hard
pyq: 2011-19

Which of the following compiler checks CANNOT be performed during the lexical analysis phase?

(A) Converting ASCII character digit sequences into internal machine numeric binary values
(B) Discarding whitespace, tabs, and newlines that do not appear inside string literals
(C) Verifying that every identifier used in an arithmetic expression has been declared previously
(D) Identifying illegal characters that do not belong to the source language alphabet

### Solution
- **Option (A):** The lexer scans digits and can compute the attribute value (e.g. converting string `"42"` to integer `42`) to pass along with token `NUM`.
- **Option (B):** Stripping whitespace outside quotes is a fundamental responsibility of the lexical analyzer.
- **Option (C):** Checking whether an identifier has been declared previously requires scoping rules and symbol table lookup during **semantic analysis**. The lexer only knows that a word matches the syntactic pattern of an identifier; it does not know scope or declarations.
- **Option (D):** Rejecting illegal characters is handled directly by the lexer's DFA when no transition exists.

Hence, (C) is the check that cannot be performed during lexical analysis.

## Q15
type: MCQ
marks: 1
subject: compiler-design
topic: lexical-analysis
syllabus: CD01.1
answer: B
difficulty: medium

What is the fundamental distinction between a **Phase** and a **Pass** in compiler construction?

(A) A phase is machine-dependent, whereas a pass is source-language dependent.
(B) A phase represents a logical stage of compilation; a pass refers to one complete traversal of the source program or intermediate representation file.
(C) A phase operates only on tokens, whereas a pass operates only on machine instructions.
(D) There is no distinction; phase and pass are completely interchangeable terms.

### Solution
- A **Phase** is a logical step that transforms the source program from one representation to another (e.g., Lexical Analysis, Syntax Analysis, Semantic Analysis, Optimization, Code Generation).
- A **Pass** is an actual physical processing step that reads the input file (from disk or memory) and produces an output file.
- Several logical phases (such as Lexical, Syntax, and Semantic analysis) are frequently combined into a **single pass** in modern compilers to minimize memory and I/O overhead.

Hence, (B) is correct.

## Q16
type: MSQ
marks: 2
subject: compiler-design
topic: lexical-analysis
syllabus: CD01.5
answer: A, B, D
difficulty: hard
pyq: 2017s2-05

Consider the input and output contracts of compiler phases. Which of the following statements is/are **TRUE**?

(A) The syntax analyzer consumes a stream of tokens and outputs a parse tree or abstract syntax tree.
(B) The semantic analyzer takes a syntax tree, verifies static language rules, and outputs an annotated syntax tree.
(C) The intermediate code generator takes the decorated syntax tree and directly outputs target machine binary instructions.
(D) Machine-independent code optimization takes intermediate code as input and produces intermediate code as output.

### Solution
- **Statement (A):** TRUE. The parser takes tokens from the lexer and constructs a parse tree or abstract syntax tree representing grammatical structure.
- **Statement (B):** TRUE. Semantic analysis verifies types and scopes, annotating the tree nodes with type attributes.
- **Statement (C):** FALSE. Intermediate code generator outputs machine-independent **intermediate code** (such as three-address code or quadruples), NOT target machine binary instructions. Target binary code is emitted by the **Code Generator**.
- **Statement (D):** TRUE. Optimization is an IR-to-IR transformation: it consumes intermediate code, optimizes it, and outputs refined intermediate code.

Hence, (A, B, D) are correct.

## Q17
type: NAT
marks: 1
subject: compiler-design
topic: lexical-analysis
syllabus: CD01.14
answer: 9
difficulty: medium

Consider the following valid lexical fragment in C:

```c
int res = a+++++b;
```

How many tokens are produced by the lexical analyzer for this line using the maximal munch (longest match) rule?

### Solution
Let us trace character consumption using the maximal munch rule:
1. `int` (keyword)
2. `res` (identifier)
3. `=` (assignment operator)
4. `a` (identifier)
5. From `+++++b`:
   - Looking ahead from the first `+`: possible tokens are `+` (len 1) and `++` (len 2).
   - Longest match chooses `++` (token 5).
6. Remaining is `+++b`:
   - Looking ahead from the third `+`: possible tokens are `+` (len 1) and `++` (len 2).
   - Longest match chooses `++` (token 6).
7. Remaining is `+b`:
   - Looking ahead from the fifth `+`: only `+` matches (token 7).
8. `b` (identifier, token 8).
9. `;` (semicolon, token 9).

Even though this sequence `a ++ ++ + b` will subsequently cause a syntax/semantic error in the parser (because `(a++)` is not an lvalue and cannot be incremented again), the **lexical analyzer** operates purely greedily on characters and produces exactly **9 tokens**:
`int`, `res`, `=`, `a`, `++`, `++`, `+`, `b`, `;`.

Answer = 9.

## Q18
type: NAT
marks: 2
subject: compiler-design
topic: lexical-analysis
syllabus: CD01.15
answer: 3
difficulty: hard
pyq: 2026s2-25

A lexical analyzer defines the following three token rules over alphabet $\{a, b\}$ listed in order of priority:

1. **$R_1$:** $a^* b$ *(zero or more $a$'s ending in a single $b$)*
2. **$R_2$:** $a b$ *(character $a$ followed by $b$)*
3. **$R_3$:** $b^* a$ *(zero or more $b$'s ending in a single $a$)*

The lexer uses **longest match**, and breaks equal-length ties in favor of the rule listed first ($R_1 > R_2 > R_3$).

How many tokens are produced when tokenizing the string:
$$\text{`a a b b a b a'}$$
*(represented as continuous characters `aabbaba`)*?

### Solution
Input string: `a a b b a b a` (indices 0 to 6, length 7).

**Token 1 (from index 0):**
- $R_1 = a^*b$: matches `aab` (length 3).
- $R_2 = ab$: matches `a`? No, requires `ab` (length 2 for `ab`? At index 0, characters are `aa`, does not match `ab`).
- $R_3 = b^*a$: with $b^* = \epsilon$, matches `a` (length 1).
Longest match is `aab` ($R_1$, length 3).
$\to$ **Token 1 is $R_1$**, consuming `aab` (indices 0, 1, 2).
Remaining: `b a b a` (indices 3, 4, 5, 6).

**Token 2 (from index 3):**
- $R_1 = a^*b$: starts with $b$ ($a^* = \epsilon$), matches single character `b` (length 1).
- $R_2 = ab$: starts with $a$, does not match `b`.
- $R_3 = b^*a$: starts with $b$, matches `ba` (length 2, since $b \cdot a$ matches $b^*a$).
Longest match is `ba` ($R_3$, length 2).
$\to$ **Token 2 is $R_3$**, consuming `ba` (indices 3, 4).
Remaining: `b a` (indices 5, 6).

**Token 3 (from index 5):**
- $R_1 = a^*b$: starts with $b$, matches `b` (length 1).
- $R_2 = ab$: does not match `b`.
- $R_3 = b^*a$: matches `ba` (length 2).
Longest match is `ba` ($R_3$, length 2).
$\to$ **Token 3 is $R_3$**, consuming `ba` (indices 5, 6).

Wait, let us check remaining:
All 7 characters are consumed:
- Token 1: `aab` ($R_1$)
- Token 2: `ba` ($R_3$)
- Token 3: `ba` ($R_3$)
Total tokens = 3!
Wait, let us check if index 3 has any other match:
At index 3: string is `b a b a`.
Can $R_3 = b^*a$ match `baba`?
$R_3$ allows $b^*a$, which has zero or more $b$'s followed by a SINGLE $a$.
`baba` has two $a$'s with a $b$ in between, so it cannot match $R_3$.
Can $R_1$ match `baba`? $R_1$ is $a^*b$, which ends in a single $b$.
So Token 2 is indeed `ba` (length 2).
Then remaining is `ba` (indices 5, 6), which matches `ba` (length 2, Token 3).
Total tokens produced = 3.

## Q19
type: MCQ
marks: 1
subject: compiler-design
topic: lexical-analysis
syllabus: CD01.2
answer: B
difficulty: easy

A compiler that executes on a host machine with an Intel x86-64 CPU and generates target machine code for an ARM Cortex-M embedded microcontroller is formally known as a:

(A) Just-In-Time (JIT) Compiler
(B) Cross Compiler
(C) Decompiler
(D) Incremental Compiler

### Solution
- A **Cross Compiler** is a compiler that runs on one architecture (the host platform, e.g., x86-64) but produces executable code for a different architecture (the target platform, e.g., ARM).
- A native compiler runs on and targets the same architecture.
- A JIT compiler compiles code at runtime during execution.
- A decompiler translates low-level machine code back to high-level source code.

Hence, (B) is the correct answer.

## Q20
type: MSQ
marks: 2
subject: compiler-design
topic: lexical-analysis
syllabus: CD01.1
answer: A, B
difficulty: hard
pyq: 2011-1

Which of the following statements regarding compiler phases and architectural design is/are **CORRECT**?

(A) The lexical analyzer is the only phase in the compiler pipeline that reads and processes the raw character stream of the source program.
(B) During compilation, variable declarations processed by syntax and semantic analysis cause new identifier records to be inserted into the symbol table.
(C) In a modern optimizing compiler, intermediate code generation is strictly optional and can be omitted without affecting machine-independent optimization.
(D) Runtime exceptions (such as stack overflow due to infinite recursion or heap exhaustion during `malloc`) are reported as fatal semantic errors during compilation.

### Solution
- **Statement (A):** CORRECT. Only the lexical analyzer operates directly on the raw character stream. All subsequent phases consume structured abstractions (the parser consumes tokens; the semantic analyzer consumes syntax trees; the optimizer consumes intermediate code; the code generator consumes optimized IR).
- **Statement (B):** CORRECT. When variable declarations (`int x;`) are parsed and validated, the compiler inserts identifier entries into the symbol table with their associated types, scope levels, and storage requirements.
- **Statement (C):** INCORRECT. Machine-independent optimizations (common subexpression elimination, loop invariant code motion, constant propagation) are performed directly on the **Intermediate Representation (IR)**. Bypassing IR generation would force optimizations to be implemented separately for every specific hardware target, defeating machine independence.
- **Statement (D):** INCORRECT. Stack overflow and heap exhaustion are dynamic conditions that occur when the compiled program executes at run time. The compiler cannot predict memory state during static compilation, so these are **runtime exceptions**, not compile-time semantic errors.

Hence, (A, B) are the correct statements.
