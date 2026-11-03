---
title: Don’t Break the Chain
---

## Learning Focus

Write sequences both **recursively** (using the previous term) and **explicitly** (using the term number), and use function notation $f(n)$.

## Big idea

A sequence is a function whose input $n$ is the term number and whose output $f(n)$ is the term.

- **Recursive rule**: a starting value plus a rule linking $f(n)$ to $f(n-1)$.
  - Arithmetic: $f(n)=f(n-1)+d$
  - Geometric: $f(n)=r\cdot f(n-1)$
- **Explicit rule**: computes any term directly.
  - Arithmetic: $f(n)=f(1)+d(n-1)$
  - Geometric: $f(n)=f(1)\cdot r^{\,n-1}$

Recursive rules "keep the chain going" but you must know every earlier term. Explicit rules let you jump straight to term $n$.

## Worked example

Sequence: $3,7,11,15,\dots$

- Recursive: $f(1)=3$, $f(n)=f(n-1)+4$
- Explicit: $f(n)=3+4(n-1)=4n-1$
- Check: $f(4)=4(4)-1=15$ ✓
- Jump ahead: $f(20)=4(20)-1=79$

Now try $2,6,18,54,\dots$: each term is $3$ times the last, so $f(1)=2$, $f(n)=3f(n-1)$, and explicitly $f(n)=2\cdot3^{\,n-1}$.

## Takeaways

- A recursive rule needs a starting value **and** a rule that uses the previous term.
- Explicit rules are best for finding far-away terms.
- $f(n)$ is read "the $n$th term," not "$f$ times $n$."
