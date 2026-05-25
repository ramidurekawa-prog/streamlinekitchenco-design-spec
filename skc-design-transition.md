# SKC Design Spec — Refactor & Collaboration Plan

**Owner:** Ramidu (design)
**Audience:** Claude Code (for the refactor work) and the SKC engineering partner (for ongoing collaboration)
**Source artifact:** `skc-demo-v30b-tooltips-floating.html` (~31,093 lines, single file)
**Target artifact:** A folder-structured design spec repo, hosted on GitHub, that the engineering partner consumes as the reference for the Next.js implementation.

---

## 1. Why this refactor exists

The current demo is one HTML file at ~31,000 lines. It works, it's internally consistent after the v29 audit fixes, and it's the canonical visual spec for the SKC platform. But three things make it expensive to keep iterating on as a single file:

- **AI-assisted edits get costly.** Every Claude Code session that reads the file pays the token cost of loading 31k lines. A handful of design iterations per week adds up fast.
- **Slow tool operations.** `view`, `str_replace`, and full-file rewrites on a file this size are noticeably slower than on smaller files, which compounds across sessions.
- **Concentration risk.** Bad edits affect the whole demo. There's no isolation between features. A regression in Server Coaching could break Labor Efficiency.

The refactor splits the single file into per-feature files plus a shared assets folder. The visible behavior of the demo stays identical. Only the file layout changes.

Separately from the refactor, the same repo doubles as the **design spec for the engineering partner**. He builds in Next.js. The HTML is the visual and interaction reference that drives his implementation, versioned in git so changes are reviewable.

---

## 2. Target folder structure

```
skc-design/
├── README.md                       # repo-level overview for the engineer
├── index.html                      # main shell: doctype, sidebar, topbar, screen container
├── /screens/                       # one file per screen
│   ├── today.html                  # screen-home (~620 lines incl. wrappers)
│   ├── profit-recovery.html        # screen-leaks (~563 lines)
│   ├── actions.html                # screen-actions (~912 lines, has 7 subpages)
│   ├── action-detail.html          # screen-action-detail (~142 lines)
│   ├── recovery-detail.html        # screen-recovery-detail (~161 lines)
│   ├── labor-efficiency.html       # screen-labor-efficiency (~1,323 lines, 6 subpages)
│   ├── roi-proof.html              # screen-scorecard (~726 lines)
│   ├── reports.html                # screen-reports (~355 lines)
│   ├── operating-system.html       # screen-operating-system (~816 lines)
│   ├── settings.html               # screen-settings (~604 lines)
│   ├── menu-optimization.html      # screen-menu (~763 lines, 7 subpages)
│   ├── kitchen-speed.html          # screen-throughput (~392 lines)
│   └── table-turns.html            # screen-table-turns (~966 lines, 5 subpages)
├── /shared/                        # shared assets used across all screens
│   ├── styles.css                  # all CSS from the original 5 <style> blocks (~9,400 lines)
│   ├── core.js                     # core platform JS: showScreen, theme, ask panel, etc.
│   ├── controllers.js              # per-feature subpage controllers (menu, actions, labor, tt)
│   ├── data.js                     # demo data fixtures (MENU_DATA, LE_CO_SERVERS, etc.)
│   ├── tooltips.js                 # the v30b floating tooltip system
│   └── server-coaching.js          # the 3-axis radar + classifyPattern logic
├── /components/                    # reusable structural pieces
│   ├── sidebar.html                # left nav
│   ├── topbar.html                 # top utility bar
│   ├── ask-panel.html              # Ask SKC slide-in panel
│   └── drawers.html                # the 7+ drawer markup blocks (CA modal, evidence, etc.)
├── /docs/                          # written design rationale + handoff notes
│   ├── doctrine.md                 # the [ESTIMATED] → [VERIFIED] state model
│   ├── canonical-numbers.md        # the invariants (labor $370/wk, TT ~$680/wk, etc.)
│   ├── data-sources.md             # what comes from Toast, what's user-provided
│   └── handoff-notes/              # per-version handoff write-ups (v32, v33, etc.)
└── CHANGELOG.md                    # high-level version history
```

