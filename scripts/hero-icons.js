// A small library of illustrated SVG motifs, one per concept family, used as
// the "hero" visual that opens every session — a graphical suggestion of the
// concept before any text, for visual learners.
//
// Canvas is always 560x200. WHITE = var(--text)/border, PINK = var(--accent2
// equivalent) for emphasis, BLUE = var(--accent) for flow/motion.
const WHITE = '#e6edf3';
const MUTED = '#8b949e';
const PINK = '#ff5ca8';
const BLUE = '#58a6ff';
const GREEN = '#3fb950';
const YELLOW = '#d29922';

function esc(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function text(x, y, s, opts = {}) {
  const { size = 11, color = WHITE, anchor = 'start', mono = true, weight = 400 } = opts;
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${mono ? 'monospace' : 'var(--font-sans)'}" font-size="${size}" fill="${color}" font-weight="${weight}">${esc(s)}</text>`;
}

function arrow(x1, y1, x2, y2, color = BLUE, curved = false) {
  const line = curved
    ? `<path d="M${x1},${y1} Q${(x1 + x2) / 2},${y1 - 30} ${x2},${y2}" fill="none" stroke="${color}" stroke-width="1.5" />`
    : `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.5" />`;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const ax = x2 - 8 * Math.cos(angle);
  const ay = y2 - 8 * Math.sin(angle);
  const perp = angle + Math.PI / 2;
  const p1x = ax + 5 * Math.cos(perp), p1y = ay + 5 * Math.sin(perp);
  const p2x = ax - 5 * Math.cos(perp), p2y = ay - 5 * Math.sin(perp);
  return `${line}<polygon points="${x2},${y2} ${p1x.toFixed(1)},${p1y.toFixed(1)} ${p2x.toFixed(1)},${p2y.toFixed(1)}" fill="${color}" />`;
}

const ICONS = {
  // A labeled container with key : value rows — dictionaries, contracts.
  dict: () => `
    <rect x="200" y="30" width="220" height="140" rx="6" fill="none" stroke="${WHITE}" stroke-width="1.5" />
    ${text(215, 60, 'name', { color: PINK })}${text(340, 60, '"Kenya"')}
    <line x1="200" y1="72" x2="420" y2="72" stroke="${WHITE}" stroke-width="0.5" opacity="0.25" />
    ${text(215, 100, 'region', { color: PINK })}${text(340, 100, '"Africa"')}
    <line x1="200" y1="112" x2="420" y2="112" stroke="${WHITE}" stroke-width="0.5" opacity="0.25" />
    ${text(215, 140, 'population', { color: PINK })}${text(340, 140, '54000000')}
    ${text(200, 20, 'key : value pairs', { size: 10, color: MUTED, mono: false })}
  `,

  // A row of indexed cells — lists and iteration.
  list: () => {
    const items = ['"Kenya"', '"Ghana"', '"Peru"', '"Japan"'];
    let cells = '';
    items.forEach((it, i) => {
      const x = 90 + i * 100;
      cells += `<rect x="${x}" y="60" width="88" height="60" rx="4" fill="none" stroke="${i === 0 ? PINK : WHITE}" stroke-width="1.5" />`;
      cells += text(x + 44, 96, it, { anchor: 'middle', size: 11 });
      cells += text(x + 44, 135, String(i), { anchor: 'middle', size: 10, color: MUTED });
    });
    return `${cells}${text(90, 42, 'index →', { size: 10, color: MUTED, mono: false })}`;
  },

  // A cyclical arrow around dots — loops, iteration, repetition.
  loop: () => `
    <path d="M280,45 A65,65 0 1 1 215,100" fill="none" stroke="${BLUE}" stroke-width="2" />
    <polygon points="215,100 232,90 228,110" fill="${BLUE}" />
    <circle cx="280" cy="100" r="46" fill="none" stroke="${WHITE}" stroke-width="1" stroke-dasharray="3,3" opacity="0.3" />
    <circle cx="280" cy="54" r="6" fill="${PINK}" />
    <circle cx="322" cy="100" r="6" fill="${WHITE}" />
    <circle cx="280" cy="146" r="6" fill="${WHITE}" />
    <circle cx="238" cy="100" r="6" fill="${WHITE}" />
    ${text(280, 180, 'repeat for every item', { anchor: 'middle', size: 10, color: MUTED, mono: false })}
  `,

  // A diamond decision with two diverging paths — conditionals / branching.
  branch: () => `
    <polygon points="280,35 320,75 280,115 240,75" fill="none" stroke="${WHITE}" stroke-width="1.5" />
    ${text(280, 79, '?', { anchor: 'middle', size: 16, color: PINK, weight: 700 })}
    <path d="M255,95 L180,150" stroke="${GREEN}" stroke-width="1.5" fill="none" />
    <polygon points="180,150 195,145 189,160" fill="${GREEN}" />
    <path d="M305,95 L380,150" stroke="${MUTED}" stroke-width="1.5" fill="none" />
    <polygon points="380,150 371,138 386,140" fill="${MUTED}" />
    ${text(150, 168, 'True', { color: GREEN, size: 11 })}
    ${text(385, 168, 'False', { color: MUTED, size: 11 })}
    <line x1="280" y1="20" x2="280" y2="35" stroke="${WHITE}" stroke-width="1.5" />
  `,

  // input -> box -> output, a function as a small machine.
  fn: () => `
    ${text(90, 100, 'x', { size: 14, color: PINK, anchor: 'middle' })}
    ${arrow(105, 100, 190, 100)}
    <rect x="195" y="65" width="170" height="70" rx="6" fill="none" stroke="${WHITE}" stroke-width="1.5" />
    ${text(280, 105, 'f(x)', { anchor: 'middle', size: 14 })}
    ${arrow(365, 100, 450, 100)}
    ${text(468, 100, 'result', { size: 13, color: BLUE, anchor: 'start' })}
    ${text(195, 50, 'a function is just a labeled transformation', { size: 10, color: MUTED, mono: false })}
  `,

  // one box exploding into several — unpacking / *args / **kwargs.
  unpack: () => `
    <rect x="240" y="80" width="80" height="50" rx="4" fill="none" stroke="${WHITE}" stroke-width="1.5" />
    ${text(280, 110, '(...)', { anchor: 'middle', size: 12 })}
    ${arrow(238, 95, 150, 55, PINK, true)}
    ${arrow(238, 105, 130, 105, PINK)}
    ${arrow(238, 118, 150, 155, PINK, true)}
    <rect x="70" y="35" width="70" height="34" rx="4" fill="none" stroke="${PINK}" stroke-width="1.2" />
    <rect x="60" y="88" width="70" height="34" rx="4" fill="none" stroke="${PINK}" stroke-width="1.2" />
    <rect x="70" y="140" width="70" height="34" rx="4" fill="none" stroke="${PINK}" stroke-width="1.2" />
    ${text(105, 56, 'a', { anchor: 'middle' })}${text(95, 109, 'b', { anchor: 'middle' })}${text(105, 161, 'c', { anchor: 'middle' })}
  `,

  // stacked files feeding into one — modules / imports / packaging.
  module: () => `
    <rect x="60" y="40" width="90" height="60" rx="4" fill="none" stroke="${WHITE}" stroke-width="1.2" />
    <rect x="55" y="90" width="90" height="60" rx="4" fill="none" stroke="${WHITE}" stroke-width="1.2" />
    ${text(100, 65, 'models', { anchor: 'middle', size: 10 })}
    ${text(100, 125, 'repository', { anchor: 'middle', size: 10 })}
    ${arrow(155, 90, 250, 100, BLUE)}
    ${arrow(150, 130, 250, 108, BLUE)}
    <rect x="255" y="65" width="150" height="70" rx="6" fill="none" stroke="${PINK}" stroke-width="1.5" />
    ${text(330, 90, 'import', { anchor: 'middle', size: 11, color: PINK })}
    ${text(330, 112, 'package/__init__', { anchor: 'middle', size: 9, color: MUTED })}
    ${arrow(405, 100, 470, 100, WHITE)}
  `,

  // a warning triangle caught inside a shield — errors / exceptions.
  error: () => `
    <polygon points="200,40 240,110 160,110" fill="none" stroke="${YELLOW}" stroke-width="1.5" />
    ${text(200, 100, '!', { anchor: 'middle', size: 18, color: YELLOW, weight: 700 })}
    ${arrow(245, 75, 320, 75, WHITE)}
    <path d="M400,40 L440,55 L440,100 Q440,140 400,160 Q360,140 360,100 L360,55 Z" fill="none" stroke="${GREEN}" stroke-width="1.5" />
    ${text(400, 108, 'try', { anchor: 'middle', size: 12, color: GREEN })}
    ${text(240, 25, 'raised', { size: 10, color: MUTED, mono: false })}
    ${text(365, 25, 'caught, handled', { size: 10, color: MUTED, mono: false })}
  `,

  // dashed blueprint producing solid instances — classes.
  blueprint: () => `
    <rect x="215" y="25" width="130" height="60" rx="4" fill="none" stroke="${PINK}" stroke-width="1.5" stroke-dasharray="4,3" />
    ${text(280, 60, 'class Country', { anchor: 'middle', size: 10, color: PINK })}
    ${arrow(255, 90, 150, 140, WHITE, true)}
    ${arrow(280, 90, 280, 140, WHITE)}
    ${arrow(305, 90, 410, 140, WHITE, true)}
    <rect x="105" y="145" width="90" height="40" rx="4" fill="none" stroke="${WHITE}" stroke-width="1.2" />
    <rect x="235" y="145" width="90" height="40" rx="4" fill="none" stroke="${WHITE}" stroke-width="1.2" />
    <rect x="365" y="145" width="90" height="40" rx="4" fill="none" stroke="${WHITE}" stroke-width="1.2" />
    ${text(150, 169, 'Kenya', { anchor: 'middle', size: 10 })}
    ${text(280, 169, 'Peru', { anchor: 'middle', size: 10 })}
    ${text(410, 169, 'Ghana', { anchor: 'middle', size: 10 })}
  `,

  // a refresh cycle around a changing value — state.
  state: () => `
    <path d="M340,50 A70,70 0 1 1 260,45" fill="none" stroke="${BLUE}" stroke-width="2" />
    <polygon points="260,45 278,38 270,58" fill="${BLUE}" />
    <rect x="245" y="80" width="90" height="50" rx="6" fill="none" stroke="${WHITE}" stroke-width="1.5" />
    ${text(290, 100, 'population', { anchor: 'middle', size: 9, color: MUTED })}
    ${text(290, 118, '54,000,000', { anchor: 'middle', size: 11, color: PINK })}
    ${text(290, 168, 'changes over time', { anchor: 'middle', size: 10, color: MUTED, mono: false })}
  `,

  // keyboard row -> arrow -> box, user input.
  input: () => {
    let keys = '';
    for (let i = 0; i < 5; i++) {
      keys += `<rect x="${60 + i * 26}" y="80" width="20" height="20" rx="3" fill="none" stroke="${WHITE}" stroke-width="1" />`;
    }
    return `
    ${keys}
    ${text(105, 65, 'input()', { anchor: 'middle', size: 11, color: MUTED })}
    ${arrow(200, 90, 280, 90, BLUE)}
    <rect x="285" y="60" width="130" height="60" rx="6" fill="none" stroke="${PINK}" stroke-width="1.5" />
    ${text(350, 96, 'validate', { anchor: 'middle', size: 12 })}
    ${arrow(415, 90, 480, 90, GREEN)}
    <circle cx="500" cy="90" r="14" fill="none" stroke="${GREEN}" stroke-width="1.5" />
    ${text(500, 95, '✓', { anchor: 'middle', size: 14, color: GREEN })}
  `;
  },

  // a stamped/sealed document — data contracts.
  contract: () => `
    <rect x="220" y="30" width="120" height="150" rx="4" fill="none" stroke="${WHITE}" stroke-width="1.5" />
    <line x1="235" y1="55" x2="325" y2="55" stroke="${WHITE}" stroke-width="1" opacity="0.4" />
    <line x1="235" y1="75" x2="325" y2="75" stroke="${WHITE}" stroke-width="1" opacity="0.4" />
    <line x1="235" y1="95" x2="300" y2="95" stroke="${WHITE}" stroke-width="1" opacity="0.4" />
    <circle cx="325" cy="135" r="26" fill="none" stroke="${PINK}" stroke-width="1.5" />
    ${text(325, 140, 'OK', { anchor: 'middle', size: 11, color: PINK, weight: 700 })}
    ${text(280, 18, 'name: str, region: str, population: int', { anchor: 'middle', size: 9, color: MUTED })}
  `,

  // a database cylinder — repository / data-access layer.
  database: () => `
    <ellipse cx="280" cy="55" rx="70" ry="18" fill="none" stroke="${WHITE}" stroke-width="1.5" />
    <path d="M210,55 L210,130 A70,18 0 0 0 350,130 L350,55" fill="none" stroke="${WHITE}" stroke-width="1.5" />
    <path d="M210,92 A70,18 0 0 0 350,92" fill="none" stroke="${WHITE}" stroke-width="1" opacity="0.4" />
    ${text(280, 60, 'get_all()', { anchor: 'middle', size: 10, color: MUTED })}
    ${arrow(360, 90, 430, 90, BLUE)}
    <rect x="435" y="65" width="90" height="50" rx="4" fill="none" stroke="${PINK}" stroke-width="1.5" />
    ${text(480, 95, 'Country', { anchor: 'middle', size: 10, color: PINK })}
  `,

  // curly braces inside a file — JSON.
  json: () => `
    <path d="M240,40 L225,40 Q210,40 210,55 L210,85 Q210,95 195,100 Q210,105 210,115 L210,145 Q210,160 225,160 L240,160"
      fill="none" stroke="${PINK}" stroke-width="2" />
    <path d="M320,40 L335,40 Q350,40 350,55 L350,85 Q350,95 365,100 Q350,105 350,115 L350,145 Q350,160 335,160 L320,160"
      fill="none" stroke="${PINK}" stroke-width="2" />
    ${text(280, 90, '"name":', { anchor: 'middle', size: 10 })}
    ${text(280, 112, '"Kenya"', { anchor: 'middle', size: 10, color: BLUE })}
    ${text(280, 25, 'countries.json', { anchor: 'middle', size: 10, color: MUTED })}
  `,

  // a flask/checkmark — testing.
  test: () => `
    <path d="M265,40 L265,75 L235,145 Q230,160 245,160 L335,160 Q350,160 345,145 L315,75 L315,40 Z" fill="none" stroke="${WHITE}" stroke-width="1.5" />
    <line x1="255" y1="40" x2="325" y2="40" stroke="${WHITE}" stroke-width="1.5" />
    <path d="M250,120 L330,120 L345,145 Q350,160 335,160 L245,160 Q230,160 235,145 Z" fill="${GREEN}" opacity="0.15" stroke="none" />
    <circle cx="290" cy="100" r="5" fill="${BLUE}" />
    <circle cx="270" cy="130" r="5" fill="${GREEN}" />
    <circle cx="310" cy="135" r="5" fill="${GREEN}" />
    ${text(400, 90, 'assert', { size: 13, color: PINK })}
    ${text(400, 112, 'result == expected', { size: 10, color: MUTED })}
    ${arrow(390, 100, 355, 100, MUTED)}
  `,

  // nested folder/package tree — architecture.
  package: () => `
    <rect x="90" y="40" width="60" height="40" rx="3" fill="none" stroke="${PINK}" stroke-width="1.5" />
    ${text(120, 64, 'pkg/', { anchor: 'middle', size: 10, color: PINK })}
    <line x1="120" y1="80" x2="120" y2="100" stroke="${WHITE}" stroke-width="1" />
    <line x1="120" y1="100" x2="220" y2="100" stroke="${WHITE}" stroke-width="1" />
    <line x1="120" y1="100" x2="120" y2="140" stroke="${WHITE}" stroke-width="1" />
    <line x1="120" y1="140" x2="220" y2="140" stroke="${WHITE}" stroke-width="1" />
    <rect x="225" y="82" width="110" height="34" rx="3" fill="none" stroke="${WHITE}" stroke-width="1.2" />
    ${text(280, 103, 'models.py', { anchor: 'middle', size: 10 })}
    <rect x="225" y="122" width="110" height="34" rx="3" fill="none" stroke="${WHITE}" stroke-width="1.2" />
    ${text(280, 143, 'repository.py', { anchor: 'middle', size: 10 })}
  `,

  // a chain of nested boxes passing a token through — prop drilling / composition.
  chain: () => {
    const labels = ['App', 'Nav', 'Menu', 'Explorer'];
    let boxes = '';
    labels.forEach((l, i) => {
      const x = 60 + i * 125;
      boxes += `<rect x="${x}" y="70" width="95" height="55" rx="5" fill="none" stroke="${i === labels.length - 1 ? PINK : WHITE}" stroke-width="1.5" />`;
      boxes += text(x + 47, 102, l, { anchor: 'middle', size: 11 });
      if (i < labels.length - 1) boxes += arrow(x + 95, 97, x + 125, 97, BLUE);
    });
    return `${boxes}${text(280, 150, 'a value threaded through layers that do not use it', { anchor: 'middle', size: 10, color: MUTED, mono: false })}`;
  },

  // a cloud with an arrow down — real API.
  cloud: () => `
    <path d="M180,90 a30,30 0 0 1 55,-22 a38,38 0 0 1 70,10 a26,26 0 0 1 -5,52 h-100 a24,24 0 0 1 -20,-40 z"
      fill="none" stroke="${BLUE}" stroke-width="1.5" />
    ${text(280, 78, 'GET /countries', { anchor: 'middle', size: 10, color: MUTED })}
    ${arrow(280, 132, 280, 175, PINK)}
    <rect x="235" y="60" width="0" height="0" />
    ${text(300, 195, 'response.json()', { anchor: 'middle', size: 10, color: PINK })}
  `,

  // a ribbon wrapping a box — decorators.
  decorator: () => `
    <rect x="220" y="70" width="120" height="60" rx="6" fill="none" stroke="${WHITE}" stroke-width="1.5" />
    ${text(280, 105, 'func()', { anchor: 'middle', size: 12 })}
    <path d="M195,55 Q280,20 365,55 L365,145 Q280,180 195,145 Z" fill="none" stroke="${PINK}" stroke-width="1.5" stroke-dasharray="5,3" />
    ${text(280, 30, '@decorator', { anchor: 'middle', size: 11, color: PINK })}
  `,

  // a conveyor belt yielding one item at a time — generators.
  generator: () => `
    <line x1="80" y1="120" x2="480" y2="120" stroke="${WHITE}" stroke-width="1.5" />
    <circle cx="100" cy="120" r="7" fill="none" stroke="${WHITE}" stroke-width="1.2" />
    <circle cx="130" cy="120" r="7" fill="none" stroke="${WHITE}" stroke-width="1.2" />
    <circle cx="160" cy="120" r="7" fill="${PINK}" />
    ${arrow(160, 105, 160, 60, PINK)}
    ${text(160, 45, 'yield', { anchor: 'middle', size: 12, color: PINK })}
    <circle cx="190" cy="120" r="7" fill="none" stroke="${WHITE}" stroke-width="1.2" opacity="0.3" />
    <circle cx="220" cy="120" r="7" fill="none" stroke="${WHITE}" stroke-width="1.2" opacity="0.3" />
    ${text(300, 100, 'one value at a time,', { size: 11, color: MUTED, mono: false })}
    ${text(300, 118, 'never the whole list at once', { size: 11, color: MUTED, mono: false })}
  `,

  // a door with enter/exit arrows — context managers.
  context: () => `
    <rect x="240" y="40" width="80" height="120" rx="3" fill="none" stroke="${WHITE}" stroke-width="1.5" />
    <circle cx="305" cy="100" r="3" fill="${WHITE}" />
    ${arrow(150, 60, 235, 60, GREEN)}
    ${text(155, 48, '__enter__', { size: 10, color: GREEN })}
    ${arrow(325, 140, 410, 140, PINK)}
    ${text(330, 160, '__exit__', { size: 10, color: PINK })}
    ${text(280, 20, 'with obj as x:', { anchor: 'middle', size: 11, color: MUTED })}
  `,

  // an isolated bubble inside a bigger space — virtual environments.
  venv: () => `
    <rect x="60" y="30" width="440" height="140" rx="6" fill="none" stroke="${WHITE}" stroke-width="1" stroke-dasharray="3,3" opacity="0.35" />
    ${text(80, 48, 'global Python', { size: 10, color: MUTED, mono: false })}
    <circle cx="280" cy="105" r="55" fill="none" stroke="${PINK}" stroke-width="1.5" />
    ${text(280, 100, 'env/', { anchor: 'middle', size: 12, color: PINK })}
    ${text(280, 118, 'pytest 8.3', { anchor: 'middle', size: 9, color: MUTED })}
  `,

  // a trophy/flag — capstone / final review.
  trophy: () => `
    <path d="M255,40 h50 v45 a25,25 0 0 1 -50,0 z" fill="none" stroke="${YELLOW}" stroke-width="1.5" />
    <path d="M255,50 h-20 a15,15 0 0 0 15,25" fill="none" stroke="${YELLOW}" stroke-width="1.2" />
    <path d="M305,50 h20 a15,15 0 0 1 -15,25" fill="none" stroke="${YELLOW}" stroke-width="1.2" />
    <line x1="280" y1="110" x2="280" y2="135" stroke="${YELLOW}" stroke-width="1.5" />
    <line x1="255" y1="135" x2="305" y2="135" stroke="${YELLOW}" stroke-width="1.5" />
    ${text(280, 160, 'the whole system, working together', { anchor: 'middle', size: 11, color: MUTED, mono: false })}
  `,

  // a terminal window printing a line — running code / print().
  console: () => `
    <rect x="140" y="35" width="280" height="130" rx="6" fill="none" stroke="${WHITE}" stroke-width="1.5" />
    <line x1="140" y1="60" x2="420" y2="60" stroke="${WHITE}" stroke-width="1" opacity="0.4" />
    <circle cx="158" cy="47" r="4" fill="none" stroke="${MUTED}" stroke-width="1" />
    <circle cx="172" cy="47" r="4" fill="none" stroke="${MUTED}" stroke-width="1" />
    <circle cx="186" cy="47" r="4" fill="none" stroke="${MUTED}" stroke-width="1" />
    ${text(158, 90, '>>> print("Hello, World")', { size: 11, color: WHITE })}
    ${text(158, 115, 'Hello, World', { size: 11, color: GREEN })}
    <rect x="158" y="128" width="8" height="14" fill="${PINK}" />
  `,

  // two values joined by an operator — arithmetic / comparisons.
  compare: () => `
    <rect x="90" y="70" width="90" height="55" rx="5" fill="none" stroke="${WHITE}" stroke-width="1.5" />
    ${text(135, 103, 'x', { anchor: 'middle', size: 14 })}
    <circle cx="280" cy="97" r="26" fill="none" stroke="${PINK}" stroke-width="1.5" />
    ${text(280, 103, '==', { anchor: 'middle', size: 15, color: PINK, weight: 700 })}
    <rect x="380" y="70" width="90" height="55" rx="5" fill="none" stroke="${WHITE}" stroke-width="1.5" />
    ${text(425, 103, 'y', { anchor: 'middle', size: 14 })}
    ${arrow(280, 140, 280, 172, BLUE)}
    ${text(280, 190, 'True / False', { anchor: 'middle', size: 10, color: BLUE })}
  `,

  // one shape morphing into another — type conversion.
  morph: () => `
    <rect x="90" y="75" width="100" height="50" rx="5" fill="none" stroke="${WHITE}" stroke-width="1.5" />
    ${text(140, 105, '"54"', { anchor: 'middle', size: 13, color: MUTED })}
    ${text(140, 60, 'str', { anchor: 'middle', size: 10, color: MUTED })}
    ${arrow(195, 100, 280, 100, PINK)}
    ${text(237, 88, 'int(...)', { anchor: 'middle', size: 10, color: PINK })}
    <rect x="285" y="75" width="100" height="50" rx="5" fill="none" stroke="${BLUE}" stroke-width="1.5" />
    ${text(335, 105, '54', { anchor: 'middle', size: 13, color: BLUE })}
    ${text(335, 60, 'int', { anchor: 'middle', size: 10, color: BLUE })}
  `,

  // scattered vs organized — folder organization / reuse.
  organize: () => `
    ${text(140, 30, 'before', { anchor: 'middle', size: 10, color: MUTED, mono: false })}
    <rect x="80" y="45" width="45" height="30" rx="3" fill="none" stroke="${WHITE}" stroke-width="1" transform="rotate(-6,102,60)" />
    <rect x="130" y="60" width="45" height="30" rx="3" fill="none" stroke="${WHITE}" stroke-width="1" transform="rotate(4,152,75)" />
    <rect x="90" y="90" width="45" height="30" rx="3" fill="none" stroke="${WHITE}" stroke-width="1" transform="rotate(-3,112,105)" />
    ${arrow(200, 90, 260, 90, BLUE)}
    ${text(420, 30, 'after', { anchor: 'middle', size: 10, color: PINK, mono: false })}
    <rect x="290" y="45" width="70" height="28" rx="3" fill="none" stroke="${PINK}" stroke-width="1.2" />
    ${text(325, 63, 'formatting.py', { anchor: 'middle', size: 8 })}
    <rect x="290" y="80" width="70" height="28" rx="3" fill="none" stroke="${PINK}" stroke-width="1.2" />
    ${text(325, 98, 'search.py', { anchor: 'middle', size: 8 })}
    <rect x="290" y="115" width="70" height="28" rx="3" fill="none" stroke="${PINK}" stroke-width="1.2" />
    ${text(325, 133, 'validators.py', { anchor: 'middle', size: 8 })}
  `,
};

function renderHero(hero) {
  if (!hero || !ICONS[hero.icon]) return '';
  const inner = ICONS[hero.icon]();
  return `  <div class="hero-diagram">
    <svg viewBox="0 0 560 200" width="560" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="560" height="200" rx="8" fill="#111111" />
      ${inner}
    </svg>
    ${hero.caption ? `<p class="hero-caption">${hero.caption}</p>` : ''}
  </div>
`;
}

module.exports = { renderHero, ICONS };
