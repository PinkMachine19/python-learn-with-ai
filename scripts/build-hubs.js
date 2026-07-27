const fs = require('fs');
const path = require('path');
const { pad2, page } = require('./lib');
const { sessions, layers } = require('./build-sessions');

const docsRoot = path.join(__dirname, '..', 'docs');
const write = (relPath, html) => {
  const full = path.join(docsRoot, relPath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html);
};

function sessionsInLayer(layerNum) {
  const layer = layers.find((l) => l.num === layerNum);
  return sessions.filter((s) => s.num >= layer.range[0] && s.num <= layer.range[1]);
}

function isGate(s) {
  const layer = layers.find((l) => s.num >= l.range[0] && s.num <= l.range[1]);
  return layer.range[1] === s.num;
}

// ── HOME PAGE ──────────────────────────────────────────────────────
function buildHome() {
  const rows = layers
    .map(
      (l, i) => `          <tr>
            <td><span class="badge badge-layer">${l.num}</span></td>
            <td>${l.name}</td>
            <td>${pad2(l.range[0])} – ${pad2(l.range[1])}</td>
            <td><span class="badge ${i === 0 ? 'badge-current' : 'badge-locked'}">${i === 0 ? 'Active' : 'Locked'}</span></td>
            <td>${l.unlock}</td>
          </tr>`
    )
    .join('\n');

  const body = `    <h1>Python Fundamentals — Learning Environment</h1>
    <p class="subtitle">
      A structured, documentation-first curriculum for engineers who want to understand
      Python deeply — not just ship code. We build one real project, the Country Explorer,
      from a single dictionary through to a tested application calling a real API.
    </p>

    <div class="card">
      <div class="card-title">Overall Progress</div>
      <div class="progress-wrap">
        <div class="progress-label">
          <span>Sessions completed</span>
          <span id="progress-text">0 / ${sessions.length}</span>
        </div>
        <div class="progress-bar-bg">
          <div class="progress-bar" style="width: 0%"></div>
        </div>
      </div>
      <div style="display:flex; gap:12px; flex-wrap:wrap; margin-top:10px;">
        <span class="badge badge-complete">Complete: 0</span>
        <span class="badge badge-current">Active: Session 1</span>
        <span class="badge badge-locked">Locked: ${sessions.length - 1}</span>
      </div>
    </div>

    <div class="alert alert-info" style="margin-bottom: 32px;">
      <strong>Active session:</strong>
      <a href="sessions/session-01/index.html">Session 01 — ${sessions[0].title}</a>
      &nbsp;·&nbsp; Layer 0: ${layers[0].name}
    </div>

    <h2>Documentation Sections</h2>

    <div class="nav-grid">
      <a class="nav-card" href="syllabus/index.html">
        <div class="nav-card-title">Syllabus</div>
        <div class="nav-card-desc">All ${sessions.length} sessions, layer breakdown, unlock gates, and dependency ordering.</div>
      </a>
      <a class="nav-card" href="sessions/index.html">
        <div class="nav-card-title">Sessions</div>
        <div class="nav-card-desc">Individual lesson docs — objectives, quizzes, labs, and commit checkpoints.</div>
      </a>
      <a class="nav-card" href="quizzes/index.html">
        <div class="nav-card-title">Quizzes</div>
        <div class="nav-card-desc">Quiz bank and score tracker. Must score 80% to advance each layer.</div>
      </a>
      <a class="nav-card" href="labs/index.html">
        <div class="nav-card-title">Labs</div>
        <div class="nav-card-desc">Lab reference index. Step-by-step coding exercises per session.</div>
      </a>
      <a class="nav-card" href="architecture/index.html">
        <div class="nav-card-title">Architecture</div>
        <div class="nav-card-desc">Architecture decision log. Every structural choice documented here.</div>
      </a>
      <a class="nav-card" href="session-notes/index.html">
        <div class="nav-card-title">Session Notes</div>
        <div class="nav-card-desc">Running notes from each session. Questions raised and answered.</div>
      </a>
      <a class="nav-card" href="commit-reviews/index.html">
        <div class="nav-card-title">Commit Reviews</div>
        <div class="nav-card-desc">Every commit reviewed here before moving forward. No skipping.</div>
      </a>
      <a class="nav-card" href="prompts/index.html">
        <div class="nav-card-title">Prompt Log</div>
        <div class="nav-card-desc">Every prompt sent to the AI in this project, logged in order.</div>
      </a>
    </div>

    <h2>Curriculum Layers</h2>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Layer</th>
            <th>Topic</th>
            <th>Sessions</th>
            <th>Status</th>
            <th>Unlock Condition</th>
          </tr>
        </thead>
        <tbody>
${rows}
        </tbody>
      </table>
    </div>

    <h2>Rules We Follow</h2>
    <div class="card">
      <ol>
        <li>Never jump ahead — concepts taught in strict dependency order.</li>
        <li>One session = one tiny slice = one commit.</li>
        <li>Never teach a Python feature without connecting it to why it matters for the project.</li>
        <li>Never build large features in one session.</li>
        <li>Every coding session ends with documentation updates.</li>
        <li>We must understand every commit before proceeding.</li>
        <li>Score below 80% on a quiz = repeat the lesson.</li>
        <li>Always use fake/mock data before real APIs.</li>
        <li>Do not optimize for cleverness over readability.</li>
        <li>Code must stay beginner-readable.</li>
        <li>Never hide complexity behind abstractions too early.</li>
        <li>Force review of every changed file.</li>
        <li>Every lesson completable in 35–40 minutes.</li>
      </ol>
    </div>

    <p class="subtitle" style="margin-top: 32px;">
      Package manager: <code>pip</code> &nbsp;·&nbsp;
      Testing: <code>pytest</code> &nbsp;·&nbsp;
      Language: <code>Python 3</code> &nbsp;·&nbsp;
      Project: <code>Country Explorer</code>
    </p>
`;

  write(
    'index.html',
    page({ title: 'Python Fundamentals', depth: 0, active: 'home', bodyHtml: body })
  );
}

