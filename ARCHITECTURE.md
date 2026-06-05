# ARCHITECTURE.md

> How the prototype boots and runs. CLAUDE.md routes here for anything touching the
> loader, script load order, runtime init, or navigation. This describes the
> **prototype's** runtime only — the Next.js rebuild owns its own architecture.
> Everything below is verified against the code; if you change the loader, update
> this doc.

## The shell — `index.html`

A ~46-line static shell: **empty container divs** plus a single script tag, no
screen markup of its own. It loads Google Fonts (Inter, Roboto Mono, IBM Plex
Mono), `shared/styles.css?v=4` via a plain `<link>` (the `?v=4` is a manual token
the loader overrides — see [Cache-busting](#cache-busting-backstop)), one inline
hidden doctrine bar `#daBar`, and `<script src="shared/loader.js?v=4">` — the
**sole** entry point.

`<body class="skc-role-owner light">`: the GM/Owner and Executive/Expanded toggles
were retired, so the view is locked to **Owner + Expanded**, and the **`.light`
theme is applied by default** even though the CSS `:root` palette is the dark one
(see [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) → Theming).

Container ids the loader targets:

| Container | Filled with | Mode |
|---|---|---|
| `#layout-drawers` | `components/drawers.html` | replace |
| `#layout-ask-panel` | `components/ask-panel.html` | replace |
| `#sidebar` | `components/sidebar.html` | replace |
| `#topbar` | `components/topbar.html` | replace |
| `#content > #screen-container` | every `screens/*.html`, in order | append |

## The loader — `shared/loader.js`

An IIFE (`'use strict'`) driven by three tables:

- **`COMPONENTS`** — `[url, targetId, mode]` triples; all four use `mode='replace'`
  (`el.innerHTML = html`).
- **`SCREENS`** — screen names, each fetched from `screens/<name>.html` and
  **appended** (`insertAdjacentHTML('beforeend')`) into `#screen-container`.
  `settings.html` carries both `screen-settings` and the nested `screen-config`, so
  there is no separate `config` fragment.
- **`SCRIPTS`** — injected in this exact order: `data.js` → `core.js` →
  `controllers.js` → `tooltips.js`. Each `<script>` is created with `async = false`
  and awaited, preserving execution order.

### Boot sequence (`boot()`)

Runs on the real `DOMContentLoaded` if the document is still loading, else
immediately:

0. **Re-point the stylesheet** — rewrite the `styles.css` `<link href>` from `?v=4`
   to the per-load `?v=<timestamp>` cache-buster.
1. **Fetch fragments** — `await` all components (replace), then `await` all screens
   (append into `#screen-container`). The DOM is now fully populated.
2. **Install the DOMContentLoaded shim** (below).
3. **Inject the 4 shared scripts in order**, awaiting each.
4. **Restore native `addEventListener` and replay** the queued DCL handlers.
5. **Route to the first screen** (refresh-resume, below).

A missing fragment or script is logged and skipped, not fatal.

## The DOMContentLoaded shim — and why it exists

**Problem:** the shell parses synchronously, so the browser's real
`DOMContentLoaded` has **already fired** by the time the shared scripts load. Any
`document.addEventListener('DOMContentLoaded', fn)` they register would therefore
**never run** — and those handlers are exactly the per-feature initializers that
bind to sidebar/screen elements (core.js alone registers ~13; controllers.js 2
more).

**Fix** (around the script-injection step):

1. Before injecting scripts, capture native `Document.prototype.addEventListener`
   and **monkey-patch** it: a call with `type === 'DOMContentLoaded'` pushes the
   handler onto a `dclQueue` and returns; every other event type passes through.
2. Inject + await all 4 scripts, so every DCL registration is intercepted.
3. **Restore** the native method, then iterate `dclQueue` **in registration order**,
   invoking each handler inside a try/catch (a throwing initializer is logged and
   does not abort the rest).

Two core.js sites instead guard with `if (document.readyState === 'loading') {…}
else { fn() }`. Because fragments are fetched **before** scripts and the document
finished loading long ago, these hit the `else` branch and run **synchronously
against an already-populated DOM** — the same reason step 1 must precede step 3.

The patch is on `Document.prototype` (intercepts `document.addEventListener`), not
`window`; the codebase uses `document.addEventListener` throughout, so nothing
slips past it.

## Script load order — the real dependency

Order is `data → core → controllers → tooltips`, enforced by `async=false` +
sequential `await`.

| Script | Role | Load-time deps |
|---|---|---|
| `data.js` | Pure fixtures + title maps (`MENU_DATA`, `*_SUBPAGE_TITLES`, TT fixtures). | None — no DCL, no readyState branches. |
| `core.js` | Platform layer: registries, `showScreen`, `getOutputLabel`/`getPortfolioTruth`, `SKC_STATE`, most DCL initializers. | Reads `data.js` fixtures inside initializers. |
| `controllers.js` | Subpage controllers (`showMenuSubpage`, `showActionsSubpage`, `showLaborSubpage`, `showTtSubpage`, `initBenchmarks`) + Table-Turns handlers. | — |
| `tooltips.js` | Document-level event **delegation** only (mouseover/focus/scroll). | None — order-independent. |

The actual coupling runs **core → controllers**, not the reverse: `showScreen` (in
core.js) dispatches into controllers-defined functions. But every such cross-file
call fires at **navigation/event time** (inside a function body or a `setTimeout`),
never at parse time — and by then all four scripts have loaded. Several call sites
also use `typeof fn === 'function'` guards. So the order is safe in practice.

> **There is no "server-coaching" wrapper.** Earlier docs claimed a `server-coaching`
> script monkey-patched a controllers function, making load order load-bearing. It
> does not exist — "Server Coaching" is a Labor **UI feature** (`le-co-*` classes),
> unrelated to the runtime. The **only** runtime monkey-patch is the loader's
> `DOMContentLoaded` shim above.

**What actually breaks if order is wrong:**

- **`data.js` after `core.js`** → core's DCL initializers that read fixtures throw
  at replay (title-map lookups, Today month render, …). Some TT controllers guard
  with `typeof … !== 'undefined'` fallbacks.
- **The load-bearing invariant is fragments-before-scripts.** Invert it and the
  replayed initializers + the `readyState` else-branches bind against an empty
  `#screen-container`/`#sidebar`, silently no-op'ing — the documented "buttons
  don't work" failure.

## Navigation — `showScreen(id, navEl, title)`

- Clears `.active` from all `.screen` and `.nav-item`, then activates `#screen-<id>`.
- Highlights the sidebar item — the passed `navEl`, else the `.nav-item` whose
  `onclick` string contains the id.
- Sets `#tbTitle` to `title || id`; scrolls `#content` to top.
- Shows the doctrine bar `#daBar` only for ids `actions` / `scorecard` / `reports`
  / `config`.
- **Lazy per-screen init via `setTimeout`** (so the activated fragment lays out
  first): `actions` → `acInitActionsPage`; `menu` / `labor-efficiency` /
  `table-turns` → ensure default `'overview'` subpage + re-sync nav; `benchmarks` →
  `initBenchmarks`; `reports` → mirror the timeline list.
- Persists `{screen, sub, title}` to `localStorage` (`saveLastView`) for
  refresh-resume.

### First screen at boot — refresh-resume, not a fixed home

The loader does **not** simply call `showScreen('home')`. It:

1. Reads `loadLastView()` from `localStorage`.
2. If a saved screen exists and its `#screen-<id>` is present: replays through the
   right subpage controller if it had one (`menu` / `actions` / `labor-efficiency`
   / `table-turns`), else `showScreen(saved.screen, null, saved.title)`.
3. **Fallback** (no/invalid saved view, or any throw): `showScreen('dashboard',
   null, 'Home')`.

> Two "home" ids, easy to confuse: **`screen-dashboard`** (`home-dashboard.html`)
> is the **Home** landing surface and the boot fallback; **`screen-home`**
> (`today.html`) is the **Today** operate screen, reached only by explicit buttons
> as `showScreen('home', null, 'Today')`.

`initBenchmarks` (controllers.js) bails early if `BENCHMARK_METRICS` is undefined
and rebuilds its chart on every entry — it's fired from `showScreen('benchmarks')`,
not from a one-time DCL handler.

## How `core.js` registries are consumed at render

The canonical registries are read **lazily at render/call time**, never
snapshotted at load — so flipping a data-source status ripples into labels,
confidence, and ROI eligibility on the next render (the data → render doctrine in
action):

- `OUTPUT_TYPES` + `STATUS_TO_OUTPUT_TYPE` drive `getOutputLabel(type, conf,
  reason)`, which picks the registry entry (fallback `estimated`) and returns the
  badge/label/confidence/reason markup + color class.
- `OPPORTUNITIES` feeds `getPortfolioTruth()`, which sums labor/salmon/throughput
  into the canonical portfolio totals (`weekly_exposure_total` $1,243/wk, etc.).
- `ACTIONS` and `VERIFICATIONS` carry per-item state with getters that read
  `SKC_STATE.data_quality.sources[id].status` live (so `can_verify` /
  `approval_rule` recompute against source health).
- `SKC_STATE.data_quality.sources` is the 7-source registry; the `*_sources`
  getters on opportunities and the computed `DQ_STATE` view read it everywhere.

(What each output type *means* lives in [docs/doctrine.md](docs/doctrine.md); the
dollar figures in [docs/canonical-numbers.md](docs/canonical-numbers.md); the
sources in [docs/data-sources.md](docs/data-sources.md).)

## Cache-busting backstop

The loader sets one per-load token `?v=<timestamp>` and appends it to every
fragment fetch, every injected script, and the `styles.css` link. **Why:** a
caching dev server (`python3 -m http.server`, some Live Server setups) sends no
`Cache-Control`, so the browser serves a **stale `core.js`** whose functions the
freshly-fetched fragment's buttons call — "buttons don't work." `serve.py` already
sends `no-store`, so the token is redundant there and harmless. The one file the
runtime can't self-bust is `loader.js?v=4` itself (it bootstraps the busting); bump
that manual token if you change the loader. This is **dev-only** — the Next.js
build owns production caching.
