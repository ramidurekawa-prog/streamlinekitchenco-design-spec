# Changelog

## v33 — 2026-06-03

Consolidated **Actions** from a four-subpage tree into **one scrollable board** matching the Taya wireframe: LIVE line → run-rate Hero → action bar → 4-column Kanban → Proof → condensed doctrine. Numbers were adopted **verbatim from the mockups and registered as canonical** (see [docs/canonical-numbers.md](docs/canonical-numbers.md)); these are additive — no existing canonical value changed. `$1,243/wk` Open Exposure, `$370`, `$189`, `$97`, `$519` are untouched.

**Actions — board** (`screens/actions.html`, full rewrite ~921 → ~265 lines)
- Replaced the `#ac-subpage-overview/queue/history/evidence` tree (urgent-action hero, status strip, 4 filter `<select>`s, List/Board stub, `execution` tab group) with: `.ac-live` LIVE status line; `.ac-hero-rr` run-rate hero (`$1,229 /wk in play`, **no** `[EST · not guaranteed]` chip — honesty carried by "in play" + an "estimated run-rate · not yet verified" subcaption); `.ac-actionbar` (Undo · Filter · New action); `.ac-board` 4-column Kanban (**Blocked → Ready → Monitoring → Verified**); `.ac-proof` (`$1,847 [VERIFIED]` · 24 banked · 86% verify rate · `$97/wk` added · 3 history rows); a condensed doctrine `<details>`.
- Cards are **not draggable** — column = a card's status only. Ready/Monitoring/Verified card containers carry ids `kanbanOpen`/`kanbanMonitoring`/`kanbanVerified` so `injectKanbanCard()` drops "New action" cards into Ready.

**Actions — behavior** (`shared/core.js`)
- Added `RUN_RATE_IN_PLAY` (1229) + `PROOF_LIFETIME` aggregates and `acInitActionsPage` / `acToggleFilter` / `acFilterOutside` / `acApplyFilter` / `acClearFilter` / `acUpdateColumnCounts` / `acUndo`. Filter = Assignee × Category, combinable (OR within a group, AND across groups), live per-column counts.
- `showScreen` actions branches repointed to `acInitActionsPage` (binds canonical numbers, data → render); removed the dead subpage/nav-sync block.
- Rewrote `injectKanbanCard()` to emit the new `.ac-card` markup; fixed `submitCA()` (it injected with a null key after `closeCA()` cleared `CA_CURRENT`).
- Tour Step 5 no longer calls the removed `switchTab('execution','queue')`.

**Actions — routing & nav** (`shared/controllers.js`, `components/sidebar.html`)
- `showActionsSubpage()` is now a compat **shim**: opens the board and scroll-anchors (`history`→Proof, `evidence`→doctrine, everything else→board), so the ~30 legacy callers still resolve. Left vestigial `switchTab('execution',…)` prefixes in legacy CTAs (harmless no-ops — `switchTab` is null-safe).
- Sidebar "Actions" flattened from an expandable parent + 4 children to a single `nav-item`.

**Styles** (`shared/styles.css`)
- New `#screen-actions` blocks (`.ac-live/.ac-hero-rr/.ac-actionbar/.ac-filter-pop/.ac-board/.ac-col/.ac-card/.ac-proof*/.ac-doctrine`), responsive 4→2→1. Old `.ac-subpage/.ac-queue/.sp-*` blocks left in place (now unused) for a later deletion pass.

**Tooling** (`shared/loader.js`, `index.html`)
- `loader.js` now also cache-busts the `styles.css` `<link>` with the per-load token (it already busted fragments + scripts). Without this, caching dev servers (VS Code Live Server / Live Preview) served a **stale stylesheet** and new markup rendered unstyled; `serve.py` was unaffected (it sends `no-store`). Bumped `?v=3` → `?v=4` on the `index.html` asset tokens to deploy the new loader.

## v32 — 2026-05-26