// ── SYLLABUS ───────────────────────────────────────────────────────
function buildSyllabus() {
  const layerBlocks = layers
    .map((l) => {
      const rows = sessionsInLayer(l.num)
        .map((s) => {
          const gate = isGate(s);
          return `          <tr>
            <td><a href="../sessions/session-${pad2(s.num)}/index.html">${pad2(s.num)}</a></td>
            <td>${s.title}${gate ? ' <em>(Layer gate)</em>' : ''}</td>
            <td>${s.conceptTitle}</td>
            <td>${s.lab.whatYouBuild.replace(/<[^>]+>/g, '')}</td>
            <td><span class="badge ${gate ? 'badge-gate' : 'badge-current'}">${gate ? 'Gate' : 'Available'}</span></td>
          </tr>`;
        })
        .join('\n');

      const isFinalLayer = l.num === layers[layers.length - 1].num;
      return `    <div class="layer-header">
      <span class="badge badge-current">${l.num === 0 ? 'Active' : 'Open'}</span>
      <span class="layer-title">Layer ${l.num} — ${l.name}</span>
    </div>
    <p class="layer-desc">${l.desc}</p>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Core Concept</th>
            <th>Project Milestone</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
${rows}
        </tbody>
      </table>
    </div>

    <div class="alert alert-info">
      ${isFinalLayer ? `<strong>Curriculum complete:</strong> This is the final layer. The core curriculum (Layers 1-7) ends at its own capstone; this layer is optional, bonus material beyond it.` : `<strong>Layer ${l.num} Gate:</strong> Recommended self-check score ${String.fromCharCode(8805)} 80% on the Layer ${l.num} review quiz before starting Layer ${l.num + 1} labs.`}
    </div>
`;
    })
    .join('\n');

  const body = `    <h1>${sessions.length}-Session Curriculum</h1>
    <p class="subtitle">
      Sessions must be completed in order. Each layer unlocks only after the previous layer's
      final quiz scores ≥ 80%. A session is not complete until the commit is made and reviewed.
      Every session builds the same running project: the Country Explorer.
    </p>

    <div class="alert alert-info">
      <strong>All sessions are open.</strong> Browse any session from the
      <a href="../sessions/index.html">Sessions</a> page. Layer gate quizzes remain
      recommended self-checks before advancing the lab track.
    </div>

${layerBlocks}

    <h2>Dependency Ordering</h2>
    <p>Each row depends on everything above it. Nothing skips a level.</p>
    <pre><code>Basics: print/vars → Operators/Strings → Conditionals → Loops
                  ↓
              Dictionaries → Lists → Comprehensions → Functions/Lambda → Unpacking/*args
  → Modules/Imports → Errors/Exceptions
                  ↓
              Classes → Attributes → Methods → Constructors → Composition
              → Conditionals → Object Lists → Identity/Equality
                        ↓
                    State → Controlled Updates → User Input → Tracing
                    → Validation → State Passing → Computed Properties
                                  ↓
                              Mock Data → Data Layer → JSON Files → Data Contracts
                                        ↓
                                    Testing → pytest → Return Values → State Tests → Data Layer Tests
                                              ↓
                                         Packages → Reusable Modules → Utilities → Prop Drilling → Architecture Review
                                                        ↓
                                                   File I/O → Real API → Robust Errors → Capstone
                                                                  ↓
                                                        (optional) Decorators → Generators/Context
                                                                  Managers → Packaging/venv</code></pre>
`;

  write('syllabus/index.html', page({ title: 'Syllabus', depth: 1, active: 'syllabus', bodyHtml: body }));
}

