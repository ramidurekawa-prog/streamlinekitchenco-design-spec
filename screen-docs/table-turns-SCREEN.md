# Table Turns — screen spec

> Surfaces services where dining duration is running over target and turns the
> overage into recoverable revenue estimates. Three subpages: Watch (daily story) ·
> Decide (ranked playbooks) · Evidence (math + rules).

- **File:** `screens/table-turns.html`
- **DOM id:** `screen-table-turns` · **route:** `showScreen('table-turns', …)`
- **Group:** Diagnose
- **Status:** seeded — current as of the v32 redesign

## Purpose
Table Turns is the Diagnose feature for dining-room throughput. It detects services
where average dining duration exceeds the operator-set target, computes how many
table turns that overage costs per week, and prices that loss as a recoverable
revenue estimate. It exists because turn time is a distinct leak feeder (alongside
Labor, Menu, and Kitchen Speed) into Profit Recovery, and the duration-to-dollars
math is its own thing. The v32 redesign reorganized the feature around the three
questions a manager actually asks — *what's wrong right now and what do I do
(Watch)*, *what are all my options, ranked (Decide)*, and *can I trust these numbers
(Evidence)* — replacing the older five-page structure (Overview · Stage Flow · Lost
Covers · Playbooks · Evidence) that had number drift and duplication.

## Access — who & when
- **Primary user:** GM.
- **Secondary:** Owner (skimming / approving); training coach (planning a huddle off
  Decide); Owner/CFO + engineer/auditor (Evidence).
- **When used:** daily, often briefly, before service prep or at end of shift
  (Watch). Thursday/Friday morning to commit weekend playbooks (Decide). Quarterly
  review, when a number is contested, or engineer onboarding (Evidence).

## Route & how it's reached
- Sidebar **Table Turns** expandable parent (`#navTtParent`,
  `components/sidebar.html`) with three children — **Watch** / **Decide** /
  **Evidence** — wired via `navTtChildClick('overview'|'playbooks'|'evidence', this)`.
  The `data-sub` keys are `overview` (Watch), `playbooks` (Decide), `evidence`
  (Evidence); titles come from `TT_SUBPAGE_TITLES` in `shared/data.js`
  (`Table Turns · Watch` / `· Decide` / `· Evidence`).
- All three render inside one screen file; the controller swaps subpage divs in
  place via `showTtSubpage(sub)` and routes through
  `showScreen('table-turns', null, TT_SUBPAGE_TITLES[sub])` (`shared/controllers.js`).
- Default subpage is **Watch** (`#tt-subpage-overview` carries `active`; the
  controller falls back to `overview` for an unknown `sub`).
- Also reachable as a drill-target from **Profit Recovery** (the Oakland Friday
  Dinner row → Table Turns) and from Today when a turn-time decision is the headline.

## Subpages

| Subpage | Purpose | Default? |
|---|---|---|
| **Watch** *(`overview`, was Overview)* | The single-viewport story: what's wrong (Fri dinner 18 min long), where the time goes (Stage 4 bottleneck), what to do (dessert at 60 min), is it safe (guardrails green). Hour-by-hour toggle + service picker. | **Yes** |
| **Decide** *(`playbooks`, was Playbooks)* | All playbook options for the selected service, ranked by $ impact. Bulk-apply for the ready tier, single-apply per playbook, plan totals + guardrails sidebar. | No |
| **Evidence** *(`evidence`, "Trust" in the catalog — merged Lost Covers + Evidence)* | LE-Evidence-style reference: TOC + 3 numbered sections (Math · Rules · Restrictions) with expandable cards. Absorbs the old Lost Covers formula trace. | No |

> **Label note:** the v32 catalog/Appendix A names the third page **Trust**; the
> shipped sidebar, `TT_SUBPAGE_TITLES`, and in-page header all label it **Evidence**
> (key `evidence`). Treated as the same page throughout this doc.

## Page states
- **Loading:** subpage fragments are injected by `shared/loader.js`; the active
  subpage div renders once data + controllers land.
- **Empty / cold-start:**
  - *No baseline yet* — Watch headline reads "Baseline still building"; Decide shows
    no playbooks ("Need 2 weeks history" CTA); Evidence → Math reads "No detection
    possible yet."
  - *Service within target* — Watch shows the "All services within target" empty
    state; Decide shows "No actions needed"; Evidence → Math reads "Sample within
    baseline; no opportunity detected."
