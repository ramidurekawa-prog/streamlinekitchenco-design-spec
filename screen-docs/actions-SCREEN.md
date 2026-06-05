# Actions — screen spec

> The lifecycle screen — tracks every detected leak from detection through active
> recovery to verified (or blocked / rolled back).

- **File:** `screens/actions.html`
- **DOM id:** `screen-actions` · **route:** `showScreen('actions', …)`
- **Group:** Operate
- **Status:** seeded · needs-reconciliation — the v32 catalog's 7-subpage tree has
  been **consolidated into one scrollable board** (per `DECISIONS.md`, 2026-06-03).
  Lifecycle content below is seeded faithfully from the catalog; the single-board
  layout details must be verified against `actions.html`.

## Purpose
Actions is the lifecycle screen — it tracks every detected leak from "Pending
Decision" through "Active Recovery" through "Verified" (or "Blocked" or "Rolled
back"). It exists because a GM with 4 locations has **10–20 actions in flight** at
any time and needs a single view of the queue. Detection ≠ commitment: every action
needs an operator decision before monitoring starts, runs a monitoring window, then
flips to Verified — the moment savings count toward ROI. The board gives the
operator total open exposure, the urgent items, and a one-click path to act on each.

## Access — who & when
- **Primary user:** GM. **Secondary:** Owner (weekly review; co-signs / approves
  high-$ items).
- **When used:** daily, often right after Today. Weekly ops-review meetings. Anytime
  Today references an action the operator wants to find. Owner during quarterly /
  audit review (lifecycle rules + History).

## Route & how it's reached
Sidebar item under **Operate**, via `showScreen('actions', …)`. Also reached as a
follow-through from feature pages that "pre-decide" an action (e.g. Labor → Staffing
Plan, Table Turns → Decide, Menu → Actions push the action into this queue) and from
Today references. Per-action **Open** opens the Action Detail surface.

## Subpages
The seven catalog subpages are now **lifecycle states rendered as columns / sections
of the single consolidated board** (4-column Kanban: Blocked → Ready → Monitoring →
Verified, plus a run-rate hero, a Proof section, and a condensed doctrine block).
They are no longer separate routed subpages. Listed here as the lifecycle content the
board must carry:

| Lifecycle state (now a board column/section) | Purpose | Default? |
|---|---|---|
| **Overview** | Cross-state summary of every action SKC is tracking: counts per state, top urgencies, recent transitions, total open exposure. | Was the default parent landing in the v32 tree; now expressed as the board's hero + LIVE line + overall layout. |
| **Pending Decisions** | Recoveries detected and turned into draft actions but **not yet approved**. The inbox of approve / dismiss / snooze choices; approval starts a **28-day monitoring window** by default. | No |
| **Active Recovery** | Actions inside their monitoring window: day count (e.g. "day 19 of 28"), live guardrail status, trajectory note. → board **Monitoring** column. | No |
| **Ready to Verify** | Trials whose 28-day window closed with all guardrails passing — awaiting one-click confirmation to flip to Verified. Highest-value moment in the lifecycle. → board **Ready** column. | No |
| **Blocked** | Actions that couldn't proceed (data source went stale, guardrail tripped, or operator paused). Each has a "fix to unblock" CTA. → board **Blocked** column. | No |
| **History** | Archive of every closed action — verified, rolled back, dismissed, or expired. Default view last 90 days; filterable by feature, location, date range, outcome. | No |
| **Evidence** | The lifecycle rulebook: what triggers Pending, what counts as Verified, what trips Blocked, guardrail thresholds, and LLM restrictions on action language. | No |

## Page states
- **Loading:** _TBD — verify against actions.html._
- **Empty / cold-start:** no actions in flight — _TBD — verify against actions.html._
- **Error / blocked:** when a data source degrades mid-flight, affected actions move
  to **Blocked** with a blocking reason ("KDS stale 36h" / "Avg check dropped 7%")
  and a contextual fix CTA. Catalog: an urgency banner appears if anything is in
  Ready-to-Verify or Blocked for **>24h**. _Confirm the live board surfaces this._
- **Success / populated:** the normal board — run-rate hero, LIVE line, action bar,
  and the four Kanban columns with action cards.

## Components used
- _TBD — verify against actions.html._ Expected: page shell/header (`page-hdr`),
  run-rate hero (`hero-card`), per-action cards (`item-card`), output-type tags,
  the 4-column board layout, and a condensed doctrine line. Evidence content uses
  the LE-Evidence-style expandable cards pattern.

## Data dependencies
- **Registries / fixtures:** `ACTIONS` (per-action state + getters that read source
  health), `getPortfolioTruth()` (open exposure / active recovery / verified
  rollups), `getOutputLabel()` / `STATUS_TO_OUTPUT_TYPE`. Counts flow to ROI Proof
  on verify. _Confirm exact board fixtures against actions.html / controllers.js._
- **Output types shown:** `open_opportunity` (OPEN · amber) for pending/detected;
  `active_recovery` (ACT · blue) for items in the monitoring window;
  `verified` (VER · green) for closed-and-counted; `unavailable` (N/A · red) for
  blocked-by-missing-source. Verified is the only type that counts toward ROI.