// ── SESSIONS INDEX ─────────────────────────────────────────────────
function buildSessionsIndex() {
  const layerBlocks = layers
    .map((l) => {
      const rows = sessionsInLayer(l.num)
        .map((s) => {
          const gate = isGate(s);
          return `          <tr><td><a href="session-${pad2(s.num)}/index.html">${pad2(s.num)}</a></td><td>${s.title}${gate ? ' <em>(Layer gate)</em>' : ''}</td><td><span class="badge ${gate ? 'badge-gate' : 'badge-current'}">${gate ? 'Gate' : 'Available'}</span></td><td>Full</td></tr>`;
        })
        .join('\n');
      return `    <h2>Layer ${l.num} — ${l.name}</h2>
    <div class="table-wrap">
      <table>
        <thead><tr><th>#</th><th>Title</th><th>Status</th><th>Doc</th></tr></thead>
        <tbody>
${rows}
        </tbody>
      </table>
    </div>`;
    })
    .join('\n\n');

  const body = `    <h1>Sessions</h1>
    <p class="subtitle">
      One session doc per lesson. Each doc contains the pre-quiz, lab instructions, commit checkpoint,
      and post-quiz. A session is not complete until the commit is made and reviewed.
    </p>

    <div class="alert alert-info">
      <strong>All ${sessions.length} sessions have full lesson docs.</strong> Work through sessions in order;
      layer gate quizzes are recommended self-checks. See the
      <a href="../syllabus/index.html">Syllabus</a> for core concepts and milestones.
    </div>

${layerBlocks}
`;
  write('sessions/index.html', page({ title: 'Sessions', depth: 1, active: 'sessions', bodyHtml: body }));
}

// ── QUIZZES HUB ────────────────────────────────────────────────────
function buildQuizzes() {
  const rows = sessions
    .map(
      (s) => `          <tr>
            <td><a href="../sessions/session-${pad2(s.num)}/index.html">${pad2(s.num)}</a></td>
            <td>${s.title}</td>
            <td>—</td>
            <td>—</td>
            <td><span class="badge badge-locked">Not started</span></td>
          </tr>`
    )
    .join('\n');

  const body = `    <h1>Quiz Bank &amp; Score Tracker</h1>
    <p class="subtitle">
      Each session has 5 questions — asked before coding and after. Must score ≥ 80% (4/5) to advance.
      Scores are recorded here after each session.
    </p>

    <div class="alert alert-warning">
      <strong>Quiz rule:</strong> Questions test understanding of the exact code and examples taught
      in that session, not generic trivia. If you score below 80%, the session repeats.
    </div>

    <h2>Quiz Design Principles</h2>
    <div class="card">
      <p><strong>Bad question (disconnected trivia):</strong> "What keyword defines a function in Python?"</p>
      <p><strong>Good question (grounded in the session's own material):</strong> "Given <code>def region_label(name, region=\\"Unknown\\"):</code>, what does <code>region_label(\\"Kenya\\")</code> return for <code>region</code>, and why?"</p>
      <hr style="margin: 12px 0;" />
      <p>Every quiz question in this curriculum reuses the exact code example just taught in that
      session's concept section — questions require reasoning about what the code actually does,
      not recalling isolated syntax facts.</p>
    </div>

    <h2>Score History</h2>

    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>#</th><th>Session</th><th>Pre-Quiz</th><th>Post-Quiz</th><th>Status</th></tr>
        </thead>
        <tbody>
${rows}
        </tbody>
      </table>
    </div>
`;
  write('quizzes/index.html', page({ title: 'Quizzes', depth: 1, active: 'quizzes', bodyHtml: body }));
}