- **Error / blocked:** KDS stale >24h → numbers freeze with a "stale" chip and the
  action CTA disables (Watch); bulk-apply disables on Decide (individual actions
  still allowed); Evidence → Math shows a stale-data warning banner. Connection
  issues deep-link to Data Quality via `showScreen('settings', null, 'Data Quality')`.
- **Success / populated:** loads with **Oakland · Friday · Dinner** (canonical
  demo). Watch = summary line + 5-cell strip + 3 panels (Why / Where / What+Safe)
  with an in-place hour-by-hour toggle; Decide = ranked playbook list + plan-totals
  sidebar; Evidence = anchored TOC + expandable sections.

## Components used
Patterns from [COMPONENTS.md](../COMPONENTS.md) — Table Turns is one of the
already-migrated screens, so canonical classes apply:
- **Page header** (`page-hdr` + `-left`/`-right`/`-title`/`-sub`) with in-header
  subpage links (`showTtSubpage('overview'|'playbooks'|'evidence')`).
- **Hero card** (`hero-card` + `hero-eyebrow`/`-title`/`-value-block`/`-math`/
  `-ctas`) — the lead "what's wrong · value · action" block on Watch.
- **Five-cell strip** (`sp-strip` > `sp-strip-cell` with `is-warn`/`is-bad`/
  `is-good`) — plain-English KPI band (overage, tables missed, $, confidence, …).
- **Item card / playbooks** (`item-card` with tier modifiers `is-ready`/`is-review`/
  `is-too-low`) — Decide's ranked playbook list.
- **Evidence page** (`ev-toc` / `ev-toolbar` / `ev-section` / `ev-grid` >
  `details.ev-card`; toggled by `leEvToggleAll(true|false)`) — the Evidence subpage;
  the `.le-ev-*` CSS was unscoped in v32 so Table Turns can use the LE Evidence
  pattern.
- **Output-type tags** (static `tag-est` / `tag-det` / `tag-kds` / `tag-proxy`) on
  the dollar and duration values.
- **DQ banner** (`dq-banner`, `data-feature`) when KDS degrades.
- **Empty state** (`empty-state` + `-icon`/`-title`/`-body`).
- **Buttons** (`btn` + `btn-primary`/`-secondary`/`-ghost`) — one primary per page.
- **Service / day picker** (`ttSwitchDay('monday'…'sunday')`) and the hour-by-hour
  toggle, both in-page on Watch.

## Data dependencies
- **Registries / fixtures:** the locked v32 Table Turns fixtures (see Doctrine
  specifics) — service identity, durations, tables-missed, avg check, realization
  haircut, $/wk, confidence, stage timings, and the three playbooks.
  `TT_SUBPAGE_TITLES` (`shared/data.js`) drives titles; subpage swap + day switch +
  evidence toggle live in `shared/controllers.js`. The Friday-Dinner ~$680/wk line
  is one of the leaks summed into `getPortfolioTruth()` / Profit Recovery.
- **Output types shown:** `deterministic` (DET · green) for the **94 min** actual
  duration and the per-stage KDS timestamps (measured); `estimated` (EST · amber)
  for the **~$680/wk** revenue opportunity and the **~$2,944/mo** run-rate and each
  playbook's $/wk (modeled from the duration overage × avg check × haircut). Mode
  tags **KDS** (stage-level timestamps available) vs **PROXY** (no KDS).
- **Sources gating confidence:** **KDS** (Toast KDS) is the primary source —
  full KDS = stage-level detail and Stage-4 bottleneck call-out; stale/absent KDS
  drops to Proxy mode and caps/freezes confidence. Toast POS supplies avg check
  ($76). Operator-set target (76 min) and realization haircut (36%) live in
  Settings.

## Doctrine specifics
Per [docs/doctrine.md](../docs/doctrine.md) and
[docs/canonical-numbers.md](../docs/canonical-numbers.md): the **~$680/wk** is an
open opportunity, shown **EST · amber**, and does **not** count toward ROI; only a
`verified` recovery (monitoring window closed, guardrails passing) flips to DET ·
green and counts. The measured **94 min** duration and KDS stage timestamps are DET
· green (arithmetic on source data), but the *dollar* derived from them stays EST
because it is modeled. The presentation layer can never upgrade EST → verified; a
degraded KDS source downgrades to Proxy mode and shows the reason chip.

**Canonical fixtures (locked for v32)** — preserve every value verbatim:

