# Benchmarks — screen spec

> Standalone location-by-location comparison: pick a metric and locations, and a
> dynamic chart + analysis re-render.

- **File:** `screens/benchmarks.html`
- **DOM id:** `screen-benchmarks` · **route:** `showScreen('benchmarks', …)` → `initBenchmarks`
- **Group:** Diagnose
- **Status:** needs-reconciliation — redesigned (commit "benchmark redesign"); the
  v32 catalog framed this as a Labor **peer** benchmark subpage, which is superseded.

## Purpose
Internal comparison across the operator's own locations. The user selects a metric
and a set of locations; the chart and the written analysis re-render to show where
each location stands relative to the others. (The earlier v32 "top-quarter peer
benchmark" framing has been replaced by this internal location-vs-location view.)

## Access — who & when
- **Primary user:** Owner. **Secondary:** GM.
- **When used:** monthly / quarterly review; deciding whether a gap is a one-off or
  systemic.

## Route & how it's reached
Standalone sidebar item (now its own screen, no longer a Labor subpage). Entry fires
`initBenchmarks` via `showScreen('benchmarks')` — it rebuilds the chart on every
entry and bails early if `BENCHMARK_METRICS` is undefined.

## Subpages
None (standalone).

## Page states
- **Success / populated:** metric + location pickers, dynamic chart, analysis text.
- **Empty:** no metric/locations selected — _confirm behavior._
- **Blocked:** _confirm behavior when a feeding source is degraded._

## Components used
- `.bm-*` block at the end of `styles.css` (chart, stat rows `bm-stat-row`,
  read rows `bm-read-row`, pickers).

## Data dependencies
- **Registries / fixtures:** `BENCHMARK_METRICS` and `BENCHMARK_LOCATIONS` (in
  `data.js`); render in `controllers.js` (`initBenchmarks`).
- **Output types shown:** comparison figures are typically estimated/measured —
  _confirm per metric._

## Doctrine specifics
Benchmarks is a **diagnostic, not a recovery generator** — it does not mint
verified dollars. Any closing-the-gap math is illustrative only; real recoveries
live in Labor → Staffing Plan. Keep that distinction explicit in copy.

## Actions
| Trigger | Effect |
|---|---|
| Select metric | Re-renders chart + analysis for that metric |
| Select / toggle locations | Re-renders comparison across the chosen locations |

## Navigation in / out
- **In:** sidebar Benchmarks.
- **Out:** _confirm cross-links (Heatmap / Staffing Plan / Evidence)._

## Edge cases
- Missing `BENCHMARK_METRICS` → `initBenchmarks` no-ops.
- _Confirm single-location and all-locations selections._

## Responsive notes
Desktop primary (dense chart). _Confirm tablet/phone._

## Related screens
Labor Efficiency (Heatmap, Staffing Plan) — where location gaps turn into dollar
recoveries.

## Open questions
- Verify the full current design against `benchmarks.html` + the `.bm-*` styles and
  `initBenchmarks`: exact metrics, picker behavior, output types, cross-links.
- Reconcile/retire the superseded peer-benchmark content preserved in
  `archive/Page-spec-docs.md` (Labor · Benchmarks).
