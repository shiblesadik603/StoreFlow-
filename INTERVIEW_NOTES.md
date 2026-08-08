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

*(Session 2 notes will be appended below this line.)*
