# Taya feedback — implementation plan

Tester (Taya) feedback triaged into an implementation plan, grounded in the
actual repo. Branch: `feature/taya-feedback`. This is a working tracker — update
the **Status** column as items land.

> Design ownership note (see [README.md](../README.md) / [CLAUDE.md](../CLAUDE.md)):
> copy, canonical numbers, and interaction flows are design-owned. Items marked
> **⚠ decision** below need Ramidu's call before implementation, not a unilateral edit.

## Shipped on `feature/taya-feedback` (local commits, not pushed)

| Commit | Items |
|---|---|
| `769d40b` | #1/#2/#6 Executive/Expanded mode · #20 `illustrative` output type |
| `db0ebc2` | #13 Today on-track/off-track status · #20-cost SAMPLE markers |
| `a19eb83` | #18 Risk & effort matrix (evidence drawer) |
| `9aaef59` | #14 Menu quadrant rename → plain profit/sales language |
| `a9619f1` | #10/#11/#12 Period-over-period deltas on labor figures |
| `632462f` | #19 Projected recoverable savings (MODELED) |
| `c6e9573` | #8 action-status pills · #9 feature shortcuts on recovery cards |
| `e9052c3` | #5 Visual-weight tiers by dollar magnitude |
| `bf4c567` | #20 Causal language softened to associational |
| `be4e3f1` | #16 Food/Alcohol parallel views on Item Economics |
| `18f568f` | #3/#4 Menu evidence routed into the single canonical drawer |

**All Taya items now addressed.** Open follow-ups / caveats (not blockers):
- **#16** — Matrix Food/Alcohol toggle follows the same `data-kind` pattern (Item Economics done).
  A true food-only weighted-CM recompute needs the beverage breakdown SKC does not ingest, so
  canonical `$8.42` / `~$1,420` are unchanged and the Alcohol view is an explicit ILLUSTRATIVE
  placeholder (the fixture has only one alcohol line, Espresso Martini).
- **#3/#4** — the inline menu Evidence *subpage* still duplicates content; reduce it to a thin
  launcher in a later pass.
- **table_turns** — relabelled as an "Illustrative preview" (banner added; **uncommitted** in the
  WIP bucket). Confirm this vs. scoping the stage view back to Toast-only aggregates.
- `data.js` SAMPLE comments + the table_turns banner remain uncommitted (entangled with your WIP).

## What the codebase already gives us (changes the effort math)