### Why this structure

- **One file per screen** matches how a human thinks about the platform. "I want to edit Labor Efficiency" → open one file.
- **Shared CSS/JS in `/shared/`** because almost everything is shared. Per-screen JS would force duplication and divergence.
- **`/components/` for structural reusables** that appear on every screen (sidebar, topbar, drawers). These get pulled into every screen via the same mechanism that pulls screens into `index.html`.
- **`/docs/` for written rationale** so the engineering partner doesn't have to guess at intent. The doctrine, canonical numbers, and data-source documentation all live here.

### File size after split (approximate)

| File | Approx lines |
|---|---|
| `index.html` (shell + screen container) | ~150 |
| `/screens/*.html` (each) | 140 – 1,400 |
| `/shared/styles.css` | ~9,400 |
| `/shared/core.js` | ~2,000 |
| `/shared/controllers.js` | ~4,500 |
| `/shared/data.js` | ~800 |
| `/shared/tooltips.js` | ~60 |
| `/shared/server-coaching.js` | ~250 |
| `/components/*.html` (each) | 30 – 250 |

Largest individual file in the new structure is `styles.css` at ~9,400 lines, which is still a third of the current single-file size and is far cheaper to read than HTML+CSS+JS interleaved. Most editing sessions will touch one screen file (≤1,400 lines) plus maybe one shared file. Per-session token cost drops by roughly 70-85%.

---

## 3. The loading mechanism

The screens are composed at runtime via a small loader, not at build time. This keeps the workflow simple: edit a file, refresh the browser, see the change. No build step, no bundler, no npm.

### `index.html` structure

```html
<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="UTF-8">
  <title>SKC Demo</title>
  <link rel="stylesheet" href="shared/styles.css">
</head>
<body>
  <div id="app">
    <!-- Sidebar, topbar, ask panel inject here -->
    <div id="layout-sidebar"></div>
    <div id="layout-main">
      <div id="layout-topbar"></div>
      <div id="screen-container"></div>
    </div>
    <div id="layout-drawers"></div>
    <div id="layout-ask-panel"></div>
  </div>

  <!-- Floating tooltip element -->
  <div id="skc-tip" role="tooltip"></div>

  <!-- Shared scripts -->
  <script src="shared/data.js"></script>
  <script src="shared/core.js"></script>
  <script src="shared/controllers.js"></script>
  <script src="shared/server-coaching.js"></script>
  <script src="shared/tooltips.js"></script>
  <script src="shared/loader.js"></script>
</body>
</html>
```

### `loader.js` — the loader

```javascript
async function loadFragment(url, targetId) {
  const res = await fetch(url);
  const html = await res.text();
  document.getElementById(targetId).innerHTML = html;
}

async function loadAllScreens() {
  // Components first
  await loadFragment('components/sidebar.html', 'layout-sidebar');
  await loadFragment('components/topbar.html', 'layout-topbar');
  await loadFragment('components/ask-panel.html', 'layout-ask-panel');
  await loadFragment('components/drawers.html', 'layout-drawers');

  // All screens, concatenated into the screen container
  const screens = [
    'today', 'profit-recovery', 'actions', 'action-detail',
    'recovery-detail', 'labor-efficiency', 'roi-proof', 'reports',
    'operating-system', 'settings', 'menu-optimization',
    'kitchen-speed', 'table-turns'
  ];

  const container = document.getElementById('screen-container');
  for (const name of screens) {
    const res = await fetch(`screens/${name}.html`);
    container.insertAdjacentHTML('beforeend', await res.text());
  }

  // After all screens loaded, initialize default view
  if (typeof showScreen === 'function') showScreen('home');
}

loadAllScreens();
```

This means: open `index.html` in any browser, the loader fetches all fragments, the demo runs identically to the single-file version.

### Local serving requirement

`fetch()` to local files fails on `file://` URLs in most browsers for security reasons. So the demo must be served from a local web server. Two options for the engineer and for design iteration:

