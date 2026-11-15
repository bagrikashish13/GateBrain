# Compiler Phases & Lexical Analysis

## TL;DR
The compiler pipeline runs: Characters $\to$ [Lexical: DFA] $\to$ Tokens $\to$ [Syntax: DPDA] $\to$ Parse Tree $\to$ [Semantic] $\to$ Annotated Tree $\to$ [IR Gen] $\to$ Intermediate Code $\to$ [Optimization] $\to$ [Code Gen] $\to$ Target Code. Symbol table and error handler serve **every** phase. Universal IR reduces $m \times n$ compilers to $m + n$ modules. Lexer uses only Finite State Automata (no stack; cannot check nesting) and resolves tokens via **longest match**.

## Core idea

- **Linear Phase Pipeline:**
  1. **Lexical Analysis (Scanner):** Chars $\to$ Tokens. Strips whitespace and comments. Runs a DFA.
  2. **Syntax Analysis (Parser):** Tokens $\to$ Parse/Syntax Tree. Enforces Context-Free Grammar (needs a stack / DPDA).
  3. **Semantic Analysis (Type Checker):** Syntax Tree $\to$ Annotated Tree. Checks types, declarations, scopes.
  4. **Intermediate Code Generation:** Annotated Tree $\to$ Machine-independent IR (e.g., Three-Address Code).
  5. **Code Optimization:** Transforms IR into faster/smaller IR.
  6. **Target Code Generation:** IR $\to$ Relocatable Machine Code / Assembly. Uses symbol table for sizes and register allocation.

- **Cross-Cutting Components:**
  - **Symbol Table:** Stores identifier attributes (name, type, scope depth, memory offset). Created in early phases, queried and updated across **all** phases.
  - **Error Handler:** Reports phase-specific errors across the entire pipeline.

- **Front-End vs. Back-End:**
  - **Front-End:** Depends on source language, independent of target machine (Lexical, Syntax, Semantic, IR Gen).
  - **Back-End:** Depends on target machine, independent of source language (Code Gen, machine-specific optimization).
  - **IR Advantage:** $m$ source languages on $n$ target architectures need only $m$ front-ends + $n$ back-ends ($m + n$ modules) instead of $m \times n$ separate compilers.

- **Token vs. Lexeme vs. Pattern:**
  - **Lexeme:** The concrete character sequence in source code (e.g., `"total"`, `"100"`, `"while"`).
  - **Pattern:** The formal regex rule specifying valid lexemes (e.g., `[a-zA-Z_][a-zA-Z0-9_]*`).
  - **Token:** The abstract tag/symbol returned to the parser (e.g., `IDENTIFIER`, `CONSTANT`, `KEYWORD_WHILE`).

- **Power of Lexical Analysis:**
  - Requires **only Finite State Automata (DFA)**.
  - Has no stack or counter; **cannot** verify arbitrary nested structures like `( ( ... ) )` or matching `{ }`.
  - **Keywords:** Recognized during lexical analysis by scanning as an identifier and querying a reserved keyword lookup table.

- **Longest Match (Maximal Munch):**
  - Always consumes the longest prefix matching any token pattern.
  - If two patterns match prefixes of equal length, the rule listed first in the specification wins.

## Where I got confused → what made it click

- **Universal IR module count ($m \times n$ vs. $m + n$):**
  - *Confusion:* Doubting whether an IR really drops module count to $m + n$.
  - *The click:* Without an IR, each language needs its own generator for each machine ($m \times n$). With IR as a universal pivot, adding a 4th machine to 3 languages requires writing **only 1 new back-end** ($\text{IR} \to \text{Machine}$), not 3 separate compilers! Total modules = $m + n$.

- **Token vs. Pattern swap:**
  - *Confusion:* Mixing up Pattern and Token.
  - *The click:* 
    - Pattern = **The Rule** (the regex).
    - Lexeme = **The Characters** (in the code).
    - Token = **The Category Tag** (passed to parser).

- **Automata Power: Why DFA cannot check nesting:**
  - *Confusion:* Forgetting why lexer can't check nested parentheses.
  - *The click:* A DFA has a fixed, finite number of states and **no stack**. To match arbitrarily deep `((((...))))`, the compiler must count to an unbounded $n$ ($L = \{a^n b^n\}$). Counting arbitrary depth requires a **stack** (Pushdown Automaton), which belongs strictly to the **Syntax Analyzer (Parser)**.

- **Longest Match Scan Trap:**
  - *Confusion:* Stopping at the first valid token match (e.g., seeing `bba` matches $T_1$ with length 3).
  - *The click:* Always look ahead to the farthest character that still matches a pattern. If `bbaac` matches $T_3$ (length 5), length 5 **beats** length 3. You must take the longest match!

## GATE traps

- **Symbol table lifetime:**
  - *Trap:* Thinking the symbol table is only for front-end and can be discarded after parsing.
  - *Fact:* The back-end **cannot** generate machine code without the symbol table—it needs variable sizes, struct offsets, and types to allocate stack frames and target registers.
- **Error classification per phase:**
  - Illegal character / malformed identifier / unterminated string (`"Hello;`) $\to$ **Lexical Error**.
  - Missing parenthesis / unbalanced braces / misplaced operator $\to$ **Syntax Error**.
  - Type mismatch (`int *p = 3.5;`) / undeclared variable / redeclaration in same scope $\to$ **Semantic Error**.
- **String literals in token counting:**
  - A string literal `"Sum = %d\n"` is **exactly ONE token**, regardless of spaces, words, or punctuation inside the quotes.
- **Comments & whitespace:**
  - Dropped entirely by the lexer; they generate **zero tokens**.
- **Operators in token counting:**
  - `a+++b` produces `a` (1), `++` (2), `+` (3), `b` (4) = 4 tokens under longest match, NOT 5!

## Example

**GATE 2018 (2 Marks):**
Tokens over $\{a, b, c\}$:
- $T_1: a?(b \mid c)^*a$ *(ends in $a$)*
- $T_2: b?(a \mid c)^*b$ *(ends in $b$)*
- $T_3: c?(b \mid a)^*c$ *(ends in $c$)*

Input: `bbaacabc`
- Index 0: `bba` matches $T_1$ (length 3), but `bbaac` matches $T_3$ ($c? = \epsilon$, $(b \mid a)^* = \text{"bbaa"}$, ends in `c`, length 5).
- **Winner:** $T_3$ consumes `bbaac`.
- Remaining `abc`: `ab` matches $T_2$ (length 2), but `abc` matches $T_3$ (length 3).
- **Winner:** $T_3$ consumes `abc`.
- Output sequence: **$T_3 T_3$**.
