# CONTEXT.md

> The repo map. CLAUDE.md routes here for file layout, naming, commands, or
> conventions — and when you're not sure where something lives, start here. The
> always-apply **guardrails live in CLAUDE.md**, not here, because this doc is
> read-on-demand; this is orientation, not rules.

## Layout

```
streamlinekitchenco-design-spec/
├── index.html               empty shell + <script src="shared/loader.js"> — see ARCHITECTURE.md
├── serve.py                 no-store dev server (use this, not http.server)
├── shared/                  CSS + JS used across every screen
│   ├── styles.css           ALL css (~11k lines; design tokens at the top — see DESIGN-SYSTEM.md)
│   ├── data.js              pure fixtures + title maps (MENU_DATA, *_SUBPAGE_TITLES, TT_*)
│   ├── core.js              platform: showScreen, registries, getOutputLabel/getPortfolioTruth, SKC_STATE
│   ├── controllers.js       per-feature subpage controllers + nav handlers + initBenchmarks
│   ├── tooltips.js          floating-tooltip controller (document-level delegation)
│   └── loader.js            fragment loader + init orchestrator (the runtime — see ARCHITECTURE.md)
├── components/              structural fragments injected once — see COMPONENTS.md
│   ├── sidebar.html         left nav            → #sidebar
│   ├── topbar.html          title / health / actions → #topbar
│   ├── ask-panel.html       "Ask SKC" FAB + panel → #layout-ask-panel
│   └── drawers.html         ALL overlays/modals/drawers → #layout-drawers
├── screens/                 one fragment per screen, appended into #screen-container
│   ├── home-dashboard.html  screen-dashboard         · Home landing (6-metric KPI; boot fallback)
│   ├── today.html           screen-home              · Today (operate)
│   ├── profit-recovery.html screen-leaks             · ranked portfolio leak list
│   ├── actions.html         screen-actions           · single-board action lifecycle
│   ├── action-detail.html   (action detail surface)
│   ├── recovery-detail.html (recovery detail surface)
│   ├── labor-efficiency.html screen-labor-efficiency · subpages: Overview / Heatmap / Staffing Plan / Evidence
│   ├── benchmarks.html      screen-benchmarks        · standalone location-vs-location compare
│   ├── table-turns.html     screen-table-turns       · subpages: Watch / Decide / Evidence
│   ├── menu-optimization.html screen-menu            · subpages: Overview / Matrix / Mix Shift / Item Economics / Actions / Simulations / Evidence
│   ├── kitchen-speed.html   screen-throughput        · ticket-time analysis (no sidebar entry)
│   ├── roi-proof.html       screen-scorecard         · verified-savings scorecard
│   ├── reports.html         screen-reports           · weekly owner report
│   ├── operating-system.html screen-operating-system · product-story narrative
│   └── settings.html        screen-settings (Data Quality) + nested screen-config (Settings)
├── docs/                    joint-owned truth + working plans
│   ├── doctrine.md          output types + state model — read before touching $ / states
│   ├── canonical-numbers.md the dollar values that appear on multiple screens
│   ├── data-sources.md      the 7 sources and their freshness / role
│   └── taya-feedback-plan.md active-branch tracker (feature/taya-feedback)
├── screen-docs/             per-screen specs (where screen intent lives) + _TEMPLATE.md
├── archive/                 superseded docs kept for history (design-system v32, audit, page-spec catalog)
├── tasks/                   scratch plans/lessons (todo.md, lessons.md) — not part of the spec
└── CLAUDE.md · DESIGN-SYSTEM.md · CONTEXT.md · ARCHITECTURE.md · COMPONENTS.md · DECISIONS.md · CHANGELOG.md · README.md
```

A typical edit touches **one screen file** (≤ ~1,400 lines) plus maybe one shared
file.

## Naming conventions

