# Python Fundamentals — Learn with AI

Structured, documentation-first, 40-session Python curriculum — beginner through
intermediate — built with the same "learn with AI" interactive pattern as
[react-learn-with-ai](https://github.com/pinkmachine19/react-learn-with-ai).

The whole curriculum builds one running project, the **Country Explorer**: starting
from a single Python dictionary in Session 01, through classes, state, mock data,
automated testing, package architecture, and finally a real network API call in
Session 38, culminating in a capstone review in Session 40.

## Site

The published site lives entirely under [`docs/`](docs/index.html) as static HTML —
GitHub Pages serves it directly from `main` / `docs`. There is no client-side
framework or build step required to *view* the site.

## Regenerating the site

The `docs/` HTML is generated from structured session data in [`data/`](data) via a
small Node.js template renderer in [`scripts/`](scripts) — this keeps 40 sessions of
content consistent (same layout, same quiz/lab structure) without hand-maintaining
40 near-identical HTML files.

```bash
npm run build
```

This regenerates every file under `docs/sessions/`, `docs/syllabus/`,
`docs/sessions/index.html`, and every other hub page from `data/layers.js` and
`data/sessions-*.js`. The generator has no external dependencies beyond Node.js
itself.

## Structure

- `docs/` — the published site (GitHub Pages root)
- `data/` — session content (objectives, quizzes, concept sections, labs) and layer metadata
- `scripts/` — the static site generator
- `ARCHITECTURE.md` — architecture decisions made *within the curriculum's own
  running project* (the Country Explorer), authored progressively in Sessions 32, 36, and 40
