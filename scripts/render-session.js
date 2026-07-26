const { pad2, page, escCode } = require('./lib');

function layerForSession(layers, num) {
  return layers.find((l) => num >= l.range[0] && num <= l.range[1]);
}

function renderDiagram(d) {
  if (!d) return '';
  const boxes = d.boxes
    .map((b, i) => {
      const arrow = i < d.boxes.length - 1 ? '<span class="diagram-arrow">→</span>' : '';
      return `      <div class="diagram-box${b.accent ? ' accent' : ''}">${
        b.label ? `<span class="diagram-label">${b.label}</span>` : ''
      }${b.text}</div>${arrow}`;
    })
    .join('\n');
  return `    <div class="diagram">
${boxes}
${d.caption ? `      <div class="diagram-caption">${d.caption}</div>` : ''}
    </div>
`;
}

function renderQuiz(idPrefix, questions) {
  const qs = questions
    .map((q, i) => {
      const opts = ['a', 'b', 'c', 'd']
        .map((k) => `        <label class="quiz-option" data-val="${k}">${q.options[k]}</label>`)
        .join('\n');
      return `      <div class="quiz-question" data-question="${i}" data-answer="${q.answer}">
        <div class="question-num">Question ${i + 1} of ${questions.length}</div>
        <p>${q.q}</p>
${opts}
        <div class="explanation">${q.explain}</div>
      </div>`;
    })
    .join('\n\n');

  return `    <div id="${idPrefix}-quiz">

${qs}

      <button class="submit-btn" disabled>Submit ${idPrefix === 'pre' ? 'Pre-Quiz' : 'Post-Quiz'}</button>
      <div class="quiz-result" id="${idPrefix}-result"></div>
    </div>`;
}

function renderConceptSections(sections) {
  return sections
    .map((s) => {
      const paras = s.paragraphs.map((p) => `    <p>${p}</p>`).join('\n');
      const code = s.code ? `    <pre><code>${escCode(s.code)}</code></pre>\n` : '';
      const diagram = s.diagram ? renderDiagram(s.diagram) : '';
      return `    <h3>${s.h3}</h3>
${paras}
${code}${diagram}`;
    })
    .join('\n');
}

function renderLabSteps(steps) {
  return steps
    .map(
      (s, i) => `    <div class="step">
      <div class="step-num">${i + 1}</div>
      <div class="step-body">
        <p><strong>${s.title}</strong></p>
${s.body.map((p) => `        <p>${p}</p>`).join('\n')}
${s.code ? `        <pre><code>${escCode(s.code)}</code></pre>` : ''}
      </div>
    </div>`
    )
    .join('\n\n');
}

function renderFilesChanged(files) {
  const rows = files
    .map(
      (f) => `          <tr>
            <td><code>${f.file}</code></td>
            <td>${f.action}</td>
            <td>${f.why}</td>
          </tr>`
    )
    .join('\n');
  return `    <div class="table-wrap">
      <table>
        <thead>
          <tr><th>File</th><th>Action</th><th>Why</th></tr>
        </thead>
        <tbody>
${rows}
        </tbody>
      </table>
    </div>`;
}

function renderChecklist(items) {
  return `    <div class="card">
${items
  .map(
    (t, i) => `      <div class="checklist-item">
        <input type="checkbox" id="c${i + 1}" />
        <label for="c${i + 1}">${t}</label>
      </div>`
  )
  .join('\n')}
    </div>`;
}

