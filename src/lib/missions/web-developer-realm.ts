import type { Mission } from "./types";

// World 6 — Web Developer Realm.
// Teaches HTML → CSS → JS → React → Node → DB → Full-stack → Deploy.
// Code challenges use Python to *build* the web artifact as a string
// (HTML markup, CSS rules, mock request handlers, SQL queries) so the
// existing Pyodide runner can grade real conceptual work with hidden tests.

export const webDeveloperRealmMissions: Mission[] = [
  // ------------------------------------------------------------------
  // 1. HTML FORTRESS
  // ------------------------------------------------------------------
  {
    slug: "html-fortress",
    worldSlug: "web-developer-realm",
    title: "HTML Fortress",
    subtitle: "Raise walls of semantic structure.",
    difficulty: 1,
    estMinutes: 12,
    xpBase: 110,
    topics: ["html", "semantic tags", "forms", "accessibility"],
    steps: [
      {
        kind: "intro",
        title: "The empty page",
        story:
          "Every website in existence starts as a blank <html> document. Before styling, before logic, structure comes first. Your first task: raise the fortress walls with semantic HTML.",
        visual: "gate",
      },
      {
        kind: "concept",
        title: "HTML is a tree of tags",
        body:
          "An HTML document is a tree. Tags describe MEANING (header, nav, main, article, footer), not appearance. Semantic tags help screen readers, search engines, and your future self.",
        demo: {
          type: "code-trace",
          lines: [
            "<!doctype html>",
            "<html>",
            "  <head><title>Fortress</title></head>",
            "  <body>",
            "    <header><h1>Welcome</h1></header>",
            "    <main><p>Guarded.</p></main>",
            "  </body>",
            "</html>",
          ],
          explain: [
            "Doctype declares HTML5.",
            "The root <html> element wraps everything.",
            "The <head> holds metadata: title, meta, links.",
            "The <body> holds visible content.",
            "<header> is meaningful — not just a styled div.",
            "<main> marks the primary content region.",
            "Screen readers and SEO understand this structure.",
          ],
        },
      },
      {
        kind: "practice",
        title: "Pick the right tag",
        challenge: {
          type: "mcq",
          prompt:
            "You need to wrap the site's primary navigation links. Which tag is most semantic?",
          options: ["<div class=\"nav\">", "<nav>", "<section>", "<aside>"],
          correctIndex: 1,
          explain:
            "<nav> tells assistive tech 'this is navigation'. A div works visually but carries no meaning.",
        },
      },
      {
        kind: "code",
        title: "Build a semantic page",
        brief:
          "Write `build_page(title, heading)` that returns an HTML string with a <!doctype html>, a <title> matching `title`, a <header> containing <h1>heading</h1>, and a <main> region. Then `print(build_page('Fortress', 'Welcome'))`.",
        language: "python",
        starter:
          "def build_page(title, heading):\n    # return one HTML string\n    pass\n\nprint(build_page('Fortress', 'Welcome'))\n",
        tests: [
          { label: "Declares HTML5 doctype", expectIncludes: ["<!doctype html>"] },
          {
            label: "Title is set correctly",
            expectEval: { expr: "'<title>Fortress</title>' in build_page('Fortress','X')", equals: true },
          },
          {
            label: "Uses <header> with the heading",
            expectEval: { expr: "'<header>' in build_page('T','Hi') and '<h1>Hi</h1>' in build_page('T','Hi')", equals: true },
          },
          {
            label: "Has a <main> region",
            expectEval: { expr: "'<main>' in build_page('T','H') and '</main>' in build_page('T','H')", equals: true },
          },
        ],
        hintTopic:
          "Return a single f-string. Lowercase all tags. Concatenate with newlines for readability.",
      },
      {
        kind: "boss",
        title: "Boss — Accessible Form",
        story:
          "The fortress gate needs a login form. It must be usable by keyboard AND screen reader. Every input needs a matching <label>.",
        challenge: {
          type: "code",
          brief:
            "Write `login_form()` returning an HTML string containing a <form>, an email input with id='email' and a matching <label for='email'>, a password input with id='pw' and its label, plus a <button type='submit'>.",
          language: "python",
          starter:
            "def login_form():\n    return ''\n\nprint(login_form())\n",
          tests: [
            { label: "Wraps in a <form>", expectEval: { expr: "'<form' in login_form() and '</form>' in login_form()", equals: true } },
            { label: "Email input is labelled", expectEval: { expr: "'for=\"email\"' in login_form() or \"for='email'\" in login_form()", equals: true } },
            { label: "Password input is labelled", expectEval: { expr: "'id=\"pw\"' in login_form() or \"id='pw'\" in login_form()", equals: true } },
            { label: "Submit button present", expectEval: { expr: "'type=\"submit\"' in login_form() or \"type='submit'\" in login_form()", equals: true } },
          ],
          hintTopic:
            "Each <input id='x'> pairs with a <label for='x'>. That link is what makes forms accessible.",
        },
      },
      {
        kind: "mastery",
        title: "Walls raised",
        summary: "You now write HTML that both humans and machines understand.",
        takeaways: [
          "Choose tags for MEANING, not looks.",
          "Every input needs a label — accessibility is not optional.",
          "The document tree is what screen readers navigate.",
        ],
        xpReward: 110,
        badgeSlug: "html-architect",
        badgeName: "HTML Architect",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 2. CSS STYLING FORGE
  // ------------------------------------------------------------------
  {
    slug: "css-styling-forge",
    worldSlug: "web-developer-realm",
    title: "CSS Styling Forge",
    subtitle: "Selectors, flex, grid, responsive.",
    difficulty: 2,
    estMinutes: 14,
    xpBase: 130,
    topics: ["css", "selectors", "flexbox", "grid", "responsive"],
    steps: [
      {
        kind: "intro",
        title: "Cold stone becomes glowing steel",
        story:
          "The fortress walls are grey. In the CSS Forge you learn to shape, colour, and lay them out — from single-column mobile to multi-column desktop.",
        visual: "forge",
      },
      {
        kind: "concept",
        title: "Selectors target the tree",
        body:
          "CSS rules pick nodes from the HTML tree and apply properties. Specificity: id > class > tag. Layout modes: block, flex, grid. Media queries adapt to screen size.",
        demo: {
          type: "code-trace",
          lines: [
            "/* target class */",
            ".card { padding: 1rem; border-radius: 8px; }",
            "/* flex row */",
            ".row { display: flex; gap: 1rem; }",
            "/* responsive */",
            "@media (max-width: 640px) { .row { flex-direction: column; } }",
          ],
          explain: [
            "Comments start with /*.",
            "A class selector uses a dot.",
            "Flex turns children into a row with spacing.",
            "Media queries scope rules to a screen size.",
            "Below 640px, we stack the row vertically.",
            "That is 'responsive' in three lines.",
          ],
        },
      },
      {
        kind: "practice",
        title: "Which display for a nav bar row?",
        challenge: {
          type: "mcq",
          prompt:
            "You want a horizontal row of nav links that stays evenly spaced. Which display value is the modern answer?",
          options: ["display: block", "display: inline-block", "display: flex", "display: table"],
          correctIndex: 2,
          explain:
            "Flex was designed exactly for 1-D layouts like nav rows — easy alignment and spacing with gap.",
        },
      },
      {
        kind: "code",
        title: "Compose a card style",
        brief:
          "Write `card_css(padding, radius)` returning CSS for `.card` with the given padding (in rem) and border-radius (in px). Example: card_css(1, 8) should include '.card' and 'padding: 1rem' and 'border-radius: 8px'.",
        language: "python",
        starter:
          "def card_css(padding, radius):\n    # return one CSS string\n    pass\n\nprint(card_css(1, 8))\n",
        tests: [
          { label: "Targets .card", expectEval: { expr: "'.card' in card_css(1, 8)", equals: true } },
          { label: "Padding in rem", expectEval: { expr: "'padding: 1rem' in card_css(1, 8)", equals: true } },
          { label: "Radius in px", expectEval: { expr: "'border-radius: 8px' in card_css(1, 8)", equals: true } },
          { label: "Handles different values", expectEval: { expr: "'padding: 2rem' in card_css(2, 12) and 'border-radius: 12px' in card_css(2, 12)", equals: true } },
        ],
        hintTopic: "Return an f-string like `.card {{ padding: {p}rem; border-radius: {r}px; }}`.",
      },
      {
        kind: "boss",
        title: "Boss — Responsive Grid",
        story:
          "The dashboard needs 3 columns on desktop, 1 on mobile. Compose the media query.",
        challenge: {
          type: "code",
          brief:
            "Write `grid_css()` returning CSS that gives `.grid` display:grid with grid-template-columns of 'repeat(3, 1fr)', PLUS a media query at max-width 640px that switches to '1fr'.",
          language: "python",
          starter:
            "def grid_css():\n    return ''\n\nprint(grid_css())\n",
          tests: [
            { label: "Uses display: grid", expectEval: { expr: "'display: grid' in grid_css()", equals: true } },
            { label: "3-column desktop", expectEval: { expr: "'repeat(3, 1fr)' in grid_css()", equals: true } },
            { label: "Media query at 640px", expectEval: { expr: "'@media' in grid_css() and '640px' in grid_css()", equals: true } },
            { label: "Mobile collapses to 1fr", expectEval: { expr: "grid_css().count('1fr') >= 2", equals: true } },
          ],
          hintTopic: "Two CSS blocks: one base .grid rule, one @media(max-width:640px){ .grid { grid-template-columns: 1fr; } }.",
        },
      },
      {
        kind: "mastery",
        title: "Forge fires banked",
        summary: "You can now style, lay out, and adapt any page.",
        takeaways: [
          "Selectors pick nodes; specificity resolves conflicts.",
          "Flex for rows/columns, Grid for 2-D layouts.",
          "Responsive = design mobile first, expand with @media.",
        ],
        xpReward: 130,
        badgeSlug: "css-smith",
        badgeName: "CSS Smith",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 3. JAVASCRIPT VILLAGE
  // ------------------------------------------------------------------
  {
    slug: "javascript-village",
    worldSlug: "web-developer-realm",
    title: "JavaScript Village",
    subtitle: "Variables, functions, DOM, events.",
    difficulty: 2,
    estMinutes: 15,
    xpBase: 140,
    topics: ["javascript", "functions", "dom", "events"],
    steps: [
      {
        kind: "intro",
        title: "Bring pages to life",
        story:
          "Static pages are portraits. JavaScript is what makes them speak, react, and remember. The village awaits its first script.",
        visual: "spell",
      },
      {
        kind: "concept",
        title: "JS on the page",
        body:
          "JavaScript runs in the browser. It reads and changes the DOM (the live tree of HTML). Functions package reusable logic. Events (click, input, submit) trigger your code.",
        demo: {
          type: "code-trace",
          lines: [
            "const btn = document.querySelector('#go');",
            "let count = 0;",
            "btn.addEventListener('click', () => {",
            "  count += 1;",
            "  btn.textContent = `Clicked ${count}`;",
            "});",
          ],
          explain: [
            "Grab a node by id selector.",
            "State lives in a variable.",
            "Register a listener — it fires on click.",
            "Increment state each click.",
            "Write back into the DOM — the UI updates.",
          ],
        },
      },
      {
        kind: "practice",
        title: "Predict the counter",
        challenge: {
          type: "predict",
          prompt: "After 3 clicks, what does btn.textContent read?",
          code: "let count = 0;\nbtn.onclick = () => btn.textContent = `Clicked ${++count}`;",
          options: ["Clicked 0", "Clicked 2", "Clicked 3", "undefined"],
          correctIndex: 2,
          explain: "++count increments first, then reads — so click #3 shows 'Clicked 3'.",
        },
      },
      {
        kind: "code",
        title: "Model a click counter",
        brief:
          "Simulate JS state. Write a class `Counter` with `click()` returning the new count, starting at 0. First click returns 1, second returns 2, etc.",
        language: "python",
        starter:
          "class Counter:\n    def __init__(self):\n        pass\n    def click(self):\n        pass\n\nc = Counter()\nprint(c.click(), c.click(), c.click())\n",
        tests: [
          { label: "First click returns 1", expectEval: { expr: "Counter().click()", equals: 1 } },
          {
            label: "Three clicks reach 3",
            expectEval: { expr: "(lambda c: (c.click(), c.click(), c.click())[2])(Counter())", equals: 3 },
          },
          { label: "Prints 1 2 3", expectExact: "1 2 3" },
        ],
        hintTopic: "Store count in __init__; add 1 in click() before returning it.",
      },
      {
        kind: "boss",
        title: "Boss — Toggle Dark Mode",
        story:
          "Users demand a dark-mode toggle. Model the toggle: each call flips a boolean and returns the new theme name ('dark' or 'light').",
        challenge: {
          type: "code",
          brief:
            "Write a class `Theme` starting in 'light'. Method `toggle()` flips and returns the current theme name.",
          language: "python",
          starter:
            "class Theme:\n    def __init__(self):\n        pass\n    def toggle(self):\n        pass\n",
          tests: [
            { label: "First toggle → dark", expectEval: { expr: "Theme().toggle()", equals: "dark" } },
            {
              label: "Two toggles → light again",
              expectEval: { expr: "(lambda t: (t.toggle(), t.toggle())[1])(Theme())", equals: "light" },
            },
            {
              label: "Three toggles → dark",
              expectEval: { expr: "(lambda t: (t.toggle(), t.toggle(), t.toggle())[2])(Theme())", equals: "dark" },
            },
          ],
          hintTopic: "Store self.dark = False, flip it, return 'dark' if self.dark else 'light'.",
        },
      },
      {
        kind: "mastery",
        title: "Village awakened",
        summary: "You now bind state to the UI with events and functions.",
        takeaways: [
          "The DOM is a live tree — read and write it.",
          "Events are how the user talks to your code.",
          "Small pieces of state + listeners = an app.",
        ],
        xpReward: 140,
        badgeSlug: "js-villager",
        badgeName: "JS Villager",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 4. REACT KINGDOM
  // ------------------------------------------------------------------
  {
    slug: "react-kingdom",
    worldSlug: "web-developer-realm",
    title: "React Kingdom",
    subtitle: "Components, props, state, hooks.",
    difficulty: 3,
    estMinutes: 16,
    xpBase: 160,
    topics: ["react", "components", "props", "state", "hooks"],
    steps: [
      {
        kind: "intro",
        title: "Declarative armies",
        story:
          "In React Kingdom you don't command each pixel — you describe what the UI SHOULD look like for a given state, and React re-renders.",
        visual: "ai",
      },
      {
        kind: "concept",
        title: "Component = function of props",
        body:
          "A React component is a function returning JSX. Props flow in, state (useState) lives inside, effects (useEffect) run after render. Change state → React re-renders that subtree.",
        demo: {
          type: "code-trace",
          lines: [
            "function Counter({ start }) {",
            "  const [n, setN] = useState(start);",
            "  return (",
            "    <button onClick={() => setN(n + 1)}>",
            "      Count: {n}",
            "    </button>",
            "  );",
            "}",
          ],
          explain: [
            "Destructure props at the top.",
            "useState returns [value, setter].",
            "Render describes UI for the current state.",
            "Click handler calls the setter.",
            "React re-runs the function and diffs the DOM.",
          ],
        },
      },
      {
        kind: "practice",
        title: "Where does state go?",
        challenge: {
          type: "mcq",
          prompt:
            "Two sibling components (SearchBar, ResultList) both need the search query. Where does the state live?",
          options: [
            "Inside SearchBar only",
            "Inside ResultList only",
            "In their common parent (lifted up)",
            "In a global variable",
          ],
          correctIndex: 2,
          explain:
            "Lift state to the closest common ancestor and pass it down as props — canonical React.",
        },
      },
      {
        kind: "code",
        title: "Simulate useState",
        brief:
          "Model a component with useState. Write `make_counter(start)` returning a function that, each time called, returns the incremented count starting from `start + 1`.",
        language: "python",
        starter:
          "def make_counter(start):\n    # return a callable that increments and returns\n    pass\n\nc = make_counter(0)\nprint(c(), c(), c())\n",
        tests: [
          { label: "First call = start + 1", expectEval: { expr: "make_counter(10)()", equals: 11 } },
          {
            label: "Three calls advance",
            expectEval: { expr: "(lambda c: (c(), c(), c())[2])(make_counter(0))", equals: 3 },
          },
          { label: "Prints 1 2 3", expectExact: "1 2 3" },
        ],
        hintTopic: "Use a closure: outer holds state, inner increments and returns.",
      },
      {
        kind: "boss",
        title: "Boss — Todo Reducer",
        story:
          "The kingdom's todo list must add and toggle items. Model a reducer.",
        challenge: {
          type: "code",
          brief:
            "Write `reducer(state, action)`. state is a list of {'id':int,'done':bool,'text':str}. Actions: {'type':'add','text':str} appends {id:len+1,done:False,text}. {'type':'toggle','id':int} flips that item's done. Returns the new list (immutability not required).",
          language: "python",
          starter:
            "def reducer(state, action):\n    pass\n",
          tests: [
            {
              label: "Add appends with id 1",
              expectEval: { expr: "reducer([], {'type':'add','text':'buy milk'})", equals: [{ id: 1, done: false, text: "buy milk" }] },
            },
            {
              label: "Second add gets id 2",
              expectEval: {
                expr: "reducer([{'id':1,'done':False,'text':'a'}], {'type':'add','text':'b'})[1]['id']",
                equals: 2,
              },
            },
            {
              label: "Toggle flips done",
              expectEval: {
                expr: "reducer([{'id':1,'done':False,'text':'a'}], {'type':'toggle','id':1})[0]['done']",
                equals: true,
              },
            },
          ],
          hintTopic: "Branch on action['type']. For add use len(state)+1 as the id.",
        },
      },
      {
        kind: "mastery",
        title: "Crown of components",
        summary: "You now think in components, props, and state.",
        takeaways: [
          "UI is a function of state — change state, React re-renders.",
          "Lift state up when siblings need to share it.",
          "Hooks (useState, useEffect) are the primitives.",
        ],
        xpReward: 160,
        badgeSlug: "react-heir",
        badgeName: "React Heir",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 5. NODE.JS GATEWAY
  // ------------------------------------------------------------------
  {
    slug: "nodejs-gateway",
    worldSlug: "web-developer-realm",
    title: "Node.js Gateway",
    subtitle: "APIs, Express, routing, middleware.",
    difficulty: 3,
    estMinutes: 15,
    xpBase: 160,
    topics: ["node", "express", "http", "middleware", "rest"],
    steps: [
      {
        kind: "intro",
        title: "The gateway server",
        story:
          "Requests pour in from all realms. You'll route them, authenticate them, and answer with JSON.",
        visual: "gate",
      },
      {
        kind: "concept",
        title: "Express is a pipeline",
        body:
          "An Express app is a stack of middleware functions. Each request flows through — parsing, auth, routing — until a handler responds. Routes match method + path.",
        demo: {
          type: "code-trace",
          lines: [
            "const app = express();",
            "app.use(express.json());",
            "app.get('/users/:id', (req, res) => {",
            "  res.json({ id: req.params.id });",
            "});",
            "app.listen(3000);",
          ],
          explain: [
            "Create the app.",
            "Middleware parses JSON bodies.",
            "GET route with a path parameter.",
            "Respond with JSON.",
            "Bind and listen.",
          ],
        },
      },
      {
        kind: "practice",
        title: "Method + path",
        challenge: {
          type: "mcq",
          prompt: "REST: which method+path deletes user 42?",
          options: ["GET /users/42", "POST /users/42/delete", "DELETE /users/42", "REMOVE /users?id=42"],
          correctIndex: 2,
          explain: "REST maps deletion onto the DELETE verb targeting the resource URL.",
        },
      },
      {
        kind: "code",
        title: "Mock a router",
        brief:
          "Write `route(method, path)` that returns a JSON-like dict. For GET '/health' return {'ok':True}. For GET '/users/<id>' return {'id':int(id)}. For anything else return {'error':'not found'}.",
        language: "python",
        starter:
          "def route(method, path):\n    pass\n\nprint(route('GET','/health'))\n",
        tests: [
          { label: "Health check", expectEval: { expr: "route('GET','/health')", equals: { ok: true } } },
          { label: "User by id parses int", expectEval: { expr: "route('GET','/users/42')", equals: { id: 42 } } },
          { label: "Unknown path 404s", expectEval: { expr: "route('GET','/nope')", equals: { error: "not found" } } },
          { label: "Wrong method 404s", expectEval: { expr: "route('POST','/health')", equals: { error: "not found" } } },
        ],
        hintTopic: "Match method=='GET' and split path. Use path.startswith('/users/').",
      },
      {
        kind: "boss",
        title: "Boss — Auth Middleware",
        story:
          "Protect /admin routes. Only requests carrying a valid token reach the handler.",
        challenge: {
          type: "code",
          brief:
            "Write `handle(request)`. request is a dict {'method','path','token'}. If path starts with '/admin' and token != 'SECRET', return {'status':401,'body':'unauthorized'}. Otherwise return {'status':200,'body':'ok'}.",
          language: "python",
          starter:
            "def handle(request):\n    pass\n",
          tests: [
            {
              label: "Admin without token → 401",
              expectEval: { expr: "handle({'method':'GET','path':'/admin/users','token':''})", equals: { status: 401, body: "unauthorized" } },
            },
            {
              label: "Admin with wrong token → 401",
              expectEval: { expr: "handle({'method':'GET','path':'/admin/x','token':'nope'})", equals: { status: 401, body: "unauthorized" } },
            },
            {
              label: "Admin with SECRET → 200",
              expectEval: { expr: "handle({'method':'GET','path':'/admin','token':'SECRET'})", equals: { status: 200, body: "ok" } },
            },
            {
              label: "Public route always 200",
              expectEval: { expr: "handle({'method':'GET','path':'/','token':''})", equals: { status: 200, body: "ok" } },
            },
          ],
          hintTopic: "Middleware pattern: check the guard first, short-circuit on failure.",
        },
      },
      {
        kind: "mastery",
        title: "Gateway online",
        summary: "You now design REST endpoints and gate them with middleware.",
        takeaways: [
          "Middleware transforms requests before handlers.",
          "REST maps CRUD to HTTP verbs on resource URLs.",
          "Auth is just middleware that short-circuits.",
        ],
        xpReward: 160,
        badgeSlug: "gateway-keeper",
        badgeName: "Gateway Keeper",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 6. DATABASE CAVERNS
  // ------------------------------------------------------------------
  {
    slug: "database-caverns",
    worldSlug: "web-developer-realm",
    title: "Database Caverns",
    subtitle: "SQL, PostgreSQL, CRUD.",
    difficulty: 3,
    estMinutes: 14,
    xpBase: 150,
    topics: ["sql", "postgres", "crud"],
    steps: [
      {
        kind: "intro",
        title: "Where data sleeps",
        story:
          "Deep beneath the realm lies the database — tables of rows, indexed and durable. SQL is the language that wakes them.",
        visual: "vault",
      },
      {
        kind: "concept",
        title: "CRUD in SQL",
        body:
          "Create → INSERT. Read → SELECT. Update → UPDATE. Delete → DELETE. WHERE narrows rows. Always parameterize inputs to prevent SQL injection.",
        demo: {
          type: "code-trace",
          lines: [
            "CREATE TABLE users (id SERIAL PRIMARY KEY, email TEXT UNIQUE);",
            "INSERT INTO users (email) VALUES ($1);",
            "SELECT id, email FROM users WHERE id = $1;",
            "UPDATE users SET email = $1 WHERE id = $2;",
            "DELETE FROM users WHERE id = $1;",
          ],
          explain: [
            "Table schema with a primary key.",
            "Parameterized insert — never concatenate strings.",
            "SELECT projects columns; WHERE filters rows.",
            "UPDATE mutates matching rows.",
            "DELETE removes matching rows.",
          ],
        },
      },
      {
        kind: "practice",
        title: "Spot the injection",
        challenge: {
          type: "mcq",
          prompt:
            "Which query is safe from SQL injection when `email` is user input?",
          options: [
            "\"SELECT * FROM users WHERE email = '\" + email + \"'\"",
            "\"SELECT * FROM users WHERE email = $1\" with params=[email]",
            "\"SELECT * FROM users WHERE email = %s\" % email",
            "f\"SELECT * FROM users WHERE email = '{email}'\"",
          ],
          correctIndex: 1,
          explain:
            "Only parameterized queries are safe. Everything else concatenates user input into SQL.",
        },
      },
      {
        kind: "code",
        title: "Build a parameterized query",
        brief:
          "Write `find_user_sql()` returning the string `SELECT id, email FROM users WHERE email = $1` — parameterized, no string interpolation.",
        language: "python",
        starter:
          "def find_user_sql():\n    pass\n\nprint(find_user_sql())\n",
        tests: [
          { label: "Uses SELECT", expectEval: { expr: "'SELECT' in find_user_sql().upper()", equals: true } },
          { label: "Parameterized with $1", expectEval: { expr: "'$1' in find_user_sql()", equals: true } },
          { label: "No injection risk", expectEval: { expr: "\"'\" not in find_user_sql()", equals: true } },
          { label: "Filters by email", expectEval: { expr: "'email' in find_user_sql().lower() and 'where' in find_user_sql().lower()", equals: true } },
        ],
        hintTopic: "Just return the literal parameterized SQL — no f-strings, no quotes around the placeholder.",
      },
      {
        kind: "boss",
        title: "Boss — CRUD Suite",
        story:
          "Ship the full CRUD suite for a `posts` table.",
        challenge: {
          type: "code",
          brief:
            "Write `crud()` returning a dict with keys 'create','read','update','delete', each mapping to a parameterized SQL string on table `posts` with columns (id, title, body). Use $1, $2 placeholders. 'read' selects one row by id.",
          language: "python",
          starter:
            "def crud():\n    return {}\n",
          tests: [
            { label: "create uses INSERT", expectEval: { expr: "'INSERT' in crud()['create'].upper() and 'posts' in crud()['create']", equals: true } },
            { label: "read selects by id", expectEval: { expr: "'SELECT' in crud()['read'].upper() and '$1' in crud()['read']", equals: true } },
            { label: "update sets and filters", expectEval: { expr: "'UPDATE' in crud()['update'].upper() and 'SET' in crud()['update'].upper() and 'WHERE' in crud()['update'].upper()", equals: true } },
            { label: "delete filters by id", expectEval: { expr: "'DELETE' in crud()['delete'].upper() and '$1' in crud()['delete']", equals: true } },
          ],
          hintTopic: "Four SQL strings. Every user value is a $N placeholder.",
        },
      },
      {
        kind: "mastery",
        title: "Caverns mapped",
        summary: "You now speak SQL safely and shape CRUD APIs.",
        takeaways: [
          "CRUD = INSERT / SELECT / UPDATE / DELETE.",
          "Always parameterize — never concatenate user input.",
          "Indexes and primary keys make reads fast.",
        ],
        xpReward: 150,
        badgeSlug: "cavern-cartographer",
        badgeName: "Cavern Cartographer",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 7. FULL STACK CASTLE
  // ------------------------------------------------------------------
  {
    slug: "full-stack-castle",
    worldSlug: "web-developer-realm",
    title: "Full Stack Castle",
    subtitle: "React + API + Database, wired.",
    difficulty: 4,
    estMinutes: 18,
    xpBase: 200,
    topics: ["fullstack", "integration", "fetch", "state"],
    steps: [
      {
        kind: "intro",
        title: "One system, three layers",
        story:
          "The frontend calls the API. The API queries the database. The database returns rows. Rows become JSON becomes UI. Build the castle end to end.",
        visual: "gate",
      },
      {
        kind: "concept",
        title: "The request lifecycle",
        body:
          "User clicks → React fetches /api/posts → Express handler runs SELECT → Postgres returns rows → JSON flies back → React renders. Every full-stack bug is a mismatch somewhere on that path.",
        demo: {
          type: "code-trace",
          lines: [
            "// client",
            "const posts = await fetch('/api/posts').then(r => r.json());",
            "// server",
            "app.get('/api/posts', async (req, res) => {",
            "  const { rows } = await pg.query('SELECT id, title FROM posts');",
            "  res.json(rows);",
            "});",
          ],
          explain: [
            "Client asks for JSON.",
            "Server route handler runs the query.",
            "Postgres returns rows.",
            "Server serializes to JSON.",
            "Client renders the list.",
          ],
        },
      },
      {
        kind: "practice",
        title: "Where's the bug?",
        challenge: {
          type: "mcq",
          prompt:
            "Frontend shows [] but the DB has rows. Fetch returns 200. Where do you look FIRST?",
          options: [
            "Rewrite the React component",
            "Check the API handler's SQL and JSON shape",
            "Add more CSS",
            "Restart the whole computer",
          ],
          correctIndex: 1,
          explain:
            "Empty array from a 200 usually means the query returned nothing or the JSON shape is wrong — inspect the server response.",
        },
      },
      {
        kind: "code",
        title: "Wire fetch → render",
        brief:
          "Simulate the full stack. `db_rows` is given. Write `api()` that returns those rows. Write `render(rows)` that returns a list of titles. Then call `render(api())` and it must equal ['Hello','World'].",
        language: "python",
        starter:
          "db_rows = [{'id':1,'title':'Hello'},{'id':2,'title':'World'}]\n\ndef api():\n    pass\n\ndef render(rows):\n    pass\n\nprint(render(api()))\n",
        tests: [
          { label: "api returns db_rows", expectEval: { expr: "api() == db_rows", equals: true } },
          { label: "render projects titles", expectEval: { expr: "render([{'id':1,'title':'A'},{'id':2,'title':'B'}])", equals: ["A", "B"] } },
          { label: "End-to-end prints titles", expectExact: "['Hello', 'World']" },
        ],
        hintTopic: "api just returns db_rows. render does [r['title'] for r in rows].",
      },
      {
        kind: "boss",
        title: "Boss — Create Post Flow",
        story:
          "The user submits a form. Client → API → DB → response → UI update. Model it.",
        challenge: {
          type: "code",
          brief:
            "Write a class `App`: `db` is a list. `create_post(title)` appends {'id':len+1,'title':title} to db AND returns it. `list_posts()` returns db. Verify the round trip.",
          language: "python",
          starter:
            "class App:\n    def __init__(self):\n        self.db = []\n    def create_post(self, title):\n        pass\n    def list_posts(self):\n        pass\n",
          tests: [
            {
              label: "Create returns the row",
              expectEval: { expr: "App().create_post('hi')", equals: { id: 1, title: "hi" } },
            },
            {
              label: "Two creates get ids 1,2",
              expectEval: {
                expr: "(lambda a: (a.create_post('a'), a.create_post('b'))[1]['id'])(App())",
                equals: 2,
              },
            },
            {
              label: "list_posts reflects db",
              expectEval: {
                expr: "(lambda a: (a.create_post('x'), a.list_posts())[1])(App())",
                equals: [{ id: 1, title: "x" }],
              },
            },
          ],
          hintTopic: "Append then return the same dict. list_posts just returns self.db.",
        },
      },
      {
        kind: "mastery",
        title: "Castle built",
        summary: "You can now trace a request through every layer of a real web app.",
        takeaways: [
          "The stack is a pipeline — debug by inspecting each hop.",
          "JSON is the lingua franca between layers.",
          "State on the client should mirror server truth.",
        ],
        xpReward: 200,
        badgeSlug: "castellan",
        badgeName: "Castellan",
      },
    ],
  },

  // ------------------------------------------------------------------
  // 8. BOSS: BUILD & DEPLOY
  // ------------------------------------------------------------------
  {
    slug: "build-and-deploy",
    worldSlug: "web-developer-realm",
    title: "Boss — Build & Deploy",
    subtitle: "Ship a complete project to production.",
    difficulty: 5,
    estMinutes: 20,
    xpBase: 240,
    topics: ["deployment", "build", "ci", "production"],
    steps: [
      {
        kind: "intro",
        title: "Ship it",
        story:
          "The realm gathers. You've built every layer — now compile, bundle, and deploy. A live URL is the final proof.",
        visual: "terminal",
      },
      {
        kind: "concept",
        title: "Build → bundle → serve",
        body:
          "Modern web deploys: source → bundler (Vite) → static assets + server bundle → hosted at a URL. Env vars separate config from code. Health checks catch regressions.",
        demo: {
          type: "code-trace",
          lines: [
            "$ npm run build       # produces dist/",
            "$ npm run preview     # local prod check",
            "$ git push            # trigger CI/CD",
            "→ CI installs, builds, deploys",
            "→ live at https://your-app.example.com",
          ],
          explain: [
            "Bundle for production.",
            "Preview matches prod locally.",
            "Push triggers your CI.",
            "CI reproduces the build.",
            "The URL is your final artifact.",
          ],
        },
      },
      {
        kind: "practice",
        title: "Env or code?",
        challenge: {
          type: "mcq",
          prompt: "Where does your production DATABASE_URL belong?",
          options: [
            "Hard-coded in source",
            "Committed in .env",
            "Set as a secret in the hosting environment",
            "Pasted into README",
          ],
          correctIndex: 2,
          explain: "Secrets live in the host's env config — never in source or repos.",
        },
      },
      {
        kind: "code",
        title: "Deployment checklist",
        brief:
          "Write `ready_to_deploy(state)` where state is a dict of booleans: 'tests_pass','build_ok','env_set','healthcheck_ok'. Return True only if ALL are True. Any missing key counts as False.",
        language: "python",
        starter:
          "def ready_to_deploy(state):\n    pass\n",
        tests: [
          {
            label: "All green → True",
            expectEval: { expr: "ready_to_deploy({'tests_pass':True,'build_ok':True,'env_set':True,'healthcheck_ok':True})", equals: true },
          },
          {
            label: "One red → False",
            expectEval: { expr: "ready_to_deploy({'tests_pass':True,'build_ok':False,'env_set':True,'healthcheck_ok':True})", equals: false },
          },
          {
            label: "Missing key → False",
            expectEval: { expr: "ready_to_deploy({'tests_pass':True,'build_ok':True})", equals: false },
          },
          {
            label: "Empty state → False",
            expectEval: { expr: "ready_to_deploy({})", equals: false },
          },
        ],
        hintTopic: "Iterate the required keys; return False if any is missing or falsy.",
      },
      {
        kind: "boss",
        title: "Boss — Ship the Realm",
        story:
          "One command runs your full pipeline. Compose it.",
        challenge: {
          type: "code",
          brief:
            "Write `pipeline(steps)` — steps is a list of (name, ok) tuples. Return a dict {'ok': True if ALL ok else False, 'failed': [name for (name,ok) in steps if not ok]}. Order preserved.",
          language: "python",
          starter:
            "def pipeline(steps):\n    pass\n",
          tests: [
            {
              label: "All pass",
              expectEval: { expr: "pipeline([('lint',True),('test',True),('build',True)])", equals: { ok: true, failed: [] } },
            },
            {
              label: "One fails",
              expectEval: { expr: "pipeline([('lint',True),('test',False),('build',True)])", equals: { ok: false, failed: ["test"] } },
            },
            {
              label: "Preserves order of failures",
              expectEval: { expr: "pipeline([('a',False),('b',True),('c',False)])['failed']", equals: ["a", "c"] },
            },
          ],
          hintTopic: "One list comprehension for failed; ok is `not failed`.",
        },
      },
      {
        kind: "mastery",
        title: "Certified Web Developer",
        summary:
          "You have built and shipped every layer of a modern web application. The Web Developer Realm bows to you — a completion certificate is now yours.",
        takeaways: [
          "HTML gives meaning, CSS gives shape, JS gives life.",
          "React composes UI; Node serves; SQL persists.",
          "Deploy = reproducible build + secrets + health checks.",
          "You can now design, build, and ship a real product.",
        ],
        xpReward: 240,
        badgeSlug: "web-developer-realm-master",
        badgeName: "Web Developer Realm Master",
      },
    ],
  },
];
