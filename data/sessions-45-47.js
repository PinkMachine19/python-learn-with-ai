module.exports = [

// ── SESSION 45 ─────────────────────────────────────────────────────
{
  num: 45,
  title: 'Decorators',
  nextTitle: 'Generators, Iterators & Context Managers',
  subtitle: 'Layer 8 begins — optional, bonus sessions beyond the core 44-session curriculum, for anyone who wants to reach further into intermediate Python. You have used four decorators already without ever seeing how one is built.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Explain that a decorator is just a function that takes a function and returns a (usually wrapped) function',
    'Write your own decorator from scratch using def and *args/**kwargs',
    'Apply @your_decorator syntax and explain what it desugars to',
    'Recognise @property, @classmethod, and @dataclass (already used) as decorators built on this same mechanism',
    'Use functools.wraps and explain why it matters for a decorated function\'s identity',
  ],
  quiz: [
    {
      q: 'You have already written <code>@property</code> (Session 26), <code>@classmethod</code> (Session 18), and <code>@dataclass</code> (Session 30). What do all three have in common, mechanically?',
      options: { a: 'Nothing — they are unrelated pieces of special Python syntax', b: 'All three are decorators — functions (or callables) that take the thing below them and return a modified version of it', c: 'They only work on classes, never on plain functions', d: 'They are all built-in keywords, not functions at all' },
      answer: 'b',
      explain: 'Every one of these is the exact same mechanism: a decorator takes the function or class defined right below it and returns something else in its place — @property wraps a method to allow attribute-style access; @classmethod marks a method to receive the class instead of an instance; @dataclass takes a class and returns an enhanced version with a generated __init__.',
    },
    {
      q: 'Given <code>def shout(func):\\n    def wrapper(*args, **kwargs):\\n        result = func(*args, **kwargs)\\n        return result.upper()\\n    return wrapper</code>, what does shout actually return when called?',
      options: { a: 'The uppercased result of calling func', b: 'A brand-new function, wrapper, which — when LATER called — will call func and uppercase its result', c: 'An error, because functions cannot be defined inside other functions', d: 'None, because shout has no explicit return of a value' },
      answer: 'b',
      explain: 'Calling <code>shout(func)</code> does not run <code>func</code> immediately — it returns the <code>wrapper</code> function object itself. The uppercasing only happens later, whenever the returned <code>wrapper</code> is actually called.',
    },
    {
      q: 'Given the shout decorator above, what does <code>@shout\\ndef greet(name):\\n    return f"hello {name}"</code> followed by <code>greet("kenya")</code> desugar to and return?',
      options: { a: 'It is equivalent to greet = shout(greet), and calling greet("kenya") returns "HELLO KENYA"', b: 'It is equivalent to greet = greet(shout), and returns "hello kenya"', c: 'The @shout line is purely a comment and has no effect', d: 'It raises a TypeError because greet was never called directly' },
      answer: 'a',
      explain: '<code>@shout</code> directly above a function definition is exactly equivalent to writing <code>greet = shout(greet)</code> right after defining it. So <code>greet</code> now actually refers to <code>wrapper</code>, which calls the original <code>greet</code> logic and uppercases the result.',
    },
    {
      q: 'Why does a decorator\'s inner wrapper function typically accept <code>*args, **kwargs</code> instead of specific named parameters?',
      options: { a: 'It is not necessary; specific parameters always work just as well', b: 'So the decorator can be applied to ANY function, regardless of how many positional or keyword arguments it takes, without needing a different wrapper signature for each one', c: '*args and **kwargs are required syntax for all inner functions', d: 'It makes the decorated function run faster' },
      answer: 'b',
      explain: 'Recall Session 09\'s *args/**kwargs: using them here means the wrapper can transparently accept and forward whatever arguments the ORIGINAL function needs, making the decorator reusable across functions with completely different signatures.',
    },
    {
      q: 'Without functools.wraps, what identity problem does a decorated function have?',
      options: { a: 'There is no problem — decorated functions are always identical to the original', b: 'help(decorated_function) and decorated_function.__name__ show the WRAPPER\'s name and docstring, not the original function\'s — making debugging and introspection confusing', c: 'The function simply stops working entirely', d: 'functools.wraps is required for the decorator to run at all' },
      answer: 'b',
      explain: 'Without <code>@functools.wraps(func)</code> applied to the wrapper, Python has no way to know the wrapper is "standing in for" the original — its <code>__name__</code>, docstring, and other metadata all show the generic wrapper\'s identity instead of the real function\'s, which is confusing when debugging or reading documentation.',
    },
  ],
  conceptTitle: 'Decorators — the General Mechanism',
  sections: [
    {
      h3: 'What every decorator you\'ve already used has in common',
      paragraphs: [
        'By Session 44 you had already written <code>@property</code>, <code>@classmethod</code>, and <code>@dataclass</code> — but they were introduced as individual tools, not as one general mechanism. All three (and every decorator, including ones you write yourself) follow the exact same rule: a decorator is a callable that takes the function or class below it and returns something to use in its place.',
      ],
      code: `# You've already seen this shape three times:
class Country:
    @property
    def total_population(self):
        return sum(...)

    @classmethod
    def from_dict(cls, data):
        return cls(**data)

@dataclass
class Country:
    name: str

# All three follow the identical underlying rule:
# @decorator_name
# def or class below it
#
# is equivalent to:
# name = decorator_name(name)`,
    },
    {
      h3: 'Writing your own decorator',
      paragraphs: [
        'A decorator is just a function that takes a function as its argument and returns a (usually new, wrapped) function. Nothing about this requires special syntax beyond what you already know: def, function calls, and returning a function object.',
      ],
      code: `def shout(func):
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return result.upper()
    return wrapper

@shout
def greet(name):
    return f"hello {name}"

print(greet("kenya"))  # "HELLO KENYA"`,
      diagram: {
        caption: '@shout above a def is exactly shorthand for greet = shout(greet) — the decorator swaps in a wrapped version.',
        boxes: [
          { label: 'you write', text: '@shout\ndef greet(name): ...' },
          { label: 'Python runs', text: 'greet =\nshout(greet)', accent: true },
        ],
      },
    },
    {
      h3: 'Why *args, **kwargs in the wrapper',
      paragraphs: [
        'Recall Session 09: a decorator should work on ANY function, no matter its specific parameters. The wrapper accepts *args and **kwargs so it can transparently forward whatever arguments the real function actually needs, without the decorator needing to know its exact signature in advance.',
      ],
      code: `def log_call(func):
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__} with {args}, {kwargs}")
        return func(*args, **kwargs)
    return wrapper

@log_call
def grow_population(country, amount):
    country.population += amount
    return country.population

# log_call works on grow_population despite never being written with
# grow_population's specific signature in mind`,
    },
    {
      h3: 'functools.wraps — preserving the original function\'s identity',
      paragraphs: [
        'Without help, a decorated function\'s __name__ and docstring show the generic wrapper\'s identity, not the original\'s — confusing anyone (including you) inspecting or debugging it later. functools.wraps fixes this in one line.',
      ],
      code: `import functools

def shout(func):
    @functools.wraps(func)   # preserves greet's __name__, docstring, etc.
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        return result.upper()
    return wrapper

@shout
def greet(name):
    """Return a friendly greeting."""
    return f"hello {name}"

print(greet.__name__)  # "greet" — not "wrapper", thanks to functools.wraps
print(greet.__doc__)   # "Return a friendly greeting."`,
    },
  ],
  callout: {
    title: 'Optional Layer 8:',
    text: 'The core, 44-session curriculum is already complete. This session and the two that follow are for anyone who wants to close a few remaining intermediate-level gaps — they build on the capstone project but are not required to consider yourself done.',
  },
  closing: null,
  lab: {
    objective: 'Write a timing decorator and a validation decorator from scratch, applying both to functions from the Country Explorer project, using functools.wraps correctly.',
    whatYouBuild: 'A file called <code>decorators_lab.py</code>.',
    steps: [
      { title: 'Create the file and write a timing decorator', body: [], code: `# decorators_lab.py
import functools
import time

def timed(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.6f}s")
        return result
    return wrapper` },
      { title: 'Apply it to a country-related function', body: [], code: `@timed
def total_population(countries):
    return sum(c["population"] for c in countries)

countries = [
    {"name": "Kenya", "population": 54000000},
    {"name": "Ghana", "population": 31000000},
]
print(total_population(countries))` },
      { title: 'Write a validation decorator that rejects negative numeric arguments', body: [], code: `def positive_only(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        for value in list(args) + list(kwargs.values()):
            if isinstance(value, (int, float)) and value < 0:
                raise ValueError(f"{func.__name__} received a negative value: {value}")
        return func(*args, **kwargs)
    return wrapper

@positive_only
def grow_population(current, amount):
    return current + amount

print(grow_population(54000000, 1000000))` },
      { title: 'Confirm the validation decorator correctly rejects a negative amount', body: [], code: `try:
    grow_population(54000000, -5)
except ValueError as e:
    print("Rejected:", e)` },
      { title: 'Confirm functools.wraps preserved both functions\' real names', body: [], code: `print(total_population.__name__)   # "total_population", not "wrapper"
print(grow_population.__name__)     # "grow_population", not "wrapper"` },
    ],
  },
  filesChanged: [
    { file: 'decorators_lab.py', action: 'Created', why: 'Custom timing and validation decorators applied to Country Explorer functions.' },
    { file: 'docs/sessions/session-45/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add decorators_lab.py docs/sessions/session-45/index.html\ngit commit -m "session-45: write custom decorators using functools.wraps"',
  commitQuestion: 'Why does the wrapper function need *args, **kwargs instead of specific named parameters?',
  checklist: [
    'timed and positive_only are both written as plain functions returning a wrapper',
    'Both decorators use *args, **kwargs so they work on any function signature',
    'Both wrappers are decorated with @functools.wraps(func)',
    'positive_only is proven to reject a negative argument with a clear ValueError',
    '__name__ is checked on both decorated functions to confirm functools.wraps worked',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Now that you\'ve written one from scratch, look back at @property from Session 26 — can you sketch, in rough terms, what its internal wrapper might be doing differently from a normal decorator?',
    'What would happen if you applied @positive_only to a function that takes a string argument? Would it cause a problem? Why or why not?',
    'Why is functools.wraps considered a best practice rather than a strict requirement — what actually breaks if you skip it, versus what merely becomes less convenient?',
    'Can you think of a cross-cutting concern in the Country Explorer project (logging, timing, validation, caching) that a decorator would be a cleaner fit for than modifying every function individually?',
  ],
  whatBreaks: [
    { title: 'Decorators looking like unexplained magic', text: 'Without this session, @property, @classmethod, and @dataclass remain memorized syntax rather than understood mechanisms — meaning a new, unfamiliar decorator from a library you use later would be genuinely mysterious instead of immediately recognisable.' },
    { title: 'Debugging decorated functions', text: 'Skipping functools.wraps causes real, confusing debugging sessions in larger projects, where stack traces and help() output show a generic "wrapper" instead of the actual function name you are trying to trace.' },
  ],
  learnedConcept: 'Decorators as a general mechanism — writing your own with *args/**kwargs, and recognising @property/@classmethod/@dataclass as instances of the same pattern.',
  learnedUnlocks: 'Every decorator you encounter from here forward — in this project or any future one — is now a readable, understandable pattern instead of unexplained syntax.',
  nextTeaser: 'We look at how for loops actually work under the hood, and write our own iterables, generators, and context managers.',
},

// ── SESSION 46 ─────────────────────────────────────────────────────
{
  num: 46,
  title: 'Generators, Iterators & Context Managers',
  nextTitle: 'Packaging & Virtual Environments',
  subtitle: 'Every for loop in this entire curriculum has relied on Python\'s iterator protocol without you ever seeing it directly. This session opens that hood, and shows you how with actually works too.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Explain what makes an object iterable, at a mechanical level',
    'Write a generator function using yield and explain how it differs from a normal function',
    'Explain why a generator is memory-efficient compared to building a full list upfront',
    'Write a custom context manager using a class with __enter__ and __exit__',
    'Connect with open(...) as f: (used since Session 37) to the same __enter__/__exit__ protocol',
  ],
  quiz: [
    {
      q: 'Every for loop since Session 06 has worked on lists, dicts, and strings without you writing any special code. What makes an object usable in a for loop?',
      options: { a: 'Only lists can be used in for loops — everything else requires special conversion', b: 'The object implements the iterator protocol — it can produce a sequence of values, one at a time, when asked', c: 'For loops secretly convert everything to a list first, always', d: 'It must have a numeric length known in advance' },
      answer: 'b',
      explain: 'Anything that implements the iterator protocol (broadly: something Python can repeatedly ask "what\'s the next value?") can be looped over — lists, dicts, strings, files, and generators, which this session introduces, all qualify.',
    },
    {
      q: 'Given <code>def countdown(n):\\n    while n > 0:\\n        yield n\\n        n -= 1</code>, what does calling <code>countdown(3)</code> actually return?',
      options: { a: 'The list [3, 2, 1], computed immediately', b: 'A generator object — none of the function body has run yet; values are produced one at a time only as they are requested', c: 'The number 3, immediately', d: 'A TypeError, because yield cannot appear inside a while loop' },
      answer: 'b',
      explain: '<code>yield</code> turns a function into a generator function. Calling it does not run the body at all — it returns a generator object that produces values lazily, one <code>yield</code> at a time, only when something (like a for loop) asks for the next one.',
    },
    {
      q: 'Why would a generator be preferable to building and returning a full list, for a function that processes a very large dataset?',
      options: { a: 'There is no difference — both use the exact same amount of memory', b: 'A generator produces one value at a time and never holds the whole sequence in memory at once, unlike a list which must fully exist before it can be returned', c: 'Generators are always faster to iterate than lists, regardless of memory', d: 'Lists cannot be used in for loops, so a generator is required' },
      answer: 'b',
      explain: 'This connects directly to Session 41\'s "read a huge file line by line instead of loading it all at once" lesson — a generator applies that exact same memory-efficiency idea to computed sequences, not just file reading.',
    },
    {
      q: 'What two methods must a class define to work as a context manager (usable with the with statement)?',
      options: { a: '__init__ and __del__', b: '__enter__ and __exit__', c: '__start__ and __stop__', d: '__open__ and __close__' },
      answer: 'b',
      explain: '<code>__enter__</code> runs when the with block begins (its return value is what gets bound after <code>as</code>), and <code>__exit__</code> runs when the block ends — whether it ended normally or because of an exception, exactly like the file-closing guarantee from Session 41.',
    },
    {
      q: 'How does open(path) as f: (used since Session 37/41) relate to this session\'s custom context managers?',
      options: { a: 'It is unrelated — open() uses completely different, special-cased syntax', b: 'open() returns a file object that itself implements __enter__ and __exit__ — it is a context manager built the exact same way you can build your own', c: 'with only works with open(), never with custom classes', d: 'open() secretly uses a decorator, not a context manager' },
      answer: 'b',
      explain: 'This is the payoff of the whole session: the file object <code>open()</code> returns implements the same <code>__enter__</code>/<code>__exit__</code> protocol you can implement yourself. <code>with open(path) as f:</code> was never special-cased magic — it was always an ordinary context manager, working exactly as this session explains.',
    },
  ],
  conceptTitle: 'Iterators, Generators, and Context Managers',
  sections: [
    {
      h3: 'What every for loop has secretly relied on',
      paragraphs: [
        'Since Session 06, every <code>for item in collection:</code> has worked because the collection implements the iterator protocol — broadly, Python can repeatedly ask it "what\'s next?" until there is nothing left. Lists, dicts, strings, and files all support this. This session shows you the mechanism, and lets you build your own.',
      ],
    },
    {
      h3: 'yield — writing a generator function',
      paragraphs: [
        'A function containing <code>yield</code> becomes a generator function. Calling it does not run the body — it returns a generator object that produces one value at a time, pausing at each <code>yield</code> until the next value is requested.',
      ],
      code: `def countdown(n):
    while n > 0:
        yield n
        n -= 1

for number in countdown(3):
    print(number)
# 3
# 2
# 1

# Calling countdown(3) alone does NOT print anything — it returns a generator object
gen = countdown(3)
print(gen)          # <generator object countdown at 0x...>
print(next(gen))     # 3 — pulls the first value
print(next(gen))     # 2 — resumes exactly where it left off`,
      diagram: {
        caption: 'Unlike a normal function, calling a generator function does not run its body — it returns a lazy object that produces one value per yield, on demand.',
        boxes: [
          { label: 'call it', text: 'countdown(3)' },
          { label: 'you get', text: 'generator object\n(nothing run yet)', accent: true },
        ],
      },
    },
    {
      h3: 'Why lazy evaluation matters — memory efficiency',
      paragraphs: [
        'A function that builds and returns a full list must hold every value in memory before returning anything. A generator produces values one at a time and never holds the whole sequence at once — the same memory-efficiency idea Session 41 applied to reading huge files line by line.',
      ],
      code: `# Builds the ENTIRE list in memory before returning anything
def all_populations_list(countries):
    return [c["population"] for c in countries]

# Produces ONE value at a time — never holds the whole sequence in memory
def all_populations_gen(countries):
    for c in countries:
        yield c["population"]

# For a huge dataset, the generator version scales far better`,
    },
    {
      h3: 'Writing your own context manager',
      paragraphs: [
        'A class becomes usable with <code>with</code> by implementing <code>__enter__</code> (runs at the start of the block) and <code>__exit__</code> (runs at the end, guaranteed — even if an exception occurred inside, exactly like Session 41\'s file-closing guarantee).',
      ],
      code: `class Timer:
    def __enter__(self):
        import time
        self.start = time.perf_counter()
        return self   # this becomes "as timer" in the with statement

    def __exit__(self, exc_type, exc_value, traceback):
        import time
        elapsed = time.perf_counter() - self.start
        print(f"Elapsed: {elapsed:.6f}s")
        return False  # don't suppress any exception that occurred

with Timer() as timer:
    total = sum(range(1000000))
print(total)`,
    },
    {
      h3: 'open() was a context manager all along',
      paragraphs: [
        'Session 37 and 41 used <code>with open(path) as f:</code> without ever seeing why it worked. The file object <code>open()</code> returns implements exactly the <code>__enter__</code>/<code>__exit__</code> protocol shown above — it was never special-cased magic.',
      ],
      code: `# This was always just an ordinary context manager, working exactly like Timer above:
with open("countries.json") as f:
    data = f.read()
# f.__exit__ runs here automatically — closing the file, guaranteed`,
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Write a generator function for lazily processing countries, and a custom context manager for timing a block of code.',
    whatYouBuild: 'A file called <code>generators_lab.py</code>.',
    steps: [
      { title: 'Create the file and write a generator over country data', body: [], code: `# generators_lab.py
countries = [
    {"name": "Kenya", "region": "Africa", "population": 54000000},
    {"name": "Ghana", "region": "Africa", "population": 31000000},
    {"name": "Peru", "region": "Americas", "population": 33000000},
]

def large_countries(countries, threshold):
    for c in countries:
        if c["population"] > threshold:
            yield c

for c in large_countries(countries, 40000000):
    print(c["name"])` },
      { title: 'Confirm calling the generator function does not run its body immediately', body: [], code: `gen = large_countries(countries, 40000000)
print(gen)          # generator object, nothing printed from inside yet
print(next(gen))     # NOW the body runs up to the first yield` },
      { title: 'Write a Timer context manager', body: [], code: `import time

class Timer:
    def __enter__(self):
        self.start = time.perf_counter()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.elapsed = time.perf_counter() - self.start
        print(f"Elapsed: {self.elapsed:.6f}s")
        return False` },
      { title: 'Use Timer to measure a real operation on the country data', body: [], code: `with Timer() as t:
    total = sum(c["population"] for c in countries)
print("Total:", total)` },
      { title: 'Confirm __exit__ still runs even when an exception occurs inside the block', body: [], code: `try:
    with Timer() as t:
        raise ValueError("something went wrong inside the block")
except ValueError as e:
    print("Caught after Timer printed its elapsed time:", e)` },
    ],
  },
  filesChanged: [
    { file: 'generators_lab.py', action: 'Created', why: 'A generator over country data and a custom Timer context manager.' },
    { file: 'docs/sessions/session-46/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add generators_lab.py docs/sessions/session-46/index.html\ngit commit -m "session-46: write a generator function and a custom __enter__/__exit__ context manager"',
  commitQuestion: 'Why does Timer.__exit__ still run and print the elapsed time even when a ValueError is raised inside the with block?',
  checklist: [
    'large_countries is a generator function using yield, not a function returning a list',
    'Calling the generator function is shown to NOT run its body immediately',
    'Timer implements both __enter__ and __exit__ correctly',
    'Timer is used successfully to measure a real operation on country data',
    'Timer.__exit__ is proven to run even when an exception is raised inside the with block',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Now that you have written __enter__ and __exit__ yourself, look back at every with open(...) as f: from Sessions 37-44 — does that pattern feel different to you now?',
    'Why does a generator "pause" at yield instead of running straight through to the end like a normal function? What would break if it did not pause?',
    'For which of the labs in Layers 4-7 would rewriting a list-building function as a generator have made a genuine, measurable difference? For which would it not have mattered?',
    'What is the return value of Timer.__exit__ actually controlling? What would happen if it returned True instead of False when an exception occurred?',
  ],
  whatBreaks: [
    { title: 'Large datasets exhausting memory', text: 'A function that eagerly builds a full list for a truly massive dataset (millions of records) can exhaust available memory before it even finishes running. A generator processes one item at a time and never has this problem, at the cost of not being able to re-iterate without calling the function again.' },
    { title: '"Magic" with statements', text: 'Without this session, with open(...) as f: (used constantly since Layer 7) remains unexplained special syntax rather than an ordinary, understandable object implementing a protocol you now know how to implement yourself.' },
  ],
  learnedConcept: 'The iterator protocol underlying every for loop, writing lazy generator functions with yield, and building custom context managers with __enter__/__exit__.',
  learnedUnlocks: 'The for loop and with statement — used in literally every session of this curriculum — are no longer black boxes. You can now build both kinds of objects yourself.',
  nextTeaser: 'We close the final practical gap: how to actually set up, isolate, and share a real Python project so it runs the same way on any machine.',
},

// ── SESSION 47 ─────────────────────────────────────────────────────
{
  num: 47,
  title: 'Packaging & Virtual Environments',
  nextTitle: null,
  subtitle: 'The final session. Every pip install across this curriculum quietly assumed a working Python setup. This session covers the practical piece every real project needs: isolating dependencies per-project.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Explain what problem a virtual environment solves',
    'Create and activate a virtual environment with venv',
    'Install packages into an isolated environment and freeze them to a requirements.txt',
    'Recreate an identical environment on a different machine from requirements.txt',
    'Explain, at a high level, what pyproject.toml is for in a real distributable package',
  ],
  quiz: [
    {
      q: 'Two different projects on the same computer need different, conflicting versions of the requests library. What problem does this create if both use the same global Python installation?',
      options: { a: 'There is no problem — pip automatically keeps versions separate per project', b: 'Installing one version for one project would silently break the other project, which needs a different version — they cannot both be installed globally at once', c: 'Python refuses to run any project that has a version conflict anywhere on the machine', d: 'This can only happen with more than 10 dependencies' },
      answer: 'b',
      explain: 'A global Python installation has exactly ONE set of installed packages, shared by everything on that machine. Two projects needing different versions of the same library genuinely conflict — this is exactly the problem virtual environments solve.',
    },
    {
      q: 'What does a virtual environment (created with python -m venv env) actually provide?',
      options: { a: 'A separate, isolated copy of the Python interpreter and its own installed packages, independent of the global installation and independent of any other project\'s environment', b: 'A faster version of Python', c: 'A cloud-hosted Python runtime', d: 'A way to run Python 2 and Python 3 code in the same file' },
      answer: 'a',
      explain: 'A virtual environment is a self-contained directory holding its own Python interpreter (or a link to one) and its own <code>site-packages</code> — installing something into it has zero effect on the global installation or any other project\'s environment.',
    },
    {
      q: 'What does pip freeze > requirements.txt do, and why does the whole curriculum\'s pip install pytest requests (Sessions 32, 42) become more reproducible because of it?',
      options: { a: 'It deletes all currently installed packages', b: 'It writes every currently installed package and its exact version to a file, so anyone (including future you, on a different machine) can recreate the identical environment with one command', c: 'It permanently locks the Python version itself', d: 'It uploads your code to PyPI' },
      answer: 'b',
      explain: '<code>requirements.txt</code> is a plain list of package==version pairs. Anyone who clones the project can run <code>pip install -r requirements.txt</code> and get the exact same dependency versions you had — without requirements.txt, "pip install pytest requests" (as taught in earlier sessions) gets whatever the LATEST versions happen to be at install time, which may differ machine to machine.',
    },
    {
      q: 'You clone the Country Explorer project on a new machine and want the exact same dependencies. What is the correct sequence, given a requirements.txt already exists?',
      options: { a: 'python -m venv env, activate it, then pip install -r requirements.txt', b: 'pip install -r requirements.txt directly into the global Python installation, skipping venv entirely', c: 'Copy the old machine\'s venv folder directly onto the new machine and run it', d: 'requirements.txt does the whole setup automatically with no other commands needed' },
      answer: 'a',
      explain: 'Create a fresh, isolated virtual environment first, activate it (so pip installs INTO it, not globally), then install from the requirements file. This is the standard, portable Python project setup sequence.',
    },
    {
      q: 'At a high level, what is pyproject.toml for, as opposed to requirements.txt?',
      options: { a: 'They are two names for the exact same file with no real difference', b: 'requirements.txt lists dependencies for reproducing an environment; pyproject.toml describes a project as a distributable PACKAGE — its name, version, dependencies, and build configuration, for publishing or installing it as a library', c: 'pyproject.toml is only used by Python 2 projects', d: 'requirements.txt is required; pyproject.toml is never used in real projects' },
      answer: 'b',
      explain: 'requirements.txt is about reproducing a working ENVIRONMENT for running a project. pyproject.toml is about describing a project as an installable, distributable PACKAGE — the modern standard for anything meant to be published (e.g. to PyPI) or installed via pip install your-package-name.',
    },
  ],
  conceptTitle: 'Isolating and Sharing a Python Project',
  sections: [
    {
      h3: 'The problem: one global Python, many conflicting needs',
      paragraphs: [
        'Every <code>pip install</code> across this curriculum (Session 32\'s pytest, Session 42\'s requests) quietly assumed a single, shared Python installation. In reality, different projects often need different, conflicting versions of the same package — impossible to satisfy with one global set of installed packages.',
      ],
    },
    {
      h3: 'Creating and activating a virtual environment',
      paragraphs: [
        'venv, built into Python, creates a self-contained directory with its own interpreter and package list — completely isolated from the global installation and from any other project\'s environment.',
      ],
      code: `# Create a virtual environment in a folder called "env"
# python -m venv env

# Activate it (varies by OS)
# macOS/Linux: source env/bin/activate
# Windows:     env\\Scripts\\activate

# Once activated, your prompt shows (env) — pip now installs HERE, not globally
# pip install pytest requests

# Deactivate when done
# deactivate`,
      diagram: {
        caption: 'Each project gets its own isolated interpreter and packages — no more conflicts between projects sharing one global Python.',
        boxes: [
          { label: 'global Python', text: 'shared,\nconflict-prone' },
          { label: 'venv per project', text: 'isolated,\nconflict-free', accent: true },
        ],
      },
    },
    {
      h3: 'Freezing and restoring dependencies',
      paragraphs: [
        'pip freeze lists every installed package and its exact version. Saving that to requirements.txt lets anyone recreate an identical environment — turning "it works on my machine" into "run these two commands and it works on yours too."',
      ],
      code: `# Inside an activated venv, after installing what you need:
# pip freeze > requirements.txt

# requirements.txt now looks something like:
# pytest==8.3.4
# requests==2.32.3

# On a fresh machine, to reproduce the exact same environment:
# python -m venv env
# source env/bin/activate   (or env\\Scripts\\activate on Windows)
# pip install -r requirements.txt`,
    },
    {
      h3: 'pyproject.toml — describing a distributable package',
      paragraphs: [
        'requirements.txt reproduces an environment for RUNNING a project. pyproject.toml is the modern standard for describing a project as an installable PACKAGE — its name, version, and dependencies — used when you want something installable via <code>pip install your-package-name</code>, not just runnable locally.',
      ],
      code: `# pyproject.toml — a minimal example, for context only (not built in this lab)
# [project]
# name = "country-explorer"
# version = "1.0.0"
# dependencies = [
#     "requests>=2.32",
# ]`,
    },
  ],
  callout: {
    title: 'The curriculum, complete:',
    text: 'This is the final session of Python Fundamentals, core and bonus layers alike. You now have the language fundamentals, the object-oriented and testing discipline, the architectural judgment, and the practical project-setup knowledge to build and share a real Python project.',
  },
  closing: null,
  lab: {
    objective: 'Create a virtual environment for the Country Explorer project, install its real dependencies, and produce a requirements.txt that could recreate the setup on any machine.',
    whatYouBuild: 'A virtual environment and a <code>requirements.txt</code> file.',
    steps: [
      { title: 'Create a virtual environment for the project', body: ['Run this in your project\'s root folder.'], code: '# python -m venv env' },
      { title: 'Activate it and confirm you are inside it', body: ['Your terminal prompt should now show (env) at the start.'], code: '# source env/bin/activate     (macOS/Linux)\n# env\\Scripts\\activate          (Windows)' },
      { title: 'Install the project\'s real dependencies', body: ['These are the two packages this whole curriculum actually used, in Sessions 32 and 42.'], code: '# pip install pytest requests' },
      { title: 'Freeze the exact versions to requirements.txt', body: [], code: '# pip freeze > requirements.txt\n# cat requirements.txt   (or open it in an editor)' },
      { title: 'Simulate a fresh machine: deactivate, then reproduce the environment from scratch', body: ['Delete the env folder, then rebuild it purely from requirements.txt, proving the file is sufficient on its own.'], code: '# deactivate\n# rm -rf env                       (macOS/Linux)   or   rmdir /s env   (Windows)\n# python -m venv env\n# source env/bin/activate            (or env\\Scripts\\activate)\n# pip install -r requirements.txt\n# pip list                            # confirm pytest and requests are both back' },
    ],
  },
  filesChanged: [
    { file: 'env/', action: 'Created', why: 'An isolated virtual environment for this project (not committed to git).' },
    { file: 'requirements.txt', action: 'Created', why: 'The exact, reproducible list of the project\'s dependencies.' },
    { file: 'docs/sessions/session-47/index.html', action: 'Created', why: 'This session document — the final session of the curriculum.' },
  ],
  commitCmd: 'git add requirements.txt docs/sessions/session-47/index.html\ngit commit -m "session-47: isolate dependencies with venv and freeze them to requirements.txt"',
  commitQuestion: 'Why does the env/ folder itself get excluded from git (via .gitignore), while requirements.txt does get committed?',
  checklist: [
    'A virtual environment was created and successfully activated',
    'pytest and requests were installed inside the venv, not globally',
    'requirements.txt was generated with pip freeze and contains exact pinned versions',
    'The environment was deleted and successfully rebuilt from requirements.txt alone, proving reproducibility',
    'env/ is excluded from version control via .gitignore; requirements.txt is not',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Why should the env/ folder itself never be committed to git, while requirements.txt should be? What is the difference in what each one represents?',
    'What would have gone wrong across Sessions 32-44 if two different learners\' machines had silently different installed versions of pytest or requests?',
    'When would you actually need a full pyproject.toml instead of just a requirements.txt? Think about the difference between "running a project" and "publishing a package."',
    'Looking back across all 47 sessions, which single practice from this curriculum do you think will matter most the next time you start a brand-new Python project from scratch?',
  ],
  whatBreaks: [
    { title: '"Works on my machine" bugs', text: 'Without virtual environments and requirements.txt, a project silently depends on whatever happens to be globally installed on one specific machine — the single most common reason a project runs for its author but fails for anyone else.' },
    { title: 'Dependency conflicts between projects', text: 'Without isolation, working on two Python projects with different version needs on the same machine eventually forces you to break one to fix the other — venv is what prevents this entirely.' },
  ],
  learnedConcept: 'Isolating project dependencies with venv, reproducing environments with pip freeze / requirements.txt, and the distinction between an environment file and a distributable package\'s pyproject.toml.',
  learnedUnlocks: 'You can now set up, isolate, and share any real Python project so it runs identically on any machine — the last practical skill standing between "a script that works for me" and a genuinely shareable project.',
  nextTeaser: null,
},

];
