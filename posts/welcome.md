---
title: Why this blog exists
date: 2026-08-13
tags: [meta, vue]
excerpt: A place for build logs, security writeups and kernel notes — and how it works under the hood.
---

Welcome to my corner of the internet.

## What you'll find here

- **Build logs** — what I make, what broke, what I learned
- **Security writeups** — vulnerability analysis and fixes
- **Kernel notes** — my ongoing journey into Windows internals

## How this blog works

This site is a single-page app built with **Vue 3, TypeScript and Vite**.
Every post is a plain Markdown file in the `posts/` directory — no database,
no CMS, no server. A push to `main` rebuilds and redeploys via GitHub Actions.

Each post starts with a small frontmatter block:

```markdown
---
title: Why this blog exists
date: 2026-08-13        # <- the display date is fully custom
tags: [meta, vue]
---
```

The `date` field is whatever I want it to be — I can backdate older notes or
schedule the ordering exactly how I like. Posts are sorted by this date,
not by filename or commit time.

See you in the next one.
