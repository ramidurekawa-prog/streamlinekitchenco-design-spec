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
