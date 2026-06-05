# SKC Design Spec

This repo is the **design spec** for SKC (Streamline Kitchen Co.). The product itself is built in Next.js in a separate repo — this one is the source of truth for visual design, copy, doctrine, interaction patterns, and demo numbers. The engineer reads from here; nothing here ships to production.

## Run it locally

`fetch()` won't work over `file://`, so the demo needs a local server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Or right-click `index.html` in VS Code → **Open with Live Server**.

## How the repo is organized

```
skc-design/
├── index.html                  shell + the single <script src="shared/loader.js">
├── shared/                     CSS + JS used across every screen
│   ├── styles.css              all CSS, concatenated from the 5 source <style> blocks
│   ├── data.js                 top-level data fixtures (MENU_DATA, LABOR_SUBPAGE_TITLES, ...)
│   ├── core.js                 platform: showScreen, theme, ask panel, OPPORTUNITIES, ACTIONS, ...
│   ├── controllers.js          per-feature subpage controllers + nav handlers
│   ├── tooltips.js             v30b floating tooltip controller
│   └── loader.js               fragment loader + init orchestrator (see below)
├── components/                 structural pieces reused by every screen
│   ├── sidebar.html
│   ├── topbar.html
│   ├── ask-panel.html
│   └── drawers.html            all overlays / modals / drawers
├── screens/                    one file per screen (13 total)
│   ├── today.html              screen-home
│   ├── profit-recovery.html    screen-leaks
│   ├── actions.html            screen-actions (7 subpages)
│   ├── action-detail.html
│   ├── recovery-detail.html
│   ├── labor-efficiency.html   screen-labor-efficiency (5 subpages)
│   ├── roi-proof.html          screen-scorecard
│   ├── reports.html
│   ├── operating-system.html
│   ├── settings.html           screen-settings (Data Quality) + nested screen-config (Settings)
│   ├── menu-optimization.html  screen-menu (7 subpages)
│   ├── kitchen-speed.html      screen-throughput
│   └── table-turns.html        screen-table-turns (5 subpages)
├── docs/
│   ├── doctrine.md             output type + state model — start here
│   ├── canonical-numbers.md    the dollar values that appear on multiple screens
│   ├── data-sources.md         what comes from Toast, 7shifts, KDS, operator
│   └── handoff-notes/          weekly versioned handoff write-ups (v31, v32, ...)
├── archive/                    historical artifacts (the single-file v30b lives here)
├── skc-design-transition.md    the refactor plan that produced this layout
├── CHANGELOG.md
└── README.md
```

A typical editing session touches **one screen file** (≤ 1,400 lines) plus maybe one shared file — much smaller surface area than the original single-file demo.

### The loader (`shared/loader.js`)

`index.html` only references `shared/loader.js`. Everything else is fetched at runtime:

1. Loader fetches each `components/*.html` and `screens/*.html` into its target container.
2. Loader patches `document.addEventListener('DOMContentLoaded', ...)` to queue handlers.
3. Loader dynamically injects `<script>` tags for data → core → controllers → tooltips.
4. After the scripts load, loader fires the queued DCL handlers so init runs against the fully populated DOM (the original single-file behaviour).
5. Loader calls `showScreen('home')`.

The init shim exists because in the original single-file all screen DOM was present before any script ran. Splitting to async fragments would otherwise fire `DOMContentLoaded` on an empty shell and silently break initializers. See the comment block at the top of `loader.js`.

## How to consume changes (for the engineering partner)

- **Default to weekly tagged versions** (`git tag v32`). Pull from a tag; the README in `docs/handoff-notes/vNN.md` tells you what changed and what to prioritize implementing.
- **For questions, open a GitHub issue** on this repo. Decision threads become a permanent record.
- **Daily commits to `main` are fine** but you're not expected to track every one. The weekly handoff is the contract.

## Start here

1. `docs/doctrine.md` — the output type and state model (`OPEN → ACTIVE RECOVERY → VERIFIED`). Everything in the UI labels itself according to this.
2. `docs/canonical-numbers.md` — the dollar values that show up on multiple screens. If you change any of these, search the repo to find the other places.
3. `docs/data-sources.md` — Toast vs. operator vs. inferred.

## Branching

- `main` — canonical spec. Always demo-ready.
- `feature/<name>` — in-progress experiments. Merge to `main` when ready.

The engineer always pulls `main` or a tagged version. Never feature branches unless told to.

## What the spec covers vs. what the engineer decides

| Item | Owner |
|---|---|
| Visual design, layout, copy | Ramidu (design) |
| Doctrine (the state model) | Joint — discuss before changing |
| Canonical numbers | Joint — discuss before changing |
| Interaction patterns | Ramidu decides, engineer implements |
| Data source choices | Joint — design can't unilaterally require new Toast endpoints |
| Next.js architecture, components, perf, a11y, deploy | Engineer |
| Pricing, ICP, feature scope | Ramidu (founder), communicated explicitly |

## Acceptable vs. unacceptable divergence

Some drift between this HTML spec and the Next.js implementation is fine; some is not.

**Acceptable:** real fetched data vs. static demo data; production fonts vs. system fonts; loading states; the engineer choosing real shadcn instead of inline styles.

**Unacceptable:** different copy, different numbers for the same canonical leak, different interaction flows (different click count to reach the same screen), inventing UX not present in the HTML. If the engineer wants to deviate on any of these, raise it as an issue before implementing.