- **Sources gating confidence:** any of the 7 SKC sources (Toast, 7shifts, KDS,
  Recipe cost, Reviews, Accounting, Inventory) — a degraded source downgrades the
  action's type, shows the reason chip, and can push the action to Blocked.

## Doctrine specifics
This screen is the live home of the state machine: **`OPEN → ACTIVE RECOVERY →
VERIFIED`**, with any state able to go **`BLOCKED`** when a required source goes
stale, missing, or degraded mid-flight.
- **Pending Decisions** hold `open_opportunity` (EST · amber) drafts — approval
  moves them to Active Recovery and starts the 28-day window.
- **Active Recovery / Monitoring** items are `active_recovery` (ACT · blue) —
  estimated, not yet verified, never counted.
- **Ready to Verify → Verify** is the one-click, irreversible flip to `verified`
  (VER · green); only then does the value count toward ROI and flow to ROI Proof.
  Verification requires the monitoring window to complete with **all guardrails
  passing** (e.g. avg check / sentiment / complaints). A **Reject** sends it to
  Blocked for investigation.
- The presentation layer can never upgrade an estimate to verified; type and
  confidence flow from data → render. Consistent with [docs/doctrine.md](../docs/doctrine.md)
  and [docs/canonical-numbers.md](../docs/canonical-numbers.md). The board's run-rate
  hero / canonical board numbers were adopted verbatim from the mockups —
  _verify the exact figures against actions.html._

## Actions
| Trigger (button / interaction) | Effect |
|---|---|
| **Approve** (Pending) | Moves action to Active Recovery; starts the 28-day monitoring window |
| **Dismiss** (Pending) | Opens reason modal; removes from queue |
| **Snooze** (Pending) | Date picker; defers the action |
| **Pause monitoring** (Active Recovery) | Freezes the day count |
| **Roll back** (Active Recovery / Blocked) | Opens confirmation modal |
| **Verify** *(primary, Ready to Verify)* | Flips to Verified; count flows to ROI Proof (irreversible) |
| **Reject** (Ready to Verify) | Moves action to Blocked for investigation |
| **Fix block** (Blocked) | Jumps to the relevant Data Quality / Settings page |
| **Resume** (Blocked) | Available only when the block clears |
| **Filter** (History) | Date / feature / outcome / location chips |
| **Re-launch** (History) | Creates a new pending action |
| **Export** (History) | CSV download for finance |
| **Expand all / Collapse all** (Evidence) | Toggles the rule cards |
| Per-action **Open** | Opens the Action Detail surface |
| _Single-board controls (LIVE line, run-rate hero, action bar)_ | _TBD — verify against actions.html_ |

## Navigation in / out
- **In (how you arrive):** sidebar **Actions**; "pre-decided" hand-offs from Labor
  → Staffing Plan, Table Turns → Decide, Menu → Actions; references from Today.
- **Out (where buttons go):** per-action **Open** → Action Detail; **Verify** flows
  the count to **ROI Proof**; **Fix block** → **Data Quality / Settings**;
  **History → Export** → CSV.

## Edge cases
- Stale source mid-flight → action goes Blocked; some blocks resolve automatically
  when the source recovers, others need a manual fix.
- Verification is **one click but irreversible** — once verified, it counts.
- Catalog noted some surfaces are **phone read-only** because approval/verify
  require desktop — _confirm whether the live board enforces this._
- _Other edge cases (empty board, sub-floor confidence, anomalies) — verify against
  actions.html._

## Responsive notes
Desktop primary. Tablet works. Phone, per catalog: shows **top urgencies only** and
is **read-only for approval / verify** (those require desktop). _Verify the
consolidated board's actual responsive behavior against actions.html._

## Related screens
- **Action Detail** — the per-action drill-in behind every **Open**.
- **ROI Proof** — destination of verified counts.
- **Today** — surfaces the single highest-value pending decision that lives here.
- **Profit Recovery** — the ranked leak list that feeds Pending Decisions.
- **Data Quality / Settings** — where Blocked actions get fixed.
- Feature pages (**Labor → Staffing Plan**, **Table Turns → Decide**, **Menu →
  Actions**) — upstream creators of pending actions.

## Open questions
- **The live screen is now ONE scrollable board, not 7 subpages.** Per
  `DECISIONS.md` (2026-06-03), Actions was consolidated into a single board:
  **LIVE line → run-rate hero → action bar → 4-column Kanban
  (Blocked → Ready → Monitoring → Verified) → Proof → condensed doctrine.** The v32
  7-subpage layout (Overview · Pending Decisions · Active Recovery · Ready to Verify
  · Blocked · History · Evidence) no longer matches the UI; it survives here only as
  the lifecycle content the board must carry, and in `archive/Page-spec-docs.md`.
- **Verify the single-board details against `actions.html` (do not fabricate):**
  exact run-rate hero figures / canonical board numbers, the LIVE line and action-bar
  controls, how Overview/History/Evidence content is expressed (sections within the
  board vs. dropped), whether the **>24h** urgency banner still appears, the empty /
  loading / blocked states, component classes, and responsive behavior.
- Confirm whether **Pending Decisions** and **History** are represented on the board
  at all, or moved/removed in the consolidation.
- Reconcile this doc once the board is confirmed; until then keep **Status:
  needs-reconciliation**.
