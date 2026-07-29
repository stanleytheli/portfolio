---
title: Testing LLM "Mental Math"
date: 2026-07-28
group: AI Research
summary: LLMs can multiply large numbers without thinking, but the trend is mostly flat?
---
## Setup

LLMs can execute long, complex reasoning chains, but how much intelligence actually is there per token, in one forwardpass? I investigate this for the specific case of multiplying large numbers. We ask LLMs `What is x * y?` and instruct them not to think, and with reasoning disabled. All formatting instructions are placed before the numbers so that they can't use the instructions as <a href="https://www.lesswrong.com/posts/NYzYJ2WoB74E6uj9L/recent-llms-can-use-filler-tokens-or-problem-repeats-to">filler tokens to improve performance</a>. `x` and `y` are uniformly distributed conditioned on number of digits; that is to say, if `x` is 5 digits, it is uniform between `10000` and `99999`.

One interesting thing we ran into in this study was that Sonnet 5 and, to a degree, Opus 5 are really bad at following the no thinking instruction. Sonnet leaked ~65% of the time and Opus ~5%. Moving it from the system prompt to the user prompt helped Sonnet, bringing it down to ~35% error rate and Opus still was around ~5%.

## Accuracy

We can plot the accuracy for a single model in 3D as a function of digits in x and digits in y. This is a very interactive graph and you can use your mouse to zoom in/out (scroll), rotate, and hover. Use the model selector to view different models.  

<figure class="graph-figure">
  <iframe class="graph-embed" src="/interactive/nocot-viz3d.html"
          title="No-CoT multiplication accuracy surfaces (3D), 18 models"></iframe>
</figure>

They are pretty good at this. Most of the models can pretty consistently solve 4x4 digits. That's impressive! Such a thing would probably take me a good 30 seconds. 

Within each model family, scaling increases performance. But surprisingly, between families, the relationship is very hard to predict. Large models do not really outperform small open models in a consistent manner when they're from different families.

An interesting thing to notice is the slight asymmetry in x and y. Small * Big is, in almost all cases, a little bit easier than Big * Small. As a hypothesis, this is due to causal attention. The model can only attend backwards and presumably cross-number attention is very important for multiplication; when the second number is larger, there are more tokens over which to do cross-number attention.   

## Harmonic Mean

I find that fitting a sigmoid to the harmonic mean of x and y's digit counts gives very good results. Why? Imagine the model only got the question right if `harmonic mean < c`, so then the relevant boundary would be the harmonic mean's level set at `c`. If you plot it, this level set looks something like one corner of a squircle, the other sides extending infinitely out. If you look at the 3D accuracy graphs from above, they give almost that exact shape (with some, but not much, model dependence).

Hover to see individual data points. The fit is a little bad for the large Qwens but otherwise it seems to track the shape very well. If you look at the Qwen graphs, they look almost like a square cutout. Indeed, if we fit to `min(digits in x, digits in y)` then the fit is significantly better! The graphs below still use sigmoids for consistency.

<figure class="graph-figure">
  <iframe class="graph-embed" src="/interactive/nocot-scaling.html"
          title="No-CoT multiplication frontier across 18 models"></iframe>
</figure>

## Vs. General Benchmarks

Here's the sigmoid-fitted 50% accuracy points plotted against each model's Artificial Analysis intelligence index. The correlation is very weak and a large part of it is probably just because within families, scaling pretty consistently helps (one strange exception for Gemma 4 26B A4B outperforming 31B).  

<figure class="graph-figure">
  <iframe class="graph-embed" src="/interactive/nocot-frontier.html"
          title="No-CoT multiplication frontier across 18 models"></iframe>
  <figcaption>Capability (50% point), the fitted curves, discard rates, and no-CoT
  skill vs Artificial Analysis Intelligence Index.</figcaption>
</figure>

## Conclusion

I don't believe that the frontier models have roughly the same intelligence per token as the other models I tested. It's possible that the posttraining tasks of some of the small open models included arithmetic tasks like these, while large frontier models are optimized for higher level things like coding and conceptual math. It's also possible that larger models have been trained primarily for intelligence over long CoTs, and barely trained on no-CoT tasks because everyone's about benchmaxxing these days. Then, directly and simply asking them might not be the best way to elicit full capabilities. But I'm still extremely surprised that the better and longer pretrains of the larger models didn't really yield gains in no-CoT multiplication, to the point where Qwen-122B-A10B outperforms Opus 5 and GPT 5.6 Sol. 