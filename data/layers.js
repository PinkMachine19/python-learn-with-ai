// Layer/track metadata for the 47-session Python Fundamentals curriculum.
// Mirrors the layer structure of the source React course, mapped onto a
// single running project: a "Country Explorer" Python application.
// Layer 0 (true beginner basics) and Layer 8 (optional, bonus intermediate
// topics) extend the original 40-session core (Layers 1-7).
module.exports = [
  {
    num: 0,
    name: 'Python Basics',
    range: [1, 4],
    desc: 'A true starting point for anyone new to programming: running code, naming values, branching, and repeating. Every later session assumes these are second nature.',
    unlock: 'None — starting point',
  },
  {
    num: 1,
    name: 'Python Foundations',
    range: [5, 11],
    desc: 'Before we build anything, we must be fluent in the core data structures and control flow that every later session relies on: dictionaries, lists, functions, and error handling.',
    unlock: 'Session 04 quiz ≥ 80%',
  },
  {
    num: 2,
    name: 'Object-Oriented Basics',
    range: [12, 19],
    desc: 'We start modelling real things as classes. Every concept here maps to something in Layer 1 — a class is just a structured way of grouping the dictionaries and functions you already know.',
    unlock: 'Session 11 quiz ≥ 80%',
  },
  {
    num: 3,
    name: 'State & Interactivity',
    range: [20, 26],
    desc: 'State is data that changes over time. We learn to track it safely on objects, take input from a user, and compute values instead of duplicating them.',
    unlock: 'Session 19 quiz ≥ 80%',
  },
  {
    num: 4,
    name: 'Mock Data',
    range: [27, 30],
    desc: 'Real teams build against fake data before a real data source exists. We design data contracts and a data-access layer independent of where the data actually comes from.',
    unlock: 'Session 26 quiz ≥ 80%',
  },
  {
    num: 5,
    name: 'Testing',
    range: [31, 35],
    desc: 'Testing is introduced gradually alongside the code it tests, using pytest. We test behavior — what a function or class does — not implementation details.',
    unlock: 'Session 30 quiz ≥ 80%',
  },
  {
    num: 6,
    name: 'Architecture',
    range: [36, 40],
    desc: 'With the foundations in place, we learn to structure a Python project for long-term maintainability: package layout, reusable modules, and recognizing tight coupling.',
    unlock: 'Session 35 quiz ≥ 80%',
  },
  {
    num: 7,
    name: 'Real World',
    range: [41, 44],
    desc: 'Only now do we touch the filesystem and a real network API. By this point we have the vocabulary to understand exactly what changed and why it matters.',
    unlock: 'Session 40 quiz ≥ 80%',
  },
  {
    num: 8,
    name: 'Beyond the Fundamentals',
    range: [45, 47],
    desc: 'Optional, bonus sessions beyond the core curriculum: decorators, generators and context managers, and packaging/virtual environments — closing the remaining gaps to a genuinely intermediate level.',
    unlock: 'Session 44 quiz ≥ 80% (optional — Layer 7 is the core curriculum\'s natural end point)',
  },
];
