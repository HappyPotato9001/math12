---
title: Half Interested or More Interesting
---

## Learning Focus

Model **half-life** style decay with exponential functions and compare it to interest-style growth.

## Big idea

If a quantity starts at $A$ and halves every $h$ units of time:

$$f(t)=A\left(\tfrac12\right)^{t/h}$$

- **Half-life** $h$: time for the quantity to drop to half.
- Every $h$ units multiplies by $\tfrac12$, so after $k$ half-lives you have $A\left(\tfrac12\right)^k$.
- Growth with interest uses $A(1+r)^t$ with $r>0$; decay uses a factor between $0$ and $1$.

## Worked example

A medicine has $80$ mg with half-life $3$ hours.

- After 3 hr: $40$ mg
- After 6 hr: $20$ mg
- After 9 hr: $10$ mg

Model: $f(t)=80\left(\tfrac12\right)^{t/3}$. At $t=6$: $80\cdot\tfrac14=20$ ✓.

## Takeaways

- Count how many half-lives have passed, then multiply by $\tfrac12$ that many times.
- Decay factor is between 0 and 1; growth factor is greater than 1.
- The exponent $t/h$ converts time into number of half-lives.