```bash
# Option 1: Python (built into macOS/Linux, available on Windows)
cd skc-design
python3 -m http.server 8000

# Option 2: VS Code Live Server extension
# Right-click index.html → "Open with Live Server"
```

Either gives you `http://localhost:8000`, where the demo runs end-to-end.

---

## 4. The refactor work — step by step

This is the actual sequence Claude Code should follow to do the split. Do it in this order; do not skip steps.

### Step 0 — Set up the target directory

```
mkdir skc-design
cd skc-design
mkdir screens shared components docs docs/handoff-notes
touch index.html shared/styles.css shared/core.js shared/controllers.js
touch shared/data.js shared/tooltips.js shared/server-coaching.js shared/loader.js
touch README.md CHANGELOG.md
```

Commit the empty structure to git as commit 1.

### Step 1 — Extract CSS into `shared/styles.css`

The original file has 5 `<style>` blocks totaling ~9,400 lines. Concatenate them in source order into `shared/styles.css`. Preserve the `/* === SECTION === */` comment markers so a human can still navigate it.

**Verify:** Open `shared/styles.css` in a browser-loaded `index.html` (with a single trivial test element) and confirm no CSS parse errors in the browser console.

Commit as commit 2: "Extract CSS into shared/styles.css".

### Step 2 — Extract JS into `shared/` files

The original has 4 non-src `<script>` blocks totaling ~11,700 lines. Split by responsibility, not by source position:

- **`data.js`** — all top-level data constants: `MENU_DATA`, `LE_CO_SERVERS`, `LE_CO_AXES`, `LE_CO_PATTERN_META`, `ACTIONS_SUBPAGE_TITLES`, `MENU_SIM_SCENARIOS`, `LABOR_SUBPAGE_TITLES`, `TT_SUBPAGE_TITLES`, and any other static fixtures.

- **`core.js`** — platform-wide functions: `showScreen`, theme toggle, ask panel, demo toast helpers, drawer open/close primitives, keyboard handlers, anything not specific to one feature.

- **`controllers.js`** — feature-level subpage controllers and nav handlers: `showMenuSubpage`, `showActionsSubpage`, `showLaborSubpage`, `showTtSubpage`, their `_*UpdateNav` helpers, all `nav*Click` / `nav*Keydown` / `toggle*Nav` functions.

- **`server-coaching.js`** — the entire Server Coaching render system: `renderLeCoaching`, `renderLeCoCards`, `renderLeCoDsrc`, `renderLeCoStrip`, `renderLeCoPatternDist`, `leCoFilter`, `classifyPattern`, `leCoBarClass`, `leCoRadarSvg`, and the `showLaborSubpage` wrapper that triggers render-on-show.

- **`tooltips.js`** — the v30b floating tooltip controller (the IIFE block).

- **`loader.js`** — the fragment loader described in Section 3.

**Load order in `index.html` is critical:** `data.js` first, then `core.js`, then `controllers.js`, then `server-coaching.js` (which wraps `showLaborSubpage`), then `tooltips.js`, then `loader.js` last.

**Verify:** After extracting JS, the JS-only files should parse cleanly. Run `node --check` on each. Then load `index.html` with no screens yet — the sidebar should render and `showScreen('home')` should work without errors (it will fail because no screens are loaded yet, but the *call* should reach the function).

Commit as commit 3: "Extract JS into shared/ files (data, core, controllers, server-coaching, tooltips)".

### Step 3 — Extract components

Pull these structural blocks from the original file into `/components/`:

- **`sidebar.html`** — the `<div class="sidebar">` block, including all `nav-group` and `nav-item` children, plus the expandable `nav-parent` blocks for Menu, Actions, Labor, Table Turns.
- **`topbar.html`** — the top utility bar with title, theme toggle, etc.
- **`ask-panel.html`** — the Ask SKC slide-in panel markup.
- **`drawers.html`** — all drawer/modal blocks: CA modal, evidence drawer, simulate drawer, Le drawer, TT playbook/evidence drawers, Menu evidence drawer.

Each extracted block is just the markup. No `<html>`, no `<head>`, no `<body>` wrappers.