// ── LABS HUB ───────────────────────────────────────────────────────
function buildLabs() {
  const rows = sessions
    .map((s) => {
      const files = s.filesChanged.map((f) => `<code>${f.file}</code>`).join(', ');
      return `          <tr>
            <td><a href="../sessions/session-${pad2(s.num)}/index.html">${pad2(s.num)}</a></td>
            <td>${s.lab.objective}</td>
            <td>${files}</td>
            <td><span class="badge badge-current">Available</span></td>
          </tr>`;
    })
    .join('\n');

  const body = `    <h1>Lab Reference Index</h1>
    <p class="subtitle">
      Labs are the hands-on portion of each session. Each lab has a tiny, specific objective.
      Labs are embedded in the session doc — this page is an index for quick lookup.
    </p>

    <div class="alert alert-info">
      Labs are designed to be completed in under 20 minutes. The rest of the session is
      spent reading, quizzing, and reviewing the commit.
    </div>

    <h2>Lab Objectives by Session</h2>

    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>#</th><th>Lab Objective</th><th>Files Touched</th><th>Status</th></tr>
        </thead>
        <tbody>
${rows}
        </tbody>
      </table>
    </div>
`;
  write('labs/index.html', page({ title: 'Labs', depth: 1, active: 'labs', bodyHtml: body }));
}

// ── ARCHITECTURE HUB ───────────────────────────────────────────────
function buildArchitecture() {
  const body = `    <h1>Architecture Decisions</h1>
    <p class="subtitle">
      Every structural decision in this project is documented here with the reason behind it.
      Architecture is not decided by instinct — it is decided consciously and recorded.
    </p>

    <div class="alert alert-info">
      When we make a new structural decision — where a file goes, why a module is split,
      why a pattern was chosen — it gets recorded here before or immediately after the commit.
      The full, evolving record lives in <code>ARCHITECTURE.md</code> at the project root,
      built out across Sessions 36 and 40, and finalized in Session 44.
    </div>

    <h2>Entry Format</h2>
    <div class="card">
      <p><strong>Decision:</strong> What we decided.</p>
      <p><strong>Session:</strong> When we decided it.</p>
      <p><strong>Why:</strong> The reasoning.</p>
      <p><strong>Alternatives considered:</strong> What else we could have done.</p>
      <p><strong>Consequence:</strong> What this decision requires or prevents in the future.</p>
    </div>

    <hr />

    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <span class="card-title">ADR-001 — Repository Pattern for Data Access</span>
        <span class="badge badge-layer">Session 24</span>
      </div>
      <p><strong>Decision:</strong> Wrap all data access behind a <code>CountryRepository</code> class with a stable <code>get_all()</code>/<code>find_by_region()</code>/<code>search()</code> interface.</p>
      <p><strong>Why:</strong> Application logic should not need to know or care whether data comes from an in-memory mock list, a JSON file, or a real API. Proven across three genuinely different data sources by Session 38 with zero changes to the repository's own methods.</p>
      <p><strong>Alternatives considered:</strong> Letting every part of the app import mock data directly. Rejected — this would tightly couple application logic to one specific data source.</p>
      <p><strong>Consequence:</strong> Any future data source must be adapted to return data in the same raw shape the repository expects.</p>
    </div>

    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <span class="card-title">ADR-002 — Package Structure by Responsibility</span>
        <span class="badge badge-layer">Session 32</span>
      </div>
      <p><strong>Decision:</strong> Split the growing single file into a <code>country_explorer</code> package with <code>models.py</code>, <code>repository.py</code>, <code>validators.py</code>, <code>formatting.py</code>, and <code>search.py</code>.</p>
      <p><strong>Why:</strong> Grouping by responsibility keeps each module focused and easier to navigate as the project grows.</p>
      <p><strong>Alternatives considered:</strong> Splitting by curriculum layer instead. Rejected — responsibility-based grouping stays meaningful independent of how the curriculum itself is structured.</p>
      <p><strong>Consequence:</strong> Every new piece of cross-cutting logic must be evaluated for which existing module — or a new one — it belongs in.</p>
    </div>

    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <span class="card-title">ADR-003 — Prop Drilling in Composed UI-Layer Classes (Unresolved)</span>
        <span class="badge badge-gate">Session 35</span>
      </div>
      <p><strong>Decision:</strong> None yet — documents a known problem, not a fix.</p>
      <p><strong>Why this is a problem:</strong> A layered <code>App → NavigationPanel → MenuSection → CountryExplorer</code> structure requires every intermediate layer to forward a reference it does not otherwise use.</p>
      <p><strong>Status:</strong> Deliberately left unresolved. A future iteration might explore a shared context object or dependency injection.</p>
    </div>
`;
  write('architecture/index.html', page({ title: 'Architecture', depth: 1, active: 'architecture', bodyHtml: body }));
}

