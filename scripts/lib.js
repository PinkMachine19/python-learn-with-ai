// Shared HTML-building helpers used by all render scripts.
function esc(s) {
  return String(s == null ? '' : s);
}

// HTML-escape a raw code block (used for <pre><code>...</code></pre> content).
function escCode(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function pad2(n) {
  return String(n).padStart(2, '0');
}

function nav(active) {
  const items = [
    ['syllabus/index.html', 'Syllabus'],
    ['sessions/index.html', 'Sessions'],
    ['quizzes/index.html', 'Quizzes'],
    ['labs/index.html', 'Labs'],
  ];
  return items;
}

// depth: number of '../' segments needed to reach docs/ root from the page being rendered
function navHtml(depth, active) {
  const root = '../'.repeat(depth) || './';
  const home = depth === 0 ? 'index.html' : root + 'index.html';
  const brandActive = active === 'home' ? ' active' : '';
  const link = (path, label, key) =>
    `    <a href="${root}${path}"${active === key ? ' class="active"' : ''}>${label}</a>`;
  return `<nav>
  <div class="container">
    <a href="${home}" class="brand${brandActive}">🐍 Python Learning</a>
${link('syllabus/index.html', 'Syllabus', 'syllabus')}
${link('sessions/index.html', 'Sessions', 'sessions')}
${link('quizzes/index.html', 'Quizzes', 'quizzes')}
${link('labs/index.html', 'Labs', 'labs')}
  </div>
</nav>`;
}

function page({ title, depth, active, styles = '', bodyHtml, scripts = '', extraHead = '' }) {
  const root = '../'.repeat(depth) || './';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)} — Python Learning</title>
  <link rel="stylesheet" href="${root}styles.css" />${extraHead}
${styles}
</head>
<body>

${navHtml(depth, active)}

<main>
  <div class="container">

${bodyHtml}

  </div>
</main>
${scripts}
<aside class="academy-project-status" aria-label="Project status" style="max-width:920px;margin:40px auto 24px;padding:16px 24px;border:1px solid #30363d;border-left:4px solid #ff5ca8;border-radius:6px;background:#161b22;color:#8b949e;font:13px/1.6 -apple-system,BlinkMacSystemFont,&quot;Segoe UI&quot;,Helvetica,Arial,sans-serif"><strong style="color:#ff5ca8">Project Status:</strong> This course is part of an evolving personal engineering library. AI assisted with drafting and organization, but every lesson is intended to be reviewed, validated, and improved over time as I work through the material myself. Draft content should be treated as work in progress until marked as validated.</aside>
</body>
</html>
`;
}

module.exports = { esc, escCode, pad2, page, navHtml };
