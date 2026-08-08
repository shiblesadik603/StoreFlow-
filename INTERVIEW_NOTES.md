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

*(Session 3 notes will be appended below this line.)*