1. **Three evidence-drawer systems already exist** — the "single Math drawer"
   (#3/#4) is a *consolidation*, not a greenfield build:
   - `openDrawer(key)` + `drawerData` + builders
     `mkSection/mkEv/mkCalc/mkConf/mkVerify/mkAction/mkWhere/mkRisk/mkCtaRow`
     (`shared/core.js` ~4879–4927; markup in `components/drawers.html`).
     **`mkRisk` already exists.**
   - `openMenuEvidenceDrawer()` — menu-only drawer (`shared/core.js` ~4488).
   - `SKC_TRUST.openEvDrawer(key)` with `REASONING_GRAPHS` (`shared/core.js`
     ~10566) — the newest; it is what Today's **"See full math"** already calls
     (`openEvDrawer('leak1')`).
   - Plus inline evidence **subpages**: Menu Evidence (subpage 7), Labor Evidence,
     Table Turns Evidence, Actions Evidence.
2. **The labeling doctrine (#20-labeling) already exists** as a 9-type registry
   (`OUTPUT_TYPES`, `getOutputLabel`). Taya's DET/MODELED/ILLUSTRATIVE is a coarser
   view of it; we only add one new type (`illustrative`) + a causal-language audit.
3. **`showScreen` is already patched twice** (`shared/core.js` 4133 def, re-wrapped
   at ~7388 and ~10030). Taya's "don't modify `showScreen()`" is correct — and the
   in-screen sub-view pattern (`showMenuSubpage` + nav `data-sub` children) is the
   mechanism to reuse for the Food/Alcohol toggle (#16) and shortcuts (#9).
   No core-router changes are needed for any item.

## ⚠ Conflict to resolve first: table_turns vs NOT-INCLUDED

Taya's NOT-INCLUDED list says station/BOH/KDS stage-breakdowns "would be fabricated…
build only as an explicitly-labeled *Illustrative preview*." But the in-progress
`table_turns` work (`shared/data.js` ~269–376, `TT_WATCH_SCENARIOS`) is built almost
entirely on that: `stageBreakdown` (Seat/Order/Eat/Pay/Reset), a "Reset" bottleneck,
"entree ticket time," KDS badges, "sauté station bottleneck." **Decision needed**:
relabel the TT stage view as an "Illustrative preview," or scope it back to the
Toast-supported aggregate (total dwell vs target, missed covers, $). Gates finishing
the current branch.

## Tier 0 — Foundations (build once)

| # | Item | Where it lands | Effort | Risk | Status |
|---|------|----------------|--------|------|--------|
| 1,2,6 | Executive / Expanded mode | `data-`/class on `<body>` (`body.skc-exec`); CSS `body.skc-exec .skc-detail{display:none}`; segmented toggle in `components/topbar.html`; `setSkcMode()` in `core.js` (mirrors `toggleTheme`). Then per-screen `.skc-detail` tagging. | Toggle S; tagging L | Low mechanism; tagging broad | **Mechanism done** + first-pass Today tagging. Tagging continues per screen. |
| 3,4 | Single evidence drawer | Pick `SKC_TRUST.openEvDrawer` as canonical; route `openMenuEvidenceDrawer`/`openDrawer` callers to it; collapse inline Evidence subpages to thin launchers. | M–L | **Highest** — 3 systems + 4 subpages | ⚠ confirm canonical drawer |
| 20-label | Add `illustrative` output type + causal-language audit | `OUTPUT_TYPES` (`core.js` ~931) + `docs/doctrine.md`; grep causal verbs → "associated with"/"coincides with". | S | Low | todo |

## Tier 1 — Toast-safe, mostly additive

| # | Item | Where it lands | Effort | Notes | Status |
|---|------|----------------|--------|-------|--------|
| 13 | Big red/green status on Today | New hero element top of `.td-first-fold` in `screens/today.html`, driven by a stated threshold (labor % vs 29.3% / sales pace). | S | ⚠ threshold wording | todo |
| 10,11,12 | Labor up/down vs comparison; group labor | Add prior-period values to LE summary fixtures (`screens/labor-efficiency.html` ~205–229). `LE_CO_SERVERS` already has `prevScores` (`data.js` ~92). | M | New demo numbers (owned) | todo |
| 18 | Risk framework on recs | Extend `mkRisk` → `mkRiskMatrix(difficulty,time,guest,staff,revenue)`; static `risk{}` per `OPPORTUNITIES`/`ACTIONS`; render in drawer + cards. Price-change = elevated guest+revenue. | M | `mkRisk` is the seed | todo |
| 19 | Projected savings 14d/month | Linear extrapolation fn + card; label MODELED; assumptions in the drawer. No causal language. | S–M | ⚠ placement | todo |
| 8 | Action pairing | Ensure every flagged item has a paired action row (static status). Menu kanban + LE rec cards exist; gap is Profit Recovery + Table Turns. | M | — | todo |
| 9 | Shortcuts | Buttons calling existing `showScreen`/`showXSubpage`. No router edits. | S | — | todo |
| 5 | Visual weight by dollar | CSS sizing tiers (`.skc-weight-lg/md/sm`) chosen by dollar magnitude. | M | Design-heavy | todo |
| 20-cost | `// SAMPLE` comments on cost | Annotate every `cm`/cost use in `data.js` `MENU_DATA` + scenarios + item-econ renderers. | S | — | todo |

## Tier 2 — Menu / Item Economics

| # | Item | Where it lands | Effort | Risk | Status |
|---|------|----------------|--------|------|--------|
| 14 | Rename quadrants (no Star/Plowhorse/Puzzle/Dog) | Strings: 52× `screens/menu-optimization.html`, 32× `core.js` (3 `clsLabel` maps ~4316/4365/4417 + insight copy), 3× `data.js`. Fix: one `MENU_CLASS_LABELS` map; keep data keys (`cls:'plow'`) + CSS classes (`menu-q-plow`). | M | ⚠ exact wording is design-owned | todo |
| 15 | Scale to 100+ items | Matrix hand-codes 9 SVG bubbles; needs compact/virtualized render + scroll on the item table (`renderMenuItemsTable` ~4355). | M–L | Heaviest menu item | todo |
| 16 | Food / Alcohol split | `MENU_DATA.items` mixes food + alcohol (Martini, Vodka Pasta are alcohol). Add `kind:'food'\|'alcohol'`; Food/Alcohol toggle inside Matrix + Item Econ (reuse subpage/`data-sub`, not `showScreen`); recompute weighted CM/exposure per set. | M | ⚠ recomputes canonical $8.42 / ~$1,420 | todo |
| 17 | Item Econ: improve, don't redesign | Keep `renderMenuItemsTable` core intact; only layer #16 toggle + #14 labels. | S | Low | todo |

## Decisions needed (design-owned)

1. **table_turns vs NOT-INCLUDED** — relabel as "Illustrative preview" or scope to Toast-only aggregates?
2. **Quadrant wording (#14)** — exact replacement labels.
3. **Food/Alcohol canonical impact (#16)** — food-only `$8.42` / `~$1,420` get recomputed → new canonical numbers + sign-off ([docs/canonical-numbers.md](canonical-numbers.md)).
4. **Canonical drawer (#3)** — confirm `SKC_TRUST.openEvDrawer` as the one to keep.
5. **Placement** — projected-savings card (#19); big-status threshold/wording (#13).

## Sequencing

- **Phase A (foundations):** Tier 0 `#20-label` → Exec/Expanded → drawer consolidation.
- **Phase B (quick wins):** #13, #9, #20-cost, #14 (once wording set).
- **Phase C (data-backed):** #10/11/12, #18, #19, #8.
- **Phase D (menu heavy):** #16 → #15 → #5.

Each landing on `main` triggers a `vNN` CHANGELOG + handoff note per CLAUDE.md.

## Out of scope (would be fabricated without the data)

Station-based intelligence, BOH coaching, food/order/bill wait stage breakdowns,
station/BOH "explain where time goes," usage-telemetry-based simplification. Build
only as an explicitly-labeled "Illustrative preview" if at all.
