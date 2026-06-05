# Recovery Detail — screen spec

> The detail surface for a single recovery opportunity/decision: the full math and
> the decision to turn it into an action.

- **File:** `screens/recovery-detail.html`
- **DOM id:** _confirm_ · **route:** opened via `Review` from Today / Profit Recovery
- **Group:** Operate / Diagnose (overlay surface, not a sidebar destination)
- **Status:** stub — verify against `recovery-detail.html`

## Purpose
Drill-in for one detected recovery opportunity — the surface behind Today's
**Review this decision** and Profit Recovery's per-row **Review**. Lays out the full
opportunity math and confidence so the operator can decide to commit it (turn into a
pending action), dismiss, or snooze.

## Access — who & when
- **Primary user:** GM. **Secondary:** Owner.
- **When used:** when reviewing the day's top decision, or any ranked leak from
  Profit Recovery.

## Route & how it's reached
- From **Today** → "Review this decision".
- From **Profit Recovery** → per-row "Review".
- _Confirm whether it's a full screen or an overlay and the exact opener._

## Subpages
None.

## Page states
- **Success:** the opportunity with its math, confidence, and CTAs.
- _Confirm empty/blocked/not-found behavior._

## Components used
_Confirm — likely hero/value block, output-type tags, evidence drill-in._

## Data dependencies
- **Registries / fixtures:** `OPPORTUNITIES` / `getPortfolioTruth()`,
  `getOutputLabel()`. _Confirm._
- **Output types shown:** the opportunity is **estimated/open** until acted on and
  monitored.

## Doctrine specifics
A recovery opportunity here is **open exposure**, not recovered value — it must not
read as money already saved. Committing it starts the `OPEN → ACTIVE RECOVERY`
transition; only later verification counts toward ROI (`docs/doctrine.md`).

## Actions
| Trigger | Effect |
|---|---|
| Turn into Action / Review | Creates a pending action (→ Actions) _(confirm)_ |
| Dismiss / Snooze | Removes or defers the decision _(confirm)_ |

## Navigation in / out
- **In:** Today; Profit Recovery.
- **Out:** Actions (on commit); the source feature page. _Confirm._

## Edge cases
Degraded source → confidence/typing downgraded; sub-floor confidence → cannot act.
_Confirm._

## Responsive notes
Desktop primary. _Confirm._

## Related screens
Today, Profit Recovery, Actions, and the originating feature (Labor / Menu / Table
Turns / Kitchen Speed).

## Open questions
- Not separately spec'd in the v32 catalog. Fill from `recovery-detail.html`: DOM
  id, screen vs overlay, exact CTAs, components, and states.
