# Cube nets and folding

## TL;DR
In any flat cube net with a 4-in-a-row strip, **alternate squares are opposite faces**. The two side flaps on opposite sides of the strip fold to form the third opposite pair.

## Core idea
- **The Alternating Rule:** In a straight sequence of 4 attached squares:
  - Face 1 and Face 3 are opposite.
  - Face 2 and Face 4 are opposite.
  ```
  +---+---+---+---+
  | A | B | C | D |  ==> A opposite C, B opposite D
  +---+---+---+---+
  ```
- **The Flap Rule:** In a standard 1-4-1 net (one top tab, four middle squares, one bottom tab):
  - Top tab and bottom tab fold $90^\circ$ to cover the top and bottom of the cube $\implies$ they form the third opposite pair.
- **Adjacent rule:** Any two squares that share a vertex or an edge in the net can NEVER be opposite faces.

## Where I got confused → what made it click
- **Visualizing 3D folding in head:** Trying to rotate all 6 faces mentally in 3D $\to$ Just spot straight strips of 3 or 4 squares; whenever two faces are separated by exactly one square along a straight row or column, they fold into opposite sides.

## GATE traps
- **Corner touches:** Two faces sharing a corner in the flat net meet at a corner in the 3D cube—they can never face each other.
- **Illegal nets:** Any net containing a $2 \times 2$ block of 4 squares can never fold into a cube without overlaps.

## Example
**Problem (GATE CSE):**
```
      +---+
      | 1 |
  +---+---+---+---+
  | 2 | 3 | 4 | 5 |
  +---+---+---+---+
          | 6 |
          +---+
```
Which pairs are opposite?
1. In the middle strip `[2][3][4][5]`:
   - Face 2 is opposite Face 4 (separated by 3).
   - Face 3 is opposite Face 5 (separated by 4).
2. The remaining flaps 1 (top) and 6 (bottom) are opposite each other.
