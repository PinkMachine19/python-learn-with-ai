module.exports = [

// ── SESSION 31 ─────────────────────────────────────────────────────
{
  num: 31,
  title: 'Testing the Data Layer with Mocks',
  nextTitle: 'Package and Folder Organization',
  subtitle: 'This is the Layer 5 gate. We test CountryRepository in complete isolation, using a small, controlled fake dataset — no real files, no real network, ever.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Test CountryRepository by constructing it around a small, hand-written fake dataset',
    'Test that validate_country_record correctly accepts good records and rejects bad ones',
    'Explain why testing the repository this way requires zero real files or network access',
    'Write a test that verifies get_all() and find_by_region() both return the correct Country instances',
    'Connect every prior Layer 5 technique (fixtures, exact-content assertions, pytest.raises) into one cohesive test file',
  ],
  quiz: [
    {
      q: 'Why does testing CountryRepository with a small hand-written fake dataset (not the real mock_countries.py or countries.json) make the tests more reliable?',
      options: { a: 'It does not — using the real data is always better for tests', b: 'A small, controlled dataset built specifically for the test keeps the test focused, fast, and independent of the size or future changes of the real mock/JSON data — this is Session 24\'s repository design paying off directly', c: 'pytest requires all test data to be under 5 records', d: 'Fake data is required by law for testing' },
      answer: 'b',
      explain: 'This is exactly why CountryRepository was designed (Session 24) to accept any data source through its constructor: a test can build one around a tiny, purpose-built dataset with known values, making the test fast, focused, and immune to unrelated changes in the real mock data file.',
    },
    {
      q: 'A test constructs CountryRepository(raw_data=[{"name": "Testland", "region": "Testregion", "population": 1}]) and calls repo.get_all(). What should it assert?',
      options: { a: 'That the repository object itself equals the raw_data list', b: 'That the returned list contains exactly one Country instance with name=="Testland", confirming from_dict conversion happened correctly', c: 'Nothing — repositories cannot be meaningfully tested', d: 'That get_all() returns the string "Testland"' },
      answer: 'b',
      explain: 'This verifies the repository\'s actual job: fetching raw data AND converting it into proper Country instances (Session 24\'s get_all implementation). Checking the specific resulting instance\'s fields confirms the conversion is correct.',
    },
    {
      q: 'How would you test that validate_country_record (Session 26) correctly rejects a record with population as a string instead of an int?',
      options: { a: 'Call it and manually read the printed output', b: 'Use pytest.raises(TypeError) around the call, with a record deliberately containing a wrong-typed population value', c: 'This cannot be tested with pytest', d: 'Only valid records can be used in tests' },
      answer: 'b',
      explain: 'This is the same technique from Session 28/29 applied to Session 26\'s validation function — pytest.raises(TypeError) confirms the specific, correct failure mode occurs for a deliberately malformed input.',
    },
    {
      q: 'Why is testing the data layer this way (in-memory fake data, zero files, zero network) considered a genuine unit test rather than a slower integration test?',
      options: { a: 'There is no meaningful distinction between the two', b: 'A unit test isolates the code under test from external systems (files, network, databases); by injecting fake in-memory data through the constructor, the repository\'s OWN logic is tested completely independent of any real external dependency', c: 'Integration tests are always faster than unit tests', d: 'Unit tests require an internet connection, unlike integration tests' },
      answer: 'b',
      explain: 'A unit test verifies one unit of logic in isolation. By injecting fake data directly (rather than reading a real file or hitting a real API), the test verifies CountryRepository\'s own logic — completely decoupled from whether a real file or API happens to be available or correctly formatted at test time.',
    },
    {
      q: 'A test suite for this project now spans country.py\'s Country and CountryExplorer classes plus CountryRepository — around a dozen test functions total. What has this Layer 5 investment actually purchased for Layer 6 (Architecture, next)?',
      options: { a: 'Nothing directly useful for refactoring', b: 'The ability to refactor the project\'s internal structure confidently, because the test suite will immediately flag if a refactor accidentally changes any tested behavior', c: 'Tests have no relationship to future refactoring work', d: 'Tests make future features impossible to add' },
      answer: 'b',
      explain: 'This is the payoff promised back in Session 27: a real, working test suite is what makes Layer 6\'s architecture refactoring sessions safe to approach boldly, since any accidental behavior change during a reorganization will be caught immediately.',
    },
  ],
  conceptTitle: 'Testing the Data Layer in Isolation',
  sections: [
    {
      h3: 'Building the repository around fake, in-memory data',
      paragraphs: ['Session 24\'s design — accepting any raw_data through the constructor — is exactly what makes this possible: a test can supply a tiny, purpose-built dataset instead of the real mock file or a real JSON file.'],
      code: `from country import Country, CountryRepository

def test_get_all_converts_raw_data_to_country_instances():
    fake_data = [
        {"name": "Testland", "region": "Testregion", "population": 1},
    ]
    repo = CountryRepository(raw_data=fake_data)

    result = repo.get_all()

    assert len(result) == 1
    assert isinstance(result[0], Country)
    assert result[0].name == "Testland"
    assert result[0].population == 1`,
    },
    {
      h3: 'Testing find_by_region against a known fake dataset',
      paragraphs: ['A small, deliberately crafted dataset — with known regions — makes it trivial to assert on exact results, following Session 29\'s exact-content discipline.'],
      code: `def test_find_by_region_filters_correctly():
    fake_data = [
        {"name": "Testland", "region": "Africa", "population": 1},
        {"name": "Otherland", "region": "Europe", "population": 2},
        {"name": "Thirdland", "region": "Africa", "population": 3},
    ]
    repo = CountryRepository(raw_data=fake_data)

    result = repo.find_by_region("Africa")

    assert [c.name for c in result] == ["Testland", "Thirdland"]`,
      diagram: {
        caption: 'The test supplies its own small, controlled dataset directly to the repository — no real file, no network, ever touched.',
        boxes: [
          { label: 'fake_data', text: 'built by the\ntest itself' },
          { label: 'CountryRepository', text: 'unmodified,\nreal class', accent: true },
          { label: 'result', text: 'asserted exactly' },
        ],
      },
    },
    {
      h3: 'Testing validate_country_record with good and bad records',
      paragraphs: ['Session 26\'s validation function is tested the same way as any other function — normal case, and edge/error cases using pytest.raises.'],
      code: `import pytest
from country import validate_country_record

def test_validate_accepts_correct_record():
    data = {"name": "Kenya", "region": "Africa", "population": 54000000}
    assert validate_country_record(data) == data  # unchanged, valid

def test_validate_rejects_missing_field():
    with pytest.raises(ValueError):
        validate_country_record({"name": "Ghost Nation"})

def test_validate_rejects_wrong_type():
    with pytest.raises(TypeError):
        validate_country_record({"name": "Kenya", "region": "Africa", "population": "fifty-four"})`,
    },
    {
      h3: 'This is a unit test, not an integration test',
      paragraphs: ['Because everything happens in-memory, with no real file or network access, these tests run fast and are completely unaffected by whether a real file exists, is correctly formatted, or a real API happens to be reachable at test time.'],
    },
  ],
  callout: {
    title: 'Layer 5 gate:',
    text: 'This is the last Layer 5 session. Every layer that follows assumes you can confidently write isolated tests for any piece of the application, using fake data injected through a well-designed constructor.',
  },
  closing: null,
  lab: {
    objective: 'Build a complete, isolated test suite for CountryRepository and validate_country_record using small, purpose-built fake datasets.',
    whatYouBuild: 'A file called <code>tests/test_repository.py</code>, extending country.py with CountryRepository and validate_country_record if not already present.',
    steps: [
      { title: 'Ensure country.py has CountryRepository and validate_country_record', body: [], code: `# country.py (additions if not already present)
class CountryRepository:
    def __init__(self, raw_data):
        self._raw_data = raw_data

    def get_all(self):
        return [Country.from_dict(r) for r in self._raw_data]

    def find_by_region(self, region):
        return [Country.from_dict(r) for r in self._raw_data if r["region"] == region]

def validate_country_record(data):
    required = {"name": str, "region": str, "population": int}
    for key, expected_type in required.items():
        if key not in data:
            raise ValueError(f"missing required field: {key}")
        if not isinstance(data[key], expected_type):
            raise TypeError(f"{key} must be {expected_type.__name__}, got {type(data[key]).__name__}")
    return data` },
      { title: 'Write tests for get_all() using a small fake dataset', body: [], code: `# tests/test_repository.py
import pytest
from country import Country, CountryRepository, validate_country_record

def test_get_all_converts_to_country_instances():
    fake_data = [{"name": "Testland", "region": "Testregion", "population": 1}]
    repo = CountryRepository(raw_data=fake_data)
    result = repo.get_all()
    assert len(result) == 1
    assert isinstance(result[0], Country)
    assert result[0].name == "Testland"` },
      { title: 'Write tests for find_by_region with exact-content assertions', body: [], code: `def test_find_by_region_exact_matches():
    fake_data = [
        {"name": "Testland", "region": "Africa", "population": 1},
        {"name": "Otherland", "region": "Europe", "population": 2},
        {"name": "Thirdland", "region": "Africa", "population": 3},
    ]
    repo = CountryRepository(raw_data=fake_data)
    result = repo.find_by_region("Africa")
    assert [c.name for c in result] == ["Testland", "Thirdland"]

def test_find_by_region_no_matches():
    repo = CountryRepository(raw_data=[{"name": "Testland", "region": "Africa", "population": 1}])
    assert repo.find_by_region("Antarctica") == []` },
      { title: 'Write validate_country_record tests: valid, missing field, wrong type', body: [], code: `def test_validate_accepts_correct_record():
    data = {"name": "Kenya", "region": "Africa", "population": 54000000}
    assert validate_country_record(data) == data

def test_validate_rejects_missing_field():
    with pytest.raises(ValueError):
        validate_country_record({"name": "Ghost Nation"})

def test_validate_rejects_wrong_type():
    with pytest.raises(TypeError):
        validate_country_record({"name": "Kenya", "region": "Africa", "population": "fifty-four"})` },
      { title: 'Run the full project test suite and confirm everything passes together', body: ['Run pytest with no arguments from the project root — every test file from Sessions 28-31 should be discovered and pass.'], code: '# pytest -v' },
    ],
  },
  filesChanged: [
    { file: 'country.py', action: 'Modified', why: 'Ensures CountryRepository and validate_country_record are present as real, importable code.' },
    { file: 'tests/test_repository.py', action: 'Created', why: 'A complete, isolated test suite for the data-access layer using in-memory fake data.' },
    { file: 'docs/sessions/session-31/index.html', action: 'Created', why: 'This session document — Layer 5 gate.' },
  ],
  commitCmd: 'git add country.py tests/test_repository.py docs/sessions/session-31/index.html\ngit commit -m "session-31: test the repository and validation logic in complete isolation"',
  commitQuestion: 'Why do none of these tests need a real file on disk or a network connection to run?',
  checklist: [
    'CountryRepository tests construct it around a small, purpose-built fake dataset, not the real mock or JSON data',
    'get_all() is tested for correct conversion into Country instances with correct field values',
    'find_by_region() is tested for exact matches and for a no-match case',
    'validate_country_record() is tested for a valid record, a missing field, and a wrong type',
    'The entire project test suite (Sessions 28-31) passes together with a single pytest run',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Why would testing CountryRepository against the REAL mock_countries.py file (instead of a small fake dataset built in the test) make the test more fragile over time?',
    'How many total tests have you written across Layer 5? What parts of the project (from Sessions 1-26) still have zero test coverage, and would they be worth adding tests for?',
    'What is the relationship between this session\'s "inject fake data through the constructor" technique and Session 11\'s "explicit constructor arguments, not hidden global state" principle?',
    'If you had to explain to someone why this project is now safer to refactor than it was at Session 20, what would you point to specifically?',
  ],
  whatBreaks: [
    { title: 'Fragile, slow tests', text: 'Testing against real files or real APIs makes tests slow, flaky (network can fail for reasons unrelated to your code), and dependent on external state being correctly set up — exactly what isolated unit testing with fake data avoids.' },
    { title: 'Unsafe refactoring (Layer 6)', text: 'Without this session\'s test coverage of the data layer specifically, Layer 6\'s folder reorganization sessions would risk silently breaking how data flows through the repository, with nothing to catch it.' },
    { title: 'Real APIs without a safety net (Layer 7)', text: 'When Session 38 introduces a genuinely real, unreliable external API, having the repository\'s OWN logic already fully tested in isolation means only the new real-API-specific code needs new testing attention, not the whole data layer again.' },
  ],
  learnedConcept: 'Testing a data-access layer in complete isolation using small, purpose-built fake datasets injected through the constructor — true unit testing, not integration testing.',
  learnedUnlocks: 'The entire application — Country, CountryExplorer, CountryRepository, and validation — is now covered by a real, isolated, fast test suite. Layer 6\'s refactoring can proceed with confidence.',
  nextTeaser: 'Layer 6 begins. We reorganize the growing project into a proper package structure — everything up to now has lived in a handful of flat files.',
},

