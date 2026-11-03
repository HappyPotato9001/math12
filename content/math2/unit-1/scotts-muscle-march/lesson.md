---
title: Scott’s Muscle March
---

## Learning Focus

Build a quadratic model from a cumulative total of an arithmetic pattern.

## Big idea

Scott does 1 push-up on day 1, 2 on day 2, 3 on day 3, and so on. The daily amount grows by a constant 1, but the **running total** is a sum of those amounts:

$$T(n)=1+2+3+\cdots+n=\frac{n(n+1)}{2}=\frac{1}{2}n^2+\frac{1}{2}n.$$

Totals: $1,3,6,10,15,\dots$ First differences: $2,3,4,5,\dots$ Second differences: constant $1$. A constant second difference signals a quadratic, and the leading coefficient is half of it: $a=\frac{1}{2}$.

## Worked example

Total push-ups after 8 days:

$$T(8)=\frac{8\cdot 9}{2}=36.$$

## Takeaways

- Adding an arithmetic sequence term by term gives a quadratic total.
- Constant second difference $=2a$.
- A closed form like $\frac{n(n+1)}{2}$ replaces repeated addition.
