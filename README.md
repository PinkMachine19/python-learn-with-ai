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
## Project Status

This project is intentionally public while it is still evolving.

The repositories in this academy are my personal learning and reference material. They combine my professional software engineering experience, topics I am actively learning, and ideas developed through extensive discussions with AI.

AI has been used to help organize the curriculum, generate initial drafts, create code examples, suggest exercises, review documentation, and accelerate development.

That does not mean I assume the generated content is correct.

The purpose of publishing these repositories early is to make the material easily accessible from anywhere and to document my own learning journey. As I work through each course, I personally review, validate, correct, refactor, expand, and sometimes completely rewrite sections based on what I learn.

Because of that, some sessions may be fully validated while others remain drafts or works in progress. Each repository includes status indicators so readers can distinguish between planned, drafted, implemented, and validated content.

If you discover an error, inconsistency, or a better approach, please assume it is part of an evolving project rather than a finished product. Constructive feedback is always appreciated.

The goal is not to present myself as the ultimate authority on these subjects. The goal is to build a high-quality collection of practical engineering references that improve over time through testing, experience, and continual refinement.
