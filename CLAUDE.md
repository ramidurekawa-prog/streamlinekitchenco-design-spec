# CLAUDE.md

> **Keep this file current.** This is a living document, not a static one. Whenever
> a significant change lands in the design spec — new screens, doctrine or state-model
> changes, canonical-number revisions, data-source additions, or architectural
> shifts — update the relevant section here so it stays an accurate map of the repo.

## What this repo is

This is the **design spec** for SKC (Streamline Kitchen Co.), a profit-recovery
product for restaurant operators. The shippable product is built in **Next.js in
a separate repo**. This repo is a static HTML/CSS/JS prototype that serves as the
**source of truth for visual design, copy, doctrine, interaction patterns, and
demo numbers**. Nothing here ships to production — an engineering partner reads
from here and reimplements in Next.js.

Design is owned by Ramidu (founder/designer); a separate engineer consumes the
spec. See the ownership and "acceptable vs. unacceptable divergence" tables in
[README.md](README.md) before changing copy, numbers, or interaction flows —
those require discussion, not unilateral edits.

## Running it

`fetch()` won't work over `file://`, so it needs a local server:

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

Or VS Code → Live Server on `index.html`.

## Architecture

`index.html` is a shell that references only `shared/loader.js`. Everything else
is fetched at runtime:

- `shared/loader.js` — fetches `components/*.html` and `screens/*.html` into their
  containers, then injects scripts in order: **data → core → controllers →
  server-coaching → tooltips**. Load order matters (`server-coaching.js` wraps
  `showLaborSubpage` from `controllers.js`). It also patches `DOMContentLoaded`:
  handlers are queued and re-fired after fragments land, so initializers see a
  populated DOM (mirroring the original single-file behavior). Finally calls
  `showScreen('home')`.
- `shared/core.js` — platform layer: `showScreen`, theme, ask panel, the
  canonical registries (`OPPORTUNITIES`, `ACTIONS`, `VERIFICATIONS`,
  `OUTPUT_TYPES`, `STATUS_TO_OUTPUT_TYPE`, `SKC_STATE.data_quality.sources`),
  and `getOutputLabel` / `getPortfolioTruth`.
- `shared/data.js` — top-level fixtures (`MENU_DATA`, `LE_CO_*`, ...).
- `shared/controllers.js` — per-feature subpage controllers + nav handlers.
- `shared/server-coaching.js`, `shared/tooltips.js` — feature-specific.
- `shared/styles.css` — all CSS (concatenated from the original 5 `<style>` blocks).
- `components/*.html` — sidebar, topbar, ask-panel, drawers (all overlays/modals).
- `screens/*.html` — one file per screen, 13 total. `screen-config` is genuinely
  nested inside `screen-settings`, so `settings.html` carries both.

A typical edit touches one screen file (≤1,400 lines) plus maybe one shared file.

This structure came from refactoring an original single-file demo (now in
`archive/`). The refactor plan is `skc-design-transition.md`.

## The doctrine (read before touching numbers or states)

SKC labels every dollar value with an **output type** that drives confidence
display, ROI eligibility, and color. Canonical registry: `OUTPUT_TYPES` in
`shared/core.js`. Key rule: **only `verified` (DET · green) counts toward ROI.**
The state machine is `OPEN → ACTIVE RECOVERY → VERIFIED` (any state can go
`BLOCKED` if a data source degrades). The presentation layer can never upgrade an
`estimated` to `verified`; type and confidence flow from data → render. A degraded
source downgrades the type and shows the reason chip. Full detail:
[docs/doctrine.md](docs/doctrine.md).

## Canonical numbers

Certain dollar values appear on multiple screens and must stay consistent — if you
change one, grep the repo and update every occurrence. Source of truth is
`shared/core.js`. See [docs/canonical-numbers.md](docs/canonical-numbers.md)
(e.g. $1,243/wk open exposure, $370/wk Oakland Tue Dinner labor, $519/wk salmon).

## Data sources

Seven sources (Toast, 7shifts, KDS, Recipe cost, Reviews, Accounting, Inventory)
determine whether a metric is measured vs. modeled, what approval an action needs,
and ROI eligibility. Registry: `SKC_STATE.data_quality.sources`. Details incl. the
Server Coaching axis-state model: [docs/data-sources.md](docs/data-sources.md).

## Conventions

- `main` is canonical and always demo-ready. `feature/<name>` for experiments.
- The engineer pulls `main` or a weekly tag (`vNN`); weekly handoff write-ups in
  `docs/handoff-notes/vNN.md` are the contract for what changed.
- Don't invent UX, copy, or numbers not in the spec. Raise divergence as a GitHub
  issue rather than implementing it silently.