**Verify:** Build a temporary minimal `index.html` that fetches just `sidebar.html` and `topbar.html`. Confirm they render and the sidebar's nav items are clickable (showScreen handler fires, even if target screens don't exist yet).

Commit as commit 4: "Extract layout components (sidebar, topbar, ask-panel, drawers)".

### Step 4 — Extract screens, one at a time

This is the bulk of the work. For each of the 13 screens, in this order:

1. **today.html** (`screen-home`)
2. **profit-recovery.html** (`screen-leaks`)
3. **actions.html** (`screen-actions`) — has 7 subpages, all stay in this file
4. **action-detail.html** (`screen-action-detail`)
5. **recovery-detail.html** (`screen-recovery-detail`)
6. **labor-efficiency.html** (`screen-labor-efficiency`) — has 6 subpages including Server Coaching
7. **roi-proof.html** (`screen-scorecard`)
8. **reports.html** (`screen-reports`)
9. **operating-system.html** (`screen-operating-system`)
10. **settings.html** (`screen-settings`)
11. **menu-optimization.html** (`screen-menu`) — has 7 subpages
12. **kitchen-speed.html** (`screen-throughput`)
13. **table-turns.html** (`screen-table-turns`) — has 5 subpages

For each screen:

- Copy the entire `<div class="screen" id="screen-X">…</div>` block into the corresponding file
- Verify no `<style>` or `<script>` blocks are inadvertently included
- Add to the loader's `screens` array in `loader.js` (if not already there)
- Load it in a browser via `index.html` and walk through every interaction on that screen
- Commit per screen: `commit 5+N: "Extract <screen-name> into screens/<screen-name>.html"`

**Per-screen verification checklist:**

- Sidebar nav item navigates to the screen
- All buttons trigger their handlers (no console errors)
- Drawers and modals open and close
- Dynamic content renders (data-driven tables, charts, etc.)
- Cross-links to other screens still work (e.g. "Open in Actions" from Labor)

Don't move to the next screen until the current one is verified.

### Step 5 — Validation pass

After all screens are extracted, run a final pass:

1. **JS parse check:** every `.js` file under `/shared/` parses with `node --check`.
2. **Full demo walkthrough:** open `index.html`, click through every screen and every subpage, verify all known invariants from `docs/canonical-numbers.md` (labor $370/wk, TT ~$680/wk, etc.) still appear correctly.
3. **Console clean:** browser console should show no errors during normal demo navigation. Warnings are acceptable; errors are not.
4. **Diff against original:** the visual output of the refactored demo should be pixel-equivalent to the single-file v30b. Spot-check 5-6 screens by toggling between the two and comparing.

If anything fails, fix it and re-verify before committing.

Commit as the final commit: "Refactor complete: all screens extracted, validation pass clean".

### Step 6 — Write the docs

After the refactor is verified, create the documentation files:

- **`docs/doctrine.md`** — the state model: `[ESTIMATED]` → `[ACTIVE RECOVERY]` → `[VERIFIED]` → `[BLOCKED]`. Where each state applies. What triggers state transitions. Pull language directly from the existing Evidence subpages so it stays consistent.

- **`docs/canonical-numbers.md`** — the invariants:
  - Labor: Oakland Tuesday Dinner $370/wk (pending), Oakland Tuesday Lunch (active recovery 22/28d)
  - Table Turns: Oakland Friday Dinner ~$680/wk (9 covers × $76 avg check, 36% realization haircut)
  - Menu: Oakland dinner mix shift ~$1,420/mo
  - Salmon: $519/wk
  - Kitchen Speed: $354/wk Friday lunch
  - Portfolio sum (labor + salmon + throughput): $1,243/wk via `getPortfolioTruth()`
  - Plus: peer benchmark labor % target 29.3%, RPLH floor $36.50, etc.

- **`docs/data-sources.md`** — what comes from Toast (sales, items, voids, comps, clock-in/out), what comes from operator-side setup (wage rates, premium item tags, schedule data when uploaded), what's inferred. Include the Server Coaching axis-state model (full/partial/locked).

