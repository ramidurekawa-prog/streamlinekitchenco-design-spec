# Labor Efficiency — screen spec

> Surfaces shifts where labor cost is outpacing sales, then turns the worst hours
> into specific, recoverable staffing changes.

- **File:** `screens/labor-efficiency.html`
- **DOM id:** `screen-labor-efficiency` · **route:** `showScreen('labor-efficiency', …)`
- **Group:** Diagnose
- **Status:** seeded

## Purpose
Labor Efficiency is the labor-domain diagnostic and action surface. It finds shifts
where labor is running ahead of sales (e.g. Oakland Tue Dinner ~$370/wk), shows the
exact bad hours on a heatmap, and converts the gap into named staffing cuts a GM can
apply. It exists because operators want the labor headline — and a concrete fix —
without having to read an hourly grid themselves; the dollar recoveries it generates
feed into the cross-feature Profit Recovery ranking.

## Access — who & when
- **Primary user:** GM. **Secondary:** Owner (approving cuts; reviewing whether a
  gap is a one-off or systemic).
- **When used:** daily, after Today; whenever labor cost % goes red. Heatmap before
  scheduling decisions; Staffing Plan before the weekly schedule publish.

## Route & how it's reached
Sidebar item under **Diagnose** → `showScreen('labor-efficiency', …)`. The parent
route lands on the **Overview** subpage by default. Also reached from Profit
Recovery ("Open in Labor") and from Today when a labor leak is the day's decision.
_TBD — confirm exact `onclick` / nav handler against `labor-efficiency.html` +
`controllers.js`._

## Subpages
Default subpage: **Overview**. (Subpage titles are driven by `LABOR_SUBPAGE_TITLES`
in `data.js` — _verify the current entries against `data.js`_.)

| Subpage | Purpose | Default? |
|---|---|---|
| Overview | The 5-second labor view: largest current leak (Oakland Tue Dinner ~$370/wk), mini heatmap preview, recommended action, monitoring status. | Yes |
| Heatmap | Hour-by-hour grid comparing each hour's RPLH to its same-daypart benchmark; red cells = labor outpacing sales. | No |
| Staffing Plan | Specific recommended staffing changes (e.g. cut 1 FOH from Tue Dinner Oakland) with confidence tier and $ impact — the action page for labor. | No |
| Evidence | The labor rulebook: formulas, source health, confidence thresholds, verification guardrails, use + LLM restrictions. | No |
| ~~Benchmarks~~ | **Relocated → [benchmarks-SCREEN.md](benchmarks-SCREEN.md) (standalone screen).** Was the Labor peer-comparison subpage (locations vs top-quarter East Bay peers: 42 locations, last 90 days, refreshed quarterly; "closing the gap" math illustrative only, never a Staffing Plan substitute). Now its own sidebar screen and reframed as internal location-vs-location comparison — do not spec here. | — |

### Subpage detail

**Overview.** Loads with the highest-$ labor leak. Strip cells show portfolio labor
%, RPLH, extra hours/wk, pending recs, and confidence (with stale-source warnings
inline). Headline leak: Oakland Tue Dinner ~$370/wk.

**Heatmap.** Renders a 7-day × 12-hour grid. Score bands: **85+ green, 70–84 amber,
<70 red**. Empty states for missing data, missing payroll, no baseline, and no
issues. Click a cell → side detail panel. "Connect payroll" → Data Quality if wage
data is missing.

**Staffing Plan.** Sorted by $ exposure. **Three confidence tiers (ready / review /
too-low)**. Wage assumptions are editable in Settings. Bulk-apply is offered for the
ready tier only; single-apply per playbook row.

**Evidence.** TOC + **3 sections (Detection / Verification / Trust & Safety)** with
expandable cards. Expand all / Collapse all; TOC anchor links; per-card expand.

## Page states
- **Loading:** _TBD — verify against `labor-efficiency.html`._
- **Empty / cold-start:** Heatmap has dedicated empty states — **missing data**,
  **missing payroll**, **no baseline**, **no issues**. _Confirm Overview/Staffing
  Plan empty states._
- **Error / blocked:** stale **7shifts** downgrades labor recs from DET to EST and
  adds a GM-approval requirement; wage data missing → "Connect payroll" CTA →
  Data Quality. Verification blocks while 7shifts is stale.
- **Success / populated:** the normal state — top leak + heatmap + ranked staffing
  recommendations.

## Components used
- `page-hdr` (subpage header) and the labor strip (`sp-strip`-style cells:
  labor %, RPLH, extra hours/wk, pending recs, confidence).
- Heatmap grid (7×12 colored cells) + side detail panel.
- Staffing-plan recommendation rows with tier badges and per-row "Turn into Action".
- Output-type tags (DET / EST) and source-caveat chips via `getOutputLabel()`.
- LE-Evidence pattern (`.le-ev-*`) on the Evidence subpage.
- _Verify exact fragment/class names against `labor-efficiency.html` + `styles.css`._

