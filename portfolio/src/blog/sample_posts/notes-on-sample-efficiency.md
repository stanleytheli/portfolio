---
title: Notes on Sample Efficiency
date: 2026-07-02
group: AI Research
summary: A few things I keep relearning about squeezing more out of less data.
---

While working on CubeGPT-3 I kept running into the same lesson from different
angles: **sample efficiency is mostly about removing symmetry the model would
otherwise waste capacity learning.**

## What actually helped

1. **Canonicalization.** If two inputs are equivalent under some symmetry,
   map them to a single canonical form *before* the model sees them. The model
   no longer has to learn the invariance — you've handed it for free.
2. **Tokenization that matches structure.** A tokenizer that respects the
   natural boundaries of the problem gives the model shorter, cleaner
   sequences to reason over.
3. **Mixture-of-experts, carefully.** More parameters helped, but only once
   routing was stable. An unstable router just burns compute.

The headline result: roughly a **7x** improvement in sample efficiency over
the previous generation, and an average solve length of 19.0 moves (optimal
solvers sit around 17.7).

## What I'm still unsure about

How much of this transfers away from a domain as clean as the Rubik's Cube,
where the symmetry group is known exactly? On messier data the canonical form
is rarely obvious — and sometimes the "symmetry" isn't real, just a pattern in
the sampling. More on that another time.
