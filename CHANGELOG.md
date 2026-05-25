# Changelog

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