## Data dependencies
- **Registries / fixtures:** `OPPORTUNITIES` / `getPortfolioTruth()` (the
  ~$370/wk Oakland Tue Dinner labor line), `LABOR_SUBPAGE_TITLES` (`data.js`),
  `getOutputLabel()`; heatmap + staffing-plan render in `controllers.js`.
  _Confirm the heatmap/staffing fixtures and init handler names._
- **Output types shown:** **EST · amber** on the open labor leak (~$370/wk run-rate);
  **DET · green** only where measured directly and verified (the Oakland Tue **Lunch**
  $97/wk equiv. is Active Recovery, shown separately, not counted).
- **Sources gating confidence:** **Toast POS** (clock-in/out, hours, wage where
  exported — the spine) and **7shifts** (scheduled vs actual coverage). Labor
  confidence currently **78%** with **7shifts token stale 18h (−7 pts)**.

## Doctrine specifics
- Oakland Tuesday **Dinner** = **$370/wk**, **EST · amber**, **open exposure** —
  detected, not yet actioned. Formula: **5 hrs excess × $37 fully-loaded labor cost
  × 2 services = $370**.
- Oakland Tuesday **Lunch** = **$97/wk** verified-equiv., **Active Recovery** (22 of
  28 days into monitoring) — shown apart from the open leak so it never inflates the
  headline; only on verification does it count toward ROI.
- Trigger / floor references: peer-benchmark **labor % target 29.3%** (above-baseline
  trigger); **RPLH floor $36.50** (below this a shift is flagged for review); heatmap
  score bands **85+ / 70–84 / <70**.
- State machine surfaced: `OPEN → ACTIVE RECOVERY → VERIFIED`, any state →
  `BLOCKED` when 7shifts goes stale. The presentation layer can never upgrade an
  EST to VER; type + confidence flow data → render. See
  [docs/doctrine.md](../docs/doctrine.md) +
  [docs/canonical-numbers.md](../docs/canonical-numbers.md).
- **Action floor 70%** / **verification floor 80%** govern which recommendations are
  applyable vs verifiable. _Verify the exact floor wiring against `core.js` /
  `controllers.js` — these are the doctrine floors to honor in copy._

## Actions
| Trigger (button / interaction) | Effect |
|---|---|
| **Open Heatmap / Staffing Plan / Evidence** (Overview) | Navigates to the respective subpage. |
| **Turn into Action** (Overview / Staffing Plan row) | Creates a pending labor action → global Actions ("pending decision"). |
| **Apply N actions · $X/wk** (Staffing Plan, ready tier only) | Bulk-applies all ready-tier recommendations. |
| Click heatmap cell | Opens the side detail panel for that hour. |
| **Connect payroll** (Heatmap, wage data missing) | → Data Quality. |
| **View in Heatmap** (Staffing Plan row) | Returns to Heatmap focused on that shift. |
| **Expand all / Collapse all** + TOC anchors (Evidence) | Expand/collapse rule cards; jump to a section. |

## Navigation in / out
- **In (how you arrive):** sidebar (Diagnose → Labor Efficiency, lands on Overview);
  Profit Recovery ("Open in Labor"); Today (labor decision of the day).
- **Out (where buttons go):** **Actions** (on Turn into Action / Apply); **Data
  Quality** (Connect payroll); **Settings** (wage assumptions); cross-links to
  **Benchmarks** and back to **Profit Recovery**. _Confirm exact targets._

## Edge cases
- **7shifts stale (18h):** recs become EST, confidence −7 pts, GM approval required,
  verification blocked; reason chip shown next to confidence.
- **Wage data missing:** heatmap shows the missing-payroll empty state and a
  "Connect payroll" CTA rather than dollarized cells.
- **No baseline yet:** heatmap shows the no-baseline empty state.
- **Sub-floor confidence:** below the action floor (70%) a recommendation is shown
  as review/too-low and cannot be bulk-applied; below the verification floor (80%)
  it cannot verify. _Verify thresholds against code._

## Responsive notes
Desktop primary. Overview and Staffing Plan work on tablet; **phone collapses**
Overview. The **Heatmap is dense — desktop primary, tablet works**; phone behavior
_TBD — verify against `labor-efficiency.html`._

## Related screens
- **Benchmarks** (standalone) — for "are we good or bad vs peers / other locations";
  location gaps there route back here for the actual dollar recovery.
- **Profit Recovery** — where the labor leak is ranked against Menu / Table Turns /
  Kitchen Speed.
- **Actions** — lifecycle home once a staffing change is committed.
- **Data Quality / Settings** — payroll connection + wage assumptions.

## Open questions
- Seeded from the v32 catalog (now `archive/Page-spec-docs.md`); the **Heatmap** and
  **Staffing Plan** were redesigned after v32 — **verify** the current grid, empty
  states, tiers, and CTAs against `labor-efficiency.html` + `controllers.js`.
- **Benchmarks** is no longer a subpage here — relocated to
  [benchmarks-SCREEN.md](benchmarks-SCREEN.md); confirm no residual Benchmarks UI
  remains inside `labor-efficiency.html`.
- Confirm DOM-level details left _TBD_ above: nav handler, loading state, exact
  fixtures/component classes, and where the 70%/80% floors are wired.
