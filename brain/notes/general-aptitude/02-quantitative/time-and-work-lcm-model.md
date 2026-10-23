# Time & Work (LCM Chairs Model)

## TL;DR
Never use fractional rates like $\frac{1}{A} + \frac{1}{B}$ or $x/y$ algebra. Assume Total Work = $\text{LCM}(\text{days})$ chairs. Calculate daily chair rates as integers. Add for combined work, subtract for drain pipes/leaks.

## Core idea
- **Total Work as LCM:** Set total work equal to the LCM of individual days/times. This turns every rate into a simple whole number.
- **Daily Rate (Efficiency):** $\text{Rate} = \frac{\text{Total Chairs}}{\text{Time Taken}}$.
- **Combined Working:** Add the daily rates. $\text{Time Together} = \frac{\text{Total Chairs}}{\text{Combined Rate}}$.
- **Leaving / Joining:** Always calculate:
  $$\text{Done} = \text{Combined Rate} \times \text{Days Worked Together}$$
  $$\text{Remaining} = \text{Total} - \text{Done} \implies \text{Remaining Days} = \frac{\text{Remaining Chairs}}{\text{Worker's Rate}}$$
- **Pipes and Leaks:** Inflow pipes add chairs ($+$), drain pipes / leaks remove chairs ($-$). Net rate = Inflows $-$ Outflows.
- **Efficiency Multipliers:** Efficiency *is* the daily rate. If A is $3\times$ as fast as B, set $B = 1\text{ chair/day}$ and $A = 3\text{ chairs/day}$.

## Where I got confused → what made it click
- **Efficiency ratios and total work:**
  - *Confusion:* When told "A is $3\times$ faster than B and together they take 15 days", instinctively dividing days by combined efficiency ($\frac{15}{4}$).
  - *The click:* Combined rate is chairs made in *one single day* ($3 + 1 = 4\text{ chairs/day}$). Total work is a multiplication over time: $15\text{ days} \times 4\text{ chairs/day} = 60\text{ chairs}$. Then A alone takes $\frac{60}{3} = 20\text{ days}$.
- **"More days" vs "Total days":**
  - *Confusion:* Giving the total days from start to finish when the question asked "how many *more* days will Q take to finish the rest".
  - *The click:* Read the prompt carefully: *remaining* work divided by Q's rate is the "more days".

## GATE traps
- **Negative rates in pipes:** A drain pipe empties the tank, so its rate must be subtracted: $(R_A + R_B - R_{\text{drain}})$.
- **Alternating work cycles:** When A and B work on alternate days (Day 1: A, Day 2: B), group them into **2-day blocks**. Never assume they work together continuously.

## Example
- **GATE 2018 (General Aptitude):** "It takes 2 hours for person X to wash the car. Person Y can wash the car in 3 hours. Both of them work together, they will take..."
  - Total work = $\text{LCM}(2, 3) = 6\text{ units}$.
  - Rate of $X = \frac{6}{2} = 3\text{ units/hr}$, Rate of $Y = \frac{6}{3} = 2\text{ units/hr}$.
  - Together = $3 + 2 = 5\text{ units/hr}$.
  - Time = $\frac{6}{5}\text{ hours} = 1.2\text{ hours} = 1\text{ hr } 12\text{ min}$.