// ── SESSION 32 ─────────────────────────────────────────────────────
{
  num: 32,
  title: 'Package and Folder Organization',
  nextTitle: 'Reusable Functions and Modules',
  subtitle: 'Layer 6 begins. Our project has grown past what flat files can comfortably hold. We reorganize into a proper Python package structure.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Explain the difference between a module (Session 06) and a package',
    'Create a package using an __init__.py file',
    'Reorganize country.py\'s growing classes into a package with focused submodules',
    'Update import statements across the project to match the new structure',
    'Run the existing test suite after reorganizing, to confirm nothing broke',
  ],
  quiz: [
    {
      q: 'What is the difference between a module (Session 06) and a package?',
      options: { a: 'They are exactly the same thing with different names', b: 'A module is a single .py file; a package is a directory containing multiple related modules, marked with an __init__.py file', c: 'A package can only contain classes, never functions', d: 'A module can contain other modules; a package cannot' },
      answer: 'b',
      explain: 'A module (Session 06) is one file. A package is a directory of related modules, grouped together and marked as an importable unit by an <code>__init__.py</code> file (which can be empty or can re-export names for convenience).',
    },
    {
      q: 'What is the minimum required for a directory to be treated as a regular Python package?',
      options: { a: 'A file named package.json', b: 'An __init__.py file inside the directory (even if empty)', c: 'At least 10 files inside it', d: 'A README.md file' },
      answer: 'b',
      explain: 'An <code>__init__.py</code> file (even completely empty) is what traditionally marks a directory as a Python package, making <code>from mypackage import something</code> work.',
    },
    {
      q: 'You split country.py into country_explorer/models.py (Country, CountryExplorer), country_explorer/repository.py (CountryRepository), and country_explorer/validators.py. What must change in files that used to do from country import Country?',
      options: { a: 'Nothing — Python automatically finds Country wherever it was moved to', b: 'The import must be updated to reflect the new location, e.g. from country_explorer.models import Country', c: 'Country must be renamed', d: 'All files that used Country must be deleted and rewritten from scratch' },
      answer: 'b',
      explain: 'Moving a class to a new module means every import referencing its old location must be updated to the new path — this is a real, visible cost of reorganizing, which is exactly why a test suite (Layer 5) is valuable for confirming nothing was missed.',
    },
    {
      q: 'Why should you run the full test suite immediately after reorganizing files into a package, before making any other changes?',
      options: { a: 'It is not necessary; reorganizing files never breaks anything', b: 'Reorganizing is a pure refactor (no intended behavior change) — running tests immediately confirms every import was updated correctly and nothing was accidentally broken in the process', c: 'Tests must be run before every single line of code is written, always', d: 'Running tests fixes broken imports automatically' },
      answer: 'b',
      explain: 'This is Layer 5\'s entire payoff: a reorganization SHOULD change nothing about behavior, only structure. Running the test suite immediately after confirms that promise held — if any test fails, an import was missed or something subtly broke.',
    },
    {
      q: 'What is a reasonable way to split country.py\'s growing content across a package, based on Session 24\'s separation of concerns?',
      options: { a: 'Randomly, by alphabetical order of the code inside each file', b: 'By responsibility — e.g. models.py for Country/CountryExplorer, repository.py for CountryRepository, validators.py for validation logic — mirroring the conceptual separations already established', c: 'Every single function and class must go in its own separate file, no matter how small', d: 'Splitting should wait until the project is finished' },
      answer: 'b',
      explain: 'Good package organization follows the conceptual boundaries already established by the project\'s design (Session 24\'s repository vs explorer distinction, Session 20\'s separate validators module) — grouping by responsibility, not arbitrarily.',
    },
  ],
  conceptTitle: 'Modules vs Packages',
  sections: [
    {
      h3: 'From one growing file to a package',
      paragraphs: ['country.py has grown to contain Country, CountryExplorer, CountryRepository, and validate_country_record — several distinct responsibilities crammed into one file. A package lets us split these while keeping them organized under one importable unit.'],
      code: `# Before — everything in one growing file
# country.py
class Country: ...
class CountryExplorer: ...
class CountryRepository: ...
def validate_country_record(data): ...`,
    },
    {
      h3: 'Creating a package with __init__.py',
      paragraphs: ['A directory becomes a package once it contains an __init__.py file. The file can be empty, or it can re-export names to make imports more convenient for users of the package.'],
      code: `# country_explorer/__init__.py
from .models import Country, CountryExplorer
from .repository import CountryRepository
from .validators import validate_country_record

# This lets other code do: from country_explorer import Country
# instead of the more verbose: from country_explorer.models import Country`,
      diagram: {
        caption: 'country.py splits into a package: focused submodules, with __init__.py re-exporting the names external code actually needs.',
        boxes: [
          { label: 'country.py', text: 'one growing\nfile' },
          { label: 'country_explorer/', text: 'models.py\nrepository.py\nvalidators.py', accent: true },
        ],
      },
    },
    {
      h3: 'Splitting by responsibility',
      paragraphs: ['Following the conceptual boundaries already established in the project — Session 24\'s repository/explorer split, Session 20\'s separate validators — gives a natural, sensible package layout.'],
      code: `# country_explorer/models.py
class Country:
    ...

class CountryExplorer:
    ...

# country_explorer/repository.py
from .models import Country

class CountryRepository:
    ...

# country_explorer/validators.py
def validate_country_record(data):
    ...`,
    },
    {
      h3: 'Updating imports and re-running the test suite',
      paragraphs: ['Every file that imported from country now needs to import from country_explorer (or a specific submodule). Running the full test suite immediately afterward confirms the reorganization did not silently break anything — the payoff of Layer 5\'s investment.'],
      code: `# tests/test_country.py — before
# from country import Country

# tests/test_country.py — after
from country_explorer import Country

# Then: pytest -v
# If every test still passes, the reorganization was behavior-preserving, as intended`,
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Reorganize country.py into a country_explorer/ package with focused submodules, update all imports, and confirm the full test suite still passes.',
    whatYouBuild: 'A new package directory <code>country_explorer/</code> replacing the flat <code>country.py</code>.',
    steps: [
      { title: 'Create the country_explorer/ directory with __init__.py', body: [], code: `# country_explorer/__init__.py
from .models import Country, CountryExplorer
from .repository import CountryRepository
from .validators import validate_country_record` },
      { title: 'Move Country and CountryExplorer into models.py', body: [], code: `# country_explorer/models.py
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
        self.population += amount

    @classmethod
    def from_dict(cls, data):
        return cls(**data)


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
      { title: 'Move CountryRepository into repository.py, importing Country from models', body: [], code: `# country_explorer/repository.py
from .models import Country

class CountryRepository:
    def __init__(self, raw_data):
        self._raw_data = raw_data

    def get_all(self):
        return [Country.from_dict(r) for r in self._raw_data]

    def find_by_region(self, region):
        return [Country.from_dict(r) for r in self._raw_data if r["region"] == region]` },
      { title: 'Move validate_country_record into validators.py', body: [], code: `# country_explorer/validators.py
def validate_country_record(data):
    required = {"name": str, "region": str, "population": int}
    for key, expected_type in required.items():
        if key not in data:
            raise ValueError(f"missing required field: {key}")
        if not isinstance(data[key], expected_type):
            raise TypeError(f"{key} must be {expected_type.__name__}, got {type(data[key]).__name__}")
    return data` },
      { title: 'Update every test file\'s imports and run the full suite', body: ['Change every from country import ... to from country_explorer import ..., delete the old country.py, and run pytest -v.'], code: `# tests/test_country.py, test_return_values.py, test_state_changes.py, test_repository.py
# change: from country import Country, CountryExplorer, CountryRepository, validate_country_record
# to:     from country_explorer import Country, CountryExplorer, CountryRepository, validate_country_record

# pytest -v` },
    ],
  },
  filesChanged: [
    { file: 'country_explorer/__init__.py', action: 'Created', why: 'Marks the directory as a package and re-exports the key names.' },
    { file: 'country_explorer/models.py', action: 'Created', why: 'Country and CountryExplorer, moved from country.py.' },
    { file: 'country_explorer/repository.py', action: 'Created', why: 'CountryRepository, moved from country.py.' },
    { file: 'country_explorer/validators.py', action: 'Created', why: 'validate_country_record, moved from country.py.' },
    { file: 'country.py', action: 'Deleted', why: 'Replaced by the new country_explorer package.' },
    { file: 'tests/*.py', action: 'Modified', why: 'Import paths updated to the new package structure.' },
    { file: 'docs/sessions/session-32/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add country_explorer/ tests/ docs/sessions/session-32/index.html\ngit rm country.py\ngit commit -m "session-32: reorganize into a country_explorer package with focused submodules"',
  commitQuestion: 'Why did running the full test suite right after this reorganization matter more than after almost any previous session?',
  checklist: [
    'country_explorer/ is a real package with __init__.py re-exporting the key names',
    'models.py, repository.py, and validators.py each contain only their own responsibility',
    'repository.py imports Country from .models rather than duplicating it',
    'Every test file\'s imports are updated to the new package path',
    'The full test suite passes with zero failures after the reorganization',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Did any test fail immediately after the reorganization? If so, what did that reveal about a missed import? If not, what does that tell you about how thorough Layer 5\'s coverage really was?',
    'Why does __init__.py re-export names instead of requiring every caller to know the exact submodule (models, repository, validators) a given class lives in?',
    'How does this package split reflect the conceptual boundaries you\'ve been building since Session 24 (repository) and Session 20 (validators), rather than an arbitrary split?',
    'What would you do differently if you needed to add a FOURTH responsibility to this package later — how would you decide whether it deserves its own submodule?',
  ],
  whatBreaks: [
    { title: 'Import errors from a rushed reorganization', text: 'Reorganizing files without updating every import reference (and without a test suite to catch the ones you miss) is one of the most common sources of "it worked yesterday" bugs in real projects.' },
    { title: 'Reusable modules (Session 33)', text: 'The next session builds genuinely reusable utility functions — having a clean package structure in place first makes it obvious where new shared code should live.' },
    { title: 'God objects and tight coupling (Session 35)', text: 'A clean package split makes it much easier to SEE when one module starts doing too much or reaching too deeply into another\'s internals — the problem Session 35 addresses directly.' },
  ],
  learnedConcept: 'Packages vs modules, creating a package with __init__.py, and safely reorganizing a growing codebase with a test suite as a safety net.',
  learnedUnlocks: 'The project now has a real, scalable package structure instead of one growing flat file — and you have proven, with tests, that the reorganization changed nothing about behavior.',
  nextTeaser: 'We extract genuinely reusable functions and utility modules, building on the clean structure we just established.',
},

// ── SESSION 33 ─────────────────────────────────────────────────────
{
  num: 33,
  title: 'Reusable Functions and Modules',
  nextTitle: 'Building Utility Modules',
  subtitle: 'With a clean package structure in place, we identify genuinely reusable logic scattered across the project and extract it into shared, well-tested functions.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Identify duplicated or near-duplicated logic across different parts of the project',
    'Extract that logic into a single, well-named, reusable function',
    'Write a docstring that documents a function\'s parameters, return value, and behavior clearly',
    'Add tests for the newly extracted function to close a coverage gap',
    'Distinguish "reusable" from "premature abstraction" — extracting too early or unnecessarily',
  ],
  quiz: [
    {
      q: 'Both summary() (formatting a country) and a hypothetical future feature might need to format a large number with comma separators, like 54,000,000. If this formatting appears in two places with near-identical code, what should you do?',
      options: { a: 'Leave both copies as-is; duplication is always fine', b: 'Extract the shared formatting logic into one function both call, so a future change (like switching to a different number format) only needs to happen once', c: 'Delete one of the two features entirely', d: 'Rewrite everything in a different language' },
      answer: 'b',
      explain: 'This is Session 06\'s "one place to change" principle applied specifically to duplicated logic — extracting shared behavior into one function prevents the two copies from silently drifting apart when one gets updated and the other is forgotten.',
    },
    {
      q: 'What is the purpose of a docstring like <code>"""Format a population count with comma separators.\\n\\nArgs:\\n    value: the population as an int\\nReturns:\\n    A string like \'54,000,000\'\\n"""</code> right under a function definition?',
      options: { a: 'It has no functional purpose and is purely decorative', b: 'It documents what the function does, its parameters, and its return value directly alongside the code, readable by both humans and many tooling/help systems', c: 'It is required for the function to run at all', d: 'It replaces the need for type hints entirely' },
      answer: 'b',
      explain: 'A docstring is documentation that lives directly with the code it describes, readable via <code>help(function_name)</code> and by anyone reading the source — especially valuable for a function meant to be reused by other parts of the project.',
    },
    {
      q: 'Why should a newly extracted reusable function get its own tests, even if the code it was extracted FROM was already tested indirectly?',
      options: { a: 'It is unnecessary; existing tests already cover it completely', b: 'A direct test of the reusable function in isolation is faster to write, easier to understand, and will catch bugs specifically in that function without needing to go through the whole original context it was extracted from', c: 'Tests are only needed for classes, never for standalone functions', d: 'Extracted functions cannot be tested with pytest' },
      answer: 'b',
      explain: 'A focused, direct test of the extracted function (following Session 29\'s return-value testing techniques) is simpler and more precise than relying on it being indirectly exercised through some other, larger test — and it documents the function\'s contract clearly on its own.',
    },
    {
      q: 'What is "premature abstraction," and why is it a real risk when looking for things to extract?',
      options: { a: 'It refers to extracting code too slowly, which is never a real problem', b: 'Extracting a shared function for logic that only appears once, or that only coincidentally looks similar in two places but actually serves different purposes, adding unnecessary complexity for no real benefit', c: 'It only applies to classes, never to functions', d: 'It is a term with no real meaning in software design' },
      answer: 'b',
      explain: 'Not all similar-looking code should be merged — if two pieces of logic happen to look alike now but serve genuinely different purposes and are likely to diverge, forcing them into one shared function adds complexity and coupling without a real benefit. Extraction should follow genuine, ongoing duplication of ONE actual concept.',
    },
    {
      q: 'Where is the most sensible place, given Session 32\'s new package structure, to put a genuinely reusable formatting function used across multiple parts of the project?',
      options: { a: 'Duplicated inline in every file that needs it', b: 'A new, focused module — e.g. country_explorer/formatting.py — following the same by-responsibility organization established in Session 32', c: 'Directly inside the Country class as a private method, hidden from everything else', d: 'It does not matter where reusable code lives' },
      answer: 'b',
      explain: 'This follows directly from Session 32\'s package organization principle: a genuinely reusable, standalone piece of logic gets its own focused module, consistent with how models.py, repository.py, and validators.py were each split out by responsibility.',
    },
  ],
  conceptTitle: 'Extracting Reusable Logic',
  sections: [
    {
      h3: 'Spotting duplicated logic',
      paragraphs: ['As a project grows, similar formatting or calculation logic tends to appear in more than one place. The first step is noticing it — comparing what several pieces of code are actually doing, not just how they look on the surface.'],
      code: `# Duplication scattered across the project:

# models.py
def summary(self):
    return f"{self.name} ({self.region}): pop. {self.population:,}"

# some future report-generation code, formatting the same kind of number again
def population_report_line(name, population):
    return f"{name}: {population:,} people"`,
    },
    {
      h3: 'Extracting one shared function',
      paragraphs: ['Once genuine, ongoing duplication is identified, extract it into one well-named function, and update every call site to use it — exactly the "one place to change" principle from Session 06.'],
      code: `# country_explorer/formatting.py
def format_population(value):
    """Format a population count with comma separators.

    Args:
        value: the population as an int.
    Returns:
        A string like "54,000,000".
    """
    return f"{value:,}"

# models.py
from .formatting import format_population

def summary(self):
    return f"{self.name} ({self.region}): pop. {format_population(self.population)}"`,
      diagram: {
        caption: 'Two near-identical formatting expressions collapse into one shared, tested, documented function.',
        boxes: [
          { label: 'summary()', text: 'f"{pop:,}"' },
          { label: 'report line', text: 'f"{pop:,}"' },
          { label: 'format_population()', text: 'one shared function', accent: true },
        ],
      },
    },
    {
      h3: 'Documenting the extracted function with a docstring',
      paragraphs: ['A function meant to be reused across the project deserves clear documentation of what it takes and what it returns, directly alongside the code — readable via help() and by anyone reading the source.'],
    },
    {
      h3: 'Testing the extracted function directly',
      paragraphs: ['A focused test of the standalone function is simpler than relying on it being indirectly exercised through summary() or other larger tests.'],
      code: `# tests/test_formatting.py
from country_explorer.formatting import format_population

def test_format_population_adds_commas():
    assert format_population(54000000) == "54,000,000"

def test_format_population_small_number():
    assert format_population(5) == "5"`,
    },
    {
      h3: 'When NOT to extract — premature abstraction',
      paragraphs: ['If two pieces of code happen to look similar right now, but represent genuinely different concepts likely to change independently, forcing them into a shared function adds coupling without a real benefit. Extraction should follow real, ongoing duplication of one actual idea — not surface-level resemblance.'],
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Extract a shared, documented, tested format_population function, and identify (without necessarily extracting) a case of premature abstraction.',
    whatYouBuild: 'A new module <code>country_explorer/formatting.py</code> plus <code>tests/test_formatting.py</code>.',
    steps: [
      { title: 'Create formatting.py with format_population and a clear docstring', body: [], code: `# country_explorer/formatting.py
def format_population(value):
    """Format a population count with comma separators.

    Args:
        value: the population as an int.
    Returns:
        A string like "54,000,000".
    """
    return f"{value:,}"` },
      { title: 'Update models.py\'s summary() to use the extracted function', body: [], code: `# country_explorer/models.py
from .formatting import format_population

class Country:
    # ... existing code ...
    def summary(self):
        return f"{self.name} ({self.region}): pop. {format_population(self.population)}"` },
      { title: 'Write direct tests for format_population', body: [], code: `# tests/test_formatting.py
from country_explorer.formatting import format_population

def test_format_population_adds_commas():
    assert format_population(54000000) == "54,000,000"

def test_format_population_small_number():
    assert format_population(0) == "0"` },
      { title: 'Run the full test suite, confirming summary()\'s existing tests still pass unchanged', body: ['This proves the extraction was behavior-preserving.'], code: '# pytest -v' },
      { title: 'Write a short comment describing a case of near-identical-looking code you deliberately did NOT merge, and why', body: ['This exercises the "premature abstraction" judgment call — invent a plausible example if needed, e.g. two functions that both happen to check "value > 0" but for conceptually different reasons.'] },
    ],
  },
  filesChanged: [
    { file: 'country_explorer/formatting.py', action: 'Created', why: 'A shared, documented, reusable population formatting function.' },
    { file: 'country_explorer/models.py', action: 'Modified', why: 'summary() now uses the extracted, shared function.' },
    { file: 'tests/test_formatting.py', action: 'Created', why: 'Direct, focused tests for the extracted function.' },
    { file: 'docs/sessions/session-33/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add country_explorer/formatting.py country_explorer/models.py tests/test_formatting.py docs/sessions/session-33/index.html\ngit commit -m "session-33: extract and test a reusable format_population function"',
  commitQuestion: 'How did I confirm this extraction was purely a refactor and did not change summary()\'s existing observable behavior?',
  checklist: [
    'format_population has a clear docstring describing its argument and return value',
    'models.py\'s summary() calls the extracted function instead of duplicating the formatting inline',
    'test_formatting.py directly and independently tests format_population',
    'The full pre-existing test suite (Sessions 27-32) still passes after this change',
    'A written comment identifies a plausible case of premature abstraction that was deliberately NOT merged',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Before this session, summary()\'s formatting logic was only tested indirectly through summary()\'s own tests. Why is a direct test of format_population still valuable now that it exists?',
    'Can you find another piece of logic anywhere in the project (Sessions 1-32) that is duplicated and could benefit from this same extraction treatment?',
    'What is the cost of extracting something too early, before a second real use case actually exists? Contrast that with the cost of NOT extracting genuinely duplicated logic.',
    'How does docstring documentation differ in purpose from the reflection comments you\'ve written throughout this curriculum?',
  ],
  whatBreaks: [
    { title: 'Silent formatting drift', text: 'Without extracting shared formatting logic, a future change to how numbers should display (e.g. adding a currency symbol) risks being applied in one place and forgotten in another, producing visibly inconsistent output across the application.' },
    { title: 'Utility modules (Session 34)', text: 'The next session builds on this exact pattern, extracting more substantial, cross-cutting utility logic into its own dedicated module — formatting.py is the first, smallest example of that broader pattern.' },
    { title: 'Recognizing coupling problems (Session 35)', text: 'Learning to correctly judge WHEN to extract (and when NOT to, per premature abstraction) is a prerequisite for Session 35\'s harder judgment call: recognizing when a class has taken on too much responsibility.' },
  ],
  learnedConcept: 'Identifying genuine duplication, extracting it into a documented, tested, reusable function, and recognizing premature abstraction as a real risk to avoid.',
  learnedUnlocks: 'You can now confidently spot and safely extract reusable logic from a growing codebase, backed by tests that prove the extraction changed nothing about behavior.',
  nextTeaser: 'We build a more substantial, standalone utility module — logic that supports the whole application without being tied to any one class.',
},

// ── SESSION 34 ─────────────────────────────────────────────────────
{
  num: 34,
  title: 'Building Utility Modules',
  nextTitle: 'The Prop Drilling Problem',
  subtitle: 'Beyond small extracted functions, some logic is genuinely cross-cutting — useful to many different parts of the application without belonging to any single class.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Design a utility module containing several related, standalone functions',
    'Explain the difference between a utility function and a method that belongs on a class',
    'Build a search-relevance utility used by both the repository and the explorer',
    'Keep a utility module free of dependencies on any one specific class, keeping it broadly reusable',
    'Test a utility module thoroughly, since it will be relied upon from multiple places',
  ],
  quiz: [
    {
      q: 'A function that checks whether a search term appears in a country\'s name, case-insensitively, is useful both inside CountryExplorer and potentially inside CountryRepository. Where should it live?',
      options: { a: 'Duplicated inside both classes separately', b: 'As a standalone function in a utility module (e.g. search.py), imported by whichever class needs it, rather than tied to one specific class', c: 'It must be a method on Country specifically, and nowhere else', d: 'It cannot be reused across two different classes' },
      answer: 'b',
      explain: 'Logic that is genuinely useful to more than one class, and does not conceptually "belong" to any single one of them, is exactly what a utility module is for — a shared, standalone piece of logic multiple classes can import and use.',
    },
    {
      q: 'What is the key difference between a utility function like matches_search_term(name, term) and an instance method like Country.summary(self)?',
      options: { a: 'There is no real difference between the two', b: 'A method operates on a specific instance\'s own data via self; a utility function takes everything it needs as explicit arguments and does not belong to, or depend on, any particular class\'s internal structure', c: 'Utility functions cannot take any arguments', d: 'Methods are always faster than utility functions' },
      answer: 'b',
      explain: 'This connects back to Session 10\'s method-vs-function distinction: a method is bound to an instance\'s own data; a utility function is a plain, standalone function (Session 04) that takes its inputs explicitly, with no ties to any specific class.',
    },
    {
      q: 'Why should a utility module avoid importing or depending on a specific class like Country, if it can be avoided?',
      options: { a: 'It does not matter either way', b: 'Keeping a utility function\'s inputs generic (e.g. taking a plain string, not a Country instance) makes it usable in more contexts and easier to test in complete isolation, without needing to construct unrelated objects', c: 'Python forbids utility modules from importing other modules', d: 'This would cause a circular import in every case' },
      answer: 'b',
      explain: 'A function like <code>matches_search_term(name: str, term: str)</code> is more broadly reusable and simpler to test than one that requires a full Country instance just to check a string match — genericity is a design choice that increases reusability.',
    },
    {
      q: 'Why does a utility module deserve especially thorough test coverage, more so perhaps than a one-off helper used in only one place?',
      options: { a: 'It does not need any additional testing rigor', b: 'Because it will be relied upon from multiple different parts of the codebase, a bug in a utility function has a wider blast radius — breaking every caller simultaneously, not just one', c: 'Utility modules are exempt from testing by convention', d: 'Only classes need tests, never standalone utility functions' },
      answer: 'b',
      explain: 'This connects to Session 27\'s testing-priority discussion: code that many other parts of the application depend on deserves the most thorough test coverage, since a bug there affects everything that relies on it.',
    },
    {
      q: 'Where does this new search.py utility module fit into the package structure established in Session 32?',
      options: { a: 'It should replace models.py entirely', b: 'As a new, additional focused module inside country_explorer/, following the same by-responsibility organization already established', c: 'Utility modules cannot exist inside a package', d: 'It must be placed outside the country_explorer package entirely' },
      answer: 'b',
      explain: 'This is a natural extension of Session 32\'s package structure — a new, focused responsibility gets its own module inside the existing package, exactly like formatting.py did in Session 33.',
    },
  ],
  conceptTitle: 'Utility Modules',
  sections: [
    {
      h3: 'Logic that belongs to no single class',
      paragraphs: ['Some logic is genuinely cross-cutting — useful in more than one place, but not naturally "owned" by any one class\'s data. This is exactly what a utility module is for.'],
      code: `# country_explorer/search.py
def matches_search_term(name, term):
    """Check whether a search term appears in a name, case-insensitively.

    Args:
        name: the string to search within.
        term: the search term.
    Returns:
        True if term appears anywhere in name, ignoring case.
    """
    return term.lower() in name.lower()`,
    },
    {
      h3: 'Method vs standalone utility function',
      paragraphs: ['A method (Session 10) is bound to a specific instance\'s data via self. A utility function takes everything it needs as plain, explicit arguments, with no ties to any one class — this makes it broadly reusable.'],
      code: `# Method — bound to a specific Country instance
class Country:
    def name_matches(self, term):
        return term.lower() in self.name.lower()

# Utility function — takes explicit arguments, usable anywhere a string is available
def matches_search_term(name, term):
    return term.lower() in name.lower()

# The utility version works even without a Country instance at all:
print(matches_search_term("Kenya", "ken"))   # True — no Country object needed`,
      diagram: {
        caption: 'A method needs an instance (self) to run. A utility function only needs its explicit arguments — usable anywhere, by anything.',
        boxes: [
          { label: 'method', text: 'needs self\n(an instance)' },
          { label: 'utility function', text: 'needs only\nits arguments', accent: true },
        ],
      },
    },
    {
      h3: 'Using the utility from multiple places',
      paragraphs: ['Both CountryExplorer and CountryRepository can use the same search utility without either one owning it or duplicating the logic.'],
      code: `# models.py
from .search import matches_search_term

class CountryExplorer:
    def search(self, term):
        return [c for c in self.countries if matches_search_term(c.name, term)]

# repository.py
from .search import matches_search_term

class CountryRepository:
    def search(self, term):
        return [c for c in self.get_all() if matches_search_term(c.name, term)]`,
    },
    {
      h3: 'Thorough testing for widely-used utilities',
      paragraphs: ['Because this function will be relied upon from multiple places, it deserves especially thorough test coverage — a bug here has a wide blast radius.'],
      code: `# tests/test_search.py
from country_explorer.search import matches_search_term

def test_matches_exact():
    assert matches_search_term("Kenya", "Kenya") is True

def test_matches_partial():
    assert matches_search_term("Kenya", "ken") is True

def test_matches_case_insensitive():
    assert matches_search_term("KENYA", "kenya") is True

def test_no_match():
    assert matches_search_term("Kenya", "xyz") is False

def test_empty_term_matches_everything():
    assert matches_search_term("Kenya", "") is True  # an empty string is "in" every string`,
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Build a thoroughly tested search.py utility module, and use it from both CountryExplorer and CountryRepository.',
    whatYouBuild: 'A new module <code>country_explorer/search.py</code> plus <code>tests/test_search.py</code>.',
    steps: [
      { title: 'Create search.py with matches_search_term and a clear docstring', body: [], code: `# country_explorer/search.py
def matches_search_term(name, term):
    """Check whether a search term appears in a name, case-insensitively.

    Args:
        name: the string to search within.
        term: the search term.
    Returns:
        True if term appears anywhere in name, ignoring case.
    """
    return term.lower() in name.lower()` },
      { title: 'Add a search() method to CountryExplorer using the utility', body: [], code: `# country_explorer/models.py
from .search import matches_search_term

class CountryExplorer:
    # ... existing code ...
    def search(self, term):
        return [c for c in self.countries if matches_search_term(c.name, term)]` },
      { title: 'Add a search() method to CountryRepository using the same utility', body: [], code: `# country_explorer/repository.py
from .search import matches_search_term

class CountryRepository:
    # ... existing code ...
    def search(self, term):
        return [c for c in self.get_all() if matches_search_term(c.name, term)]` },
      { title: 'Write thorough tests for matches_search_term covering multiple cases', body: [], code: `# tests/test_search.py
from country_explorer.search import matches_search_term

def test_matches_exact():
    assert matches_search_term("Kenya", "Kenya") is True

def test_matches_partial():
    assert matches_search_term("Kenya", "ken") is True

def test_matches_case_insensitive():
    assert matches_search_term("KENYA", "kenya") is True

def test_no_match():
    assert matches_search_term("Kenya", "xyz") is False` },
      { title: 'Add tests confirming CountryExplorer.search() and CountryRepository.search() both use it correctly', body: [], code: `# tests/test_search_integration.py
from country_explorer import Country, CountryExplorer, CountryRepository

def test_explorer_search_uses_matches_search_term():
    explorer = CountryExplorer(countries=[Country(name="Kenya", region="Africa", population=1)])
    assert [c.name for c in explorer.search("ken")] == ["Kenya"]

def test_repository_search_uses_matches_search_term():
    repo = CountryRepository(raw_data=[{"name": "Kenya", "region": "Africa", "population": 1}])
    assert [c.name for c in repo.search("ken")] == ["Kenya"]` },
    ],
  },
  filesChanged: [
    { file: 'country_explorer/search.py', action: 'Created', why: 'A generic, class-independent search-matching utility.' },
    { file: 'country_explorer/models.py', action: 'Modified', why: 'CountryExplorer.search() uses the shared utility.' },
    { file: 'country_explorer/repository.py', action: 'Modified', why: 'CountryRepository.search() uses the same shared utility.' },
    { file: 'tests/test_search.py', action: 'Created', why: 'Thorough, direct tests for the utility function itself.' },
    { file: 'tests/test_search_integration.py', action: 'Created', why: 'Confirms both classes correctly use the shared utility.' },
    { file: 'docs/sessions/session-34/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add country_explorer/search.py country_explorer/models.py country_explorer/repository.py tests/test_search.py tests/test_search_integration.py docs/sessions/session-34/index.html\ngit commit -m "session-34: build a shared search utility used by both CountryExplorer and CountryRepository"',
  commitQuestion: 'Why does matches_search_term take plain strings as arguments instead of a Country instance?',
  checklist: [
    'matches_search_term takes plain string arguments, with no dependency on Country or any other class',
    'Both CountryExplorer.search() and CountryRepository.search() import and use the same utility function',
    'matches_search_term has direct, thorough tests covering exact match, partial match, case-insensitivity, and no-match',
    'Both classes\' search() methods have integration tests confirming they correctly use the shared logic',
    'No search-matching logic is duplicated between the two classes',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Why does making matches_search_term take plain strings (rather than a Country instance) make it more broadly reusable than it would otherwise be?',
    'If matches_search_term had a bug, how many parts of the application would be affected? How does that compare to a bug in a method used by only one class?',
    'Why do you think this session tested the utility function directly AND wrote separate integration tests for each class that uses it — rather than only testing one or the other?',
    'Can you think of another piece of logic in the project that might deserve its own class-independent utility module, following this same pattern?',
  ],
  whatBreaks: [
    { title: 'Duplicated search logic drifting apart', text: 'Without a shared utility, CountryExplorer and CountryRepository would each implement their own version of "does this term match this name" — and a future improvement (like trimming whitespace before comparing) could easily be applied to one and forgotten in the other.' },
    { title: 'The prop drilling problem (Session 35)', text: 'The next session examines what happens when data needs to be threaded through many layers just to reach where it is needed — a related but distinct architecture problem from the code-duplication issue this session solved.' },
    { title: 'Architecture review (Session 36)', text: 'This session\'s search.py is a concrete example of the "focused, well-tested, broadly reusable module" pattern that Session 36\'s architecture review will assess the whole project against.' },
  ],
  learnedConcept: 'Designing and thoroughly testing a standalone, class-independent utility module, and understanding when logic belongs to a class versus a shared utility.',
  learnedUnlocks: 'The application now has a genuinely shared, well-tested search capability used consistently across multiple parts of the codebase, with zero duplication.',
  nextTeaser: 'We deliberately design ourselves into an architecture problem — data that needs to be threaded through several layers just to reach where it is actually used.',
},

// ── SESSION 35 ─────────────────────────────────────────────────────
{
  num: 35,
  title: 'The Prop Drilling Problem',
  nextTitle: 'Architecture Review',
  subtitle: 'We add a small "favorites" feature and deliberately experience the pain of threading a value through several layers of objects just to reach where it is actually needed.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Add a feature that requires passing a value down through multiple layers of composed objects',
    'Experience firsthand how threading a value through unrelated intermediate layers adds friction',
    'Explain why every intermediate layer having to know about a value it doesn\'t use is a code smell',
    'Recognise this problem without necessarily solving it fully — awareness is this session\'s explicit goal',
    'Connect this pattern to the same-named problem in the original React course this Python course is modeled on',
  ],
  quiz: [
    {
      q: 'You want a "favorites" feature: CountryExplorer needs to track which countries a user has favorited. A new outer class, App, needs to trigger toggling a favorite, but the actual state lives on CountryExplorer, two layers down. What is the direct, "just make it work" approach?',
      options: { a: 'Store favorites state directly on Country instances only', b: 'Pass a reference to CountryExplorer down through every intermediate layer so App can eventually call explorer.toggle_favorite(country), even through layers that have nothing to do with favorites', c: 'This scenario cannot occur in a composed object structure', d: 'Skip the feature entirely' },
      answer: 'b',
      explain: 'This is the direct but painful approach: threading a reference (or a value) through layers that do not themselves use it, purely so it can reach a deeper layer that does — exactly the friction this session is designed to have you feel firsthand.',
    },
    {
      q: 'If a new intermediate class, MenuSection, is added between App and CountryExplorer, and it must accept and forward an explorer reference purely so App can eventually reach it, what problem does this illustrate?',
      options: { a: 'There is no problem here; this is normal and has no downside', b: 'MenuSection now depends on and must forward something it has no actual use for itself — every layer in between two collaborating objects becomes coupled to a value that conceptually has nothing to do with it', c: 'MenuSection cannot be created if this occurs', d: 'This only happens with the specific example of "favorites"' },
      answer: 'b',
      explain: 'This is the essence of the "prop drilling" problem: an unrelated intermediate layer is forced to know about and forward something purely for the benefit of a much deeper layer — adding coupling and noise to a class that otherwise has nothing to do with favorites.',
    },
    {
      q: 'Why is a growing chain of "pass this reference down another level, just in case something deeper needs it" considered a code smell, even if it technically works?',
      options: { a: 'It is not a real problem — this is the correct and only way to structure any Python program', b: 'As more layers are added, every intermediate layer accumulates parameters and forwarding logic unrelated to its own actual responsibility, making the codebase harder to understand and change — the connection between where a value originates and where it is used becomes obscured', c: 'It always causes a runtime error in Python', d: 'This pattern is specific to only the "favorites" feature and cannot generalize' },
      answer: 'b',
      explain: 'This directly threatens the "focused, single-responsibility classes" principle from Sessions 12, 24, and 32 — intermediate classes end up cluttered with forwarding logic for values they conceptually have nothing to do with, purely as plumbing.',
    },
    {
      q: 'Why does this session deliberately NOT fully solve the prop drilling problem, only make you experience and name it?',
      options: { a: 'Because the problem has no solution in Python at all', b: 'Because — following the same "concept before implementation" pattern used throughout this curriculum — genuinely understanding the pain and its cause is the prerequisite for correctly evaluating any solution (e.g. a shared/global-ish state object) in a future project, rather than reaching for a fix without understanding what problem it solves', c: 'Because this is not actually a real problem worth understanding', d: 'Because it was already fully solved in Session 34' },
      answer: 'b',
      explain: 'This mirrors the source React course\'s Session 35 exactly — deliberately experiencing the pain of a real architecture problem, by name, is what makes any future solution (whether a shared context object, dependency injection, or something else) make genuine sense later, instead of being memorized syntax for a problem never truly felt.',
    },
    {
      q: 'How does this Python session\'s "prop drilling" problem relate to the concept of the same name in the original React course this curriculum is modeled on?',
      options: { a: 'It is completely unrelated; the term is coincidentally reused', b: 'It is the exact same underlying architecture problem — data or a reference having to be threaded through layers that do not themselves use it — just expressed here through composed Python classes instead of nested React components', c: 'Python cannot have this problem because it does not use JSX', d: 'This problem only exists in JavaScript, never in Python' },
      answer: 'b',
      explain: 'This is a deliberate, direct parallel: the original React course\'s Session 35 covers "prop drilling" through nested components; this session recreates the identical underlying architecture problem using composed Python classes, since the root cause (a value needed deep in a structure, threaded through uninvolved intermediate layers) is language-independent.',
    },
  ],
  conceptTitle: 'Experiencing the Prop Drilling Problem',
  sections: [
    {
      h3: 'Adding a feature that needs a deep reference',
      paragraphs: ['We want to toggle a country as a "favorite." The natural place for that state is on CountryExplorer (Session 12), but the trigger — a user action — originates from an outer App class, two composition layers up.'],
      code: `class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries
        self.favorites = set()

    def toggle_favorite(self, country_name):
        if country_name in self.favorites:
            self.favorites.discard(country_name)
        else:
            self.favorites.add(country_name)


class MenuSection:
    def __init__(self, explorer):
        self.explorer = explorer   # MenuSection doesn't otherwise care about explorer at all


class App:
    def __init__(self, menu_section):
        self.menu_section = menu_section

    def handle_favorite_click(self, country_name):
        # App must reach two layers DOWN just to trigger this one action
        self.menu_section.explorer.toggle_favorite(country_name)`,
      diagram: {
        caption: 'The explorer reference must be threaded through MenuSection, which has no actual use for it itself, purely so App can reach two layers deeper.',
        boxes: [
          { label: 'App', text: 'needs explorer' },
          { label: 'MenuSection', text: 'forwards it,\nunused itself', accent: true },
          { label: 'CountryExplorer', text: 'actually uses it' },
        ],
      },
    },
    {
      h3: 'The pain gets worse as more layers are added',
      paragraphs: ['Add one more layer, and the forwarding chain grows — every intermediate class picks up a parameter and a line of code purely for something it does not itself use.'],
      code: `class NavigationPanel:
    def __init__(self, menu_section):
        self.menu_section = menu_section  # also forwarding, also unrelated to its own job


class App:
    def __init__(self, navigation_panel):
        self.navigation_panel = navigation_panel

    def handle_favorite_click(self, country_name):
        # now THREE layers deep, through TWO classes that have nothing to do with favorites
        self.navigation_panel.menu_section.explorer.toggle_favorite(country_name)`,
    },
    {
      h3: 'Naming the problem',
      paragraphs: ['This is "prop drilling" — a value or reference has to be threaded through several layers of a composed structure purely so it can reach a much deeper layer that actually needs it, coupling every intermediate layer to something conceptually unrelated to its own job. This exact problem, and exact name, appears in the original React course this curriculum is modeled on, because the underlying issue is not specific to any one language or framework.'],
    },
    {
      h3: 'This session deliberately does not fully solve it',
      paragraphs: ['Recognising the problem clearly — feeling the friction of App.navigation_panel.menu_section.explorer.toggle_favorite(...) firsthand — is the point. A future project might solve this with a shared state object, dependency injection, or another pattern, but reaching for a fix before understanding the actual problem tends to produce cargo-culted, poorly-understood code.'],
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Build the layered App / MenuSection / CountryExplorer structure, deliberately experience the deep-reference threading problem, and document it clearly.',
    whatYouBuild: 'A file called <code>prop_drilling_lab.py</code>.',
    steps: [
      { title: 'Create the file with CountryExplorer including a favorites feature', body: [], code: `# prop_drilling_lab.py
class Country:
    def __init__(self, name, region, population):
        self.name = name
        self.region = region
        self.population = population


class CountryExplorer:
    def __init__(self, countries):
        self.countries = countries
        self.favorites = set()

    def toggle_favorite(self, country_name):
        if country_name in self.favorites:
            self.favorites.discard(country_name)
        else:
            self.favorites.add(country_name)` },
      { title: 'Add MenuSection and NavigationPanel, each forwarding a reference they do not otherwise use', body: [], code: `class MenuSection:
    def __init__(self, explorer):
        self.explorer = explorer  # only exists to forward this reference downstream


class NavigationPanel:
    def __init__(self, menu_section):
        self.menu_section = menu_section  # same problem, one layer higher` },
      { title: 'Add App and trigger a favorite toggle through the whole chain', body: [], code: `class App:
    def __init__(self, navigation_panel):
        self.navigation_panel = navigation_panel

    def handle_favorite_click(self, country_name):
        self.navigation_panel.menu_section.explorer.toggle_favorite(country_name)


explorer = CountryExplorer(countries=[Country(name="Kenya", region="Africa", population=54000000)])
menu = MenuSection(explorer)
nav = NavigationPanel(menu)
app = App(nav)

app.handle_favorite_click("Kenya")
print(explorer.favorites)  # {'Kenya'} — it worked, but look at the path it took to get there` },
      { title: 'Count and print how many layers had to know about explorer just to forward it', body: [], code: `print("Layers forced to hold an explorer-related reference:", 3)
# App -> NavigationPanel -> MenuSection -> CountryExplorer` },
      { title: 'Write a clear written explanation of the problem, in your own words', body: ['This is the most important step. Describe what MenuSection and NavigationPanel have to do with "favorites" conceptually (nothing), and why that is a problem as the project grows.'] },
    ],
  },
  filesChanged: [
    { file: 'prop_drilling_lab.py', action: 'Created', why: 'Deliberately recreates and documents the prop-drilling problem using composed classes.' },
    { file: 'docs/sessions/session-35/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add prop_drilling_lab.py docs/sessions/session-35/index.html\ngit commit -m "session-35: deliberately experience and document the prop drilling problem"',
  commitQuestion: 'What do MenuSection and NavigationPanel actually have to do with the favorites feature, conceptually?',
  checklist: [
    'CountryExplorer has a working toggle_favorite() method using a set',
    'MenuSection and NavigationPanel each hold and forward a reference they do not otherwise use themselves',
    'App.handle_favorite_click() successfully reaches CountryExplorer through the full chain',
    'The number of unrelated layers forced to forward the reference is explicitly counted and printed',
    'A written explanation, in your own words, clearly names and describes the problem',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'If a FOURTH layer were added between App and NavigationPanel, what would have to change, and in how many places?',
    'Why does this problem specifically hurt the "single responsibility" principle established since Session 12, even though the code technically works correctly?',
    'Can you think of a real Python project structure (not necessarily this one) where you might have already experienced something like this?',
    'Without fully implementing a fix, sketch in words what a "shared reference every layer can reach directly" solution might look like, and what new problem THAT might introduce.',
  ],
  whatBreaks: [
    { title: 'Coupling that resists change', text: 'Every intermediate layer forced to forward an unrelated reference becomes harder to change independently — modifying MenuSection\'s constructor signature now risks breaking the entire favorites feature, even though MenuSection has nothing conceptually to do with favorites.' },
    { title: 'Architecture review (Session 36)', text: 'This deliberately-felt problem becomes one of the concrete case studies documented in the next session\'s full architecture review — a real, working example of a design tension worth recording and reasoning about.' },
    { title: 'Recognizing this pattern in real projects', text: 'Having genuinely experienced this friction firsthand means you will recognize it immediately in a future real project, rather than accumulating unrelated forwarded parameters without noticing the underlying pattern.' },
  ],
  learnedConcept: 'The prop drilling problem — threading a value or reference through composition layers that do not themselves use it, and why that couples unrelated classes together.',
  learnedUnlocks: 'You can now recognize this specific architecture smell by name and explain exactly why it is a problem, setting up an informed architecture review next session.',
  nextTeaser: 'Layer 6 gate. We conduct a full architecture review of everything built so far, documenting every major structural decision and its tradeoffs.',
},

// ── SESSION 36 ─────────────────────────────────────────────────────
{
  num: 36,
  title: 'Architecture Review',
  nextTitle: 'File I/O Deep Dive',
  subtitle: 'This is the Layer 6 gate. We step back and review every major structural decision made across the whole project, documenting the reasoning the way a real engineering team would.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Write an Architecture Decision Record (ADR) documenting a real decision made earlier in the project',
    'Review the current package structure end to end and assess whether it still makes sense',
    'Identify one thing you would do differently if starting the project over, and explain why',
    'Confirm the full test suite still passes as a final Layer 6 checkpoint',
    'Explicitly connect the prop drilling problem from Session 35 to a documented architectural tradeoff',
  ],
  quiz: [
    {
      q: 'What are the essential components of a good Architecture Decision Record (ADR), based on this session\'s format?',
      options: { a: 'Only the final decision, with no explanation', b: 'The decision itself, the context/session it was made in, the reasoning behind it, alternatives that were considered, and the consequences going forward', c: 'A complete line-by-line diff of every file changed', d: 'A screenshot of the code' },
      answer: 'b',
      explain: 'A useful ADR captures not just WHAT was decided, but WHY — including what else was considered and rejected, and what the decision commits the project to going forward. This is what makes it useful to someone (including future-you) revisiting the decision later.',
    },
    {
      q: 'Why is it valuable to document that Session 24\'s repository pattern was chosen SPECIFICALLY to support later testing (Session 31) and later real-API integration (Session 38), rather than just noting "we added a repository class"?',
      options: { a: 'It is not valuable; the code speaks for itself', b: 'Recording the REASONING behind a decision preserves context that the code alone cannot show — a future reader (or future you) can understand not just what exists, but why it was built that way, and whether that reasoning still holds', c: 'This information is automatically embedded in Python bytecode', d: 'ADRs are only useful for decisions made by teams larger than one person' },
      answer: 'b',
      explain: 'This is precisely why Session 24\'s WHY mattered as much as the WHAT throughout this curriculum — code shows current state, but not the reasoning that led to it. An ADR preserves that reasoning explicitly, for anyone (including future you) trying to understand or reconsider the decision later.',
    },
    {
      q: 'Reviewing the prop drilling problem from Session 35, what should an honest architecture review document about it?',
      options: { a: 'Nothing — it was fully solved and no longer matters', b: 'That it is a real, currently-unresolved tradeoff of the current composition structure, worth noting explicitly as a known limitation rather than pretending the project has no rough edges', c: 'That composed objects should never be used again anywhere', d: 'That the problem does not actually exist in Python' },
      answer: 'b',
      explain: 'A genuine architecture review does not pretend a project is flawless — documenting a KNOWN, understood limitation (like Session 35\'s deliberately-felt prop drilling problem) honestly is more valuable than silence, since it gives a clear, named starting point for future work.',
    },
    {
      q: 'Why does this session explicitly re-run the full test suite as one of its checkpoints, given that Session 32 already ran it after the package reorganization?',
      options: { a: 'It is redundant and unnecessary busywork', b: 'Confirming the suite still passes at this final Layer 6 checkpoint verifies that everything since the reorganization (Sessions 33-35) also preserved correct behavior, not just the reorganization itself', c: 'pytest results expire after one session and must be re-verified', d: 'This is only for show; the actual result does not matter' },
      answer: 'b',
      explain: 'This is Layer 5\'s safety net doing its job continuously, not just once — confirming the suite still passes after EVERY structural session (Sessions 33, 34, 35, and now 36) gives ongoing confidence that Layer 6\'s reorganization work has been behavior-preserving throughout, not just at one checkpoint.',
    },
    {
      q: 'What is the value of explicitly asking "what would I do differently if starting over" as part of this review, rather than only documenting decisions as unquestionably correct?',
      options: { a: 'There is no value; decisions made should never be questioned', b: 'Honest retrospection identifies real limitations and learning, which is valuable input for future projects (or a future iteration of this one) — treating every past decision as beyond question would prevent genuine improvement', c: 'This step is purely ceremonial and has no practical use', d: 'It is only useful for very large teams, never for solo work' },
      answer: 'b',
      explain: 'This is genuine engineering reflection: acknowledging that a decision — even a reasonable one at the time — might not be the best choice in hindsight is how real understanding (and real improvement in future projects) develops, rather than treating early choices as permanently beyond question.',
    },
  ],
  conceptTitle: 'Conducting an Architecture Review',
  sections: [
    {
      h3: 'The ADR format',
      paragraphs: ['An Architecture Decision Record captures a real decision, its context, its reasoning, the alternatives considered, and its ongoing consequences — turning tacit reasoning into a durable, readable record.'],
      code: `# ADR-001 — Repository Pattern for Data Access
#
# Decision: Wrap all data access behind a CountryRepository class with a
# stable get_all()/find_by_region() interface.
#
# Session: 24 (Building a Data Access Layer)
#
# Why: Application logic should not need to know or care whether data comes
# from an in-memory mock list, a JSON file, or eventually a real API. This
# separation lets each of those be swapped in independently, and lets tests
# (Session 31) inject small, controlled fake datasets without touching real
# files or the network.
#
# Alternatives considered: Letting every part of the app import mock data
# directly. Rejected — this would tightly couple application logic to one
# specific data source, and make testing much harder.
#
# Consequence: Any future data source (Session 38's real API) must be
# adapted to return data in the same raw shape the repository expects.`,
    },
    {
      h3: 'Reviewing the current package structure',
      paragraphs: ['Session 32 split the project into country_explorer/models.py, repository.py, validators.py, formatting.py, and search.py. A genuine review asks: does this grouping still make sense, now that the project has grown further?'],
      code: `# country_explorer/
#   __init__.py     — re-exports the package's public interface
#   models.py        — Country, CountryExplorer (data + core behavior)
#   repository.py    — CountryRepository (data access)
#   validators.py     — validate_country_record (data contract enforcement)
#   formatting.py     — format_population (shared display logic)
#   search.py          — matches_search_term (shared search logic)
#
# Does this still make sense? formatting.py and search.py are both small,
# single-function modules — reasonable for now, but worth reconsidering if
# either grows substantially.`,
    },
    {
      h3: 'Documenting a known, unresolved limitation',
      paragraphs: ['A genuine review does not pretend the project is flawless — Session 35\'s prop drilling problem is a real, currently open architectural tradeoff worth recording explicitly.'],
      code: `# ADR-002 — Prop Drilling in the Composed UI-Layer Classes (UNRESOLVED)
#
# Decision: (none yet — documenting a known problem, not a fix)
#
# Session: 35 (The Prop Drilling Problem)
#
# Why this is a problem: App -> NavigationPanel -> MenuSection ->
# CountryExplorer requires every intermediate layer to forward a reference
# it does not otherwise use, coupling unrelated classes together.
#
# Status: Deliberately left unresolved in this curriculum. A future
# iteration might explore a shared context/state object or dependency
# injection to address this, but understanding the problem clearly (as
# Session 35 did) is prioritized over reaching for a fix prematurely.`,
    },
    {
      h3: 'The final Layer 6 checkpoint: does everything still work?',
      paragraphs: ['Before considering Layer 6 complete, confirm the full test suite still passes — proving all the structural work across Sessions 32-36 was behavior-preserving throughout, not just at one point in time.'],
    },
  ],
  callout: {
    title: 'Layer 6 gate:',
    text: 'This is the last Layer 6 session. Every remaining session assumes you can document and reason about architecture decisions the way a real engineering team does — including honestly naming unresolved tradeoffs.',
  },
  closing: null,
  lab: {
    objective: 'Write a real architecture review document covering at least two decisions (one resolved, one open), and confirm the full test suite still passes.',
    whatYouBuild: 'A file called <code>ARCHITECTURE.md</code> at the project root.',
    steps: [
      { title: 'Create ARCHITECTURE.md with the repository pattern ADR', body: [], code: `# Architecture Decisions

## ADR-001 — Repository Pattern for Data Access

**Decision:** Wrap all data access behind a CountryRepository class with a
stable get_all()/find_by_region()/search() interface.

**Session:** 24 (Building a Data Access Layer)

**Why:** Application logic should not need to know or care whether data
comes from an in-memory mock list, a JSON file, or eventually a real API.

**Alternatives considered:** Letting every part of the app import mock
data directly. Rejected — this would tightly couple application logic to
one specific data source.

**Consequence:** Any future data source must be adapted to return data in
the same raw shape the repository expects.` },
      { title: 'Add an ADR for the package reorganization from Session 32', body: [], code: `## ADR-002 — Package Structure (models / repository / validators / formatting / search)

**Decision:** Split the growing country.py into a country_explorer package
with focused submodules by responsibility.

**Session:** 32 (Package and Folder Organization)

**Why:** A single growing file mixed unrelated responsibilities. Splitting
by responsibility (data modeling, data access, validation, formatting,
search) keeps each module focused and easier to navigate.

**Alternatives considered:** Splitting by "layer" of the curriculum
instead of by responsibility. Rejected — responsibility-based grouping
stays meaningful even as the curriculum's own structure changes.

**Consequence:** Every new piece of cross-cutting logic must be evaluated
for which existing module (or a new one) it belongs in.` },
      { title: 'Add an ADR documenting the unresolved prop drilling problem', body: [], code: `## ADR-003 — Prop Drilling in Composed UI-Layer Classes (UNRESOLVED)

**Decision:** None yet — this documents a known problem, not a fix.

**Session:** 35 (The Prop Drilling Problem)

**Why this is a problem:** A layered App -> NavigationPanel -> MenuSection
-> CountryExplorer structure requires every intermediate layer to forward
a reference it does not otherwise use.

**Status:** Deliberately left unresolved. Future work might explore a
shared context object or dependency injection, but understanding the
problem clearly is prioritized over a premature fix.` },
      { title: 'Review the current package structure and write a short assessment', body: ['Answer explicitly: does the current models/repository/validators/formatting/search split still make sense? What, if anything, would you change?'], code: `## Package Structure Review

country_explorer/models.py, repository.py, validators.py, formatting.py,
and search.py currently reflect distinct responsibilities established in
Sessions 24, 26, 33, and 34. formatting.py and search.py are each small
single-function modules — reasonable for the project's current size, but
worth reconsidering if either grows to contain several unrelated helpers.` },
      { title: 'Run the full test suite as the final Layer 6 checkpoint', body: ['Confirm every test from Sessions 27-34 still passes, proving all of Layer 6\'s structural changes were behavior-preserving.'], code: '# pytest -v' },
    ],
  },
  filesChanged: [
    { file: 'ARCHITECTURE.md', action: 'Created', why: 'A real architecture decision record documenting resolved and unresolved decisions.' },
    { file: 'docs/sessions/session-36/index.html', action: 'Created', why: 'This session document — Layer 6 gate.' },
  ],
  commitCmd: 'git add ARCHITECTURE.md docs/sessions/session-36/index.html\ngit commit -m "session-36: conduct a full architecture review and document key decisions"',
  commitQuestion: 'Why did ADR-003 document a problem without proposing a fix, unlike ADR-001 and ADR-002?',
  checklist: [
    'ARCHITECTURE.md contains at least one fully resolved decision (ADR-001 or ADR-002) with reasoning and alternatives',
    'ARCHITECTURE.md contains the deliberately unresolved prop drilling ADR, documented honestly',
    'The current package structure is explicitly assessed for whether it still makes sense',
    'The full test suite is run and confirmed passing as the final Layer 6 checkpoint',
    'Every ADR references the specific session where the decision was actually made',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'If you were handing this project to a new developer, which single ADR would be most valuable for them to read first, and why?',
    'What is one decision made earlier in this curriculum (Sessions 1-35) that you now, in hindsight, might have made differently? Why?',
    'Why does documenting a KNOWN limitation (ADR-003) honestly build more trust in a project\'s documentation than only ever documenting successes?',
    'How does the discipline of writing an ADR relate to the "What We Learned" section that has closed every single session in this curriculum?',
  ],
  whatBreaks: [
    { title: 'Lost institutional knowledge', text: 'Without documented reasoning, future decisions about whether to change the repository pattern, the package structure, or address prop drilling would have to be re-derived from scratch, or worse, made without understanding the original tradeoffs at all.' },
    { title: 'Real-world file and network work (Layer 7)', text: 'The next layer adds real files and a real API — genuinely new external dependencies. Reviewing the architecture now, before adding more complexity, ensures the foundation is well-understood before building further on top of it.' },
    { title: 'The capstone review (Session 40)', text: 'This session\'s ARCHITECTURE.md becomes a key artifact referenced in the final capstone review, which walks through the entire project end to end.' },
  ],
  learnedConcept: 'Writing Architecture Decision Records that document not just what was built, but why — including honestly documenting known, unresolved limitations.',
  learnedUnlocks: 'The project now has a durable record of its own reasoning, and Layer 6\'s structural work is confirmed complete and behavior-preserving via a full passing test suite.',
  nextTeaser: 'Layer 7 begins. We finally touch the real world — real files and, soon, a real network API — building on a now well-understood, well-tested foundation.',
},

// ── SESSION 37 ─────────────────────────────────────────────────────
{
  num: 37,
  title: 'File I/O Deep Dive',
  nextTitle: 'Calling a Real API with requests',
  subtitle: 'Layer 7 begins. We go deeper on file handling than Session 25\'s introduction — proper resource management, different file modes, and safely reading large files.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Explain why the with statement is the correct way to open a file, versus manual open()/close()',
    'Use different file modes: read, write, append',
    'Read a file line by line instead of loading it all into memory at once',
    'Handle a file encoding issue gracefully',
    'Refactor CountryRepository to build itself from a real file path, cleanly, using everything from this session',
  ],
  quiz: [
    {
      q: 'Why is <code>with open(path) as f: ...</code> preferred over manually calling <code>f = open(path)</code> and <code>f.close()</code> afterward?',
      options: { a: 'There is no real difference between the two approaches', b: 'The with statement guarantees the file is closed automatically when the block ends, even if an exception occurs inside it — manual close() calls are easy to skip accidentally, especially when an error happens first', c: 'with is required syntax; manual open/close is not valid Python', d: 'with only works for reading files, never writing' },
      answer: 'b',
      explain: 'This is a specific application of Session 07\'s error-handling philosophy: <code>with</code> guarantees cleanup (closing the file) happens even if an exception is raised partway through — a manual <code>f.close()</code> placed after risky code would be skipped entirely if an exception occurred first.',
    },
    {
      q: 'What is the difference between opening a file with mode "w" versus mode "a"?',
      options: { a: 'They are identical', b: '"w" (write) overwrites the file\'s entire existing content; "a" (append) adds new content to the end, preserving what was already there', c: '"w" is for reading only; "a" is for writing only', d: '"a" always creates a brand new file, deleting any old one' },
      answer: 'b',
      explain: '"w" truncates and overwrites — dangerous if you meant to keep existing content. "a" appends to the end of existing content without touching what came before, useful for something like an ongoing log file.',
    },
    {
      q: 'Why would you read a very large file line by line (with `for line in f:`) instead of `f.read()` all at once?',
      options: { a: 'There is no difference in memory usage between the two approaches', b: 'Reading line by line only holds one line in memory at a time, while f.read() loads the ENTIRE file into memory at once — for a very large file, this could exhaust available memory', c: 'f.read() is always faster regardless of file size', d: 'Line-by-line reading is required for all files, always' },
      answer: 'b',
      explain: 'For files far larger than available memory, loading the whole thing with <code>f.read()</code> could crash the program or the machine. Iterating line by line processes the file incrementally, using a small, constant amount of memory regardless of the file\'s total size.',
    },
    {
      q: 'A file contains text that is not valid UTF-8 (the default assumed encoding). What happens when you try to open() and read it without specifying an encoding, and how would you handle this per Session 07?',
      options: { a: 'Python automatically detects and handles any encoding correctly', b: 'A UnicodeDecodeError is raised; wrapping the read in a try/except UnicodeDecodeError (or specifying the correct encoding explicitly) handles this gracefully', c: 'The file silently reads as an empty string', d: 'This can never happen in Python 3' },
      answer: 'b',
      explain: 'Text files can be encoded in different ways (UTF-8, Latin-1, etc.). Reading with the wrong assumed encoding raises <code>UnicodeDecodeError</code> — another case for Session 07\'s try/except, or for specifying the correct encoding explicitly if it is known.',
    },
    {
      q: 'How does refactoring CountryRepository to accept a file_path and build itself from it (using with, proper modes, and encoding awareness) relate to Session 24\'s original design?',
      options: { a: 'It requires rewriting get_all() and find_by_region() entirely from scratch', b: 'It only requires changing HOW raw_data is obtained before being passed to the constructor — the repository\'s own methods remain completely unchanged, exactly as Session 24 promised', c: 'CountryExplorer must also be rewritten', d: 'This refactor is not actually possible given the current design' },
      answer: 'b',
      explain: 'This is Session 24\'s payoff, delivered a third time (after the mock data and the simple JSON file in Session 25): only the data SOURCE changes; get_all() and find_by_region() need zero modification, because they were never coupled to how raw_data was originally obtained.',
    },
  ],
  conceptTitle: 'Robust File Handling',
  sections: [
    {
      h3: 'with — guaranteed cleanup, even on error',
      paragraphs: ['The with statement (a "context manager") guarantees a file is properly closed when the block ends, whether it ends normally or because of an exception — directly connecting to Session 07\'s finally block concept, but automated and less error-prone.'],
      code: `# Risky — if something raises an exception between open() and close(), the file leaks open
f = open("countries.json")
data = f.read()
f.close()  # this line is skipped entirely if the read() line raised an exception!

# Safe — the file is guaranteed to close, no matter what happens inside the block
with open("countries.json") as f:
    data = f.read()
# f is already closed here, even if an exception occurred inside the block`,
    },
    {
      h3: 'File modes',
      paragraphs: ['The second argument to open() controls how the file is accessed: "r" (read, default), "w" (write, overwrites), "a" (append, preserves existing content).'],
      code: `# Read (default) — file must already exist
with open("countries.json", "r") as f:
    content = f.read()

# Write — creates the file if missing, OVERWRITES if it exists
with open("log.txt", "w") as f:
    f.write("First line\\n")

# Append — creates the file if missing, adds to the END if it exists
with open("log.txt", "a") as f:
    f.write("Another line, added without erasing what was there\\n")`,
      diagram: {
        caption: '"w" replaces everything; "a" preserves existing content and adds to the end.',
        boxes: [
          { label: 'mode "w"', text: 'old content\nreplaced' },
          { label: 'mode "a"', text: 'old content kept,\nnew appended', accent: true },
        ],
      },
    },
    {
      h3: 'Reading large files incrementally',
      paragraphs: ['Iterating a file object directly reads it one line at a time, using a small, constant amount of memory — essential for files too large to comfortably fit in memory all at once.'],
      code: `# Loads the ENTIRE file into memory at once — risky for very large files
with open("huge_log.txt") as f:
    content = f.read()

# Processes one line at a time — memory usage stays small regardless of file size
with open("huge_log.txt") as f:
    for line in f:
        if "ERROR" in line:
            print(line.strip())`,
    },
    {
      h3: 'Handling encoding issues',
      paragraphs: ['Text files can be encoded differently. Specifying the encoding explicitly, or handling a decode error gracefully, prevents a crash on unexpected file content.'],
      code: `try:
    with open("countries.json", encoding="utf-8") as f:
        content = f.read()
except UnicodeDecodeError as e:
    print(f"File is not valid UTF-8: {e}")
    content = None`,
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Rebuild CountryRepository to read from a real file path using with, correct modes, and encoding-aware error handling, with zero changes to its existing methods.',
    whatYouBuild: 'A file called <code>file_io_lab.py</code>, extending the country_explorer package.',
    steps: [
      { title: 'Create the file and write a robust load_json_file function', body: [], code: `# file_io_lab.py
import json

def load_json_file(path):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"{path} does not exist — using an empty dataset")
        return []
    except json.JSONDecodeError as e:
        print(f"{path} contains invalid JSON: {e}")
        return []
    except UnicodeDecodeError as e:
        print(f"{path} is not valid UTF-8: {e}")
        return []` },
      { title: 'Add an append-mode logging function using mode "a"', body: [], code: `def log_load_attempt(path, success):
    with open("load_log.txt", "a") as f:
        status = "SUCCESS" if success else "FAILED"
        f.write(f"{status}: {path}\\n")` },
      { title: 'Combine both into a robust repository-building function', body: [], code: `from country_explorer import CountryRepository

def build_repository_from_file(path):
    data = load_json_file(path)
    log_load_attempt(path, success=bool(data))
    return CountryRepository(raw_data=data)

repo = build_repository_from_file("countries.json")
print(len(repo.get_all()))` },
      { title: 'Test the failure paths explicitly', body: ['Try a missing file and confirm both the graceful fallback and the log entry.'], code: `missing_repo = build_repository_from_file("does_not_exist.json")
print(len(missing_repo.get_all()))  # 0 — graceful, no crash` },
      { title: 'Read load_log.txt line by line and print only FAILED entries', body: ['Practice the line-by-line iteration pattern on the log file you just created.'], code: `with open("load_log.txt") as f:
    for line in f:
        if line.startswith("FAILED"):
            print(line.strip())` },
    ],
  },
  filesChanged: [
    { file: 'file_io_lab.py', action: 'Created', why: 'Robust file loading with with, modes, encoding handling, and repository construction.' },
    { file: 'load_log.txt', action: 'Generated', why: 'An append-only log of file load attempts.' },
    { file: 'docs/sessions/session-37/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add file_io_lab.py load_log.txt docs/sessions/session-37/index.html\ngit commit -m "session-37: robust file I/O with proper resource management and encoding handling"',
  commitQuestion: 'Why does with open(...) as f: guarantee the file closes even if json.load(f) raises an exception inside the block?',
  checklist: [
    'load_json_file uses with, not manual open()/close()',
    'FileNotFoundError, json.JSONDecodeError, and UnicodeDecodeError are each caught separately with clear messages',
    'log_load_attempt uses append mode ("a") and does not overwrite previous log entries',
    'build_repository_from_file successfully constructs a working CountryRepository with zero changes to CountryRepository itself',
    'load_log.txt is read back line by line, filtering for FAILED entries only',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Why would using mode "w" instead of "a" for log_load_attempt be a serious bug? What would happen to the log over multiple runs?',
    'What would happen if build_repository_from_file used f.read() to load a truly enormous countries.json instead of relying on json.load\'s own internal handling? Is this a realistic concern for this specific project?',
    'How does this session\'s with statement connect back to Session 07\'s finally block — are they solving a similar problem in a different way?',
    'Why did CountryRepository itself need zero changes for this session\'s new, more robust file-loading logic to work?',
  ],
  whatBreaks: [
    { title: 'Leaked file handles', text: 'Without with, an exception between opening and closing a file leaves it open indefinitely — in a long-running program handling many files, this can exhaust the operating system\'s limit on open file handles, causing mysterious failures far from the actual bug.' },
    { title: 'Overwritten logs', text: 'Using mode "w" instead of "a" for an ongoing log file would silently erase all previous history every time the program restarts — a data-loss bug that is easy to make and often goes unnoticed until the history is actually needed.' },
    { title: 'Real API responses (Session 38)', text: 'The next session introduces genuinely unpredictable external data over the network — the same resource-management and error-handling discipline from this session (with, specific exception handling) applies directly to handling an HTTP connection safely.' },
  ],
  learnedConcept: 'Robust file I/O — the with statement for guaranteed cleanup, file modes, line-by-line reading for large files, and encoding-aware error handling.',
  learnedUnlocks: 'The project can now safely and robustly read from real files on disk, handling every realistic failure mode gracefully — the foundation for the real API work in the next session.',
  nextTeaser: 'We connect to a real, live network API for the first time — the REST Countries API — replacing our JSON file with genuinely external, unpredictable data.',
},

// ── SESSION 38 ─────────────────────────────────────────────────────
{
  num: 38,
  title: 'Calling a Real API with requests',
  nextTitle: 'Handling Errors and Edge Cases Gracefully',
  subtitle: 'We finally connect to a live, real network API — the REST Countries API — using the requests library, replacing our local file with genuinely external, unpredictable data.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Install and use the requests library to make an HTTP GET request',
    'Read a JSON response body and convert it to Python data structures',
    'Check an HTTP status code before trusting a response',
    'Map a real API\'s response shape onto our existing Country data contract',
    'Swap CountryRepository\'s data source to a real API with minimal changes, proving Session 24\'s design once more',
  ],
  quiz: [
    {
      q: 'What does <code>requests.get("https://restcountries.com/v3.1/all")</code> return?',
      options: { a: 'The raw JSON text as a plain string', b: 'A Response object, which has a .status_code and a .json() method to parse the body', c: 'A Python list directly', d: 'Nothing — you must manually open a socket first' },
      answer: 'b',
      explain: '<code>requests.get()</code> returns a <code>Response</code> object wrapping the HTTP response — you check <code>.status_code</code> to see if it succeeded, and call <code>.json()</code> to parse the body as JSON into Python data structures, similar to Session 25\'s json.load().',
    },
    {
      q: 'What does an HTTP status code of 200 mean, versus 404?',
      options: { a: 'They mean the same thing', b: '200 means the request succeeded; 404 means the requested resource was not found — checking this before trusting the response body is essential', c: '200 means an error occurred; 404 means success', d: 'Status codes are optional and rarely checked in practice' },
      answer: 'b',
      explain: 'HTTP status codes communicate the outcome of a request. 200 (and the broader 2xx range) means success. 404 means "not found." Checking the status code before calling .json() prevents trying to parse an error page as if it were valid data.',
    },
    {
      q: 'A real API might return country data with different key names than our own contract (e.g. "name": {"common": "Kenya"} instead of a flat "name": "Kenya"). What is needed to use this data with our existing Country class?',
      options: { a: 'Country must be completely rewritten to match the API\'s exact shape', b: 'A small adapter/mapping function that transforms the API\'s raw shape into our own contract\'s shape (Session 26), BEFORE constructing Country instances — Country itself needs no changes', c: 'Nothing — Python automatically reconciles differing key names', d: 'The API\'s data cannot be used at all if the shape differs' },
      answer: 'b',
      explain: 'This is exactly Session 26\'s "contract" concept in action: rather than reshaping our whole application around one specific external API\'s shape, we write a small adapter that translates the API\'s raw data into our OWN agreed contract, keeping Country and everything downstream of it completely unchanged.',
    },
    {
      q: 'Given Session 24\'s repository design, what actually needs to change to point CountryRepository at data fetched from a real API instead of a JSON file?',
      options: { a: 'CountryRepository\'s get_all() and find_by_region() methods must be rewritten from scratch', b: 'Only how raw_data is obtained before being passed to the constructor — call requests.get(), adapt the shape, then pass the result in exactly like any other data source; the repository\'s own methods are unchanged', c: 'CountryExplorer must be entirely rebuilt', d: 'This is not possible without a major rewrite' },
      answer: 'b',
      explain: 'This is the fourth and most significant proof of Session 24\'s design (after mock data, a JSON file, and now a real live API) — only the source of raw_data changes; every method built on top of the repository remains completely untouched.',
    },
    {
      q: 'Why is directly trusting the API response\'s data types without validation (skipping Session 26\'s discipline) risky for a REAL, external API in particular?',
      options: { a: 'It is not risky; real APIs always return perfectly-typed, reliable data', b: 'An external API is entirely outside your control — it can change its shape, have bugs, or occasionally return malformed or unexpected data, making Session 26\'s validate_country_record even more important here than it was for your own mock/file data', c: 'Real APIs cannot return incorrect data by definition', d: 'Validation is only needed for locally-generated data' },
      answer: 'b',
      explain: 'An external, real API is the least trustworthy data source of all — you have zero control over it, and it can change or misbehave without warning. This makes Session 26\'s validation discipline more important here than anywhere else in the project so far.',
    },
  ],
  conceptTitle: 'Calling a Real API',
  sections: [
    {
      h3: 'Making an HTTP request with requests',
      paragraphs: ['The requests library (installed via pip) provides a simple interface for making HTTP calls — a GET request fetches data from a URL.'],
      code: `# pip install requests
import requests

response = requests.get("https://restcountries.com/v3.1/all?fields=name,region,population")
print(response.status_code)  # 200 means success

data = response.json()  # parses the JSON body into Python data structures
print(type(data))         # <class 'list'>
print(len(data))          # a few hundred countries`,
    },
    {
      h3: 'Checking the status code before trusting the response',
      paragraphs: ['Just like Session 07\'s validation-before-use discipline, always check that a request actually succeeded before trying to use its data.'],
      code: `response = requests.get("https://restcountries.com/v3.1/all?fields=name,region,population")

if response.status_code == 200:
    data = response.json()
else:
    print(f"API request failed with status {response.status_code}")
    data = []`,
      diagram: {
        caption: 'Check the status code before trusting the body — a failed request\'s "body" might not even be valid JSON at all.',
        boxes: [
          { label: 'status 200', text: 'trust the body' },
          { label: 'status 4xx/5xx', text: 'do NOT parse\nas success', accent: true },
        ],
      },
    },
    {
      h3: 'Adapting the API\'s shape to our own contract',
      paragraphs: ['The REST Countries API returns country data with its own shape — different from our simple flat contract. An adapter function bridges the gap, so Country itself never needs to change.'],
      code: `def adapt_api_record(raw):
    # The real API nests the name field, unlike our flat contract
    return {
        "name": raw["name"]["common"],
        "region": raw.get("region", "Unknown"),
        "population": raw.get("population", 0),
    }

api_records = [
    {"name": {"common": "Kenya"}, "region": "Africa", "population": 54000000},
]
adapted = [adapt_api_record(r) for r in api_records]
print(adapted)  # [{'name': 'Kenya', 'region': 'Africa', 'population': 54000000}]
# Now this matches OUR contract exactly, and Country.from_dict() works unchanged`,
    },
    {
      h3: 'Pointing the repository at the real API',
      paragraphs: ['Session 24\'s design proves itself for the third time: only how raw_data is obtained changes.'],
      code: `def fetch_countries_from_api():
    response = requests.get("https://restcountries.com/v3.1/all?fields=name,region,population")
    if response.status_code != 200:
        return []
    return [adapt_api_record(r) for r in response.json()]

repo = CountryRepository(raw_data=fetch_countries_from_api())
print(len(repo.get_all()))  # real, live data — get_all() itself is completely unchanged`,
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Call the real REST Countries API, adapt its shape to our contract, and construct a working CountryRepository from genuinely live data.',
    whatYouBuild: 'A file called <code>real_api_lab.py</code>.',
    steps: [
      { title: 'Create the file and make a basic request, checking the status code', body: [], code: `# real_api_lab.py
import requests

response = requests.get("https://restcountries.com/v3.1/all?fields=name,region,population")
print("Status code:", response.status_code)

if response.status_code == 200:
    raw_data = response.json()
    print("Received", len(raw_data), "records")
else:
    raw_data = []
    print("Request failed")` },
      { title: 'Inspect one raw record\'s actual shape', body: ['Print the first record and note how it differs from our own contract.'], code: `if raw_data:
    print(raw_data[0])` },
      { title: 'Write adapt_api_record and adapt the whole batch', body: [], code: `def adapt_api_record(raw):
    return {
        "name": raw["name"]["common"],
        "region": raw.get("region", "Unknown"),
        "population": raw.get("population", 0),
    }

adapted_records = [adapt_api_record(r) for r in raw_data]
print(adapted_records[0])  # now matches our own flat contract` },
      { title: 'Build a CountryRepository from the adapted, real data', body: [], code: `from country_explorer import CountryRepository

repo = CountryRepository(raw_data=adapted_records)
print(len(repo.get_all()))
print(repo.get_all()[0].summary())` },
      { title: 'Wrap the whole fetch in a function with status-code handling, and reuse Session 26\'s validation on a sample record', body: [], code: `from country_explorer import validate_country_record

def fetch_and_build_repository():
    response = requests.get("https://restcountries.com/v3.1/all?fields=name,region,population")
    if response.status_code != 200:
        print(f"API request failed with status {response.status_code}")
        return CountryRepository(raw_data=[])
    adapted = [adapt_api_record(r) for r in response.json()]
    return CountryRepository(raw_data=adapted)

repo = fetch_and_build_repository()
sample = repo._raw_data[0] if repo._raw_data else None
if sample:
    validate_country_record(sample)  # confirms the real, adapted data honors our contract
    print("Sample record honors the contract")` },
    ],
  },
  filesChanged: [
    { file: 'real_api_lab.py', action: 'Created', why: 'Fetches real data from the REST Countries API, adapts its shape, and builds a working repository.' },
    { file: 'docs/sessions/session-38/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add real_api_lab.py docs/sessions/session-38/index.html\ngit commit -m "session-38: fetch real data from the REST Countries API and adapt it to our contract"',
  commitQuestion: 'What did adapt_api_record() have to do, and why did Country and CountryRepository not need any changes at all?',
  checklist: [
    'The API response\'s status_code is checked before parsing its body as JSON',
    'adapt_api_record() correctly transforms the real API\'s nested name field into our flat contract',
    'A working CountryRepository is constructed from real, live, adapted API data',
    'Session 26\'s validate_country_record() is run against a real adapted record to confirm the contract is honored',
    'Country and CountryRepository required zero code changes for this new real data source',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Why did the real API\'s raw shape (nested name.common) not require rewriting Country itself? What design decision from earlier sessions made this possible?',
    'What would happen in your current code if the REST Countries API were temporarily down (status code other than 200)? Is that handled gracefully right now?',
    'How does adapt_api_record() relate to Session 26\'s concept of a "contract" — is the adapter enforcing the contract, or something else?',
    'This is the third data source CountryRepository has been pointed at (mock, JSON file, real API). What does that consistency tell you about the value of Session 24\'s original design decision?',
  ],
  whatBreaks: [
    { title: 'Trusting an untrustworthy response', text: 'Skipping the status-code check means a failed request (e.g. a 500 server error, whose body might not even be valid JSON) could crash the program trying to call .json() on something that was never a successful response in the first place.' },
    { title: 'Graceful degradation (Session 39)', text: 'The next session builds proper loading and error states around exactly this kind of network call — right now, a slow or failed API call has no user-facing feedback at all, which the next session addresses.' },
    { title: 'The capstone review (Session 40)', text: 'This session is the culmination of Layer 4\'s entire mock-data philosophy: everything built against fake data throughout the project now works, unmodified, against a real, live, external data source.' },
  ],
  learnedConcept: 'Making real HTTP requests with the requests library, checking status codes, and adapting an external API\'s shape to our own internal data contract.',
  learnedUnlocks: 'The Country Explorer can now pull genuinely live, real-world data — proving every layer of the architecture built since Layer 4 was worth the investment.',
  nextTeaser: 'We add proper loading and error feedback around this real network call, instead of a program that just silently hangs or fails.',
},

// ── SESSION 39 ─────────────────────────────────────────────────────
{
  num: 39,
  title: 'Handling Errors and Edge Cases Gracefully',
  nextTitle: 'Capstone Review',
  subtitle: 'A real network call can fail in many ways: no connection, a timeout, a malformed response. We build proper loading and error feedback instead of a program that silently hangs or crashes.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Set a timeout on a network request and handle it when it fires',
    'Catch requests-specific exceptions distinctly from generic ones',
    'Design a simple three-state loading/success/error model for a network operation',
    'Provide clear, actionable feedback for each of those three states',
    'Bring every error-handling technique from the whole curriculum together into one cohesive, real operation',
  ],
  quiz: [
    {
      q: 'Why should a network request always specify a timeout, e.g. requests.get(url, timeout=5)?',
      options: { a: 'It has no real effect; requests always returns quickly', b: 'Without a timeout, a request to an unresponsive server could hang indefinitely, freezing the whole program; a timeout guarantees it fails (raising an exception you can catch) after a bounded amount of time instead', c: 'timeout is required syntax and has no functional purpose', d: 'Timeouts only apply to file operations, not network requests' },
      answer: 'b',
      explain: 'Without a timeout, a request to a slow or unresponsive server could hang forever, freezing the entire program. Specifying <code>timeout=5</code> guarantees the request either succeeds or fails within a bounded time, raising a catchable exception if it does not.',
    },
    {
      q: 'What does requests.exceptions.ConnectionError typically indicate, as opposed to requests.exceptions.Timeout?',
      options: { a: 'They are identical exceptions with different names', b: 'ConnectionError typically means the network connection could not be established at all (e.g. no internet, DNS failure); Timeout specifically means the request took too long and was cut off, per the timeout setting', c: 'ConnectionError only happens with HTTPS URLs', d: 'Timeout means the server actively rejected the request' },
      answer: 'b',
      explain: 'These are distinct failure modes the requests library exposes as separate exception types — being able to distinguish "we could not even connect" from "we connected but it took too long" lets you give the user more specific, useful feedback.',
    },
    {
      q: 'Why is a three-state model (loading, success, error) more useful for a network operation than a program that just silently waits and then either works or crashes?',
      options: { a: 'There is no benefit; a program should never show intermediate states', b: 'It gives the user or caller clear, honest feedback about what is currently happening — including that something is actively in progress — rather than an unexplained pause followed by either a result or an unexplained failure', c: 'Three-state models are required by the requests library', d: ' This concept only applies to graphical user interfaces, never to command-line programs' },
      answer: 'b',
      explain: 'This mirrors the "loading and error states" concept from the original React course this curriculum is modeled on — any operation that takes time and can fail benefits from explicitly communicating its current state, rather than leaving the user guessing during a silent pause.',
    },
    {
      q: 'A network call might fail from a connection error, a timeout, OR return a non-200 status code (Session 38). Should all three be handled with a single, generic except Exception?',
      options: { a: 'Yes — this is the simplest and best approach', b: 'No — per Session 07\'s discipline, each distinct failure mode should be caught and handled specifically, so the user gets an accurate, specific message about what actually went wrong rather than one generic, unhelpful failure', c: 'Only ConnectionError needs specific handling; the rest do not matter', d: 'Python does not allow catching more than one exception type in the same function' },
      answer: 'b',
      explain: 'This is Session 07\'s "catch narrowly" principle applied at full scale to a real, multi-failure-mode operation: connection errors, timeouts, and bad status codes are all distinct, specific situations that deserve their own specific handling and messaging, not one catch-all.',
    },
    {
      q: 'How does this session\'s error handling relate to everything else built across the curriculum, particularly Sessions 07, 20, 25, and 37?',
      options: { a: 'It is unrelated new material with no connection to prior sessions', b: 'It is the culmination of the same exception-handling discipline (Session 07), input/response validation (Session 20, 26), and resource-safety practices (Session 25, 37) applied together to the single riskiest, least controllable operation in the whole project: a real network call', c: 'Only Session 07 is relevant; the others do not apply here', d: 'Network calls require an entirely different, unrelated set of skills' },
      answer: 'b',
      explain: 'This session is deliberately a synthesis point — every defensive technique built up over the whole curriculum (specific exception catching, validating untrusted input, safe resource handling) comes together here, applied to the single most unpredictable operation the project performs.',
    },
  ],
  conceptTitle: 'Robust Network Error Handling',
  sections: [
    {
      h3: 'Always set a timeout',
      paragraphs: ['Without a timeout, a request to an unresponsive server can hang the entire program indefinitely. A timeout guarantees the request either succeeds or fails within a bounded time.'],
      code: `import requests

try:
    response = requests.get(
        "https://restcountries.com/v3.1/all?fields=name,region,population",
        timeout=5,  # give up after 5 seconds
    )
except requests.exceptions.Timeout:
    print("The request took too long and was cancelled.")`,
    },
    {
      h3: 'Catching distinct network failure modes specifically',
      paragraphs: ['The requests library provides specific exception types for different failure modes — catching them individually (Session 07\'s discipline) gives clearer, more actionable feedback than one generic catch.'],
      code: `import requests

def fetch_countries_safely():
    try:
        response = requests.get(
            "https://restcountries.com/v3.1/all?fields=name,region,population",
            timeout=5,
        )
    except requests.exceptions.ConnectionError:
        return None, "Could not connect — check your internet connection."
    except requests.exceptions.Timeout:
        return None, "The request took too long and was cancelled."
    except requests.exceptions.RequestException as e:
        return None, f"An unexpected network error occurred: {e}"

    if response.status_code != 200:
        return None, f"The API returned an error (status {response.status_code})."

    return response.json(), None`,
      diagram: {
        caption: 'Each distinct network failure mode gets its own specific handling and message, per Session 07\'s catch-narrowly discipline.',
        boxes: [
          { label: 'ConnectionError', text: 'no internet' },
          { label: 'Timeout', text: 'too slow', accent: true },
          { label: 'bad status', text: 'server error' },
        ],
      },
    },
    {
      h3: 'A three-state model: loading, success, error',
      paragraphs: ['Rather than a silent pause followed by an unexplained result, explicitly represent and communicate what is currently happening — directly analogous to the loading/error states covered in the original React course this curriculum is modeled on.'],
      code: `def load_countries_with_feedback():
    print("Loading countries...")  # the "loading" state, communicated explicitly

    data, error = fetch_countries_safely()

    if error:
        print(f"Error: {error}")   # the "error" state, with a specific, useful message
        return []

    print(f"Loaded {len(data)} countries successfully.")  # the "success" state
    return data`,
    },
    {
      h3: 'Bringing it all together',
      paragraphs: ['This combines Session 07\'s exception discipline, Session 26\'s validation, Session 37\'s resource safety, and Session 38\'s API adaptation into one cohesive, defensively-built operation — the most robust piece of code in the entire project.'],
    },
  ],
  callout: null,
  closing: null,
  lab: {
    objective: 'Build a fully robust country-loading function combining timeouts, specific exception handling, and explicit loading/success/error feedback.',
    whatYouBuild: 'A file called <code>robust_loading_lab.py</code>.',
    steps: [
      { title: 'Create the file with a timeout-protected, specifically-handled fetch function', body: [], code: `# robust_loading_lab.py
import requests

def fetch_countries_safely(url, timeout=5):
    try:
        response = requests.get(url, timeout=timeout)
    except requests.exceptions.ConnectionError:
        return None, "Could not connect — check your internet connection."
    except requests.exceptions.Timeout:
        return None, "The request took too long and was cancelled."
    except requests.exceptions.RequestException as e:
        return None, f"An unexpected network error occurred: {e}"

    if response.status_code != 200:
        return None, f"The API returned an error (status {response.status_code})."

    return response.json(), None` },
      { title: 'Test the happy path with the real API', body: [], code: `data, error = fetch_countries_safely("https://restcountries.com/v3.1/all?fields=name,region,population")
if error:
    print("Error:", error)
else:
    print(f"Loaded {len(data)} countries")` },
      { title: 'Test the error path with a deliberately bad URL', body: ['This should trigger ConnectionError handling, not a crash.'], code: `data, error = fetch_countries_safely("https://this-domain-does-not-exist-12345.example")
print("Error:", error)
print("Data:", data)` },
      { title: 'Test the error path with an intentionally short timeout', body: ['Use timeout=0.001 against the real API to force a Timeout exception.'], code: `data, error = fetch_countries_safely(
    "https://restcountries.com/v3.1/all?fields=name,region,population",
    timeout=0.001,
)
print("Error:", error)` },
      { title: 'Combine everything into a full loading pipeline with explicit state messages', body: ['Adapt the data (Session 38), validate a sample (Session 26), and build a CountryRepository, all with explicit loading/success/error feedback.'], code: `from country_explorer import CountryRepository, validate_country_record

def adapt_api_record(raw):
    return {
        "name": raw["name"]["common"],
        "region": raw.get("region", "Unknown"),
        "population": raw.get("population", 0),
    }

def load_country_repository(url):
    print("Loading countries...")
    raw_data, error = fetch_countries_safely(url)
    if error:
        print(f"Error: {error}")
        return CountryRepository(raw_data=[])

    adapted = [adapt_api_record(r) for r in raw_data]
    if adapted:
        validate_country_record(adapted[0])
    print(f"Loaded {len(adapted)} countries successfully.")
    return CountryRepository(raw_data=adapted)

repo = load_country_repository("https://restcountries.com/v3.1/all?fields=name,region,population")
print(repo.get_all()[0].summary())` },
    ],
  },
  filesChanged: [
    { file: 'robust_loading_lab.py', action: 'Created', why: 'A fully robust, defensively-built network loading pipeline with three-state feedback.' },
    { file: 'docs/sessions/session-39/index.html', action: 'Created', why: 'This session document.' },
  ],
  commitCmd: 'git add robust_loading_lab.py docs/sessions/session-39/index.html\ngit commit -m "session-39: add timeouts, specific error handling, and loading/success/error feedback"',
  commitQuestion: 'Why does fetch_countries_safely catch ConnectionError, Timeout, and RequestException separately instead of one generic except Exception?',
  checklist: [
    'Every requests.get() call specifies an explicit timeout',
    'ConnectionError, Timeout, and the general RequestException are each caught separately with distinct messages',
    'A non-200 status code is treated as an error case, not blindly parsed as success',
    'The loading pipeline explicitly communicates its loading, success, and error states',
    'All three test scenarios (happy path, bad URL, forced timeout) were run and observed',
    'I can explain every line without looking at the concept section',
  ],
  reflection: [
    'Why does this session catch requests.exceptions.RequestException as a broader fallback AFTER the two more specific exceptions, rather than instead of them? What does exception ordering have to do with this?',
    'Trace through everything that would go wrong if fetch_countries_safely had no timeout at all and the API server happened to hang without ever responding.',
    'How many distinct sessions\' worth of error-handling technique can you identify being used together in load_country_repository? List them.',
    'If you were building a real, user-facing application (not a console script) around this loading pipeline, what would the loading/success/error states actually look like to the user?',
  ],
  whatBreaks: [
    { title: 'A frozen, unresponsive program', text: 'Without a timeout, one unresponsive server could freeze the entire program indefinitely — completely unacceptable for anything meant to be used interactively or run unattended.' },
    { title: 'Confusing, generic failures', text: 'Catching everything with one generic except Exception (rather than the specific types this session teaches) means a user experiencing a connection problem sees the exact same unhelpful message as someone hitting a slow timeout or a server error — making the problem much harder to diagnose or explain to someone else.' },
    { title: 'The capstone review (Session 40)', text: 'This session\'s robust loading pipeline is the single piece of code most representative of everything the curriculum has built toward — the final session reviews it, and everything else, end to end.' },
  ],
  learnedConcept: 'Robust network error handling — timeouts, specific exception types for distinct failure modes, and explicit loading/success/error state communication.',
  learnedUnlocks: 'The Country Explorer can now handle real-world network unreliability gracefully, giving clear feedback instead of hanging or crashing — the last new skill before the capstone review.',
  nextTeaser: 'The capstone. We walk through the entire project end to end, review every architectural decision, and take a comprehensive quiz across all seven layers.',
},

// ── SESSION 40 ─────────────────────────────────────────────────────
{
  num: 40,
  title: 'Capstone Review',
  nextTitle: null,
  subtitle: 'The final session. We walk through everything built across all seven layers, confirm the full test suite passes end to end, and reflect on the complete journey from a single dictionary to a real, tested, documented application.',
  timeEstimate: '35–40 minutes',
  objectives: [
    'Trace the Country Explorer\'s full architecture from raw data source to displayed summary',
    'Run the complete, final test suite and confirm every layer\'s work still passes together',
    'Update ARCHITECTURE.md with a final, whole-project retrospective',
    'Answer the comprehensive review quiz spanning concepts from all seven layers',
    'Articulate, in your own words, how each layer\'s concepts built directly on the layer before it',
  ],
  quiz: [
    {
      q: 'Trace a request for data from the outside world to a displayed country summary. Which order is correct, given everything built across Layers 1, 2, and 4?',
      options: { a: 'Country.summary() runs first, then CountryRepository fetches data afterward', b: 'CountryRepository fetches and validates raw data (Layer 4) -> converts it into Country instances via from_dict (Layer 2) -> CountryExplorer composes and operates on the collection (Layer 2/3) -> Country.summary() formats one instance for display (Layer 2)', c: 'There is no meaningful order; all of these happen simultaneously with no dependency', d: 'CountryExplorer must exist before any data can be fetched' },
      answer: 'b',
      explain: 'This is the full data flow built up across the entire curriculum: raw data enters through the repository (fetched and validated), gets converted into proper objects, gets composed into a working collection, and finally gets formatted for display — each step depending on the layer before it.',
    },
    {
      q: 'Why does Country.grow_population() (Session 10/17) still work correctly even after the project was reorganized into a package (Session 32), extracted into shared utilities (Sessions 33-34), and pointed at three different data sources (Sessions 23, 25, 38)?',
      options: { a: 'It does not still work; it required rewriting at every one of those stages', b: 'Because each of those changes respected the boundaries and contracts established earlier — the method\'s own logic never depended on package location, data source, or any other structural detail outside itself', c: 'Python automatically fixes any breakage caused by refactoring', d: 'grow_population happens to be a coincidentally trivial method with no real logic' },
      answer: 'b',
      explain: 'This is the deepest lesson of the whole curriculum: well-designed logic, properly encapsulated behind clear contracts (Session 11, 24, 26), remains stable even as everything AROUND it — file structure, data source, calling code — changes dramatically over time.',
    },
    {
      q: 'Why does this capstone review explicitly re-run the full test suite one final time, given it has already been run after nearly every structural session since Layer 5?',
      options: { a: 'It is unnecessary repetition with no additional value at this point', b: 'It provides final, end-to-end confirmation that all seven layers of work — spanning very different kinds of changes (data sources, package structure, real network calls) — are still correctly integrated together as one working whole', c: 'pytest results expire and must be re-verified at the end of every curriculum', d: 'This step exists purely as a formality with no real technical purpose' },
      answer: 'b',
      explain: 'This is the ultimate proof-of-concept for the discipline built throughout Layer 5 and beyond: a test suite maintained consistently across dozens of structural changes provides genuine, verifiable confidence that the ENTIRE system still works correctly together — not just each part in isolation.',
    },
    {
      q: 'Looking back at Sessions 08, 16, and 23 (each a concept-only session establishing a new mental model before implementation) — why did the curriculum repeatedly use this same two-step pattern?',
      options: { a: 'It was accidental repetition with no deliberate design', b: 'Understanding WHY a practice exists and what problem it solves produces more durable, transferable knowledge than memorizing HOW to use a tool without understanding its purpose — a pattern applied consistently to classes, state, and mock data alike', c: 'Concept-only sessions were only used because there was not enough new syntax to teach otherwise', d: 'This pattern has no relationship to how the sessions building on top of them turned out' },
      answer: 'b',
      explain: 'This consistent pedagogical choice — concept before implementation — is why, at the end of this curriculum, you should be able to explain WHY each major pattern (classes, state, mock data, testing) exists, not just recite its syntax, which is a direct measure of the durable, transferable understanding this course aimed for.',
    },
    {
      q: 'The Layer 4 mock-data philosophy (Session 23) promised that application code would not need to change regardless of the data source. How many DIFFERENT data sources was CountryRepository actually pointed at across the curriculum, with zero changes to its own methods?',
      options: { a: 'One — only the original mock data', b: 'Three — the in-memory mock list (Session 23), a real JSON file on disk (Session 25/37), and a real live network API (Session 38) — all with the exact same get_all()/find_by_region()/search() methods, unmodified', c: 'This promise was never actually fulfilled anywhere in the curriculum', d: 'Zero — CountryRepository was rewritten from scratch for each new source' },
      answer: 'b',
      explain: 'This is worth recognizing explicitly at the end of the curriculum: Session 24\'s repository design was validated not once, but three separate times, against three genuinely different kinds of data sources — direct, concrete proof that the architectural investment paid off.',
    },
  ],
  conceptTitle: 'The Complete Country Explorer — End to End',
  sections: [
    {
      h3: 'The full architecture, traced from data to display',
      paragraphs: ['Every layer of this curriculum contributed one piece of a single, coherent pipeline. Tracing it end to end shows how deeply each layer depended on the one before it.'],
      code: `# The full pipeline, built up across all 40 sessions:

# 1. Layer 4 — a repository fetches and validates raw data
#    (from mock data, a JSON file, or a real API — interchangeably)
repo = CountryRepository(raw_data=fetch_countries_safely_and_adapt())

# 2. Layer 2 — raw dicts become real, validated Country instances
countries = repo.get_all()   # uses Country.from_dict() internally

# 3. Layer 2/3 — a CountryExplorer composes and manages the working collection
explorer = CountryExplorer(countries=countries)

# 4. Layer 3 — computed properties derive values safely, with no drift risk
print(explorer.total_population)   # @property, Session 22

# 5. Layer 6 — shared utilities used consistently across the whole app
results = explorer.search("ken")   # search.py, Session 34

# 6. Layer 2 — each instance formats itself for display
for c in results:
    print(c.summary())             # formatting.py, Session 33`,
    },
    {
      h3: 'Why the architecture held up under change',
      paragraphs: [
        'Country.summary() and grow_population() were written in Sessions 09-10. By Session 40, the project has been reorganized into a package, had shared logic extracted into utilities, and been pointed at three completely different data sources. Yet those original methods never needed to change — because they were built on clear, explicit contracts (Session 11) from the very beginning.',
      ],
      diagram: {
        caption: 'Everything around the core logic changed dramatically over 40 sessions. The core logic itself, protected by clear contracts, did not need to.',
        boxes: [
          { label: 'data source', text: 'changed 3x' },
          { label: 'package structure', text: 'reorganized', accent: true },
          { label: 'Country\'s own methods', text: 'unchanged\nsince Session 10' },
        ],
      },
    },
    {
      h3: 'The final test suite, as proof',
      paragraphs: [
        'A test suite maintained honestly across dozens of structural changes — package reorganizations, new data sources, extracted utilities — is not just a checkbox. Running it one final time, and having it pass, is the closest thing to objective proof that this entire architecture genuinely works, together, as one coherent system.',
      ],
    },
    {
      h3: 'The consistent teaching pattern, revisited',
      paragraphs: [
        'Sessions 08, 16, and 23 each paused to build a mental model — why classes exist, what state actually means, why mock data matters — before the following session introduced concrete implementation. This deliberate pattern is why the concepts in this curriculum should feel understood, not memorized.',
      ],
    },
  ],
  callout: {
    title: 'Capstone:',
    text: 'This is the final session. The quiz below spans concepts from every layer of the curriculum — Layer 1 through Layer 7 — and the lab asks you to review, verify, and reflect on the entire project as a whole.',
  },
  closing: null,
  lab: {
    objective: 'Run the complete final test suite, trace the full architecture end to end in writing, and add a final whole-project retrospective to ARCHITECTURE.md.',
    whatYouBuild: 'A final update to <code>ARCHITECTURE.md</code>, plus a verification pass across the whole project.',
    steps: [
      { title: 'Run the complete test suite one final time', body: ['Every test written since Session 28 should be discovered and pass together.'], code: '# pytest -v' },
      { title: 'Write a short, complete trace of the data flow, end to end', body: ['In a new file or as a comment block, trace: where does data start (Layer 4), how does it become objects (Layer 2), how is it composed and searched (Layer 2/3/6), and how does it reach a printed summary (Layer 2)?'], code: `# capstone_trace.py — a written trace of the full pipeline, in your own words
#
# 1. CountryRepository fetches raw data (mock / file / real API — Session 23-25, 38)
# 2. Repository validates and converts raw dicts into Country instances (Session 14, 26)
# 3. CountryExplorer composes the working collection (Session 12)
# 4. Computed properties (Session 22) and the shared search utility (Session 34)
#    operate on that collection safely
# 5. Country.summary() (Session 10, using formatting.py from Session 33) produces
#    the final, human-readable output` },
      { title: 'Add a final whole-project retrospective to ARCHITECTURE.md', body: ['Answer explicitly: what would you do differently starting over, and what part of the architecture are you most confident in?'], code: `## Final Retrospective (Session 40)

**Most confident in:** The repository pattern (ADR-001) — proven across three
genuinely different data sources with zero changes to its own methods.

**Would reconsider:** [your own honest answer — e.g. the prop drilling
problem from ADR-003, or the size/granularity of formatting.py and search.py]

**Biggest lesson:** [your own honest answer, in your own words]` },
      { title: 'Verify the complete pipeline runs end to end against the real API', body: ['Using everything built since Session 38-39, load real data, search it, and print summaries — the actual, complete, working Country Explorer.'], code: `from country_explorer import CountryRepository

# reuse load_country_repository from Session 39
repo = load_country_repository("https://restcountries.com/v3.1/all?fields=name,region,population")
results = repo.search("ken")
for c in results:
    print(c.summary())` },
      { title: 'Take the comprehensive capstone quiz below, covering all seven layers', body: ['You need 4/5 to consider the curriculum complete.'] },
    ],
  },
  filesChanged: [
    { file: 'capstone_trace.py', action: 'Created', why: 'A written, end-to-end trace of the complete application architecture.' },
    { file: 'ARCHITECTURE.md', action: 'Modified', why: 'Final whole-project retrospective added.' },
    { file: 'docs/sessions/session-40/index.html', action: 'Created', why: 'This session document — the capstone.' },
  ],
  commitCmd: 'git add capstone_trace.py ARCHITECTURE.md docs/sessions/session-40/index.html\ngit commit -m "session-40: capstone review — full architecture trace, final retrospective, complete test verification"',
  commitQuestion: 'Looking back across all 40 sessions, which single architectural decision are you most confident paid off, and why?',
  checklist: [
    'The complete test suite (Sessions 27-39) is run one final time and passes entirely',
    'A written trace correctly describes the full data flow from raw source to displayed summary',
    'ARCHITECTURE.md contains a final, honest whole-project retrospective',
    'The complete pipeline is verified running end to end against the real REST Countries API',
    'The comprehensive capstone quiz is completed with a score of at least 4/5',
    'I can explain, without notes, how each layer of this curriculum built on the layer before it',
  ],
  reflection: [
    'Of the 40 sessions in this curriculum, which single session changed how you think about writing Python the most? Why that one specifically?',
    'The curriculum used the same "concept session, then implementation session" pattern three times (Sessions 8/9, 16/17, 23/24). Now that you have completed it, was that pattern actually helpful, or would you have preferred combining concept and implementation together?',
    'If you were to extend this project with an eighth layer, what real-world capability would you add, and which earlier layer\'s foundation would it depend on most?',
    'Compare your understanding of Python now to your understanding after only Session 07 (the end of Layer 1). What is the single biggest difference?',
  ],
  whatBreaks: [
    { title: 'Nothing — this is the capstone', text: 'There is no next session to set up. This final review exists to confirm the whole system holds together, and to consolidate 40 sessions of individually-learned concepts into one coherent understanding of how a real Python application is actually built, tested, and maintained.' },
  ],
  learnedConcept: 'A complete, end-to-end understanding of the Country Explorer application — how all seven layers connect, and why the architectural decisions made along the way held up under real change.',
  learnedUnlocks: 'You have completed Python Fundamentals: from a single dictionary in Session 01 to a tested, documented, real-API-integrated application in Session 40.',
  nextTeaser: null,
},

];