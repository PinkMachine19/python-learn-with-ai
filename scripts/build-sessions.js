const fs = require('fs');
const path = require('path');
const { renderSession } = require('./render-session');
const { pad2 } = require('./lib');
const layers = require('../data/layers');

const sessions = [
  ...require('../data/sessions-01-04'),
  ...require('../data/sessions-05-14'),
  ...require('../data/sessions-15-24'),
  ...require('../data/sessions-25-34'),
  ...require('../data/sessions-35-44'),
  ...require('../data/sessions-45-47'),
];

const EXPECTED_TOTAL = 47;
if (sessions.length !== EXPECTED_TOTAL) {
  throw new Error(`Expected ${EXPECTED_TOTAL} sessions, got ${sessions.length}`);
}

const nums = sessions.map((s) => s.num);
const expected = Array.from({ length: EXPECTED_TOTAL }, (_, i) => i + 1);
if (JSON.stringify(nums) !== JSON.stringify(expected)) {
  throw new Error(`Session numbers out of order or missing: ${nums.join(',')}`);
}

const docsRoot = path.join(__dirname, '..', 'docs');

// Wipe any stale session output from a previous numbering scheme before
// regenerating, so no orphaned session-NN directories survive a renumber.
const sessionsRoot = path.join(docsRoot, 'sessions');
if (fs.existsSync(sessionsRoot)) {
  for (const entry of fs.readdirSync(sessionsRoot)) {
    const full = path.join(sessionsRoot, entry);
    if (fs.statSync(full).isDirectory() && /^session-\d+$/.test(entry)) {
      fs.rmSync(full, { recursive: true, force: true });
    }
  }
}

for (const s of sessions) {
  const dir = path.join(docsRoot, 'sessions', `session-${pad2(s.num)}`);
  fs.mkdirSync(dir, { recursive: true });
  const html = renderSession(s, layers, sessions.length);
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

console.log(`Generated ${sessions.length} session pages.`);
module.exports = { sessions, layers };
