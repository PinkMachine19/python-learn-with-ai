const fs = require('fs');
const path = require('path');
const { renderSession } = require('./render-session');
const { pad2 } = require('./lib');
const layers = require('../data/layers');

const sessions = [
  ...require('../data/sessions-01-10'),
  ...require('../data/sessions-11-20'),
  ...require('../data/sessions-21-30'),
  ...require('../data/sessions-31-40'),
];

if (sessions.length !== 40) {
  throw new Error(`Expected 40 sessions, got ${sessions.length}`);
}

const nums = sessions.map((s) => s.num);
const expected = Array.from({ length: 40 }, (_, i) => i + 1);
if (JSON.stringify(nums) !== JSON.stringify(expected)) {
  throw new Error(`Session numbers out of order or missing: ${nums.join(',')}`);
}

const docsRoot = path.join(__dirname, '..', 'docs');

for (const s of sessions) {
  const dir = path.join(docsRoot, 'sessions', `session-${pad2(s.num)}`);
  fs.mkdirSync(dir, { recursive: true });
  const html = renderSession(s, layers);
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

console.log(`Generated ${sessions.length} session pages.`);
module.exports = { sessions, layers };
