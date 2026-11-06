# C Programming Master Plan (GATE CSE)

**Target:** 100% accuracy on all GATE C Programming questions with $\le 1$ minute solve time per question.  
**Mode:** Chat-only interactive micro-lessons (no video lectures). Zero omissions.  

**What to teach, in which order, and when to test comes from `brain/syllabus/` (`npm run syllabus`).** This file only keeps the teaching style and the three tracing templates. The old day table and checklist are all inside units P01–P09.

---

## 1. Operating Rules for Agents in Any Chat

1. **Step-by-Step Micro-Chunks (Never all at once):**
   - Teach in tiny, bite-sized pieces (3–5 lines).
   - End each step by checking in: *"Are you clear with this piece, or do you have any doubts before we move to the next part?"*
   - Only advance when she confirms she's clear.
   - Do NOT bundle concept, traps, shortcuts, and questions all into a single giant message. Take it step-by-step.
2. **Never Skip or Assume:** Cover every subtopic systematically. Do not gloss over basics.
3. **MANDATORY REAL-TIME TEMPLATE PROMPT (Crucial):**
   - The student has requested: **Do not rely on them remembering templates in advance.**
   - Whenever a topic involves **Loops**, the agent **must explicitly draw and remind** them of the *Variable State Table*.
   - Whenever a topic involves **Recursion or Static Variables**, the agent **must explicitly draw and remind** them of the *Activation Stack + Static Store*.
   - Whenever a topic involves **Pointers or Arrays**, the agent **must explicitly draw and remind** them of the *Address-Arrow Scaling Model*.

---

## 2. The 3 Paper-Pencil Tracing Templates

### Template A: The Address-Arrow Model (Pointers & Arrays)
- **Principle:** Never imagine pointers in memory. Write the base address, draw arrows, and apply type scaling.
- **Rules:**
  - Pointer addition: `p + i` points to address $\text{addr}(p) + i \times \text{sizeof}(*p)$.
  - Array equivalence: `a[i] == *(a + i)`.
  - 2D Array: `a[i][j] == *(*(a + i) + j)`. Base type of `a` is array, base type of `*a` is element.
- **Format:**
  ```text
  [Array a]  Base: 1000  | [0]: 1000 | [1]: 1004 | [2]: 1008 |
  [Pointer p] Value: 1000 ----> points to a[0]
  p++         Value: 1004 ----> points to a[1]
  ```

### Template B: Activation Stack + Static Store (Recursion & Storage Classes)
- **Principle:** Recursion mistakes come from mixing local stack frames with static memory.
- **Format:** A 2-column scratchpad:
  ```text
  [Global / Static Store] (Persists across ALL calls)
  x = 0 -> 1 -> 2 ...

  [Call Stack] (LIFO execution)
  | Frame 3: f(1) -> returns ... |
  | Frame 2: f(2) -> waiting ... |
  | Frame 1: f(3) -> waiting ... |
  ```
- Track **winding phase** (before recursive call) vs **unwinding phase** (after recursive call/returns).

### Template C: The Variable State Table (Loops & Control Flow)
- **Principle:** Never simulate 50 iterations blindly. Trace 2–3 rows to capture the state invariant.
- **Format:**
  ```text
  | Iteration | Variable Values (i, j, sum) | Loop Condition | Action / Output |
  |-----------|-----------------------------|----------------|-----------------|
  | init      | i=0, sum=0                  | 0 < n (True)    | sum += 0        |
  | 1         | i=1, sum=1                  | 1 < n (True)    | sum += 1        |
  | 2         | i=2, sum=3                  | 2 < n (True)    | sum += 2        |
  Invariant: At step k, sum = k*(k+1)/2. Termination when i == n.
  ```
