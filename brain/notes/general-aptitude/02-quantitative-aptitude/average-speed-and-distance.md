# Average speed and distance

## TL;DR
When distances are equal (e.g. round trip), average speed is the **harmonic mean**, not the arithmetic mean. When travel times are equal, average speed is the arithmetic mean.

## Core idea
- **Average speed definition:** Total distance divided by total time: $v_{\text{avg}} = \frac{D_{\text{total}}}{T_{\text{total}}}$.
- **Equal distances (round trip):** If a distance $D$ is covered at speed $v_1$ and the return distance $D$ is covered at speed $v_2$:
  $$v_{\text{avg}} = \frac{2 D}{\frac{D}{v_1} + \frac{D}{v_2}} = \frac{2 v_1 v_2}{v_1 + v_2}$$
- **Equal travel times:** If moving at $v_1$ for time $t$ and at $v_2$ for time $t$, $v_{\text{avg}} = \frac{v_1 + v_2}{2}$.
- **Train crossing objects:**
  - Stationary point / pole / person: Distance covered $= L_{\text{train}}$.
  - Platform / bridge / tunnel of length $L_p$: Distance covered $= L_{\text{train}} + L_p$.
  - Unit conversion: $\text{km/h} \times \frac{5}{18} = \text{m/s}$.

## Where I got confused → what made it click
- **Arithmetic mean instinct:** Taking $\frac{60 + 40}{2} = 50\text{ km/h}$ feels intuitive $\to$ The vehicle spends *more time* travelling at the slower speed, so the slower speed pulls the overall average down toward itself.

## GATE traps
- **The round-trip trap:** Averaging the two speeds directly. GATE puts this wrong value as Option (A).
- **Ignoring train length:** Forgetting to add train length to platform length when calculating crossing time.

## Example
**Problem (GATE CSE):** A car travels from A to B at $60\text{ km/h}$ and returns from B to A at $v\text{ km/h}$. The average speed is $48\text{ km/h}$. Find $v$.

$$48 = \frac{2 \times 60 \times v}{60 + v} \implies 48(60 + v) = 120 v \implies 2880 = 72 v \implies v = 40\text{ km/h}$$
*(Arithmetic mean would incorrectly give $\frac{60 + v}{2} = 48 \implies v = 36$.)*
