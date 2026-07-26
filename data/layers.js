// Layer/track metadata for the 40-session Python Fundamentals curriculum.
// Mirrors the 7-layer structure of the source React course, mapped onto a
// single running project: a "Country Explorer" Python application.
module.exports = [
  {
    num: 1,
    name: 'Python Foundations',
    range: [1, 7],
    desc: 'Before we build anything, we must be fluent in the core data structures and control flow that every later session relies on: dictionaries, lists, functions, and error handling.',
    unlock: 'None — starting point',
  },
  {
    num: 2,
    name: 'Object-Oriented Basics',
    range: [8, 15],
    desc: 'We start modelling real things as classes. Every concept here maps to something in Layer 1 — a class is just a structured way of grouping the dictionaries and functions you already know.',
    unlock: 'Session 07 quiz ≥ 80%',
  },
  {
    num: 3,
    name: 'State & Interactivity',
    range: [16, 22],
    desc: 'State is data that changes over time. We learn to track it safely on objects, take input from a user, and compute values instead of duplicating them.',
    unlock: 'Session 15 quiz ≥ 80%',
  },
  {
    num: 4,
    name: 'Mock Data',
    range: [23, 26],
    desc: 'Real teams build against fake data before a real data source exists. We design data contracts and a data-access layer independent of where the data actually comes from.',
    unlock: 'Session 22 quiz ≥ 80%',
  },
  {
    num: 5,
    name: 'Testing',
    range: [27, 31],
    desc: 'Testing is introduced gradually alongside the code it tests, using pytest. We test behavior — what a function or class does — not implementation details.',
    unlock: 'Session 26 quiz ≥ 80%',
  },
  {
    num: 6,
    name: 'Architecture',
    range: [32, 36],
    desc: 'With the foundations in place, we learn to structure a Python project for long-term maintainability: package layout, reusable modules, and recognizing tight coupling.',
    unlock: 'Session 31 quiz ≥ 80%',
  },
  {
    num: 7,
    name: 'Real World',
    range: [37, 40],
    desc: 'Only now do we touch the filesystem and a real network API. By this point we have the vocabulary to understand exactly what changed and why it matters.',
    unlock: 'Session 36 quiz ≥ 80%',
  },
];
