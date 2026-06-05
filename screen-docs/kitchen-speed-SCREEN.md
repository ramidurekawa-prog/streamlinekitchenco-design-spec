# Kitchen Speed — screen spec

> KDS ticket-time analysis: shows where ticket times run over baseline and the
> dollar exposure that creates — an aggregate signal, not station-level root cause.

- **File:** `screens/kitchen-speed.html`
- **DOM id:** `screen-throughput` · **route:** `showScreen('throughput', …)`
- **Group:** Diagnose
- **Status:** seeded

## Purpose
Kitchen Speed is the throughput-domain diagnostic. It reads ticket-time data from
the KDS and flags shifts where tickets are running over baseline (canonically Friday
Lunch at Berkeley), then dollarizes the overage. It is one of the four leak feeders
into Profit Recovery (with Labor, Menu, and Table Turns) and earns its own surface
because the ticket-time math is distinct. The signal is **aggregate only** —
station-level root cause requires on-site observation, not the data.

## Access — who & when
- **Primary user:** GM. **Secondary:** Chef de cuisine.
- **When used:** when Profit Recovery surfaces a throughput leak; when tickets feel
  slow on a recurring shift.

## Route & how it's reached
**No sidebar entry.** Reached via **Profit Recovery crosslinks** —
`showScreen('throughput', …)` from a throughput row on Profit Recovery. The page
header carries a **← Profit Recovery** back link. _TBD — confirm the exact crosslink
`onclick` against `profit-recovery.html` / `core.js`._

## Subpages
None.

## Page states
- **Loading:** _TBD — verify against `kitchen-speed.html`._
- **Empty / cold-start:** _TBD — verify (e.g. no throughput leak detected / not
  enough KDS history)._
- **Error / blocked:** **KDS partial** caps confidence and surfaces a "Fix KDS
  connection" CTA → Data Quality; verification of throughput is blocked while KDS is
  partial.
- **Success / populated:** ticket-time trend per location/daypart with the $ exposure
  and an observation CTA — the normal state.

## Components used
- `page-hdr` with a **← Profit Recovery** back link.
- Ticket-time trend block (per location / daypart) and a dollar-exposure value block.
- Output-type tag (EST) + source-caveat chip (KDS partial) via `getOutputLabel()`.
- _Verify exact fragment/class names against `kitchen-speed.html` + `styles.css`._

## Data dependencies
- **Registries / fixtures:** the throughput opportunity within
  `OPPORTUNITIES` / `getPortfolioTruth()` (the $354/wk Friday Lunch line);
  `getOutputLabel()`. _Confirm any throughput-specific fixture + init handler in
  `controllers.js`._
- **Output types shown:** **EST · amber** on the ticket-time exposure (modeled from
  the formula below — a measurement of ticket minutes, but the revenue impact is an
  estimate, not verified). No verified dollars originate here while KDS is partial.
- **Sources gating confidence:** **KDS** (stage/ticket timing — currently `partial`)
  and **Toast POS** (covers, party size, avg check). Throughput confidence currently
  **64%** with **KDS partial (−16 pts to base 80)**.

## Doctrine specifics
- Friday Lunch ticket-time overage = **$354/wk**, **EST · amber**. Formula:
  **(excess ticket minutes × avg covers / turn duration) × avg party size × avg
  check**. Aggregate only — **does not** break down by station.
- Throughput **confidence 64%**, **KDS partial → −16 pts** (catalog/canonical figure;
  preserved verbatim). A degraded source downgrades the type and shows the reason
  chip; the presentation layer can never upgrade EST → VER (see
  [docs/doctrine.md](../docs/doctrine.md) +
  [docs/canonical-numbers.md](../docs/canonical-numbers.md)).
- State machine: this is **open exposure** until actioned and monitored; verification
  is blocked while KDS is partial, so it cannot reach VERIFIED / count toward ROI in
  the current demo state.

## Actions
| Trigger (button / interaction) | Effect |
|---|---|
| **Schedule observation** | Schedules a kitchen-line observation → ops calendar (demo: toast notification). |
| **Fix KDS connection** | → Data Quality (resolve the partial KDS source). |
| **← Profit Recovery** (header) | Returns to the Profit Recovery ranked list. |

## Navigation in / out
- **In (how you arrive):** Profit Recovery throughput crosslink only (no sidebar).
- **Out (where buttons go):** **Data Quality** (Fix KDS connection); **ops
  calendar / toast** (Schedule observation); back to **Profit Recovery** (header).

## Edge cases
- **KDS partial / stale:** confidence capped at 64% (−16 pts), reason chip shown,
  verification blocked, "Fix KDS connection" surfaced.
- **Aggregate-only limitation:** the page never claims station-level root cause —
  any deeper attribution requires an on-site observation (hence the Schedule
  observation CTA), not the model.
- _Confirm proxy/no-KDS and within-baseline (no leak) behaviors against the file._

## Responsive notes
Desktop primary. _TBD — verify tablet/phone behavior against `kitchen-speed.html`._

## Related screens
- **Profit Recovery** — the only entry point; where the throughput leak is ranked
  against Labor / Menu / Table Turns.
- **Data Quality** — to resolve the partial KDS connection that caps confidence.
- **Table Turns** — the other KDS-dependent feature (dining duration vs ticket time);
  related signal, different math.

## Open questions
- Seeded from the v32 catalog (now `archive/Page-spec-docs.md`); verify the current
  surface against `kitchen-speed.html` (loading/empty states, exact components,
  whether an init handler exists in `controllers.js`).
- **Confidence-delta discrepancy to reconcile:** the catalog + `canonical-numbers.md`
  state **KDS partial = −16 pts** (→ 64%), but `docs/data-sources.md` lists KDS
  partial as **−14 pts**. Preserved the catalog's −16/64% here; confirm the
  authoritative value in `core.js` and align the docs.
- Confirm the "Schedule observation" target (demo toast vs a real ops-calendar hook).
