# Closure properties of REC and RE

## TL;DR
Recursive (REC / Decidable) is closed under ALL boolean operations (union, intersection, complement, difference). Recursively Enumerable (RE / Semi-decidable) is closed under union and intersection, but NOT complement or set difference.

## Core idea
- **Hierarchy:** Regular $\subset$ DCFL $\subset$ CFL $\subset$ REC $\subset$ RE. Every REC language is RE, but not vice-versa.
- **Post's Theorem:** A language $L$ is Recursive $\iff$ both $L \in \text{RE}$ and $\overline{L} \in \text{RE}$.
  - If $L \in \text{RE} \setminus \text{REC}$, then $\overline{L} \notin \text{RE}$.
- **Closure table:**
  | Operation | REC (Decidable) | RE (Turing Recognizable) |
  |---|---|---|
  | Union ($L_1 \cup L_2$) | Yes | Yes (run TMs in parallel) |
  | Intersection ($L_1 \cap L_2$) | Yes | Yes (run TMs in parallel) |
  | Complement ($\overline{L}$) | Yes (invert Halting state) | **No** (by Post's theorem) |
  | Set Difference ($L_1 \setminus L_2$) | Yes | **No** ($L_1 \setminus L_2 = L_1 \cap \overline{L_2}$) |
  | Concatenation ($L_1 \cdot L_2$) | Yes | Yes |
  | Kleene star ($L^*$) | Yes | Yes |

## Where I got confused → what made it click
- **Mixing REC and RE in operations ($L_{\text{REC}} \text{ op } L_{\text{RE}}$):**
  - *Confusion:* Thinking that intersecting or differencing with a decidable language "simplifies" an RE language to REC.
  - *The click:* Test with extreme decidable languages: $\emptyset$ and $\Sigma^*$.
    - $\Sigma^* \cap L_{\text{RE}} = L_{\text{RE}}$ (still non-recursive RE!).
    - $L_{\text{RE}} \setminus \emptyset = L_{\text{RE}}$ (still non-recursive RE!).
    - $\emptyset \cup L_{\text{RE}} = L_{\text{RE}}$ (still non-recursive RE!).
    - $\Sigma^* \cup L_{\text{RE}} = \Sigma^*$ (becomes recursive!).
    - Conclusion: $L_{\text{REC}} \cup L_{\text{RE}}$ is always RE, but whether it is REC depends on the specific languages.

## GATE traps
- **$\text{RE} \cap \text{REC}$ trap:** It is always RE, but NOT necessarily REC. Example: $L_1 = \Sigma^*$ (REC), $L_2 = L_{\text{HALT}}$ (RE but not REC) $\implies L_1 \cap L_2 = L_{\text{HALT}}$ (not REC).
- **$L_2 \setminus L_1$ where $L_1$ is REC:** $L_2 \setminus L_1 = L_2 \cap \overline{L_1}$. Since $\overline{L_1}$ is REC, this reduces to $\text{RE} \cap \text{REC} \implies$ always RE, but NOT necessarily REC.
- **$\overline{L}$ for non-recursive RE:** If $L \in \text{RE} \setminus \text{REC}$, its complement is strictly NOT recursively enumerable (not even semi-decidable).

## Example
**Mock 02 Q15:** Let $L_1$ be REC, and $L_2$ be RE but not REC. Which is always true?
- **Option A:** $\overline{L_2} \in \text{RE}$ $\to$ **False** (by Post's Theorem, $\overline{L_2} \notin \text{RE}$).
- **Option B:** $L_2 \setminus L_1 \in \text{REC}$ $\to$ **False** (let $L_1 = \emptyset \implies L_2 \setminus \emptyset = L_2 \notin \text{REC}$).
- **Option C:** $L_1 \cap L_2 \in \text{REC}$ $\to$ **False** (let $L_1 = \Sigma^* \implies \Sigma^* \cap L_2 = L_2 \notin \text{REC}$).
- **Option D:** $L_1 \cup L_2$ is RE, but not necessarily recursive $\to$ **Always True** (union of two RE languages is always RE; equals $L_2$ when $L_1 = \emptyset$, equals $\Sigma^*$ when $L_1 = \Sigma^*$).
