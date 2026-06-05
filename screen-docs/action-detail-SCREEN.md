# Action Detail — screen spec

> The full detail surface for a single action: its lifecycle state, the math, and
> the available state transitions.

- **File:** `screens/action-detail.html`
- **DOM id:** _confirm_ · **route:** opened via `Open` from an action row
- **Group:** Operate (overlay surface, not a sidebar destination)
- **Status:** stub — verify against `action-detail.html`

## Purpose
Drill-in for one action — the per-action view behind the **Actions** board's
`Open`. Shows where the action sits in the lifecycle (`OPEN → ACTIVE RECOVERY →
VERIFIED`, or `BLOCKED`), the estimated-vs-measured dollars, guardrail status, and
the transitions available from the current state.

## Access — who & when
- **Primary user:** GM. **Secondary:** Owner (high-$ approvals/verifications).
- **When used:** whenever an action needs review, approval, verification, or
  unblocking.

## Route & how it's reached
Opened from an action row's **Open** on the Actions board, and from Today / Profit
Recovery references. _Confirm whether it's a full screen or an overlay and the exact
opener._

## Subpages
None.

## Page states
- **Success:** the action with its current state, math, and transitions.
- **Blocked:** blocking reason + "fix to unblock" CTA.
- _Confirm loading/empty/not-found behavior._

## Components used
_Confirm — likely the evidence/detail patterns and output-type tags._

## Data dependencies
- **Registries / fixtures:** `ACTIONS` (per-action state + getters that read source
  health), `getOutputLabel()`. _Confirm._
- **Output types shown:** estimated (in-flight) vs verified (closed) per state.

## Doctrine specifics
This surface is where a transition to **Verified** happens — the moment savings
count toward ROI. The presentation must never upgrade the type; verification is
gated by guardrails + source health (`docs/doctrine.md`).

## Actions
| Trigger | Effect |
|---|---|
| Approve / Verify / Reject / Roll back / Pause | State transitions on the action _(confirm exact set)_ |

## Navigation in / out
- **In:** `Open` from Actions board; references from Today / Profit Recovery.
- **Out:** back to Actions; Data Quality for blocks. _Confirm._

## Edge cases
Stale source → verification disabled; guardrail trip → Blocked. _Confirm._

## Responsive notes
Desktop primary. _Confirm._

## Related screens
Actions (parent), Today, Profit Recovery, Data Quality.

## Open questions
- Not separately spec'd in the v32 catalog. Fill from `action-detail.html`: DOM id,
  whether screen vs overlay, exact transitions, components, and states.
