---
title: The In-Betweeners
---

## Learning Focus

**Interpolate** values between known points for linear and exponential functions.

## Big idea

To find a value *between* two known inputs:

- **Linear**: outputs change by a constant **amount**. The in-between value for a midpoint is the **average** of the two outputs.
- **Exponential**: outputs change by a constant **factor**. The in-between value for a midpoint is the **geometric mean** $\sqrt{y_1\cdot y_2}$.

For exponentials, find the growth factor $b$ per unit input and multiply (or use $f(x)=a\,b^x$).

## Worked example

Known: $f(0)=3$ and $f(2)=12$. Find $f(1)$.

- Linear: $f(1)=\dfrac{3+12}{2}=7.5$
- Exponential: $f(1)=\sqrt{3\cdot12}=6$

Exponential check: $b^2=\dfrac{12}{3}=4\Rightarrow b=2$, so $f(x)=3\cdot2^x$ and $f(1)=6$ ✓.

## Takeaways

- Linear: add equal amounts; exponential: multiply by equal factors.
- Midpoint of an exponential is the geometric mean, not the average.
- Write the model $a\,b^x$ to find any in-between value.
