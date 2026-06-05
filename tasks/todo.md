# Task: Overhaul CLAUDE.md into a router-based docs system

## Goal
Replace the "living document" CLAUDE.md + README-as-source model with a router system:
CLAUDE.md becomes the only always-loaded doc (static, human-edited, router + non-negotiable
guardrails); every other doc is read on demand; README becomes human-only and is excluded
as a Claude source.

## Decisions (clarifying Q&A — 2026-06-05)
- **DESIGN-SYSTEM.md**: PROMOTE `docs/design-system.md` → root, prepend a literal token
  reference extracted from `shared/styles.css`; archive the docs/ original.
- **screen-docs**: build a template, SEED by splitting `docs/Page-spec-docs.md` into one file
  per screen; archive the catalog. `benchmarks` + `home-dashboard` start as stubs.
- **Historical docs**: ARCHIVE `design-system-audit.md`, the promoted design-system, and the
  split catalog → `archive/`. KEEP `docs/taya-feedback-plan.md` (active branch). Remove dead refs.
- **Scope**: full v1 content for every doc this pass.

## Plan

### Phase A — Research (read-only)
- [ ] A1 Extract exact design tokens from `shared/styles.css` (`:root`, `.light`, fonts, radii, layout vars)
- [ ] A2 (subagent) Inventory `components/*.html` + recurring screen patterns → COMPONENTS source
- [ ] A3 (subagent) Trace `loader.js` + `index.html` runtime → ARCHITECTURE source

### Phase B — Always-loaded + governance
- [ ] B1 Rewrite **CLAUDE.md**: static banner · what-it-is · run cmd · 1-para boot summary · the ROUTER · always-apply guardrails · changelog logging rule · git workflow · README-excluded note
- [ ] B2 **DECISIONS.md**: ownership boundaries + acceptable/unacceptable divergence (from README) + append-only decision log (seeded)
- [ ] B3 Trim **README.md** to human-only intro (what SKC is · run · current state); remove governance (→ DECISIONS) + weekly-handoff workflow + dead refs
- [ ] B4 **CHANGELOG.md**: header explaining the format + first dated entry for this restructure

### Phase C — Referenced deep docs
- [ ] C1 **CONTEXT.md**: annotated file/folder tree · conventions (naming, where files go, wiring a screen into the loader) · commands · golden path for adding a screen
- [ ] C2 **ARCHITECTURE.md**: loader pipeline · DCL queue-and-replay shim · script load order + dependencies · showScreen/nav flow · cache-bust backstop (from A3)
- [ ] C3 **COMPONENTS.md**: structural fragments + recurring patterns, each with a "use this when…" (from A2)
- [ ] C4 **DESIGN-SYSTEM.md**: literal token reference (from A1) + promoted pattern library (from `docs/design-system.md`)

### Phase D — Screen docs
- [ ] D1 `screen-docs/_TEMPLATE.md`: per-screen template (purpose, route, access, states, subpages, components, data deps + output types, actions table, nav in/out, doctrine specifics, edge cases, responsive, related, status, open questions)
- [ ] D2 Split `Page-spec-docs.md` → `screen-docs/<screen>-SCREEN.md` (13 from catalog) + `benchmarks` / `home-dashboard` stubs
- [ ] D3 `screen-docs/README.md`: index (screen → file, status)

### Phase E — Cleanup / archive / dead refs
- [ ] E1 Archive `docs/design-system.md` → `archive/` (content promoted to root)
- [ ] E2 Archive `docs/design-system-audit.md` → `archive/`
- [ ] E3 Archive `docs/Page-spec-docs.md` → `archive/` (content split to screen-docs)
- [ ] E4 Keep `docs/taya-feedback-plan.md`; repoint its ownership cross-ref to DECISIONS.md
- [ ] E5 Remove dead refs to `skc-design-transition.md`, `docs/git-workflow.md`, `docs/handoff-notes/`

### Phase F — Verify
- [ ] F1 Grep: nothing points at moved/removed files; every new internal link resolves
- [ ] F2 Confirm the CLAUDE.md router lists every referenced doc and each referenced doc exists
- [ ] F3 Fill the Review section below

## Review

**Done — the static-router docs system is in place.** All phases complete; all 10
checklist items shipped.

**Always-loaded + governance**
- `CLAUDE.md` rewritten as a static, human-edited **router**: don't-edit banner ·
  what-it-is · run cmd · 1-paragraph boot summary · the "when to read what" table ·
  7 always-apply guardrails · the CHANGELOG logging rule · git workflow · README
  explicitly excluded as a Claude source.
- `DECISIONS.md`: ownership + acceptable/unacceptable divergence (migrated from
  README) + a seeded append-only decision log (docs restructure, Actions board,
  design-system lock, Table Turns redesign, the honesty doctrine, portion-before-price).
- `README.md` trimmed to a human-only intro (what/run/where-things-live/current
  state); governance moved to DECISIONS.
- `CHANGELOG.md`: format header + first dated entry.

**Referenced deep docs** — `CONTEXT.md` (annotated tree, conventions, golden path),
`ARCHITECTURE.md` (loader pipeline, DCL shim, real load-order dependency, showScreen,
cache-bust — all code-verified), `COMPONENTS.md` (fragments + recurring patterns
inventory), `DESIGN-SYSTEM.md` (promoted from `docs/design-system.md` + a literal
token reference from `styles.css` + adoption-status callout + voice rules).

**Screen docs** — `_TEMPLATE.md`, an index `README.md`, and **16 per-screen docs**:
12 seeded from the catalog (parallel subagents), 4 stubs for screens the v32 catalog
predates (home-dashboard, benchmarks, action-detail, recovery-detail).

**Archive / cleanup** — `design-system.md`, `design-system-audit.md`,
`Page-spec-docs.md` → `archive/` (via `git mv`). `taya-feedback-plan.md` kept.
Dead refs (skc-design-transition, handoff-notes, git-workflow) gone. **0 broken
links** across 30 markdown files.

**Corrections to the original plan's premises** (verified against code):
- No `server-coaching` load-order wrapper exists — the real invariant is
  fragments-before-scripts. ARCHITECTURE.md documents the true dependency.
- Boot doesn't call `showScreen('home')` — it's refresh-resume → fallback
  `showScreen('dashboard', …)`.
- The design system wasn't "undocumented in styles.css" — `docs/design-system.md`
  was a rich 730-line library; promoted rather than rewritten.

**Open items for the human (not resolved — joint-owned / out of scope):**
- **Seeded screen-docs predate later redesigns.** profit-recovery (now a
  $2,090/wk donut WHY surface), actions (single board), roi-proof (MVV cycle),
  labor heatmap/staffing, reports (scheduler maybe dropped), settings (editors)
  carry `needs-reconciliation` / `_TBD — verify_` flags in their Open questions.
- **Data-source inconsistency** between joint-owned docs: `docs/data-sources.md`
  lists 6 sources / KDS partial −14 pts, while `docs/canonical-numbers.md` + the
  catalog say 7 sources / KDS −16 pts → 64%. Needs a joint decision (flagged in
  kitchen-speed + data-quality screen-docs).
- **Table Turns "Trust" vs "Evidence"** — code labels the 3rd subpage Evidence;
  some prose said Trust. Noted in table-turns-SCREEN.md.