Reworked the **Labor Efficiency** screen across three subpages (commit `feat: over + heat + 1/2 staff`, PR #1) and added repo-hygiene scaffolding. Doctrine, state model, and canonical numbers are unchanged — the new UI surfaces the existing 70% action floor / 80% verification floor more explicitly.

**Labor Efficiency · Overview** (`screens/labor-efficiency.html`)
- Removed the old `le-top-card` "Top labor opportunity" block; replaced with a focal-shift eyebrow strip ("Oakland · Tuesday · Lunch · worst RPLH shift").
- Hero gained a secondary-pattern note pointing at the Heatmap (Tue Lunch ~$97/wk).
- "Active monitoring" is now a status-dotted list (Oakland Tue lunch · Active 78%, Berkeley Mon lunch · Active 82%, Walnut Creek bar · Blocked · payroll).
- Server Coaching flagged as the "Biggest opportunity · 2.3× the next-largest leak."
- Confidence cell is now clickable → Data Quality; pending recs broken out as `$370 + $189 + $125`. Removed the "All roles" filter select.

**Labor Efficiency · Heatmap** (`screens/labor-efficiency.html`, `shared/core.js`)
- Each cell now shows per-hour RPLH dollars under the productivity score; `populateHeatmap()` computes RPLH from measured rev/hrs or `baseline × score/100`.
- Added a "Now: Wed · 11 AM" cursor pill, a recurring-pattern chip ("Tue lunch below baseline 4 of last 6 weeks"), and a focal-shift outline on Tue 11A–2P cells.
- Detail panel moved into a sticky right rail with slide-in animation and selected-cell state (`leCloseHeatmapDetail()` added). Redesigned as: severity pill → recommendation hero → dense 2-col data grid (DET/EST tags) → 6-week recurring-pattern sparkline → source line → CTAs.
- New `LE_RECURRING_PATTERNS` fixture (6-week scores, populated for Tue lunch hours). 7-day RPLH trend chart enlarged (280×90 → 900×180) with threshold-colored dots.

**Labor Efficiency · Staffing Plan** (`screens/labor-efficiency.html`)
- New planning-stage layout: hero ($684/wk → ~$2,961/mo → ~$35,532/yr) + "what this page does" narrative.
- Bulk apply bar ("Ready to recover $559/wk = 2 confirmed actions"); 1 rec held below the action floor.
- Confidence-tiered recommendation items keyed to the action (70%) / verification (80%) floors: $370/wk Oakland Tue dinner (78% · review), $189/wk Walnut Creek Wed dinner (82% · ready), $125/wk Berkeley Mon lunch (below floor · partial pattern).

**Repo hygiene**
- Added `CLAUDE.md` (project instructions) and `docs/git-workflow.md` (plain-language git guide).
- Moved `skc-design-transition.md` into `docs/`; added `.gitignore`.

Three production caveats (heatmap filters are spec-only stubs; the "Now" cursor and focal-shift outline are hardcoded via CSS attribute selectors) are documented in `docs/handoff-notes/v32.md`.

## v31 — 2026-05-25

Refactored the single-file demo into the folder structure described in `skc-design-transition.md`.

- CSS split into `shared/styles.css` (5 source `<style>` blocks concatenated, 9,419 lines).
- JS split into `shared/{data,core,controllers,server-coaching,tooltips,loader}.js` by responsibility.
- Components extracted into `components/{sidebar,topbar,ask-panel,drawers}.html`.
- 13 screens extracted into `screens/*.html`, one file per screen. (Note: `screen-config` is genuinely nested inside `screen-settings` in the source, so `screens/settings.html` carries both.)
- `index.html` references only `shared/loader.js`; everything else is fetched at runtime. The loader includes an init shim that queues `DOMContentLoaded` handlers and re-fires them after fragments are in place, so existing initializers see the populated DOM.
- Visual / behavioural output is identical to v30b.
- One pre-existing source bug fixed during validation: `<div class="ss="pr-summary-strip">` typo on Profit Recovery that broke the summary-strip grid.
- Original single-file archived to `archive/skc-demo-v30b-single-file.html`.
