module.exports = [

// ── SESSION 21 ─────────────────────────────────────────────────────
{
  num: 25,
  title: 'Passing State Between Functions',
  nextTitle: 'Computed Properties',
  subtitle: 'When several functions need to work with the same evolving state, where should that state actually live? This session is about ownership, not just passing values around.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Pass an object between functions and confirm mutations are visible to all of them (Session 05\'s reference lesson, applied)',
    'Decide when a function should own state versus receive it from a caller',
    'Move a piece of state up to a shared "owner" when multiple functions need to coordinate around it',
    'Explain the risk of two different functions each keeping their own separate copy of what should be one shared piece of state',
    'Refactor a menu\'s local state into a small class that owns it',
  ],
  quiz: [
    {
      q: 'A function search(term) filters a CountryExplorer\'s countries and a separate function stats() reports on the SAME explorer. If both take explorer as a parameter, do they see the same countries?',
      options: { a: 'No — each function gets its own independent copy', b: 'Yes — since explorer is passed by reference (Session 05), both functions see the exact same underlying data, including any changes made by either one', c: 'Only if they are called in the same file', d: 'Only if explorer is a global variable' },
      answer: 'b',
      explain: 'Passing an object as a function argument passes the reference, not a copy (Session 05). Both functions operate on the same shared CountryExplorer, so any state change either one makes is visible to the other.',
    },
    {
      q: 'Two separate functions each maintain their own local list of "loaded countries" instead of sharing one CountryExplorer. What risk does this create?',
      options: { a: 'No risk — Python automatically keeps separate copies in sync', b: 'The two lists can drift out of sync, since a change in one is invisible to the other — they are no longer describing the same reality', c: 'This is always faster than sharing a reference', d: 'Python would raise an error preventing this from happening' },
      answer: 'b',
      explain: 'If two lists are meant to represent the same underlying data but are not literally the same object, nothing keeps them consistent — this "divided state" is a common real bug where two parts of a program disagree about what is currently true.',
    },
    {
      q: 'When should a function OWN a piece of state (create and hold it) versus RECEIVE it as a parameter from a caller?',
      options: { a: 'A function should never own state; state must always come from outside', b: 'A function should own state it exclusively manages and no one else needs to coordinate around; it should receive state as a parameter when multiple parts of the program need to share and coordinate around the same data', c: 'It does not matter, both approaches are always equivalent', d: 'Ownership is determined automatically by Python based on variable names' },
      answer: 'b',
      explain: 'This is a design decision: private, function-local state should be owned locally; shared, coordinated state (like the explorer\'s country list, used by search AND stats) should be passed in explicitly so every function operates on the same source of truth.',
    },
    {
      q: 'You refactor a menu\'s ad-hoc local variables into a small MenuState class that owns them. What is the main benefit?',
      options: { a: 'It makes the code run faster', b: 'It gives the previously scattered local state a clear owner and a name, and lets you pass ONE object between functions instead of many loose variables', c: 'It removes the need for functions entirely', d: 'It automatically adds input validation' },
      answer: 'b',
      explain: 'This mirrors Session 12\'s original motivation for classes: bundling related data (and now, shared state) under one name is easier to pass around and reason about than several independent loose variables that must always be kept in sync manually.',
    },
    {
      q: 'If a function receives an object and reassigns the LOCAL parameter name to point at a brand new object (e.g. explorer = CountryExplorer(countries=[])), does that affect the caller\'s original object?',
      options: { a: 'Yes — reassignment inside a function always affects the caller', b: 'No — reassigning what a local parameter name points to only affects that local name; the caller\'s original reference is untouched (this is different from mutating the object\'s contents)', c: 'It depends on the object\'s class', d: 'It causes a RuntimeError' },
      answer: 'b',
      explain: 'This is a subtle but important distinction: MUTATING an object through a parameter (like .append()) is visible to the caller, because both names point to the same object. But REASSIGNING the local parameter name to a different object only changes what that local name points to — the caller\'s original variable still points at the original object.',
    },
  ],
  conceptTitle: 'State Ownership Between Functions',
  sections: [
    {
      h3: 'Shared state is visible everywhere it is referenced',
      paragraphs: ['This session applies Session 05\'s reference lesson directly to whole objects passed between functions — a natural consequence of everything already learned, formalized as a design principle.'],
      code: `class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries

def search(explorer, term):
    return [c for c in explorer.countries if term.lower() in c.name.lower()]

def add_sample_data(explorer):
    explorer.countries.append(Country(name="Kenya", region="Africa", population=54000000))

explorer = CountryExplorer(countries=[])
add_sample_data(explorer)
print(search(explorer, "ken"))  # finds Kenya — both functions see the SAME explorer`,
    },
    {
      h3: 'Mutation vs reassignment — a subtle but important distinction',
      paragraphs: ['Mutating an object through a function parameter is visible to the caller. Reassigning what the local parameter name points to is NOT — the caller\'s original reference is untouched.'],
      code: `def mutate_countries(explorer):
    explorer.countries.append(Country(name="Ghana", region="Africa", population=31000000))
    # visible to the caller — same object, contents changed

def reassign_explorer(explorer):
    explorer = CountryExplorer(countries=[])
    # NOT visible to the caller — this only rebinds the LOCAL name "explorer"
    # to a brand new object; the caller's original variable is untouched

original = CountryExplorer(countries=[])
mutate_countries(original)
print(len(original.countries))    # 1

reassign_explorer(original)
print(len(original.countries))    # still 1 — the reassignment inside the function had no effect here`,
      diagram: {
        caption: 'Mutating through a parameter changes the shared object. Reassigning the local name just points that one name elsewhere.',
        boxes: [
          { label: 'mutate', text: 'same object,\ncaller sees it' },
          { label: 'reassign', text: 'local name only,\ncaller unaffected', accent: true },
        ],
      },
    },
    {
      h3: 'Deciding who owns state',
      paragraphs: ['Local, private data that only one function cares about should be owned locally. Data that multiple functions need to coordinate around should be passed in explicitly, so everyone works from the same source of truth.'],
      code: `# Risky — two functions each keep their OWN separate list, meant to represent the same thing
loaded_a = []
loaded_b = []

def load_into_a():
    loaded_a.append("Kenya")

def report_from_b():
    print(loaded_b)  # never sees "Kenya" — these are two DIFFERENT lists!

# Better — one owner, shared and passed explicitly
class Loader:
    def __init__(self):
        self.loaded = []

    def load(self, name):
        self.loaded.append(name)

    def report(self):
        print(self.loaded)  # always sees everything loaded through THIS instance`,
    },
    {
      h3: 'Bundling scattered local state into a small owning class',
      paragraphs: ['When a menu (Session 22) accumulates several loose local variables that all need to travel together between functions, wrapping them in a small class — exactly like Session 12\'s original motivation — gives them a clear, shared owner.'],
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Demonstrate mutation vs reassignment across functions, then refactor scattered menu state into one owning class passed explicitly.',
    whatYouBuild: 'A file called <code>state_passing_lab.py</code>.',
    steps: [
      { title: 'Create the file with Country and CountryExplorer', body: [], code: `# state_passing_lab.py
class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population

class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries` },
      { title: 'Write two functions that both operate on the same passed-in explorer', body: [], code: `def search(explorer, term):
    return [c for c in explorer.countries if term.lower() in c.name.lower()]

def add_sample_data(explorer):
    explorer.countries.append(Country(name="Kenya", region="Africa", population=54000000))

explorer = CountryExplorer(countries=[])
add_sample_data(explorer)
print(search(explorer, "ken"))` },
      { title: 'Demonstrate the mutation-vs-reassignment distinction explicitly', body: ['Predict the output of each print BEFORE running.'], code: `def mutate_countries(exp):
    exp.countries.append(Country(name="Ghana", region="Africa", population=31000000))

def reassign_explorer(exp):
    exp = CountryExplorer(countries=[])  # only rebinds the local name

mutate_countries(explorer)
print("After mutate:", len(explorer.countries))     # 2

reassign_explorer(explorer)
print("After reassign attempt:", len(explorer.countries))  # still 2` },
      { title: 'Write a MenuState class that owns previously-scattered local variables', body: [], code: `class MenuState:
    def __init__(self, explorer):
        self.explorer = explorer
        self.last_search_term = None
        self.action_count = 0

    def run_search(self, term):
        self.last_search_term = term
        self.action_count += 1
        return search(self.explorer, term)` },
      { title: 'Pass one MenuState object between two functions and confirm both see the same data', body: [], code: `def report(state):
    print("Last search:", state.last_search_term)
    print("Actions taken:", state.action_count)

state = MenuState(explorer)
state.run_search("gh")
report(state)  # sees the search performed by run_search, because it's the SAME state object` },
    ],
  },
  filesChanged: [
    { file: 'state_passing_lab.py', action: 'Created', why: 'Demonstrates shared reference passing, mutation vs reassignment, and a MenuState owner class.' },
    { file: 'docs/sessions/session-25/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add state_passing_lab.py docs/sessions/session-25/index.html\ngit commit -m "session-25: pass shared state explicitly between functions via one owning object"',
  commitQuestion: 'Why did reassign_explorer have no visible effect on explorer.countries, while mutate_countries did?',
  checklist: [
    'search() and add_sample_data() both operate on the same passed-in explorer instance',
    'The mutation-vs-reassignment distinction is demonstrated with a predicted-then-confirmed output',
    'MenuState bundles previously scattered variables (explorer, last_search_term, action_count) under one owner',
    'Two functions share one MenuState instance and both observe the same updated data',
    'No global variables are used to share state between functions',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Before running the lab, did you correctly predict that reassign_explorer would have no effect on the caller\'s explorer? What was your reasoning?',
    'Can you think of a case in the earlier labs where you accidentally relied on (or were confused by) this exact mutation-vs-reassignment distinction?',
    'Why does bundling loose local variables into MenuState make it easier to eventually add a THIRD function that also needs last_search_term?',
    'How does this session\'s "one owner, passed explicitly" principle compare to Session 20\'s warning about uncontrolled shared mutation? Are they in tension, or do they work together?',
  ],
  whatBreaks: [
    { title: 'Silently divided state', text: 'If two parts of a program each keep their own copy of what should be one shared truth, they will eventually disagree — one shows stale data while the other has the update, and there is no way to tell which one is "correct" without deep debugging.' },
    { title: 'Computed properties (Session 26)', text: 'The next session (the Layer 3 gate) asks: should a value be stored as state, or computed fresh each time from other state? Understanding who owns data and how it flows is required before that question makes sense.' },
    { title: 'Sharing data with a repository (Layer 4)', text: 'Session 28 introduces a CountryRepository that many different parts of the application share explicitly, exactly the pattern this session establishes.' },
  ],
  learnedConcept: 'State ownership between functions — reference sharing, the mutation vs reassignment distinction, and bundling scattered local state into one owning object.',
  learnedUnlocks: 'You can now design who owns a given piece of state and pass it deliberately, instead of accidentally creating divided, out-of-sync copies.',
  nextTeaser: 'Layer 3 gate. We ask whether a value should be stored as state at all, or computed on demand from other state.',
},

// ── SESSION 22 ─────────────────────────────────────────────────────
{
  num: 26,
  title: 'Computed Properties',
  nextTitle: 'Why Mock Data Matters',
  subtitle: 'This is the Layer 3 gate. Some values should never be stored as their own piece of state — they should be computed fresh, every time, from state that already exists.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Identify a value that is redundant because it can always be derived from existing state',
    'Implement a computed value as a regular method',
    'Use the @property decorator to expose a computed value with attribute-style access',
    'Explain the bug risk of storing a derived value separately instead of computing it',
    'Decide, for a given value, whether it belongs as real state or as a computed property',
  ],
  quiz: [
    {
      q: 'A CountryExplorer stores both self.countries and a separately maintained self.country_count, updated by hand every time countries changes. What is the risk?',
      options: { a: 'There is no risk — this is a common and recommended pattern', b: 'country_count can drift out of sync with the real length of countries if any code path adds/removes an item without also remembering to update the count', c: 'Python automatically keeps the two in sync', d: 'This pattern is faster than computing len(countries) on demand' },
      answer: 'b',
      explain: 'Any derived value stored separately from its source is a duplication risk — the moment one code path updates <code>countries</code> but forgets to also update <code>country_count</code>, the two disagree, and nothing warns you.',
    },
    {
      q: 'What is the fix for the country_count problem above, using what we already know about methods?',
      options: { a: 'Add more code paths that carefully update country_count everywhere', b: 'Delete country_count entirely and compute it on demand with a method, e.g. def country_count(self): return len(self.countries)', c: 'Make country_count a global variable instead', d: 'There is no fix — this tradeoff is unavoidable' },
      answer: 'b',
      explain: 'A computed method has no way to drift out of sync, because it recalculates the true answer from the actual source of truth (self.countries) every single time it is called — there is nothing to forget to update.',
    },
    {
      q: 'What does the @property decorator change about calling a method like def total_population(self): return sum(c.population for c in self.countries)?',
      options: { a: 'Nothing observable — it is purely cosmetic', b: 'It lets callers access it as explorer.total_population (no parentheses), like an attribute, instead of explorer.total_population()', c: 'It makes the value cacheable permanently', d: 'It turns the method into a classmethod' },
      answer: 'b',
      explain: '<code>@property</code> lets a method be READ using attribute syntax, without parentheses — useful when a computed value conceptually feels like a property of the object (like .total_population) rather than an action being performed.',
    },
    {
      q: 'Should country_count be given a setter, e.g. explorer.country_count = 5, allowing it to be assigned directly?',
      options: { a: 'Yes, this should always be allowed for flexibility', b: 'No — since it is derived entirely from self.countries, allowing a direct assignment would create exactly the drift risk this session is trying to eliminate', c: 'It does not matter either way', d: 'Python requires every property to have a setter' },
      answer: 'b',
      explain: 'A computed property\'s entire value is deriving safety from ALWAYS being recalculated from the real source of truth. Allowing it to be set directly would reintroduce the same "stored copy that can drift" problem this session solves.',
    },
    {
      q: 'Which value is a better candidate to be stored as real state versus computed on demand: self.population (set by construction, changed by grow_population) or self.country_count (always equal to len(self.countries))?',
      options: { a: 'Both should be stored state', b: 'population is legitimate stored state (it is the actual source of truth, not derived from anything else); country_count should be computed, since it is entirely derivable from countries', c: 'Both should be computed properties', d: 'There is no meaningful distinction between the two' },
      answer: 'b',
      explain: 'The test is: can this value be recalculated purely from other state that already exists? population cannot — it IS the source of truth. country_count can — it is 100% derivable from len(self.countries), making it a computed property, not independent state.',
    },
  ],
  conceptTitle: 'Computed Properties',
  sections: [
    {
      h3: 'The redundant-state problem',
      paragraphs: ['Storing a value that can always be recalculated from other state creates a duplication risk: the two copies can drift out of sync the moment one is updated without the other.'],
      code: `class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries
        self.country_count = len(countries)  # RISKY — a separate, stored copy

    def add_country(self, country):
        self.countries.append(country)
        # Forgot to update self.country_count here!
        # Now it silently disagrees with the real length.

explorer = CountryExplorer(countries=[])
explorer.add_country(Country(name="Kenya", region="Africa", population=54000000))
print(explorer.country_count)      # 0 — WRONG, still the stale initial value
print(len(explorer.countries))     # 1 — the actual truth`,
    },
    {
      h3: 'The fix — compute it, don\'t store it',
      paragraphs: ['A method that recalculates the value from the real source of truth every time it is called has nothing to forget to update — it is always correct by construction.'],
      code: `class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries  # the ONLY source of truth

    def country_count(self):
        return len(self.countries)  # always recalculated fresh, cannot drift

    def add_country(self, country):
        self.countries.append(country)

explorer = CountryExplorer(countries=[])
explorer.add_country(Country(name="Kenya", region="Africa", population=54000000))
print(explorer.country_count())  # 1 — always correct, nothing to forget`,
      diagram: {
        caption: 'Stored derived state can silently go stale. A computed method always re-derives the true answer from the real source.',
        boxes: [
          { label: 'stored copy', text: 'can drift out\nof sync' },
          { label: 'computed', text: 'always correct,\nrecalculated fresh', accent: true },
        ],
      },
    },
    {
      h3: '@property — attribute-style access for a computed value',
      paragraphs: ['When a computed value conceptually feels like a property of the object rather than an action, @property lets callers read it without parentheses, exactly like a stored attribute — while still guaranteeing it is always freshly derived.'],
      code: `class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries

    @property
    def country_count(self):
        return len(self.countries)

    @property
    def total_population(self):
        return sum(c.population for c in self.countries)

explorer = CountryExplorer(countries=[
    Country(name="Kenya", region="Africa", population=54000000),
    Country(name="Peru", region="Americas", population=33000000),
])
print(explorer.country_count)      # 2 — no parentheses, reads like an attribute
print(explorer.total_population)   # 87000000 — freshly computed every access`,
    },
    {
      h3: 'When NOT to use a computed property',
      paragraphs: ['A value that is genuinely independent — not derivable from other state — belongs as real, stored state. population itself cannot be computed from anything else; it IS the source of truth, changed only through the controlled methods from Session 21.'],
    },
  ],
  callout: {
    title: 'Layer 3 gate:',
    text: 'This is the last Layer 3 session. Deciding what is real state versus what should be computed on demand is a judgment call every remaining session assumes you can make correctly.',
  },
  closing: null,
  lab: {
    objective: 'Identify and eliminate redundant stored state in CountryExplorer by converting it to @property-based computed values.',
    whatYouBuild: 'A file called <code>computed_lab.py</code>.',
    steps: [
      { title: 'Create the file with the RISKY version that has stored, driftable derived state', body: [], code: `# computed_lab.py
class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population


class RiskyExplorer:
    def __init__(self, countries):
        self.countries = countries
        self.country_count = len(countries)   # stored, can drift
        self.total_population = sum(c.population for c in countries)  # stored, can drift

    def add_country(self, country):
        self.countries.append(country)
        # deliberately NOT updating country_count or total_population` },
      { title: 'Prove the drift bug happens', body: [], code: `risky = RiskyExplorer(countries=[Country(name="Kenya", region="Africa", population=54000000)])
risky.add_country(Country(name="Peru", region="Americas", population=33000000))
print("Stored count (WRONG):", risky.country_count)          # still 1
print("Real count:", len(risky.countries))                    # 2
print("Stored population (WRONG):", risky.total_population)   # still 54000000` },
      { title: 'Build the fixed version using @property', body: [], code: `class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries

    def add_country(self, country):
        self.countries.append(country)

    @property
    def country_count(self):
        return len(self.countries)

    @property
    def total_population(self):
        return sum(c.population for c in self.countries)` },
      { title: 'Prove the fixed version can never drift', body: [], code: `explorer = CountryExplorer(countries=[Country(name="Kenya", region="Africa", population=54000000)])
explorer.add_country(Country(name="Peru", region="Americas", population=33000000))
print("Computed count:", explorer.country_count)          # 2 — correct
print("Computed population:", explorer.total_population)  # 87000000 — correct` },
      { title: 'Write a one-sentence comment for each attribute in CountryExplorer classifying it as STATE or COMPUTED', body: ['Connect this back to Session 20\'s STATE/FIXED annotation exercise.'] },
    ],
  },
  filesChanged: [
    { file: 'computed_lab.py', action: 'Created', why: 'Contrasts stored, driftable derived state with correct @property-based computed values.' },
    { file: 'docs/sessions/session-26/index.html', action: 'Created', why: 'This session document — Layer 3 gate.' },
  ],
  commitCmd: 'git add computed_lab.py docs/sessions/session-26/index.html\ngit commit -m "session-26: replace stored derived state with @property computed values"',
  commitQuestion: 'Why can country_count as a @property never drift out of sync, while the stored version could?',
  checklist: [
    'RiskyExplorer demonstrates the drift bug concretely, with printed WRONG values',
    'CountryExplorer replaces both derived values with @property methods',
    'The fixed version is proven correct after add_country() is called, with printed correct values',
    'Every attribute is annotated as STATE (genuine, independent) or COMPUTED (derivable) with reasoning',
    'No computed property has a corresponding setter that would allow it to be assigned directly',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Can you think of a value from an earlier session (Sessions 1–21) that was accidentally stored as separate state when it could have been computed instead?',
    'Why does @property choose to hide the fact that a value is being recalculated every single access, rather than making that obvious with parentheses?',
    'Is population itself ever a good candidate to become a computed property? Why or why not, given what you know about its source of truth?',
    'What is the performance tradeoff of computing a value fresh every access instead of caching it — when might that tradeoff actually matter?',
  ],
  whatBreaks: [
    { title: 'The classic "shows the wrong total" bug', text: 'Nearly every "the displayed total doesn\'t match the actual list" bug in real software comes from exactly this pattern: a stored derived value that one code path forgot to update. This session directly immunizes you against it.' },
    { title: 'The mock data layer (Layer 4)', text: 'Session 28\'s CountryRepository will expose several computed values (counts, filtered subsets) — built entirely on the @property pattern from this session.' },
    { title: 'Testing derived values (Layer 5)', text: 'Tests that assert on a count or a total (Session 33) are far simpler to write correctly against a computed property, since there is no separate "did you remember to update the stored copy" step to also test.' },
  ],
  learnedConcept: 'Computed properties — eliminating redundant stored state by deriving values on demand with @property, guaranteeing they can never drift out of sync.',
  learnedUnlocks: 'You can now correctly judge whether a value is genuine state or a derived computation — the last Layer 3 skill before we start working with real (mock) data sources.',
  nextTeaser: 'Layer 4 begins. We build against fake data before any real data source exists — exactly like real engineering teams do.',
},

// ── SESSION 23 ─────────────────────────────────────────────────────
{
  num: 27,
  title: 'Why Mock Data Matters',
  nextTitle: 'Building a Data Access Layer',
  subtitle: 'Layer 4 begins. Real teams build and test an application\'s logic long before a real data source is ready. We formalize working against fake data on purpose.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Explain why building against mock data before a real API exists speeds up development',
    'Write a mock data file that mirrors the shape a future real data source will have',
    'Explain what a "contract" means in the context of data shape',
    'Recognise this as a largely concept session, similar to Sessions 08 and 16',
    'Identify the risk of a mock data shape silently diverging from the real data shape it is meant to mirror',
  ],
  quiz: [
    {
      q: 'Why would a team build the Country Explorer\'s search feature against a hand-written mock_countries.py file instead of waiting for a real API to be ready?',
      options: { a: 'Mock data is always more accurate than real data', b: 'It lets development and testing of the application logic proceed independently of an external dependency that might be slow, unavailable, or still being built', c: 'Real APIs cannot be used during development for legal reasons', d: 'There is no real benefit; it is just tradition' },
      answer: 'b',
      explain: 'Depending on an external, possibly-unfinished, possibly-unreliable data source blocks all progress on everything else. Mock data lets the rest of the application be built, used, and tested completely independently.',
    },
    {
      q: 'What does it mean for mock data to "mirror the shape" of a future real data source?',
      options: { a: 'The mock data must contain the exact same values as the real data will', b: 'The mock data uses the same keys, types, and structure the real data is expected to have, even though the specific values are made up', c: 'Shape does not matter, only the total count of records matters', d: 'Mock data should always be empty' },
      answer: 'b',
      explain: 'If real data will have <code>name</code>, <code>region</code>, and <code>population</code> keys with string/string/int types, the mock data should use exactly the same keys and types — even though "Kenya" and 54000000 are made-up placeholder values, not scraped from a real source.',
    },
    {
      q: 'What is a "contract" in the sense used by this session?',
      options: { a: 'A legal document required before writing any code', b: 'An agreed-upon shape/structure that data is expected to have, so that code written against mock data continues working once real data (matching that same shape) replaces it', c: 'A Python built-in type', d: 'A synonym for "constructor"' },
      answer: 'b',
      explain: 'A data contract is the agreed structure — which keys exist, what types they hold — that all code can rely on. As long as real data honors the same contract as the mock data, code built against the mock keeps working without changes.',
    },
    {
      q: 'What risk exists if the mock data\'s shape silently diverges from what the real data source will actually provide (e.g. mock uses "pop", but the real API returns "population")?',
      options: { a: 'No risk — Python automatically reconciles differing key names', b: 'All the code built and tested against the mock data will break the moment it is pointed at real data, since the contract was not actually honored', c: 'This divergence is impossible in Python', d: 'It only matters for numeric fields' },
      answer: 'b',
      explain: 'Mock data is only useful if it honestly represents the shape real data will have. If they diverge, all the work done "safely" against the mock turns out to be built on a false assumption, and breaks the moment real data is introduced.',
    },
    {
      q: 'Why is this session mostly concept, with a comparatively small lab?',
      options: { a: 'Because mock data has no real syntax of its own', b: 'Because — like Sessions 08 and 16 — the important part is understanding WHY this practice exists before building the concrete data-access layer around it in Session 28', c: 'Because this topic is not actually important', d: 'Because writing mock data always requires an external library' },
      answer: 'b',
      explain: 'This follows the same pattern established twice before in the curriculum: build the mental model first (why does this practice exist, what problem does it solve), then build the concrete implementation in the following session.',
    },
  ],
  conceptTitle: 'Why Mock Data Matters',
  sections: [
    {
      h3: 'Building against fake data on purpose',
      paragraphs: ['Every session so far has technically used mock data — hand-typed Country instances. This session makes that a deliberate practice: build and test your application\'s real logic against a fake data source that mirrors what a real one will eventually look like.'],
      code: `# mock_countries.py — deliberately fake, but shaped like the real thing will be
MOCK_COUNTRIES = [
    {"name": "Kenya", "region": "Africa", "population": 54000000},
    {"name": "Ghana", "region": "Africa", "population": 31000000},
    {"name": "Peru", "region": "Americas", "population": 33000000},
    {"name": "Japan", "region": "Asia", "population": 125000000},
    {"name": "Norway", "region": "Europe", "population": 5400000},
]`,
    },
    {
      h3: 'A contract is a shape everyone agrees to honor',
      paragraphs: [
        'The "contract" is simply: every country record has a name (str), a region (str), and a population (int). As long as both the mock data and a future real API honor this same contract, code written against one will keep working against the other.',
      ],
      diagram: {
        caption: 'Application code depends on the SHAPE (the contract), not on whether the data source is mock or real.',
        boxes: [
          { label: 'mock data', text: 'same shape' },
          { label: 'contract', text: 'name, region,\npopulation', accent: true },
          { label: 'real API (later)', text: 'same shape' },
        ],
      },
    },
    {
      h3: 'The independence this buys us',
      paragraphs: [
        'With a mock data source in place, every remaining feature — search, filtering, the whole CountryExplorer built in Layer 2 and 3 — can be developed and fully exercised without a real API existing yet, or even being reachable over the network at all.',
      ],
      code: `from mock_countries import MOCK_COUNTRIES

countries = [Country.from_dict(r) for r in MOCK_COUNTRIES]
explorer = CountryExplorer(countries=countries)
print(explorer.total_population)   # works completely offline, no network needed`,
    },
    {
      h3: 'The risk: silent divergence from the real shape',
      paragraphs: [
        'Mock data is only useful if it honestly represents what real data will look like. If the mock and the eventual real source disagree on key names or types, everything built "safely" against the mock will break the moment real data arrives — an important risk to keep in mind as we build Session 30\'s formal data contracts.',
      ],
    },
  ],
  callout: {
    title: 'Concept session:',
    text: 'Like Sessions 08 and 16, the goal here is understanding the practice before building the concrete implementation in Session 28.',
  },
  closing: null,
  lab: {
    objective: 'Write a mock country dataset with 10 records mirroring the eventual real API shape, and build the full explorer entirely offline from it.',
    whatYouBuild: 'A file called <code>mock_countries.py</code> and a small script that uses it.',
    steps: [
      { title: 'Create mock_countries.py with 10 diverse records', body: ['Use a variety of regions and population sizes — this will matter for later filtering exercises.'], code: `# mock_countries.py
MOCK_COUNTRIES = [
    {"name": "Kenya", "region": "Africa", "population": 54000000},
    {"name": "Ghana", "region": "Africa", "population": 31000000},
    {"name": "Nigeria", "region": "Africa", "population": 223000000},
    {"name": "Peru", "region": "Americas", "population": 33000000},
    {"name": "Canada", "region": "Americas", "population": 38000000},
    {"name": "Brazil", "region": "Americas", "population": 216000000},
    {"name": "Japan", "region": "Asia", "population": 125000000},
    {"name": "India", "region": "Asia", "population": 1428000000},
    {"name": "Norway", "region": "Europe", "population": 5400000},
    {"name": "Germany", "region": "Europe", "population": 84000000},
]` },
      { title: 'Create explore_offline.py that imports the mock and builds Country instances', body: [], code: `# explore_offline.py
from mock_countries import MOCK_COUNTRIES

class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population

    def summary(self):
        return f"{self.name} ({self.region}): pop. {self.population:,}"

    @classmethod
    def from_dict(cls, data):
        return cls(**data)

countries = [Country.from_dict(r) for r in MOCK_COUNTRIES]
print(len(countries))` },
      { title: 'Build a CountryExplorer entirely offline, with total_population and country_count as @property', body: [], code: `class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries

    @property
    def country_count(self):
        return len(self.countries)

    @property
    def total_population(self):
        return sum(c.population for c in self.countries)

explorer = CountryExplorer(countries=countries)
print(explorer.country_count)
print(explorer.total_population)` },
      { title: 'Print every summary, proving the whole application works with zero network access', body: [], code: `for c in explorer.countries:
    print(c.summary())` },
      { title: 'Write a comment describing the contract: what keys and types every record must have', body: ['This will become Session 30\'s formal data contract — write it in plain English for now.'] },
    ],
  },
  filesChanged: [
    { file: 'mock_countries.py', action: 'Created', why: 'A mock dataset of 10 countries mirroring the eventual real API shape.' },
    { file: 'explore_offline.py', action: 'Created', why: 'Builds the full explorer entirely from mock data, no network needed.' },
    { file: 'docs/sessions/session-27/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add mock_countries.py explore_offline.py docs/sessions/session-27/index.html\ngit commit -m "session-27: build a mock dataset and run the explorer entirely offline"',
  commitQuestion: 'What is the "contract" mock_countries.py is honoring, and why does that matter for a future real data source?',
  checklist: [
    'mock_countries.py contains at least 10 records with varied regions and populations',
    'Every record uses consistent keys (name, region, population) with consistent types',
    'explore_offline.py builds Country instances and a CountryExplorer entirely from the mock data',
    'total_population and country_count are computed and printed correctly',
    'A written comment describes the data contract in plain English',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'What would break in explore_offline.py if one mock record used "pop" instead of "population" as a key? Where exactly would the failure occur?',
    'Why is it valuable that explore_offline.py runs with literally zero network access?',
    'Can you think of a real project (not this one) where you have seen or could imagine mock data being useful before a backend was ready?',
    'What is the cost of maintaining mock data as the "real" contract evolves over time? How would you keep them in sync?',
  ],
  whatBreaks: [
    { title: 'Blocked development', text: 'Without mock data, building and testing the Country Explorer\'s logic would be blocked on a real, possibly unfinished or unreliable API being available — an unnecessary dependency for logic that has nothing to do with networking.' },
    { title: 'The data access layer (Session 28)', text: 'The next session wraps this mock data behind a proper repository interface — the mock dataset from this session becomes the first "backend" that repository talks to.' },
    { title: 'Data contracts (Session 30)', text: 'The plain-English contract description written in this lab becomes the formal, enforced contract in Session 30, using type hints and dataclasses.' },
  ],
  learnedConcept: 'Deliberately building and testing against mock data that mirrors a real data source\'s shape, and the concept of a data contract.',
  learnedUnlocks: 'The entire application can now be developed and demonstrated completely independent of any real, external data source.',
  nextTeaser: 'We wrap this mock data behind a proper data-access layer, separating "how data is fetched" from "what the application does with it."',
},

// ── SESSION 24 ─────────────────────────────────────────────────────
{
  num: 28,
  title: 'Building a Data Access Layer',
  nextTitle: 'Working with JSON Files',
  subtitle: 'Application logic should not know or care where its data comes from. We build a CountryRepository that hides that detail behind a clean, swappable interface.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Build a repository class that wraps a data source behind a small set of methods',
    'Explain the separation of concerns between "fetching/storing data" and "using data"',
    'Swap a repository\'s underlying data source without changing any code that calls it',
    'Explain why this separation makes the application easier to test later (Layer 5 preview)',
    'Distinguish a repository\'s methods from CountryExplorer\'s methods from Session 16',
  ],
  quiz: [
    {
      q: 'A CountryRepository class wraps MOCK_COUNTRIES and exposes get_all() and find_by_region(region). Why not just let every part of the application import MOCK_COUNTRIES directly?',
      options: { a: 'There is no difference — direct import is equally good', b: 'Wrapping it behind a repository means the rest of the application depends only on the repository\'s interface, not on where or how the data is actually stored — that detail can change freely later', c: 'Python does not allow importing the same variable in two places', d: 'MOCK_COUNTRIES cannot be imported more than once' },
      answer: 'b',
      explain: 'This is separation of concerns: the repository owns the detail of HOW data is fetched (a mock list today, a JSON file or real API tomorrow); everything else only needs to know WHAT methods the repository offers, not how they work internally.',
    },
    {
      q: 'If CountryRepository.get_all() currently reads from MOCK_COUNTRIES, and later you change it to read from a JSON file instead, what code outside the repository needs to change?',
      options: { a: 'Every place in the application that calls repository.get_all()', b: 'Nothing outside CountryRepository itself — callers only depend on the method\'s existence and its return shape, not its internal implementation', c: 'All the Country and CountryExplorer classes', d: 'The whole application must be rewritten' },
      answer: 'b',
      explain: 'This is the entire point of the abstraction: as long as get_all() keeps returning the same shape of data, its INTERNAL implementation can change freely (mock list, JSON file, real API) without touching a single line of code anywhere else.',
    },
    {
      q: 'What is the difference between CountryRepository (this session) and CountryExplorer (Session 16)?',
      options: { a: 'They are the same thing with different names', b: 'CountryRepository\'s job is fetching/providing raw data; CountryExplorer\'s job is holding and operating on a working set of Country objects for the application to use — different responsibilities', c: 'CountryRepository is only used for testing', d: 'CountryExplorer must always be built from a CountryRepository' },
      answer: 'b',
      explain: 'These are two different responsibilities: the repository knows how to get data; the explorer knows how to work with a set of already-fetched Country instances. Keeping them separate (rather than one giant class doing both) is exactly the kind of focused-class discipline from Session 16.',
    },
    {
      q: 'Why does this separation make future testing (Layer 5) easier?',
      options: { a: 'It has no effect on testing', b: 'A test can construct a repository around a small, controlled fake dataset instead of a real (or even the standard mock) data source, testing application logic in complete isolation', c: 'Testing requires deleting the repository entirely', d: 'Repositories automatically generate their own tests' },
      answer: 'b',
      explain: 'Because the repository is a clean, swappable interface, a test can construct one around exactly the tiny, controlled dataset it needs for that specific test — this is precisely what Session 35 (testing the data layer) will do.',
    },
    {
      q: 'Which method belongs on CountryRepository rather than CountryExplorer, given the separation of concerns described in this session?',
      options: { a: 'total_population — a computed property over a working set of countries', b: 'get_all() — fetching the full raw list of country records from wherever they are stored', c: 'add_country() — mutating a working, in-memory collection', d: 'summaries() — formatting each country for display' },
      answer: 'b',
      explain: 'get_all() is about FETCHING data from its source — the repository\'s job. The others are about operating on an already-fetched, in-memory working set — the explorer\'s job, as established in Session 16 and 22.',
    },
  ],
  conceptTitle: 'A Data Access Layer',
  sections: [
    {
      h3: 'Wrapping a data source behind an interface',
      paragraphs: ['A repository is a small class whose only job is providing access to data — hiding exactly where and how that data is stored behind a clean set of methods.'],
      code: `from mock_countries import MOCK_COUNTRIES

class CountryRepository:
    def __init__(self, raw_data):
        self._raw_data = raw_data

    def get_all(self):
        return [Country.from_dict(r) for r in self._raw_data]

    def find_by_region(self, region):
        return [Country.from_dict(r) for r in self._raw_data if r["region"] == region]

repo = CountryRepository(raw_data=MOCK_COUNTRIES)
all_countries = repo.get_all()
print(len(all_countries))`,
      diagram: {
        caption: 'Application code depends only on the repository\'s methods — never directly on where the data actually lives.',
        boxes: [
          { label: 'application code', text: 'repo.get_all()' },
          { label: 'CountryRepository', text: 'hides the source', accent: true },
          { label: 'source (swappable)', text: 'mock, JSON,\nreal API...' },
        ],
      },
    },
    {
      h3: 'Swapping the source without touching callers',
      paragraphs: ['As long as get_all() keeps returning the same shape (a list of Country instances), the repository\'s internals can change completely, and nothing that calls repo.get_all() needs to know or care.'],
      code: `class CountryRepository:
    def __init__(self, raw_data):
        self._raw_data = raw_data

    def get_all(self):
        return [Country.from_dict(r) for r in self._raw_data]

# Today: built around mock data
repo = CountryRepository(raw_data=MOCK_COUNTRIES)

# Later (Session 29/42): built around a completely different source —
# but repo.get_all() everywhere else in the app doesn't change at all
# repo = CountryRepository(raw_data=load_from_json_file("countries.json"))
# repo = CountryRepository(raw_data=fetch_from_real_api())`,
    },
    {
      h3: 'Repository vs Explorer — two different responsibilities',
      paragraphs: ['CountryRepository fetches raw data and hands back Country instances. CountryExplorer (Session 16) takes an already-fetched working set and offers operations over it. Keeping these responsibilities separate mirrors Session 16\'s "small, focused classes" principle.'],
      code: `repo = CountryRepository(raw_data=MOCK_COUNTRIES)
explorer = CountryExplorer(countries=repo.get_all())  # repository FETCHES, explorer OPERATES

print(explorer.total_population)         # explorer's job
print(repo.find_by_region("Africa"))     # repository's job — a different kind of query`,
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Build a CountryRepository wrapping the mock data from Session 27, and connect it to a CountryExplorer built entirely through the repository\'s interface.',
    whatYouBuild: 'A file called <code>repository_lab.py</code>.',
    steps: [
      { title: 'Create the file with Country and the mock import', body: [], code: `# repository_lab.py
from mock_countries import MOCK_COUNTRIES

class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population

    def summary(self):
        return f"{self.name} ({self.region}): pop. {self.population:,}"

    @classmethod
    def from_dict(cls, data):
        return cls(**data)` },
      { title: 'Build CountryRepository with get_all() and find_by_region()', body: [], code: `class CountryRepository:
    def __init__(self, raw_data):
        self._raw_data = raw_data

    def get_all(self):
        return [Country.from_dict(r) for r in self._raw_data]

    def find_by_region(self, region):
        return [Country.from_dict(r) for r in self._raw_data if r["region"] == region]

repo = CountryRepository(raw_data=MOCK_COUNTRIES)
print(len(repo.get_all()))
print([c.name for c in repo.find_by_region("Africa")])` },
      { title: 'Build CountryExplorer and construct it FROM the repository', body: [], code: `class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries

    @property
    def total_population(self):
        return sum(c.population for c in self.countries)

explorer = CountryExplorer(countries=repo.get_all())
print(explorer.total_population)` },
      { title: 'Prove the repository can be swapped without touching CountryExplorer', body: ['Build a second, smaller repository from a hand-typed list and construct a second explorer from it — CountryExplorer\'s code never changes.'], code: `tiny_data = [{"name": "Fiji", "region": "Oceania", "population": 900000}]
tiny_repo = CountryRepository(raw_data=tiny_data)
tiny_explorer = CountryExplorer(countries=tiny_repo.get_all())
print(tiny_explorer.total_population)  # 900000 — same CountryExplorer class, different source` },
      { title: 'Write a comment identifying which methods belong to the repository vs the explorer, and why', body: [] },
    ],
  },
  filesChanged: [
    { file: 'repository_lab.py', action: 'Created', why: 'A CountryRepository wrapping mock data, connected to a CountryExplorer.' },
    { file: 'docs/sessions/session-28/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add repository_lab.py docs/sessions/session-28/index.html\ngit commit -m "session-28: build a CountryRepository data-access layer around the mock data"',
  commitQuestion: 'Why did CountryExplorer not need any changes when I swapped in a completely different repository?',
  checklist: [
    'CountryRepository exposes get_all() and find_by_region(), both returning Country instances',
    'CountryExplorer is constructed by calling repo.get_all(), never by importing MOCK_COUNTRIES directly',
    'A second, differently-sourced repository is built and shown to work with the same, unmodified CountryExplorer class',
    'A written comment correctly separates repository responsibilities from explorer responsibilities',
    'No code outside CountryRepository reads self._raw_data directly',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Why does CountryExplorer never import mock_countries directly? What would be lost if it did?',
    'What would you need to change in CountryRepository (and ONLY in CountryRepository) to eventually read from a real file on disk instead of an in-memory list?',
    'How does this repository pattern relate to the "contract" concept introduced in Session 27?',
    'Can you think of a method that seems ambiguous — could reasonably belong to either the repository or the explorer? How would you decide?',
  ],
  whatBreaks: [
    { title: 'Data-source lock-in', text: 'Without this separation, every part of the application that needs country data would import MOCK_COUNTRIES directly — meaning switching to a real API later would require hunting down and rewriting every single one of those import sites instead of changing one class.' },
    { title: 'Working with real files (Session 29)', text: 'The next session teaches reading actual JSON files from disk — that new data source slots directly into CountryRepository\'s constructor, exactly because of the separation built this session.' },
    { title: 'Testing in isolation (Layer 5)', text: 'Session 35 tests the data layer by building a CountryRepository around a small, controlled fake dataset — only possible because the repository\'s constructor accepts any data source, a direct consequence of this session\'s design.' },
  ],
  learnedConcept: 'A data-access layer (repository) that hides the true source of data behind a stable interface, cleanly separated from the application logic that uses it.',
  learnedUnlocks: 'The application\'s data source can now change completely — mock, file, real API — without touching any of the code that consumes it.',
  nextTeaser: 'We give the repository a genuinely different, real source to read from: an actual JSON file on disk.',
},

// ── SESSION 25 ─────────────────────────────────────────────────────
{
  num: 29,
  title: 'Working with JSON Files',
  nextTitle: 'Designing Data Contracts',
  subtitle: 'We give the repository its first genuinely external data source: a real JSON file on disk, read and parsed with Python\'s standard library.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Write Python data to a JSON file with the json module',
    'Read and parse a JSON file back into Python data structures',
    'Handle a missing or malformed JSON file gracefully, reusing Session 11\'s error handling',
    'Point CountryRepository at a JSON file instead of the in-memory mock list',
    'Explain the relationship between JSON types and Python types',
  ],
  quiz: [
    {
      q: 'What does <code>json.dump(MOCK_COUNTRIES, f)</code> do, given an open file f?',
      options: { a: 'Reads JSON data from the file into MOCK_COUNTRIES', b: 'Writes MOCK_COUNTRIES to the file as JSON text', c: 'Deletes the file', d: 'Validates that MOCK_COUNTRIES is correctly formatted JSON' },
      answer: 'b',
      explain: '<code>json.dump(data, file)</code> serializes a Python data structure (here, a list of dicts) into JSON text and writes it to the given open file.',
    },
    {
      q: 'After reading a JSON file with <code>data = json.load(f)</code>, what Python type does a JSON array of objects become?',
      options: { a: 'A tuple of tuples', b: 'A list of dictionaries', c: 'A single dictionary with numeric keys', d: 'A string containing the raw JSON text' },
      answer: 'b',
      explain: 'A JSON array becomes a Python list; a JSON object becomes a Python dict. A JSON array of objects — exactly our country records — becomes a list of dicts, the exact shape we have been using since Session 06.',
    },
    {
      q: 'What happens if you call <code>json.load(f)</code> on a file that does not exist?',
      options: { a: 'It returns an empty list', b: 'It raises a FileNotFoundError, before json.load even gets a chance to run', c: 'It silently creates the file', d: 'It returns None' },
      answer: 'b',
      explain: 'Attempting to open a nonexistent file for reading raises <code>FileNotFoundError</code> at the <code>open()</code> call itself — this needs a try/except (Session 11) if the file might legitimately be missing.',
    },
    {
      q: 'What happens if the file exists but contains invalid JSON text, e.g. a typo\'d bracket?',
      options: { a: 'json.load() returns the raw text as a string instead', b: 'json.load() raises a json.JSONDecodeError', c: 'It silently returns an empty dict', d: 'Python auto-corrects minor JSON syntax errors' },
      answer: 'b',
      explain: 'Malformed JSON raises <code>json.JSONDecodeError</code> (a subclass of <code>ValueError</code>) — another case where try/except lets you fail gracefully with a clear message instead of crashing the whole program.',
    },
    {
      q: 'To point CountryRepository at a JSON file instead of MOCK_COUNTRIES, what needs to change, given Session 28\'s design?',
      options: { a: 'Every method inside CountryRepository must be rewritten', b: 'Only the raw_data passed into CountryRepository\'s constructor changes — from MOCK_COUNTRIES to the result of reading and parsing the JSON file; get_all() and find_by_region() need no changes at all', c: 'CountryExplorer needs to be rewritten', d: 'The whole application needs restructuring' },
      answer: 'b',
      explain: 'This is exactly the payoff promised in Session 28: as long as the JSON file\'s parsed content is still a list of dicts with the same keys, only the CONSTRUCTOR argument changes — the repository\'s methods and everything downstream of it are completely untouched.',
    },
  ],
  conceptTitle: 'Reading and Writing JSON',
  sections: [
    {
      h3: 'Writing data to a JSON file',
      paragraphs: ['Python\'s standard library json module converts Python data structures to and from JSON text — no external installation required.'],
      code: `import json
from mock_countries import MOCK_COUNTRIES

with open("countries.json", "w") as f:
    json.dump(MOCK_COUNTRIES, f, indent=2)

# countries.json now contains readable, formatted JSON text on disk`,
    },
    {
      h3: 'Reading it back',
      paragraphs: ['json.load() parses a JSON file directly back into native Python data structures — a JSON array of objects becomes exactly the list of dicts we\'ve used since Session 06.'],
      code: `import json

with open("countries.json") as f:
    data = json.load(f)

print(type(data))        # <class 'list'>
print(type(data[0]))     # <class 'dict'>
print(data[0]["name"])   # "Kenya"`,
      diagram: {
        caption: 'JSON arrays become Python lists; JSON objects become Python dicts — the same shape we\'ve worked with since Session 06.',
        boxes: [
          { label: 'JSON array', text: '[ {...}, {...} ]' },
          { label: 'Python', text: 'list of dicts', accent: true },
        ],
      },
    },
    {
      h3: 'Handling a missing or malformed file',
      paragraphs: ['A file that does not exist, or contains invalid JSON, raises an exception — Session 11\'s discipline applies directly.'],
      code: `import json

def load_countries_file(path):
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"{path} does not exist — using an empty dataset")
        return []
    except json.JSONDecodeError as e:
        print(f"{path} contains invalid JSON: {e}")
        return []

data = load_countries_file("countries.json")
data_missing = load_countries_file("does_not_exist.json")  # handled gracefully`,
    },
    {
      h3: 'Pointing the repository at the file — nothing else changes',
      paragraphs: ['This is Session 28\'s payoff, delivered: only the constructor argument changes, because get_all() was never coupled to WHERE raw_data came from.'],
      code: `class CountryRepository:
    def __init__(self, raw_data):
        self._raw_data = raw_data

    def get_all(self):
        return [Country.from_dict(r) for r in self._raw_data]

# Before: built from the in-memory mock list
# repo = CountryRepository(raw_data=MOCK_COUNTRIES)

# Now: built from a real file on disk — get_all() is completely unchanged
repo = CountryRepository(raw_data=load_countries_file("countries.json"))
print(len(repo.get_all()))`,
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Write the mock data to a real JSON file, read it back with graceful error handling, and point CountryRepository at it.',
    whatYouBuild: 'A file called <code>json_lab.py</code>, plus a generated <code>countries.json</code>.',
    steps: [
      { title: 'Create the file and write the mock data to countries.json', body: [], code: `# json_lab.py
import json
from mock_countries import MOCK_COUNTRIES

with open("countries.json", "w") as f:
    json.dump(MOCK_COUNTRIES, f, indent=2)

print("Wrote countries.json")` },
      { title: 'Open countries.json in a text editor and confirm it is readable JSON', body: ['No code needed — just look at the file to see what json.dump produced.'] },
      { title: 'Write load_countries_file() with graceful error handling', body: [], code: `def load_countries_file(path):
    try:
        with open(path) as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"{path} does not exist — using an empty dataset")
        return []
    except json.JSONDecodeError as e:
        print(f"{path} contains invalid JSON: {e}")
        return []` },
      { title: 'Load the real file and a nonexistent file, confirming both are handled gracefully', body: [], code: `real_data = load_countries_file("countries.json")
missing_data = load_countries_file("does_not_exist.json")
print("Real records:", len(real_data))
print("Missing-file fallback:", missing_data)` },
      { title: 'Point CountryRepository at the JSON file and confirm everything still works', body: [], code: `class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population

    @classmethod
    def from_dict(cls, data):
        return cls(**data)

class CountryRepository:
    def __init__(self, raw_data):
        self._raw_data = raw_data

    def get_all(self):
        return [Country.from_dict(r) for r in self._raw_data]

repo = CountryRepository(raw_data=load_countries_file("countries.json"))
print(len(repo.get_all()))` },
    ],
  },
  filesChanged: [
    { file: 'json_lab.py', action: 'Created', why: 'Writes and reads countries.json, with graceful error handling, feeding CountryRepository.' },
    { file: 'countries.json', action: 'Generated', why: 'The mock data, now persisted as a real file on disk.' },
    { file: 'docs/sessions/session-29/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add json_lab.py countries.json docs/sessions/session-29/index.html\ngit commit -m "session-29: read and write JSON files, point the repository at real disk data"',
  commitQuestion: 'What two things could go wrong when reading countries.json, and how did I handle each one?',
  checklist: [
    'countries.json is generated with json.dump and is valid, readable JSON',
    'load_countries_file() catches both FileNotFoundError and json.JSONDecodeError separately',
    'A nonexistent file path is tested and handled gracefully, returning an empty list',
    'CountryRepository is constructed from the JSON file\'s parsed content with zero changes to its own methods',
    'The final repo.get_all() call returns the expected number of Country instances',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Why does json.load() raise a FileNotFoundError from the open() call rather than from json.load() itself? What does that tell you about the order operations happen in?',
    'What is the practical difference for a user between your program silently falling back to an empty list versus crashing entirely, when countries.json is missing?',
    'Manually break countries.json (delete a bracket) and confirm your JSONDecodeError handling catches it. What did the error message tell you?',
    'How does this session prove Session 28\'s repository design was worth the extra structure, now that a genuinely different data source exists?',
  ],
  whatBreaks: [
    { title: 'Crash on missing or corrupt files', text: 'Without explicit handling for FileNotFoundError and JSONDecodeError, a single missing file or one bad edit to countries.json would crash the entire application on startup instead of degrading gracefully.' },
    { title: 'Data contracts (Session 30)', text: 'Nothing currently verifies that every record read from the JSON file actually has the right keys and types — a JSON file is just text, and can contain anything. The next session formalizes exactly this check.' },
    { title: 'Real APIs (Session 42)', text: 'Reading and parsing JSON is exactly what a real API response requires too — this session\'s json.load() pattern is nearly identical to how you will parse an HTTP response body in Layer 7.' },
  ],
  learnedConcept: 'Reading and writing JSON files with the json module, handling missing/malformed files gracefully, and pointing a repository at a real disk-based data source.',
  learnedUnlocks: 'The application now has a genuinely persistent, external data source — the first real (if still local) data the repository pattern was built to support.',
  nextTeaser: 'We formalize what a "valid" country record actually looks like, using type hints and dataclasses — the Layer 4 gate.',
},

// ── SESSION 26 ─────────────────────────────────────────────────────
{
  num: 30,
  title: 'Designing Data Contracts',
  nextTitle: 'Why We Test and What to Test',
  subtitle: 'This is the Layer 4 gate. We formalize the informal "contract" from Session 27 using type hints and dataclasses, catching shape mismatches automatically instead of hoping.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Add type hints to a function or method signature',
    'Define a class using @dataclass instead of a hand-written __init__',
    'Explain what type hints do and do not enforce at runtime',
    'Validate that a raw dict matches the expected contract before constructing an instance from it',
    'Compare the dataclass version of Country to the hand-written version from Session 13',
  ],
  quiz: [
    {
      q: 'Given <code>def summary(country: dict) -> str:</code>, does Python prevent you from calling summary(42) at runtime?',
      options: { a: 'Yes — Python raises a TypeError immediately for the wrong type', b: 'No — type hints are documentation and tooling support (e.g. editors, type checkers); Python itself does not enforce them at runtime', c: 'Only if the function has a docstring', d: 'Only in Python 2' },
      answer: 'b',
      explain: 'This is a critical fact about Python type hints: they are NOT enforced by the language at runtime. They document intent and enable external tools (editors, mypy) to catch mismatches ahead of time, but summary(42) would still run and likely fail inside the function body instead.',
    },
    {
      q: 'What does @dataclass generate automatically for a class, compared to the hand-written __init__ from Session 13?',
      options: { a: 'Nothing — it is purely decorative', b: 'An __init__ method (and a few other dunder methods, including __eq__) based on the class\'s declared fields, without you writing them by hand', c: 'A complete REST API for the class', d: 'Automatic file I/O for the class' },
      answer: 'b',
      explain: '@dataclass inspects the class\'s field declarations and auto-generates __init__ (and by default __eq__, among others) — eliminating the repetitive self.x = x boilerplate from Session 13, while still producing an ordinary class.',
    },
    {
      q: 'Given <code>@dataclass\\nclass Country:\\n    name: str\\n    region: str\\n    population: int</code>, does this dataclass automatically give you the Session 19 value-based __eq__ behavior?',
      options: { a: 'No — you still must write __eq__ by hand', b: 'Yes — @dataclass generates a field-by-field __eq__ by default, exactly the behavior Session 19 built manually', c: 'Only if you also inherit from a base class', d: 'Dataclasses do not support equality comparison at all' },
      answer: 'b',
      explain: 'This directly connects back to Session 19: a dataclass\'s default __eq__ compares all declared fields, exactly like the __eq__ we wrote by hand — but generated automatically, for free.',
    },
    {
      q: 'A raw dict from a JSON file is missing the "population" key. If you call Country(**raw_dict) where Country is a dataclass requiring population, what happens?',
      options: { a: 'population silently defaults to 0', b: 'A TypeError is raised for the missing required argument — dataclasses still require all non-default fields at construction, just like a hand-written __init__ would', c: 'The dataclass ignores the missing field entirely', d: 'It raises a KeyError instead of a TypeError' },
      answer: 'b',
      explain: 'Dataclasses generate a real __init__ under the hood — type hints alone do not enforce anything, but the generated constructor still requires every field without a default, exactly like Session 13\'s hand-written version. This is why validating BEFORE construction (as this session\'s lab does) is still necessary for a clear, early error.',
    },
    {
      q: 'Why would you validate that a raw dict has the correct keys and roughly correct types BEFORE passing it into a dataclass constructor, given that type hints are not enforced at runtime?',
      options: { a: 'There is no reason to; the dataclass handles this automatically', b: 'Because type hints alone will not catch a wrong VALUE type (e.g. population as a string "fifty-four-million"); explicit validation catches contract violations early and with a clear message, rather than a confusing failure downstream', c: 'Validation is only useful for strings, never numbers', d: 'Dataclasses reject bad types automatically at construction time' },
      answer: 'b',
      explain: 'Since Python does not enforce type hints, a dataclass will happily accept <code>Country(name="Kenya", region="Africa", population="fifty-four-million")</code> without complaint at construction time — the bug would only surface later, confusingly, wherever population is actually used as a number. Explicit validation (Session 24\'s discipline) catches this immediately, with a clear message.',
    },
  ],
  conceptTitle: 'Data Contracts with Type Hints and Dataclasses',
  sections: [
    {
      h3: 'Type hints — documentation, not enforcement',
      paragraphs: [
        'A type hint tells readers (and tools like editors and type checkers) what type a value is expected to be. Python itself does not check this at runtime — it is a critical fact to internalize, since it is easy to assume otherwise.',
      ],
      code: `def summary(country: dict) -> str:
    return f"{country['name']} ({country['region']})"

# This "should" be wrong according to the type hint, but Python runs it anyway:
print(summary(42))
# TypeError happens INSIDE the function body (42 is not subscriptable),
# not because the type hint was checked and enforced upfront`,
    },
    {
      h3: '@dataclass — less boilerplate, same underlying class',
      paragraphs: [
        'A dataclass declares its fields with type hints, and Python auto-generates __init__ (and by default, __eq__) from those declarations — directly replacing Session 13\'s hand-written boilerplate.',
      ],
      code: `from dataclasses import dataclass

@dataclass
class Country:
    name: str
    region: str
    population: int

kenya = Country(name="Kenya", region="Africa", population=54000000)
print(kenya.name)        # "Kenya" — same as before
print(kenya.population)  # 54000000

peru1 = Country(name="Peru", region="Americas", population=33000000)
peru2 = Country(name="Peru", region="Americas", population=33000000)
print(peru1 == peru2)  # True — free, field-by-field equality (Session 19's manual __eq__, generated automatically)`,
      diagram: {
        caption: '@dataclass reads the field declarations and generates __init__ and __eq__ for you — the same result as Sessions 09 and 15, without the boilerplate.',
        boxes: [
          { label: 'field declarations', text: 'name: str\nregion: str\npopulation: int' },
          { label: '@dataclass generates', text: '__init__, __eq__', accent: true },
        ],
      },
    },
    {
      h3: 'Type hints still don\'t stop bad values at construction',
      paragraphs: [
        'A dataclass will happily accept a value of the wrong type — the hint is not checked. This is why explicit validation, at the boundary where raw external data enters the program, is still necessary.',
      ],
      code: `bad = Country(name="Kenya", region="Africa", population="fifty-four-million")
print(bad.population)  # "fifty-four-million" — a string, accepted without complaint!
# This will fail confusingly later, wherever population is actually used as a number`,
    },
    {
      h3: 'Validating the contract before construction',
      paragraphs: [
        'Combining Session 24\'s validation discipline with the dataclass gives us both convenience AND safety: check the raw dict\'s shape and types explicitly, THEN construct.',
      ],
      code: `def validate_country_record(data):
    required = {"name": str, "region": str, "population": int}
    for key, expected_type in required.items():
        if key not in data:
            raise ValueError(f"missing required field: {key}")
        if not isinstance(data[key], expected_type):
            raise TypeError(f"{key} must be {expected_type.__name__}, got {type(data[key]).__name__}")
    return data

def build_country(data):
    validate_country_record(data)
    return Country(**data)`,
    },
  ],
  callout: {
    title: 'Layer 4 gate:',
    text: 'This is the last Layer 4 session. Every remaining layer assumes you understand that type hints document intent but do not enforce it, and that explicit validation is what actually protects the boundary between raw external data and your application.',
  },
  closing: null,
  lab: {
    objective: 'Convert Country to a dataclass, prove type hints are not enforced, and add explicit contract validation for raw records loaded from JSON.',
    whatYouBuild: 'A file called <code>contracts_lab.py</code>.',
    steps: [
      { title: 'Create the file with Country as a dataclass', body: [], code: `# contracts_lab.py
from dataclasses import dataclass

@dataclass
class Country:
    name: str
    region: str
    population: int

    def summary(self):
        return f"{self.name} ({self.region}): pop. {self.population:,}"` },
      { title: 'Prove the free __eq__ works, connecting back to Session 19', body: [], code: `a = Country(name="Kenya", region="Africa", population=54000000)
b = Country(name="Kenya", region="Africa", population=54000000)
print("a == b:", a == b)   # True — generated automatically
print("a is b:", a is b)   # False — still separate objects` },
      { title: 'Prove type hints are not enforced at construction', body: [], code: `bad = Country(name="Kenya", region="Africa", population="not a number")
print(bad.population)              # accepted anyway!
print(type(bad.population))        # <class 'str'> — the hint did nothing to stop this` },
      { title: 'Write validate_country_record() checking both presence and type', body: [], code: `def validate_country_record(data):
    required = {"name": str, "region": str, "population": int}
    for key, expected_type in required.items():
        if key not in data:
            raise ValueError(f"missing required field: {key}")
        if not isinstance(data[key], expected_type):
            raise TypeError(f"{key} must be {expected_type.__name__}, got {type(data[key]).__name__}")
    return data` },
      { title: 'Validate a batch of raw records, including a deliberately bad one, and skip failures gracefully', body: ['Reuse the Session 18 pattern of catching per-record errors without losing the whole batch.'], code: `raw_records = [
    {"name": "Kenya", "region": "Africa", "population": 54000000},
    {"name": "Bad Data", "region": "Africa", "population": "fifty"},  # wrong type
    {"name": "Also Bad", "region": "Africa"},                          # missing key
]

good_countries = []
for r in raw_records:
    try:
        validate_country_record(r)
        good_countries.append(Country(**r))
    except (ValueError, TypeError) as e:
        print(f"Rejected {r!r}: {e}")

print("Valid countries:", len(good_countries))` },
    ],
  },
  filesChanged: [
    { file: 'contracts_lab.py', action: 'Created', why: 'Converts Country to a dataclass and adds explicit contract validation for raw records.' },
    { file: 'docs/sessions/session-30/index.html', action: 'Created', why: 'This session document — Layer 4 gate.' },
  ],
  commitCmd: 'git add contracts_lab.py docs/sessions/session-30/index.html\ngit commit -m "session-30: formalize the country data contract with dataclasses and explicit validation"',
  commitQuestion: 'Why does population="not a number" get accepted by Country(**data) even though population is type-hinted as int?',
  checklist: [
    'Country is defined using @dataclass with type-hinted fields',
    'The free, generated __eq__ is proven with two separately constructed, identically-valued instances',
    'A wrong-typed value is passed to the dataclass and shown to be accepted anyway, proving hints are not enforced',
    'validate_country_record() checks both key presence and value type, raising clear errors',
    'A batch including a bad record is processed, with bad records rejected individually and good ones kept',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Why do you think Python chose not to enforce type hints at runtime by default, when other languages do enforce their type systems? What tradeoff does this represent?',
    'How does validate_country_record() in this session compare to validate_population() from Session 24? What is genuinely new versus what is the same idea applied at a different level?',
    'If a real API someday returns population as a string like "54000000" (valid digits, but the wrong TYPE), would your current validate_country_record() accept or reject it? Is that the right behavior?',
    'How does the dataclass\'s generated __init__ relate back to everything you learned about __init__ and self in Session 13?',
  ],
  whatBreaks: [
    { title: 'Trusting type hints as enforcement', text: 'A very common and dangerous misconception is believing type hints protect you from bad data at runtime. This session should permanently correct that — hints inform tooling and readers, but only explicit validation actually protects your program.' },
    { title: 'Testing the data layer (Session 35)', text: 'The tests you write for CountryRepository in Layer 5 will directly exercise validate_country_record() with both good and bad records — this session\'s validation logic IS what gets tested.' },
    { title: 'Real, messy API data (Layer 7)', text: 'A real external API is far less trustworthy than your own mock or JSON data — it can return unexpected types, missing fields, or malformed values at any time. The validation discipline from this session is what stands between that chaos and your application crashing.' },
  ],
  learnedConcept: 'Type hints as documentation (not enforcement), dataclasses as a concise way to define structured classes, and explicit validation as the real protection at data boundaries.',
  learnedUnlocks: 'The Country data contract is now explicit, documented, and actually enforced — the last Layer 4 skill before we start testing everything we\'ve built.',
  nextTeaser: 'Layer 5 begins. We start testing this application deliberately, instead of manually re-running scripts to check our work.',
},

// ── SESSION 27 ─────────────────────────────────────────────────────
{
  num: 31,
  title: 'Why We Test and What to Test',
  nextTitle: 'Setting Up pytest',
  subtitle: 'Layer 5 begins. Every session so far has been manually verified by reading printed output. Automated tests replace that manual check with something repeatable and reliable.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Explain what an automated test verifies that manual print-checking does not',
    'Distinguish testing behavior (what a function/method does) from testing implementation (how it does it)',
    'Identify which parts of the Country Explorer project are worth testing first',
    'Explain what NOT to test, and why over-testing has real costs',
    'Recognise this as a concept-only session, mirroring Sessions 12, 20, and 27',
  ],
  quiz: [
    {
      q: 'You have manually run print(kenya.summary()) and visually confirmed it looks right, many times across many sessions. What does an automated test add that this process lacks?',
      options: { a: 'Nothing — manual verification is exactly as good', b: 'A test runs the same check automatically, every time, without you needing to remember to do it or manually re-read the output — and it fails LOUDLY if the behavior ever changes unexpectedly', c: 'Tests are only useful for very large companies', d: 'Manual testing is always more thorough than automated testing' },
      answer: 'b',
      explain: 'Manual verification depends on you remembering to do it, correctly, every single time you change anything, anywhere in the project. A test encodes the check permanently and runs it consistently — catching regressions you would not think to manually re-check.',
    },
    {
      q: 'A good test for grow_population(amount) checks that self.population increases by amount. Should it also check that self.population is stored as a specific type of internal Python integer object?',
      options: { a: 'Yes — testing every implementation detail is always better', b: 'No — this tests behavior (does the number end up correct?), not implementation detail (exactly how Python represents that number internally), which is not something the test should care about', c: 'It does not matter either way', d: 'Only advanced tests should check behavior; basic tests should check implementation' },
      answer: 'b',
      explain: 'Testing behavior means testing WHAT a piece of code does, observable from the outside — the resulting value. Testing implementation means testing HOW it does it internally, which is fragile and tends to break tests unnecessarily when you refactor without changing actual behavior.',
    },
    {
      q: 'Given everything built in Layers 1–4, which is the best FIRST thing to write tests for?',
      options: { a: 'The exact wording of every print() statement across every lab file', b: 'Core, reusable logic like Country\'s methods and CountryRepository\'s validation — code that many other things depend on and that would cause the most damage if it silently broke', c: 'Nothing needs testing if the code already ran once successfully', d: 'Only the very last session\'s code needs tests' },
      answer: 'b',
      explain: 'Testing priority should follow risk and reuse: code that many other parts of the application depend on (Country\'s methods, validation logic, the repository) is the highest-value place to start, since a bug there has the widest blast radius.',
    },
    {
      q: 'Why is testing literally everything, including trivial one-line getters with zero logic, often not worth it?',
      options: { a: 'It is always worth it, there is no such thing as over-testing', b: 'Tests have a maintenance cost too — trivial tests that just restate obvious code add little protection while still needing to be kept up to date every time that code changes', c: 'Python does not allow testing simple methods', d: 'Over-testing is a myth; more tests are unconditionally better' },
      answer: 'b',
      explain: 'Every test is code you have to maintain. A test for a trivial getter with no logic (like a plain @property returning self._x) rarely catches a real bug and just adds upkeep cost — testing effort is best spent where logic (and therefore risk of a bug) actually exists.',
    },
    {
      q: 'Why does this session, like Sessions 12/20/27 before it, contain very little new syntax?',
      options: { a: 'Because testing does not require any special tools', b: 'Because — following the established pattern of this curriculum — understanding WHY and WHAT to test is a judgment call that must be built before the concrete tool (pytest, Session 32) is introduced', c: 'Because this topic will never require code', d: 'Because testing is not actually important enough to cover' },
      answer: 'b',
      explain: 'This is the fourth time the curriculum uses this structure: concept first (why does this practice exist, what should it apply to), then the concrete implementation next session — building genuine understanding rather than memorized tool usage.',
    },
  ],
  conceptTitle: 'Why We Test',
  sections: [
    {
      h3: 'Manual verification does not scale',
      paragraphs: [
        'Every lab so far ended the same way: run the file, read the printed output, and eyeball whether it looks right. This works for a single session, but it does not scale — nothing stops a later change from silently breaking Session 14\'s summary() while you are focused on Session 28\'s repository.',
      ],
    },
    {
      h3: 'What an automated test actually gives you',
      paragraphs: [
        'A test is code that runs other code and checks the result automatically, every time, without a human needing to remember to look. If a change anywhere breaks an existing behavior, the test fails loudly and immediately — instead of the bug silently shipping unnoticed.',
      ],
      code: `# Conceptually — this is what a test does, without any special tooling yet
def test_summary_format():
    k = Country(name="Kenya", region="Africa", population=54000000)
    result = k.summary()
    assert result == "Kenya (Africa): pop. 54,000,000"

test_summary_format()  # runs silently if it passes; raises AssertionError if not`,
    },
    {
      h3: 'Behavior vs implementation',
      paragraphs: [
        'A good test checks WHAT code does (its observable result), not HOW it does it internally. Testing implementation details makes tests fragile — they break during harmless refactors that did not actually change any real behavior.',
      ],
      code: `# Good — tests behavior (the observable result)
def test_grow_population_increases_value():
    k = Country(name="Kenya", region="Africa", population=54000000)
    k.grow_population(1000000)
    assert k.population == 55000000

# Bad — tests an implementation detail that could change for unrelated reasons
# def test_grow_population_uses_plus_equals_operator():
#     ... inspecting the actual bytecode or source of grow_population ...`,
      diagram: {
        caption: 'Behavior is the observable result — what a test should check. Implementation is the internal how — fragile and usually not worth testing directly.',
        boxes: [
          { label: 'behavior', text: 'observable result\n(test this)' },
          { label: 'implementation', text: 'internal how\n(usually skip)', accent: true },
        ],
      },
    },
    {
      h3: 'What to prioritize testing in this project',
      paragraphs: [
        'High value: Country\'s validated methods (set_population, grow_population), CountryRepository\'s data-fetching and validation logic, and CountryExplorer\'s computed properties. Lower value: one-line trivial getters with no logic, and anything that is purely cosmetic printing.',
      ],
    },
  ],
  callout: {
    title: 'Concept session:',
    text: 'Like Sessions 12, 20, and 27 before it, the goal today is a correct mental model of testing before Session 32 introduces the concrete pytest tool.',
  },
  closing: null,
  lab: {
    objective: 'Write plain assert-based checks (no pytest yet) for the highest-value, most logic-bearing parts of the project, and consciously identify what NOT to test.',
    whatYouBuild: 'A file called <code>manual_tests.py</code> — using bare assert statements, the same tool pytest builds on.',
    steps: [
      { title: 'Create the file with Country and CountryRepository from earlier sessions', body: [], code: `# manual_tests.py
class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population

    def summary(self):
        return f"{self.name} ({self.region}): pop. {self.population:,}"

    def set_population(self, value):
        if value < 0:
            raise ValueError(f"population must be non-negative, got {value}")
        self.population = value

    def grow_population(self, amount):
        if amount < 0:
            raise ValueError(f"amount must be non-negative, got {amount}")
        self.population += amount` },
      { title: 'Write a plain assert-based check for summary()', body: [], code: `def test_summary_format():
    k = Country(name="Kenya", region="Africa", population=54000000)
    assert k.summary() == "Kenya (Africa): pop. 54,000,000"

test_summary_format()
print("test_summary_format passed")` },
      { title: 'Write checks for grow_population, including the rejection case', body: [], code: `def test_grow_population_increases_value():
    k = Country(name="Kenya", region="Africa", population=54000000)
    k.grow_population(1000000)
    assert k.population == 55000000

def test_grow_population_rejects_negative():
    k = Country(name="Kenya", region="Africa", population=54000000)
    try:
        k.grow_population(-5)
        assert False, "expected a ValueError but none was raised"
    except ValueError:
        pass  # expected

test_grow_population_increases_value()
test_grow_population_rejects_negative()
print("grow_population tests passed")` },
      { title: 'Write a check for set_population preserving previous valid state on rejection', body: ['This directly verifies the guarantee established in Session 21.'], code: `def test_set_population_rejects_and_preserves_state():
    k = Country(name="Kenya", region="Africa", population=54000000)
    try:
        k.set_population(-1)
        assert False, "expected a ValueError but none was raised"
    except ValueError:
        pass
    assert k.population == 54000000, "population should be unchanged after a rejected update"

test_set_population_rejects_and_preserves_state()
print("set_population rejection test passed")` },
      { title: 'Write a short comment list of things you deliberately did NOT test, and why', body: ['E.g. the exact wording of a print() statement, or a trivial getter with no logic.'] },
    ],
  },
  filesChanged: [
    { file: 'manual_tests.py', action: 'Created', why: 'Plain assert-based behavior checks for the highest-value logic in the project.' },
    { file: 'docs/sessions/session-31/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add manual_tests.py docs/sessions/session-31/index.html\ngit commit -m "session-31: write manual assert-based tests for the highest-value logic first"',
  commitQuestion: 'Why did I choose to test grow_population\'s rejection case, but decide NOT to test the exact wording of a print() statement?',
  checklist: [
    'Every test function uses assert to check a specific, observable behavior',
    'At least one test verifies a validated method correctly rejects bad input',
    'At least one test verifies rejected input leaves previous valid state unchanged',
    'A comment explicitly lists something deliberately left untested, with reasoning',
    'Every test function is actually called and its pass is printed/confirmed',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'What would you have to remember to do manually, every single time you changed Country, to catch the same bugs these tests now catch automatically?',
    'Why does test_grow_population_rejects_negative() check for a ValueError instead of checking that population became a specific wrong value?',
    'Can you think of a bug from an EARLIER session in this curriculum that one of today\'s tests would have caught immediately?',
    'What is the risk of writing too many trivial tests, in terms of your own time and the codebase\'s long-term maintainability?',
  ],
  whatBreaks: [
    { title: 'Silent regressions', text: 'Without any automated tests, a change made while working on Session 34 could silently break something built in Session 14, and nothing would tell you until a human happened to notice much later — if ever.' },
    { title: 'A proper testing tool (Session 32)', text: 'The bare assert statements from this session work, but they lack useful failure messages, test discovery, and a clean way to organize many tests. Session 32 introduces pytest to solve exactly these gaps.' },
    { title: 'Confident refactoring (Layer 6)', text: 'Session 36-40\'s architecture refactoring only becomes safe to do confidently once a real test suite exists to catch anything the refactor accidentally breaks — this session is the philosophical foundation for that safety net.' },
  ],
  learnedConcept: 'Why automated tests matter, the distinction between testing behavior and testing implementation, and prioritizing what is actually worth testing.',
  learnedUnlocks: 'You can now write and reason about basic automated checks, and — just as importantly — deliberately choose what NOT to test.',
  nextTeaser: 'We replace bare assert statements with pytest — a real testing tool with better failure messages, discovery, and organization.',
},

// ── SESSION 28 ─────────────────────────────────────────────────────
{
  num: 32,
  title: 'Setting Up pytest',
  nextTitle: 'Testing Functions and Return Values',
  subtitle: 'We install and configure pytest, then convert Session 31\'s manual assert-based checks into real, discoverable, well-organized pytest tests.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Install pytest and understand its file/function naming conventions for test discovery',
    'Write a test function pytest can automatically discover and run',
    'Run the test suite from the command line and read its output',
    'Compare a failing pytest assertion\'s output to a bare assert\'s output',
    'Organize tests into a dedicated tests/ directory, separate from application code',
  ],
  quiz: [
    {
      q: 'For pytest to automatically discover a test function without any extra configuration, what must be true about its name and the file it lives in?',
      options: { a: 'The file and function can be named anything at all', b: 'The file name should start or end with test_ (e.g. test_country.py) and the function name should start with test_ (e.g. def test_summary_format())', c: 'Only the file name matters; function names are irrelevant', d: 'Test functions must be inside a class named TestSuite' },
      answer: 'b',
      explain: 'pytest\'s default discovery convention looks for files matching <code>test_*.py</code> or <code>*_test.py</code>, and within them, functions starting with <code>test_</code>. Following this convention means you never need to manually register a test.',
    },
    {
      q: 'How do you actually run the discovered tests from the command line?',
      options: { a: 'python test_country.py', b: 'pytest', c: 'pip install test_country', d: 'python -m unittest test_country' },
      answer: 'b',
      explain: 'Simply running <code>pytest</code> in the project directory automatically discovers and runs every test file/function matching its naming convention — no manual listing required.',
    },
    {
      q: 'When a plain assert k.population == 55000000 fails inside a pytest test, what does pytest\'s output show you that a bare Python assert (Session 31) does not?',
      options: { a: 'Nothing extra — the output is identical either way', b: 'pytest shows the actual values on both sides of the comparison (e.g. "assert 54000000 == 55000000") automatically, without you writing a custom message', c: 'pytest only tells you which file failed, never which line', d: 'pytest requires you to manually format every failure message' },
      answer: 'b',
      explain: 'This is one of pytest\'s most useful features: it introspects a failing <code>assert</code> and shows you the actual runtime values involved, giving a much clearer picture of what went wrong than a bare assert\'s generic AssertionError.',
    },
    {
      q: 'Why organize tests into a separate tests/ directory instead of mixing test files in with application code?',
      options: { a: 'pytest requires this exact structure to function at all', b: 'It keeps a clear separation between application code and the tests that verify it, making the project easier to navigate as it grows — mirroring the module organization discipline from Session 10', c: 'Tests placed outside tests/ run twice as slowly', d: 'There is no benefit; it is arbitrary' },
      answer: 'b',
      explain: 'Just like Session 10\'s module-splitting discipline, a dedicated tests/ directory keeps concerns separated and makes it immediately obvious, to anyone browsing the project, where the tests live versus where the actual application logic lives.',
    },
    {
      q: 'What is the pytest equivalent of Session 31\'s manual test_grow_population_rejects_negative(), which checked that calling grow_population(-5) raised ValueError?',
      options: { a: 'assert grow_population(-5) == False', b: 'Using pytest.raises(ValueError): as a context manager around the call, e.g. with pytest.raises(ValueError): k.grow_population(-5)', c: 'pytest cannot test for raised exceptions', d: 'try/except is no longer needed with pytest' },
      answer: 'b',
      explain: '<code>pytest.raises(ExceptionType)</code> is a context manager specifically for asserting that a block of code raises a given exception — replacing Session 31\'s manual try/except/assert False pattern with something more concise and pytest-native.',
    },
  ],
  conceptTitle: 'pytest Fundamentals',
  sections: [
    {
      h3: 'Installing pytest',
      paragraphs: ['pytest is installed like any third-party package, typically with pip.'],
      code: `# In your terminal (not in a .py file):
# pip install pytest`,
    },
    {
      h3: 'Test discovery conventions',
      paragraphs: ['pytest automatically finds and runs tests that follow its naming conventions — no manual registration required, unlike Session 31\'s hand-called test functions.'],
      code: `# tests/test_country.py  — file name starts with test_
from country import Country  # importing the real application module

def test_summary_format():   # function name starts with test_
    k = Country(name="Kenya", region="Africa", population=54000000)
    assert k.summary() == "Kenya (Africa): pop. 54,000,000"`,
    },
    {
      h3: 'Running the suite',
      paragraphs: ['A single command runs every discovered test and reports a summary — pass/fail counts and details on any failures.'],
      code: `# In your terminal:
# pytest
#
# Example output:
# ===== test session starts =====
# collected 3 items
#
# tests/test_country.py ...                                    [100%]
#
# ===== 3 passed in 0.02s =====`,
    },
    {
      h3: 'Readable failure output',
      paragraphs: ['When a plain assert fails inside a pytest test, pytest shows you the actual values on both sides — far more informative than a bare AssertionError.'],
      code: `def test_grow_population_increases_value():
    k = Country(name="Kenya", region="Africa", population=54000000)
    k.grow_population(1000000)
    assert k.population == 56000000  # deliberately wrong, to see pytest's failure output

# pytest shows something like:
#     assert 55000000 == 56000000
# — pytest introspected the actual values automatically, no manual message needed`,
      diagram: {
        caption: 'A bare assert just says "failed." pytest shows you the actual values on both sides, automatically.',
        boxes: [
          { label: 'bare assert', text: 'AssertionError\n(no detail)' },
          { label: 'pytest assert', text: 'assert 55000000\n== 56000000', accent: true },
        ],
      },
    },
    {
      h3: 'Testing for raised exceptions with pytest.raises',
      paragraphs: ['pytest provides a dedicated, cleaner way to assert that code raises a specific exception, replacing Session 31\'s manual try/except/assert False.'],
      code: `import pytest

def test_grow_population_rejects_negative():
    k = Country(name="Kenya", region="Africa", population=54000000)
    with pytest.raises(ValueError):
        k.grow_population(-5)
    # if grow_population does NOT raise ValueError, this test fails automatically`,
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Set up a proper project structure with a tests/ directory, convert Session 31\'s manual tests to pytest, and run the suite.',
    whatYouBuild: 'A file called <code>country.py</code> (the real module) and <code>tests/test_country.py</code>.',
    steps: [
      { title: 'Create country.py as a real, importable module', body: [], code: `# country.py
class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population

    def summary(self):
        return f"{self.name} ({self.region}): pop. {self.population:,}"

    def set_population(self, value):
        if value < 0:
            raise ValueError(f"population must be non-negative, got {value}")
        self.population = value

    def grow_population(self, amount):
        if amount < 0:
            raise ValueError(f"amount must be non-negative, got {amount}")
        self.population += amount` },
      { title: 'Create the tests/ directory and test_country.py', body: [], code: `# tests/test_country.py
import pytest
from country import Country

def test_summary_format():
    k = Country(name="Kenya", region="Africa", population=54000000)
    assert k.summary() == "Kenya (Africa): pop. 54,000,000"

def test_grow_population_increases_value():
    k = Country(name="Kenya", region="Africa", population=54000000)
    k.grow_population(1000000)
    assert k.population == 55000000` },
      { title: 'Add exception tests using pytest.raises', body: [], code: `def test_grow_population_rejects_negative():
    k = Country(name="Kenya", region="Africa", population=54000000)
    with pytest.raises(ValueError):
        k.grow_population(-5)

def test_set_population_rejects_negative():
    k = Country(name="Kenya", region="Africa", population=54000000)
    with pytest.raises(ValueError):
        k.set_population(-1)` },
      { title: 'Run pytest from the project root and confirm all tests pass', body: ['Run the pytest command and read the summary output.'], code: '# pytest' },
      { title: 'Deliberately break one test to see pytest\'s failure output, then fix it', body: ['Change an expected value to something wrong, run pytest again, read the detailed failure output, then revert it.'] },
    ],
  },
  filesChanged: [
    { file: 'country.py', action: 'Created', why: 'The real, importable Country module (no longer duplicated inline in a lab script).' },
    { file: 'tests/test_country.py', action: 'Created', why: 'A proper pytest test suite for Country, organized in a dedicated tests/ directory.' },
    { file: 'docs/sessions/session-32/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add country.py tests/test_country.py docs/sessions/session-32/index.html\ngit commit -m "session-32: set up pytest with a real tests/ directory"',
  commitQuestion: 'What naming convention did I follow to make pytest automatically discover these tests without any manual registration?',
  checklist: [
    'country.py exists as a standalone, importable module (Session 10 discipline)',
    'tests/test_country.py follows pytest\'s file and function naming conventions',
    'At least two tests use pytest.raises() instead of manual try/except',
    'Running pytest from the project root discovers and passes all tests',
    'A deliberately broken test was run once to observe pytest\'s detailed failure output, then fixed',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Compare the effort of writing test_grow_population_rejects_negative() with pytest.raises() versus Session 31\'s manual try/except/assert False version. Which communicates intent more clearly to a reader?',
    'Why does pytest need file and function names to follow a convention, instead of you manually telling it which functions are tests?',
    'What did the deliberately-broken test\'s failure output show you that made it easy to identify the problem?',
    'How does organizing tests/ separately from country.py reflect the same reasoning as splitting country_data.py from explorer.py back in Session 10?',
  ],
  whatBreaks: [
    { title: 'Forgetting to run tests', text: 'Even a good test suite is useless if no one remembers to run it before shipping a change — this is a process discipline this session sets up the tooling for, but does not solve by itself (CI automation solves it, but is out of scope for this curriculum).' },
    { title: 'Testing props/output specifically (Session 33)', text: 'This session set up the tooling; the next two sessions dive into what specifically to assert on — return values and object state — building real test coverage across the whole project.' },
    { title: 'Confident refactoring (Layer 6)', text: 'A real, runnable pytest suite is the safety net that makes Layer 6\'s architecture refactoring sessions safe to do boldly instead of nervously.' },
  ],
  learnedConcept: 'pytest fundamentals — installation, test discovery conventions, running the suite, readable failure output, and pytest.raises for exception testing.',
  learnedUnlocks: 'The project now has a real, professional testing setup — the foundation for every remaining test-writing session in Layer 5.',
  nextTeaser: 'We dig into what specifically to assert on for functions and methods that return values, covering edge cases systematically.',
},

// ── SESSION 29 ─────────────────────────────────────────────────────
{
  num: 33,
  title: 'Testing Functions and Return Values',
  nextTitle: 'Testing Classes and State Changes',
  subtitle: 'We systematically test return values across the project, including edge cases: empty inputs, boundary values, and the exact examples used in each session\'s own concept explanation.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Write multiple test functions covering a normal case, an edge case, and a boundary case for one function',
    'Use pytest parametrization to run the same test logic across several inputs',
    'Test a list comprehension\'s output by checking exact contents, not just length',
    'Test the from_dict classmethod from Session 18 with both valid and malformed input',
    'Identify what "edge case" means concretely, using examples from this project',
  ],
  quiz: [
    {
      q: 'For a function find_by_region(countries, region), what is an example of an "edge case" worth testing, beyond the normal "region exists with matches" case?',
      options: { a: 'Only ever testing with exactly 3 countries', b: 'Calling it with a region that matches nothing (expect an empty list) and with an empty countries list entirely', c: 'Edge cases do not apply to this kind of function', d: 'Testing it twice with identical inputs' },
      answer: 'b',
      explain: 'Edge cases are inputs at the boundary of normal usage: zero matches, an empty source collection, or unusual-but-valid inputs. These are exactly where bugs like accidentally returning None instead of [] tend to hide (recall Session 17).',
    },
    {
      q: 'What does @pytest.mark.parametrize let you do?',
      options: { a: 'Run one test function repeatedly with different sets of input/expected-output values, without copy-pasting the test body for each case', b: 'Skip a test entirely', c: 'Automatically generate random test inputs', d: 'Mark a test as expected to fail permanently' },
      answer: 'a',
      explain: '<code>@pytest.mark.parametrize</code> decorates a test function with a list of input/expected pairs, and pytest runs the same test body once per pair — avoiding duplicated test functions that differ only in their specific values.',
    },
    {
      q: 'You want to test that [c.name for c in explorer.find_by_region("Africa")] returns exactly ["Kenya", "Ghana"]. Why is asserting the exact list better than just asserting len(result) == 2?',
      options: { a: 'There is no difference — length is always sufficient', b: 'Checking exact contents catches bugs where the right NUMBER of items is returned but the WRONG items are included (e.g. filtering by the wrong field)', c: 'Checking length is always better practice', d: 'Exact-content assertions are not supported by pytest' },
      answer: 'b',
      explain: 'A length-only check would pass even if find_by_region accidentally returned two European countries instead of two African ones — checking exact contents is what actually verifies the filtering logic works correctly.',
    },
    {
      q: 'Testing Country.from_dict() with a dict missing the "population" key should do what?',
      options: { a: 'Silently succeed with population set to 0', b: 'Be tested with pytest.raises(TypeError), confirming the missing required argument is correctly rejected rather than silently accepted', c: 'This case is not worth testing since it "should never happen"', d: 'Always return None instead of raising' },
      answer: 'b',
      explain: 'Malformed input is exactly the kind of edge case worth testing explicitly — pytest.raises(TypeError) confirms the failure mode is the expected, controlled one (a clear TypeError) rather than something confusing happening downstream.',
    },
    {
      q: 'Why is it valuable for a test to use the EXACT same example from a session\'s own concept explanation, rather than an unrelated new example?',
      options: { a: 'It is not more valuable; any example works equally well', b: 'It directly verifies the claim made in the teaching material is actually true in the running code, keeping the lesson and the implementation honest and in sync', c: 'pytest requires tests to match documentation examples exactly', d: 'This wastes test-writing effort by not exploring new cases' },
      answer: 'b',
      explain: 'This connects directly to the feedback that shaped this whole course: a test built from the exact material just taught verifies the real behavior matches what was claimed, rather than testing an disconnected, arbitrary scenario.',
    },
  ],
  conceptTitle: 'Testing Return Values Systematically',
  sections: [
    {
      h3: 'Three kinds of cases: normal, edge, and boundary',
      paragraphs: [
        'A thorough test suite for a function covers its normal, expected use; edge cases (empty inputs, zero matches); and boundary cases (values right at a validation limit, like exactly 0).',
      ],
      code: `# country.py additions
def find_by_region(countries, region):
    return [c for c in countries if c.region == region]

# tests/test_find_by_region.py
from country import Country, find_by_region

def test_find_by_region_normal_case():
    countries = [
        Country(name="Kenya", region="Africa", population=54000000),
        Country(name="Peru", region="Americas", population=33000000),
    ]
    result = find_by_region(countries, "Africa")
    assert [c.name for c in result] == ["Kenya"]  # exact contents, not just length

def test_find_by_region_no_matches_returns_empty_list():
    countries = [Country(name="Kenya", region="Africa", population=54000000)]
    result = find_by_region(countries, "Antarctica")
    assert result == []  # Session 17's guarantee, verified

def test_find_by_region_empty_source_list():
    result = find_by_region([], "Africa")
    assert result == []`,
    },
    {
      h3: 'Parametrizing repetitive test logic',
      paragraphs: ['When the same test logic needs to run against several input/output pairs, @pytest.mark.parametrize avoids copy-pasting near-identical test functions.'],
      code: `import pytest
from country import Country

@pytest.mark.parametrize("value,expected_valid", [
    (54000000, True),
    (0, True),         # boundary — exactly zero should be valid
    (-1, False),        # boundary — just below zero should be invalid
    (-999999, False),
])
def test_set_population_validity(value, expected_valid):
    k = Country(name="Kenya", region="Africa", population=1)
    if expected_valid:
        k.set_population(value)
        assert k.population == value
    else:
        with pytest.raises(ValueError):
            k.set_population(value)`,
      diagram: {
        caption: 'One test body, run automatically once per parametrized case — no copy-pasted near-duplicate test functions.',
        boxes: [
          { label: 'test body', text: 'written once' },
          { label: 'parametrize', text: '4 cases\nrun automatically', accent: true },
        ],
      },
    },
    {
      h3: 'Testing from_dict with valid and malformed input',
      paragraphs: ['Session 18\'s classmethod is a natural place for edge-case testing: what happens with correct data, and what happens with a missing required field.'],
      code: `import pytest
from country import Country

def test_from_dict_builds_correct_instance():
    data = {"name": "Kenya", "region": "Africa", "population": 54000000}
    k = Country.from_dict(data)
    assert k.name == "Kenya"
    assert k.population == 54000000

def test_from_dict_missing_field_raises():
    data = {"name": "Ghost Nation"}  # missing region and population
    with pytest.raises(TypeError):
        Country.from_dict(data)`,
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Write a systematic test suite covering normal, edge, and boundary cases for find_by_region, from_dict, and set_population, using parametrization.',
    whatYouBuild: 'A file called <code>tests/test_return_values.py</code>, building on Session 32\'s country.py.',
    steps: [
      { title: 'Add find_by_region and from_dict to country.py if not already present', body: [], code: `# country.py (additions)
def find_by_region(countries, region):
    return [c for c in countries if c.region == region]

class Country:
    # ... existing __init__, summary, set_population, grow_population ...

    @classmethod
    def from_dict(cls, data):
        return cls(**data)` },
      { title: 'Write normal-case and exact-content tests for find_by_region', body: [], code: `# tests/test_return_values.py
import pytest
from country import Country, find_by_region

def test_find_by_region_returns_exact_matches():
    countries = [
        Country(name="Kenya", region="Africa", population=54000000),
        Country(name="Ghana", region="Africa", population=31000000),
        Country(name="Peru", region="Americas", population=33000000),
    ]
    result = find_by_region(countries, "Africa")
    assert [c.name for c in result] == ["Kenya", "Ghana"]` },
      { title: 'Add edge case tests: no matches, empty source', body: [], code: `def test_find_by_region_no_matches():
    countries = [Country(name="Kenya", region="Africa", population=54000000)]
    assert find_by_region(countries, "Antarctica") == []

def test_find_by_region_empty_source():
    assert find_by_region([], "Africa") == []` },
      { title: 'Add from_dict tests, valid and malformed', body: [], code: `def test_from_dict_valid():
    k = Country.from_dict({"name": "Kenya", "region": "Africa", "population": 54000000})
    assert k.name == "Kenya"
    assert k.population == 54000000

def test_from_dict_missing_field_raises():
    with pytest.raises(TypeError):
        Country.from_dict({"name": "Ghost Nation"})` },
      { title: 'Add a parametrized boundary test for set_population', body: [], code: `@pytest.mark.parametrize("value,should_succeed", [
    (54000000, True),
    (0, True),
    (-1, False),
])
def test_set_population_boundaries(value, should_succeed):
    k = Country(name="Kenya", region="Africa", population=1)
    if should_succeed:
        k.set_population(value)
        assert k.population == value
    else:
        with pytest.raises(ValueError):
            k.set_population(value)

# Run: pytest -v   (the -v flag shows each parametrized case individually)` },
    ],
  },
  filesChanged: [
    { file: 'country.py', action: 'Modified', why: 'Adds find_by_region and from_dict if not already present.' },
    { file: 'tests/test_return_values.py', action: 'Created', why: 'Systematic normal/edge/boundary test coverage, including parametrized cases.' },
    { file: 'docs/sessions/session-33/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add country.py tests/test_return_values.py docs/sessions/session-33/index.html\ngit commit -m "session-33: systematically test return values, including edge and boundary cases"',
  commitQuestion: 'Why does test_find_by_region_returns_exact_matches check the exact list of names instead of just the count?',
  checklist: [
    'find_by_region is tested for exact contents, no matches, and an empty source list',
    'from_dict is tested for both valid construction and a malformed record raising TypeError',
    'set_population\'s boundary (exactly 0 vs -1) is tested using @pytest.mark.parametrize',
    'pytest -v is run and each parametrized case is visible individually in the output',
    'All new tests pass',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Why does testing the boundary value 0 for set_population matter specifically, given the validation rule is value < 0?',
    'Could a bug exist where find_by_region returns the correct COUNT of countries but the WRONG countries? Design a scenario where only an exact-content test would catch it.',
    'How did parametrizing the set_population boundary test compare, in terms of clarity, to writing three separate test functions?',
    'Which of today\'s tests would have caught a real bug from an earlier session, if that bug had existed?',
  ],
  whatBreaks: [
    { title: 'False confidence from weak assertions', text: 'A test suite full of length-only or existence-only checks gives a false sense of safety — it can pass while the actual returned data is subtly wrong, exactly the gap exact-content assertions close.' },
    { title: 'Testing state changes (Session 34)', text: 'This session focused on return VALUES. The next session tests state CHANGES on an object over time — a related but distinct testing skill, since not every method returns something meaningful; some just mutate.' },
    { title: 'Regression safety for the whole project', text: 'Every function and method tested in this session is now protected against silent regressions in every remaining session of the curriculum — this is the payoff of investing in test coverage now.' },
  ],
  learnedConcept: 'Systematic testing of return values — normal, edge, and boundary cases, exact-content assertions, and pytest parametrization.',
  learnedUnlocks: 'The project\'s core data-returning functions are now protected by a thorough, systematic test suite, not just a handful of happy-path checks.',
  nextTeaser: 'We test the other half of the picture: methods that change an object\'s state over time, rather than returning a value.',
},

// ── SESSION 30 ─────────────────────────────────────────────────────
{
  num: 34,
  title: 'Testing Classes and State Changes',
  nextTitle: 'Testing the Data Layer with Mocks',
  subtitle: 'Not every method returns a meaningful value — many exist to change an object\'s state over time. We test that state changes correctly, using setup/teardown fixtures for clean, isolated tests.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Write a test that verifies a mutation happened by checking state before and after',
    'Use a pytest fixture to set up a fresh instance for every test, avoiding shared state between tests',
    'Test that CountryExplorer\'s add_country correctly updates its computed properties',
    'Test a multi-step sequence of state changes, not just a single call',
    'Explain why sharing one instance across many tests is risky',
  ],
  quiz: [
    {
      q: 'Why is checking state BOTH before and after a mutating call more thorough than only checking the state after?',
      options: { a: 'It is not more thorough — checking only after is always sufficient', b: 'Confirming the "before" value is what you expect rules out a test that passes by coincidence — e.g. the value happening to already equal the expected "after" value for an unrelated reason', c: 'pytest requires a before-check for every test', d: 'This only matters for numeric attributes' },
      answer: 'b',
      explain: 'A test that never checks the "before" state cannot rule out that the method call did nothing at all, if the value happened to coincidentally already match the expected result — checking both is a stronger, more trustworthy test.',
    },
    {
      q: 'What is a pytest fixture, in the sense of def fresh_explorer(): return CountryExplorer(countries=[]) decorated with @pytest.fixture?',
      options: { a: 'A way to permanently modify pytest\'s configuration', b: 'A reusable setup function that pytest automatically calls and injects into any test function that names it as a parameter, giving each test a fresh, isolated starting object', c: 'A special kind of assertion', d: 'A way to skip slow tests automatically' },
      answer: 'b',
      explain: 'A fixture provides reusable setup logic. Any test function that takes the fixture\'s name as a parameter automatically receives a freshly created object from it — every test gets its own independent starting point, with no manual setup code repeated in each test.',
    },
    {
      q: 'Why is sharing ONE CountryExplorer instance across many different test functions (instead of a fresh one per test, via a fixture) risky?',
      options: { a: 'There is no risk; sharing is always safe and faster', b: 'A mutation performed in one test (e.g. adding a country) would carry over and affect a LATER test\'s starting state, since it is the same shared, mutable object — Session 05\'s reference lesson applied to testing itself', c: 'pytest automatically prevents shared state between tests', d: 'Only numeric state can leak between tests' },
      answer: 'b',
      explain: 'This is Session 05\'s and Session 20\'s reference/mutation lessons applied directly to test design: a shared mutable object means tests are no longer independent — the order tests happen to run in can change their outcome, which is a serious test-suite design flaw.',
    },
    {
      q: 'You want to test that CountryExplorer.total_population correctly reflects a country added via add_country(). What should the test check?',
      options: { a: 'Only that add_country() itself does not raise an exception', b: 'That total_population BEFORE adding equals one value, and total_population AFTER calling add_country() correctly reflects the new total — the computed property tracking the mutation correctly', c: 'That country_count is a string', d: 'Nothing needs to be checked; @property is always correct by definition' },
      answer: 'b',
      explain: 'This directly verifies Session 26\'s guarantee: since total_population is computed fresh from self.countries every access, it should automatically reflect the addition — testing before and after values confirms this actually holds true in the real running code.',
    },
    {
      q: 'A test performs THREE sequential state changes (e.g. grow_population twice, then set_population once) and checks only the final value. What does this kind of test verify that three separate single-step tests would not?',
      options: { a: 'Nothing extra — it is equivalent to three separate tests', b: 'That the methods compose correctly across a realistic sequence of operations, not just in isolation — catching bugs that only appear when state changes happen one after another', c: 'This kind of test is never useful', d: 'It verifies that pytest itself is installed correctly' },
      answer: 'b',
      explain: 'Some bugs only emerge from a REALISTIC SEQUENCE of state changes — for instance, a method that assumes it is always called first might behave incorrectly the second time. A multi-step test exercises this more realistic scenario that isolated single-call tests would miss.',
    },
  ],
  conceptTitle: 'Testing State Changes',
  sections: [
    {
      h3: 'Checking state before and after',
      paragraphs: ['A thorough state-change test confirms the "before" value is what you expect, performs the mutation, and confirms the "after" value is correct — ruling out a test that would coincidentally pass even if the method silently did nothing.'],
      code: `from country import Country

def test_grow_population_changes_state():
    k = Country(name="Kenya", region="Africa", population=54000000)
    assert k.population == 54000000   # confirm the "before" state explicitly

    k.grow_population(1000000)

    assert k.population == 55000000   # confirm the "after" state`,
    },
    {
      h3: 'Fixtures — fresh, isolated setup for every test',
      paragraphs: ['A fixture is reusable setup logic pytest automatically provides to any test that asks for it by parameter name — guaranteeing every test starts from a clean, independent instance.'],
      code: `import pytest
from country import Country

@pytest.fixture
def kenya():
    return Country(name="Kenya", region="Africa", population=54000000)

def test_grow_population(kenya):        # pytest automatically calls kenya() and passes the result in
    kenya.grow_population(1000000)
    assert kenya.population == 55000000

def test_set_population(kenya):          # a COMPLETELY SEPARATE, fresh instance — not shared with the test above
    kenya.set_population(99)
    assert kenya.population == 99`,
      diagram: {
        caption: 'A fixture builds a brand-new instance for each test that requests it — no test can accidentally leak mutated state into another.',
        boxes: [
          { label: 'fixture', text: 'kenya()' },
          { label: 'test A', text: 'fresh instance', accent: true },
          { label: 'test B', text: 'fresh instance', accent: true },
        ],
      },
    },
    {
      h3: 'The risk of a shared instance across tests',
      paragraphs: ['Without a fixture, using one module-level instance across many tests means a mutation in one test silently carries into the next — a direct real-world consequence of the reference-sharing behaviour from Session 05 and 16.'],
      code: `# RISKY — a single shared instance across tests
shared_kenya = Country(name="Kenya", region="Africa", population=54000000)

def test_a_grows_population():
    shared_kenya.grow_population(1000000)
    assert shared_kenya.population == 55000000  # passes

def test_b_expects_original_population():
    assert shared_kenya.population == 54000000  # FAILS — test_a's mutation leaked in!
    # This test's result now depends on test execution ORDER, which is a serious design flaw`,
    },
    {
      h3: 'Testing a computed property tracking a mutation',
      paragraphs: ['Combining Session 26\'s computed properties with state-change testing verifies the whole chain works correctly together.'],
      code: `from country import Country, CountryExplorer

@pytest.fixture
def empty_explorer():
    return CountryExplorer(countries=[])

def test_total_population_reflects_added_country(empty_explorer):
    assert empty_explorer.total_population == 0   # before

    empty_explorer.add_country(Country(name="Kenya", region="Africa", population=54000000))

    assert empty_explorer.total_population == 54000000   # after — automatically correct`,
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Add CountryExplorer to country.py, then test state changes using fixtures, before/after checks, and a multi-step sequence.',
    whatYouBuild: 'Extends <code>country.py</code> and adds <code>tests/test_state_changes.py</code>.',
    steps: [
      { title: 'Add CountryExplorer with add_country and computed properties to country.py', body: [], code: `# country.py (additions)
class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries

    def add_country(self, country):
        if not isinstance(country, Country):
            raise TypeError(f"expected a Country instance, got {type(country).__name__}")
        self.countries.append(country)

    @property
    def country_count(self):
        return len(self.countries)

    @property
    def total_population(self):
        return sum(c.population for c in self.countries)` },
      { title: 'Write fixtures for a fresh Country and a fresh empty CountryExplorer', body: [], code: `# tests/test_state_changes.py
import pytest
from country import Country, CountryExplorer

@pytest.fixture
def kenya():
    return Country(name="Kenya", region="Africa", population=54000000)

@pytest.fixture
def empty_explorer():
    return CountryExplorer(countries=[])` },
      { title: 'Write before/after tests for grow_population and set_population', body: [], code: `def test_grow_population_changes_state(kenya):
    assert kenya.population == 54000000
    kenya.grow_population(1000000)
    assert kenya.population == 55000000

def test_set_population_changes_state(kenya):
    assert kenya.population == 54000000
    kenya.set_population(1)
    assert kenya.population == 1` },
      { title: 'Test add_country updating both computed properties', body: [], code: `def test_add_country_updates_computed_properties(empty_explorer, kenya):
    assert empty_explorer.country_count == 0
    assert empty_explorer.total_population == 0

    empty_explorer.add_country(kenya)

    assert empty_explorer.country_count == 1
    assert empty_explorer.total_population == 54000000` },
      { title: 'Write a multi-step sequence test', body: ['Grow twice, then set once, checking the final value reflects all three operations correctly.'], code: `def test_multi_step_population_sequence(kenya):
    kenya.grow_population(1000000)   # 54,000,000 -> 55,000,000
    kenya.grow_population(2000000)   # 55,000,000 -> 57,000,000
    kenya.set_population(60000000)   # -> 60,000,000 directly
    assert kenya.population == 60000000` },
    ],
  },
  filesChanged: [
    { file: 'country.py', action: 'Modified', why: 'Adds CountryExplorer with add_country and computed properties.' },
    { file: 'tests/test_state_changes.py', action: 'Created', why: 'Fixture-based, isolated tests for state changes, computed properties, and multi-step sequences.' },
    { file: 'docs/sessions/session-34/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add country.py tests/test_state_changes.py docs/sessions/session-34/index.html\ngit commit -m "session-34: test state changes with fixtures, before/after checks, and multi-step sequences"',
  commitQuestion: 'Why does using a fixture instead of one shared module-level instance prevent tests from affecting each other?',
  checklist: [
    'kenya and empty_explorer are defined as @pytest.fixture functions, not shared module-level instances',
    'At least two tests check state explicitly before AND after a mutating call',
    'test_add_country_updates_computed_properties verifies both country_count and total_population',
    'A multi-step sequence test performs at least 3 chained state changes and checks the final result',
    'All tests pass when run independently AND in any order (confirm by running pytest normally, which does not guarantee a fixed order)',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Rewrite one of this session\'s fixture-based tests using a single shared module-level instance instead. Can you construct a second test that would now fail due to leaked state?',
    'Why does test_add_country_updates_computed_properties need to check BOTH country_count and total_population, rather than just one of them?',
    'What real bug would the multi-step sequence test catch that three separate single-step tests might miss?',
    'How does pytest deciding to call kenya() fresh for every test that requests it relate to Session 13\'s lesson that every __init__ call creates an independent instance?',
  ],
  whatBreaks: [
    { title: 'Order-dependent test failures', text: 'Tests that share mutable state can pass or fail depending on the ORDER they happen to run in — an extremely confusing and hard-to-diagnose category of bug in a test suite, entirely avoided by fixtures.' },
    { title: 'Testing the data layer (Session 35)', text: 'The next session — the Layer 5 gate — applies these exact same fixture and state-testing techniques to CountryRepository, using a mock data source built specifically for testing.' },
    { title: 'Safe architecture refactoring (Layer 6)', text: 'A test suite with reliable, isolated tests (thanks to fixtures) is what makes Layer 6\'s refactoring sessions safe — an unreliable, order-dependent suite would give false confidence or false alarms during a refactor.' },
  ],
  learnedConcept: 'Testing state changes with before/after assertions, pytest fixtures for isolated setup, and multi-step sequence testing.',
  learnedUnlocks: 'You can now write reliable, independent tests for any object whose behavior involves changing over time — not just functions that simply return a value.',
  nextTeaser: 'Layer 5 gate. We test the data-access layer itself, using a small mock repository built specifically for testing, isolated from real data entirely.',
},

];