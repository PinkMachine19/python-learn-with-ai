# Changelog

A running log of content and site fixes made to this course after initial publication, kept alongside the docs so changes are easy to find without digging through git history.

## 2026-07-30

### Sessions 1–4: readability fixes

- **Fixed literal `\n` in quiz code snippets** (Sessions 3 and 4). Some pre/post-quiz questions embedded multi-line Python inside a single-line `<code>` tag using a literal backslash-n instead of an actual line break, so the indentation Python relies on to teach block structure rendered as visible `\n` text instead of a real newline. Replaced with proper `<pre><code>` blocks.
- **Scaled large population numbers down to 2–3 digits** (Sessions 1–4). Numbers like `54000000` were hard to read at a glance and made quiz questions feel harder than the underlying concept. Every population figure across these four sessions is now expressed in millions (e.g. `54000000` → `54`), with a short note added the first time it appears in each session. All downstream comparisons, thresholds, and expected outputs were re-checked so nothing changed meaning — the same True/False and "Large"/"Small" results still occur, just with shorter numbers.
- **Added keyword vs. operator terminology** (Sessions 3 and 4). Session 3 now explains that `if`/`elif`/`else` are keywords while `and`/`or`/`not` are keywords *and* operators (logical/boolean operators). Session 4 clarifies that `for`/`while`/`in`/`break`/`continue` are keywords with no operator role.

### Site-wide: quiz explanation modal

- **The popup that appears after answering a multiple-choice question now always shows the explanation text inline**, instead of only showing it for Session 11 and later (earlier sessions previously just nagged the reader to scroll down and read it in the page). This applies to every session automatically, since `quiz.js` and `quiz-explain-modal.css` are shared across the whole site — no per-session changes required.
- **The popup now shows whether the answer was correct or wrong**, with a green ✅ / "Correct!" or red ❌ / "Not quite" header, and the modal's border and explanation accent color match (green for correct, red for wrong).

Files touched: `docs/sessions/session-01/index.html`, `docs/sessions/session-02/index.html`, `docs/sessions/session-03/index.html`, `docs/sessions/session-04/index.html`, `docs/quiz.js`, `docs/quiz-explain-modal.css`.
