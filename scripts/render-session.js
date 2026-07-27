const { pad2, page, escCode } = require('./lib');

function layerForSession(layers, num) {
  return layers.find((l) => num >= l.range[0] && num <= l.range[1]);
}

function escXml(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// Real, hand-laid-out inline SVG diagrams — boxes with wrapped multi-line text,
// connected by arrows, matching the source course's illustration style instead
// of styled CSS divs.
function renderDiagram(d, opts = {}) {
  if (!d) return '';
  const boxW = 148;
  const boxH = 78;
  const gap = 46;
  const padTop = 26;
  const n = d.boxes.length;
  const totalW = n * boxW + (n - 1) * gap + 24;
  const totalH = padTop + boxH + 34;

  const boxesSvg = d.boxes
    .map((b, i) => {
      const x = 12 + i * (boxW + gap);
      const y = padTop;
      const stroke = b.accent ? '#ff5ca8' : '#ffffff';
      const lines = String(b.text).split('\n');
      const labelSvg = b.label
        ? `<text x="${x + 10}" y="${y - 8}" font-family="monospace" font-size="9" fill="${
            b.accent ? '#ff5ca8' : '#8b949e'
          }" letter-spacing="0.06em">${escXml(b.label.toUpperCase())}</text>`
        : '';
      const lineHeight = 15;
      const textStartY = y + boxH / 2 - ((lines.length - 1) * lineHeight) / 2 + 4;
      const linesSvg = lines
        .map(
          (line, li) =>
            `<text x="${x + boxW / 2}" y="${textStartY + li * lineHeight}" text-anchor="middle" font-family="monospace" font-size="11" fill="#e6edf3">${escXml(
              line
            )}</text>`
        )
        .join('');
      const arrow =
        i < n - 1
          ? `<line x1="${x + boxW + 6}" y1="${y + boxH / 2}" x2="${x + boxW + gap - 6}" y2="${
              y + boxH / 2
            }" stroke="#58a6ff" stroke-width="1.5" /><polygon points="${x + boxW + gap - 10},${
              y + boxH / 2 - 4
            } ${x + boxW + gap - 2},${y + boxH / 2} ${x + boxW + gap - 10},${
              y + boxH / 2 + 4
            }" fill="#58a6ff" />`
          : '';
      return `${labelSvg}<rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" rx="4" fill="none" stroke="${stroke}" stroke-width="1.5" />${linesSvg}${arrow}`;
    })
    .join('');

  const cls = opts.opening ? ' class="diagram-svg diagram-svg-opening"' : ' class="diagram-svg"';

  return `    <div${cls}>
      <svg viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}" xmlns="http://www.w3.org/2000/svg" style="max-width:100%; height:auto; display:block; margin:0 auto;">
        <rect width="${totalW}" height="${totalH}" fill="#111111" />
        ${boxesSvg}
      </svg>
      ${d.caption ? `<p class="diagram-caption-text">${d.caption}</p>` : ''}
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

// Finds the diagram used as the session's opening visual (the first one that
// appears anywhere in the concept sections) so it isn't rendered a second
// time inline where it originally lived.
function findOpeningDiagram(s) {
  if (s.openingDiagram) return { diagram: s.openingDiagram, sectionIndex: -1 };
  const idx = s.sections.findIndex((sec) => sec.diagram);
  return idx === -1 ? null : { diagram: s.sections[idx].diagram, sectionIndex: idx };
}

function renderConceptSections(sections, skipDiagramIndex) {
  return sections
    .map((s, i) => {
      const paras = s.paragraphs.map((p) => `    <p>${p}</p>`).join('\n');
      const code = s.code ? `    <pre><code>${escCode(s.code)}</code></pre>\n` : '';
      const diagram = s.diagram && i !== skipDiagramIndex ? renderDiagram(s.diagram) : '';
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

function renderSession(s, layers, totalSessions) {
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

  const next = s.num < totalSessions ? `<a href="../../sessions/index.html">Session ${pad2(s.num + 1)} — ${s.nextTitle}</a>` : null;

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
${(() => {
  const opening = findOpeningDiagram(s);
  return opening ? renderDiagram(opening.diagram, { opening: true }) : '';
})()}
${s.conceptIntro ? `    <p>${s.conceptIntro}</p>\n` : ''}
${renderConceptSections(s.sections, findOpeningDiagram(s)?.sectionIndex)}
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
      ${next ? `<p><strong>Next session:</strong> ${next}. ${s.nextTeaser || ''}</p>` : `<p><strong>This is the final session.</strong> The curriculum, core and bonus layers alike, is complete.</p>`}
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