| Variable | Value | Notes |
|---|---|---|
| Service | Oakland · Friday · Dinner | Highest-impact slow service |
| Service hours | 5–9 PM (4 hrs) | |
| Seats | 42 | Oakland dining room |
| Actual avg dining duration | **94 min** | DET · from Toast KDS |
| Target dining duration | **76 min** | Operator-set, in Settings |
| Overage | **+18 min** | 94 − 76 |
| Tables you missed | **9 / wk** | floored, never rounded up |
| Avg check (Fri dinner, 4-wk trailing) | **$76** | |
| Realization haircut | **36%** | E. Bay full-service casual benchmark |
| Revenue opportunity | **~$680 / wk** | EST · 9 × $76 = $684, rounded to $680 |
| Monthly run-rate | **~$2,944 / mo** | $680 × 4.33 |
| Pattern confidence | **74%** | 4-wk same-daypart sample, ≥3 of 4 recurrence |
| Mode | KDS | Stage-level timestamps available |
| Bottleneck stage | Stage 4 · Dessert → check paid | 22 min actual vs 12 min target = +10 min |

**Playbook fixtures (Decide page):**

| # | Title | Targets | $/wk | Confidence | Tier |
|---|---|---|---|---|---|
| 1 | Dessert menu at 60 min | Stage 4 | $420 | 78% | READY (≥70) |
| 2 | Pre-bus during entrée | Stage 3 → 4 transition | $148 | 74% | READY (≥70) |
| 3 | QR-code self-close | Stage 4 | $44 | 64% | TOO LOW (<70) |

**On the $68 gap** ($680 headline vs $612 playbook sum): playbook estimates are
independent point estimates per intervention. They are **not** strictly additive —
overlapping stage effects mean applying multiple playbooks doesn't sum to the
headline number. The residual **~$68/wk** is unclaimed and may indicate additional
optimization not yet codified into a playbook. Documented on Evidence → Math.

## Actions
| Trigger (button / interaction) | Effect |
|---|---|
| **Decide** / **Evidence** in header (Watch) | `showTtSubpage('playbooks')` / `showTtSubpage('evidence')` — swaps subpage in place |
| **Turn into Action** (Watch primary) | Routes to Decide to commit the recommended playbook |
| **See full math** (Watch) | `showTtSubpage('evidence')` → Evidence |
| **Hour-by-hour toggle / day picker** (Watch) | `ttSwitchDay('monday'…'sunday')` — re-renders the middle panel for the chosen service |
| **Service picker** (Watch) | Selects the service the whole feature is scoped to (state preserved into Decide + Evidence) |
| **Apply N actions · $X/wk** (Decide primary, ready tier) | Bulk-applies ready-tier playbooks → `showDemoToast('Applying 2 playbooks · pending approval','blue')`; creates pending Actions |
| **Turn into Action** per playbook (Decide) | Playbook 1 → `showDemoToast('Playbook 1 → Action draft created','blue')`; Playbook 2 → `… Playbook 2 …` — draft action created |
| **Math** per playbook (Decide) | `showTtSubpage('evidence')` → Evidence with that playbook's stage anchored |
| **← Watch** / **Decide** in header (Evidence) | `showTtSubpage('overview')` / `showTtSubpage('playbooks')` |
| **Expand all / Collapse all** (Evidence) | `leEvToggleAll(true)` / `leEvToggleAll(false)`; per-card `details.ev-card` chevron |
| **Connect / fix KDS** (blocked) | `showScreen('settings', null, 'Data Quality')` |

## Navigation in / out
- **In (how you arrive):** sidebar **Table Turns** → Watch/Decide/Evidence; drill-in
  from **Profit Recovery** (Oakland Friday Dinner row); deep-link from **Today** when
  the turn-time decision is the headline.
- **Out (where buttons go):** between the three subpages via `showTtSubpage(...)`;
  **Turn into Action** drafts pending **Actions** (lifecycle continues on the Actions
  screen → Active Recovery → Verified → ROI Proof); **Data Quality** (Settings) to
  fix a degraded KDS source.

## Edge cases
From Appendix A.3 (apply to all three subpages):

