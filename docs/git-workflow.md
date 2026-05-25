# Git Workflow — How to Work on This Repo

This guide covers everything you need to know to work on the SKC design spec
without breaking anything. The golden rule is simple: **`main` is always clean
and working.** That's it. Everything else follows from that.

---

## Why this matters

The `main` branch is published live on GitHub Pages. That means whenever you
(or anyone) looks at the demo online, they're seeing exactly what's on `main`.
If you push broken or half-finished work there, the demo breaks for everyone —
including the engineer who uses this repo as their source of truth for what to
build.

The solution is branches. You do all your work on your own branch — a separate
copy that doesn't affect anyone else. When it's finished and looking good, you
merge it into `main`. Until then, `main` stays clean.

---

## The mental model

Think of the repo like a Google Doc with a strict rule: the published version
is always the polished one. You write your draft in a separate document, and
only copy it over when it's ready.

```
main          ← the live demo. Always works. Never touch directly.
  │
  ├── feature/new-onboarding-screen    ← your branch. Messy is fine here.
  ├── feature/update-labor-numbers     ← another branch for another task.
  └── feature/menu-screen-redesign     ← etc.
```

---

## One-time setup

You only do this once on a new machine.

**1. Make sure Git knows who you are:**
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```

**2. Clone the repo (download it to your computer):**
```bash
git clone https://github.com/YOUR-ORG/streamlinekitchenco-design-spec.git
cd streamlinekitchenco-design-spec
```

Replace `YOUR-ORG` with the actual GitHub organization or username. Once this
is done you have a local copy of the whole repo on your machine.

---

## The everyday workflow

Every time you sit down to work on something new, follow these steps in order.

### Step 1 — Make sure you're starting from the latest `main`

Before creating a branch, pull down any changes others have made since you last
worked:

```bash
git checkout main
git pull
```

`git checkout main` switches you to the `main` branch.
`git pull` downloads the latest version from GitHub.

> If you skip this step, your branch might be missing recent changes and you'll
> have a harder time merging later.

---

### Step 2 — Create your branch

Pick a short, descriptive name that says what you're working on. Always prefix
it with `feature/`:

```bash
git checkout -b feature/your-branch-name
```

Examples:
```bash
git checkout -b feature/update-menu-numbers
git checkout -b feature/new-table-turns-subpage
git checkout -b feature/fix-labor-screen-copy
```

The `-b` flag means "create this branch and switch to it." You're now on your
own branch and nothing you do will affect `main`.

---

### Step 3 — Do your work

Open the files in VS Code (or whatever editor you use) and make your changes.
Work at whatever pace you like — save often, experiment freely. Nothing here
affects `main`.

Run the local server to check your work in the browser:
```bash
python3 -m http.server 8000
```
Then open `http://localhost:8000`.

---

### Step 4 — Save your progress to Git (commit)

Once you've made a meaningful chunk of progress — finished a screen, updated a
set of numbers, changed a section of copy — save it with a commit.

**Check what you've changed:**
```bash
git status
```
This shows a list of files you've modified. Nothing is saved to Git yet.

**Stage the files you want to save:**
```bash
git add filename.html
git add shared/core.js
```

Or if you want to add everything you changed at once:
```bash
git add .
```

**Commit with a message describing what you did:**
```bash
git commit -m "Update labor numbers for Oakland Tuesday Dinner"
```

Write the message in plain English. Future-you (and Brandon) will thank you.
Good messages say *what changed and why*, not just "edits" or "updates."

---

### Step 5 — Push your branch to GitHub

Pushing uploads your branch (and all its commits) to GitHub so others can see
it and so it's backed up. Do this regularly — at minimum at the end of every
work session.

**First time pushing a new branch:**
```bash
git push -u origin feature/your-branch-name
```

The `-u origin feature/your-branch-name` tells GitHub "this is the branch on
GitHub that matches my local branch." You only need the `-u` flag the first
time.

**Every push after that:**
```bash
git push
```

That's it. Git remembers where to send it.

---

### Step 6 — Merge into `main` when it's ready

When your work is finished, tested in the browser, and looks good, it's time
to merge it into `main`.

```bash
git checkout main
git pull
git merge feature/your-branch-name
git push
```

What each line does:
1. `git checkout main` — switch back to the main branch.
2. `git pull` — grab any new changes others pushed while you were working.
3. `git merge feature/your-branch-name` — bring your work into `main`.
4. `git push` — publish the updated `main` to GitHub (and therefore to the
   live demo).

---

### Step 7 — Clean up the old branch (optional but tidy)

Once merged, the feature branch has done its job. Delete it to keep things
clean:

```bash
git branch -d feature/your-branch-name
```

On GitHub (to delete the remote copy):
```bash
git push origin --delete feature/your-branch-name
```

---

## Quick reference — the commands you'll use most

| What you want to do | Command |
|---|---|
| See what branch you're on | `git status` |
| List all your local branches | `git branch` |
| Switch to an existing branch | `git checkout branch-name` |
| Create a new branch and switch to it | `git checkout -b feature/name` |
| Pull the latest changes from GitHub | `git pull` |
| See what files you've changed | `git status` |
| Stage all changed files | `git add .` |
| Stage one specific file | `git add filename.html` |
| Commit staged files | `git commit -m "Your message here"` |
| Push your branch to GitHub | `git push` (or `git push -u origin branch-name` first time) |
| Merge your branch into main | See Step 6 above |

---

## Things to never do

- **Never commit directly to `main`.**
  Always create a branch first. The only time you touch `main` directly is
  `git pull` to update it.

- **Never force-push (`git push --force`).**
  This can overwrite other people's work. If Git is refusing to push and
  suggesting a force-push, stop and ask Brandon what's going on.

- **Don't push half-finished work to `main`.**
  Half-finished is fine on a feature branch. `main` is always the complete,
  working version.

---

## If something goes wrong

**You accidentally started editing on `main`:**
Don't panic — your changes aren't lost. Create a branch right now:
```bash
git checkout -b feature/save-my-accidental-edits
git add .
git commit -m "WIP: save changes accidentally made on main"
git push -u origin feature/save-my-accidental-edits
```
Then go back to main and undo your changes there:
```bash
git checkout main
git restore .
```

**You're not sure what branch you're on:**
```bash
git status
```
The first line always tells you: `On branch main` or `On branch feature/...`

**You want to see all your branches:**
```bash
git branch
```
The one with a `*` next to it is the one you're currently on.

**Git is complaining about "merge conflicts":**
This means two branches changed the same part of the same file. It's not an
emergency but it does need manual resolution. Ask Brandon to walk through it
with you the first time — it's easy once you've seen it once.

---

## The one-sentence summary

Work on a feature branch, keep `main` clean, merge when it's done.