- **`README.md`** — the repo overview for the engineer (covered in Section 5 below).

- **`CHANGELOG.md`** — start with one entry: "v31 — Refactored single-file demo into folder structure. Behavior identical to v30b."

Commit as the documentation commit.

---

## 5. The collaboration model

This is the harder half. The refactor is mechanical; the collaboration discipline is what makes the parallel work actually work.

### Mental model

**The HTML repo is the design spec. The Next.js repo is the product.** They are different artifacts. The HTML drives the Next.js, not the other way around. The engineer reads the HTML to understand what to build; he doesn't ship HTML, and Ramidu doesn't ship Next.js.

Concretely:
- Ramidu owns: visual design, layout, interaction patterns, copy, doctrine, demo data
- Engineer owns: Next.js implementation, backend, data integration, deployment, performance, accessibility
- Joint ownership: the doctrine document (changes here affect both), the canonical numbers (changes here affect both)

### Workflow

#### Daily

- Ramidu iterates on the design repo locally. Commits to `main` (or a `design` branch if preferred — see "Branching" below).
- Engineer pulls the design repo when he's ready to start a new feature or update an existing one. He reads the relevant screen file plus the relevant docs.
- Engineer does not commit to the design repo. Read-only.

#### Per design change

- Ramidu makes the change in the appropriate screen file (or shared CSS for cross-cutting changes)
- Tests locally via `python3 -m http.server` or VS Code Live Server
- Writes a brief change note: what changed, why, which operator feedback drove it (if applicable)
- Commits with a clear message

#### Weekly handoff (recommended cadence)

Once a week, Ramidu produces a versioned handoff:

1. Bump the version (e.g. v31 → v32)
2. Create `docs/handoff-notes/v32.md` describing:
   - What screens changed
   - What's new (with file paths)
   - What's experimental vs. firm
   - What the engineer should prioritize implementing
   - What can wait or be skipped
3. Tag the git commit: `git tag v32 && git push --tags`
4. Notify the engineer (Slack, email, whatever)

The engineer pulls the tagged version, reviews `handoff-notes/v32.md`, asks any questions, and starts implementation when ready.

This batches communication. Daily commits are fine; daily "hey can you look at this" is not. Weekly versioned handoffs give the engineer predictability and reduce context-switching.

#### Weekly sync (15-30 min)

A short live conversation:
- What Ramidu shipped this week
- What the engineer implemented this week
- What's blocking either side
- What's next priority

Don't skip this. The alternative is silent divergence, which becomes visible only when something breaks.

### Branching

Keep it simple:

- `main` — the canonical design spec. Always demo-ready.
- `feature/<name>` — for in-progress experiments. Merge to `main` when done.

The engineer always pulls from `main` (or from a tagged version). He never pulls from feature branches unless explicitly told to.

Do not maintain a parallel `production` branch. The HTML is a spec, not a production artifact; one branch is enough.

### What changes when, and who decides

- **Visual/layout changes:** Ramidu decides. No engineer approval needed. Implement when convenient.
- **Doctrine changes:** joint decision. The state model (`[ESTIMATED]`, etc.) affects both the visual spec and the backend logic. Discuss before changing.
- **Canonical number changes:** joint decision. These appear in multiple places and changes cascade. Discuss before changing.
- **Interaction pattern changes:** Ramidu decides, engineer implements. But if a change is technically expensive (e.g. real-time streaming where there was none), engineer can push back on scope.
- **Data source changes:** joint decision. Ramidu cannot unilaterally decide SKC will use new data Toast doesn't provide.
- **Pricing, feature scope, ICP:** Ramidu's call as the founder, but should be communicated explicitly because they affect engineering priorities.

### Handling divergence

The HTML and the Next.js will diverge in small ways. That is fine. Examples of acceptable divergence:

- Next.js uses real fetched data; HTML uses static demo data
- Next.js uses production fonts; HTML uses system fonts
- Next.js has loading states; HTML doesn't bother with them
- Engineer chooses a different component library equivalent (e.g. real shadcn instead of inline styles)

Unacceptable divergence (these break the spec-as-truth contract):

