module.exports = [

// ── SESSION 01 ─────────────────────────────────────────────────────
{
  num: 1,
  title: 'Hello, World & Variables',
  nextTitle: 'Operators, Strings & Type Conversion',
  subtitle: 'Layer 0 begins. Before we can explore any Python data structure, we need the absolute basics: running a line of code, naming a value, and knowing what kind of value it is.',
  timeEstimate: '30–35 minutes',
  objectives: [
    'Run a Python file and see output with print()',
    'Create a variable and explain what "assignment" actually does',
    'Identify the four core built-in types: str, int, float, bool',
    'Use type() to check what kind of value a variable holds',
    'Explain why variable names matter for reading code, not just writing it',
  ],
  quiz: [
    {
      q: 'What does <code>print("Hello, World")</code> do?',
      options: { a: 'Creates a variable named Hello, World', b: 'Displays the text Hello, World in the console/terminal', c: 'Saves the text to a file called World', d: 'Nothing — it needs a semicolon to run' },
      answer: 'b',
      explain: '<code>print()</code> is a built-in function that displays whatever you pass it to the console. It is the most basic way to see what a Python program is doing.',
    },
    {
      q: 'Given <code>age = 30</code>, what is happening on this line?',
      options: { a: 'Python checks whether age already equals 30', b: 'A variable named age is created (or updated) to refer to the value 30', c: 'This compares age to 30 and returns True or False', d: 'This is invalid syntax — variables must be declared with a type first' },
      answer: 'b',
      explain: 'A single <code>=</code> is assignment, not comparison. It creates a name (<code>age</code>) that now refers to the value <code>30</code>. Unlike some languages, Python does not require you to declare a type upfront.',
    },
    {
      q: 'What does <code>type("30")</code> return, as opposed to <code>type(30)</code>?',
      options: { a: 'Both return the same type, int', b: '<code>type("30")</code> returns str (it\'s in quotes, so it\'s text); <code>type(30)</code> returns int (no quotes, so it\'s a number)', c: '<code>type("30")</code> returns int; <code>type(30)</code> returns str', d: 'type() only works on variables, not literal values' },
      answer: 'b',
      explain: 'Quotes make a value text (a string, <code>str</code>), regardless of what characters are inside them — even digits. <code>"30"</code> is text that looks like a number; <code>30</code> is an actual number (<code>int</code>).',
    },
    {
      q: 'Which of these is a float, not an int?',
      options: { a: '<code>population = 54000000</code>', b: '<code>is_active = True</code>', c: '<code>growth_rate = 2.3</code>', d: '<code>name = "Kenya"</code>' },
      answer: 'c',
      explain: 'A <code>float</code> is a number with a decimal point, like <code>2.3</code>. A whole number with no decimal point is an <code>int</code>. <code>True</code> is a <code>bool</code>, and <code>"Kenya"</code> is a <code>str</code>.',
    },
    {
      q: 'Why does a variable name like <code>population</code> matter more than a name like <code>x</code>, given that Python runs both identically?',
      options: { a: 'It does not matter at all — Python only cares about correctness, never readability', b: 'A clear name tells a human reader (including future you) what the value represents, without needing to trace back through the code to figure it out', c: '<code>x</code> is actually invalid as a variable name in Python', d: 'Longer variable names make the program run faster' },
      answer: 'b',
      explain: 'Python executes <code>x = 54000000</code> and <code>population = 54000000</code> identically — the computer does not care. But code is read far more often than it is written, and a clear name is free documentation for every future reader.',
    },
  ],
  conceptTitle: 'Running Code, Variables, and Types',
  sections: [
    {
      h3: 'print() — seeing what your program is doing',
      paragraphs: [
        'Every Python file is a list of instructions, run top to bottom. <code>print()</code> is how a program communicates with you — it writes text to the console, the simplest possible feedback loop.',
      ],
      code: `print("Hello, World")
print("This is a second line")

# print can take more than one thing, separated by commas — it joins them with a space
print("The answer is", 42)`,
      diagram: {
        caption: 'A Python file runs top to bottom, one line at a time — print() is your window into what is happening.',
        boxes: [
          { label: 'line 1', text: 'print(\n"Hello, World")' },
          { label: 'console', text: 'Hello, World', accent: true },
        ],
      },
    },
    {
      h3: 'Variables — naming a value so you can use it again',
      paragraphs: [
        'A variable is a name that refers to a value. Once created, you can use the name instead of retyping the value everywhere — and if the value needs to change, you only update it in one place.',
      ],
      code: `name = "Kenya"
population = 54000000

print(name)
print(population)
print(name, "has a population of", population)

# The value can change — the variable is reassigned, not "locked"
population = 55000000
print(population)  # 55000000`,
    },
    {
      h3: 'The four core types you will see constantly',
      paragraphs: [
        'Every value in Python has a type. These four cover almost everything you will touch in your first weeks: <code>str</code> (text), <code>int</code> (whole numbers), <code>float</code> (decimal numbers), and <code>bool</code> (True or False).',
      ],
      code: `name = "Kenya"           # str   — text, always in quotes
population = 54000000    # int   — a whole number
growth_rate = 2.3          # float — a number with a decimal point
is_independent = True      # bool  — exactly True or False, capitalized, no quotes

print(type(name))           # <class 'str'>
print(type(population))     # <class 'int'>
print(type(growth_rate))    # <class 'float'>
print(type(is_independent)) # <class 'bool'>`,
    },
    {
      h3: 'Quotes make all the difference',
      paragraphs: [
        'The exact same characters can be a string or a number depending entirely on whether they are in quotes. This distinction matters constantly — a number in quotes cannot be used in arithmetic without converting it first (we cover that next session).',
      ],
      code: `population_text = "54000000"   # str — this is TEXT that happens to look like a number
population_number = 54000000    # int — this is an actual number

print(type(population_text))    # <class 'str'>
print(type(population_number))  # <class 'int'>`,
    },
  ],
  callout: {
    title: 'This is Layer 0 — a true starting point:',
    text: 'If you have programmed before, this session moves fast. If this is genuinely your first code, take your time here — everything in Layer 1 onward assumes these ideas are second nature.',
  },
  closing: null,
  lab: {
    objective: 'Write a file that prints several values, stores them in well-named variables, and confirms their types with type().',
    whatYouBuild: 'A file called <code>hello.py</code>.',
    steps: [
      { title: 'Create the file and print a greeting', body: [], code: `# hello.py
print("Hello, World")
print("My name is Ada and I am learning Python")` },
      { title: 'Create four variables, one of each core type', body: ['Use real, meaningful values — pick a country, like the rest of this course will.'], code: `country_name = "Kenya"
population = 54000000
growth_rate = 2.3
is_independent = True` },
      { title: 'Print each variable with a label using print()\'s comma-joining', body: [], code: `print("Country:", country_name)
print("Population:", population)
print("Growth rate:", growth_rate)
print("Independent:", is_independent)` },
      { title: 'Print the type of each variable', body: ['Before running: predict what each type() call will print.'], code: `print(type(country_name))
print(type(population))
print(type(growth_rate))
print(type(is_independent))` },
      { title: 'Reassign one variable and prove the old value is gone', body: [], code: `population = 55000000
print("Updated population:", population)` },
    ],
  },
  filesChanged: [
    { file: 'hello.py', action: 'Created', why: 'The only file for this session. Plain Python, no imports.' },
    { file: 'docs/sessions/session-01/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add hello.py docs/sessions/session-01/index.html\ngit commit -m "session-01: print output, create variables, and check their types"',
  commitQuestion: 'What is the difference between "54000000" and 54000000, and why does that difference matter?',
  checklist: [
    'print() is used at least 3 times with different arguments',
    'Four variables are created, one of each core type (str, int, float, bool), with meaningful names',
    'type() is called on every variable and the output is observed',
    'A variable is reassigned and the new value is printed to confirm the change',
    'Every variable name clearly describes what it holds',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Why do you think Python does not require you to write the type of a variable when you create it, unlike some other languages you may have heard of?',
    'What would happen if you tried to print a variable name you never created? Try it and read the error message carefully — what does it call this kind of error?',
    'Why might a program with variables named a, b, c be harder to review than one with country_name, population, growth_rate?',
    'Can you think of a value that seems like a number but should actually be stored as a string? (Hint: think about a postal code or a phone number.)',
  ],
  whatBreaks: [
    { title: 'Every single session after this one', text: 'Variables and print() are used in literally every remaining lab in this curriculum without being re-explained. If reading a line like <code>population = 54000000</code> does not feel automatic yet, slow down here before continuing.' },
    { title: 'Type confusion bugs', text: 'Confusing "54000000" (text) with 54000000 (a number) is one of the most common beginner mistakes — it causes errors the moment you try to do arithmetic with the text version, which the next session covers directly.' },
  ],
  learnedConcept: 'Running Python code, print() for output, variables as named values, and the four core built-in types.',
  learnedUnlocks: 'You can now read and write the most basic unit of every Python program: a line that creates or displays a value.',
  nextTeaser: 'We do arithmetic and text manipulation, and learn to convert between types deliberately.',
},

// ── SESSION 02 ─────────────────────────────────────────────────────
{
  num: 2,
  title: 'Operators, Strings & Type Conversion',
  nextTitle: 'Conditionals',
  subtitle: 'Variables that just sit there are not very useful. This session is about doing things with them: arithmetic, combining text, and deliberately converting between types.',
  timeEstimate: '30–35 minutes',
  objectives: [
    'Use the arithmetic operators +, -, *, /, // and % and explain the difference between / and //',
    'Combine strings with + and with f-strings',
    'Convert between types explicitly with int(), float(), and str()',
    'Explain why 1 + "1" raises an error instead of producing 2 or "11"',
    'Use comparison operators (==, !=, <, >, <=, >=) to produce a bool',
  ],
  quiz: [
    {
      q: 'What does <code>7 // 2</code> return, as opposed to <code>7 / 2</code>?',
      options: { a: 'Both return 3.5', b: '7 / 2 returns 3.5 (regular division); 7 // 2 returns 3 (floor division — the whole-number part only)', c: '7 // 2 returns 3.5; 7 / 2 returns 3', d: '// is invalid syntax in Python' },
      answer: 'b',
      explain: '<code>/</code> always produces a float result. <code>//</code> ("floor division") divides and throws away the remainder, giving you a whole number — useful when you specifically want the whole-number part of a division.',
    },
    {
      q: 'What does <code>"Population: " + str(54000000)</code> produce?',
      options: { a: 'A TypeError, because you cannot add a string and a number', b: 'The string "Population: 54000000"', c: 'The number 54000054000000', d: 'The string "Population: " repeated 54000000 times' },
      answer: 'b',
      explain: '<code>str()</code> explicitly converts the number to text first, so <code>+</code> is now combining two strings (called "concatenation"), producing one longer string.',
    },
    {
      q: 'What happens if you write <code>"Population: " + 54000000</code> WITHOUT calling str() first?',
      options: { a: 'It silently converts the number to text and works fine', b: 'It raises a TypeError — Python refuses to implicitly combine a string and a number with +', c: 'It returns 54000000 as a number, ignoring the text', d: 'It prints "Population: " and then a separate line with the number' },
      answer: 'b',
      explain: 'Python does not automatically guess what you meant by mixing a string and a number with <code>+</code> — it raises a <code>TypeError</code> rather than silently doing something that might not be what you intended. This is deliberate: implicit, silent type mixing causes more bugs than it saves keystrokes.',
    },
    {
      q: 'Given <code>population = "54000000"</code> (a string), how do you get it as an actual number you could do math with?',
      options: { a: '<code>str(population)</code>', b: '<code>int(population)</code>', c: '<code>population.number()</code>', d: 'It is already a number because it contains only digits' },
      answer: 'b',
      explain: '<code>int()</code> converts a string of digits into an actual integer. Containing only digit CHARACTERS does not make something a number — it is still text until you explicitly convert it.',
    },
    {
      q: 'What does <code>population > 50000000</code> evaluate to, given <code>population = 54000000</code>?',
      options: { a: 'The number 54000000', b: 'The bool True', c: 'The string "True"', d: 'A SyntaxError — > only works on strings' },
      answer: 'b',
      explain: 'Comparison operators (<code>&gt;</code>, <code>&lt;</code>, <code>==</code>, etc.) always produce a <code>bool</code> — exactly <code>True</code> or <code>False</code> — which is what makes them usable in the conditionals we cover next session.',
    },
  ],
  conceptTitle: 'Operators, Strings, and Explicit Conversion',
  sections: [
    {
      h3: 'Arithmetic operators',
      paragraphs: ['Python supports the operators you would expect from a calculator, plus two less obvious ones: // (floor division) and % (modulo, the remainder after division).'],
      code: `print(10 + 3)   # 13
print(10 - 3)   # 7
print(10 * 3)   # 30
print(10 / 3)   # 3.3333333333333335 — always a float
print(10 // 3)  # 3   — floor division, whole number part only
print(10 % 3)   # 1   — modulo, the remainder`,
      diagram: {
        caption: '/ always gives you a precise float; // gives you the floor (whole-number) result of the same division.',
        boxes: [
          { label: '10 / 3', text: '3.333...' },
          { label: '10 // 3', text: '3 (floor)', accent: true },
        ],
      },
    },
    {
      h3: 'Combining strings',
      paragraphs: ['Strings can be joined with +, but only with other strings — and Python offers a cleaner way for mixing text and values: f-strings.'],
      code: `name = "Kenya"
population = 54000000

# + concatenation — every piece must already be a string
message = "Country: " + name + ", Population: " + str(population)
print(message)

# f-string — cleaner, and handles the conversion for you
message = f"Country: {name}, Population: {population}"
print(message)  # identical result, much easier to read and write`,
    },
    {
      h3: 'Explicit conversion: int(), float(), str()',
      paragraphs: [
        'Python never silently guesses how to convert between types. You always convert deliberately, using a conversion function — this is a safety feature, not an inconvenience: it forces you to notice when a conversion is happening.',
      ],
      code: `population_text = "54000000"
population_number = int(population_text)   # str -> int
print(population_number + 1000000)          # 55000000 — now real math works

rate_text = "2.3"
rate_number = float(rate_text)               # str -> float

count = 42
count_text = str(count)                      # int -> str, for combining with other text`,
    },
    {
      h3: 'Why mixing types with + is an error, not a guess',
      paragraphs: [
        'Adding a string and a number has no single obvious meaning — should it produce a number, or glue the number onto the end as text? Rather than silently picking one (and possibly surprising you), Python raises an error and makes you decide explicitly.',
      ],
      code: `# population = "Population: " + 54000000
# TypeError: can only concatenate str (not "int") to str

# You decide what you meant:
population = "Population: " + str(54000000)   # -> "Population: 54000000"`,
    },
    {
      h3: 'Comparison operators produce a bool',
      paragraphs: ['Comparing two values always gives you back exactly True or False — this is the building block the next session\'s if-statements are built on.'],
      code: `population = 54000000

print(population > 50000000)   # True
print(population == 54000000)  # True
print(population < 1000)        # False
print(population != 0)          # True`,
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Practice arithmetic, string combination with f-strings, explicit conversions, and comparisons that produce booleans.',
    whatYouBuild: 'A file called <code>operators.py</code>.',
    steps: [
      { title: 'Create the file and do basic arithmetic', body: [], code: `# operators.py
population = 54000000
neighbors = 3

print(population + 1000000)
print(population / neighbors)
print(population // neighbors)
print(population % neighbors)` },
      { title: 'Combine strings with + and then with an f-string', body: ['Compare how much easier the f-string version is to read.'], code: `name = "Kenya"
message_plus = "Country: " + name + ", population: " + str(population)
message_fstring = f"Country: {name}, population: {population}"
print(message_plus)
print(message_fstring)` },
      { title: 'Convert a text number into a real number and do math with it', body: [], code: `population_from_form = "54000000"   # imagine this came from a text input
population_number = int(population_from_form)
print(population_number + 1000000)  # only works because we converted first` },
      { title: 'Trigger and read the TypeError from mixing types, then fix it', body: ['Comment the broken line out after reading the error, and keep the fixed version.'], code: `# broken = "Population: " + population   # uncomment to see the TypeError
fixed = "Population: " + str(population)
print(fixed)` },
      { title: 'Write three comparisons and print their boolean results', body: [], code: `print(population > 50000000)
print(population == 54000000)
print(neighbors <= 2)` },
    ],
  },
  filesChanged: [
    { file: 'operators.py', action: 'Created', why: 'Demonstrates arithmetic, string combination, explicit conversion, and comparisons.' },
    { file: 'docs/sessions/session-02/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add operators.py docs/sessions/session-02/index.html\ngit commit -m "session-02: arithmetic, f-strings, explicit type conversion, and comparisons"',
  commitQuestion: 'Why does Python raise an error instead of guessing what "Population: " + 54000000 should mean?',
  checklist: [
    'All six arithmetic operators (+, -, *, /, //, %) are demonstrated',
    'Both + concatenation and an f-string are used to build the same message',
    'int() is used to convert a string to a number before doing arithmetic with it',
    'The TypeError from mixing a string and a number is triggered once, read, and understood',
    'At least three comparison operators are used and their boolean results printed',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Why might a language that silently converted "5" + 5 into either 10 or "55" actually cause MORE bugs than Python\'s explicit-error approach?',
    'When would floor division (//) actually be the right tool, instead of an inconvenience compared to regular division?',
    'Rewrite one of your f-strings using + concatenation instead. How many extra str() calls did you need?',
    'What real-world value might arrive as text that you would need to convert before doing math with it? (Think about anything typed into a search box or form.)',
  ],
  whatBreaks: [
    { title: 'The classic string-vs-number bug', text: 'Forgetting to convert a value before doing arithmetic on it (or before combining it with text) is one of the most common bugs at every experience level, not just for beginners — this session is designed to make the error message instantly recognisable.' },
    { title: 'Conditionals (next session)', text: 'Every if-statement in the next session is built directly on the comparison operators from this session. If <code>population > 50000000</code> does not clearly evaluate to a bool in your head, conditionals will feel like unexplained magic.' },
  ],
  learnedConcept: 'Arithmetic and comparison operators, string concatenation and f-strings, and explicit type conversion with int()/float()/str().',
  learnedUnlocks: 'You can now compute, combine, and convert values — and every comparison you write produces the exact ingredient conditionals need.',
  nextTeaser: 'We use the True/False results from comparisons to make a program actually branch and decide.',
},

// ── SESSION 03 ─────────────────────────────────────────────────────
{
  num: 3,
  title: 'Conditionals',
  nextTitle: 'Loops',
  subtitle: 'A program that always does the same thing is not very useful. Conditionals let a program branch — doing different things depending on the data.',
  timeEstimate: '30–35 minutes',
  objectives: [
    'Write an if statement and explain that its body only runs when the condition is True',
    'Add elif and else to handle multiple, mutually exclusive branches',
    'Combine conditions with and, or, and not',
    'Explain the difference between = (assignment) and == (comparison), a very common typo',
    'Trace, by hand, exactly which branch of an if/elif/else will run for a given value',
  ],
  quiz: [
    {
      q: 'Given <code>population = 54000000</code> and <code>if population > 50000000:\\n    print("Large")</code>, what happens?',
      options: { a: 'Nothing prints, because population is a variable, not a literal True', b: '"Large" prints, because population > 50000000 evaluates to True', c: 'It raises a SyntaxError', d: '"Large" prints regardless of the comparison' },
      answer: 'b',
      explain: 'The condition <code>population > 50000000</code> evaluates to <code>True</code> (54000000 is indeed greater than 50000000), so the indented block underneath the <code>if</code> runs.',
    },
    {
      q: 'Given <code>if population > 100000000:\\n    print("Huge")\\nelif population > 50000000:\\n    print("Large")\\nelse:\\n    print("Small")</code> with population = 54000000, what prints?',
      options: { a: '"Huge"', b: '"Large"', c: '"Small"', d: 'All three lines print' },
      answer: 'b',
      explain: 'Python checks branches top to bottom and stops at the FIRST True condition. 54000000 is not > 100000000, so it checks the next branch: 54000000 > 50000000 is True, so "Large" prints, and the else is skipped entirely — only one branch ever runs.',
    },
    {
      q: 'Given <code>region = "Africa"</code> and <code>population = 54000000</code>, which correctly checks "is this an African country with over 50 million people"?',
      options: { a: '<code>if region == "Africa" or population > 50000000:</code>', b: '<code>if region == "Africa" and population > 50000000:</code>', c: '<code>if region = "Africa" and population > 50000000:</code>', d: '<code>if region == "Africa", population > 50000000:</code>' },
      answer: 'b',
      explain: '<code>and</code> requires BOTH conditions to be True. <code>or</code> (option a) would match if EITHER were true, which is not what "African country AND over 50 million" means. Option c uses a single <code>=</code> (assignment), which is invalid inside a condition.',
    },
    {
      q: 'What is wrong with <code>if population = 54000000:</code>?',
      options: { a: 'Nothing — this correctly checks if population equals 54000000', b: 'It uses = (assignment) instead of == (comparison) — this is a SyntaxError in Python, unlike some other languages', c: 'population should be in quotes', d: 'if statements cannot use numbers, only variables' },
      answer: 'b',
      explain: 'A single <code>=</code> assigns a value; it does not compare. Python actually catches this specific mistake as a <code>SyntaxError</code> rather than silently doing the wrong thing — but it is still a very common typo worth recognising immediately.',
    },
    {
      q: 'Given <code>is_independent = True</code>, which correctly checks "is NOT independent"?',
      options: { a: '<code>if is_independent = False:</code>', b: '<code>if not is_independent:</code>', c: '<code>if is_independent != False something:</code>', d: '<code>if -is_independent:</code>' },
      answer: 'b',
      explain: '<code>not</code> flips a boolean: <code>not True</code> is <code>False</code>, and <code>not False</code> is <code>True</code>. <code>if not is_independent:</code> is the idiomatic way to check "this is False" rather than writing <code>if is_independent == False:</code>.',
    },
  ],
  conceptTitle: 'Branching with if / elif / else',
  sections: [
    {
      h3: 'if — running code only when a condition is True',
      paragraphs: ['An if statement\'s indented block only runs when its condition evaluates to True. If the condition is False, Python skips straight past it.'],
      code: `population = 54000000

if population > 50000000:
    print("Large country")

print("This line always runs, regardless of the condition")`,
      diagram: {
        caption: 'The indented block only executes when the condition is True — otherwise Python skips straight past it.',
        boxes: [
          { label: 'condition', text: 'pop > 50M?' },
          { label: 'True', text: 'run block', accent: true },
        ],
      },
    },
    {
      h3: 'elif and else — multiple, mutually exclusive branches',
      paragraphs: ['Python checks each condition top to bottom and runs only the FIRST branch whose condition is True — every remaining branch, including else, is skipped once one has matched.'],
      code: `population = 54000000

if population > 100000000:
    print("Huge country")
elif population > 50000000:
    print("Large country")
elif population > 10000000:
    print("Medium country")
else:
    print("Small country")

# Prints "Large country" — the first True condition wins, nothing else runs`,
    },
    {
      h3: 'Combining conditions with and, or, not',
      paragraphs: ['Real conditions often depend on more than one thing. and requires every part to be True; or requires at least one; not flips a boolean.'],
      code: `region = "Africa"
population = 54000000

if region == "Africa" and population > 50000000:
    print("Large African country")

if region == "Africa" or region == "Asia":
    print("Africa or Asia")

is_independent = True
if not is_independent:
    print("Not independent")
else:
    print("Independent")`,
    },
    {
      h3: 'The = vs == typo',
      paragraphs: [
        'A single = assigns; a double == compares. Python treats <code>=</code> inside a condition as a SyntaxError rather than silently reassigning the variable — a deliberate safety net, since this exact typo is extremely common when writing conditionals quickly.',
      ],
      code: `# if population = 54000000:   # SyntaxError — = cannot be used as a condition
if population == 54000000:      # correct — == compares
    print("Exactly 54 million")`,
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Write a series of conditionals classifying a country by population and region, combining and/or/not correctly.',
    whatYouBuild: 'A file called <code>conditionals.py</code>.',
    steps: [
      { title: 'Create the file and classify population size with if/elif/else', body: [], code: `# conditionals.py
population = 54000000

if population > 100000000:
    size = "Huge"
elif population > 50000000:
    size = "Large"
elif population > 10000000:
    size = "Medium"
else:
    size = "Small"

print(f"Population size category: {size}")` },
      { title: 'Combine two conditions with and', body: [], code: `region = "Africa"

if region == "Africa" and population > 50000000:
    print("This is a large African country")
else:
    print("Does not match: large African country")` },
      { title: 'Combine two conditions with or', body: [], code: `if region == "Africa" or region == "Americas":
    print("This country is in Africa or the Americas")` },
      { title: 'Use not to check a boolean is False', body: [], code: `is_independent = True

if not is_independent:
    print("Not an independent nation")
else:
    print("An independent nation")` },
      { title: 'Trigger the = vs == typo deliberately, read the error, then fix it', body: ['Comment the broken line out after reading the SyntaxError.'], code: `# if population = 54000000:   # uncomment to see the SyntaxError
if population == 54000000:
    print("Exactly 54 million")
else:
    print("Not exactly 54 million")` },
    ],
  },
  filesChanged: [
    { file: 'conditionals.py', action: 'Created', why: 'Demonstrates if/elif/else, and/or/not, and the = vs == distinction.' },
    { file: 'docs/sessions/session-03/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add conditionals.py docs/sessions/session-03/index.html\ngit commit -m "session-03: branch program flow with if/elif/else and combined conditions"',
  commitQuestion: 'Why does only ONE branch of an if/elif/else chain ever run, even if multiple conditions would technically be True?',
  checklist: [
    'An if/elif/else chain with at least 3 branches correctly classifies population size',
    'and is used to require two conditions to both be true',
    'or is used to require at least one of two conditions',
    'not is used to check that a boolean is False',
    'The = vs == SyntaxError was triggered once, read, and understood',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'In the population-classification chain, what would happen if you reordered the branches so the "Medium" check came before "Large"? Would the result change? Why or why not?',
    'Why does Python stop checking further elif branches once it finds one that is True, instead of checking all of them?',
    'Can you think of a real condition that would need and, one that would need or, and one that would need not, from your own experience (not this lab)?',
    'Why do you think Python makes = inside a condition a hard error instead of just a warning?',
  ],
  whatBreaks: [
    { title: 'Every data-filtering session ahead', text: 'From the very next Layer forward, every "find only the countries that match X" operation is built on the exact if-condition logic from this session, just applied inside a loop or comprehension instead of standalone.' },
    { title: 'The assignment/comparison typo', text: 'Writing = instead of == is one of the most common typos in any C-like or Python-like language. Python is one of the few languages that turns this into an immediate, loud SyntaxError instead of a silent, hard-to-find bug — recognising that error message on sight will save you real debugging time.' },
  ],
  learnedConcept: 'Branching program flow with if/elif/else, combining conditions with and/or/not, and the assignment-vs-comparison distinction.',
  learnedUnlocks: 'Your programs can now make decisions based on data instead of always doing the same thing — the foundation for filtering and validating data in every layer ahead.',
  nextTeaser: 'We repeat an action multiple times instead of writing it out by hand — for and while loops.',
},

// ── SESSION 04 ─────────────────────────────────────────────────────
{
  num: 4,
  title: 'Loops',
  nextTitle: 'Dictionaries',
  subtitle: 'This is the Layer 0 gate. Repeating an action for every item in a collection, or until a condition changes, is one of the most common things any program does.',
  timeEstimate: '30–35 minutes',
  objectives: [
    'Write a for loop over a list of values and explain what the loop variable holds on each pass',
    'Use range() to repeat an action a specific number of times',
    'Write a while loop and explain the risk of an infinite loop',
    'Use break to exit a loop early and continue to skip to the next iteration',
    'Combine a loop with an if statement to process only some items',
  ],
  quiz: [
    {
      q: 'Given <code>countries = ["Kenya", "Ghana", "Peru"]</code> and <code>for country in countries:\\n    print(country)</code>, what prints?',
      options: { a: 'The word "countries" three times', b: '"Kenya", then "Ghana", then "Peru", each on its own line', c: 'The whole list printed once: [\'Kenya\', \'Ghana\', \'Peru\']', d: 'Nothing — this is invalid syntax' },
      answer: 'b',
      explain: 'A <code>for ... in</code> loop runs its body once for every item in the list, binding <code>country</code> to each value in turn. Since the body is <code>print(country)</code>, each name prints on its own line.',
    },
    {
      q: 'What does <code>range(5)</code> produce when looped over?',
      options: { a: 'The numbers 1, 2, 3, 4, 5', b: 'The numbers 0, 1, 2, 3, 4 (five numbers, starting at 0)', c: 'The number 5, once', d: 'An error — range() requires two arguments' },
      answer: 'b',
      explain: '<code>range(5)</code> produces 5 numbers starting at 0 and stopping BEFORE 5: 0, 1, 2, 3, 4. This "starts at 0, stops before the given number" behavior matches how list indexing works, which is why it is the default.',
    },
    {
      q: 'What is the danger of writing <code>while count < 10:</code> without ever changing count inside the loop body?',
      options: { a: 'There is no danger — Python automatically stops after 10 iterations', b: 'An infinite loop — the condition never becomes False, so the loop runs forever (or until you force-stop the program)', c: 'A SyntaxError before the program even runs', d: 'The loop runs exactly once and then stops' },
      answer: 'b',
      explain: 'A <code>while</code> loop keeps running as long as its condition is True. If nothing inside the loop body ever changes the value being checked, the condition never becomes False, and the loop never ends — you must update the checked value yourself, usually near the end of the loop body.',
    },
    {
      q: 'Given a loop searching for the first country with population over 100 million, what does break do once it is found?',
      options: { a: 'It skips just that one item and continues the loop', b: 'It immediately exits the loop entirely, even if more items remain to check', c: 'It restarts the loop from the beginning', d: 'It has no effect inside a for loop, only while loops' },
      answer: 'b',
      explain: '<code>break</code> exits the loop immediately and completely — useful once you have found what you were looking for and have no reason to keep checking the remaining items.',
    },
    {
      q: 'Given <code>for c in countries:\\n    if c["population"] < 1000000:\\n        continue\\n    print(c["name"])</code>, what does continue do for a country with a small population?',
      options: { a: 'It stops the whole loop immediately', b: 'It skips the rest of THIS iteration\'s body (so print never runs for this item) and moves on to the next item in the loop', c: 'It removes the item from the countries list permanently', d: 'It has the same effect as break' },
      answer: 'b',
      explain: '<code>continue</code> skips only the remainder of the current iteration\'s body and moves the loop on to the next item — unlike <code>break</code>, the loop keeps going, it just skips printing for items matching the condition.',
    },
  ],
  conceptTitle: 'Repeating Actions with for and while',
  sections: [
    {
      h3: 'for loops — repeating for every item in a collection',
      paragraphs: ['A for loop runs its body once per item in a list, binding a loop variable to each value in turn — no manual counting required.'],
      code: `countries = ["Kenya", "Ghana", "Peru"]

for country in countries:
    print(country)
# Kenya
# Ghana
# Peru`,
      diagram: {
        caption: 'The loop body runs once per item — country is rebound to a new value each time through.',
        boxes: [
          { label: 'pass 1', text: 'country = "Kenya"' },
          { label: 'pass 2', text: 'country = "Ghana"', accent: true },
          { label: 'pass 3', text: 'country = "Peru"' },
        ],
      },
    },
    {
      h3: 'range() — repeating a specific number of times',
      paragraphs: ['When you want to repeat an action a fixed number of times (not tied to a list), range() generates the sequence of numbers to loop over.'],
      code: `for i in range(5):
    print(i)
# 0
# 1
# 2
# 3
# 4

# range(start, stop) — customise where it begins
for i in range(2, 5):
    print(i)  # 2, 3, 4`,
    },
    {
      h3: 'while loops — repeating until a condition changes',
      paragraphs: [
        'A while loop keeps running as long as its condition stays True. Unlike a for loop, nothing automatically ends it — you must change the checked value yourself inside the loop body, or it runs forever.',
      ],
      code: `count = 0

while count < 5:
    print(count)
    count = count + 1   # without this line, the loop never ends!
# 0
# 1
# 2
# 3
# 4`,
    },
    {
      h3: 'break and continue',
      paragraphs: ['break exits a loop immediately and completely. continue skips only the rest of the current pass and moves on to the next item.'],
      code: `countries = [
    {"name": "Norway", "population": 5400000},
    {"name": "Kenya", "population": 54000000},
    {"name": "India", "population": 1428000000},
]

# break — stop as soon as we find what we need
for c in countries:
    if c["population"] > 100000000:
        print("Found one:", c["name"])
        break

# continue — skip small countries, but keep checking the rest
for c in countries:
    if c["population"] < 10000000:
        continue
    print(c["name"])`,
    },
  ],
  callout: {
    title: 'Layer 0 gate:',
    text: 'This is the last Layer 0 session. Every remaining layer assumes for loops, comparisons, and conditionals are second nature — Layer 1 begins immediately with dictionaries and iteration built on exactly these tools.',
  },
  closing: null,
  lab: {
    objective: 'Iterate over a list with a for loop, repeat with range(), write a while loop, and use break and continue meaningfully.',
    whatYouBuild: 'A file called <code>loops.py</code>.',
    steps: [
      { title: 'Create the file and loop over a list of country names', body: [], code: `# loops.py
countries = ["Kenya", "Ghana", "Peru", "Japan"]

for country in countries:
    print(country)` },
      { title: 'Use range() to print numbered positions', body: [], code: `for i in range(len(countries)):
    print(i, countries[i])` },
      { title: 'Write a while loop that counts down from 5', body: ['Make sure the loop actually terminates.'], code: `count = 5
while count > 0:
    print(count)
    count = count - 1
print("Liftoff!")` },
      { title: 'Use break to stop as soon as a target is found', body: [], code: `target = "Peru"
for country in countries:
    if country == target:
        print("Found", target)
        break
    print("Checked", country, "- not a match")` },
      { title: 'Use continue to skip items that do not match a condition', body: [], code: `for country in countries:
    if len(country) < 5:
        continue
    print(country, "has 5 or more letters")` },
    ],
  },
  filesChanged: [
    { file: 'loops.py', action: 'Created', why: 'Demonstrates for loops, range(), while loops, break, and continue.' },
    { file: 'docs/sessions/session-04/index.html', action: 'Created', why: 'This session document — Layer 0 gate.' },
  ],
  commitCmd: 'git add loops.py docs/sessions/session-04/index.html\ngit commit -m "session-04: repeat actions with for/while loops, break, and continue"',
  commitQuestion: 'What would happen if the while loop\'s count variable was never decremented inside the loop body?',
  checklist: [
    'A for loop iterates over a list of at least 4 items',
    'range() is used to loop a specific number of times',
    'A while loop is written with a condition that correctly becomes False, avoiding an infinite loop',
    'break is used to exit a loop early once a target is found',
    'continue is used to skip items that do not meet a condition',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'What would you observe on screen if you accidentally created an infinite while loop? How would you know something was wrong, and how would you stop it?',
    'Why does break stop the ENTIRE loop, while continue only skips the current pass? Can you think of a scenario where you would want one but not the other?',
    'Rewrite the range()-based numbered loop using enumerate(countries) instead (look up what it does). Which version is clearer to you right now?',
    'Why is a for loop generally preferred over a while loop when you already know exactly what collection you are iterating over?',
  ],
  whatBreaks: [
    { title: 'Every data-processing session in this entire curriculum', text: 'From Session 05 (Dictionaries) forward through the entire Country Explorer project, looping over collections of data is the single most repeated operation in the whole course. If a for loop does not feel completely automatic, everything ahead will be much harder than it needs to be.' },
    { title: 'Infinite loops in real programs', text: 'A while loop whose condition never becomes False will hang a real program indefinitely — this is a genuine, common bug, not just a classroom exercise, and recognising the risk now will save you real debugging time later.' },
  ],
  learnedConcept: 'Repeating actions with for loops, range(), while loops, and controlling loop flow with break and continue.',
  learnedUnlocks: 'You now have every fundamental building block — variables, types, operators, conditionals, and loops — needed to read and write real Python programs. Layer 0 is complete.',
  nextTeaser: 'Layer 1 begins. We start working with Python\'s most important data structure: the dictionary — and everything from here builds toward a real, tested, deployed application.',
},

];
