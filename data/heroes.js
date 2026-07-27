// Hero visual assigned to each session — the icon key must match one of the
// motifs exported from scripts/hero-icons.js. Rendered at the very top of
// the session page, before the pre-quiz, so the concept is suggested
// graphically before any text is read.
module.exports = {
  // Layer 0 — Python Basics
  1: { icon: 'console', caption: 'A line of code, run — and a result you can see.' },
  2: { icon: 'compare', caption: 'Combining and comparing values produces a new value.' },
  3: { icon: 'branch', caption: 'A condition splits execution down one of two paths.' },
  4: { icon: 'loop', caption: 'The same action, repeated for every item — or until a condition changes.' },

  // Layer 1 — Python Foundations
  5: { icon: 'dict', caption: 'A container that groups related values under named keys.' },
  6: { icon: 'list', caption: 'An ordered, indexed sequence of values.' },
  7: { icon: 'loop', caption: 'A shorthand for "build a new list by looping over this one".' },
  8: { icon: 'fn', caption: 'Logic, named once, reusable everywhere.' },
  9: { icon: 'unpack', caption: 'One collection, split into several named pieces.' },
  10: { icon: 'module', caption: 'Code split across files, joined back together with import.' },
  11: { icon: 'error', caption: 'Something goes wrong — caught deliberately, instead of crashing.' },

  // Layer 2 — Object-Oriented Basics
  12: { icon: 'blueprint', caption: 'A blueprint for a kind of thing, and the things built from it.' },
  13: { icon: 'dict', caption: 'Every instance gets its own independent slots of data.' },
  14: { icon: 'fn', caption: 'Behavior that lives with the data it operates on.' },
  15: { icon: 'unpack', caption: 'Data flows in through the constructor, explicitly, every time.' },
  16: { icon: 'chain', caption: 'One object holding — and delegating to — several others.' },
  17: { icon: 'branch', caption: 'A method that behaves differently depending on what it finds.' },
  18: { icon: 'blueprint', caption: 'Many raw records, converted into many working objects.' },
  19: { icon: 'compare', caption: 'Same data is not the same thing — identity and equality differ.' },

  // Layer 3 — State & Interactivity
  20: { icon: 'state', caption: 'Data that is expected to change while the program runs.' },
  21: { icon: 'state', caption: 'Every change funneled through one validating checkpoint.' },
  22: { icon: 'input', caption: 'A person types something — and the program has to react safely.' },
  23: { icon: 'console', caption: 'Watching a value change, one step at a time.' },
  24: { icon: 'branch', caption: 'Raw input, checked thoroughly before it is trusted.' },
  25: { icon: 'chain', caption: 'One shared object, passed deliberately between functions.' },
  26: { icon: 'state', caption: 'A value that is always recalculated — never stored, never stale.' },

  // Layer 4 — Mock Data
  27: { icon: 'json', caption: 'Fake data, shaped exactly like the real thing will be.' },
  28: { icon: 'database', caption: 'A single, swappable gateway between the app and its data.' },
  29: { icon: 'json', caption: 'Text on disk, parsed into the data structures you already know.' },
  30: { icon: 'contract', caption: 'An agreed, enforced shape every record must honor.' },

  // Layer 5 — Testing
  31: { icon: 'test', caption: 'A check that runs itself, every time, without being asked.' },
  32: { icon: 'test', caption: 'A real tool for running and reporting on those checks.' },
  33: { icon: 'test', caption: 'Normal cases, edge cases, and the boundary in between.' },
  34: { icon: 'state', caption: 'Confirming a change actually happened — before and after.' },
  35: { icon: 'database', caption: 'Testing the data layer with fake data, never a real file or network.' },

  // Layer 6 — Architecture
  36: { icon: 'package', caption: 'One growing file, split into focused, named modules.' },
  37: { icon: 'organize', caption: 'Duplicated logic, pulled into one shared, tested place.' },
  38: { icon: 'module', caption: 'Standalone logic useful to more than one part of the app.' },
  39: { icon: 'chain', caption: 'A value threaded through layers that have nothing to do with it.' },
  40: { icon: 'contract', caption: 'Every major decision, written down with its reasoning.' },

  // Layer 7 — Real World
  41: { icon: 'json', caption: 'Guaranteed cleanup, even when something goes wrong mid-read.' },
  42: { icon: 'cloud', caption: 'Data from a real, unpredictable place outside your control.' },
  43: { icon: 'error', caption: 'Every way a network call can fail, handled on purpose.' },
  44: { icon: 'trophy', caption: 'Everything built, working together, end to end.' },

  // Layer 8 — Beyond the Fundamentals (optional)
  45: { icon: 'decorator', caption: 'A function that wraps another function and returns it changed.' },
  46: { icon: 'generator', caption: 'One value at a time, produced only when asked for.' },
  47: { icon: 'venv', caption: 'An isolated, reproducible set of dependencies, per project.' },
};
