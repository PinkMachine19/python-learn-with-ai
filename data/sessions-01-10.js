module.exports = [

// ── SESSION 01 ─────────────────────────────────────────────────────
{
  num: 1,
  title: 'Dictionaries',
  nextTitle: 'Lists and Iteration',
  subtitle: 'Before we can model a country, a class, or any structured data in Python, we must deeply understand dictionaries — the container every later session builds on.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Create a dictionary using literal syntax',
    'Read values using key lookup and the .get() method',
    'Add, update, and delete key-value pairs',
    'Explain why dictionaries are mutable and what that means when two names point at the same one',
    'Describe why Python classes store their data in a dictionary-like structure',
  ],
  quiz: [
    {
      q: 'You have this code: <code>country = {"name": "Kenya", "region": "Africa"}</code><br/>What does <code>country["region"]</code> return?',
      options: { a: '"Kenya"', b: '"Africa"', c: 'None', d: 'A KeyError' },
      answer: 'b',
      explain: 'Square-bracket lookup reads a value by its key. <code>country["region"]</code> looks up the key "region" and returns "Africa".',
    },
    {
      q: 'You write <code>a = {"x": 1}</code> then <code>b = a</code> then <code>b["x"] = 99</code>.<br/>What is <code>a["x"]</code> after this?',
      options: { a: '1 — because assignment always copies in Python', b: '1 — because b is a new dictionary', c: '99 — because a and b point to the same dictionary object', d: 'A TypeError — dictionaries cannot be reassigned' },
      answer: 'c',
      explain: 'Dictionaries are mutable objects. <code>b = a</code> does not copy the dictionary — it copies the reference. Both names point to the same object in memory, so mutating through <code>b</code> is visible through <code>a</code>.',
    },
    {
      q: 'A key is stored in a variable: <code>key = "population"</code>.<br/>Which correctly reads that value from <code>country</code>?',
      options: { a: '<code>country[key]</code>', b: '<code>country.key</code>', c: '<code>country.population</code>', d: 'Both a and c work identically' },
      answer: 'a',
      explain: 'Python dictionaries do not support dot notation at all — <code>country.key</code> is not valid syntax for reading a dictionary value. <code>country[key]</code> evaluates the variable first, then looks up that key.',
    },
    {
      q: 'What is the difference between <code>country["capital"]</code> and <code>country.get("capital")</code> when the key does not exist?',
      options: { a: 'They behave identically', b: 'Bracket access raises a KeyError; .get() returns None (or a default you supply)', c: '.get() raises an error; bracket access returns None', d: 'Both silently return an empty string' },
      answer: 'b',
      explain: 'Bracket access is strict — a missing key raises <code>KeyError</code>. <code>.get()</code> is forgiving — it returns <code>None</code> by default, or a second argument you provide, e.g. <code>country.get("capital", "Unknown")</code>.',
    },
    {
      q: 'Which correctly adds a new key to an existing dictionary <code>country</code>?',
      options: { a: '<code>country.append("flag", "🇰🇪")</code>', b: '<code>country["flag"] = "🇰🇪"</code>', c: '<code>country.flag = "🇰🇪"</code>', d: 'You must create a new dictionary — existing ones cannot grow' },
      answer: 'b',
      explain: 'Assigning to a bracket key that does not yet exist creates it. Dictionaries have no <code>.append()</code> — that is a list method. Dot-assignment sets an attribute, not a dictionary key.',
    },
  ],
  conceptTitle: 'Python Dictionaries',
  sections: [
    {
      h3: 'What is a dictionary?',
      paragraphs: [
        'A dictionary groups related data together under one name, using key-value pairs. Instead of three separate variables for a country\'s data, you have one container that holds all of them.',
      ],
      code: `# Without a dictionary — three unrelated variables
country_name = "Kenya"
country_region = "Africa"
country_population = 54000000

# With a dictionary — one container, logically grouped
country = {
    "name": "Kenya",
    "region": "Africa",
    "population": 54000000,
}`,
      diagram: {
        caption: 'Three loose variables collapse into one dict — each entry is a key : value pair.',
        boxes: [
          { label: '3 variables', text: 'country_name\ncountry_region\ncountry_population' },
          { label: 'one dict', text: 'name: "Kenya"\nregion: "Africa"\npopulation: 54000000', accent: true },
        ],
      },
    },
    {
      h3: 'Reading values — bracket access vs .get()',
      paragraphs: ['There are two ways to read a value from a dictionary, and they behave differently on a missing key.'],
      code: `country = {"name": "Kenya", "region": "Africa"}

print(country["name"])          # "Kenya"
print(country["region"])        # "Africa"

# Missing key with bracket access -> KeyError, program crashes
# print(country["capital"])

# Missing key with .get() -> None, no crash
print(country.get("capital"))            # None
print(country.get("capital", "Unknown")) # "Unknown" — explicit default`,
    },
    {
      h3: 'Dictionaries are mutable — this is critical',
      paragraphs: [
        'In Python there are mutable types (dict, list, set) and immutable types (str, int, float, bool, tuple). Immutable values are copied when assigned. Mutable objects are not copied — only the reference is copied.',
      ],
      code: `# Immutable — a new value is bound, the old one is untouched
x = 5
y = x
y = 99
print(x)  # still 5

# Mutable — reference is shared, NOT copied
a = {"score": 5}
b = a          # b now refers to the SAME dict as a
b["score"] = 99
print(a["score"])  # 99 — because a and b are the same object`,
      diagram: {
        caption: 'a and b are two names pointing at one dict in memory — mutating through either name is visible through both.',
        boxes: [
          { label: 'a', text: '→' },
          { label: 'b', text: '→' },
          { label: 'heap', text: '{"score": 99}', accent: true },
        ],
      },
    },
    {
      h3: 'Adding, updating, and deleting keys',
      paragraphs: ['Dictionaries grow and shrink after creation. Adding an unused key creates it; assigning an existing key overwrites it.'],
      code: `country = {"name": "Kenya"}

# Add a new key
country["capital"] = "Nairobi"
print(country)  # {'name': 'Kenya', 'capital': 'Nairobi'}

# Update an existing key
country["name"] = "Kenya (updated)"

# Delete a key
del country["capital"]
print(country)  # {'name': 'Kenya (updated)'}`,
    },
    {
      h3: 'Nested dictionaries',
      paragraphs: ['Values can themselves be dictionaries — this is how you model structured, hierarchical data.'],
      code: `country = {
    "name": "Kenya",
    "location": {
        "continent": "Africa",
        "coordinates": {"lat": -0.0236, "lng": 37.9062},
    },
}

print(country["location"]["continent"])            # "Africa"
print(country["location"]["coordinates"]["lat"])    # -0.0236`,
    },
  ],
  callout: null,
  closing: 'We are not writing classes yet, but when we do in Session 08, you will recognise this pattern immediately: an object\'s internal attributes are stored and looked up the same way you just looked up dictionary keys.',
  lab: {
    objective: 'Create a single Python file that defines one country as a dictionary, reads its values two different ways, and prints the results.',
    whatYouBuild: 'A file called <code>country.py</code> that demonstrates every dictionary concept from this session. Nothing more.',
    steps: [
      { title: 'Create the file', body: ['Create a new file at <code>country.py</code>. It does not exist yet.'], code: '# country.py' },
      { title: 'Define your country dictionary', body: ['Write a variable called <code>country</code>. Give it at least 5 keys. Use real values — pick any country you like.'], code: `country = {
    "name": "Kenya",
    "capital": "Nairobi",
    "region": "Africa",
    "population": 54000000,
    "independent": True,
}` },
      { title: 'Read values with bracket access', body: ['Print three of the values using bracket access.'], code: `print("Name (bracket):", country["name"])
print("Capital (bracket):", country["capital"])
print("Region (bracket):", country["region"])` },
      { title: 'Read a value with .get(), including a missing key', body: ['Prove that .get() does not crash on a missing key, while bracket access would.'], code: `print("Flag (.get, missing):", country.get("flag"))
print("Flag with default:", country.get("flag", "🏳"))` },
      { title: 'Prove the reference behaviour', body: ['Before running: write down what you think <code>original["score"]</code> will be. Then run it.'], code: `original = {"name": "Kenya", "score": 0}
copy = original       # This is NOT a copy
copy["score"] = 99

print("original[score]:", original["score"])  # What do you expect?
print("copy[score]:", copy["score"])` },
      { title: 'Add and delete a key', body: [], code: `country["flag"] = "🇰🇪"
print("After add:", country["flag"])
del country["independent"]
print("After delete:", country)` },
      { title: 'Add a nested dictionary', body: ['Access a deeply nested value.'], code: `country["location"] = {
    "continent": "Africa",
    "coordinates": {"lat": -0.0236, "lng": 37.9062},
}
print("Continent:", country["location"]["continent"])
print("Latitude:", country["location"]["coordinates"]["lat"])` },
    ],
  },
  filesChanged: [
    { file: 'country.py', action: 'Created', why: 'The only file for this session. Plain Python, no imports.' },
    { file: 'docs/sessions/session-01/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add country.py docs/sessions/session-01/index.html\ngit commit -m "session-01: define country as a dict, explore lookup and reference behaviour"',
  commitQuestion: 'What is the difference between bracket access and .get(), and when would I use each?',
  checklist: [
    'The dictionary uses <code>{}</code> literal syntax, not <code>dict()</code>',
    'Every key is a string in quotes; every pair is separated by a comma',
    'Bracket access example is present and printed',
    '.get() is used with a missing key and does not crash',
    'Reference behaviour is demonstrated (two names, one dict, mutation proof)',
    'A nested dictionary is present and a deeply nested value is accessed',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'You\'ve used key-value structures before (JSON, hash maps, objects). What was different or surprising about Python\'s reference behaviour?',
    'If dictionaries are shared by reference, what real bug could happen if you passed a dictionary into a function and the function modified it without you expecting that?',
    'In Step 4, <code>.get()</code> returned <code>None</code> instead of crashing. When would you actually prefer the crash?',
    'Can you think of a realistic program where a dictionary key would need to be looked up dynamically from a variable?',
  ],
  whatBreaks: [
    { title: 'Silent state bugs', text: 'If you believe dictionaries are copied when assigned, you will be confused when a function\'s changes to a dictionary affect the caller\'s copy too. This is the single most common source of "spooky action at a distance" bugs in Python.' },
    { title: 'Class attributes (Layer 2)', text: 'In Session 08, you will learn that every Python object stores its attributes in a dictionary-like structure internally. Understanding key-value lookup here is the entire foundation for understanding <code>self.name</code> later.' },
    { title: 'JSON and APIs (Layer 4 and 7)', text: 'Every JSON API response you will parse in Session 38 becomes a Python dictionary. Missing this session means you cannot read real API data.' },
  ],
  learnedConcept: 'Dictionaries — key-value containers, bracket access vs .get(), mutability, reference semantics, nesting.',
  learnedUnlocks: 'You now understand the data structure Python uses everywhere: function keyword arguments, JSON, and (soon) object attributes.',
  nextTeaser: 'We will store multiple countries and iterate over them — the pattern every later data-processing session builds on.',
},

// ── SESSION 02 ─────────────────────────────────────────────────────
{
  num: 2,
  title: 'Lists and Iteration',
  nextTitle: 'List Comprehensions',
  subtitle: 'A single country dictionary is not a country explorer. We need to hold many of them — that means lists, indexing, and loops.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Create a list using literal syntax and understand that it is ordered and mutable',
    'Access items by index, including negative indexing',
    'Use len() and iterate with a for loop',
    'Explain the difference between mutating methods (.append, .sort) and non-mutating operations',
    'Store a list of dictionaries — the shape our whole project will use',
  ],
  quiz: [
    {
      q: 'You have <code>countries = ["Kenya", "Ghana", "Peru"]</code>. What does <code>countries[1]</code> return?',
      options: { a: '"Kenya"', b: '"Ghana"', c: '"Peru"', d: 'An IndexError' },
      answer: 'b',
      explain: 'Python lists are zero-indexed. Index 0 is "Kenya", index 1 is "Ghana", index 2 is "Peru".',
    },
    {
      q: 'What does <code>countries[-1]</code> return for the same list?',
      options: { a: 'An IndexError — negative numbers are invalid', b: '"Kenya" — the first item', c: '"Peru" — the last item', d: 'None' },
      answer: 'c',
      explain: 'Negative indices count from the end. <code>-1</code> is always the last item, <code>-2</code> the second-to-last, and so on. This avoids writing <code>countries[len(countries) - 1]</code>.',
    },
    {
      q: 'What is printed by:<br/><code>nums = [3, 1, 2]<br/>nums.append(9)<br/>print(nums)</code>',
      options: { a: '[3, 1, 2] — append() returns a new list and the original is unchanged', b: '[3, 1, 2, 9] — append() mutates the list in place', c: '[9, 3, 1, 2]', d: 'A TypeError' },
      answer: 'b',
      explain: '<code>.append()</code> is a mutating method — it adds to the existing list object and returns <code>None</code>. It does not create a new list.',
    },
    {
      q: 'You loop with <code>for country in countries:</code>. On each iteration, what does <code>country</code> refer to?',
      options: { a: 'The index of the current item, starting at 0', b: 'The entire list, unchanged each time', c: 'The value of the current item in the list', d: 'A copy of the whole list' },
      answer: 'c',
      explain: 'A <code>for ... in</code> loop over a list binds the loop variable to each element\'s value in turn — not the index. Use <code>enumerate()</code> when you need both the index and the value.',
    },
    {
      q: 'You want each item in the loop to be a dictionary you can read fields from, e.g. <code>country["name"]</code>. What must <code>countries</code> be?',
      options: { a: 'A list of strings', b: 'A dictionary of dictionaries', c: 'A list of dictionaries', d: 'It does not matter, Python infers it automatically' },
      answer: 'c',
      explain: 'For <code>country["name"]</code> to work inside the loop, each element yielded by the loop must itself be a dict. That means <code>countries</code> is a list whose elements are dicts — exactly the shape we build in this session\'s lab.',
    },
  ],
  conceptTitle: 'Python Lists and Iteration',
  sections: [
    {
      h3: 'What is a list?',
      paragraphs: ['A list is an ordered, mutable sequence of values. Unlike a dictionary, items are accessed by position (index), not by name.'],
      code: `countries = ["Kenya", "Ghana", "Peru"]

print(countries[0])   # "Kenya"  — first item, index 0
print(countries[1])   # "Ghana"
print(countries[-1])  # "Peru"   — last item, negative index
print(len(countries)) # 3`,
      diagram: {
        caption: 'Index counts up from 0 on the left, and down from -1 on the right — both point into the same list.',
        boxes: [
          { label: 'index 0', text: '"Kenya"' },
          { label: 'index 1', text: '"Ghana"' },
          { label: 'index 2 / -1', text: '"Peru"', accent: true },
        ],
      },
    },
    {
      h3: 'Iterating with a for loop',
      paragraphs: ['The most common way to process every item in a list is a <code>for ... in</code> loop. No manual index counting required.'],
      code: `countries = ["Kenya", "Ghana", "Peru"]

for country in countries:
    print(country)
# Kenya
# Ghana
# Peru

# When you need the index too, use enumerate()
for i, country in enumerate(countries):
    print(i, country)
# 0 Kenya
# 1 Ghana
# 2 Peru`,
    },
    {
      h3: 'Mutating vs non-mutating operations',
      paragraphs: ['Some list methods change the list in place and return <code>None</code>. Others return a new value and leave the original untouched. Confusing the two is a very common bug.'],
      code: `nums = [3, 1, 2]

nums.append(9)     # mutates in place -> [3, 1, 2, 9]
nums.sort()         # mutates in place -> [1, 2, 3, 9]

# sorted() is non-mutating — it returns a NEW list
original = [3, 1, 2]
result = sorted(original)
print(original)  # [3, 1, 2] — unchanged
print(result)    # [1, 2, 3] — new list`,
      diagram: {
        caption: '.sort() mutates the original object; sorted() leaves it alone and hands back a new list.',
        boxes: [
          { label: '.sort()', text: 'nums → [1, 2, 3, 9]\n(same object)' },
          { label: 'sorted()', text: 'original unchanged\nresult = new list', accent: true },
        ],
      },
    },
    {
      h3: 'A list of dictionaries — our project\'s core data shape',
      paragraphs: ['Combining what we learned in Session 01 with lists gives us exactly what a real application needs: a collection of structured records.'],
      code: `countries = [
    {"name": "Kenya", "region": "Africa", "population": 54000000},
    {"name": "Ghana", "region": "Africa", "population": 31000000},
    {"name": "Peru",  "region": "Americas", "population": 33000000},
]

for country in countries:
    print(country["name"], "-", country["region"])
# Kenya - Africa
# Ghana - Africa
# Peru - Americas`,
    },
  ],
  callout: {
    title: 'Why this matters for the project:',
    text: 'Every screen of our Country Explorer app — search, filtering, display — starts from exactly this shape: a list of dictionaries. Everything from here forward operates on this structure.',
  },
  closing: null,
  lab: {
    objective: 'Store three countries as a list of dictionaries, iterate over it, and prove the mutating vs non-mutating distinction.',
    whatYouBuild: 'A file called <code>countries.py</code> that builds on Session 01\'s single dictionary.',
    steps: [
      { title: 'Create the file', body: [], code: '# countries.py' },
      { title: 'Build a list of at least 3 country dictionaries', body: ['Reuse the shape from Session 01 — each item needs at least name, region, and population.'], code: `countries = [
    {"name": "Kenya", "region": "Africa", "population": 54000000},
    {"name": "Ghana", "region": "Africa", "population": 31000000},
    {"name": "Peru",  "region": "Americas", "population": 33000000},
]` },
      { title: 'Iterate and print each country\'s name', body: ['Use a plain for loop, no enumerate yet.'], code: `for country in countries:
    print(country["name"])` },
      { title: 'Iterate with enumerate() to also print position', body: [], code: `for i, country in enumerate(countries):
    print(f"{i}: {country['name']}")` },
      { title: 'Add a country with .append()', body: ['Print the list before and after to confirm it mutated in place.'], code: `print("Before:", len(countries))
countries.append({"name": "Japan", "region": "Asia", "population": 125000000})
print("After:", len(countries))` },
      { title: 'Prove sorted() does not mutate', body: ['Sort the country names alphabetically without touching the original list.'], code: `names = [c["name"] for c in countries] if False else None  # ignore, next session
name_list = ["Peru", "Ghana", "Kenya", "Japan"]
sorted_names = sorted(name_list)
print("Original order:", name_list)
print("Sorted copy:", sorted_names)` },
      { title: 'Access the last item with negative indexing', body: [], code: `print("Last country added:", countries[-1]["name"])` },
    ],
  },
  filesChanged: [
    { file: 'countries.py', action: 'Created', why: 'Builds a list of dictionaries and demonstrates iteration.' },
    { file: 'docs/sessions/session-02/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add countries.py docs/sessions/session-02/index.html\ngit commit -m "session-02: store countries in a list, iterate, and separate mutating from non-mutating ops"',
  commitQuestion: 'What is the difference between .sort() and sorted(), and why does it matter?',
  checklist: [
    'The list is declared with <code>[]</code> literal syntax containing at least 3 dictionaries',
    'A plain <code>for ... in</code> loop is used and prints correctly',
    '<code>enumerate()</code> is used at least once with both index and value',
    '<code>.append()</code> is demonstrated and shown to mutate in place',
    '<code>sorted()</code> is demonstrated and shown to NOT mutate the original',
    'Negative indexing is used at least once',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Why do you think Python chose zero-based indexing instead of starting at 1?',
    'If <code>.append()</code> mutates in place and returns <code>None</code>, what would <code>countries = countries.append(x)</code> incorrectly leave <code>countries</code> as? Try it.',
    'When would negative indexing actually save you from an error-prone calculation?',
    'Why is "a list of dictionaries" a more useful shape than three separate parallel lists (names, regions, populations)?',
  ],
  whatBreaks: [
    { title: 'The append-return bug', text: 'A very common beginner mistake is writing <code>x = some_list.append(item)</code>, expecting <code>x</code> to be the updated list. It is actually <code>None</code>, because mutating methods return nothing. This trips people up for years if never explained explicitly.' },
    { title: 'List comprehensions (Session 03)', text: 'The next session builds directly on for-loop iteration. If you cannot trace what a for loop does step by step, list comprehensions will look like meaningless syntax instead of a shorthand for something you already understand.' },
    { title: 'Testing (Layer 5)', text: 'Later, you will write tests that assert on list contents and order. Without understanding indexing and iteration, you cannot reason about what a test assertion is actually checking.' },
  ],
  learnedConcept: 'Lists — indexing (including negative), len(), for-loop iteration, enumerate(), mutating vs non-mutating operations.',
  learnedUnlocks: 'You can now hold and process a real collection of records — the shape our whole Country Explorer project uses.',
  nextTeaser: 'We will learn to transform and filter this list without a manual for-loop, using list comprehensions.',
},

// ── SESSION 03 ─────────────────────────────────────────────────────
{
  num: 3,
  title: 'List Comprehensions',
  nextTitle: 'Functions and Lambda',
  subtitle: 'Manually writing a for-loop to build a new list every time is repetitive. List comprehensions are Python\'s built-in shorthand for exactly that pattern.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Rewrite a transforming for-loop as a list comprehension',
    'Rewrite a filtering for-loop (with an if) as a list comprehension',
    'Combine transform and filter in a single comprehension',
    'Recognise when a comprehension improves readability and when a plain loop is clearer',
    'Explain that a comprehension always produces a brand-new list',
  ],
  quiz: [
    {
      q: 'Given <code>names = [c["name"] for c in countries]</code>, what does this produce?',
      options: { a: 'It mutates <code>countries</code> to only contain names', b: 'A new list containing just the "name" value from each dict in countries', c: 'A single string of all names joined together', d: 'A dictionary mapping names to countries' },
      answer: 'b',
      explain: 'A list comprehension always builds a brand-new list. <code>[c["name"] for c in countries]</code> is shorthand for looping over <code>countries</code> and collecting <code>c["name"]</code> from each item into a new list. <code>countries</code> itself is untouched.',
    },
    {
      q: 'What does <code>[c for c in countries if c["region"] == "Africa"]</code> produce?',
      options: { a: 'A list of only the region strings that equal "Africa"', b: 'A new list containing only the country dicts whose region is "Africa"', c: 'True or False for each country', d: 'A KeyError if any country lacks a region key' },
      answer: 'b',
      explain: 'The <code>if</code> clause at the end filters which items get included. Since the expression before <code>for</code> is just <code>c</code> (the whole dict), the result keeps entire country dicts, filtered down to African ones.',
    },
    {
      q: 'Which for-loop is exactly equivalent to <code>squares = [n * n for n in [1, 2, 3]]</code>?',
      options: { a: '<code>squares = []\\nfor n in [1, 2, 3]:\\n    squares.append(n * n)</code>', b: '<code>squares = [1, 2, 3]\\nfor n in squares:\\n    n = n * n</code>', c: '<code>squares = {}\\nfor n in [1, 2, 3]:\\n    squares[n] = n * n</code>', d: 'None of these are equivalent' },
      answer: 'a',
      explain: 'A comprehension is shorthand for: start with an empty list, loop, and append the transformed value each time. Option a is that exact loop written out longhand.',
    },
    {
      q: 'You want the names of only the African countries in one line. Which comprehension does that?',
      options: { a: '<code>[c["name"] for c in countries if c["region"] == "Africa"]</code>', b: '<code>[c["name"] if c["region"] == "Africa" for c in countries]</code>', c: '<code>[c for c["name"] in countries if region == "Africa"]</code>', d: '<code>filter(c["name"] for c in countries)</code>' },
      answer: 'a',
      explain: 'The syntax order is always <code>[expression for item in iterable if condition]</code>. Option a transforms to <code>c["name"]</code> and filters with <code>if c["region"] == "Africa"</code> in the correct positions.',
    },
    {
      q: 'True or false: after running <code>names = [c["name"] for c in countries]</code>, the original <code>countries</code> list has been changed.',
      options: { a: 'True — comprehensions always mutate the source', b: 'False — a comprehension never modifies the iterable it reads from', c: 'True, but only if the list contains dictionaries', d: 'It depends on whether <code>if</code> is used' },
      answer: 'b',
      explain: 'A comprehension only ever reads from the source iterable and builds a separate new list. <code>countries</code> is exactly as it was before, regardless of what the comprehension does.',
    },
  ],
  conceptTitle: 'List Comprehensions',
  sections: [
    {
      h3: 'From for-loop to comprehension — the transform case',
      paragraphs: ['Recall from Session 02: building a new list from an old one always follows the same shape — start empty, loop, append the transformed value.'],
      code: `countries = [
    {"name": "Kenya", "region": "Africa"},
    {"name": "Ghana", "region": "Africa"},
    {"name": "Peru", "region": "Americas"},
]

# The longhand for-loop version
names = []
for c in countries:
    names.append(c["name"])

# The exact same result as a list comprehension
names = [c["name"] for c in countries]
print(names)  # ['Kenya', 'Ghana', 'Peru']`,
      diagram: {
        caption: 'Both approaches read every item and collect a transformed value — the comprehension is the loop, compressed onto one line.',
        boxes: [
          { label: '4 lines', text: 'names = []\nfor c in countries:\n  names.append(c["name"])' },
          { label: '1 line', text: '[c["name"] for c in countries]', accent: true },
        ],
      },
    },
    {
      h3: 'Adding a filter with if',
      paragraphs: ['A trailing <code>if</code> clause keeps only the items matching a condition — equivalent to a for-loop with an if-check before the append.'],
      code: `# Longhand
african = []
for c in countries:
    if c["region"] == "Africa":
        african.append(c)

# Comprehension
african = [c for c in countries if c["region"] == "Africa"]
print(african)
# [{'name': 'Kenya', ...}, {'name': 'Ghana', ...}]`,
    },
    {
      h3: 'Combining transform and filter',
      paragraphs: ['You can transform and filter in the same expression — the transform goes first, the filter goes last.'],
      code: `african_names = [c["name"] for c in countries if c["region"] == "Africa"]
print(african_names)  # ['Kenya', 'Ghana']`,
    },
    {
      h3: 'When NOT to use a comprehension',
      paragraphs: [
        'Comprehensions are for building a list. If your loop body does something else — printing, multiple statements, side effects — a plain for-loop is clearer. Forcing everything into a comprehension hurts readability instead of helping it.',
      ],
      code: `# Fine as a comprehension — building a list
names = [c["name"] for c in countries]

# NOT a good fit — this is printing, not building a list.
# Keep this as a normal for-loop:
for c in countries:
    print(f"{c['name']} is in {c['region']}")`,
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Rewrite loop-based transforms and filters from Session 02 as list comprehensions, and combine both in one line.',
    whatYouBuild: 'A file called <code>filters.py</code> operating on the country list from Session 02.',
    steps: [
      { title: 'Create the file and re-declare the country list', body: [], code: `# filters.py
countries = [
    {"name": "Kenya", "region": "Africa", "population": 54000000},
    {"name": "Ghana", "region": "Africa", "population": 31000000},
    {"name": "Peru", "region": "Americas", "population": 33000000},
    {"name": "Japan", "region": "Asia", "population": 125000000},
]` },
      { title: 'Write the longhand for-loop version of extracting names', body: ['Do this first, on purpose, before the comprehension — you need to see the shape being compressed.'], code: `names_longhand = []
for c in countries:
    names_longhand.append(c["name"])
print(names_longhand)` },
      { title: 'Rewrite it as a comprehension and confirm identical output', body: [], code: `names = [c["name"] for c in countries]
print(names)
print(names == names_longhand)  # True` },
      { title: 'Filter countries with population over 50 million', body: [], code: `large = [c for c in countries if c["population"] > 50_000_000]
print([c["name"] for c in large])` },
      { title: 'Combine transform and filter in one comprehension', body: ['Get just the names of Asian countries in a single line.'], code: `asian_names = [c["name"] for c in countries if c["region"] == "Asia"]
print(asian_names)` },
      { title: 'Prove the original list is untouched', body: [], code: `print("Original length still 4:", len(countries) == 4)` },
    ],
  },
  filesChanged: [
    { file: 'filters.py', action: 'Created', why: 'Demonstrates transform, filter, and combined comprehensions.' },
    { file: 'docs/sessions/session-03/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add filters.py docs/sessions/session-03/index.html\ngit commit -m "session-03: transform and filter countries with list comprehensions"',
  commitQuestion: 'What is the general shape [expression for item in iterable if condition], and can I read any comprehension back into a for-loop out loud?',
  checklist: [
    'The longhand for-loop version is written first and kept in the file for comparison',
    'A pure-transform comprehension is present ([expr for item in iterable])',
    'A pure-filter comprehension is present ([item for item in iterable if cond])',
    'A combined transform+filter comprehension is present',
    'The original list is proven unchanged after all comprehensions run',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Rewrite <code>[c["name"] for c in countries if c["region"] == "Africa"]</code> back into a longhand for-loop from memory. Does it match what you wrote in the lab?',
    'Can you think of a loop body from Session 02 that would NOT translate well into a comprehension? Why not?',
    'Why might a reviewer reject a deeply nested comprehension even though it "works"?',
    'How is a list comprehension similar to the object destructuring pattern used in other languages you might know?',
  ],
  whatBreaks: [
    { title: 'Unreadable one-liners', text: 'Overusing comprehensions for anything with side effects (printing, mutating something else, multiple conditions) produces code that is technically correct but very hard to read. Knowing when NOT to use one is as important as knowing the syntax.' },
    { title: 'Data-layer filtering (Layer 4)', text: 'In Session 24 you will build a data-access layer that filters and searches a country list. That entire layer is built from the comprehension patterns in this session.' },
    { title: 'Testing assertions (Layer 5)', text: 'Tests frequently assert on filtered results, e.g. "the returned list contains only African countries." If you cannot read a comprehension, you cannot verify what the test is actually checking.' },
  ],
  learnedConcept: 'List comprehensions — transform, filter, and combined forms, and when a plain loop is the better choice.',
  learnedUnlocks: 'You can now express "give me a new list built from this one" in a single readable line — the core operation of the whole project.',
  nextTeaser: 'We will look at functions properly — defining reusable logic instead of repeating it, including the compact lambda syntax.',
},

// ── SESSION 04 ─────────────────────────────────────────────────────
{
  num: 4,
  title: 'Functions and Lambda',
  nextTitle: 'Unpacking and *args/**kwargs',
  subtitle: 'Every piece of logic we have written so far has been repeated inline. Functions let us name a piece of logic once and reuse it — the basis for everything from here forward.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Define a function with def, including default parameter values',
    'Explain the difference between a parameter and an argument, and between positional and keyword arguments',
    'Use return to send a value back to the caller, and understand a function with no return gives back None',
    'Write a small lambda expression and know when it is (and is not) appropriate',
    'Pass a function as an argument to sorted() using the key parameter',
  ],
  quiz: [
    {
      q: 'Given <code>def greet(name):\\n    return f"Hello, {name}"</code>, what does <code>greet("Kenya")</code> evaluate to?',
      options: { a: 'None — the function only prints', b: '"Hello, Kenya"', c: 'A TypeError because name is not defined', d: 'The literal text "greet(name)"' },
      answer: 'b',
      explain: 'Calling the function substitutes the argument "Kenya" for the parameter <code>name</code>, and <code>return</code> sends the formatted string back to the caller.',
    },
    {
      q: 'What does <code>print(greet("Kenya"))</code> print if <code>greet</code> uses <code>print(f"Hello, {name}")</code> instead of <code>return</code>?',
      options: { a: '"Hello, Kenya" once', b: '"Hello, Kenya" followed by "None" on the next line', c: 'Nothing — the function silently fails', d: 'An error — you cannot print a function call' },
      answer: 'b',
      explain: 'The function itself prints "Hello, Kenya" as a side effect. But since it has no <code>return</code>, calling it evaluates to <code>None</code> — and the outer <code>print()</code> then prints that <code>None</code> on the next line. This is a very common beginner confusion between printing and returning.',
    },
    {
      q: 'Given <code>def region_label(name, region="Unknown"):</code>, what does <code>region_label("Kenya")</code> return for <code>region</code>?',
      options: { a: 'A TypeError — region is required', b: '"Unknown" — the default value is used since no argument was passed', c: 'None', d: 'An empty string' },
      answer: 'b',
      explain: 'A default parameter value is used whenever the caller does not supply that argument. This lets callers omit parameters they don\'t care about.',
    },
    {
      q: 'Which lambda is equivalent to <code>def get_pop(c): return c["population"]</code>?',
      options: { a: '<code>lambda c: c["population"]</code>', b: '<code>lambda c: return c["population"]</code>', c: '<code>lambda(c): c["population"]</code>', d: '<code>def lambda c: c["population"]</code>' },
      answer: 'a',
      explain: 'A lambda has no <code>def</code>, no name, no parentheses around parameters, and no <code>return</code> keyword — the expression after the colon is implicitly returned.',
    },
    {
      q: 'You call <code>sorted(countries, key=lambda c: c["population"])</code>. What does the <code>key</code> argument control?',
      options: { a: 'It filters out countries without a population key', b: 'For each item, it computes the value that sorted() should compare on, instead of comparing the dicts directly', c: 'It renames the "population" field to "key"', d: 'It reverses the sort order' },
      answer: 'b',
      explain: '<code>sorted()</code> normally compares items directly, which fails for dicts. <code>key</code> tells it: "for each item, run this function, and sort based on what it returns" — here, each country\'s population.',
    },
  ],
  conceptTitle: 'Functions and Lambda',
  sections: [
    {
      h3: 'Defining a function',
      paragraphs: ['A function packages up logic under a name so it can be called repeatedly instead of copy-pasted.'],
      code: `def greet(name):
    return f"Hello, {name}"

print(greet("Kenya"))  # "Hello, Kenya"
print(greet("Ghana"))  # "Hello, Ghana"`,
    },
    {
      h3: 'return vs print — a critical distinction',
      paragraphs: [
        '<code>print()</code> displays something to the console as a side effect. <code>return</code> sends a value back to whoever called the function, so it can be stored, passed along, or used in another expression. A function with no <code>return</code> statement evaluates to <code>None</code>.',
      ],
      code: `def broken_greet(name):
    print(f"Hello, {name}")   # side effect — does NOT return anything

result = broken_greet("Kenya")   # prints "Hello, Kenya" as a side effect
print(result)                     # None — nothing was returned`,
      diagram: {
        caption: 'print() sends text to the console; return sends a value back into the calling code so it can be used further.',
        boxes: [
          { label: 'print()', text: 'side effect\n(console only)' },
          { label: 'return', text: 'value flows back\nto the caller', accent: true },
        ],
      },
    },
    {
      h3: 'Default parameter values',
      paragraphs: ['A parameter can have a default, used whenever the caller omits that argument.'],
      code: `def region_label(name, region="Unknown"):
    return f"{name} ({region})"

print(region_label("Kenya", "Africa"))  # "Kenya (Africa)"
print(region_label("Atlantis"))          # "Atlantis (Unknown)" — default used`,
    },
    {
      h3: 'Lambda — a small, anonymous function',
      paragraphs: [
        'A lambda is a function expression with no name, written on one line, with the result implicitly returned. Lambdas are for short, throwaway logic — usually passed straight into another function.',
      ],
      code: `# Full function
def get_pop(c):
    return c["population"]

# Equivalent lambda
get_pop = lambda c: c["population"]

# Where lambdas actually shine: passed inline as an argument
countries = [
    {"name": "Kenya", "population": 54000000},
    {"name": "Ghana", "population": 31000000},
]
by_population = sorted(countries, key=lambda c: c["population"])
print([c["name"] for c in by_population])  # ['Ghana', 'Kenya']`,
    },
    {
      h3: 'When to use a full function instead of a lambda',
      paragraphs: ['If the logic needs a name for clarity, spans more than one line, or is reused in several places, write a real <code>def</code> function. A lambda is for a single, obvious, inline expression only.'],
      code: `# Bad: cramming multi-step logic into a lambda hurts readability
# label = lambda c: c["name"] + " (" + c["region"] + ")" if c.get("region") else c["name"]

# Good: a real function with a name says what it does
def format_label(c):
    if c.get("region"):
        return f"{c['name']} ({c['region']})"
    return c["name"]`,
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Write reusable functions for formatting and sorting countries, including one lambda used with sorted().',
    whatYouBuild: 'A file called <code>functions_lab.py</code>.',
    steps: [
      { title: 'Create the file and the country list', body: [], code: `# functions_lab.py
countries = [
    {"name": "Kenya", "region": "Africa", "population": 54000000},
    {"name": "Ghana", "region": "Africa", "population": 31000000},
    {"name": "Peru", "region": "Americas", "population": 33000000},
]` },
      { title: 'Write a function that formats one country as a label', body: ['Give <code>region</code> a default value of <code>"Unknown"</code>.'], code: `def format_country(name, region="Unknown"):
    return f"{name} ({region})"

print(format_country("Kenya", "Africa"))
print(format_country("Atlantis"))  # uses the default` },
      { title: 'Write a function that returns the population, and one that prints it', body: ['Call both and print the results to see the return-vs-print difference for yourself.'], code: `def get_population(country):
    return country["population"]

def show_population(country):
    print(country["name"], "has population", country["population"])

result = show_population(countries[0])
print("show_population returned:", result)  # None
print("get_population returned:", get_population(countries[0]))` },
      { title: 'Sort countries by population using a lambda', body: [], code: `by_population = sorted(countries, key=lambda c: c["population"])
for c in by_population:
    print(c["name"], c["population"])` },
      { title: 'Sort countries by population, descending', body: ['Look up the reverse parameter of sorted().'], code: `by_population_desc = sorted(countries, key=lambda c: c["population"], reverse=True)
print([c["name"] for c in by_population_desc])` },
    ],
  },
  filesChanged: [
    { file: 'functions_lab.py', action: 'Created', why: 'Demonstrates function definitions, defaults, return vs print, and lambda with sorted().' },
    { file: 'docs/sessions/session-04/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add functions_lab.py docs/sessions/session-04/index.html\ngit commit -m "session-04: define reusable functions and sort with a lambda key"',
  commitQuestion: 'Why did show_population() print the value but return None, and why does that matter?',
  checklist: [
    'At least one function uses a default parameter value',
    'The return-vs-print distinction is demonstrated explicitly, printing the None result',
    'At least one lambda is written and used as the key argument to sorted()',
    'sorted() is used both ascending and with reverse=True',
    'No lambda spans more than one expression',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Why does Python separate "produce a value" (return) from "display a value" (print) instead of combining them?',
    'Rewrite the <code>lambda c: c["population"]</code> from the lab as a full <code>def</code> function. Which version is more readable in context?',
    'What would happen if you forgot the <code>return</code> keyword inside <code>get_population</code>? Try it and observe.',
    'Can you think of a case in the project ahead where a default parameter value would prevent a bug?',
  ],
  whatBreaks: [
    { title: 'The forgotten-return bug', text: 'Forgetting <code>return</code> is one of the most common beginner mistakes. The function appears to work (it prints correctly) but every caller that tries to use its result gets <code>None</code> instead — a bug that only shows up downstream.' },
    { title: 'Data-layer functions (Layer 4)', text: 'Session 24 builds a data-access layer entirely out of functions like the ones in this lab. If return values are not understood, that entire layer will silently pass <code>None</code> around.' },
    { title: 'Sorting and filtering UI logic', text: 'Nearly every "sort by X" or "filter by Y" feature in real software is built on exactly the <code>key=lambda</code> pattern from this session.' },
  ],
  learnedConcept: 'Functions — def, parameters, defaults, return vs print, and lambda expressions used as sort keys.',
  learnedUnlocks: 'You can now name and reuse logic instead of repeating it, and pass small functions as arguments to other functions.',
  nextTeaser: 'We will learn to unpack values out of lists and dicts in one line, and accept flexible numbers of arguments with *args and **kwargs.',
},

// ── SESSION 05 ─────────────────────────────────────────────────────
{
  num: 5,
  title: 'Unpacking and *args/**kwargs',
  nextTitle: 'Modules and Imports',
  subtitle: 'Python has compact syntax for pulling values out of collections, and for functions that accept a flexible number of arguments. Both patterns appear constantly in real code.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Unpack values from a tuple or list into named variables',
    'Unpack selected keys from a dictionary',
    'Use * to collect "the rest" of a sequence during unpacking',
    'Write a function that accepts *args and **kwargs and explain what each collects',
    'Use ** to spread a dictionary into a function call as keyword arguments',
  ],
  quiz: [
    {
      q: 'Given <code>name, region = "Kenya", "Africa"</code>, what is <code>region</code>?',
      options: { a: '"Kenya"', b: '"Africa"', c: 'A tuple ("Kenya", "Africa")', d: 'An error — you cannot assign two variables at once' },
      answer: 'b',
      explain: 'Python unpacks the right-hand tuple <code>("Kenya", "Africa")</code> into the two names on the left, in order. <code>name</code> gets "Kenya", <code>region</code> gets "Africa".',
    },
    {
      q: 'Given <code>first, *rest = [1, 2, 3, 4]</code>, what is <code>rest</code>?',
      options: { a: '2', b: '[2, 3, 4]', c: '[1, 2, 3, 4]', d: 'A TypeError — you cannot mix a name and a star' },
      answer: 'b',
      explain: 'The <code>*</code> collects "everything else" into a list. <code>first</code> takes the first item (1), and <code>rest</code> takes everything remaining as a list: <code>[2, 3, 4]</code>.',
    },
    {
      q: 'Given <code>def total(*args): return sum(args)</code>, what does <code>total(1, 2, 3)</code> return, and what is <code>args</code> inside the function?',
      options: { a: 'Returns 6; args is the tuple (1, 2, 3)', b: 'Returns 6; args is the list [1, 2, 3]', c: 'Returns an error because args was not defined by the caller', d: 'Returns 1, only using the first argument' },
      answer: 'a',
      explain: '<code>*args</code> collects any number of positional arguments into a tuple named <code>args</code> inside the function. <code>sum((1, 2, 3))</code> is 6.',
    },
    {
      q: 'Given <code>def describe(**kwargs): return kwargs</code>, what does <code>describe(name="Kenya", region="Africa")</code> return?',
      options: { a: '("Kenya", "Africa")', b: '["Kenya", "Africa"]', c: '{"name": "Kenya", "region": "Africa"}', d: 'A TypeError — kwargs requires positional arguments' },
      answer: 'c',
      explain: '<code>**kwargs</code> collects any number of keyword arguments into a dictionary. The keys are the argument names, the values are what was passed.',
    },
    {
      q: 'You have <code>data = {"name": "Kenya", "region": "Africa"}</code> and a function <code>def show(name, region): ...</code>. Which call passes both dict values as the correct named arguments?',
      options: { a: '<code>show(data)</code>', b: '<code>show(*data)</code>', c: '<code>show(**data)</code>', d: '<code>show(data.name, data.region)</code>' },
      answer: 'c',
      explain: '<code>**data</code> spreads the dictionary\'s key-value pairs as keyword arguments — equivalent to <code>show(name="Kenya", region="Africa")</code>. <code>*data</code> would instead iterate over the dict\'s keys, which is not what we want here.',
    },
  ],
  conceptTitle: 'Unpacking and *args / **kwargs',
  sections: [
    {
      h3: 'Unpacking a tuple or list',
      paragraphs: ['You can assign multiple variables from a sequence in one line, as long as the number of names matches the number of values.'],
      code: `name, region = "Kenya", "Africa"
print(name)    # "Kenya"
print(region)  # "Africa"

# Works with lists too, and with more than 2 values
first, second, third = [10, 20, 30]
print(second)  # 20`,
    },
    {
      h3: 'Collecting the rest with *',
      paragraphs: ['A single starred name absorbs however many values are left over, always as a list.'],
      code: `first, *rest = [1, 2, 3, 4]
print(first)  # 1
print(rest)   # [2, 3, 4]

first, *middle, last = [1, 2, 3, 4, 5]
print(middle)  # [2, 3, 4]
print(last)    # 5`,
    },
    {
      h3: 'Unpacking selected keys from a dictionary',
      paragraphs: ['You cannot unpack a dict positionally like a tuple, but you can pull out specific values using .get() or bracket access — this is how you\'ll turn a raw dict into named locals in later sessions.'],
      code: `country = {"name": "Kenya", "region": "Africa", "population": 54000000}
name = country["name"]
region = country["region"]
print(name, region)  # Kenya Africa`,
    },
    {
      h3: '*args — a function that accepts any number of positional arguments',
      paragraphs: ['Inside the function, <code>args</code> is a tuple containing everything the caller passed positionally.'],
      code: `def total(*args):
    print(type(args), args)
    return sum(args)

print(total(1, 2, 3))     # <class 'tuple'> (1, 2, 3)  -> 6
print(total(10, 20))       # <class 'tuple'> (10, 20)   -> 30`,
    },
    {
      h3: '**kwargs — a function that accepts any number of keyword arguments',
      paragraphs: ['Inside the function, <code>kwargs</code> is a dictionary of every keyword argument the caller passed.'],
      code: `def describe(**kwargs):
    print(type(kwargs), kwargs)
    return kwargs

describe(name="Kenya", region="Africa")
# <class 'dict'> {'name': 'Kenya', 'region': 'Africa'}`,
      diagram: {
        caption: '*args gathers positional extras into a tuple; **kwargs gathers keyword extras into a dict.',
        boxes: [
          { label: 'positional', text: 'total(1, 2, 3)\n→ args = (1, 2, 3)' },
          { label: 'keyword', text: 'describe(name=..)\n→ kwargs = {name: ..}', accent: true },
        ],
      },
    },
    {
      h3: 'Spreading a dict into a call with **',
      paragraphs: ['Going the other direction: if you have a dictionary and a function that expects named parameters, <code>**</code> unpacks it into matching keyword arguments.'],
      code: `def show(name, region):
    print(f"{name} is in {region}")

data = {"name": "Kenya", "region": "Africa"}
show(**data)  # equivalent to show(name="Kenya", region="Africa")`,
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Practice unpacking, *rest collection, and write functions using *args and **kwargs, including spreading a dict into a call.',
    whatYouBuild: 'A file called <code>unpacking_lab.py</code>.',
    steps: [
      { title: 'Create the file and unpack a country tuple', body: [], code: `# unpacking_lab.py
country_tuple = ("Kenya", "Africa", 54000000)
name, region, population = country_tuple
print(name, region, population)` },
      { title: 'Use * to split a list of country names into first and rest', body: [], code: `names = ["Kenya", "Ghana", "Peru", "Japan"]
first, *rest = names
print("First:", first)
print("Rest:", rest)` },
      { title: 'Write a total_population function using *args', body: ['Call it with 2 numbers and then with 4, proving it works with any count.'], code: `def total_population(*populations):
    return sum(populations)

print(total_population(54000000, 31000000))
print(total_population(54000000, 31000000, 33000000, 125000000))` },
      { title: 'Write a build_country function using **kwargs', body: ['Print the kwargs dict, then return it.'], code: `def build_country(**fields):
    print("Received fields:", fields)
    return fields

country = build_country(name="Kenya", region="Africa", population=54000000)
print(country["name"])` },
      { title: 'Spread a dict into a function call', body: ['Write a plain function with named parameters and call it using ** on a dict.'], code: `def summarize(name, region, population):
    return f"{name} ({region}) — pop. {population:,}"

data = {"name": "Kenya", "region": "Africa", "population": 54000000}
print(summarize(**data))` },
    ],
  },
  filesChanged: [
    { file: 'unpacking_lab.py', action: 'Created', why: 'Demonstrates unpacking, *rest, *args, **kwargs, and ** spreading.' },
    { file: 'docs/sessions/session-05/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add unpacking_lab.py docs/sessions/session-05/index.html\ngit commit -m "session-05: unpack sequences and use *args/**kwargs for flexible functions"',
  commitQuestion: 'What is the type of args inside a function that uses *args, and what is the type of kwargs inside one that uses **kwargs?',
  checklist: [
    'A tuple is unpacked into three named variables',
    'The * "rest" pattern is used and prints a list',
    'A function using *args is defined and called with two different argument counts',
    'A function using **kwargs is defined and its dict contents are printed',
    '** is used to spread a dictionary into a function call with named parameters',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Why does <code>*args</code> produce a tuple while <code>**kwargs</code> produces a dictionary? Does that difference make sense given how positional vs keyword arguments work?',
    'What would happen if you tried to unpack <code>a, b = [1, 2, 3]</code> — three values into two names? Try it and read the error.',
    'Where in the labs so far have you already used dictionary values without realizing it was a form of unpacking?',
    'Can you think of a real function signature (in any library you\'ve used) that probably uses **kwargs internally?',
  ],
  whatBreaks: [
    { title: 'Unpacking mismatches', text: 'Unpacking the wrong number of values (too many or too few names) raises a <code>ValueError</code> at runtime. Understanding this session means you\'ll immediately recognise that error instead of being confused by it.' },
    { title: 'Flexible constructors (Layer 2 and 4)', text: 'When we build classes and a mock-data layer, functions frequently need to accept a variable, evolving set of fields. **kwargs is exactly how you keep a function\'s signature stable while its data shape grows.' },
    { title: 'Calling real library functions (Layer 7)', text: 'The <code>requests</code> library and many others accept **kwargs-style configuration. Without this session, those function calls look like unexplainable magic.' },
  ],
  learnedConcept: 'Unpacking sequences, the * "rest" pattern, and *args/**kwargs for functions with flexible argument counts.',
  learnedUnlocks: 'You can now write functions that accept a flexible, evolving set of inputs — essential for the data layer we build in Layer 4.',
  nextTeaser: 'We will split our growing file into separate modules and learn Python\'s import system.',
},

// ── SESSION 06 ─────────────────────────────────────────────────────
{
  num: 6,
  title: 'Modules and Imports',
  nextTitle: 'Errors and Exceptions',
  subtitle: 'Our country data and our logic have been living in one file. Real projects split code into modules — this session is about how Python finds, loads, and shares code across files.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Split code across multiple .py files and import between them',
    'Use import module and from module import name, and explain the difference',
    'Alias an import with as',
    'Explain what if __name__ == "__main__": guards and why it matters',
    'Understand why a module is only executed once, no matter how many times it is imported',
  ],
  quiz: [
    {
      q: 'You have a file <code>data.py</code> containing <code>countries = [...]</code>. In another file, which import makes <code>countries</code> directly usable by that name (no prefix)?',
      options: { a: '<code>import data</code>', b: '<code>from data import countries</code>', c: '<code>import countries from data</code>', d: '<code>require("data")</code>' },
      answer: 'b',
      explain: '<code>from data import countries</code> pulls the specific name <code>countries</code> directly into the importing file\'s namespace. With plain <code>import data</code>, you would need to write <code>data.countries</code> instead.',
    },
    {
      q: 'If you use <code>import data</code> instead, how do you then access the <code>countries</code> list defined in data.py?',
      options: { a: '<code>countries</code>', b: '<code>data.countries</code>', c: '<code>data["countries"]</code>', d: '<code>data->countries</code>' },
      answer: 'b',
      explain: 'Plain <code>import data</code> gives you the whole module as an object named <code>data</code>. Everything it defines is accessed through dot notation on that module object: <code>data.countries</code>.',
    },
    {
      q: 'What does <code>import numpy as np</code> do?',
      options: { a: 'Imports only the "np" function from numpy', b: 'Imports the numpy module and binds it to the local name np', c: 'Renames the numpy package on disk to np', d: 'Is invalid syntax' },
      answer: 'b',
      explain: '<code>as</code> creates a local alias for the imported module — the module itself is unchanged, you\'ve just given yourself a shorter or clearer name to refer to it by in this file.',
    },
    {
      q: 'What is the purpose of <code>if __name__ == "__main__":</code> at the bottom of a script?',
      options: { a: 'It is required syntax for every Python file', b: 'It only runs the code inside it when the file is executed directly, not when it is imported by another file', c: 'It defines the main function that Python always calls first', d: 'It prevents the file from being imported at all' },
      answer: 'b',
      explain: 'When a file is run directly, Python sets its <code>__name__</code> to <code>"__main__"</code>. When the same file is imported by another module, <code>__name__</code> is set to the module\'s name instead. This guard lets a file provide both reusable functions AND a runnable demo, without the demo firing every time it\'s imported.',
    },
    {
      q: 'You import the same module twice from two different files in your project (e.g. both <code>app.py</code> and <code>tests.py</code> import <code>data.py</code>). How many times does data.py\'s top-level code actually execute?',
      options: { a: 'Twice — once per import', b: 'Zero — imports only expose names, they don\'t run code', c: 'Once — Python caches modules after the first import', d: 'It depends on the order the files are run in' },
      answer: 'c',
      explain: 'Python caches every module the first time it is imported. Subsequent imports anywhere in the program reuse the cached, already-executed module instead of re-running its top-level code.',
    },
  ],
  conceptTitle: 'Modules and Imports',
  sections: [
    {
      h3: 'A module is just a .py file',
      paragraphs: ['Any Python file can be imported by another. The filename (without .py) becomes the module name.'],
      code: `# data.py
countries = [
    {"name": "Kenya", "region": "Africa"},
    {"name": "Ghana", "region": "Africa"},
]

def find_by_region(region):
    return [c for c in countries if c["region"] == region]`,
    },
    {
      h3: 'import module vs from module import name',
      paragraphs: ['Both forms load the same file. They differ in what name(s) end up available in the importing file.'],
      code: `# main.py — Option 1: import the whole module
import data
print(data.countries)
print(data.find_by_region("Africa"))

# main.py — Option 2: import specific names directly
from data import countries, find_by_region
print(countries)
print(find_by_region("Africa"))`,
      diagram: {
        caption: 'import module gives you one namespaced object; from module import name gives you the names directly, unprefixed.',
        boxes: [
          { label: 'import data', text: 'data.countries\ndata.find_by_region' },
          { label: 'from data import', text: 'countries\nfind_by_region', accent: true },
        ],
      },
    },
    {
      h3: 'Aliasing with as',
      paragraphs: ['You can rename what you import, either to shorten a long name or to avoid a clash with something already defined.'],
      code: `import data as d
print(d.countries)

from data import find_by_region as search
print(search("Africa"))`,
    },
    {
      h3: 'The if __name__ == "__main__": guard',
      paragraphs: [
        'Every Python file has a built-in variable <code>__name__</code>. When the file is run directly, it equals <code>"__main__"</code>. When the file is imported by another file, it equals the module\'s own name instead. This guard lets a file define reusable functions AND include a demo that only runs when the file is executed directly.',
      ],
      code: `# data.py
countries = [{"name": "Kenya", "region": "Africa"}]

def find_by_region(region):
    return [c for c in countries if c["region"] == region]

if __name__ == "__main__":
    # This block only runs when you execute: python data.py
    # It does NOT run when another file does: import data
    print(find_by_region("Africa"))`,
    },
    {
      h3: 'A module\'s top-level code runs once, and only once',
      paragraphs: ['Python caches every module after its first import. If ten different files import the same module, its top-level code still only executes a single time — every importer shares the same already-built module object.'],
      code: `# counter.py
print("data.py is loading...")
value = 0

# app.py
import counter          # prints "data.py is loading..." — first time
import counter as c2     # does NOT print again — already cached
print(counter is c2)     # True — same object`,
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Split your country data into its own module, import it two different ways, and add a __main__ guard.',
    whatYouBuild: 'Two files: <code>country_data.py</code> (the module) and <code>explorer.py</code> (imports and uses it).',
    steps: [
      { title: 'Create country_data.py with the list and one function', body: [], code: `# country_data.py
countries = [
    {"name": "Kenya", "region": "Africa", "population": 54000000},
    {"name": "Ghana", "region": "Africa", "population": 31000000},
    {"name": "Peru", "region": "Americas", "population": 33000000},
]

def find_by_region(region):
    return [c for c in countries if c["region"] == region]

if __name__ == "__main__":
    print("Running country_data.py directly")
    print(find_by_region("Africa"))` },
      { title: 'Run country_data.py directly and observe the guard firing', body: ['Confirm the __main__ block runs when you execute the file itself.'] },
      { title: 'Create explorer.py using import module style', body: [], code: `# explorer.py
import country_data

print(country_data.countries)
print(country_data.find_by_region("Africa"))` },
      { title: 'Run explorer.py and confirm the __main__ block did NOT run', body: ['You should NOT see "Running country_data.py directly" — only the two lines you explicitly printed.'] },
      { title: 'Change explorer.py to use from...import with an alias', body: [], code: `# explorer.py
from country_data import find_by_region as search

print(search("Africa"))` },
    ],
  },
  filesChanged: [
    { file: 'country_data.py', action: 'Created', why: 'The reusable module — data and functions, with a __main__ guard.' },
    { file: 'explorer.py', action: 'Created', why: 'Imports and uses country_data two different ways.' },
    { file: 'docs/sessions/session-06/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add country_data.py explorer.py docs/sessions/session-06/index.html\ngit commit -m "session-06: split data into a module, import it two ways, add a __main__ guard"',
  commitQuestion: 'Why did the __main__ block run when I executed country_data.py directly, but not when explorer.py imported it?',
  checklist: [
    'country_data.py contains the list, at least one function, and a __main__ guard',
    'explorer.py demonstrates import module style (module.name access)',
    'explorer.py also demonstrates from module import name style, with an alias',
    'Running country_data.py directly shows the guarded print statement',
    'Running explorer.py does NOT show the guarded print statement',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Why would putting a "demo" print statement at the top level of country_data.py (outside the guard) have caused a problem in explorer.py?',
    'When would you prefer <code>import module</code> over <code>from module import name</code>, given that the second saves typing?',
    'What real-world project structure benefit comes from every module only executing once, even if imported from many places?',
    'How does a Python module\'s import caching remind you of anything else you\'ve learned about references and shared state (Session 01)?',
  ],
  whatBreaks: [
    { title: 'Demo code leaking into imports', text: 'Without the <code>__main__</code> guard, any print statements, test calls, or demo code at the top level of a module will fire every single time that module is imported anywhere — cluttering output and sometimes causing real side effects in production code.' },
    { title: 'Circular imports', text: 'Once code is split across files, it becomes possible for module A to import module B while B tries to import A — a circular import error. Understanding how imports execute (once, top to bottom) is the first step to debugging this later.' },
    { title: 'Project architecture (Layer 6)', text: 'Sessions 32–36 are entirely about organizing a growing codebase into modules and packages. Everything there assumes you are comfortable splitting files and importing between them.' },
  ],
  learnedConcept: 'Modules and the import system — import vs from-import, aliasing, and the __main__ guard.',
  learnedUnlocks: 'You can now split growing code across multiple files instead of one giant script — the basis for any real Python project structure.',
  nextTeaser: 'We will learn to handle things going wrong — try/except and raising exceptions — before we build anything more complex.',
},

// ── SESSION 07 ─────────────────────────────────────────────────────
{
  num: 7,
  title: 'Errors and Exceptions',
  nextTitle: 'What Classes Are and Why',
  subtitle: 'This is the Layer 1 gate. Real data is messy — missing keys, wrong types, invalid input. We learn to handle failure deliberately instead of letting the whole program crash.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Explain what an exception is and how it differs from a normal return value',
    'Use try/except to catch a specific exception type and recover',
    'Use else and finally correctly',
    'Raise your own exception with a clear message using raise',
    'Explain why catching Exception broadly is usually a mistake',
  ],
  quiz: [
    {
      q: 'What happens when Python hits an error like <code>country["capital"]</code> on a dict with no "capital" key, if there is no try/except around it?',
      options: { a: 'It silently returns None', b: 'It raises a KeyError, and the program stops (unless something up the call stack catches it)', c: 'It logs a warning and continues to the next line', d: 'It automatically retries with a default value' },
      answer: 'b',
      explain: 'An unhandled exception propagates up the call stack, printing a traceback, and stops the program (or whichever thread/request it happened in) once it reaches the top with nothing to catch it.',
    },
    {
      q: 'Given <code>try:\\n    value = country["capital"]\\nexcept KeyError:\\n    value = "Unknown"</code>, what is <code>value</code> if "capital" is missing?',
      options: { a: 'The program crashes with a KeyError', b: '"Unknown" — the except block runs and assigns the fallback', c: 'None', d: 'An empty string, regardless of the except block' },
      answer: 'b',
      explain: 'The <code>try</code> block\'s <code>KeyError</code> is caught by the matching <code>except KeyError:</code> clause, which runs instead of crashing, assigning "Unknown" to <code>value</code>.',
    },
    {
      q: 'What is the difference between an except block\'s code and a finally block\'s code?',
      options: { a: 'They are identical — finally is just another name for except', b: 'except only runs if a matching error occurred; finally always runs, whether an error occurred or not', c: 'finally only runs if no error occurred', d: 'except runs before the try block; finally runs after' },
      answer: 'b',
      explain: '<code>except</code> is conditional on a matching exception being raised. <code>finally</code> is unconditional — it always executes, useful for cleanup like closing a file, regardless of whether an error happened.',
    },
    {
      q: 'You write <code>raise ValueError("population must be positive")</code> inside a function. What happens?',
      options: { a: 'It prints the message and continues normally', b: 'It immediately stops normal execution and raises a ValueError with that message, to be caught by a caller or crash the program', c: 'It logs the message silently to a file', d: 'It is a syntax error — raise cannot take a message' },
      answer: 'b',
      explain: '<code>raise</code> deliberately triggers an exception. Execution of the current function stops immediately at that line, and the exception propagates up until something catches it (or the program crashes with that message).',
    },
    {
      q: 'Why is <code>except Exception:</code> (catching everything) usually considered a mistake?',
      options: { a: 'It is a syntax error in modern Python', b: 'It silently swallows bugs you did not anticipate, hiding real problems (like a typo) behind the same fallback as expected errors', c: 'It is slower than catching a specific exception', d: 'Exception is not a real class in Python' },
      answer: 'b',
      explain: 'Catching everything means a genuine bug — like a typo\'d variable name raising <code>NameError</code> — gets silently treated the same as an expected, recoverable error. This hides real problems instead of surfacing them. Catch the specific exception type you actually expect.',
    },
  ],
  conceptTitle: 'Errors and Exceptions',
  sections: [
    {
      h3: 'What is an exception?',
      paragraphs: ['When something goes wrong, Python does not silently return a bad value — it raises an exception, which immediately stops normal execution and propagates upward looking for something to handle it.'],
      code: `country = {"name": "Kenya"}
print(country["capital"])
# Traceback (most recent call last):
#   ...
# KeyError: 'capital'
# Program stops here unless something catches it`,
    },
    {
      h3: 'Catching a specific exception with try/except',
      paragraphs: ['Wrap the risky code in <code>try</code>, and handle the specific failure in a matching <code>except</code>. Only exceptions of that type (or a subclass) are caught — everything else still propagates.'],
      code: `country = {"name": "Kenya"}

try:
    capital = country["capital"]
except KeyError:
    capital = "Unknown"

print(capital)  # "Unknown" — no crash`,
      diagram: {
        caption: 'A caught exception is handled locally; an uncaught one keeps propagating up the call stack.',
        boxes: [
          { label: 'try', text: 'risky code runs' },
          { label: 'except KeyError', text: 'handled here', accent: true },
        ],
      },
    },
    {
      h3: 'else and finally',
      paragraphs: [
        'An optional <code>else</code> block runs only if the <code>try</code> block succeeded with no exception. An optional <code>finally</code> block always runs, whether or not an exception occurred — used for cleanup.',
      ],
      code: `try:
    capital = country["capital"]
except KeyError:
    print("No capital on file")
else:
    print("Found capital:", capital)  # only runs if no exception
finally:
    print("Lookup attempt finished")  # always runs`,
    },
    {
      h3: 'Raising your own exceptions',
      paragraphs: ['You are not limited to reacting to Python\'s built-in errors. Use <code>raise</code> to signal that your own code has hit an invalid state, with a message explaining what went wrong.'],
      code: `def set_population(country, value):
    if value < 0:
        raise ValueError(f"population must be positive, got {value}")
    country["population"] = value

country = {"name": "Kenya"}
set_population(country, 54000000)  # fine

set_population(country, -5)
# Traceback (most recent call last):
#   ...
# ValueError: population must be positive, got -5`,
    },
    {
      h3: 'Catch specific exceptions, not everything',
      paragraphs: ['Catching a broad <code>Exception</code> hides real bugs by treating every kind of failure — including ones you never intended to handle — the same way. Always catch the narrowest exception type that matches what you actually expect to go wrong.'],
      code: `# Risky: hides a typo (NameError) behind the same fallback as a real missing key
try:
    value = coutnry["capital"]   # typo! raises NameError, not KeyError
except Exception:
    value = "Unknown"             # bug is silently hidden

# Better: only catch what you actually expect
try:
    value = country["capital"]
except KeyError:
    value = "Unknown"             # a real typo would now crash loudly, as it should`,
    },
  ],
  callout: {
    title: 'Layer 1 gate:',
    text: 'This is the last Layer 1 session. Every remaining layer assumes you can read a traceback, choose the right exception to catch, and know the difference between recoverable and unexpected failures.',
  },
  closing: null,
  lab: {
    objective: 'Write a safe country lookup function that handles missing keys and invalid input using try/except, else, and finally, plus a function that raises its own exception.',
    whatYouBuild: 'A file called <code>errors_lab.py</code>.',
    steps: [
      { title: 'Create the file and the country data', body: [], code: `# errors_lab.py
countries = [
    {"name": "Kenya", "region": "Africa", "population": 54000000},
    {"name": "Ghana", "region": "Africa"},  # note: no population key
]` },
      { title: 'Write a function that reads population safely with try/except', body: [], code: `def get_population(country):
    try:
        return country["population"]
    except KeyError:
        return None

print(get_population(countries[0]))  # 54000000
print(get_population(countries[1]))  # None — no crash` },
      { title: 'Add else and finally to see the full flow', body: [], code: `def report_population(country):
    try:
        pop = country["population"]
    except KeyError:
        print(country["name"], "has no population on file")
    else:
        print(country["name"], "population is", pop)
    finally:
        print("Lookup complete for", country["name"])

report_population(countries[0])
report_population(countries[1])` },
      { title: 'Write a function that raises ValueError on invalid input', body: [], code: `def set_population(country, value):
    if not isinstance(value, int) or value < 0:
        raise ValueError(f"population must be a non-negative int, got {value!r}")
    country["population"] = value

set_population(countries[1], 31000000)  # fine
print(countries[1])` },
      { title: 'Call set_population with bad input inside a try/except and confirm it is caught', body: [], code: `try:
    set_population(countries[1], -5)
except ValueError as e:
    print("Rejected:", e)` },
    ],
  },
  filesChanged: [
    { file: 'errors_lab.py', action: 'Created', why: 'Demonstrates try/except/else/finally and raising a custom ValueError.' },
    { file: 'docs/sessions/session-07/index.html', action: 'Created', why: 'This session document — Layer 1 gate.' },
  ],
  commitCmd: 'git add errors_lab.py docs/sessions/session-07/index.html\ngit commit -m "session-07: handle missing keys with try/except and raise ValueError on invalid input"',
  commitQuestion: 'Why is catching KeyError specifically safer than catching Exception broadly?',
  checklist: [
    'get_population catches KeyError specifically, not a broad Exception',
    'else and finally are both demonstrated and their firing conditions are correct',
    'set_population raises ValueError with a clear, informative message on invalid input',
    'The raised ValueError is caught elsewhere with try/except ValueError as e',
    'No except clause in the file catches a bare Exception',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Why does Python prefer "ask forgiveness" (try/except) over "look before you leap" (checking <code>if "capital" in country</code> first) in many cases? Can you think of an argument for each style?',
    'What real production bug could <code>except Exception: pass</code> hide that a specific <code>except KeyError:</code> would not?',
    'In the lab, what would happen if you called <code>set_population(countries[1], "fifty")</code> — a string instead of a number? Trace through the isinstance check.',
    'How does raising your own exception with a clear message help the next person (including future you) debug faster than a generic crash?',
  ],
  whatBreaks: [
    { title: 'Silent data corruption', text: 'Catching too broadly (or not catching at all) means one bad record in a dataset can either crash your entire program or, worse, silently produce wrong results that are hard to trace back to their cause.' },
    { title: 'Class validation (Layer 2)', text: 'In Session 09, class constructors will validate their inputs the same way <code>set_population</code> does here — raising a clear exception is how a class protects itself from being created in an invalid state.' },
    { title: 'Real API calls (Layer 7)', text: 'In Session 38, a real network call can fail for a dozen reasons — no connection, bad response, rate limiting. Without this session, you cannot handle any of them gracefully, and one flaky network call would crash the whole application.' },
  ],
  learnedConcept: 'Exceptions — try/except/else/finally, raising your own exceptions with raise, and why catching narrowly matters.',
  learnedUnlocks: 'You can now write code that fails safely and predictably instead of crashing on the first messy input — the last Layer 1 skill before we start modelling real objects.',
  nextTeaser: 'Layer 2 begins. We stop passing raw dictionaries around and start modelling a Country as a class.',
},

// ── SESSION 08 ─────────────────────────────────────────────────────
{
  num: 8,
  title: 'What Classes Are and Why',
  nextTitle: 'Class Anatomy — __init__ and Attributes',
  subtitle: 'Layer 2 begins. A dictionary describes data. A class describes a kind of thing — data plus the behavior that belongs with it. This is why we are switching.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Explain the difference between a dictionary and a class conceptually',
    'Define an empty class and create an instance of it',
    'Explain what an instance is, versus the class itself',
    'Explain why grouping data with the behavior that operates on it reduces bugs',
    'Recognise that this session is concept-only — no meaningful code is written yet',
  ],
  quiz: [
    {
      q: 'Given <code>country = {"name": "Kenya"}</code> and <code>class Country: pass</code> then <code>c = Country()</code>, what is the core difference between country and c?',
      options: { a: 'There is no difference — both are just containers for data', b: 'country is a plain data container; c is an instance of a class, which can also define its own behavior (methods)', c: 'c can only exist inside a function; country can exist anywhere', d: 'Dictionaries are faster than classes, that is the only difference' },
      answer: 'b',
      explain: 'A dictionary only ever holds data. A class defines both the shape of its data (via attributes) and the operations that belong with it (via methods) — a coherent bundle rather than a bag of values.',
    },
    {
      q: 'What does <code>class Country: pass</code> define?',
      options: { a: 'A function named Country that returns nothing', b: 'A new type named Country with no attributes or methods yet', c: 'A dictionary with the key "pass"', d: 'A syntax error — a class body cannot be empty' },
      answer: 'b',
      explain: '<code>pass</code> is a no-op placeholder statement, used here because a class body cannot be syntactically empty. This defines a minimal, valid class with nothing in it yet.',
    },
    {
      q: 'What is c in <code>c = Country()</code>?',
      options: { a: 'The class itself', b: 'A function call that returns None', c: 'An instance (a specific object) of the Country class', d: 'A copy of the word "Country" as a string' },
      answer: 'c',
      explain: 'Calling a class with <code>()</code> constructs a new instance — a specific, individual object that belongs to that class. <code>Country</code> is the blueprint; <code>c</code> is one thing built from it.',
    },
    {
      q: 'If you defined a second instance <code>c2 = Country()</code>, is c the same object as c2?',
      options: { a: 'Yes — every call to Country() returns the same shared instance', b: 'No — each call to Country() creates a distinct new instance in memory', c: 'They are the same only if they have identical attributes', d: 'It depends on whether Country defines __init__' },
      answer: 'b',
      explain: 'Just like calling a function twice runs it twice, calling a class twice constructs two separate, independent instances — even though they came from the same blueprint.',
    },
    {
      q: 'Why is bundling data and the functions that operate on it (inside a class) considered better than passing loose dictionaries to loose functions everywhere?',
      options: { a: 'It is always faster to execute', b: 'It keeps related logic discoverable in one place and reduces the chance of calling the wrong function on the wrong shape of data', c: 'Dictionaries cannot hold numbers, only classes can', d: 'There is no real benefit, it is purely stylistic' },
      answer: 'b',
      explain: 'When behavior lives on the class itself, anyone reading the code can find "everything a Country can do" in one place, and the class can enforce that its own data stays valid — something a loose dictionary and scattered functions cannot guarantee.',
    },
  ],
  conceptTitle: 'Why Classes Exist',
  sections: [
    {
      h3: 'What we have been doing so far',
      paragraphs: [
        'For seven sessions, a country has been a dictionary, and every operation on it — formatting, filtering, validating — has been a separate, standalone function that takes the dictionary as an argument. This works, but nothing stops any function anywhere from reading or writing the wrong key, or writing an invalid value.',
      ],
      code: `country = {"name": "Kenya", "population": 54000000}

def set_population(country, value):
    if value < 0:
        raise ValueError("population must be positive")
    country["population"] = value

# Nothing stops this — the dict has no memory of the rule above
country["population"] = -100`,
    },
    {
      h3: 'A class bundles data and behavior together',
      paragraphs: [
        'A class is a blueprint for a kind of thing. It groups the data that thing needs (its attributes) with the operations that belong to it (its methods) into a single definition. We will build this up piece by piece over the next several sessions — today, just the shell.',
      ],
      code: `class Country:
    pass  # placeholder — a class body cannot be empty

c = Country()
print(type(c))     # <class '__main__.Country'>
print(isinstance(c, Country))  # True`,
      diagram: {
        caption: 'Country is the blueprint. c is one specific instance built from that blueprint — a second call would build a separate one.',
        boxes: [
          { label: 'class', text: 'Country\n(the blueprint)' },
          { label: 'instance', text: 'c = Country()', accent: true },
        ],
      },
    },
    {
      h3: 'Class vs instance — a critical distinction',
      paragraphs: [
        'The class is the definition, written once. An instance is a specific object built from that definition — you can build as many as you need, and each one is independent, just like each call to a function produces an independent result.',
      ],
      code: `c1 = Country()
c2 = Country()
print(c1 is c2)  # False — two separate instances, even though both are Country`,
    },
    {
      h3: 'What this unlocks',
      paragraphs: [
        'Right now <code>Country</code> is an empty shell — it does nothing a dictionary couldn\'t already do. Over the next several sessions we will give it attributes (Session 09), methods (Session 10), a proper constructor (Session 11), and eventually a whole tree of related classes (Session 12) — building toward a real Country Explorer application.',
      ],
    },
  ],
  callout: {
    title: 'Concept-only session:',
    text: 'There is intentionally very little code today. The goal is to genuinely understand WHY we are switching from dictionaries to classes before writing the class itself in the next session.',
  },
  closing: null,
  lab: {
    objective: 'Define an empty Country class, create two separate instances, and prove they are independent objects — no meaningful behavior yet.',
    whatYouBuild: 'A file called <code>country_class.py</code>.',
    steps: [
      { title: 'Create the file and define an empty class', body: [], code: `# country_class.py
class Country:
    pass` },
      { title: 'Create two separate instances', body: [], code: `c1 = Country()
c2 = Country()

print(c1)
print(c2)` },
      { title: 'Confirm both are instances of Country', body: [], code: `print(isinstance(c1, Country))  # True
print(isinstance(c2, Country))  # True` },
      { title: 'Prove they are two distinct objects, not the same one', body: ['Before running: predict what c1 is c2 will print, and why.'], code: `print(c1 is c2)  # False — separate objects in memory` },
      { title: 'Write a short comment explaining what problem this will eventually solve', body: ['No code required here — write a plain-English comment in the file summarising, in your own words, why a class beats a loose dict + loose functions. This is the most important step in the lab.'], code: `# TODO: In your own words — why will bundling country data and
# country behavior into one class reduce bugs compared to
# passing a dict to a bunch of separate functions?` },
    ],
  },
  filesChanged: [
    { file: 'country_class.py', action: 'Created', why: 'An empty Country class and proof that instances are independent.' },
    { file: 'docs/sessions/session-08/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add country_class.py docs/sessions/session-08/index.html\ngit commit -m "session-08: define an empty Country class and confirm instances are independent"',
  commitQuestion: 'In my own words, what is the difference between the Country class and a Country instance?',
  checklist: [
    'The class is defined with class Country: pass',
    'Two separate instances are created',
    'isinstance() is used to confirm both belong to the Country class',
    'c1 is c2 is checked and correctly explained as False',
    'A written comment explains, in plain English, why a class beats a loose dict',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Before this session, every "operation" on a country was a standalone function taking a dict. Can you think of a bug you might have written in the labs so far that a class could have prevented?',
    'Why do you think Python requires <code>pass</code> for an empty class body instead of allowing nothing at all?',
    'What is the relationship between a class and the <code>type()</code> of an instance built from it?',
    'If two instances of the same class can hold completely different data, what does that tell you about what a class actually "is" versus what an instance "is"?',
  ],
  whatBreaks: [
    { title: 'Confusing the class with an instance', text: 'If you don\'t internalize the class/instance distinction now, later sessions (attributes, methods, inheritance) will feel like memorized syntax instead of a coherent mental model — and debugging "why does every instance share this value" bugs becomes very hard.' },
    { title: 'Attribute sessions ahead', text: 'Session 09 immediately builds on this by giving Country actual data via __init__. Without today\'s "class = blueprint, instance = built thing" model, __init__ will look like arbitrary magic syntax instead of a logical next step.' },
  ],
  learnedConcept: 'The class vs instance distinction, and the motivation for bundling data with behavior instead of using loose dicts and functions.',
  learnedUnlocks: 'You have a mental model for what a class is FOR. Every remaining Layer 2 session builds directly on top of this.',
  nextTeaser: 'We give Country real data — an __init__ method and instance attributes, so every instance can hold its own name, region, and population.',
},

// ── SESSION 09 ─────────────────────────────────────────────────────
{
  num: 9,
  title: 'Class Anatomy — __init__ and Attributes',
  nextTitle: 'Instance Methods',
  subtitle: 'An empty class is not useful. This session gives every Country instance its own data, using the constructor method __init__ and instance attributes.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Define __init__ with parameters and assign them to self attributes',
    'Explain what self refers to and why every method needs it as the first parameter',
    'Create multiple instances with different attribute values and confirm they do not interfere with each other',
    'Read and update an instance attribute from outside the class',
    'Compare attribute access (dot notation) to the dictionary bracket access from Session 01',
  ],
  quiz: [
    {
      q: 'Given <code>class Country:\\n    def __init__(self, name):\\n        self.name = name</code>, what does <code>self.name = name</code> do?',
      options: { a: 'It creates a local variable called name that disappears when __init__ ends', b: 'It stores the value on the specific instance being constructed, as an attribute accessible via dot notation afterward', c: 'It defines a class-wide default shared by every instance', d: 'It is invalid — self cannot be assigned to' },
      answer: 'b',
      explain: '<code>self</code> refers to the specific instance currently being built. Assigning to <code>self.name</code> stores the value ON that instance, so it persists and is readable as <code>instance.name</code> after construction finishes.',
    },
    {
      q: 'Why does every method inside a class, including __init__, take self as its first parameter?',
      options: { a: 'It is just a stylistic convention with no real effect and could be omitted', b: 'Python automatically passes the instance the method was called on as the first argument, and self is how the method refers to it', c: 'self holds the class name as a string', d: 'It is required only for __init__, not other methods' },
      answer: 'b',
      explain: 'When you call <code>c.some_method()</code>, Python automatically passes <code>c</code> itself as the first argument. By convention we name that parameter <code>self</code>, and it is how the method accesses that specific instance\'s data.',
    },
    {
      q: 'Given <code>k = Country("Kenya")</code> and <code>g = Country("Ghana")</code>, what is <code>k.name</code>?',
      options: { a: '"Ghana" — the most recently created instance wins', b: '"Kenya" — each instance holds its own independent name attribute', c: 'An error — name was never defined outside __init__', d: 'None, until you manually set k.name' },
      answer: 'b',
      explain: 'Each call to <code>Country(...)</code> runs <code>__init__</code> fresh, with its own <code>self</code>. <code>k</code> and <code>g</code> are separate instances, each with their own independent <code>name</code> attribute.',
    },
    {
      q: 'How do you read an instance attribute from outside the class, e.g. on a variable <code>k</code>?',
      options: { a: '<code>k["name"]</code> — same as a dictionary', b: '<code>k.name</code> — dot notation', c: '<code>k.get("name")</code>', d: '<code>Country.name</code>' },
      answer: 'b',
      explain: 'Instance attributes are read with dot notation, not bracket access — this is the key syntactic difference from the dictionaries in Session 01, even though the underlying idea (a named slot holding a value) is conceptually similar.',
    },
    {
      q: 'Can you change an instance attribute after construction, e.g. <code>k.name = "Kenya (updated)"</code>?',
      options: { a: 'No — attributes set in __init__ are permanently locked', b: 'Yes — instance attributes are mutable by default, just like dictionary values were', c: 'Only if you redefine the whole class', d: 'Only inside another method, never from outside' },
      answer: 'b',
      explain: 'Unless a class deliberately prevents it (a topic for later), instance attributes can be reassigned freely from anywhere with access to the instance, exactly like a dictionary value.',
    },
  ],
  conceptTitle: '__init__ and Instance Attributes',
  sections: [
    {
      h3: 'The constructor: __init__',
      paragraphs: [
        'A class gains real data through a special method called <code>__init__</code>, which Python calls automatically every time you construct a new instance. Its job is to set up that instance\'s starting attributes.',
      ],
      code: `class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population

k = Country("Kenya", "Africa", 54000000)
print(k.name)         # "Kenya"
print(k.region)       # "Africa"
print(k.population)   # 54000000`,
    },
    {
      h3: 'self — a reference to the specific instance',
      paragraphs: [
        'When Python runs <code>Country("Kenya", "Africa", 54000000)</code>, it first creates a blank instance, then calls <code>__init__(that_instance, "Kenya", "Africa", 54000000)</code> — the instance itself is silently passed as the first argument. We name that parameter <code>self</code> by convention, and use it to attach data to that specific instance.',
      ],
      code: `class Country:
    def __init__(self, name):
        print("self is:", self)   # the instance being built
        self.name = name           # attach data to THIS instance

k = Country("Kenya")
# self is: <__main__.Country object at 0x...>`,
      diagram: {
        caption: 'Country("Kenya") silently becomes __init__(new_blank_instance, "Kenya") — self IS that new instance.',
        boxes: [
          { label: 'you write', text: 'Country("Kenya")' },
          { label: 'Python runs', text: '__init__(self, "Kenya")', accent: true },
        ],
      },
    },
    {
      h3: 'Every instance holds its own independent data',
      paragraphs: [
        'Because <code>__init__</code> runs fresh for each instance, with a different <code>self</code> each time, instances never share attribute values by default — exactly like two separate dictionaries never share keys.',
      ],
      code: `k = Country("Kenya")
g = Country("Ghana")

print(k.name)  # "Kenya"
print(g.name)  # "Ghana" — completely independent of k.name`,
    },
    {
      h3: 'Dot notation vs Session 01\'s bracket notation',
      paragraphs: [
        'Recall reading a dictionary value: <code>country["name"]</code>. An instance attribute is read the same conceptual way, but with dot notation instead of brackets, and no risk of a KeyError — accessing an attribute that truly doesn\'t exist raises AttributeError instead, which we\'ll handle the same way we handled KeyError in Session 07.',
      ],
      code: `country_dict = {"name": "Kenya"}
print(country_dict["name"])   # dict — bracket access

k = Country("Kenya", "Africa", 54000000)
print(k.name)                  # instance — dot access

# Attributes are mutable, just like dict values
k.name = "Kenya (updated)"
print(k.name)`,
    },
  ],
  callout: null,
  closing: 'Country now genuinely holds data of its own. Next session we give it behavior — methods that operate on that data without needing it passed in as an argument.',
  lab: {
    objective: 'Give Country a real constructor with name, region, and population, create multiple independent instances, and prove attributes are mutable.',
    whatYouBuild: 'A file called <code>country_init.py</code>.',
    steps: [
      { title: 'Create the file and define __init__', body: [], code: `# country_init.py
class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population` },
      { title: 'Create two instances with different data', body: [], code: `kenya = Country("Kenya", "Africa", 54000000)
peru = Country("Peru", "Americas", 33000000)

print(kenya.name, kenya.region, kenya.population)
print(peru.name, peru.region, peru.population)` },
      { title: 'Prove the instances are independent', body: ['Change one instance\'s attribute and confirm the other is untouched.'], code: `kenya.population = 55000000
print("kenya.population:", kenya.population)  # 55000000
print("peru.population:", peru.population)    # still 33000000 — unaffected` },
      { title: 'Print self inside __init__ for both instances', body: ['Add a temporary print(self) line inside __init__ to see the two different instance addresses.'], code: `class CountryDebug:
    def __init__(self, name):
        print("Building instance:", self, "with name", name)
        self.name = name

CountryDebug("Kenya")
CountryDebug("Peru")` },
      { title: 'Read one attribute with dot notation and compare it to Session 01\'s dict syntax in a comment', body: [], code: `print(kenya.name)
# Compare to Session 01: country_dict["name"] — same idea, different syntax` },
    ],
  },
  filesChanged: [
    { file: 'country_init.py', action: 'Created', why: 'A real Country class with __init__ and instance attributes.' },
    { file: 'docs/sessions/session-09/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add country_init.py docs/sessions/session-09/index.html\ngit commit -m "session-09: give Country real attributes via __init__"',
  commitQuestion: 'What does self actually refer to inside __init__, and why does mutating kenya.population not affect peru.population?',
  checklist: [
    '__init__ takes name, region, and population as parameters, all assigned to self',
    'Two instances are created with different data',
    'One instance\'s attribute is mutated and the other is proven unaffected',
    'self is printed at least once to observe it is the instance itself',
    'Dot notation is used consistently to read attributes, never bracket access',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'If you forgot to write <code>self.name = name</code> and just wrote <code>name = name</code> inside __init__, what do you predict would happen when you tried <code>kenya.name</code> afterward? Try it.',
    'Why does Python require self to be listed explicitly as the first parameter instead of making it implicit like some other languages do?',
    'What is the practical difference between a dictionary\'s keys and a class instance\'s attributes, now that you\'ve used both?',
    'Can you think of a rule (like Session 07\'s population validation) that __init__ should probably enforce, that it does not yet?',
  ],
  whatBreaks: [
    { title: 'The self.x = x omission bug', text: 'Forgetting <code>self.</code> in an assignment inside __init__ is an extremely common beginner mistake — the value is assigned to a local variable that vanishes when the method returns, and the instance ends up with no such attribute at all, causing an AttributeError later when you try to read it.' },
    { title: 'Methods (Session 10)', text: 'Every method you write from the next session forward relies on the exact same self mechanism you just learned. If self is not solid now, method definitions will look like unexplained boilerplate.' },
    { title: 'Constructor validation (Layer 4 data contracts)', text: 'In Session 26 we will formalize what a "valid" Country looks like using type hints and dataclasses — that entire session assumes you deeply understand what __init__ is actually doing today.' },
  ],
  learnedConcept: '__init__ as the constructor, self as the reference to the instance being built, and instance attributes as independent per-instance data.',
  learnedUnlocks: 'Country instances can now hold real, independent data — the foundation every remaining session in the project builds on.',
  nextTeaser: 'We give Country behavior — methods that operate on its own data without needing that data passed in as an argument every time.',
},

// ── SESSION 10 ─────────────────────────────────────────────────────
{
  num: 10,
  title: 'Instance Methods',
  nextTitle: 'Passing Data via the Constructor',
  subtitle: 'A class with only attributes is still just a fancier dictionary. Methods are functions that live on the class and operate on an instance\'s own data through self.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Define an instance method that reads self attributes',
    'Call a method on an instance using dot notation',
    'Write a method that both reads and updates self attributes',
    'Explain why a method does not need its data passed in as an argument, unlike the standalone functions from Layer 1',
    'Compare a method call to the equivalent standalone-function call from Session 04',
  ],
  quiz: [
    {
      q: 'Given <code>class Country:\\n    def __init__(self, name, population):\\n        self.name = name\\n        self.population = population\\n    def summary(self):\\n        return f"{self.name}: {self.population}"</code>, what does <code>k.summary()</code> return for <code>k = Country("Kenya", 54000000)</code>?',
      options: { a: '"Country: population"', b: '"Kenya: 54000000"', c: 'A TypeError — summary requires an argument', d: 'None, because summary only prints' },
      answer: 'b',
      explain: 'Calling <code>k.summary()</code> runs the method with <code>self</code> bound to <code>k</code>. Inside, <code>self.name</code> is "Kenya" and <code>self.population</code> is 54000000, producing "Kenya: 54000000".',
    },
    {
      q: 'Why does calling k.summary() not require you to pass k as an argument yourself, e.g. summary(k)?',
      options: { a: 'Because summary() secretly has no parameters at all', b: 'Because Python automatically passes k as the self argument when you call it via dot notation on k', c: 'Because summary() is a class-level constant, not a real function', d: 'It does require that — k.summary() is shorthand for summary(k) written incorrectly' },
      answer: 'b',
      explain: 'The dot-call syntax <code>k.summary()</code> is exactly the mechanism from Session 09 in reverse: Python automatically supplies <code>k</code> as the first argument (<code>self</code>) to <code>summary</code>. You only supply the remaining arguments explicitly.',
    },
    {
      q: 'Given a method <code>def grow_population(self, amount):\\n    self.population += amount</code>, what does <code>k.grow_population(1000000)</code> do?',
      options: { a: 'Returns a new Country with 1,000,000 more population, leaving k unchanged', b: 'Mutates k.population in place, adding 1,000,000 to it', c: 'Raises an error because self already has a population', d: 'Does nothing unless the result is assigned back to k' },
      answer: 'b',
      explain: 'Just like a dictionary or list, mutating <code>self.population</code> inside a method changes the actual instance <code>k</code> — the same instance you called the method on, in place. Nothing needs to be reassigned.',
    },
    {
      q: 'Compare method calls to the Layer 1 approach: In Session 04 we wrote <code>get_population(country_dict)</code>. What is the equivalent as a method?',
      options: { a: '<code>get_population(k)</code> — methods work exactly the same way', b: '<code>k.get_population()</code> — the instance itself is passed implicitly instead of explicitly', c: '<code>k.get_population(k)</code> — you must still pass k explicitly', d: 'Methods cannot replace standalone functions like get_population' },
      answer: 'b',
      explain: 'This is the whole point of the shift: instead of passing the data as an explicit argument to a standalone function, the data (self) is now implicit, because the method lives on the object that owns the data.',
    },
    {
      q: 'If Country defines a method called region_label(self), can you call it as Country.region_label(k) instead of k.region_label()?',
      options: { a: 'No — that syntax is always invalid', b: 'Yes — both are equivalent; k.region_label() is shorthand for Country.region_label(k)', c: 'Yes, but only for __init__, not other methods', d: 'Only if region_label takes no self parameter' },
      answer: 'b',
      explain: 'The dot-call syntax is genuinely just convenient shorthand. <code>k.region_label()</code> and <code>Country.region_label(k)</code> do exactly the same thing — the first form is simply what everyone writes in practice.',
    },
  ],
  conceptTitle: 'Instance Methods',
  sections: [
    {
      h3: 'A method is a function defined inside a class',
      paragraphs: [
        'Like __init__, every method takes self as its first parameter, giving it access to that instance\'s own attributes — no need to pass the data in as an argument, because the method already lives on the object that owns it.',
      ],
      code: `class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population

    def summary(self):
        return f"{self.name} ({self.region}): pop. {self.population:,}"

k = Country("Kenya", "Africa", 54000000)
print(k.summary())  # "Kenya (Africa): pop. 54,000,000"`,
    },
    {
      h3: 'What the dot-call actually does',
      paragraphs: [
        'When you write <code>k.summary()</code>, Python translates this into <code>Country.summary(k)</code> behind the scenes — <code>k</code> is automatically supplied as <code>self</code>. This is the exact same mechanism from Session 09\'s __init__, just used for a different method.',
      ],
      diagram: {
        caption: 'The dot-call is shorthand: k.summary() and Country.summary(k) are the same call.',
        boxes: [
          { label: 'you write', text: 'k.summary()' },
          { label: 'Python runs', text: 'Country.summary(k)', accent: true },
        ],
      },
      code: `print(k.summary())            # normal way
print(Country.summary(k))     # exactly equivalent — proves it`,
    },
    {
      h3: 'A method that mutates the instance',
      paragraphs: ['Methods can update self\'s attributes just like the standalone functions from Layer 1 updated dict keys — except now the mutation logic lives with the data it protects.'],
      code: `class Country:
    def __init__(self, name, population):
        self.name = name
        self.population = population

    def grow_population(self, amount):
        if amount < 0:
            raise ValueError("amount must be non-negative")
        self.population += amount

k = Country("Kenya", 54000000)
k.grow_population(1000000)
print(k.population)  # 55000000 — mutated in place, no reassignment needed`,
    },
    {
      h3: 'Standalone function (Layer 1) vs method (Layer 2) — side by side',
      paragraphs: ['This is the entire conceptual leap of Layer 2: the data moved inside the object, so the function moved with it.'],
      code: `# Layer 1 style — Session 04
def get_population(country_dict):
    return country_dict["population"]

print(get_population({"population": 54000000}))

# Layer 2 style — this session
class Country:
    def __init__(self, population):
        self.population = population
    def get_population(self):
        return self.population

k = Country(54000000)
print(k.get_population())  # no argument needed — self already has it`,
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Add a summary method and a mutating grow_population method to Country, then prove the dot-call is equivalent to calling through the class directly.',
    whatYouBuild: 'A file called <code>country_methods.py</code>.',
    steps: [
      { title: 'Create the file with __init__ and a summary method', body: [], code: `# country_methods.py
class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population

    def summary(self):
        return f"{self.name} ({self.region}): pop. {self.population:,}"` },
      { title: 'Create an instance and call summary()', body: [], code: `kenya = Country("Kenya", "Africa", 54000000)
print(kenya.summary())` },
      { title: 'Prove k.summary() and Country.summary(k) are the same call', body: [], code: `print(kenya.summary() == Country.summary(kenya))  # True` },
      { title: 'Add a mutating grow_population method with validation', body: ['Reuse the ValueError pattern from Session 07.'], code: `class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population

    def summary(self):
        return f"{self.name} ({self.region}): pop. {self.population:,}"

    def grow_population(self, amount):
        if amount < 0:
            raise ValueError(f"amount must be non-negative, got {amount}")
        self.population += amount

kenya = Country("Kenya", "Africa", 54000000)
kenya.grow_population(1000000)
print(kenya.summary())` },
      { title: 'Call grow_population with a negative amount inside try/except', body: ['Reuse the try/except pattern from Session 07 — confirm the exception is raised and caught.'], code: `try:
    kenya.grow_population(-500)
except ValueError as e:
    print("Rejected:", e)` },
    ],
  },
  filesChanged: [
    { file: 'country_methods.py', action: 'Created', why: 'Adds summary() and grow_population() instance methods to Country.' },
    { file: 'docs/sessions/session-10/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add country_methods.py docs/sessions/session-10/index.html\ngit commit -m "session-10: add summary and grow_population instance methods"',
  commitQuestion: 'Why does grow_population not need the country passed in as an argument the way Session 04\'s functions did?',
  checklist: [
    'summary() reads only self attributes and returns a formatted string',
    'kenya.summary() is proven equal to Country.summary(kenya)',
    'grow_population() mutates self.population in place',
    'grow_population() raises ValueError on a negative amount, reusing Session 07\'s pattern',
    'The raised exception is caught with try/except elsewhere in the file',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Rewrite grow_population as a Layer-1-style standalone function taking a dict. How many more characters does the caller have to type versus the method version?',
    'Why does putting validation logic (the ValueError check) inside the method make it harder to accidentally bypass than a separate validation function would?',
    'What would happen if you defined grow_population without self as the first parameter? Try it and read the error message carefully.',
    'Can every standalone function from Layer 1 become a method? Can you think of one that could not?',
  ],
  whatBreaks: [
    { title: 'Missing self bugs', text: 'Forgetting <code>self</code> as a method\'s first parameter produces a confusing TypeError about argument counts when the method is called normally — a very common early mistake that this session should immunize you against.' },
    { title: 'Passing data (Session 11)', text: 'Right now every instance is built by passing all fields directly to __init__. In the next session, we formalize this as "props" flowing into an object at construction time, drawing an explicit line back to the original React course\'s prop pattern.' },
    { title: 'Testing methods (Layer 5)', text: 'Every unit test you write from Session 29 onward calls methods on instances exactly the way this lab does. If method calls are not second nature, reading test code will be much harder.' },
  ],
  learnedConcept: 'Instance methods — self-bound functions that read and mutate an instance\'s own data without needing it passed in explicitly.',
  learnedUnlocks: 'Country is now a genuine object: data plus the behavior that belongs with it. This is the last piece needed before we start composing objects together.',
  nextTeaser: 'We formalize how data flows into an object at construction time, and start passing whole objects (not just primitive values) into other objects.',
},

];
