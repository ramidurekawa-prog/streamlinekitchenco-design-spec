# Changelog

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