- Next.js shows different copy than HTML
- Next.js shows different numbers than HTML for the same canonical leak
- Next.js implements different interaction flows (e.g. different number of clicks to reach the same screen)
- Next.js implements features not present in the HTML (the engineer should not be inventing UX)

If the engineer wants to deviate on one of the unacceptable items, he should raise it before implementing. Usually the answer is to update the HTML first, then implement.

### Issue tracking

Use GitHub Issues on the design repo for design decisions and questions. Examples of legitimate issues:

- "Server Coaching — should the radar use absolute scores or peer-relative?"
- "Profit Recovery — do we keep the off-by-one '3 opportunities' explanation or restructure?"
- "Labor Efficiency — what's the right copy when no schedule data is uploaded?"

The engineer can open issues with questions. Ramidu answers in the issue thread, then updates the spec accordingly. The issue becomes a permanent record of why a decision was made.

Don't use the design repo for engineering bugs. Those live in the Next.js repo.

### What goes in `README.md`

The `README.md` is for the engineer. It should contain:

1. **What this repo is:** "This is the design spec for SKC. The product is built in Next.js [link]. This repo is the source of truth for visual design, copy, doctrine, and interaction patterns."
2. **How to run it locally:** `python3 -m http.server 8000` or Live Server instructions.
3. **How it's organized:** point to this transition doc and the folder structure.
4. **How to consume changes:** weekly tagged versions, read the handoff notes in `docs/handoff-notes/`.
5. **What to do if you have questions:** open a GitHub issue.
6. **Doctrine summary:** brief, link to `docs/doctrine.md` for the full version.
7. **Canonical numbers:** brief, link to `docs/canonical-numbers.md`.

Keep it under 200 lines. Most of the content lives in the docs directory; the README is the entry point.

---

## 6. Risks and how to handle them

### Risk: HTML and Next.js drift apart over time

The most common failure mode. Mitigations:

- Weekly sync catches early divergence
- Tagged versions make "what version is the Next.js currently implementing" answerable
- The acceptable/unacceptable divergence list above is the contract

If divergence is severe, schedule a "reconciliation pass" — a working session where both review side-by-side and agree on which version is canonical for each disagreement. Update one or the other to match.

### Risk: Ramidu over-iterates and floods the engineer with changes

If the design changes daily, the engineer can't keep up. Discipline:

- Use feature branches for experiments. Merge to `main` only when something is ready to consume.
- Resist the urge to push every small change. Batch them weekly.
- If something is genuinely urgent, label the commit and notify directly. But urgent should be rare.

### Risk: Engineer ignores the spec and builds what he thinks is right

Less common, but possible if the spec is unclear or the engineer is opinionated. Mitigations:

- Clear `docs/` directory makes the spec explicit
- Weekly sync catches misalignment
- The issue tracker is where disagreements should be resolved, not in the Next.js codebase quietly

### Risk: Repo becomes a graveyard

If commits stop coming for 2+ weeks, the engineer doesn't know if the spec is stable or stale. Discipline:

- Even small commits are signal. A copy fix is worth committing.
- A "no changes this week" handoff note is better than silence.
- If Ramidu shifts focus (e.g. to operator discovery for 4 weeks), say so explicitly in a CHANGELOG entry.

### Risk: The single-file demo gets edited after the refactor

This breaks the source-of-truth model. The folder structure becomes canonical the moment the refactor is complete. The old single file should be archived (move to `archive/skc-demo-v30b.html` or delete and rely on git history) but not edited.

---

## 7. The minimum viable first commit

After Step 0 of the refactor, but before doing anything else, the engineer should be able to clone the repo and run it. Even if all it shows is "refactor in progress."

Concretely, before the first push to GitHub:
- `index.html` exists with a basic shell
- `shared/styles.css` has at least the CSS variables and base styles
- A README that says "Refactor in progress. Run `python3 -m http.server 8000` and open http://localhost:8000."

This is psychological: it gets the repo into the engineer's hands, reviewed, and the workflow conventions established before the bulk of the refactor work happens. The first commit is the contract; everything after is implementation.

