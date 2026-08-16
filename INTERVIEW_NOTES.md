# StoreFlow Backend Journey — Interview & Revision Notes

> Personal revision notes, appended after every mentoring session. This is a study aid for interview prep and quick recall — not project documentation (that's what the README is for).

---

## Session 1 — 2026-08-08

### Topics covered
- JavaScript variable declarations: `let`, `const`, `var`
- JavaScript functions: declarations, expressions, arrow functions
- Node.js runtime vs. compiled languages (C/C++)
- npm & `package.json`
- Git fundamentals: init, staging, commits, `.gitignore`
- Git remotes & GitHub: push, SSH vs HTTPS auth

### Key concepts (quick recall)

**let / const / var**

| Keyword | Reassignable | Scope | Use |
|---|---|---|---|
| const | No | block | default choice |
| let | Yes | block | value will change |
| var | Yes | function (dangerous — leaks out of blocks) | never use |

- `const x = 5; x = 10;` → `TypeError: Assignment to constant variable.`
- `var` declared inside an `if` block is still visible *outside* it (function-scoped) — classic bug source.

**Functions as values**
```js
function add(a, b) { return a + b; }          // declaration
const add2 = function(a, b) { return a+b; };  // expression (anonymous)
const add3 = (a, b) => { return a+b; };       // arrow
const add4 = (a, b) => a + b;                 // arrow, implicit return
```
- JS functions can be stored in variables and passed as arguments — this is *why* Express route handlers look like `app.get('/x', (req,res) => {...})`.
- Calling a function with fewer args than declared → missing params become `undefined`, NOT an error. `"Hello " + undefined` → `"Hello undefined"`.

**Node.js & npm**
- Node = the V8 JS engine running outside the browser. No separate compile step — JS is read and executed line-by-line (interpreted), unlike C which needs `gcc` ahead of time.
- `package.json` = project manifest (name, version, dependencies, `scripts`).
- `"main": "index.js"` → entry point. `"type": "commonjs"` → use `require()`, not `import`.
- `node_modules` = downloaded dependencies. Never commit it — huge, and 100% regenerable via `npm install`.
- `npm init -y` does **not** create a `start` script by default — only `test`. Confirmed live: running `npm start` gave "Missing script: start".

**Git — three-stage model**

Working directory → (`git add`) → Staging area → (`git commit`) → Commit history

- `git init` creates a hidden `.git` folder — the entire history database. Doesn't track anything automatically; it just installs the capability.
- Staging lets you commit only *finished* work, leaving unfinished changes out of the snapshot.
- `git add .` stages everything; `git add <file>` stages just one file.
- Good commit messages: imperative tense, `feat:`/`fix:`/`chore:` prefix, describe *what* changed and why if not obvious.
- Atomic commits: don't bundle unrelated concerns — "project setup" and "new feature" should be 2 commits, not 1.
- `.gitignore` — files that should never be tracked (`.DS_Store` = macOS-only junk; `node_modules` = regenerable bloat). A file already tracked needs one manual `git rm --cached <file>`, in addition to adding it to `.gitignore` (ignoring only prevents *future* staging).

**Git remotes & push**
- `git commit` only saves locally. `git push` uploads commits to a remote (e.g. GitHub). Until you push, a dead laptop = lost work.
- `origin` = conventional nickname for your main remote, not a required keyword.
- `git push -u origin main` sets up tracking so future pushes just need `git push`.
- SSH vs HTTPS remotes need different auth: SSH needs a locally-configured SSH key (`Permission denied (publickey)` if missing); HTTPS can ride on `gh` CLI's stored credentials — check `gh auth status` and look at "Git operations protocol".
- Fix a wrong remote URL with `git remote set-url origin <new-url>` — no need to remove and re-add.

### Interview Q&A (own words)

**Q: Difference between let, const, var?**
A: `let`/`const` are block-scoped, `var` is function-scoped (leaks out of `if`/`for` blocks — a bug source). `const` can't be reassigned after declaration; `let` and `var` can. Teams ban `var` because of unpredictable scoping bugs.

**Q: Why do JS functions matter as "values"?**
A: You can store them in variables and pass them into other functions/APIs — this is how Express route handlers and middleware work: you literally hand a function to `app.get()` to be run later, by something else.

**Q: What's package.json for — why not let npm just scan the folder?**
A: It's the manifest — declares exact dependencies, entry point, and scripts (`npm start`). Without it, npm wouldn't know which packages are actually required vs. just lying around, or what command to run.

**Q: Explain git's three-stage model.**
A: Working directory (files as edited) → staging area (a chosen subset, via `git add`) → commit history (a permanent snapshot, via `git commit`). Staging exists so you can commit only finished, related changes instead of everything you've touched.

**Q: Difference between commit and push? What happens if you never push?**
A: Commit saves a snapshot locally. Push uploads commits to a remote server (GitHub). If you never push, your work only exists on your machine — a lost laptop means lost work, and nobody else (teammates, or an interviewer looking at your GitHub) can see it.

### Mistakes I made (worth remembering)
- Left multi-part questions half-answered on the first attempt (e.g. gave the `let` version but skipped what happens with `const` reassignment).
- Named an arrow function parameter `name` but used `n` inside the body — parameter/body naming mismatch.
- Predicted `greet()` with no args would print "Hello name" — wrong; missing args become `undefined`, giving "Hello undefined".
- Accidentally staged `.DS_Store` before setting up `.gitignore`.
- Tried to push over SSH with no SSH key configured on this machine — had to switch the remote to HTTPS to match `gh`'s stored auth.

---

## Session 2 — 2026-08-08

### Topics covered
- Writing your own Node modules (`module.exports`, `require('./file')`)
- Synchronous vs asynchronous execution — the event loop, `setTimeout`
- Real debugging: unsaved file causing "X is not a function"

### Key concepts (quick recall)

**Your own modules**
```js
// math.js
function add(a, b) { return a + b; }
module.exports = add;               // single export

// or, multiple exports:
module.exports = { add, subtract }; // shorthand property syntax for { add: add, subtract: subtract }
```
```js
// index.js
const add = require('./math');      // './' = local file, no built-in/npm package
console.log(add(2, 3));             // 5
```
- Only what's assigned to `module.exports` is visible outside the file — everything else stays private (like a function with no header declaration in C).
- `require('./math')` works without `.js` — Node automatically assumes the `.js` extension for local file requires.
- `require('./math')` (relative path) = local file. `require('express')` (bare name) = built-in or installed npm package from `node_modules`.

**Debugging reminder:** "TypeError: X is not a function" right after a fresh `require` often means either (a) you forgot `module.exports`, or (b) **you didn't save the file** — Node reads what's on disk, not your editor's unsaved buffer. Check both.

**Synchronous vs asynchronous / the event loop**
```js
console.log("Start");
setTimeout(() => console.log("Async task done"), 2000);
console.log("End");
// Output: Start, End, (2s later) Async task done
```
- `setTimeout(fn, ms)` does NOT pause execution — it schedules `fn` for later and immediately continues to the next line ("drop a letter in a mailbox and walk away — don't stand there waiting for it to be delivered").
- Contrast with C's blocking `sleep()`: in blocking code, later statements must wait their turn, so a delayed print happens *before* whatever comes after it in the file. In JS's non-blocking model, the delayed print happens *after* everything already scheduled to run synchronously — non-blocking code lets later statements "jump ahead" of anything still waiting.
- This is *why* one Node server can serve thousands of concurrent requests without one slow database query freezing everything else: while one request waits on I/O, Node moves on and serves others.

### Interview Q&A (own words)

**Q: Why does a Node file need `module.exports`? What happens if you forget it?**
A: It tells Node what to expose to other files. Forgetting it means nothing is shared — a file trying to `require()` this one gets nothing usable, leading to "X is not a function" errors.

**Q: Difference between `require('./math')` and `require('express')`?**
A: `./math` loads a local file relative to the current file. `express` (no relative path) loads an installed npm package from `node_modules` (or a Node built-in if no package exists).

**Q: Why doesn't `setTimeout` freeze the program?**
A: It schedules the callback and returns control immediately — like dropping a letter in a mailbox and walking away rather than standing there waiting for delivery. The rest of the synchronous code keeps running; the callback fires later once its timer is up and the call stack is clear.

**Q: Why does this matter for a server vs. a single-user CLI program?**
A: A server juggles many users at once. If every request blocked until finished (like C's blocking I/O), one slow request would freeze everyone else's. Non-blocking async lets Node work on other requests while one waits on a timer/file/database, keeping the server responsive under load.

### Mistakes I made (worth remembering)
- Tested `require('./math')` before actually saving `math.js` — got `TypeError: add is not a function` purely because the file on disk was still stale. Lesson: when behavior doesn't match what's in the editor, check whether the file is actually saved first.
- On the sync-vs-async trace, kept comparing only 2 of the 3 relevant print statements (dropped "Async task done" from the C blocking trace) until walking through it line-by-line — worth fully re-deriving a trace instead of pattern-matching against a previous answer.

---

## Session 3 — 2026-08-08

### Topics covered
- Promises (`new Promise`, `resolve`/`reject`, `.then()`/`.catch()`)
- `async`/`await` as syntax sugar over Promises
- **Week 1 complete** — next up: Express (Week 2)

### Key concepts (quick recall)

**Promises**
```js
function wait(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve("Done waiting!"), ms);
  });
}

wait(2000).then((message) => console.log(message));
```
- Calling a function that returns a Promise gives you the Promise object *immediately* — not the eventual value. The promise starts `pending`, then settles as `fulfilled` (via `resolve(value)`) or `rejected` (via `reject(error)`).
- `.then(value => ...)` runs on fulfillment; `.catch(err => ...)` runs on rejection.
- If neither `resolve()` nor `reject()` is ever called, the promise stays `pending` forever — `.then()`/`.catch()` never fire.
- Promises exist to avoid **callback hell** — deeply nested callbacks that get unreadable once you chain several async steps.

**async/await — built on top of Promises, not a separate mechanism**
```js
async function main() {
  try {
    const user = await fetchUserData(5);
    console.log(user);
  } catch (error) {
    console.log(error.message);
  }
}
main();
```
- `async function` always returns a Promise and unlocks `await` inside it.
- `await someExpression` pauses *only that function* until the promise settles, then gives you the resolved value directly — the rest of the program (other functions, other requests) keeps running.
- A rejected `await` is thrown as a regular error — that's why you use `try/catch` instead of `.catch()`.
- `await` cannot be used inside a non-`async` function (syntax error).
- Since it's the same mechanism underneath, `.then()` and `await` *can* be mixed in one codebase, but pick one style (prefer `async`/`await`) for consistency.

**Why this matters for Express (coming next):** route handlers that query a database are marked `async` so you can `await` the query — the handler pauses without blocking the whole server, so other users' requests keep being served in the meantime.

### Interview Q&A (own words)

**Q: What problem do Promises solve that raw callbacks don't?**
A: They make async code easier to read, chain, and handle errors for — avoiding "callback hell" (deeply nested callbacks) when you have multiple async steps in sequence.

**Q: Is async/await separate from Promises?**
A: No — it's built directly on top of Promises, just cleaner syntax. Since it's the same mechanism, `.then()` and `await` can technically be mixed, but it's better to pick one style consistently.

**Q: Why try/catch instead of .catch() with await?**
A: A rejected promise under `await` is thrown as a regular error, so `try/catch` is the natural way to catch it — `.catch()` is the `.then()`-chain equivalent.

**Q: Why mark a database-querying Express route handler async?**
A: The query returns a Promise; `async` unlocks `await` so the code reads top-to-bottom instead of nesting `.then()`s, while the server keeps handling other requests during the wait instead of blocking.

### Mistakes I made (worth remembering)
- None major this session — Promise creation, resolve/reject logic, and the async/await rewrite were all correct on the first real attempt. Debugging skill from Session 2 (checking the actual top-of-error message, not just the generic stack trace tail) is starting to transfer.

---

## Session 4 — 2026-08-12

### Topics covered
- Express basics: `app.get()`, route handlers, `res.send()` vs `res.json()`
- Route parameters (`req.params`) and manual type conversion
- HTTP status codes (`res.status(code)`) and why they matter beyond the response body
- **Week 2 (Express) started**

### Key concepts (quick recall)

**Minimal Express server**
```js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

app.get('/products', (req, res) => {
  res.json([{ id: 1, name: 'laptop', price: 1200 }]);
});

app.listen(3000, () => console.log('Server running on port 3000'));
```
- Express sits on top of Node's raw `http` module — it gives you routing (`app.get/post/put/delete`), simplified `req`/`res` objects, and middleware support, so you don't manually parse URLs/methods for every route.
- `app.listen()` keeps the process running indefinitely (unlike earlier scripts that ran once and exited) — stop it with `Ctrl+C`.
- `res.send(data)` sends any type (text/HTML/object). `res.json(data)` specifically serializes to JSON and sets the `Content-Type: application/json` header — use this for APIs.

**Route parameters**
```js
app.get('/products/:id', (req, res) => {
  const id = Number(req.params.id);          // req.params.id is ALWAYS a string
  const product = products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ message: "product not found." });
  }
  res.json(product);
});
```
- `:id` in a path is a placeholder; the actual URL segment lands in `req.params.id` — always as a **string**, regardless of what it looks like.
- Comparing directly (`req.params.id === product.id`) silently fails: `"1" === 1` is `false` under JS's strict equality (type AND value must match). Must convert first: `Number(req.params.id)`.
- Multiple params are allowed: `/products/:category/:id` → `req.params` = `{ category: "...", id: "..." }`, both strings.

**Status codes matter independently of the JSON body**
- `res.status(404).json({...})` sets the actual HTTP status line (verified for real with `curl -i` — confirmed `200 OK` for a found product, `404 Not Found` for both a missing numeric id and a non-numeric id like `"electronics"`).
- Clients (browsers, frontend `fetch`, other APIs) check the **status code** to decide success/failure programmatically — the JSON body is just extra detail for logging/display. A `200` with `{"error": "not found"}` in the body would mislead client code that only checks `response.ok`.
- A non-numeric id like `/products/electronics` doesn't crash — `Number("electronics")` is `NaN`, and `NaN === anything` is always `false`, so it naturally falls into the same "not found" branch.

### Interview Q&A (own words)

**Q: What does Express add on top of Node's http module?**
A: Easy routing (`app.get()`, etc.), simplified `req`/`res` handling, middleware support, and convenience methods like `res.json()` — without it you'd manually parse URLs/methods and format every response by hand.

**Q: Why convert `req.params.id` with `Number()`?**
A: URL segments are always strings. Product ids are numbers. `1 === "1"` is `false` under strict equality (type must match too), so comparing without converting first would never find a match even for valid ids.

**Q: Why does the status code matter if the JSON body already explains the error?**
A: Status codes are what client programs (browsers, `fetch`, other servers) check programmatically to know success/failure. The JSON body is extra detail for humans/logging — a wrong status code (e.g. `200` on an error) can mislead client logic that only checks `response.ok`.

**Q: Difference between res.send() and res.json()?**
A: `res.send()` sends whatever you give it (text, HTML, buffer, object). `res.json()` is specifically for JSON — it serializes the value and sets the correct `Content-Type` header automatically.

### Mistakes I made (worth remembering)
- None on the core logic this session — Promise → async/await → Express carried over cleanly. The only gap was answering only half of a two-part question (explained *why* `req.params.id` is a string, initially skipped *what breaks* if you don't convert it) — same "finish both halves" pattern as earlier sessions, worth staying alert to on future two-part questions.

---

## Session 5 — 2026-08-12

### Topics covered
- Express middleware: `app.use()`, custom middleware functions, the `next` parameter
- `express.json()` for parsing request bodies
- `POST` route with validation, `201 Created`
- Real bug: confused `400` vs `404` on the not-found case — caught and fixed

### Key concepts (quick recall)

**Middleware signature and registration**
```js
function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next(); // MUST call this or the request hangs forever
}

app.use(logger);              // runs before every route registered AFTER this line
app.use(express.json());      // built-in middleware — parses JSON body into req.body
```
- Middleware takes **three** params: `(req, res, next)` — the extra `next` is what separates it from a route handler.
- Forgetting `next()` (and not sending a response) makes the request hang forever — Express just keeps waiting.
- **Order matters.** Express runs middleware/routes top-to-bottom in registration order. Middleware placed *after* a route that already sent a response never runs for that route.

**POST with validation**
```js
app.post('/products', (req, res) => {
  const { name, price } = req.body;
  if (!name || typeof price !== "number" || price <= 0) {
    return res.status(400).json({ message: "Invalid name or price!" });
  }
  const newProduct = { id: products.length + 1, name, price };
  products.push(newProduct);
  res.status(201).json(newProduct);
});
```
- `express.json()` is needed for `POST`/`PUT` because they carry a request body that needs parsing into `req.body`. `GET` requests don't typically have a body — they get data from `req.params`/`req.query` instead.
- `201 Created` is the correct status for a successful resource creation (not `200`).

**400 vs 404 — real bug caught this session**
- `400 Bad Request` = the client's request itself is malformed (missing/invalid fields in the body). Example: `POST /products` with no `price`.
- `404 Not Found` = the request was well-formed, but the specific resource doesn't exist. Example: `GET /products/999`.
- Accidentally wrote `400` for the not-found case in `GET /products/:id` (a regression from Session 4's correct `404`) — caught via review, fixed, and re-verified for real with `curl -i` rather than trusting the code by eye.

### Interview Q&A (own words)

**Q: What is `next` for, and what happens if you forget it?**
A: `next()` passes control to the next middleware or route handler in the chain. Without calling it (and without sending a response), the request just hangs — Express keeps waiting indefinitely.

**Q: Why does middleware/route order matter?**
A: Express executes them top-to-bottom in registration order. Middleware placed after a route that already responded won't run for that route's requests.

**Q: Difference between 400 and 404?**
A: `400` = the client sent invalid data (e.g. missing `price` in a `POST` body). `404` = the request was valid, but the requested resource doesn't exist (e.g. `GET /products/999`).

**Q: Why does `express.json()` matter for POST/PUT but not GET?**
A: POST/PUT typically send a JSON body that needs parsing into `req.body`. GET requests get their data from the URL (`req.params`) or query string (`req.query`), not a body.

### Mistakes I made (worth remembering)
- Wrote `res.status(400)` for a not-found case that should have been `404` — a real regression from a previous session's correct code, not a new concept misunderstanding. Lesson: when rewriting/consolidating code across sessions, re-verify old correct behavior didn't silently change, don't just trust that "it looks the same."
- On the first verification request, pasted a repeat of an earlier `POST` `curl` output instead of running the actual `GET /products/999` command asked for — worth double-checking which command is actually being run before pasting terminal output.

---

## Session 6 — 2026-08-16

### Topics covered
- `PUT` and `DELETE` routes — completing CRUD
- Object references vs. primitives (mutating via `.find()`'s returned reference)
- Error-handling middleware (4-param signature), sync vs. async error catching
- Real debugging: a stale server process silently serving old code

### Key concepts (quick recall)

**PUT / DELETE**
```js
app.put('/products/:id', (req, res) => {
  const product = products.find(p => p.id === Number(req.params.id));
  if (!product) return res.status(404).json({ message: "product not found." });
  const { name, price } = req.body;
  if (!name || typeof price !== "number" || price <= 0) {
    return res.status(400).json({ message: "Invalid name or price!" });
  }
  product.name = name;      // mutates the ACTUAL array entry — see below
  product.price = price;
  res.json(product);
});

app.delete('/products/:id', (req, res) => {
  const index = products.findIndex(p => p.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: "product not found." });
  products.splice(index, 1);
  res.status(204).send();   // success, no body
});
```
- `.findIndex()` returns a position (needed for `.splice()`); `.find()` returns the object itself — can't `.splice()` with an object.
- `204 No Content` = success with no response body — the right fit for `DELETE`.
- **Objects are held by reference in JS.** `const product = products.find(...)` gives you a reference to the *actual* object sitting inside the array — mutating `product.name` mutates the array entry directly, no reassignment needed. (Primitives like numbers/strings are copied by value, not reference — this only applies to objects/arrays.)

**Error-handling middleware**
```js
app.use((err, req, res, next) => {   // exactly 4 params — how Express recognizes it
  console.error(err.message);
  res.status(500).json({ message: "Internal server error!" });
});                                    // MUST be registered LAST, after all routes
```
- The four-parameter signature `(err, req, res, next)` is specifically how Express distinguishes error-handling middleware from regular middleware — must be registered after every route so it can catch what bubbles up from them.
- **Express 5** (confirmed via `npm list express` → `express@5.2.1` in this project) automatically forwards errors thrown in `async` route handlers (including rejected `await`s) to error-handling middleware — no manual `try/catch` + `next(err)` required. (Express 4 does NOT do this automatically — would need manual catching there.)
- Verified live: both a synchronous `throw` and an `await Promise.reject(...)` inside an `async` handler were both correctly caught, returned `500`, and — critically — the server kept running and served `/products` normally afterward. A crashing route doesn't have to crash the whole process.

**Real debugging: stale process on a port**
- `curl -i` only shows what a server *responds* — it can never tell you *which* process/code is actually answering.
- After fixing real code bugs (missing leading `/` in a route path, a `returnres` typo), `curl` kept returning the *same* stale errors — a strong signal the code fix never actually took effect.
- `lsof -i :3000` revealed an old `node` process still bound to port 3000 from earlier in the session — it had been silently answering every request the whole time, regardless of any file edits. Killing it (`kill <PID>`) and restarting fresh fixed it immediately.
- **Lesson:** if a fix "doesn't work" but the error is byte-for-byte identical before and after the fix, suspect you're not actually talking to your new code at all — check what's really running before re-reading your own logic for the tenth time.

### Interview Q&A (own words)

**Q: findIndex()+splice() vs find() for DELETE?**
A: `findIndex()` gives a position, which `.splice()` needs to remove an item. `.find()` only returns the object itself, not a usable position.

**Q: What does the 4-param `(err, req, res, next)` signature mean, and why last?**
A: That exact shape is how Express recognizes error-handling middleware. It's registered last so it can catch errors bubbling up from every route defined above it.

**Q: Why doesn't a thrown error in an async Express 5 route crash the server?**
A: Express 5 automatically catches rejected promises/thrown errors in async handlers and routes them to error-handling middleware instead of letting them propagate as an unhandled crash.

**Q: What was the real root cause of the PUT/DELETE 404s, and what command found it?**
A: The route code had bugs initially (missing leading slash, a typo), but after fixing those, the exact same errors persisted — because a stale `node` process from earlier in the session was still bound to port 3000, silently serving old code regardless of file edits. `lsof -i :3000` revealed the stray process (`curl -i` never could, since it only shows what a server responds, not which process is actually listening).

### Mistakes I made (worth remembering)
- Missing leading `/` on a route path (`'products/:id'` instead of `'/products/:id'`) — Express silently never registers it as a match; no error at startup, just a 404 at request time.
- `returnres.status(...)` — a merged typo (`return res` → `returnres`), parsed as a reference to an undefined variable rather than a syntax error, so it only surfaces at runtime when that code path actually executes.
- Left a stale `node server.js` process running from earlier in the session on port 3000 — every code fix appeared to silently fail because `curl` was hitting the old process the whole time. Took three rounds of "still broken" before checking `lsof -i :3000` instead of re-reading the code again.
- On the closing interview question about this exact bug, initially recalled and re-explained the *previous session's* 400-vs-404 bug instead — needed the full timeline restated before correctly identifying the stale-process root cause.

---

*(Session 7 notes will be appended below this line.)*
