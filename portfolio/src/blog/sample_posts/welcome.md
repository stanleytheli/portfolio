---
title: Welcome to the Blog
date: 2026-07-21
group: Random
summary: How this little corner works, and how to add new writings.
---

This is where I'll post things that don't fit anywhere else — half-finished
thoughts, notes to myself, and the occasional rant.

## Adding a new post

Every writing is just a Markdown file in `src/blog/posts/`. Drop a file in
with a frontmatter block on top:

```
---
title: My New Piece
date: 2026-07-21
group: Fiction
summary: A one-line teaser.
---

Body goes here...
```

That's it — the post shows up automatically under its group, no registration
needed. Groups are ordered **Fiction → ML Research → Random**, and any new
group name you invent gets appended after those.

> Keep it simple. This page is deliberately not a gravity simulation.