---

## 8. After the refactor — first steps

Once the refactor is verified and committed:

1. Push the repo to GitHub (private repo, add the engineer as collaborator)
2. Schedule the first weekly sync
3. Write the first `handoff-notes/v31.md` describing what's in the refactored version
4. Tag the repo `v31` and notify the engineer
5. Resume design iteration on `main`, batching changes for the next handoff

The refactor is one-time work. The collaboration discipline is permanent. Both matter, but the discipline matters more in the long run.

---

## Appendix A — Single-file → folder mapping reference

For Claude Code or anyone doing the split, here's the precise mapping from `skc-demo-v30b-tooltips-floating.html` to the target structure:

| Source (in v30b) | Target |
|---|---|
| `<style>` blocks (5 total, ~9,400 lines combined) | `shared/styles.css` |
| Static data constants (MENU_DATA, LE_CO_SERVERS, etc.) | `shared/data.js` |
| `showScreen`, theme toggle, ask panel, drawer primitives, keyboard handlers | `shared/core.js` |
| `showMenuSubpage`, `showActionsSubpage`, `showLaborSubpage`, `showTtSubpage` + nav handlers | `shared/controllers.js` |
| `renderLeCoaching` + all `renderLeCo*` + `classifyPattern` + radar SVG | `shared/server-coaching.js` |
| Floating tooltip IIFE | `shared/tooltips.js` |
| Sidebar markup | `components/sidebar.html` |
| Topbar markup | `components/topbar.html` |
| Ask panel markup | `components/ask-panel.html` |
| All drawer/modal markup | `components/drawers.html` |
| `<div class="screen" id="screen-home">…</div>` | `screens/today.html` |
| `<div class="screen" id="screen-leaks">…</div>` | `screens/profit-recovery.html` |
| `<div class="screen" id="screen-actions">…</div>` | `screens/actions.html` |
| `<div class="screen" id="screen-action-detail">…</div>` | `screens/action-detail.html` |
| `<div class="screen" id="screen-recovery-detail">…</div>` | `screens/recovery-detail.html` |
| `<div class="screen" id="screen-labor-efficiency">…</div>` | `screens/labor-efficiency.html` |
| `<div class="screen" id="screen-scorecard">…</div>` | `screens/roi-proof.html` |
| `<div class="screen" id="screen-reports">…</div>` | `screens/reports.html` |
| `<div class="screen" id="screen-operating-system">…</div>` | `screens/operating-system.html` |
| `<div class="screen" id="screen-settings">…</div>` | `screens/settings.html` |
| `<div class="screen" id="screen-menu">…</div>` | `screens/menu-optimization.html` |
| `<div class="screen" id="screen-throughput">…</div>` | `screens/kitchen-speed.html` |
| `<div class="screen" id="screen-table-turns">…</div>` | `screens/table-turns.html` |

Each screen's subpages (Actions, Menu, Labor, Table Turns) stay inside their parent screen file. Don't split subpages into separate files — they share state with their parent and splitting adds complexity without value.

---

## Appendix B — Naming conventions

To make engineer translation to React components easier, suggested conventions:

- HTML class `nav-item` → React `<NavItem>`
- HTML class `pr-opp-card` → React `<ProfitRecoveryOpportunityCard>` (or `<PROpportunityCard>` if shorter)
- HTML class `le-co-card` → React `<ServerCoachingCard>`
- HTML id `leCoList` → React component prop or state name `serverCoachingList`

Don't enforce these mechanically. Use them as a starting point so the engineer doesn't have to invent component names from scratch.

---

## Appendix C — What to do with the existing single-file demo

After the refactor is verified, do not delete `skc-demo-v30b-tooltips-floating.html`. Move it to `archive/skc-demo-v30b-single-file.html` and commit it. Reasoning:

- It's a known-good reference for verifying the refactor didn't break anything
- It's the version several prior conversations and decisions are based on
- It's small enough to keep around and the alternative (losing it) has no upside

After 30 days of stable folder-structure operation with no rollback needed, the archive file can be deleted if desired. Until then, keep it.
