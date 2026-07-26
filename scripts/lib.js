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
    ['architecture/index.html', 'Architecture'],
    ['session-notes/index.html', 'Notes'],
    ['commit-reviews/index.html', 'Commits'],
    ['prompts/index.html', 'Prompts'],
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
${link('architecture/index.html', 'Architecture', 'architecture')}
${link('session-notes/index.html', 'Notes', 'session-notes')}
${link('commit-reviews/index.html', 'Commits', 'commit-reviews')}
${link('prompts/index.html', 'Prompts', 'prompts')}
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
</body>
</html>
`;
}

module.exports = { esc, escCode, pad2, page, navHtml };