| Scenario | Watch behavior | Decide behavior | Evidence behavior |
|---|---|---|---|
| **KDS goes stale > 24h** | Numbers frozen, "stale" chip, action CTA disabled | Bulk-apply disabled, individual actions allowed | Math section shows "stale data warning" banner |
| **Proxy mode (no KDS)** | Stage panel collapses to single bar | Playbooks tagged [PROXY], confidence capped | Math section shows proxy-mode variant |
| **No baseline yet** | Headline reads "Baseline still building" | No playbooks shown — "Need 2 weeks history" CTA | Math section shows "No detection possible yet" |
| **Service within target** | "All services within target" empty state | Empty state — "No actions needed" | Math section shows "Sample within baseline; no opportunity detected" |
| **Forgotten open checks (>5%)** | Anomaly banner, action disabled | Bulk-apply disabled | Math section shows anomaly note in inputs card |
| **Confidence drops below 60%** | Watch hides the opportunity entirely | Decide shows nothing for that service | Evidence documents the threshold |
| **Trial in monitoring** | "Already in motion" sub-card visible | Playbook shown with "In Actions" chip | Math section unchanged |
| **Verification fails** | Active trial removed, headline returns to detection | Playbook moves back to "available" | Math section unchanged; Restrictions explains "why it didn't count" |

## Responsive notes
- **Desktop primary** — every primary view fits a 1440 × 900 viewport with no
  scrolling (a v32 design principle).
- **Tablet** works full-layout; hour-by-hour toggle available on desktop/tablet.
- **Phone** stacks the panels; the hour-by-hour toggle is desktop/tablet only.
- **Bulk-apply** (Decide) is desktop + tablet only.

## Related screens
- **Profit Recovery** — the cross-feature ranked leak list; the ~$680/wk line is
  summed there via `getPortfolioTruth()`. Drill-in source.
- **Actions** — where a "Turn into Action" draft lives through the lifecycle (Pending
  → Active Recovery → Verified).
- **ROI Proof** — where a verified turn-time recovery would land and count.
- **Kitchen Speed** — the adjacent throughput feeder (ticket time vs turn time);
  Stage-4 dessert/check bottleneck can be confused with kitchen ticket time.
- **Settings / Data Quality** — owner-set target (76 min) and realization haircut
  (36%); KDS source health.

## Open questions
- Seeded from the v32 page-spec catalog (now `archive/Page-spec-docs.md`), including
  Appendix A; accurate as of the v32 redesign. Verify against the present
  `screens/table-turns.html` + `shared/controllers.js` if the screen has since moved.
- The catalog names the third subpage **Trust**; the shipped UI labels it
  **Evidence** (key `evidence`). Confirm which label is canonical going forward.

## Appendix · v32 cross-page contracts & fixtures

> Preserved verbatim from Appendix A so the rebuild has every cross-page contract in
> one place. The three subpages must show consistent identity, totals, and
> confidence for the same service.

**Cross-page contracts** (A.2):

| Contract | Watch shows | Decide shows | Evidence (Trust) shows |
|---|---|---|---|
| Service identity | "Oakland · Friday Dinner" | "Deciding for: Oakland Friday Dinner" | "Oakland Friday Dinner" in formula trace header |
| Total opportunity ($/wk) | ~$680 in strip + hero | ~$680 in context bar | ~$680 in formula result |
| Duration overage | 18 min in strip | 18 min in context bar | 18 min implied (94−76) |
| Tables missed | 9 in strip | Used in plan totals math | 9 in formula trace |
| Avg check | $76 in show-the-formula | $76 implicit in plan math | $76 in formula trace + inputs card |
| Bottleneck stage name | "Stage 4 · Dessert → check paid" | "Targets Stage 4" on Playbook 1 | "Stage 4" called out in formula context |
| Confidence number | 74% in strip | Per-playbook (78/74/64%) | 74% in inputs card |
| Mode (KDS / Proxy) | "KDS: ✓ live" in header | Implicit in plan view | Mode section in Rules |

**State preserved across navigation** (A.2):

- Selected daypart on Watch → Decide opens with the same service → Evidence (Trust)
  opens with the same service in the formula trace.
- Selected playbook on Decide ("Math" button) → Evidence (Trust) opens with that
  playbook's stage anchored.

**Design principles (v32, all three pages)** (A.1): no scrolling on desktop (fits
1440 × 900) · one question per region · headline → evidence → action flow · color
carries meaning (green = fine/safe, amber = watch, red = act now, blue = info) ·
numbers in mono, prose in sans · one primary action per page · plain English
("tables you missed," not "lost covers") · disclosures over duplication.

**Structure map** (A.1): Watch replaces Overview + Stage Flow (merged with
progressive disclosure); Decide replaces Playbooks (purpose largely unchanged);
Evidence/Trust replaces Lost Covers + Evidence (merged into the LE-Evidence-style
TOC + sections page). Implementation order completed as of v32: Watch → Trust →
Decide; old `tt-subpage-stages` and `tt-subpage-lostcovers` divs deleted; sidebar
labels and `TT_SUBPAGE_TITLES` reduced to the three entries; `.le-ev-*` CSS unscoped.