function renderSession(s, layers) {
  const layer = layerForSession(layers, s.num);
  const slug = `session-${pad2(s.num)}`;
  const isGate = layer.range[1] === s.num;

  const styles = `  <link rel="stylesheet" href="../../notes-widget.css" />
  <link rel="stylesheet" href="../../bookmark-widget.css" />
  <link rel="stylesheet" href="../../quiz-explain-modal.css" />
  <style>
    .quiz-option { display: block; background: var(--surface-2); border: 1px solid var(--border); border-radius: var(--radius); padding: 10px 14px; margin-bottom: 8px; cursor: pointer; font-size: 14px; transition: border-color 0.15s, background 0.15s; user-select: none; }
    .quiz-option:hover { border-color: var(--accent); background: var(--surface); }
    .quiz-option.selected { border-color: var(--accent); background: rgba(88,166,255,0.1); }
    .quiz-option.correct  { border-color: var(--green);  background: rgba(63,185,80,0.1); }
    .quiz-option.wrong    { border-color: var(--red);    background: rgba(248,81,73,0.1); }
    .quiz-question { margin-bottom: 28px; }
    .quiz-question p { font-weight: 600; margin-bottom: 10px; font-size: 15px; }
    .quiz-question .question-num { color: var(--text-muted); font-size: 12px; font-weight: 400; margin-bottom: 4px; }
    .quiz-result { display: none; padding: 16px 20px; border-radius: var(--radius); margin-top: 16px; font-size: 15px; font-weight: 600; }
    .quiz-result.pass { background: rgba(63,185,80,0.12); border: 1px solid var(--green); color: var(--green); }
    .quiz-result.fail { background: rgba(248,81,73,0.12); border: 1px solid var(--red);   color: var(--red); }
    .explanation { display: none; font-size: 13px; color: var(--text-muted); margin-top: 6px; padding: 8px 12px; background: var(--surface-2); border-radius: var(--radius); border-left: 2px solid var(--border); }
    .submit-btn { background: var(--accent); color: #0d1117; border: none; border-radius: var(--radius); padding: 10px 22px; font-size: 14px; font-weight: 700; cursor: pointer; margin-top: 8px; transition: opacity 0.15s; }
    .submit-btn:hover { opacity: 0.85; }
    .submit-btn:disabled { opacity: 0.4; cursor: not-allowed; }
    .step { display: flex; gap: 16px; margin-bottom: 20px; }
    .step-num { flex-shrink: 0; width: 28px; height: 28px; border-radius: 50%; background: var(--accent); color: #0d1117; font-weight: 700; font-size: 13px; display: flex; align-items: center; justify-content: center; margin-top: 2px; }
    .step-body { flex: 1; }
    .step-body p { margin-bottom: 6px; }
    .section-divider { border: none; border-top: 2px solid var(--border); margin: 40px 0; }
    .checklist-item { display: flex; align-items: flex-start; gap: 10px; margin-bottom: 10px; font-size: 14px; }
    .checklist-item input[type="checkbox"] { margin-top: 3px; width: 16px; height: 16px; accent-color: var(--accent); flex-shrink: 0; }
  </style>`;

  const next = s.num < 40 ? `<a href="../../sessions/index.html">Session ${pad2(s.num + 1)} — ${s.nextTitle}</a>` : null;

  const body = `    <!-- Header -->
    <div style="display:flex; align-items:center; gap:12px; margin-bottom:6px;">
      <span class="badge badge-layer">Layer ${layer.num}</span>
      <span class="badge ${isGate ? 'badge-gate' : 'badge-current'}">Session ${pad2(s.num)}${isGate ? ' — Gate' : ''}</span>
      <span style="color:var(--text-muted); font-size:13px;">${layer.name}</span>
    </div>
    <h1>${s.title}</h1>
    <p class="subtitle">${s.subtitle}</p>

    <div class="alert alert-info">
      Estimated time: ${s.timeEstimate} &nbsp;·&nbsp; Pre-quiz → Concept → Lab → Commit → Post-quiz
    </div>

    <h2>1. Learning Objective</h2>
    <div class="card">
      <p>By the end of this session you will be able to:</p>
      <ul>
${s.objectives.map((o) => `        <li>${o}</li>`).join('\n')}
      </ul>
    </div>

    <h2>2. Pre-Coding Quiz</h2>
    <p>
      Answer these <strong>before</strong> reading the concept explanation or writing any code.
      It is fine to get these wrong — that is the point. You need 4/5 to proceed to the lab.
    </p>

${renderQuiz('pre', s.quiz)}

    <hr class="section-divider" />

    <h2>3. The Concept — ${s.conceptTitle}</h2>
${s.conceptIntro ? `    <p>${s.conceptIntro}</p>\n` : ''}
${renderConceptSections(s.sections)}
${
  s.callout
    ? `    <div class="alert alert-warning">
      <strong>${s.callout.title}</strong> ${s.callout.text}
    </div>\n`
    : ''
}
${s.closing ? `    <p>${s.closing}</p>\n` : ''}
    <hr class="section-divider" />

    <h2>4. Lab</h2>
    <div class="alert alert-success">
      <strong>Lab objective:</strong> ${s.lab.objective}
    </div>

    <h3>What you will build</h3>
    <p>${s.lab.whatYouBuild}</p>

    <h3>Step-by-step instructions</h3>

${renderLabSteps(s.lab.steps)}

    <hr class="section-divider" />

    <h2>5. Expected Files Changed</h2>
${renderFilesChanged(s.filesChanged)}

    <div class="alert alert-warning">
      If you find yourself editing any other file, stop. This session touches exactly ${s.filesChanged.length} file${s.filesChanged.length > 1 ? 's' : ''}.
    </div>

    <hr class="section-divider" />

    <h2>6. Commit Checkpoint</h2>
    <p>Once the lab is complete and you can explain every line, make this exact commit:</p>
    <pre><code>${escCode(s.commitCmd)}</code></pre>

    <div class="alert alert-info">
      Do not commit until you can answer out loud: "${s.commitQuestion}"
    </div>

    <hr class="section-divider" />

    <h2>7. Code Review Checklist</h2>
    <p>Go through your code line by line and check each item:</p>

${renderChecklist(s.checklist)}

    <hr class="section-divider" />

    <h2>8. Post-Coding Quiz</h2>
    <p>
      Same 5 questions. Take it again now that you have written and run the code.
      You need 4/5 to mark this session complete.
    </p>

${renderQuiz('post', s.quiz)}

    <hr class="section-divider" />

    <h2>9. Reflection Questions</h2>
    <p>Think through these after the post-quiz. No right answer — they are for discussion.</p>
    <div class="card">
      <ol>
${s.reflection.map((r) => `        <li>${r}</li>`).join('\n')}
      </ol>
    </div>

    <hr class="section-divider" />

    <h2>10. What Breaks If This Knowledge Is Missing?</h2>
    <div class="card">
      <ul>
${s.whatBreaks.map((w) => `        <li><strong>${w.title}:</strong> ${w.text}</li>`).join('\n')}
      </ul>
    </div>

    <hr class="section-divider" />

    <h2>11. What We Learned</h2>
    <div class="card" style="border-color: var(--green);">
      <p><strong>Python concept mastered:</strong> ${s.learnedConcept}</p>
      <p><strong>Unlocks:</strong> ${s.learnedUnlocks}</p>
      ${next ? `<p><strong>Next session:</strong> ${next}. ${s.nextTeaser || ''}</p>` : `<p><strong>This is the capstone.</strong> The curriculum is complete.</p>`}
    </div>
`;

  const scripts = `<script src="../../quiz.js" defer></script>
<script>
  document.addEventListener('DOMContentLoaded', function () {
    setupQuiz('pre');
    setupQuiz('post');
  });
</script>

<script src="../../notes-widget.js" defer></script>
<script src="../../bookmark-widget.js" defer></script>
`;

  return page({
    title: `Session ${pad2(s.num)} — ${s.title}`,
    depth: 2,
    active: 'sessions',
    styles,
    bodyHtml: body,
    scripts,
  });
}

module.exports = { renderSession, layerForSession };
