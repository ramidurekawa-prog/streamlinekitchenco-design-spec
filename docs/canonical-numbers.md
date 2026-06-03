# Canonical numbers

These dollar values appear in multiple screens and must stay consistent. If you change one, find every other place it shows up and update it too. The single-file source-of-truth lives in `shared/core.js` (`OPPORTUNITIES`, `ACTIONS`, `VERIFICATIONS`).

## Portfolio totals

| Metric | Value | Where shown | Notes |
|---|---|---|---|
| Estimated Open Exposure (portfolio sum) | **$1,243 / wk** | Profit Recovery summary strip, Today hero | Sum of labor + salmon + throughput. Computed via `getPortfolioTruth()`. |
| Active Recovery | $189 / wk | Profit Recovery, Actions | In monitoring · not counted yet. |
| Verified Savings | $97 / wk equiv. | Profit Recovery, ROI Proof | The Oakland Tuesday Lunch labor recovery — currently the only verified line item. |

## Labor

| Metric | Value | Notes |
|---|---|---|
| Oakland Tuesday **Dinner** | **$370 / wk** | Pending. Hero number on Profit Recovery. Formula: 5 hrs excess × $37 fully-loaded labor cost × 2 services = $370. |
| Oakland Tuesday **Lunch** | $97 / wk (verified equiv.) | Active Recovery — currently 22 of 28 days into monitoring. |
| Peer-benchmark labor % target | 29.3 % | Used as the "above-baseline" trigger. |
| RPLH (Revenue Per Labor Hour) floor | $36.50 | Below this, a shift is flagged for review. |

## Table Turns

| Metric | Value | Notes |
|---|---|---|
| Oakland Friday **Dinner** | **~$680 / wk** | Top table-turn opportunity. Formula: 9 missed covers × $76 avg check, with a 36% realization haircut applied. Shown on Profit Recovery and Table Turns. |
| Oakland Saturday Dinner | ~$420 / wk | Secondary opportunity. |

## Menu

| Metric | Value | Notes |
|---|---|---|
| Oakland dinner **mix-shift** | **~$1,420 / mo** | Computed as $0.71 per item × 2,004 items (28-day window). |
| Salmon (specifically) | **$519 / wk** | One line item in the mix-shift opportunity. |
| CM threshold | $8.75 | Items below this are flagged as Plowhorse or Dog. |
| Popularity threshold | 8.0 % | Crossing this is the Star/Puzzle boundary. |
| Recipe-cost data staleness | 18 days | Currently blocks verification of menu opportunities; surfaces as the "EST · amber" badge. |

## Kitchen Speed (Throughput)

| Metric | Value | Notes |
|---|---|---|
| Friday Lunch ticket-time overage | **$354 / wk** | Computed as: (excess ticket minutes × avg covers / turn duration) × avg party size × avg check. |

## Data confidence (currently shown values)

| Metric | Value | Source caveat |
|---|---|---|
| Labor confidence | 78 % | 7shifts token stale 18h (−7 pts). |
| Menu confidence | 71 % | Recipe cost file stale 18d (−10 pts to base 81). |
| Throughput confidence | 64 % | KDS partial (−16 pts to base 80). |

## Demo location context

| Item | Value |
|---|---|
| Group | Rosewood Group |
| Locations | Oakland, Berkeley, Walnut Creek, San Jose (4 active) |
| Selected location in demo | All Locations |
| Operator | Sarah Chen, General Manager |
| Pilot day | 15 (of 30) |

## Actions board (v33)

The consolidated **Actions** board (`screens/actions.html`) introduces its own
aggregates, **registered as canonical** — the constants live in `shared/core.js`
(`RUN_RATE_IN_PLAY`, `PROOF_LIFETIME`) and are bound into the DOM by
`acInitActionsPage()`. They are **distinct metrics from** the portfolio numbers
above; do **not** reconcile them to each other.

| Metric | Value | Where | Notes |
|---|---|---|---|
| **In play** (hero) | **$1,229 / wk** | Actions hero | Sum of the Ready + Monitoring board cards (370 + 150 + 180 + 340 + 189). A *different scope* from the $1,243/wk Open Exposure (detected leaks, not actions being worked). Shown **without** an `[EST]` chip — the word "in play" plus the "estimated run-rate · not yet verified" subcaption carry the honesty. |
| **Verified — lifetime** | **$1,847** | Actions Proof header | Cumulative verified savings (run-rate equivalent) since Dec 2025. Distinct from the current `$420/mo · $97/wk` verified line — this is the all-time bank. |
| Actions banked | 24 | Actions Proof header | Lifetime count of verified actions. |
| Verify rate | 86 % | Actions Proof header | Share of completed actions that verified. |
| Added this period | $97 / wk | Actions Proof header | **==** the canonical `$97/wk` verified line (current period). |

### Board cards (demo line items)

Canonical where a real action exists; the rest are new illustrative demo cards.

| Card | Value | Column | Owner | Canonical? |
|---|---|---|---|---|
| Remove one 5–10 PM FOH server · Oakland Tue Dinner | $370/wk | Ready | SC | ✓ canonical labor |
| Trim prep labor 2h · Oakland | $150/wk | Ready | MS | new |
| Lunch RPLH staffing tweak · Oakland Tue Lunch | $180/wk | Monitoring | RK | new |
| Friday lunch queue coaching · Berkeley | $340/wk | Monitoring | CJT | new |
| Reduce bar staffing −1 · Walnut Creek | $189/wk | Monitoring | ML | ✓ canonical (A005) |
| Approve salmon reprice $24→$27 | $519/wk | Blocked | MS | ✓ canonical salmon |
| Crispy Chicken reprice +$1.00 | $165/wk | Blocked | CJT | new (≈ sim lift) |
| Server step-down protocol · Oakland Tue | $97/wk | Verified | RK | ✓ == canonical $97/wk verified |
| Menu reprint | — | Verified | MS | new (valueless / closed) |

### Proof history rows

| Action | Category | Date | Value |
|---|---|---|---|
| Server step-down · Oakland Tue dinner | Labor | Jun 2 | $97 |
| Lunch host scheduling · Oakland | Labor | May 18 | $142 |
| Truffle Fries reprice +$0.75 · Oakland | Menu | May 4 | $210 |

### Owner personas (Actions avatars)

`SC` = Sarah Chen (existing GM). `RK` = Riley K., `ML` = Mia L., `MS` = Morgan S.,
`CJT` = C.J. Tran are **new demo personas** introduced with the board — confirm
names against the reference comps if they matter for the demo.
