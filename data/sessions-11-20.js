module.exports = [

// ── SESSION 11 ─────────────────────────────────────────────────────
{
  num: 11,
  title: 'Passing Data via the Constructor',
  nextTitle: 'Composition — Objects Containing Objects',
  subtitle: 'Every value a Country needs must arrive through its constructor, deliberately, at creation time — exactly like React props arrive from a parent. This session makes that discipline explicit.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Explain why requiring all data through __init__ parameters is a deliberate discipline, not an accident',
    'Use keyword arguments when constructing an instance for clarity',
    'Add a simple default value to a constructor parameter',
    'Explain the risk of a class silently reading global state instead of its own constructor arguments',
    'Distinguish "construction-time data" from "data computed later by a method"',
  ],
  quiz: [
    {
      q: 'Given <code>Country(name="Kenya", region="Africa", population=54000000)</code>, why write the argument names explicitly instead of just <code>Country("Kenya", "Africa", 54000000)</code>?',
      options: { a: 'Keyword arguments are required by Python for classes with 3+ parameters', b: 'They make the call self-documenting and order-independent, which matters as constructors grow', c: 'Positional arguments are deprecated in modern Python', d: 'There is no difference; it is purely a style preference with zero benefit' },
      answer: 'b',
      explain: 'Keyword arguments remove ambiguity — a reader does not need to remember or look up parameter order, and swapping two same-typed values (e.g. two strings) by accident becomes far less likely.',
    },
    {
      q: 'Given <code>def __init__(self, name, region, population=0):</code>, what happens with <code>Country("Kenya", "Africa")</code>?',
      options: { a: 'A TypeError — population is required', b: 'population is set to 0, the default value', c: 'population is set to None', d: 'It fails because region should also have a default' },
      answer: 'b',
      explain: 'Just like the plain functions from Session 04, a constructor parameter can have a default. Omitting <code>population</code> in the call falls back to <code>0</code>.',
    },
    {
      q: 'Why is it considered bad practice for a class\'s __init__ to silently read a global variable instead of receiving that value as a parameter?',
      options: { a: 'Global variables are always slower to access', b: 'It hides a real dependency, making the class harder to test and harder to understand from its constructor signature alone', c: 'Python forbids reading globals inside a class', d: 'It is not actually a problem — this is a myth' },
      answer: 'b',
      explain: 'If a class quietly depends on a global, you cannot tell what it needs just by reading <code>__init__(self, ...)</code> — and you cannot easily create a second instance with different data, or test the class in isolation. Passing the value in as a parameter makes the dependency visible and explicit.',
    },
    {
      q: 'You want two Country instances that should be genuinely different, e.g. for testing. Which approach is more reliable?',
      options: { a: 'Have __init__ read from a shared global dictionary each time', b: 'Pass different arguments explicitly into each Country(...) call', c: 'Both are equally reliable', d: 'Instances cannot legitimately differ from each other' },
      answer: 'b',
      explain: 'Explicit construction arguments guarantee each instance gets exactly the data you intended. Reading from shared global state risks all instances accidentally seeing the same (possibly stale, possibly already-mutated) values.',
    },
    {
      q: '"Construction-time data" (passed into __init__) versus "data computed later" — which is population if it never changes after creation, vs. a method like was_founded_before(year) that computes True/False on demand?',
      options: { a: 'Both should be construction-time data', b: 'population is construction-time data; was_founded_before\'s result is computed on demand by a method, not stored', c: 'Both should be computed by methods, never stored', d: 'There is no meaningful distinction between the two' },
      answer: 'b',
      explain: 'Data that describes the object and does not need recomputation belongs in <code>__init__</code>. A value that depends on an argument supplied at call time (like a comparison year) is a method\'s job, computed fresh each call rather than stored as an attribute.',
    },
  ],
  conceptTitle: 'Constructor Arguments as an Explicit Contract',
  sections: [
    {
      h3: 'Recap: __init__ already does this',
      paragraphs: ['Since Session 09, every Country instance has received its data through __init__ parameters. This session is about treating that as a deliberate rule, not an implementation detail — and drawing the parallel to how data flows into a React component as props in the original course.'],
      code: `class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population

# All data arrives explicitly, at construction time
kenya = Country(name="Kenya", region="Africa", population=54000000)`,
      diagram: {
        caption: 'Data flows in one direction: explicit arguments in, an initialized instance out. Nothing is read from anywhere else.',
        boxes: [
          { label: 'arguments', text: 'name, region,\npopulation' },
          { label: 'instance', text: 'kenya', accent: true },
        ],
      },
    },
    {
      h3: 'Keyword arguments for clarity',
      paragraphs: ['As a constructor grows past two or three parameters, positional calls become error-prone — it is easy to swap two values of the same type by accident. Keyword arguments (Session 05) remove that risk entirely.'],
      code: `# Risky — easy to accidentally swap two strings
peru = Country("Peru", "Americas", 33000000)

# Safer — self-documenting, order-independent
peru = Country(name="Peru", region="Americas", population=33000000)`,
    },
    {
      h3: 'A default value on a constructor parameter',
      paragraphs: ['Just like any function parameter, a constructor parameter can default to a value when the caller doesn\'t know it yet.'],
      code: `class Country:
    def __init__(self, name, region, population=0):
        self.name = name
        self.region = region
        self.population = population

unknown = Country(name="New Territory", region="Unclaimed")
print(unknown.population)  # 0 — default used`,
    },
    {
      h3: 'Why NOT to read global state inside __init__',
      paragraphs: [
        'A tempting shortcut is to have a class silently pull data from a global variable instead of a parameter. This hides the class\'s real dependencies and makes every instance implicitly coupled to shared state — exactly the kind of bug Session 01 warned about with shared references.',
      ],
      code: `# Risky pattern — DO NOT do this
DEFAULT_REGION = "Africa"

class RiskyCountry:
    def __init__(self, name):
        self.name = name
        self.region = DEFAULT_REGION  # hidden dependency, not visible in the signature!

# Safer — the dependency is visible right in the constructor call
class Country:
    def __init__(self, name, region):
        self.name = name
        self.region = region

safe = Country(name="Kenya", region="Africa")  # nothing hidden`,
    },
  ],
  callout: {
    title: 'Why this matters for the project:',
    text: 'Every object we build from here forward — including the CountryRepository in Layer 4 — receives its dependencies explicitly through its constructor. This one discipline prevents an enormous class of hard-to-trace bugs later.',
  },
  closing: null,
  lab: {
    objective: 'Rewrite Country construction to always use keyword arguments, add a default population, and demonstrate why reading global state is risky.',
    whatYouBuild: 'A file called <code>construction_lab.py</code>.',
    steps: [
      { title: 'Create the file with a Country class using a default population', body: [], code: `# construction_lab.py
class Country:
    def __init__(self, name, region, population=0):
        self.name = name
        self.region = region
        self.population = population` },
      { title: 'Construct three instances using keyword arguments only', body: [], code: `kenya = Country(name="Kenya", region="Africa", population=54000000)
peru = Country(name="Peru", region="Americas", population=33000000)
unknown = Country(name="New Territory", region="Unclaimed")

print(kenya.population, peru.population, unknown.population)` },
      { title: 'Write the risky global-state version and the safe version side by side', body: ['Do not delete either — keep both in the file with comments explaining the difference.'], code: `DEFAULT_REGION = "Africa"

class RiskyCountry:
    def __init__(self, name):
        self.name = name
        self.region = DEFAULT_REGION  # hidden dependency

class SafeCountry:
    def __init__(self, name, region):
        self.name = name
        self.region = region

risky = RiskyCountry("Somewhere")
safe = SafeCountry(name="Somewhere", region="Africa")` },
      { title: 'Prove the risky version breaks when the global changes', body: ['Change DEFAULT_REGION after construction and observe what happens to a NEW risky instance versus the existing one.'], code: `DEFAULT_REGION = "Europe"
another_risky = RiskyCountry("Somewhere Else")
print(risky.region)          # "Africa" — set before the change
print(another_risky.region)  # "Europe" — silently different, no argument changed!` },
      { title: 'Write a one-sentence comment explaining why SafeCountry does not have this problem', body: [] },
    ],
  },
  filesChanged: [
    { file: 'construction_lab.py', action: 'Created', why: 'Demonstrates keyword construction, defaults, and the risk of hidden global dependencies.' },
    { file: 'docs/sessions/session-11/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add construction_lab.py docs/sessions/session-11/index.html\ngit commit -m "session-11: require explicit constructor arguments instead of hidden global state"',
  commitQuestion: 'Why did another_risky silently get a different region than risky, even though neither call passed a region argument?',
  checklist: [
    'Country has a default value for at least one constructor parameter',
    'All construction calls in the file use keyword arguments',
    'Both a RiskyCountry (global state) and SafeCountry (explicit argument) version exist side by side',
    'The bug caused by changing the global after construction is demonstrated and printed',
    'A comment explains why SafeCountry avoids this bug',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Where else in the labs so far might you have accidentally relied on a value "just being there" instead of passing it explicitly?',
    'What is the cost of always using keyword arguments (more typing) versus the benefit (clarity, safety)? Where is that tradeoff worth it and where is it not?',
    'How does this session\'s "explicit data in, explicit instance out" pattern connect back to the reference/mutation lessons from Session 01?',
    'Can you think of a legitimate use for a class reading module-level state, where it would NOT be a hidden dependency problem?',
  ],
  whatBreaks: [
    { title: 'Hard-to-test classes', text: 'A class that reads global or module-level state instead of constructor arguments cannot be tested in isolation — every test now depends on setting up (and tearing down) that global correctly, which is exactly the kind of fragile test suite Layer 5 will teach you to avoid.' },
    { title: 'Composition (Session 12)', text: 'The next session builds one class out of several others. If each class does not have a clean, explicit set of constructor dependencies, composing them together becomes guesswork instead of straightforward assembly.' },
    { title: 'The data layer (Layer 4)', text: 'The CountryRepository we build in Session 24 depends on this discipline directly — it is constructed with its data source as an explicit argument, which is exactly what makes it possible to swap in fake data for tests later.' },
  ],
  learnedConcept: 'Constructor arguments as an explicit, self-documenting contract — keyword arguments, defaults, and the risk of hidden global dependencies.',
  learnedUnlocks: 'Every class we build from here forward will receive its dependencies explicitly, making it possible to compose and test them independently.',
  nextTeaser: 'We build a class whose attribute is itself another object — composing several small classes into a coherent whole.',
},

// ── SESSION 12 ─────────────────────────────────────────────────────
{
  num: 12,
  title: 'Composition — Objects Containing Objects',
  nextTitle: 'Conditional Logic in Methods',
  subtitle: 'Real applications are built from many small, focused classes working together, not one giant class doing everything. We build a CountryExplorer that holds a list of Country objects.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Store a list of class instances as an attribute of another class',
    'Write a method on the outer class that loops over and delegates to the inner instances\' own methods',
    'Explain the difference between composition (has-a) and the inheritance relationship we have not covered yet',
    'Add an instance to a composed collection after construction',
    'Trace a method call from the outer object down into an inner object\'s own method',
  ],
  quiz: [
    {
      q: 'Given <code>class CountryExplorer:\\n    def __init__(self, countries):\\n        self.countries = countries</code> where countries is a list of Country instances, what kind of relationship is this?',
      options: { a: 'Inheritance — CountryExplorer is a kind of Country', b: 'Composition — CountryExplorer has a list of Country instances', c: 'No relationship — the two classes are unrelated', d: 'Aliasing — CountryExplorer and Country are the same object' },
      answer: 'b',
      explain: 'This is composition: one object holds references to other objects as part of its own data. CountryExplorer is not a kind of Country, and does not inherit from it — it simply has some.',
    },
    {
      q: 'Given the CountryExplorer above with a method <code>def summaries(self): return [c.summary() for c in self.countries]</code>, what does this method do?',
      options: { a: 'Calls summary() on the CountryExplorer itself, once', b: 'Loops over each Country instance in self.countries and calls each one\'s own summary() method, collecting the results', c: 'Modifies each country\'s summary attribute directly', d: 'Raises an error because Country objects cannot be inside a list comprehension' },
      answer: 'b',
      explain: 'This is delegation: the outer object does not know how to summarize a country itself — it delegates that job to each Country instance\'s own <code>summary()</code> method (from Session 10), and just collects the results.',
    },
    {
      q: 'How do you add a new Country to an existing CountryExplorer instance\'s collection after construction?',
      options: { a: 'You cannot — the list is fixed once __init__ runs', b: 'explorer.countries.append(new_country) — mutate the list attribute directly', c: 'explorer.append(new_country)', d: 'CountryExplorer(new_country)' },
      answer: 'b',
      explain: '<code>self.countries</code> is just a regular list attribute — Session 02\'s <code>.append()</code> works on it exactly the same way it worked on any other list.',
    },
    {
      q: 'If explorer.countries contains 3 Country instances and you call explorer.summaries(), how many times does each individual Country\'s summary() method run?',
      options: { a: 'Once total, for the whole list', b: 'Once each — 3 times total, once per Country instance', c: 'Zero times — summaries() has its own separate implementation', d: 'It depends on the population values' },
      answer: 'b',
      explain: 'The list comprehension inside <code>summaries()</code> iterates the 3 instances and calls <code>.summary()</code> on each one individually, exactly like the for-loop pattern from Session 02, just now calling a method instead of reading a dict key.',
    },
    {
      q: 'Why is composition (CountryExplorer HAS a list of countries) generally preferred over cramming all country data as loose attributes directly onto one giant class?',
      options: { a: 'Composition is always faster to execute', b: 'It keeps each class focused on one responsibility, and Country\'s own logic (like grow_population) stays reusable and testable independently', c: 'Python does not allow more than 3 attributes per class', d: 'There is no real difference' },
      answer: 'b',
      explain: 'Composition lets each class stay small and focused — Country knows how to be a country, CountryExplorer knows how to manage a collection of them. This mirrors exactly why we split code into modules in Session 06.',
    },
  ],
  conceptTitle: 'Composition',
  sections: [
    {
      h3: 'One class holding instances of another',
      paragraphs: ['Composition means an object\'s attribute is itself another object (or a collection of them) — a "has-a" relationship, as opposed to the "is-a" relationship of inheritance, which we are deliberately not covering yet.'],
      code: `class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population

    def summary(self):
        return f"{self.name} ({self.region}): pop. {self.population:,}"


class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries  # a list of Country instances`,
      diagram: {
        caption: 'CountryExplorer HAS a list of Country instances — it does not become one, it holds references to several.',
        boxes: [
          { label: 'CountryExplorer', text: '.countries → [ ]' },
          { label: 'holds', text: 'Country, Country,\nCountry', accent: true },
        ],
      },
    },
    {
      h3: 'Delegating to inner objects',
      paragraphs: ['The outer class does not need to know HOW to summarize a country — it simply asks each Country instance to summarize itself, using the method that instance already has.'],
      code: `explorer = CountryExplorer(countries=[
    Country(name="Kenya", region="Africa", population=54000000),
    Country(name="Peru", region="Americas", population=33000000),
])

class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries

    def summaries(self):
        return [c.summary() for c in self.countries]  # delegates to each Country

print(explorer.summaries())
# ['Kenya (Africa): pop. 54,000,000', 'Peru (Americas): pop. 33,000,000']`,
    },
    {
      h3: 'Growing the collection after construction',
      paragraphs: ['Since self.countries is just a list, everything from Session 02 still applies to it.'],
      code: `nigeria = Country(name="Nigeria", region="Africa", population=223000000)
explorer.countries.append(nigeria)
print(len(explorer.countries))  # one more than before`,
    },
    {
      h3: 'A method that operates across the whole collection',
      paragraphs: ['This is where composition starts to pay off — the outer class can offer operations that make sense at the collection level, built from what each inner object already knows.'],
      code: `class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries

    def summaries(self):
        return [c.summary() for c in self.countries]

    def total_population(self):
        return sum(c.population for c in self.countries)

    def find_by_region(self, region):
        return [c for c in self.countries if c.region == region]`,
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Build a CountryExplorer class that composes a list of Country instances and offers collection-level operations by delegating to each one.',
    whatYouBuild: 'A file called <code>explorer_composed.py</code>.',
    steps: [
      { title: 'Create the file with Country and an empty CountryExplorer', body: [], code: `# explorer_composed.py
class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population

    def summary(self):
        return f"{self.name} ({self.region}): pop. {self.population:,}"


class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries` },
      { title: 'Construct an explorer with 3 countries', body: [], code: `explorer = CountryExplorer(countries=[
    Country(name="Kenya", region="Africa", population=54000000),
    Country(name="Ghana", region="Africa", population=31000000),
    Country(name="Peru", region="Americas", population=33000000),
])
print(len(explorer.countries))` },
      { title: 'Add a summaries() method that delegates to each Country', body: [], code: `class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries

    def summaries(self):
        return [c.summary() for c in self.countries]

explorer = CountryExplorer(countries=[
    Country(name="Kenya", region="Africa", population=54000000),
    Country(name="Peru", region="Americas", population=33000000),
])
for line in explorer.summaries():
    print(line)` },
      { title: 'Add total_population() and find_by_region() methods', body: [], code: `class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries

    def summaries(self):
        return [c.summary() for c in self.countries]

    def total_population(self):
        return sum(c.population for c in self.countries)

    def find_by_region(self, region):
        return [c for c in self.countries if c.region == region]

explorer = CountryExplorer(countries=[
    Country(name="Kenya", region="Africa", population=54000000),
    Country(name="Ghana", region="Africa", population=31000000),
    Country(name="Peru", region="Americas", population=33000000),
])
print(explorer.total_population())
print([c.name for c in explorer.find_by_region("Africa")])` },
      { title: 'Add a country after construction and confirm total_population updates', body: [], code: `explorer.countries.append(Country(name="Nigeria", region="Africa", population=223000000))
print(explorer.total_population())  # reflects the new total automatically` },
    ],
  },
  filesChanged: [
    { file: 'explorer_composed.py', action: 'Created', why: 'CountryExplorer composes and delegates to a list of Country instances.' },
    { file: 'docs/sessions/session-12/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add explorer_composed.py docs/sessions/session-12/index.html\ngit commit -m "session-12: compose CountryExplorer from a list of Country instances"',
  commitQuestion: 'Why does total_population() automatically reflect a country added after construction, without any changes to total_population itself?',
  checklist: [
    'CountryExplorer stores a list of Country instances as self.countries',
    'summaries() delegates to each Country instance\'s own summary() method',
    'total_population() and find_by_region() both operate across the whole collection',
    'A country is appended after construction and total_population() is shown to reflect it',
    'No logic that belongs on Country (like formatting a summary) is duplicated inside CountryExplorer',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Why does total_population() automatically pick up the newly appended country without any code change to total_population itself? Trace through what self.countries actually contains at call time.',
    'What would go wrong if CountryExplorer tried to reimplement summary formatting itself instead of calling c.summary()?',
    'Can you think of a real application where "one object holding a collection of other objects" is the natural shape? (Hint: think of any list-based UI you have used.)',
    'How is CountryExplorer.countries similar to and different from the plain list of dictionaries we used in Session 02?',
  ],
  whatBreaks: [
    { title: 'Duplicated logic', text: 'If CountryExplorer reimplemented formatting or validation instead of delegating to Country\'s own methods, a bug fix would need to happen in two places — and they would inevitably drift out of sync over time.' },
    { title: 'Conditional rendering / logic (Session 13)', text: 'The next session adds conditional logic inside methods, such as handling an empty collection. Composition is what makes "no countries yet" a meaningful, testable state to handle.' },
    { title: 'The whole rest of the project', text: 'Every remaining layer — mock data, testing, architecture, real APIs — operates on a composed structure just like CountryExplorer. This is the shape the entire application is built from.' },
  ],
  learnedConcept: 'Composition — one class holding instances of another, and delegating collection-level work to each inner instance\'s own methods.',
  learnedUnlocks: 'You can now build a real application out of small, focused, cooperating classes instead of one giant class doing everything.',
  nextTeaser: 'We handle the cases where things are missing or empty — conditional logic inside methods, like an empty country list or a country with no known capital.',
},

// ── SESSION 13 ─────────────────────────────────────────────────────
{
  num: 13,
  title: 'Conditional Logic in Methods',
  nextTitle: 'Building Lists of Objects',
  subtitle: 'Real data has gaps. A method needs to behave sensibly when the collection is empty, a value is missing, or a search finds nothing at all.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Write a method that branches based on the state of the instance',
    'Use a ternary (conditional) expression for a short either/or value',
    'Handle an empty list gracefully without a crash or a misleading result',
    'Use the "truthy" nature of empty lists/strings in an if condition',
    'Explain the difference between "no result found" and "an actual error"',
  ],
  quiz: [
    {
      q: 'Given <code>def total_population(self):\\n    return sum(c.population for c in self.countries)</code>, what does this return if self.countries is an empty list?',
      options: { a: 'A TypeError — sum() cannot handle an empty generator', b: '0 — sum() of nothing is 0, no crash', c: 'None', d: 'It raises an IndexError' },
      answer: 'b',
      explain: '<code>sum()</code> of an empty sequence returns <code>0</code> by definition — no special handling is needed here. This is worth confirming explicitly rather than assuming.',
    },
    {
      q: 'What does <code>if self.countries:</code> check, given that self.countries is a list?',
      options: { a: 'Whether self.countries is exactly the value True', b: 'Whether the list has at least one item — an empty list is "falsy", a non-empty one is "truthy"', c: 'Whether self.countries is not None, but ignores emptiness', d: 'It is a syntax error — you must write if len(self.countries) > 0' },
      answer: 'b',
      explain: 'In Python, empty collections (list, dict, string) are falsy, and non-empty ones are truthy. <code>if self.countries:</code> is idiomatic for "does this list have anything in it?" — equivalent to but more idiomatic than checking length explicitly.',
    },
    {
      q: 'Given <code>label = "Africa" if country.region == "Africa" else "Other"</code>, what kind of expression is this?',
      options: { a: 'A regular if statement written on one line', b: 'A ternary (conditional) expression — it evaluates to one of two values inline', c: 'A syntax error — Python has no ternary operator', d: 'A lambda function' },
      answer: 'b',
      explain: 'Python\'s ternary form is <code>value_if_true if condition else value_if_false</code>. It is an expression (it produces a value) rather than a statement, useful for short either/or assignments.',
    },
    {
      q: 'A method find_by_region(region) returns [] when no country matches. Is returning an empty list the same kind of situation as raising an exception?',
      options: { a: 'Yes — both represent a failure and should be handled identically', b: 'No — "found nothing, here is an empty (but valid) result" is a normal outcome; an exception should be reserved for genuinely unexpected or invalid states (Session 07)', c: 'Yes, an empty list should always be converted to a raised exception', d: 'There is no meaningful distinction in Python' },
      answer: 'b',
      explain: 'A search finding zero matches is a completely normal, expected outcome — not an error. Reserve exceptions (Session 07) for truly invalid states, like a negative population. Conflating "not found" with "broken" makes calling code harder to write correctly.',
    },
    {
      q: 'Given a method that must show a message when there are no countries, which is more idiomatic Python?',
      options: { a: '<code>if len(self.countries) == 0:</code>', b: '<code>if not self.countries:</code>', c: '<code>if self.countries == []:</code>', d: 'All three are equally un-idiomatic' },
      answer: 'b',
      explain: '<code>if not self.countries:</code> relies on the truthy/falsy behaviour from this session and is the idiomatic Python style. The other two work but are unnecessarily verbose for the same check.',
    },
  ],
  conceptTitle: 'Conditional Logic in Methods',
  sections: [
    {
      h3: 'Branching based on instance state',
      paragraphs: ['A method can look at self\'s current attributes and behave differently depending on what it finds — exactly like the plain if-statements from earlier sessions, just now reading self instead of a passed-in argument.'],
      code: `class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries

    def status_message(self):
        if not self.countries:
            return "No countries loaded yet."
        return f"{len(self.countries)} countries loaded."

empty_explorer = CountryExplorer(countries=[])
print(empty_explorer.status_message())  # "No countries loaded yet."`,
    },
    {
      h3: 'Truthy and falsy collections',
      paragraphs: ['Python treats an empty list, empty string, empty dict, 0, and None as falsy in a boolean context. A non-empty version of any of them is truthy. This lets you write <code>if not self.countries:</code> instead of the more verbose <code>if len(self.countries) == 0:</code>.'],
      code: `countries = []
print(bool(countries))  # False — empty list is falsy

countries = [1]
print(bool(countries))  # True — non-empty list is truthy

# Idiomatic style
if not countries:
    print("empty")
else:
    print("has items")`,
      diagram: {
        caption: 'Empty collections are falsy; anything with at least one item is truthy.',
        boxes: [
          { label: '[]', text: 'falsy' },
          { label: '[x]', text: 'truthy', accent: true },
        ],
      },
    },
    {
      h3: 'The ternary expression for short either/or values',
      paragraphs: ['When a value simply needs to be one of two things based on a condition, a ternary expression is more compact than a full if/else block, and it produces a value directly rather than a side effect.'],
      code: `def region_or_unknown(country):
    return country.region if country.region else "Unknown"

# equivalent longhand
def region_or_unknown_longhand(country):
    if country.region:
        return country.region
    else:
        return "Unknown"`,
    },
    {
      h3: '"Not found" is not the same as "broken"',
      paragraphs: [
        'Recall Session 07: exceptions are for genuinely invalid states. A search that legitimately finds nothing should return an empty, valid result — not raise an exception. Confusing the two forces every caller to wrap normal searches in try/except unnecessarily.',
      ],
      code: `class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries

    def find_by_region(self, region):
        # Zero matches is a NORMAL outcome — return an empty list, don't raise
        return [c for c in self.countries if c.region == region]

explorer = CountryExplorer(countries=[])
result = explorer.find_by_region("Antarctica")
print(result)  # [] — a valid, empty answer, no crash, no exception`,
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Add conditional logic to CountryExplorer that handles an empty collection gracefully, using truthy checks and a ternary expression.',
    whatYouBuild: 'A file called <code>conditional_lab.py</code>, building on Session 12\'s CountryExplorer.',
    steps: [
      { title: 'Create the file with Country and CountryExplorer', body: [], code: `# conditional_lab.py
class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population

    def summary(self):
        return f"{self.name} ({self.region}): pop. {self.population:,}"


class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries` },
      { title: 'Add a status_message() method using not self.countries', body: [], code: `class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries

    def status_message(self):
        if not self.countries:
            return "No countries loaded yet."
        return f"{len(self.countries)} countries loaded."

empty = CountryExplorer(countries=[])
loaded = CountryExplorer(countries=[Country(name="Kenya", region="Africa", population=54000000)])
print(empty.status_message())
print(loaded.status_message())` },
      { title: 'Add find_by_region() and confirm zero matches returns [] without a crash', body: [], code: `class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries

    def status_message(self):
        if not self.countries:
            return "No countries loaded yet."
        return f"{len(self.countries)} countries loaded."

    def find_by_region(self, region):
        return [c for c in self.countries if c.region == region]

explorer = CountryExplorer(countries=[Country(name="Kenya", region="Africa", population=54000000)])
result = explorer.find_by_region("Antarctica")
print(result)          # []
print(type(result))    # <class 'list'> — never None, never an exception` },
      { title: 'Add a ternary-based method for a country\'s display capital', body: ['Give Country an optional capital, defaulting to None, and add a method that returns it or "Unknown".'], code: `class Country:
    def __init__(self, name, region, population, capital=None):
        self.name = name
        self.region = region
        self.population = population
        self.capital = capital

    def display_capital(self):
        return self.capital if self.capital else "Unknown"

k = Country(name="Kenya", region="Africa", population=54000000, capital="Nairobi")
u = Country(name="Unclaimed", region="Antarctica", population=0)
print(k.display_capital())  # "Nairobi"
print(u.display_capital())  # "Unknown"` },
      { title: 'Confirm status_message on an explorer with one country added after construction', body: [], code: `explorer = CountryExplorer(countries=[])
print(explorer.status_message())  # "No countries loaded yet."
explorer.countries.append(k)
print(explorer.status_message())  # "1 countries loaded." — note the grammar, discuss in reflection` },
    ],
  },
  filesChanged: [
    { file: 'conditional_lab.py', action: 'Created', why: 'Adds conditional branching, truthy checks, and a ternary display method.' },
    { file: 'docs/sessions/session-13/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add conditional_lab.py docs/sessions/session-13/index.html\ngit commit -m "session-13: handle empty collections and missing values with conditional logic"',
  commitQuestion: 'Why does find_by_region return an empty list instead of raising an exception when nothing matches?',
  checklist: [
    'status_message() uses not self.countries, not len(self.countries) == 0',
    'find_by_region() returns an empty list (never raises, never returns None) when nothing matches',
    'display_capital() uses a ternary expression, not a full if/else block',
    'Both an empty and a non-empty explorer are tested against status_message()',
    'A comment or reflection note addresses the "1 countries loaded" grammar issue noticed in step 5',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Step 5 printed "1 countries loaded." — grammatically wrong. How would you fix this with a ternary expression? Try writing it.',
    'Why is returning an empty list from find_by_region a better design than returning None when nothing is found?',
    'Can you think of a case in this lab where using an exception (Session 07) WOULD have been the right choice instead of a normal empty return?',
    'How does the truthy/falsy behaviour of empty lists connect to what you learned about mutability and identity in Session 01 and 02?',
  ],
  whatBreaks: [
    { title: 'None-checking chaos', text: 'If find_by_region sometimes returned None instead of an empty list, every single caller would need an extra None-check before it could safely loop over the result — multiplying defensive code throughout the whole project for no benefit.' },
    { title: 'Building lists of objects (Session 14)', text: 'The next session focuses on constructing many Country instances at once, often from raw data that may have missing fields. This session\'s conditional patterns are what keep that construction from crashing on incomplete records.' },
    { title: 'UI-equivalent states (parallel to the original React course)', text: 'This is directly analogous to Session 13 of the source React course ("Conditional Rendering") — handling an empty search result gracefully is the same problem whether you are printing to a console or rendering to a screen.' },
  ],
  learnedConcept: 'Conditional logic inside methods — truthy/falsy checks on collections, ternary expressions, and treating "not found" as a normal outcome rather than an error.',
  learnedUnlocks: 'CountryExplorer now handles the messy, incomplete cases real data throws at it, without crashing or producing misleading results.',
  nextTeaser: 'We build lists of Country objects from raw data at scale, and formalize the pattern for converting many dicts into many instances.',
},

// ── SESSION 14 ─────────────────────────────────────────────────────
{
  num: 14,
  title: 'Building Lists of Objects',
  nextTitle: 'Object Identity and Equality',
  subtitle: 'Real data rarely arrives as neatly hand-typed Country(...) calls. This session formalizes converting a list of raw dicts into a list of proper Country instances, at any scale.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Convert a list of raw dictionaries into a list of class instances using a comprehension',
    'Write a classmethod that constructs an instance from a dictionary',
    'Explain what @classmethod does and how cls differs from self',
    'Handle a malformed record in the raw data without crashing the whole batch',
    'Combine everything from Layer 1 (comprehensions) and Layer 2 (classes) into one operation',
  ],
  quiz: [
    {
      q: 'Given raw = [{"name": "Kenya", "region": "Africa", "population": 54000000}, ...], which builds a list of Country instances from it?',
      options: { a: '<code>[Country(r) for r in raw]</code>', b: '<code>[Country(**r) for r in raw]</code>', c: '<code>Country(raw)</code>', d: '<code>[Country[r] for r in raw]</code>' },
      answer: 'b',
      explain: 'Recall Session 05: <code>**r</code> spreads each dictionary\'s key-value pairs as keyword arguments into the Country constructor — exactly matching __init__\'s parameter names.',
    },
    {
      q: 'What does <code>@classmethod</code> do to a method like <code>from_dict</code>?',
      options: { a: 'Nothing — it is purely documentation', b: 'It makes the method receive the class itself (conventionally named cls) as its first argument instead of an instance (self)', c: 'It makes the method run automatically at import time', d: 'It prevents the method from being called on an instance' },
      answer: 'b',
      explain: 'A classmethod is bound to the class, not a specific instance. Its first parameter, <code>cls</code>, refers to the class itself — useful for alternate constructors, since you don\'t have an instance yet at the point you\'re trying to build one.',
    },
    {
      q: 'Given <code>@classmethod\\ndef from_dict(cls, data):\\n    return cls(**data)</code>, what does Country.from_dict({"name": "Kenya", "region": "Africa", "population": 54000000}) return?',
      options: { a: 'A TypeError — cls cannot be called like a function', b: 'A new Country instance built from the dict\'s values', c: 'The dict itself, unchanged', d: 'None' },
      answer: 'b',
      explain: 'Inside a classmethod, <code>cls</code> IS the class (Country), so <code>cls(**data)</code> is equivalent to calling <code>Country(**data)</code> — constructing a new instance from the dictionary\'s keys and values.',
    },
    {
      q: 'Why prefer a from_dict classmethod over just calling Country(**d) directly everywhere you need to convert a dict?',
      options: { a: 'There is no real benefit — they behave identically in every case', b: 'from_dict gives you one central place to add validation or handle missing/renamed keys later, without changing every call site', c: 'Country(**d) does not actually work for this purpose', d: 'classmethods run faster than regular constructor calls' },
      answer: 'b',
      explain: 'If the raw data\'s shape changes later (a renamed key, a new required default), you only need to update <code>from_dict</code> once, instead of hunting down every place <code>Country(**d)</code> was called directly.',
    },
    {
      q: 'One raw record is missing the "population" key entirely. Using [Country.from_dict(r) for r in raw] with no error handling, what happens when that record is processed, assuming population has no default in __init__?',
      options: { a: 'It silently skips that record and continues', b: 'A TypeError is raised (missing required argument) and the whole comprehension stops, unless you catch it', c: 'population is automatically set to 0', d: 'It is set to the string "population"' },
      answer: 'b',
      explain: 'Without a default value or error handling, a missing required keyword argument raises a <code>TypeError</code>, which — per Session 07 — will propagate and stop the whole batch unless you wrap the conversion in a try/except to handle bad records individually.',
    },
  ],
  conceptTitle: 'Building Object Lists from Raw Data',
  sections: [
    {
      h3: 'From raw dicts to instances, using what you already know',
      paragraphs: ['This session combines Session 03\'s comprehensions with Session 05\'s ** spreading and Session 09\'s constructors — nothing new syntactically, just a new combination.'],
      code: `class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population

    def summary(self):
        return f"{self.name} ({self.region}): pop. {self.population:,}"

raw = [
    {"name": "Kenya", "region": "Africa", "population": 54000000},
    {"name": "Peru", "region": "Americas", "population": 33000000},
]

countries = [Country(**r) for r in raw]
print(countries[0].summary())  # "Kenya (Africa): pop. 54,000,000"`,
      diagram: {
        caption: 'Each raw dict is spread with ** into a fresh Country() call, one per item — the comprehension pattern from Session 03, now building instances instead of values.',
        boxes: [
          { label: 'raw dicts', text: '{...}, {...}' },
          { label: 'Country(**r)', text: 'per item' },
          { label: 'instances', text: 'Country, Country', accent: true },
        ],
      },
    },
    {
      h3: 'A classmethod as an alternate constructor',
      paragraphs: ['Repeating <code>Country(**r)</code> everywhere you convert a dict works, but centralizing that logic in one place on the class itself is more maintainable. A classmethod is a method bound to the class rather than an instance — useful precisely because you don\'t have an instance yet.'],
      code: `class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population

    @classmethod
    def from_dict(cls, data):
        return cls(**data)  # cls IS the Country class here

kenya = Country.from_dict({"name": "Kenya", "region": "Africa", "population": 54000000})
print(kenya.name)  # "Kenya"`,
    },
    {
      h3: 'cls vs self',
      paragraphs: ['self (regular methods) refers to a specific instance. cls (classmethods) refers to the class itself — the blueprint, not a built thing. This mirrors the class-vs-instance distinction from Session 08.'],
      code: `class Country:
    @classmethod
    def from_dict(cls, data):
        print("cls is:", cls)          # <class '__main__.Country'> — the class itself
        return cls(**data)

    def summary(self):
        print("self is:", self)        # a specific Country instance`,
    },
    {
      h3: 'Handling a bad record without losing the whole batch',
      paragraphs: ['Session 07\'s try/except lets us skip malformed records individually instead of letting one bad record crash the entire conversion.'],
      code: `raw = [
    {"name": "Kenya", "region": "Africa", "population": 54000000},
    {"name": "Ghost Nation"},  # missing region and population!
]

countries = []
for r in raw:
    try:
        countries.append(Country.from_dict(r))
    except TypeError as e:
        print(f"Skipping malformed record {r!r}: {e}")

print(len(countries))  # 1 — only the valid record made it in`,
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Build a from_dict classmethod on Country, convert a batch of raw records with a comprehension, and gracefully skip a malformed one.',
    whatYouBuild: 'A file called <code>build_list_lab.py</code>.',
    steps: [
      { title: 'Create the file with Country and a from_dict classmethod', body: [], code: `# build_list_lab.py
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
      { title: 'Build 4 valid raw records and convert them with a comprehension', body: [], code: `raw = [
    {"name": "Kenya", "region": "Africa", "population": 54000000},
    {"name": "Ghana", "region": "Africa", "population": 31000000},
    {"name": "Peru", "region": "Americas", "population": 33000000},
    {"name": "Japan", "region": "Asia", "population": 125000000},
]

countries = [Country.from_dict(r) for r in raw]
for c in countries:
    print(c.summary())` },
      { title: 'Add one malformed record (missing a required key)', body: [], code: `raw_with_bad_record = raw + [{"name": "Ghost Nation"}]  # missing region, population` },
      { title: 'Convert with a for-loop and try/except, skipping the bad one', body: [], code: `good_countries = []
for r in raw_with_bad_record:
    try:
        good_countries.append(Country.from_dict(r))
    except TypeError as e:
        print(f"Skipping malformed record {r!r}: {e}")

print("Converted successfully:", len(good_countries))
print("Total attempted:", len(raw_with_bad_record))` },
      { title: 'Print cls inside from_dict temporarily to see it is the class, not an instance', body: [], code: `class CountryDebug(Country):
    @classmethod
    def from_dict(cls, data):
        print("cls is:", cls)
        return cls(**data)

CountryDebug.from_dict({"name": "Kenya", "region": "Africa", "population": 54000000})` },
    ],
  },
  filesChanged: [
    { file: 'build_list_lab.py', action: 'Created', why: 'Converts raw dicts into Country instances at scale using a classmethod and comprehension.' },
    { file: 'docs/sessions/session-14/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add build_list_lab.py docs/sessions/session-14/index.html\ngit commit -m "session-14: build Country instances in bulk with a from_dict classmethod"',
  commitQuestion: 'Why does from_dict use cls(**data) instead of Country(**data) directly?',
  checklist: [
    'from_dict is decorated with @classmethod and takes cls as its first parameter',
    'A list comprehension converts multiple raw dicts into Country instances',
    'A malformed record is included and handled with try/except without crashing the batch',
    'The count of successfully converted records is printed and is less than the total attempted',
    'cls is printed at least once to confirm it refers to the class, not an instance',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Why does cls(**data) still work correctly even if this classmethod were inherited by a subclass of Country (which we have not covered, but can you reason about it)?',
    'What would have happened if you used Country(**data) directly inside from_dict instead of cls(**data)? In this specific case, is there a difference?',
    'How does skipping one bad record instead of crashing the whole batch compare to the all-or-nothing behavior you might expect from a stricter language?',
    'Where in a real application would silently skipping bad records be dangerous instead of helpful? What would you do differently there?',
  ],
  whatBreaks: [
    { title: 'One bad record, whole batch lost', text: 'Without the try/except pattern from this session, a single malformed record anywhere in a large dataset would crash the entire conversion — unacceptable for any real data source, which is never perfectly clean.' },
    { title: 'Object identity confusion (Session 15)', text: 'The next session (the Layer 2 gate) asks whether two Country instances built from identical data are "the same" — a question you can only reason about clearly once you are comfortable constructing many instances from data, as this session taught.' },
    { title: 'The mock data layer (Layer 4)', text: 'Session 24\'s data-access layer is built almost entirely from the from_dict pattern in this session, applied to a whole file of mock JSON records.' },
  ],
  learnedConcept: 'Bulk-converting raw dicts into class instances with a from_dict classmethod, and skipping malformed records individually with try/except.',
  learnedUnlocks: 'You can now turn any batch of raw dict-shaped data into a real list of working objects — the exact operation every future data source will require.',
  nextTeaser: 'Layer 2 gate. We ask a subtle question: what does it mean for two objects to be "the same" — identity vs equality.',
},

// ── SESSION 15 ─────────────────────────────────────────────────────
{
  num: 15,
  title: 'Object Identity and Equality',
  nextTitle: 'What Is State in a Program?',
  subtitle: 'This is the Layer 2 gate. Two Country instances can hold identical data yet not be "the same" — understanding why is essential before we start tracking objects by identity in collections.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Explain the difference between is (identity) and == (equality)',
    'Predict the default behaviour of == on a plain class with no __eq__ defined',
    'Implement __eq__ so two instances with the same data compare equal',
    'Explain why id() returns a different value for two distinct instances, even with identical attributes',
    'Recognise when identity comparison (is) is actually the correct tool, e.g. is None',
  ],
  quiz: [
    {
      q: 'Given <code>a = Country(name="Kenya", region="Africa", population=54000000)</code> and <code>b = Country(name="Kenya", region="Africa", population=54000000)</code> with NO __eq__ defined, what does <code>a == b</code> return?',
      options: { a: 'True — because all their attribute values match', b: 'False — by default, == falls back to identity comparison (is), and a and b are two separate instances', c: 'A TypeError — you cannot compare instances', d: 'It depends on the order the instances were created' },
      answer: 'b',
      explain: 'Without a custom <code>__eq__</code>, Python\'s default equality check for objects is identical to <code>is</code> — same object in memory, not same data. Two separately constructed instances are never == by default, no matter how identical their attributes look.',
    },
    {
      q: 'What does <code>a is b</code> check, as opposed to <code>a == b</code>?',
      options: { a: 'They check exactly the same thing in Python', b: '<code>is</code> checks whether a and b refer to the exact same object in memory; <code>==</code> checks value equality (which can be customized)', c: '<code>is</code> is only valid for strings and numbers', d: '<code>is</code> checks attribute equality; == checks memory address' },
      answer: 'b',
      explain: '<code>is</code> is identity comparison — are these literally the same object? <code>==</code> is equality comparison — by default the same as <code>is</code> for custom classes, but overridable via <code>__eq__</code> to compare by value instead.',
    },
    {
      q: 'After adding <code>def __eq__(self, other):\\n    return self.name == other.name and self.region == other.region and self.population == other.population</code> to Country, what does a == b return for the a, b from question 1?',
      options: { a: 'Still False — __eq__ has no effect on ==', b: 'True — == now uses your custom comparison, and every field matches', c: 'A TypeError, because __eq__ cannot be defined for classes', d: 'True only if a is b is also True' },
      answer: 'b',
      explain: 'Defining <code>__eq__</code> overrides the default identity-based comparison. Python calls your method whenever <code>==</code> is used between two Country instances, and since every field matches, it returns True.',
    },
    {
      q: 'After defining __eq__ as above, is a is b now True as well?',
      options: { a: 'Yes — __eq__ also changes what is checks', b: 'No — is is unaffected by __eq__ and still checks memory identity; a and b remain two distinct objects', c: 'It becomes undefined behaviour', d: 'Only if population also happens to be 0' },
      answer: 'b',
      explain: '<code>__eq__</code> only customizes <code>==</code>. <code>is</code> always checks raw identity and cannot be overridden by a class — a and b are still two separate objects in memory, regardless of how you define equality.',
    },
    {
      q: 'Why is x is None considered more correct/idiomatic than x == None in Python?',
      options: { a: 'They behave identically, it is pure style', b: 'None is a true singleton — there is only ever one None object — so identity comparison is the semantically precise and conventional check', c: '== None always raises an error', d: 'is None is faster but semantically identical, so it never matters' },
      answer: 'b',
      explain: 'Python guarantees there is exactly one <code>None</code> object in the entire program. Checking identity against it is both the idiomatic style and avoids any surprises from a class that might override <code>__eq__</code> in an unexpected way.',
    },
  ],
  conceptTitle: 'Identity vs Equality',
  sections: [
    {
      h3: 'Two instances with identical data are not automatically equal',
      paragraphs: ['This surprises many people coming from other backgrounds. By default, comparing two custom-class instances with == checks whether they are the exact same object — not whether their data matches.'],
      code: `class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population

a = Country(name="Kenya", region="Africa", population=54000000)
b = Country(name="Kenya", region="Africa", population=54000000)

print(a == b)  # False! Same data, but no __eq__ defined
print(a is b)  # False — definitely two separate objects
print(a is a)  # True — an object is always identical to itself`,
    },
    {
      h3: 'id() reveals the underlying memory identity',
      paragraphs: ['Every object has a unique identity while it exists, which id() reveals as a number (conceptually, its memory address). This is what is actually compares.'],
      code: `print(id(a))  # some large number, e.g. 140234...
print(id(b))  # a DIFFERENT large number
print(id(a) == id(b))  # False
print(a is b)           # False — is is really just id(a) == id(b)`,
      diagram: {
        caption: 'a and b are separate objects with separate identities, even though their contents happen to match.',
        boxes: [
          { label: 'a', text: 'id: 1001\nname: "Kenya"' },
          { label: 'b', text: 'id: 1002\nname: "Kenya"', accent: true },
        ],
      },
    },
    {
      h3: 'Defining __eq__ to compare by value',
      paragraphs: ['If you want == to mean "same data" instead of "same object", define __eq__ yourself. This is a dunder method — a special, double-underscore method Python calls automatically for a specific operator, similar in spirit to __init__.'],
      code: `class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population

    def __eq__(self, other):
        return (
            self.name == other.name
            and self.region == other.region
            and self.population == other.population
        )

a = Country(name="Kenya", region="Africa", population=54000000)
b = Country(name="Kenya", region="Africa", population=54000000)

print(a == b)  # True now — __eq__ compares field by field
print(a is b)  # Still False — is is never affected by __eq__`,
    },
    {
      h3: 'When identity (is) is actually the right tool',
      paragraphs: ['is is not "wrong" — it is the correct choice when you specifically care about object identity, most commonly when comparing against the None singleton.'],
      code: `capital = None

if capital is None:      # idiomatic — checking identity against the None singleton
    print("No capital on file")

# vs. == which would also work here, but is not the conventional style
if capital == None:      # works, but not idiomatic Python
    print("No capital on file")`,
    },
  ],
  callout: {
    title: 'Layer 2 gate:',
    text: 'This is the last Layer 2 session. Every remaining layer assumes you can correctly reason about whether two objects are "the same" versus merely "equal" — this distinction underlies testing assertions in Layer 5 and data deduplication in Layer 4.',
  },
  closing: null,
  lab: {
    objective: 'Prove the default identity-based equality, implement a custom __eq__, and demonstrate is None as the idiomatic check.',
    whatYouBuild: 'A file called <code>identity_lab.py</code>.',
    steps: [
      { title: 'Create the file with a Country class and NO __eq__ yet', body: [], code: `# identity_lab.py
class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population` },
      { title: 'Create two instances with identical data and compare them', body: ['Before running: predict what a == b will print, and why.'], code: `a = Country(name="Kenya", region="Africa", population=54000000)
b = Country(name="Kenya", region="Africa", population=54000000)

print("a == b:", a == b)  # what do you expect?
print("a is b:", a is b)
print("id(a):", id(a))
print("id(b):", id(b))` },
      { title: 'Add __eq__ to compare by value and re-run the comparison', body: [], code: `class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population

    def __eq__(self, other):
        return (
            self.name == other.name
            and self.region == other.region
            and self.population == other.population
        )

a = Country(name="Kenya", region="Africa", population=54000000)
b = Country(name="Kenya", region="Africa", population=54000000)
print("a == b now:", a == b)  # True
print("a is b still:", a is b)  # still False` },
      { title: 'Prove __eq__ correctly returns False for genuinely different data', body: [], code: `c = Country(name="Peru", region="Americas", population=33000000)
print("a == c:", a == c)  # False — different data, correctly not equal` },
      { title: 'Demonstrate is None as the idiomatic missing-value check', body: ['Give Country an optional capital and check it both ways, noting which is idiomatic.'], code: `capital = None
print(capital is None)   # idiomatic
print(capital == None)   # works, but not the conventional style — explain why in a comment` },
    ],
  },
  filesChanged: [
    { file: 'identity_lab.py', action: 'Created', why: 'Demonstrates default identity-based equality, a custom __eq__, and is None.' },
    { file: 'docs/sessions/session-15/index.html', action: 'Created', why: 'This session document — Layer 2 gate.' },
  ],
  commitCmd: 'git add identity_lab.py docs/sessions/session-15/index.html\ngit commit -m "session-15: implement value-based __eq__ and distinguish it from identity"',
  commitQuestion: 'Why does a is b stay False even after I defined __eq__ to make a == b return True?',
  checklist: [
    'a == b is printed and observed to be False BEFORE __eq__ is added',
    '__eq__ is implemented comparing every relevant field',
    'a == b is proven True after __eq__ is added, using two separately constructed instances with identical data',
    'a is b is proven to remain False throughout, unaffected by __eq__',
    'is None is used and preferred over == None with a comment explaining why',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Before running the lab, did you correctly predict that a == b would be False without __eq__? If not, what was your mental model, and how has it changed?',
    'Why does Python NOT give every class value-based equality by default? Can you think of a reason that would be a bad default?',
    'If you were writing a test in Layer 5 that checks "did this function return the right Country?", would you use == or is? Why?',
    'How does the id()-based explanation of is connect back to the shared-reference behaviour of dictionaries from Session 01?',
  ],
  whatBreaks: [
    { title: 'False negatives in comparisons', text: 'Code that assumes two identically-built objects are automatically == (without a custom __eq__) will silently fail comparisons that should have succeeded — a subtle bug that only appears when you actually try to compare two objects and get a surprising False.' },
    { title: 'Testing assertions (Layer 5)', text: 'Test frameworks in Session 29 rely heavily on == to check "did the function return what I expected?" If a class does not implement __eq__, every such test will need clumsy, error-prone field-by-field comparisons instead of a clean assertEqual.' },
    { title: 'Deduplicating data (Layer 4)', text: 'When we design data contracts and work with real data sources in Layer 4, detecting duplicate records requires exactly the value-based equality this session teaches — the default identity comparison would treat every record as unique, even genuine duplicates.' },
  ],
  learnedConcept: 'Identity (is) vs equality (==) — the default identity-based comparison for custom classes, overriding it with __eq__, and when is is still the right tool.',
  learnedUnlocks: 'You can now reason precisely about whether two objects are literally the same or merely hold the same data — required for every comparison-heavy session ahead.',
  nextTeaser: 'Layer 3 begins. We start tracking data that changes over the lifetime of a running program — state.',
},

// ── SESSION 16 ─────────────────────────────────────────────────────
{
  num: 16,
  title: 'What Is State in a Program?',
  nextTitle: 'Updating State via Methods',
  subtitle: 'Layer 3 begins. Everything so far has been static — built once and read. State is data that legitimately changes while a program runs, and tracking it correctly is a skill of its own.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Define "state" as data that changes over the lifetime of a running program',
    'Distinguish construction-time data (Session 11) from data that is expected to change afterward',
    'Explain why uncontrolled mutation of shared state causes bugs that are hard to trace',
    'Identify which attributes of Country and CountryExplorer are state versus fixed identity',
    'Recognise this as a concept-only session, mirroring Session 08\'s approach',
  ],
  quiz: [
    {
      q: 'Which of these Country attributes is most clearly "state" — data expected to change during the program\'s life — versus a fixed identifying property?',
      options: { a: 'name — a country\'s name essentially never changes during a program run', b: 'population — plausibly grows, shrinks, or gets corrected while the program runs', c: 'Both are equally state', d: 'Neither is state; state only applies to numbers' },
      answer: 'b',
      explain: 'population is a value we would realistically expect to be updated (Session 10\'s grow_population) while the program runs — the definition of state. name is closer to a fixed identifying property for the object\'s lifetime.',
    },
    {
      q: 'A CountryExplorer\'s .countries list grows as more data loads in. Is that state?',
      options: { a: 'No — lists cannot be state, only numbers and strings can', b: 'Yes — the collection changing shape over time (via .append()) is exactly what state means', c: 'Only if the list is empty at the start', d: 'It depends on how the list was constructed' },
      answer: 'b',
      explain: 'State is not limited to primitive values — any data that legitimately changes while the program runs is state, including collections that grow, shrink, or get reordered.',
    },
    {
      q: 'Two different parts of a program both hold a reference to the same CountryExplorer instance. One part appends a country. What happens from the other part\'s point of view?',
      options: { a: 'Nothing — each reference has its own independent copy', b: 'The other part sees the new country too, because both references point to the same shared state (Session 01\'s reference behaviour)', c: 'A RuntimeError is raised for concurrent access', d: 'The append is silently ignored' },
      answer: 'b',
      explain: 'This is Session 01\'s reference lesson applied to state specifically: if two parts of a program share a reference to the same mutable object, a change made through either one is visible through both — which is powerful, but also the source of many state-related bugs if not managed deliberately.',
    },
    {
      q: 'Why can uncontrolled, scattered mutation of shared state be hard to debug?',
      options: { a: 'Python does not allow mutation, so this scenario cannot occur', b: 'When many different parts of the code can change the same state directly, it becomes hard to know which part caused an unexpected value, since there is no single place responsible for the change', c: 'Mutation is always slower than creating new objects, which is the only downside', d: 'It is not actually hard to debug — this is a myth' },
      answer: 'b',
      explain: 'If any code, anywhere, can freely mutate shared state, tracing "why is this value wrong" requires checking every possible mutation site instead of one controlled entry point — this is exactly the problem Session 17\'s controlled updates will address.',
    },
    {
      q: 'Why is this session mostly concept and almost no new syntax?',
      options: { a: 'Because state does not actually require any new Python features — it is a new way of thinking about attributes and mutation you already know how to write', b: 'Because state is not actually important', c: 'Because Python has no support for mutable state', d: 'Because the syntax was already covered in Session 01 and needs no further explanation ever' },
      answer: 'a',
      explain: 'Just like Session 08 (What Classes Are and Why), this session builds a mental model using tools you already have — attributes and mutation. The next sessions build concrete, controlled patterns for managing it well.',
    },
  ],
  conceptTitle: 'State',
  sections: [
    {
      h3: 'State is data that changes while the program runs',
      paragraphs: [
        'Every attribute we have written so far has technically been mutable — but not every attribute is meant to change. "State" specifically means data that is expected and designed to change over the lifetime of a running program, in response to something happening.',
      ],
      code: `class Country:
    def __init__(self, name, region, population):
        self.name = name          # fixed identity — not expected to change
        self.region = region      # fixed identity — not expected to change
        self.population = population  # STATE — expected to change over time`,
    },
    {
      h3: 'Construction-time data vs state',
      paragraphs: [
        'Session 11 established that data arrives explicitly through the constructor. Some of that data stays fixed for the object\'s lifetime (like name); other data is the object\'s starting state, expected to evolve afterward (like population, which grow_population already updates).',
      ],
      diagram: {
        caption: 'Construction sets the starting values. State is the subset expected to keep changing afterward, through controlled methods.',
        boxes: [
          { label: 'construction', text: 'name, region,\npopulation (start)' },
          { label: 'over time', text: 'population\nkeeps changing', accent: true },
        ],
      },
    },
    {
      h3: 'A collection can be state too',
      paragraphs: ['CountryExplorer.countries is state — it grows as data loads, and potentially shrinks or reorders based on user actions later in the project.'],
      code: `class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries  # starts here, but this list is STATE — it changes over time

explorer = CountryExplorer(countries=[])
explorer.countries.append(Country(name="Kenya", region="Africa", population=54000000))
# .countries just changed shape — this is state changing over the program's lifetime`,
    },
    {
      h3: 'Why uncontrolled mutation is risky',
      paragraphs: [
        'If any part of a large program can reach in and mutate shared state directly, tracing an unexpected value back to its cause becomes very difficult — there is no single place to look. The next several sessions build the discipline of changing state only through deliberate, well-named methods.',
      ],
      code: `# Risky — anyone, anywhere, can silently corrupt state
explorer.countries[0].population = -999999  # no validation, no traceability

# Better (Session 17 formalizes this) — a controlled method with rules
explorer.countries[0].grow_population(1000000)  # validated, named, traceable`,
    },
  ],
  callout: {
    title: 'Concept-only session:',
    text: 'Like Session 08, there is very little new code today. The goal is recognising state as a distinct concept from ordinary attributes before Session 17 gives us controlled patterns for updating it.',
  },
  closing: null,
  lab: {
    objective: 'Identify and annotate which attributes across the project so far are state versus fixed identity, and observe uncontrolled mutation firsthand.',
    whatYouBuild: 'A file called <code>state_concept.py</code> — mostly comments and small demonstrations, not new functionality.',
    steps: [
      { title: 'Create the file and re-declare Country and CountryExplorer', body: [], code: `# state_concept.py
class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population

class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries` },
      { title: 'Annotate each attribute with a comment: STATE or FIXED', body: ['This is the most important step — write your reasoning, not just a label.'], code: `class Country:
    def __init__(self, name, region, population):
        self.name = name              # FIXED — identity, not expected to change
        self.region = region          # FIXED — identity, not expected to change
        self.population = population  # STATE — expected to change over time (Session 10)

class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries    # STATE — grows/shrinks as data loads (Session 12)` },
      { title: 'Demonstrate uncontrolled mutation directly and observe it works with no guardrails', body: [], code: `k = Country(name="Kenya", region="Africa", population=54000000)
k.population = -999999   # directly assigned, bypassing any validation
print(k.population)      # -999999 — nothing stopped this` },
      { title: 'Demonstrate two references sharing the same mutable state', body: ['Recall Session 01 — prove it applies to real objects too, not just dicts.'], code: `explorer = CountryExplorer(countries=[k])
same_explorer = explorer  # NOT a copy — same reference

same_explorer.countries.append(Country(name="Ghana", region="Africa", population=31000000))
print(len(explorer.countries))       # 2 — the change is visible through BOTH names
print(len(same_explorer.countries))  # 2` },
      { title: 'Write a short comment describing the risk you just observed', body: ['No new code required — summarize, in your own words, why direct attribute assignment (step 3) is risky compared to a controlled method.'] },
    ],
  },
  filesChanged: [
    { file: 'state_concept.py', action: 'Created', why: 'Identifies state vs fixed attributes and demonstrates uncontrolled mutation risk.' },
    { file: 'docs/sessions/session-16/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add state_concept.py docs/sessions/session-16/index.html\ngit commit -m "session-16: identify state vs fixed attributes and observe uncontrolled mutation risk"',
  commitQuestion: 'In my own words, what makes population "state" while name is not?',
  checklist: [
    'Every attribute in Country and CountryExplorer is annotated STATE or FIXED with reasoning',
    'Uncontrolled direct mutation (k.population = -999999) is demonstrated and its lack of guardrails is noted',
    'Two references to the same CountryExplorer are shown to share mutations, connecting back to Session 01',
    'A written comment explains the risk of uncontrolled mutation in your own words',
    'No validation or controlled-update code is added yet — that is intentionally next session',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Is region truly always fixed? Can you think of a real-world scenario (e.g. historical border changes) where it might legitimately need to be state instead?',
    'Why do you think this session deliberately shows you the RISK of uncontrolled mutation before Session 17 shows you the SOLUTION?',
    'How does "two references sharing mutable state" in this session\'s lab connect back to Session 01\'s object mutation, Session 09\'s independent instances, and Session 12\'s composition?',
    'Where in a large real application would uncontrolled state mutation be catastrophic versus merely annoying?',
  ],
  whatBreaks: [
    { title: 'Untraceable bugs', text: 'A program where any code anywhere can mutate any state directly makes "why is this value wrong" a search through the entire codebase instead of a single, well-known method — this is the single most common source of hard-to-debug real-world software issues.' },
    { title: 'Controlled updates (Session 17)', text: 'The next session channels all state changes through named, validating methods. Without today\'s clear sense of what counts as state, that discipline will feel like unnecessary ceremony instead of a direct fix for a problem you just observed yourself.' },
    { title: 'Re-render logic (parallel to the original course\'s Session 19)', text: 'This mirrors exactly why the source React course treats state as sacred — uncontrolled mutation there breaks UI updates. Here, it breaks traceability. The underlying discipline is the same.' },
  ],
  learnedConcept: 'State — data expected to change during a program\'s run, distinct from fixed identity data, and the risk of mutating it without a controlled entry point.',
  learnedUnlocks: 'You can now identify state in any class you design, and you have directly observed why uncontrolled mutation is a real problem, not a theoretical one.',
  nextTeaser: 'We formalize controlled state updates through named, validating methods — turning the risk from this session into a solved problem.',
},

// ── SESSION 17 ─────────────────────────────────────────────────────
{
  num: 17,
  title: 'Updating State via Methods',
  nextTitle: 'Handling User Input',
  subtitle: 'Direct attribute assignment lets anyone set invalid state from anywhere. This session channels every state change through named, validating methods instead.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Rewrite direct attribute mutation as a named, validating method call',
    'Design a method name that clearly communicates what state change it performs',
    'Validate a proposed state change before applying it, reusing Session 07\'s exception patterns',
    'Explain why "one method, one clear responsibility" makes state changes traceable',
    'Add a second controlled-update method to CountryExplorer for adding a country safely',
  ],
  quiz: [
    {
      q: 'Compare <code>k.population = -999999</code> to <code>k.grow_population(-999999)</code> where grow_population validates its input. What is the key difference?',
      options: { a: 'They have identical effects and identical safety', b: 'The direct assignment bypasses any validation entirely; the method call can reject the invalid value and raise a clear error instead', c: 'The method call is always slower, that is the only difference', d: 'Direct assignment is actually safer because it is simpler' },
      answer: 'b',
      explain: 'Direct attribute assignment has no opportunity to check the value first. A method is a checkpoint — it can inspect the proposed change and reject it (Session 07\'s raise) before any bad data is ever stored.',
    },
    {
      q: 'Why is a specific method name like set_capital(new_capital) preferred over a generic update(field, value) method that can change any attribute?',
      options: { a: 'Generic methods are always faster', b: 'A specific method name documents exactly what change is intended and can validate that one specific case correctly; a generic method either validates nothing or needs complex logic for every possible field', c: 'There is no meaningful difference between the two approaches', d: 'Python does not allow generic update methods' },
      answer: 'b',
      explain: 'A specific method like <code>set_capital</code> can say, precisely, "capital must be a non-empty string" — a generic <code>update(field, value)</code> either has to special-case every possible field internally (messy) or skip validation entirely (unsafe).',
    },
    {
      q: 'Given a method <code>def set_population(self, value):\\n    if value < 0:\\n        raise ValueError(...)\\n    self.population = value</code>, what happens if you call it with a negative number?',
      options: { a: 'self.population silently becomes 0', b: 'A ValueError is raised BEFORE self.population is touched — the state remains at its previous valid value', c: 'self.population becomes the negative value anyway, after printing a warning', d: 'The program crashes with no traceback' },
      answer: 'b',
      explain: 'The validation check runs and raises before the assignment line ever executes. This guarantees the object\'s state can never become invalid through this method — the invalid value is rejected, and the previous valid state is preserved.',
    },
    {
      q: 'Why does "every state change goes through a named method" make debugging easier than uncontrolled direct assignment (from Session 16)?',
      options: { a: 'It does not actually help — this is a myth', b: 'When something goes wrong, you can search the codebase for calls to that specific method instead of every possible attribute assignment anywhere', c: 'Named methods run in a special debug mode automatically', d: 'It only helps for numeric attributes, not strings' },
      answer: 'b',
      explain: 'If <code>population</code> can only change via <code>grow_population()</code> or <code>set_population()</code>, then tracing an unexpected value means searching for calls to those two specific methods — a vastly smaller search space than "anywhere in the codebase that touches .population directly."',
    },
    {
      q: 'You add an add_country(self, country) method to CountryExplorer that validates the argument is a Country instance before appending. Why is this better than callers doing explorer.countries.append(x) directly?',
      options: { a: 'It is not better — .append() is already perfectly safe', b: 'add_country can reject a non-Country value before it enters the collection, keeping every item in self.countries guaranteed to be a valid Country', c: 'add_country is required syntax in Python for all lists', d: 'There is no difference in behavior, only in typing speed' },
      answer: 'b',
      explain: 'Without a controlled entry point, nothing stops <code>explorer.countries.append("not a country")</code> from corrupting the collection\'s invariant that every item is a Country instance. A validating method is the checkpoint that guarantees this stays true.',
    },
  ],
  conceptTitle: 'Controlled State Updates',
  sections: [
    {
      h3: 'From direct assignment to a named method',
      paragraphs: ['Session 10 already introduced grow_population as a validating method. This session generalizes that pattern: every state change should go through a method, never a bare attribute assignment from outside the class.'],
      code: `class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population

    def grow_population(self, amount):
        if amount < 0:
            raise ValueError(f"amount must be non-negative, got {amount}")
        self.population += amount

    def set_population(self, value):
        if value < 0:
            raise ValueError(f"population must be non-negative, got {value}")
        self.population = value  # only reachable if the value passed validation`,
      diagram: {
        caption: 'A method acts as a checkpoint — invalid values are rejected before they ever reach the attribute.',
        boxes: [
          { label: 'proposed value', text: '-999999' },
          { label: 'validation', text: 'rejected\n(ValueError)', accent: true },
          { label: 'self.population', text: 'unchanged' },
        ],
      },
    },
    {
      h3: 'Naming a method to communicate intent',
      paragraphs: ['A generic update(field, value) method either needs complicated per-field logic or skips validation entirely. Specific method names — set_population, grow_population, set_capital — each validate exactly one clear case.'],
      code: `# Avoid: a generic method that has to guess what "field" even means
def update(self, field, value):
    setattr(self, field, value)  # no validation possible here — dangerous

# Prefer: specific, self-documenting, individually validated methods
def set_capital(self, new_capital):
    if not new_capital:
        raise ValueError("capital cannot be empty")
    self.capital = new_capital`,
    },
    {
      h3: 'Extending the pattern to CountryExplorer',
      paragraphs: ['The same discipline applies to the collection-level state from Session 12 — an add_country method guarantees every item in the list is actually a valid Country.'],
      code: `class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries

    def add_country(self, country):
        if not isinstance(country, Country):
            raise TypeError(f"expected a Country instance, got {type(country).__name__}")
        self.countries.append(country)

explorer = CountryExplorer(countries=[])
explorer.add_country(Country(name="Kenya", region="Africa", population=54000000))
print(len(explorer.countries))  # 1

# explorer.add_country("not a country")  # raises TypeError — caught before corrupting the list`,
    },
    {
      h3: 'Why this actually solves Session 16\'s risk',
      paragraphs: ['Once population can only change through grow_population or set_population, tracing an unexpected value means checking those two call sites — not the entire codebase.'],
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Add set_population, set_capital, and add_country as controlled, validating state-change methods, replacing direct attribute assignment.',
    whatYouBuild: 'A file called <code>controlled_state.py</code>.',
    steps: [
      { title: 'Create the file with Country including grow_population from Session 10', body: [], code: `# controlled_state.py
class Country:
    def __init__(self, name, region, population, capital=None):
        self.name = name
        self.region = region
        self.population = population
        self.capital = capital

    def grow_population(self, amount):
        if amount < 0:
            raise ValueError(f"amount must be non-negative, got {amount}")
        self.population += amount` },
      { title: 'Add set_population and set_capital methods, both validating', body: [], code: `class Country:
    def __init__(self, name, region, population, capital=None):
        self.name = name
        self.region = region
        self.population = population
        self.capital = capital

    def grow_population(self, amount):
        if amount < 0:
            raise ValueError(f"amount must be non-negative, got {amount}")
        self.population += amount

    def set_population(self, value):
        if value < 0:
            raise ValueError(f"population must be non-negative, got {value}")
        self.population = value

    def set_capital(self, new_capital):
        if not new_capital:
            raise ValueError("capital cannot be empty")
        self.capital = new_capital` },
      { title: 'Prove invalid changes are rejected and valid state is preserved', body: [], code: `k = Country(name="Kenya", region="Africa", population=54000000)

try:
    k.set_population(-5)
except ValueError as e:
    print("Rejected:", e)

print("Population still valid:", k.population)  # unchanged — still 54000000

try:
    k.set_capital("")
except ValueError as e:
    print("Rejected:", e)` },
      { title: 'Add add_country to CountryExplorer with type validation', body: [], code: `class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries

    def add_country(self, country):
        if not isinstance(country, Country):
            raise TypeError(f"expected a Country instance, got {type(country).__name__}")
        self.countries.append(country)

explorer = CountryExplorer(countries=[])
explorer.add_country(k)
print(len(explorer.countries))` },
      { title: 'Attempt to add an invalid item and confirm it is rejected', body: [], code: `try:
    explorer.add_country("not a country")
except TypeError as e:
    print("Rejected:", e)

print("Collection still valid, length:", len(explorer.countries))  # still 1` },
    ],
  },
  filesChanged: [
    { file: 'controlled_state.py', action: 'Created', why: 'Replaces direct attribute assignment with validating set_population, set_capital, and add_country methods.' },
    { file: 'docs/sessions/session-17/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add controlled_state.py docs/sessions/session-17/index.html\ngit commit -m "session-17: channel all state changes through validating methods"',
  commitQuestion: 'Why does the object\'s state stay valid even after I tried to set an invalid population?',
  checklist: [
    'set_population and set_capital both validate before assigning',
    'A rejected set_population call is proven to leave the previous valid population untouched',
    'add_country validates its argument type before appending to self.countries',
    'A rejected add_country call is proven to leave the collection\'s length unchanged',
    'No code in the file assigns to .population, .capital, or .countries directly from outside the class',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Compare this session\'s code to Session 16\'s uncontrolled mutation demo. Walk through, step by step, why the exact same invalid value (-999999 or empty string) is now safely rejected.',
    'What would a generic update(field, value) version of set_population and set_capital look like, and why is it worse for validation specifically?',
    'If a bug report said "population went negative somewhere," how would having these controlled methods change your debugging process compared to Session 16\'s version?',
    'Is there a state change you can think of for Country or CountryExplorer that this session did not cover, but probably should have its own controlled method?',
  ],
  whatBreaks: [
    { title: 'Silent data corruption returns', text: 'If even one code path in a large project still assigns .population directly instead of calling set_population, the guarantee this whole session builds is broken — controlled state updates only work if EVERY mutation goes through the checkpoint, with no exceptions.' },
    { title: 'Event handling (Session 18)', text: 'The next session adds user input as a trigger for these exact methods. Without a solid, validated set_population/set_capital to call INTO, handling user input safely is not possible.' },
    { title: 'Data contracts (Layer 4)', text: 'Session 26 formalizes exactly this kind of validation using type hints and dataclasses — this session is the hand-rolled version of a discipline that later gets language-level support.' },
  ],
  learnedConcept: 'Controlled state updates — validating, specifically-named methods as the only path to changing an object\'s state, replacing direct attribute assignment.',
  learnedUnlocks: 'Country and CountryExplorer can no longer silently enter an invalid state — every change is validated at a single, traceable checkpoint.',
  nextTeaser: 'We connect these controlled methods to an actual trigger: input typed by a user at the keyboard.',
},

// ── SESSION 18 ─────────────────────────────────────────────────────
{
  num: 18,
  title: 'Handling User Input',
  nextTitle: 'Tracing State Changes',
  subtitle: 'State changes need a trigger. In a real program, that trigger is often a user typing something. We connect input() to the controlled methods from Session 17.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Read a line of text from the user with input()',
    'Explain why input() always returns a string, and why that matters for numeric fields',
    'Convert and validate user input before passing it into a controlled state method',
    'Build a small text-based menu loop that dispatches to different actions',
    'Handle invalid user input (non-numeric text) without crashing the program',
  ],
  quiz: [
    {
      q: 'What is the type of the value returned by <code>input("Enter population: ")</code>, regardless of what the user types?',
      options: { a: 'It matches whatever the user typed — int if they typed digits, str otherwise', b: 'Always str — input() never returns anything else', c: 'Always int', d: 'None, until you press Enter twice' },
      answer: 'b',
      explain: '<code>input()</code> always returns a string, no matter what characters the user typed. If you need a number, you must convert it yourself, typically with <code>int()</code> or <code>float()</code>, and handle the case where the conversion fails.',
    },
    {
      q: 'A user types "fifty" when asked for a population. What happens if you call <code>int(user_input)</code> directly with no error handling?',
      options: { a: 'It returns 0', b: 'It raises a ValueError, since "fifty" cannot be parsed as an integer', c: 'It silently rounds to the nearest number', d: 'It returns the string unchanged' },
      answer: 'b',
      explain: '<code>int()</code> raises <code>ValueError</code> on text that is not a valid integer literal. Per Session 07, this needs a try/except around it, or the program crashes on the very first bad keystroke.',
    },
    {
      q: 'Why should raw user input be validated and converted BEFORE being passed to a method like set_population, rather than passing the raw string directly?',
      options: { a: 'set_population can accept strings just fine, so it does not matter', b: 'set_population expects a number for its comparison (value < 0); passing a string would raise a TypeError inside the method instead of failing clearly at the input boundary', c: 'Python automatically converts strings to numbers when needed', d: 'There is no real reason, it is just convention' },
      answer: 'b',
      explain: 'Comparing a string to an int with <code>value < 0</code> raises a <code>TypeError</code> in Python. Converting and validating at the input boundary produces a clearer, more specific error message right where the bad data entered the program.',
    },
    {
      q: 'In a text menu loop like <code>while True: choice = input("> ")\\n    if choice == "quit": break</code>, what happens if the user just presses Enter with no text?',
      options: { a: 'The loop crashes immediately', b: 'choice becomes an empty string "", which does not match "quit", so the loop continues asking again', c: 'The program exits automatically', d: 'input() blocks forever' },
      answer: 'b',
      explain: 'An empty line from the user is still a valid (empty) string. It simply fails the <code>== "quit"</code> check like any other non-matching input, so the loop naturally continues and prompts again.',
    },
    {
      q: 'What is the safest pattern for reading a required number from a user who might type invalid text?',
      options: { a: 'Assume the user always types correctly and skip validation', b: 'Wrap int(input(...)) in a loop with try/except, re-prompting on ValueError until valid input is given', c: 'Use float() instead of int(), which never raises errors', d: 'Read the input as a list instead of a string' },
      answer: 'b',
      explain: 'Looping with try/except around the conversion lets you catch bad input, tell the user what went wrong, and re-prompt — rather than crashing on the first typo, which is unacceptable for anything meant to be used interactively.',
    },
  ],
  conceptTitle: 'Reading and Validating User Input',
  sections: [
    {
      h3: 'input() always returns a string',
      paragraphs: ['The built-in input() function pauses the program, waits for the user to type a line and press Enter, and returns exactly what they typed — always as a string, never automatically converted.'],
      code: `name = input("Enter a country name: ")
print(type(name))  # <class 'str'> — always, even if they typed "54000000"`,
    },
    {
      h3: 'Converting and validating before using the value',
      paragraphs: ['A numeric field like population needs explicit conversion, and that conversion can fail on bad input — exactly the kind of case Session 07\'s try/except exists for.'],
      code: `raw = input("Enter population: ")

try:
    population = int(raw)
except ValueError:
    print(f"'{raw}' is not a valid number.")
    population = None

if population is not None:
    print("Parsed population:", population)`,
      diagram: {
        caption: 'Raw text is validated and converted at the boundary, before it ever reaches a method expecting a number.',
        boxes: [
          { label: 'input()', text: '"fifty" (str)' },
          { label: 'int()', text: 'ValueError\ncaught', accent: true },
          { label: 'set_population', text: 'never called\nwith bad data' },
        ],
      },
    },
    {
      h3: 'Connecting validated input to a controlled method',
      paragraphs: ['Once input is converted and confirmed valid, it can safely flow into the Session 17 methods, which add their own domain-specific validation (like rejecting negative numbers) on top.'],
      code: `def prompt_population(country):
    raw = input(f"New population for {country.name}: ")
    try:
        value = int(raw)
    except ValueError:
        print(f"'{raw}' is not a valid number. No change made.")
        return
    try:
        country.set_population(value)
        print("Updated.")
    except ValueError as e:
        print("Rejected:", e)`,
    },
    {
      h3: 'A simple menu loop',
      paragraphs: ['Combining a loop, input(), and conditional branching gives us an interactive text menu — a small but real interactive program.'],
      code: `def run_menu(country):
    while True:
        choice = input("(g)row population, (s)how summary, (q)uit: ").strip().lower()
        if choice == "q":
            print("Goodbye.")
            break
        elif choice == "g":
            prompt_population(country)
        elif choice == "s":
            print(country.summary())
        else:
            print("Unrecognised option, try again.")`,
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Build an interactive text menu that reads and validates user input, then applies it through the controlled state methods from Session 17.',
    whatYouBuild: 'A file called <code>input_lab.py</code>.',
    steps: [
      { title: 'Create the file with Country including set_population and grow_population', body: [], code: `# input_lab.py
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
      { title: 'Write a function that reads and validates a number from the user', body: [], code: `def read_int(prompt):
    raw = input(prompt)
    try:
        return int(raw)
    except ValueError:
        print(f"'{raw}' is not a valid number.")
        return None` },
      { title: 'Write prompt_set_population using read_int and the controlled method', body: [], code: `def prompt_set_population(country):
    value = read_int(f"New population for {country.name}: ")
    if value is None:
        return
    try:
        country.set_population(value)
        print("Updated:", country.summary())
    except ValueError as e:
        print("Rejected:", e)` },
      { title: 'Write the menu loop and run it', body: ['When you run this file directly, try typing an invalid number, then a negative number, then a valid one — confirm all three cases behave correctly.'], code: `def run_menu(country):
    while True:
        choice = input("(g)row, (s)et, (v)iew, (q)uit: ").strip().lower()
        if choice == "q":
            print("Goodbye.")
            break
        elif choice == "s":
            prompt_set_population(country)
        elif choice == "g":
            amount = read_int("Amount to grow by: ")
            if amount is not None:
                try:
                    country.grow_population(amount)
                    print("Updated:", country.summary())
                except ValueError as e:
                    print("Rejected:", e)
        elif choice == "v":
            print(country.summary())
        else:
            print("Unrecognised option.")

if __name__ == "__main__":
    kenya = Country(name="Kenya", region="Africa", population=54000000)
    run_menu(kenya)` },
      { title: 'Confirm the __main__ guard from Session 06 is used correctly', body: ['The menu should only run when this file is executed directly, not if it were imported elsewhere.'] },
    ],
  },
  filesChanged: [
    { file: 'input_lab.py', action: 'Created', why: 'An interactive menu reading validated user input into controlled state methods.' },
    { file: 'docs/sessions/session-18/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add input_lab.py docs/sessions/session-18/index.html\ngit commit -m "session-18: read and validate user input, connect it to controlled state methods"',
  commitQuestion: 'Why does read_int need its own try/except, separate from set_population\'s own validation?',
  checklist: [
    'read_int() converts user input to int and returns None on invalid text, without crashing',
    'prompt_set_population() handles both a bad conversion (None) and a rejected value (ValueError) separately',
    'The menu loop correctly dispatches on user choice with if/elif',
    'The __main__ guard is used so the menu only runs when the file is executed directly',
    'Typing invalid text, a negative number, and a valid number were all manually tested',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Why are there two separate layers of validation here — read_int\'s conversion check and set_population\'s value check? Could you combine them into one? Should you?',
    'What would happen if you skipped read_int entirely and called int(input(...)) directly inside prompt_set_population? Trace through what happens on bad input.',
    'How does this session\'s "validate at the boundary, then trust the value" pattern relate to what you learned about function contracts in Session 04 and 11?',
    'Where else in a real application (not just population) would you need this same read-validate-apply pattern for user input?',
  ],
  whatBreaks: [
    { title: 'Crash on first typo', text: 'Without read_int\'s try/except, the very first time a user makes a typo, the entire program crashes instead of gracefully asking again — completely unacceptable for anything meant to be used by another person.' },
    { title: 'Tracing state changes (Session 19)', text: 'The next session adds logging/debugging so you can trace exactly when and why state changed. Without a controlled input path like this session\'s, there would be too many uncontrolled entry points to trace meaningfully.' },
    { title: 'Real API responses (Layer 7)', text: 'Session 38\'s real API data needs exactly this same "validate untrusted external input before trusting it" discipline — user keyboard input and network responses are both untrusted data from outside your program\'s control.' },
  ],
  learnedConcept: 'Reading user input with input(), converting and validating it safely, and connecting it to controlled state-change methods via a menu loop.',
  learnedUnlocks: 'You have built your first genuinely interactive program — one that reacts safely to unpredictable human input instead of only running pre-written code.',
  nextTeaser: 'We add visibility into exactly when and why state changes, using logging and print-based tracing.',
},

// ── SESSION 19 ─────────────────────────────────────────────────────
{
  num: 19,
  title: 'Tracing State Changes',
  nextTitle: 'Validating Input',
  subtitle: 'Now that state can only change through controlled methods, we can add visibility into every change — turning "why is this value wrong" from a mystery into a readable trace.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Add a print-based trace to a controlled state-change method',
    'Use Python\'s logging module for a more structured trace than print()',
    'Explain the difference between a debug-level and a warning-level log message',
    'Track how many times a state-change method has been called, as a simple instrumentation pattern',
    'Explain why this is only possible because state changes are funneled through methods (Session 17)',
  ],
  quiz: [
    {
      q: 'Why does adding a print statement inside set_population (rather than at every call site) give you a complete trace of every population change?',
      options: { a: 'It does not — you would still need a print at every call site', b: 'Because Session 17 already guarantees ALL population changes go through this one method, a single print here sees every single change, no matter where it was triggered from', c: 'print() automatically traces all attribute changes in Python', d: 'This only works for numeric attributes' },
      answer: 'b',
      explain: 'This is the payoff of Session 17\'s discipline: because every population change is forced through one method, instrumenting that one method gives you complete visibility, instead of needing to add tracing everywhere the attribute might be touched.',
    },
    {
      q: 'What is the practical difference between logging.debug(...) and logging.warning(...)?',
      options: { a: 'They are functionally identical, just different words', b: 'They represent different severity levels — debug is fine-grained, usually-hidden detail; warning flags something that deserves attention but is not fatal', c: 'debug messages are shown in production, warning messages never are', d: 'warning always stops the program' },
      answer: 'b',
      explain: 'Logging levels let you control verbosity: <code>debug</code> is detailed tracing you usually silence in normal use; <code>warning</code> signals something worth noticing. This lets the same codebase be quiet during normal operation and verbose while debugging, without changing any code.',
    },
    {
      q: 'A class attribute self._update_count = 0 in __init__, incremented once per call inside set_population, tracks what?',
      options: { a: 'The current population value', b: 'How many times set_population has been called on this specific instance over its lifetime', c: 'The total population across all countries', d: 'Nothing — this pattern has no real use' },
      answer: 'b',
      explain: 'A simple counter attribute, incremented inside the controlled method, gives you a lightweight built-in instrumentation of how often that particular state change has occurred for a given instance — useful for debugging unexpected repeated changes.',
    },
    {
      q: 'Why is this kind of instrumentation ("count every call", "print every change") realistic to add here but would have been much harder in Session 16\'s uncontrolled-mutation version?',
      options: { a: 'It would have been equally easy either way', b: 'In the uncontrolled version, mutation could happen from anywhere via direct assignment, so there is no single place to add the instrumentation that would catch every case', c: 'Instrumentation only works with classes, never with plain attributes', d: 'print() did not exist before Session 17' },
      answer: 'b',
      explain: 'This is the direct payoff connecting Session 16 (the risk), Session 17 (the fix), and this session (the benefit): a controlled entry point is a natural place to add tracing; scattered direct mutation has no such single point.',
    },
    {
      q: 'Should tracing/logging code like this normally raise exceptions or otherwise change the program\'s actual behavior?',
      options: { a: 'Yes — tracing should always halt execution to force you to look at it', b: 'No — tracing and logging should be observational only; they should never alter what the program actually does', c: 'It depends on the logging level used', d: 'Only debug-level logging is allowed to change behavior' },
      answer: 'b',
      explain: 'Good instrumentation is a side channel for observing behavior, not a part of the behavior itself. If adding a log line could change how your program runs, it stops being safe to add or remove tracing freely — a very important property to preserve.',
    },
  ],
  conceptTitle: 'Tracing State Changes',
  sections: [
    {
      h3: 'Why a controlled entry point makes tracing trivial',
      paragraphs: ['Because Session 17 forced every population change through set_population and grow_population, adding a trace to those two methods gives complete visibility into every change, anywhere in the program, with no missed call sites.'],
      code: `class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population

    def set_population(self, value):
        if value < 0:
            raise ValueError(f"population must be non-negative, got {value}")
        old = self.population
        self.population = value
        print(f"[trace] {self.name}.population: {old} -> {value}")`,
      diagram: {
        caption: 'Every change funnels through one checkpoint — one trace line there sees every single change made anywhere in the program.',
        boxes: [
          { label: 'many callers', text: 'menu, tests,\nother code' },
          { label: 'one method', text: 'set_population\n[trace]', accent: true },
        ],
      },
    },
    {
      h3: 'A more structured trace with logging',
      paragraphs: ['print() works, but Python\'s built-in logging module gives you severity levels and a consistent format, letting you turn tracing verbosity up or down without touching the code that produces it.'],
      code: `import logging

logging.basicConfig(level=logging.DEBUG, format="%(levelname)s: %(message)s")

class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population

    def set_population(self, value):
        if value < 0:
            logging.warning(f"rejected population {value} for {self.name}")
            raise ValueError(f"population must be non-negative, got {value}")
        old = self.population
        self.population = value
        logging.debug(f"{self.name}.population: {old} -> {value}")`,
    },
    {
      h3: 'debug vs warning severity',
      paragraphs: ['debug is for fine-grained detail you usually don\'t want cluttering normal output. warning flags something worth noticing — like a rejected change — without stopping the program the way an unhandled exception would.'],
      code: `logging.basicConfig(level=logging.WARNING)  # debug messages now silenced

# This debug call produces no visible output at WARNING level:
logging.debug("population changed")

# This warning still shows, because it meets the configured threshold:
logging.warning("rejected an invalid population value")`,
    },
    {
      h3: 'Counting calls as lightweight instrumentation',
      paragraphs: ['A simple counter attribute, incremented inside the controlled method, tells you how often a state change has actually occurred — useful for spotting unexpectedly frequent (or absent) updates while debugging.'],
      code: `class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population
        self._update_count = 0

    def set_population(self, value):
        if value < 0:
            raise ValueError(f"population must be non-negative, got {value}")
        self.population = value
        self._update_count += 1

k = Country(name="Kenya", region="Africa", population=54000000)
k.set_population(55000000)
k.set_population(56000000)
print(k._update_count)  # 2`,
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Add print-based and logging-based traces to set_population, plus an update counter, and observe both in action.',
    whatYouBuild: 'A file called <code>tracing_lab.py</code>.',
    steps: [
      { title: 'Create the file with logging configured', body: [], code: `# tracing_lab.py
import logging

logging.basicConfig(level=logging.DEBUG, format="%(levelname)s: %(message)s")

class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population
        self._update_count = 0` },
      { title: 'Add set_population with both a print trace and a logging.debug trace', body: [], code: `    def set_population(self, value):
        if value < 0:
            logging.warning(f"rejected population {value} for {self.name}")
            raise ValueError(f"population must be non-negative, got {value}")
        old = self.population
        self.population = value
        self._update_count += 1
        print(f"[trace] {self.name}.population: {old} -> {value}")
        logging.debug(f"{self.name} update #{self._update_count}")` },
      { title: 'Make several valid changes and observe both trace channels', body: [], code: `k = Country(name="Kenya", region="Africa", population=54000000)
k.set_population(55000000)
k.set_population(56000000)
k.set_population(57000000)
print("Total updates:", k._update_count)` },
      { title: 'Trigger the warning trace with an invalid change', body: [], code: `try:
    k.set_population(-1)
except ValueError as e:
    print("Caught:", e)
print("Total updates still:", k._update_count)  # unchanged — rejected update did not count` },
      { title: 'Raise the logging level to WARNING and confirm debug traces go silent', body: ['Change the level and re-run a valid update — the print trace still shows, but the debug log line does not.'], code: `logging.getLogger().setLevel(logging.WARNING)
k.set_population(58000000)  # print trace still visible; debug log line is now silenced` },
    ],
  },
  filesChanged: [
    { file: 'tracing_lab.py', action: 'Created', why: 'Adds print and logging traces plus an update counter to the controlled set_population method.' },
    { file: 'docs/sessions/session-19/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add tracing_lab.py docs/sessions/session-19/index.html\ngit commit -m "session-19: trace state changes with print, logging, and a call counter"',
  commitQuestion: 'Why does one trace statement inside set_population see every population change in the whole program?',
  checklist: [
    'set_population prints a before/after trace and logs a debug message on every valid change',
    'A rejected (invalid) update logs a warning instead, and does not increment _update_count',
    '_update_count correctly reflects only successful updates',
    'Raising the logging level to WARNING is shown to silence debug messages while print statements remain unaffected',
    'No tracing code changes the actual return values or control flow of the program',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Why does raising the logging level silence debug() calls but not your plain print() calls? What does that tell you about how the two mechanisms are separate?',
    'If you needed to trace every state change across the WHOLE program (not just Country), what would you need to be true about how ALL your classes handle state, based on Session 17?',
    'What is the tradeoff of leaving debug-level tracing permanently in the code (as opposed to removing it after debugging is done)?',
    'How would you use _update_count to detect a bug where population is being changed far more often than expected?',
  ],
  whatBreaks: [
    { title: 'Debugging without visibility', text: 'Without any tracing, tracking down "why did this value change unexpectedly" requires manually stepping through code with a debugger every single time — tracing built into the controlled entry point gives you a permanent, always-available record instead.' },
    { title: 'Validated input (Session 20)', text: 'The next session tightens validation on the input side. Having tracing already in place means you will be able to directly observe the effect of stricter validation instead of guessing.' },
    { title: 'Testing failures (Layer 5)', text: 'When a test fails in Session 30 because state didn\'t update as expected, the debugging techniques from this session — trace prints, logging, counters — are exactly what you\'ll reach for to understand why.' },
  ],
  learnedConcept: 'Tracing state changes with print and the logging module\'s severity levels, plus lightweight call-counting instrumentation.',
  learnedUnlocks: 'You can now observe exactly when, how often, and why any piece of controlled state changes — turning invisible bugs into readable traces.',
  nextTeaser: 'We tighten validation further, handling edge cases in user-supplied input more thoroughly than Session 18 did.',
},

// ── SESSION 20 ─────────────────────────────────────────────────────
{
  num: 20,
  title: 'Validating Input',
  nextTitle: 'Passing State Between Functions',
  subtitle: 'Session 18 handled the happy path and basic type errors. Real input has more edge cases: empty strings, whitespace, out-of-range values, and wrong types entirely.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Strip and normalize text input before validating it',
    'Validate a string is non-empty after stripping whitespace',
    'Validate a number falls within an acceptable range, not just that it parses',
    'Write a single reusable validation function used by multiple input paths',
    'Explain the difference between a validation error a user caused and a programming bug',
  ],
  quiz: [
    {
      q: 'A user types "   " (only spaces) when asked for a country name. Why does a plain <code>if not name:</code> check fail to catch this?',
      options: { a: 'It does not fail — "   " is falsy already', b: '"   " is a non-empty string (it has 3 characters), so it is truthy — the check needs .strip() first to catch whitespace-only input', c: 'input() automatically strips whitespace, so this case cannot occur', d: 'Python treats all-whitespace strings as None' },
      answer: 'b',
      explain: 'A string of spaces is not empty — it has length 3. It passes a naive truthiness check. You must call <code>.strip()</code> first to remove leading/trailing whitespace, THEN check if what remains is empty.',
    },
    {
      q: 'Why is checking "did int() succeed" not sufficient validation for a population value?',
      options: { a: 'It is fully sufficient on its own', b: 'A successfully parsed number can still be out of an acceptable range, e.g. -5 or 99999999999999 — parsing success and business validity are two separate checks', c: 'int() cannot fail, so this check is meaningless', d: 'Population should never be validated at all' },
      answer: 'b',
      explain: 'Parsing (can this text become a number at all?) and validation (is this number acceptable for our purposes?) are separate concerns. "-5" parses successfully as an integer but is not a valid population — both checks are needed.',
    },
    {
      q: 'Why write one shared validate_population(value) function instead of repeating the same range check in prompt_set_population, a data-import function, AND a test?',
      options: { a: 'There is no benefit; repeating the check everywhere is equally good', b: 'If the rule ever changes (e.g. the acceptable range), you update one function instead of hunting down every duplicate copy, and every path is guaranteed to apply the same rule', c: 'Python requires all validation to be in a single function', d: 'Shared functions run faster than duplicated logic' },
      answer: 'b',
      explain: 'This is the same principle from Session 06 (one place to change) applied to validation logic specifically — a single source of truth for what "valid" means prevents different code paths from silently drifting apart on the rule.',
    },
    {
      q: 'A user types "abc" for population. Is this a bug in your program, or an expected condition to handle gracefully?',
      options: { a: 'A bug — the program should never receive text it cannot parse', b: 'An expected condition — user error is normal and must be handled gracefully with a clear message, not treated as a program bug', c: 'It depends on how the user is feeling', d: 'Both are the same thing in Python' },
      answer: 'b',
      explain: 'Anything a user might reasonably (or accidentally) type is expected input to handle gracefully — that is the whole point of Sessions 18–20. A bug is when the PROGRAM itself does something it was never supposed to do, like a typo\'d variable name.',
    },
    {
      q: 'Which is the correct order of operations when validating a raw string meant to become a population number?',
      options: { a: 'Check range, then strip, then parse', b: 'Strip whitespace, parse to a number (catching ValueError), then check the range', c: 'Parse to a number first, then strip, then check range', d: 'Order does not matter at all' },
      answer: 'b',
      explain: 'You must have clean text before attempting to parse it (stripping first avoids surprises), successfully parse it into a number before you can meaningfully compare it (Session 07\'s try/except), and only then check whether that number is in an acceptable range.',
    },
  ],
  conceptTitle: 'Thorough Input Validation',
  sections: [
    {
      h3: 'Whitespace-only input is not empty',
      paragraphs: ['A naive if not text: check misses whitespace-only strings, since they have nonzero length and are therefore truthy. Always .strip() before checking emptiness.'],
      code: `name = "   "
print(bool(name))          # True! Not empty by length
print(bool(name.strip()))  # False — after stripping, it really is empty

def validate_name(raw):
    cleaned = raw.strip()
    if not cleaned:
        raise ValueError("name cannot be empty or whitespace-only")
    return cleaned`,
    },
    {
      h3: 'Parsing success is not the same as business validity',
      paragraphs: ['A number can parse just fine and still be unacceptable for your specific rules. Both checks are needed, and they check different things.'],
      code: `def validate_population(raw):
    raw = raw.strip()
    try:
        value = int(raw)
    except ValueError:
        raise ValueError(f"'{raw}' is not a valid whole number")

    if value < 0:
        raise ValueError(f"population cannot be negative, got {value}")
    if value > 2_000_000_000:
        raise ValueError(f"population {value} exceeds a plausible maximum")

    return value`,
      diagram: {
        caption: 'Two distinct checks, in order: can this become a number at all, and then, is that number acceptable?',
        boxes: [
          { label: 'parse', text: 'can it become\na number?' },
          { label: 'range check', text: 'is it acceptable?', accent: true },
        ],
      },
    },
    {
      h3: 'One shared validation function, used everywhere',
      paragraphs: ['Rather than repeating a range check inline in the menu, in a data importer, and in a test, define it once and call it from every path that needs it — connecting back to Session 06\'s module discipline.'],
      code: `# validators.py
def validate_population(raw):
    raw = raw.strip()
    try:
        value = int(raw)
    except ValueError:
        raise ValueError(f"'{raw}' is not a valid whole number")
    if value < 0:
        raise ValueError(f"population cannot be negative, got {value}")
    return value

# input_lab.py (Session 18) can now import and reuse this directly
from validators import validate_population

def prompt_set_population(country):
    raw = input(f"New population for {country.name}: ")
    try:
        value = validate_population(raw)
        country.set_population(value)
    except ValueError as e:
        print("Rejected:", e)`,
    },
    {
      h3: 'User error vs a program bug',
      paragraphs: ['A user typing bad input is expected and must be handled gracefully with a clear message — this is not a bug. A genuine bug is the program itself doing something it should never do, like a typo\'d variable name raising NameError. Session 07\'s "catch narrowly" advice is exactly why we only catch the specific exceptions we expect from user input.'],
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Build a shared validators module with thorough name and population validation, and wire it into the Session 18 menu.',
    whatYouBuild: 'Two files: <code>validators.py</code> and an updated <code>menu.py</code>.',
    steps: [
      { title: 'Create validators.py with validate_name and validate_population', body: [], code: `# validators.py
def validate_name(raw):
    cleaned = raw.strip()
    if not cleaned:
        raise ValueError("name cannot be empty or whitespace-only")
    return cleaned

def validate_population(raw):
    raw = raw.strip()
    try:
        value = int(raw)
    except ValueError:
        raise ValueError(f"'{raw}' is not a valid whole number")
    if value < 0:
        raise ValueError(f"population cannot be negative, got {value}")
    if value > 2_000_000_000:
        raise ValueError(f"population {value} exceeds a plausible maximum")
    return value` },
      { title: 'Test both validators directly with edge cases', body: ['Try an empty string, a whitespace-only string, "abc", "-5", and a valid number for population; and an empty/whitespace/valid string for name.'], code: `test_cases = ["", "   ", "abc", "-5", "54000000"]
for case in test_cases:
    try:
        print(f"'{case}' ->", validate_population(case))
    except ValueError as e:
        print(f"'{case}' -> rejected:", e)` },
      { title: 'Create Country and a menu.py that imports and uses the validators', body: [], code: `# menu.py
from validators import validate_name, validate_population

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
        self.population = value` },
      { title: 'Wire prompt_set_population to use validate_population before calling set_population', body: [], code: `def prompt_set_population(country):
    raw = input(f"New population for {country.name}: ")
    try:
        value = validate_population(raw)
    except ValueError as e:
        print("Invalid input:", e)
        return
    country.set_population(value)
    print("Updated:", country.summary())` },
      { title: 'Run the menu interactively and confirm all edge cases are handled gracefully', body: ['Try empty input, whitespace, non-numeric text, a negative number, and an implausibly huge number.'], code: `if __name__ == "__main__":
    kenya = Country(name="Kenya", region="Africa", population=54000000)
    while True:
        choice = input("(s)et population, (v)iew, (q)uit: ").strip().lower()
        if choice == "q":
            break
        elif choice == "s":
            prompt_set_population(kenya)
        elif choice == "v":
            print(kenya.summary())` },
    ],
  },
  filesChanged: [
    { file: 'validators.py', action: 'Created', why: 'A shared, reusable validation module for name and population input.' },
    { file: 'menu.py', action: 'Created', why: 'Wires the interactive menu to use the shared validators before touching state.' },
    { file: 'docs/sessions/session-20/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add validators.py menu.py docs/sessions/session-20/index.html\ngit commit -m "session-20: add thorough, reusable input validation for name and population"',
  commitQuestion: 'Why does validate_population need both a try/except around int() AND a separate range check afterward?',
  checklist: [
    'validate_name strips whitespace before checking for emptiness',
    'validate_population handles a non-numeric string, a negative number, and an implausibly large number, each with a clear message',
    'validators.py is imported and reused by menu.py, not duplicated inline',
    'All five test cases in step 2 are run and their results printed',
    'The interactive menu correctly rejects bad input without crashing, tested manually',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Why does validate_population strip the raw string before attempting int() on it? What edge case does that prevent?',
    'Session 17\'s set_population also checks value < 0. Is that check now redundant given validate_population already checks it? Should you remove one? Why or why not?',
    'What is an example of a validation rule that belongs in validate_population (business rule) versus one that belongs in set_population (object invariant)? Are they always the same thing?',
    'How does having validators.py as a separate, focused module connect back to the reasoning from Session 06 about splitting code?',
  ],
  whatBreaks: [
    { title: 'Whitespace bugs slipping through', text: 'Without stripping first, a user pasting "  Kenya  " with trailing spaces would create a country whose name never quite matches "Kenya" in comparisons or lookups — a maddening, hard-to-spot bug in real data entry.' },
    { title: 'Duplicated, drifting validation rules', text: 'Without a shared validators module, the range check might get updated in the menu but forgotten in a future data-import path (Layer 4), silently allowing invalid data in through the back door.' },
    { title: 'Data contracts (Layer 4)', text: 'Session 26 formalizes exactly this kind of validation using type hints and dataclasses. This session is the hand-rolled foundation for understanding why that formalization is valuable, not just theoretical.' },
  ],
  learnedConcept: 'Thorough input validation — stripping whitespace, separating parse errors from range errors, and centralizing validation rules in one reusable module.',
  learnedUnlocks: 'User input can no longer sneak invalid data past the program through whitespace tricks or out-of-range numbers that merely happen to parse.',
  nextTeaser: 'We look at how state and validated values move between functions and objects — including when a value should be shared versus recomputed independently.',
},

];