// ── SESSION NOTES HUB ──────────────────────────────────────────────
function buildSessionNotes() {
  const layerEntries = layers
    .map((l) => {
      const first = sessionsInLayer(l.num)[0];
      const last = sessionsInLayer(l.num)[sessionsInLayer(l.num).length - 1];
      return `    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <span class="card-title">Layer ${l.num} — ${l.name} (Sessions ${pad2(first.num)}–${pad2(last.num)})</span>
      </div>
      <p><strong>Covered:</strong> ${l.desc}</p>
      <p><strong>Gate session:</strong> Session ${pad2(last.num)} — ${last.title}.</p>
    </div>`;
    })
    .join('\n\n');

  const body = `    <h1>Session Notes</h1>
    <p class="subtitle">
      Running notes from each session. Questions raised and answered. Confusing moments recorded.
      Breakthroughs noted. This is the human side of the learning log.
    </p>

    <div class="alert alert-info">
      <strong>For AI sessions:</strong> After each session, add a note entry here summarising what was
      covered, any questions that came up, any concepts that needed extra explanation, and the final quiz score.
    </div>

    <h2>Note Format</h2>
    <pre><code>&lt;div class="card"&gt;
  &lt;div style="display:flex; justify-content:space-between;"&gt;
    &lt;span class="card-title"&gt;Session NN — Title&lt;/span&gt;
    &lt;span style="color:var(--text-muted);font-size:13px;"&gt;YYYY-MM-DD&lt;/span&gt;
  &lt;/div&gt;
  &lt;p&gt;&lt;strong&gt;Covered:&lt;/strong&gt; ...&lt;/p&gt;
  &lt;p&gt;&lt;strong&gt;Questions raised:&lt;/strong&gt; ...&lt;/p&gt;
  &lt;p&gt;&lt;strong&gt;Confusion points:&lt;/strong&gt; ...&lt;/p&gt;
  &lt;p&gt;&lt;strong&gt;Quiz scores:&lt;/strong&gt; Pre: X/5 · Post: X/5&lt;/p&gt;
  &lt;p&gt;&lt;strong&gt;Passed?&lt;/strong&gt; Yes / No (repeat)&lt;/p&gt;
&lt;/div&gt;</code></pre>

    <hr />

    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
        <span class="card-title">Pre-curriculum — Project Setup</span>
        <span style="color:var(--text-muted);font-size:13px;">2026-07-26</span>
      </div>
      <p><strong>Covered:</strong> Full 40-session Python Fundamentals curriculum designed, mirroring the
      structure of the source React course. Repository structure created. All documentation infrastructure
      generated. No code written yet.</p>
      <p><strong>Decisions made:</strong> pip, minimal CSS dark theme (reused from the source course), plain
      Python (no external framework), static HTML docs, mock data before real APIs, a single running
      project — the Country Explorer — built incrementally across the 44-session core curriculum (plus 3 optional bonus sessions).</p>
      <p><strong>Next:</strong> Session 01 — Hello, World & Variables.</p>
    </div>

${layerEntries}
`;
  write('session-notes/index.html', page({ title: 'Session Notes', depth: 1, active: 'session-notes', bodyHtml: body }));
}

