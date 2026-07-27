# Python Fundamentals — Learn with AI

Structured, documentation-first, 47-session Python curriculum — true beginner
through intermediate — built with the same "learn with AI" interactive pattern as
[react-learn-with-ai](https://github.com/pinkmachine19/react-learn-with-ai).

The whole curriculum builds one running project, the **Country Explorer**: starting
from print() and variables in Session 01, through dictionaries, classes, state, mock
data, automated testing, package architecture, and a real network API call, up to a
capstone review at Session 44 — plus three optional bonus sessions (decorators,
generators/context managers, packaging & virtual environments) in Layer 8.

## Site

The published site lives entirely under [`docs/`](docs/index.html) as static HTML —
GitHub Pages serves it directly from `main` / `docs`. There is no client-side
framework or build step required to *view* the site.

## Regenerating the site

The `docs/` HTML is generated from structured session data in [`data/`](data) via a
small Node.js template renderer in [`scripts/`](scripts) — this keeps 47 sessions of
content consistent (same layout, same quiz/lab structure, real inline SVG diagrams)
without hand-maintaining dozens of near-identical HTML files.

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
- `scripts/` — the static site generator, including the real inline-SVG diagram renderer
- `ARCHITECTURE.md` — architecture decisions made *within the curriculum's own
  running project* (the Country Explorer), authored progressively across Sessions 36, 40, and 44