- **Screen files:** `screens/<kebab-name>.html`, each holding one `.screen` div
  with `id="screen-<id>"`. The `<id>` is often *not* the filename — e.g.
  `profit-recovery.html` → `screen-leaks`, `kitchen-speed.html` →
  `screen-throughput`. The id is what `showScreen(id)` takes; the tree above is the
  source of truth for the mapping.
- **CSS classes:** per-feature prefixes — `ac-` Actions, `le-` Labor, `tt-` Table
  Turns, `menu-` Menu, `pr-` Profit Recovery, `rp-`/`ro-` ROI Proof, `bm-`
  Benchmarks, `dash-` Home, `dq-` Data Quality, … A new **shared** pattern instead
  gets an unprefixed canonical name — check DESIGN-SYSTEM.md before inventing one.
- **JS:** SCREAMING_SNAKE for the canonical registries (`OPPORTUNITIES`, `ACTIONS`,
  `VERIFICATIONS`, `OUTPUT_TYPES`, `STATUS_TO_OUTPUT_TYPE`); `SKC_STATE` for mutable
  app state; camelCase, usually feature-prefixed, for controllers/handlers
  (`acInitActionsPage`, `showLaborSubpage`, `leCreateAction`, `initBenchmarks`).
- **Canonical numbers in markup:** tag any number that appears on multiple screens
  with `data-skc="<key>"` so it stays bound to `core.js` (see
  [docs/canonical-numbers.md](docs/canonical-numbers.md)).

## Where new files go

- **New screen** → `screens/<name>.html`; register it in the loader's `SCREENS`
  list; style it in `styles.css`; reach it from `components/sidebar.html`.
- **New overlay / modal / drawer** → add it *inside* `components/drawers.html`
  (don't create a new top-level fragment); drive open/close from core.js. See
  [COMPONENTS.md](COMPONENTS.md).
- **New shared UI pattern** → style it in `styles.css` with a canonical (unprefixed)
  class; document it in [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) + [COMPONENTS.md](COMPONENTS.md).
- **Per-screen spec** → `screen-docs/<screen>-SCREEN.md` from `_TEMPLATE.md`.

## Commands

```bash
python3 serve.py     # dev server with no-store → http://localhost:8000
```

There is no build step, test suite, or package manager — it's static files served
as-is. "Verifying" a change means loading it in the browser via `serve.py` (see
[ARCHITECTURE.md](ARCHITECTURE.md) for why the plain `http.server` shows stale
files).

## Golden path — adding a screen end to end

1. **Spec first.** Copy `screen-docs/_TEMPLATE.md` → `screen-docs/<name>-SCREEN.md`
   and fill purpose / route / states / data deps / doctrine. Decide the
   `screen-<id>` and the sidebar group.
2. **Fragment.** Create `screens/<name>.html` with a single
   `<div class="screen" id="screen-<id>"> … </div>`. Build from the canonical
   patterns in [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) (page shell → header → strip →
   hero → content); reuse fragments/patterns from [COMPONENTS.md](COMPONENTS.md);
   tag every dollar value with an output-type tag and `data-skc` where it's
   canonical.
3. **Register with the loader.** Add `'<name>'` to the `SCREENS` array in
   `shared/loader.js` so the fragment is fetched into `#screen-container`.
4. **Style it.** Add a `#screen-<id>` block to `shared/styles.css` using **tokens
   only** (no raw hex). If you introduce a reusable pattern, give it a canonical
   class and document it.
5. **Wire navigation.** Add a `nav-item` in `components/sidebar.html` whose
   `onclick` is `showScreen('<id>', this, '<Title>')`. Subpages follow an existing
   parent group (`navMenu*` / `navLabor*` / `navTt*`).
6. **Init logic (if any).** Put data→render logic in a controller in
   `controllers.js` (or core.js for platform-level) and fire it from `showScreen`'s
   per-screen `setTimeout` branch — **not** from a `DOMContentLoaded` handler unless
   it's a one-time global init. (Why: [ARCHITECTURE.md](ARCHITECTURE.md) → the DCL
   shim.)
7. **Log it.** Prepend a line to [CHANGELOG.md](CHANGELOG.md).