// ── COMMIT REVIEWS HUB ─────────────────────────────────────────────
function buildCommitReviews() {
  const entries = sessions
    .map((s) => {
      const files = s.filesChanged
        .map((f) => `<li><code>${f.file}</code> — ${f.action}: ${f.why}</li>`)
        .join('\n        ');
      return `    <div class="commit-entry">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
        <span class="card-title">Session ${pad2(s.num)} — ${s.title}</span>
        <span class="badge badge-locked">Pending</span>
      </div>
      <p><span class="commit-hash">session-${pad2(s.num)}</span></p>
      <p style="margin-top:10px;"><strong>Files changed:</strong></p>
      <ul>
        ${files}
      </ul>
      <p style="margin-top:10px;"><strong>Commit message:</strong> <code>${s.commitCmd.split('\n').pop().replace('git commit -m ', '')}</code></p>
    </div>`;
    })
    .join('\n\n');

  const body = `    <h1>Commit Reviews</h1>
    <p class="subtitle">
      Every commit is reviewed here before the session ends. No moving forward without understanding
      every line that was changed. This page is a log of that review.
    </p>

    <div class="alert alert-warning">
      <strong>Rule:</strong> A session is not complete until the commit is reviewed here and you
      can explain every changed file from memory.
    </div>

    <h2>Review Format</h2>
    <div class="card">
      <p><strong>Commit hash:</strong> (first 7 characters)</p>
      <p><strong>Commit message:</strong> Exact message from the session doc</p>
      <p><strong>Session:</strong> Which session this belongs to</p>
      <p><strong>Files changed:</strong> List of every file with a one-line explanation</p>
      <p><strong>Can you explain it?</strong> Yes / No (if No, session repeats)</p>
    </div>

    <hr />

    <h2>Review Log</h2>

${entries}
`;
  write('commit-reviews/index.html', page({ title: 'Commit Reviews', depth: 1, active: 'commit-reviews', bodyHtml: body }));
}

// ── PROMPTS HUB ────────────────────────────────────────────────────
function buildPrompts() {
  const body = `    <h1>Prompt Log</h1>
    <p class="subtitle">
      Every prompt sent to the AI in this project, logged in order. Future AI sessions must
      append new prompts here before doing anything else. This is a record of intent.
    </p>

    <div class="alert alert-info">
      <strong>For AI sessions:</strong> Append each new prompt to this file at the start of every conversation,
      using the format below. Prompt number increments from the last entry. Include the full prompt text.
    </div>

    <h2>Entry Format</h2>
    <pre><code>&lt;div class="prompt-entry"&gt;
  &lt;div class="prompt-meta"&gt;
    &lt;span&gt;#N&lt;/span&gt;
    &lt;span&gt;YYYY-MM-DD&lt;/span&gt;
    &lt;span&gt;Session: session-XX (or "Pre-curriculum")&lt;/span&gt;
  &lt;/div&gt;
  &lt;div class="prompt-text"&gt;...full prompt text...&lt;/div&gt;
&lt;/div&gt;</code></pre>

    <hr />

    <h2>Prompt Entries</h2>

    <div class="prompt-entry">
      <div class="prompt-meta">
        <span>#1</span>
        <span>2026-07-26</span>
        <span>Session: Pre-curriculum (Project Initialization)</span>
      </div>
      <div class="prompt-text">Analyze the existing React Learn with AI course as the canonical template. Do not change the teaching methodology, pacing, lesson structure, navigation, styling, or user experience unless absolutely necessary for Python. Create an equivalent Python Fundamentals course using the same pattern.

Requirements:
- Preserve the same lesson progression and chapter organization.
- Keep lessons to approximately 30-40 minutes each.
- Maintain the same "learn with AI" interactive style.
- Cover Python fundamentals from beginner through intermediate, replacing React-specific content with the Python equivalent.
- Reuse the same UI components, navigation, progress tracking, and layout where possible.
- Generate all required markdown/content files.
- Ensure the site builds successfully.
- Publish it as a separate GitHub repository under my GitHub account.
- Configure GitHub Pages so the course is publicly accessible.
- Verify the deployed site works correctly.
- Commit changes in logical commits with clear commit messages.

Follow-up guidance: every quiz question must be grounded in the exact material and code
presented in that same session — not generic, disconnected trivia.</div>
    </div>
`;
  write('prompts/index.html', page({ title: 'Prompts', depth: 1, active: 'prompts', bodyHtml: body }));
}

buildHome();
buildSyllabus();
buildSessionsIndex();
buildQuizzes();
buildLabs();
buildArchitecture();
buildSessionNotes();
buildCommitReviews();
buildPrompts();

console.log('Generated all hub pages.');
