# Profit Recovery — screen spec

> The ranked leak list: every detected recovery opportunity across all features,
> ranked by $ value, confidence, and verification readiness — the portfolio truth view.

- **File:** `screens/profit-recovery.html`
- **DOM id:** `screen-leaks` · **route:** `showScreen('leaks', …)`
- **Group:** Diagnose
- **Status:** seeded

## Purpose
The ranked leak list. Every detected recovery opportunity across all features
(Labor, Menu, Table Turns, Kitchen Speed) ranked by $ value, confidence, and
verification readiness — the portfolio truth view. It exists because the feature
pages (Labor / Menu / etc.) each diagnose within their own domain; Profit Recovery
is the cross-feature ranking — "what's the biggest recoverable dollar across
everything." Each row is labeled with its output type and color-coded per doctrine.

## Access — who & when
- **Primary user:** GM.
- **Secondary:** Owner. **Tertiary:** anyone planning a quarterly review.
- **When used:** when Today's top decision doesn't feel right and they want the full
  ranked list; weekly portfolio review; when prioritizing the next 2–3 actions.

## Route & how it's reached
- Sidebar **Profit Recovery** item: `showScreen('leaks', this, 'Profit Recovery')`
  (in `components/sidebar.html`).
- **See all opportunities** from Today, plus inbound crosslinks from feature pages
  (Labor Efficiency, Menu Optimization, Kitchen Speed, Recovery Detail, Reports,
  ROI Proof) via `showScreen('leaks', null, 'Profit Recovery')`.

## Subpages
None.

## Page states
- **Loading:** _TBD — verify against `profit-recovery.html`._
- **Empty / cold-start:** no detected opportunities — _confirm behavior._
- **Error / blocked:** stale-source warnings shown inline on affected rows; _confirm
  full-page blocked behavior._
- **Success / populated:** ranked leak list with $ + confidence per row and a
  portfolio total.

## Components used
- Page header (`page-hdr`) — _confirm class against `profit-recovery.html`._
- Summary strip (`sp-strip`) carrying portfolio totals — _confirm against current screen._
- Leak rows (one per opportunity) with output-type tags and inline stale-source
  warnings — _confirm canonical row class (feature-local per COMPONENTS.md)._
- Output-type tags (DET / EST / VER) per row.
- Cross-link card (`crosslink-footer` / `crosslink-card`) to related features — _confirm._
- Ask-panel (`#askPanel` / `toggleAskPanel()`).

## Data dependencies
- **Registries / fixtures:** `getPortfolioTruth()` — sums Open Exposure, Active
  Recovery, and Verified. Feeds from the four leak sources (Labor, Menu, Table
  Turns, Kitchen Speed); canonical line items live in `OPPORTUNITIES` / `ACTIONS` /
  `VERIFICATIONS` (`shared/core.js`).
- **Output types shown:** each row labeled DET / EST / VER and color-coded per
  doctrine; stale-source warnings inline.
- **Sources gating confidence:** the seven SKC sources behind each feature's leak
  (e.g. 7shifts for labor, Recipe cost for menu, KDS for table turns / kitchen speed).

## Doctrine specifics
Per [docs/canonical-numbers.md](../docs/canonical-numbers.md), the page summarizes
the portfolio truth (via `getPortfolioTruth()`):

- **Estimated Open Exposure $1,243 / wk** (sum of labor + salmon + throughput) —
  OPEN / EST · amber.
- **Active Recovery $189 / wk** — ACT / EST · blue, in monitoring, not counted.
- **Verified Savings $97 / wk equiv.** (Oakland Tuesday Lunch labor) — VER / DET ·
  green, the only line that counts toward ROI.

Hero leak: **Oakland Tuesday Dinner labor $370 / wk** (EST · amber, pending). Other
ranked line items include the **salmon $519 / wk** menu item, the **Oakland Friday
Dinner table-turn ~$680 / wk**, and the **Friday Lunch kitchen-speed $354 / wk**.
Per [docs/doctrine.md](../docs/doctrine.md), Open Exposure and Active Recovery are
tracked separately and never roll up into Verified; type and confidence flow from
data → render and cannot be upgraded by the presentation layer; a degraded source
downgrades the type and shows the reason chip.

## Actions
| Trigger (button / interaction) | Effect |
|---|---|
| Per-row **Review** | Opens the Recovery Detail overlay for that leak |
| **Open in [Feature]** | Navigates to the source feature page (Labor / Menu / Table Turns / Kitchen Speed) |
| **Ask SKC why** | Opens the ask panel |

## Navigation in / out
- **In (how you arrive):** sidebar **Profit Recovery**; **See all opportunities**
  from Today; crosslinks from Labor Efficiency, Menu Optimization, Kitchen Speed,
  Recovery Detail, Reports, and ROI Proof.
- **Out (where buttons go):** Recovery Detail overlay (**Review**); the relevant
  feature page (**Open in [Feature]**); ask panel (**Ask SKC why**).

## Edge cases
- Stale source on a contributing feature → inline stale-source warning on the
  affected row; the row's output type downgrades and a reason chip appears.
- _Confirm proxy-mode, sub-floor confidence, and full-page blocked behavior against
  `profit-recovery.html`._

## Responsive notes
- Desktop primary. Tablet works.
- Phone shows top 5 only.

## Related screens
- **Recovery Detail** — per-leak drill-in.
- **Today** — surfaces the single top-ranked decision from this same truth.
- **Labor Efficiency · Menu Optimization · Table Turns · Kitchen Speed** — the four
  feeders; "Open in [Feature]" jumps to the domain diagnosis.
- **ROI Proof** — where Verified line items are reported.

## Open questions
- Seeded from the v32 page-spec catalog (now `archive/Page-spec-docs.md`); accurate
  as of v32 and may predate later redesigns.
- **Needs reconciliation:** the present `screens/profit-recovery.html` has been
  redesigned (recent commit "redesign: profit recovery"). The file's own header
  describes a calm/editorial **WHY surface** paired with Actions (the DO half), a
  **hero donut splitting ~$2,090/wk across 5 findings**, and per-finding
  unfolding visualizations rendered by `prRenderViz()` — explicitly no status
  chips, owners, due dates, tabs, or kanban. That diverges from this catalog's
  ranked-leak-list framing and the $1,243/wk portfolio sum above. Verify which
  numbers, layout, and CTAs are canonical now (the $2,090/wk figure is from the
  live file, not the catalog, and is not yet in `docs/canonical-numbers.md`).
- TBD items above: Loading / empty / full-page blocked states; current component
  classes (header, strip, row, crosslink); proxy-mode and sub-floor-confidence
  behavior.
