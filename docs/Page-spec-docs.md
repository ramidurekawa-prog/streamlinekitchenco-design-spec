# SKC — Page Spec Catalog

> Every page in the app, with the 8 spec questions answered for each. Ordered as the sidebar nav reads. Subpages spec'd individually. The Table Turns v32 redesign (full detail) is preserved in **Appendix A** at the bottom.

## How to read this doc

For each page (and each subpage):

1. **Overview** — what the page is
2. **Why this page exists** — the problem it solves
3. **Ideal user(s)** — who uses it
4. **When they use it** — temporal context
5. **Where they access it** — devices, with responsive notes
6. **What it enables** — concrete actions a user can take
7. **How it works** — load behavior, states, data flow
8. **Buttons & flow** — key CTAs and where they go

## Quick map

| Group | Page | Subpages |
|---|---|---|
| Operate | Today | — |
| Operate | Actions | Overview · Pending Decisions · Active Recovery · Ready to Verify · Blocked · History · Evidence |
| Diagnose | Profit Recovery | — |
| Diagnose | Menu Optimization | Overview · Matrix · Mix Shift · Item Economics · Actions · Simulations · Evidence |
| Diagnose | Labor Efficiency | Overview · Heatmap · Staffing Plan · Benchmarks · Server Coaching · Evidence |
| Diagnose | Table Turns | Watch · Decide · Evidence *(see Appendix A for full v32 redesign spec)* |
| Diagnose | Kitchen Speed | — *(no sidebar entry; reached via Profit Recovery crosslinks)* |
| Prove | ROI Proof | — |
| Prove | Operating System | — |
| Prove | Reports | — |
| System | Data Quality | — *(opens Settings screen on the Data Quality tab)* |
| System | Settings | — |

---

# OPERATE

## Today

**Group:** Operate · **File:** `screens/today.html` · **DOM id:** `screen-home`

| | |
|---|---|
| **Overview** | The single-decision landing screen. Surfaces today's highest-value recovery decision (one card, big), recent monitoring updates, and an "Ask SKC why" panel. The home screen on login. |
| **Why this page exists** | Operators don't want a 20-tile dashboard at 7am. They want one thing to do today. Today filters the entire portfolio down to the one decision that matters most right now. |
| **Ideal user(s)** | Primary: GM. Secondary: Owner doing a morning check. Not the target: engineer, auditor. |
| **When they use it** | First thing in the morning (highest-frequency entry point). Also after lunch service for pre-dinner update. Often the only page they open if nothing's pressing. |
| **Where they access it** | Desktop (manager's laptop) primary. Tablet works full-layout. Phone shows just the top decision card with a "see details" link. |
| **What it enables** | (1) See today's #1 recovery decision · (2) Drill into the decision (→ Recovery Detail) · (3) Dismiss / snooze · (4) See active monitoring updates · (5) Ask Claude why this is the priority |
| **How it works** | Loads with the highest-value pending decision from `getPortfolioTruth()` (which ranks Profit Recovery opportunities). Pulls live status of in-flight monitoring trials from Actions. Ask panel queries the LLM with structured context. States: Full / Empty (no decisions today) / Blocked (data sources down → "Connect X" CTA). |
| **Buttons & flow** | **Review this decision** → Recovery Detail overlay. **Ask SKC why** → opens ask panel. **Snooze 24h** → dismisses for the day. **See all opportunities** → Profit Recovery. |

---

## Actions

**Group:** Operate · **File:** `screens/actions.html` · **DOM id:** `screen-actions` · **7 subpages**

### Parent overview

Actions is the lifecycle screen — tracks every detected leak from "Pending Decision" through "Active Recovery" through "Verified" (or "Blocked" or "Rolled back"). Seven subpages organize the queue by state, plus an Evidence reference. The Actions parent route lands on the Overview subpage by default.

### Actions · Overview

| | |
|---|---|
| **Overview** | Cross-state summary of every action SKC is tracking. Counts per state (pending / active / ready / blocked / verified), top urgencies, recent transitions. |
| **Why this page exists** | A GM with 4 locations has 10–20 actions in flight at any time. They need a single view of the queue without clicking into each state. |
| **Ideal user(s)** | Primary: GM. Secondary: Owner doing weekly review. |
| **When they use it** | Daily morning (after Today). Weekly ops review meetings. When something on Today references an action they want to find. |
| **Where they access it** | Desktop primary. Tablet works. Phone shows top urgencies only. |
| **What it enables** | (1) See total open exposure across all in-flight actions · (2) Spot urgent items (Ready to Verify, Blocked) · (3) Jump to specific state subpages · (4) Open a specific action |
| **How it works** | Loads with current portfolio state. Strip cells show counts per state. Urgency banner appears if anything is in Ready-to-Verify or Blocked for >24h. |
| **Buttons & flow** | **Open Pending / Active / Ready / Blocked / History** → respective subpage. Per-action **Open** → Action Detail overlay. |

### Actions · Pending Decisions

| | |
|---|---|
| **Overview** | Queue of recoveries that have been detected and turned into draft actions but not yet approved by the operator. |
| **Why this page exists** | Detection ≠ commitment. Every action needs an operator decision before monitoring starts. Pending is the inbox of "approve / dismiss" choices. |
| **Ideal user(s)** | Primary: GM. Secondary: Owner approving high-$ items. |
| **When they use it** | Daily, often first thing after Today. Or when an action is "pre-decided" from a feature page (Decide / Staffing Plan). |
| **Where they access it** | Desktop primary. Tablet works. Phone read-only — approval requires desktop. |
| **What it enables** | (1) Review each pending action with full math · (2) Approve → moves to Active Recovery · (3) Dismiss with a reason · (4) Snooze to a later date |
| **How it works** | Queue sorted by $ impact desc. Each row shows source feature (Labor / Menu / Table Turns / Kitchen Speed), $ estimate, confidence, owner. Approval starts a 28-day monitoring window by default. |
| **Buttons & flow** | **Approve** → moves to Active Recovery. **Dismiss** → opens reason modal. **Snooze** → date picker. **Open** → Action Detail. |

### Actions · Active Recovery

| | |
|---|---|
| **Overview** | Actions currently inside their monitoring window. Each shows day count (e.g., "day 19 of 28"), live guardrail status, and trajectory. |
| **Why this page exists** | Recovery is a 28-day process, not an instant. Active Recovery is where the operator watches the trial play out and intervenes if guardrails trip. |
| **Ideal user(s)** | Primary: GM. Secondary: Training coach when an action involves staff behavior. |
| **When they use it** | Daily glance for guardrail health. Weekly ops review. End of shift if a guardrail-relevant signal showed up (low check, complaint). |
| **Where they access it** | Desktop primary. Tablet for on-floor checks. Phone read-only. |
| **What it enables** | (1) See live guardrail status per trial · (2) Pause a monitoring window manually · (3) Read the trial's "trajectory note" (is it tracking to verify?) · (4) Roll back if a guardrail trips |
| **How it works** | Each row shows source feature, day X of 28, $ in-progress, guardrails (avg check / sentiment / complaints). Color-coded: green stable, amber drift, red tripped. |
| **Buttons & flow** | **Pause monitoring** → freezes day count. **Roll back** → opens confirmation modal. **Open** → Action Detail. |

### Actions · Ready to Verify

| | |
|---|---|
| **Overview** | Trials whose 28-day window has closed with all guardrails passing — awaiting one-click operator confirmation to flip to "Verified." |
| **Why this page exists** | Verification is the moment savings count toward ROI. The operator confirms the math + guardrails held. This is the highest-value moment in the lifecycle. |
| **Ideal user(s)** | Primary: GM. Secondary: Owner co-signs high-$ verifications. |
| **When they use it** | Whenever Today or Actions Overview surfaces a "Ready to Verify" item. Doesn't sit here long — verify same day. |
| **Where they access it** | Desktop primary. The actual verify-click should happen at desktop. |
| **What it enables** | (1) Review the final delta (estimated vs verified $) · (2) Confirm → flips to Verified, adds to ROI Proof · (3) Reject if math looks off → goes to Blocked for investigation |
| **How it works** | Each row shows estimated $ vs measured $, guardrail recap, and "all green" confirmation. Verification is one click but irreversible. |
| **Buttons & flow** | **Verify** *(primary)* → moves to Verified, count flows to ROI Proof. **Reject** → moves to Blocked. **Open** → Action Detail. |

### Actions · Blocked

| | |
|---|---|
| **Overview** | Actions that couldn't proceed because a data source went stale, a guardrail tripped, or the operator paused. Each has a "fix to unblock" CTA. |
| **Why this page exists** | Blocked isn't failure — it's pending. The operator needs to know what to fix so the action can resume. |
| **Ideal user(s)** | Primary: GM. Secondary: Whoever owns the blocking system (e.g., IT for KDS, AP for payroll). |
| **When they use it** | When Actions Overview shows the red "Blocked > 24h" banner. Or when a guardrail trips during Active Recovery. |
| **Where they access it** | Desktop primary. Often involves a Data Quality jump. |
| **What it enables** | (1) See what's blocking each action · (2) Jump to the fix (Data Quality, Settings) · (3) Roll back the action if the block is unfixable · (4) Resume once the block clears |
| **How it works** | Each row shows blocking reason ("KDS stale 36h" / "Avg check dropped 7%") and a contextual fix CTA. Some blocks resolve automatically when the source recovers. |
| **Buttons & flow** | **Fix block** → relevant Data Quality / Settings page. **Roll back** → confirmation modal. **Resume** → only available when block clears. |

### Actions · History

| | |
|---|---|
| **Overview** | Archive of every closed action — verified, rolled back, dismissed, or expired. Filterable by feature, location, date range, outcome. |
| **Why this page exists** | Operators need to look back. "Did we ever try that Tuesday dinner cut? What happened?" History is the answer. |
| **Ideal user(s)** | Primary: GM. Secondary: Owner during quarterly review. Auditor. |
| **When they use it** | Ad-hoc when a question comes up. Quarterly ops review. When deciding whether to re-attempt a previously-rolled-back action. |
| **Where they access it** | Desktop primary. |
| **What it enables** | (1) Search/filter past actions · (2) View full lifecycle of any past action · (3) Re-launch a dismissed action · (4) Export to CSV for finance |
| **How it works** | Default view: last 90 days. Filter chips for outcome and feature. Each row links to Action Detail with the historical lifecycle intact. |
| **Buttons & flow** | **Filter** → date / feature / outcome / location chips. **Re-launch** → creates a new pending action. **Export** → CSV download. |

### Actions · Evidence

| | |
|---|---|
| **Overview** | The rules for action lifecycle: what triggers Pending, what counts as Verified, what trips Blocked, what the LLM can and can't do. |
| **Why this page exists** | Auditors, owners, and engineers need to defend the lifecycle math. Evidence is the rulebook. |
| **Ideal user(s)** | Primary: Owner / CFO. Secondary: Engineer, auditor. |
| **When they use it** | Quarterly review. When a verification is contested. During onboarding. |
| **Where they access it** | Desktop primary. Reference doc. |
| **What it enables** | (1) Read state-transition rules · (2) See guardrail thresholds · (3) See LLM restrictions for action language · (4) Look up specific status definitions |
| **How it works** | Static reference. Cards organized by lifecycle stage. Uses LE-Evidence-style expandable details. |
| **Buttons & flow** | **Expand all / Collapse all**. Per-card chevron expand. **← Back to Actions Overview**. |

---

# DIAGNOSE

## Profit Recovery

**Group:** Diagnose · **File:** `screens/profit-recovery.html` · **DOM id:** `screen-leaks`

| | |
|---|---|
| **Overview** | The ranked leak list. Every detected recovery opportunity across all features (Labor, Menu, Table Turns, Kitchen Speed) ranked by $ value, confidence, and verification readiness. The portfolio truth view. |
| **Why this page exists** | The feature pages (Labor / Menu / etc.) each diagnose within their own domain. Profit Recovery is the cross-feature ranking — "what's the biggest recoverable dollar across everything." |
| **Ideal user(s)** | Primary: GM. Secondary: Owner. Tertiary: Anyone planning a quarterly review. |
| **When they use it** | When Today's top decision doesn't feel right and they want to see the full ranked list. Weekly portfolio review. When prioritizing the next 2–3 actions. |
| **Where they access it** | Desktop primary. Tablet works. Phone shows top 5 only. |
| **What it enables** | (1) See ranked leak list with $ + confidence per row · (2) Drill into a leak (→ feature page or Recovery Detail) · (3) Compare cross-feature opportunities · (4) See portfolio total |
| **How it works** | Loads from `getPortfolioTruth()` — sums Open Exposure, Active Recovery, Verified. Each row labeled with output type (DET / EST / VER) and color-coded per doctrine. Stale-source warnings inline. |
| **Buttons & flow** | Per-row **Review** → Recovery Detail. **Open in [Feature]** → respective feature page (Labor / Menu / etc.). **Ask SKC why** → ask panel. |

---

## Menu Optimization

**Group:** Diagnose · **File:** `screens/menu-optimization.html` · **DOM id:** `screen-menu` · **7 subpages**

### Parent overview

Menu Optimization analyzes the menu's profit structure — which items are Stars (high CM, high popularity), Plowhorses (low CM, high popularity), Puzzles (high CM, low popularity), Dogs (low CM, low popularity). Surfaces specific actions: reprice, redesign, retire. Default subpage: Overview.

### Menu · Overview

| | |
|---|---|
| **Overview** | Single-screen summary of menu profit health. Mix-shift $ exposure, the worst Plowhorse, the highest-impact action, guardrail status. |
| **Why this page exists** | Operators need to know "is my menu costing me money this week?" without learning matrix theory. |
| **Ideal user(s)** | Primary: GM. Secondary: Chef collaborating on menu decisions. |
| **When they use it** | Weekly menu review. Before menu print runs. When a Plowhorse trend is flagged on Today. |
| **Where they access it** | Desktop primary. Tablet works. |
| **What it enables** | See the headline mix-shift $, the worst-performing item, the recommended action, jump into Matrix / Mix Shift / Item Economics. |
| **How it works** | Reads from canonical menu fixtures. Headline = monthly mix-shift exposure (~$1,420/mo demo). Recipe-cost staleness shown if applicable. |
| **Buttons & flow** | **Open Matrix / Mix Shift / Items / Simulations** → respective subpages. **Turn into Action** → creates pending action. |

### Menu · Matrix

| | |
|---|---|
| **Overview** | The classic 2×2 (Star / Plowhorse / Puzzle / Dog) plot. Each menu item placed by contribution margin (y-axis) and popularity (x-axis). |
| **Why this page exists** | Menu engineering is a known framework operators already understand. The matrix is the visual anchor for menu decisions. |
| **Ideal user(s)** | Primary: GM + Chef. Secondary: Owner. |
| **When they use it** | Monthly menu engineering session. Before menu prints. When deciding what to drop. |
| **Where they access it** | Desktop primary — the plot needs screen real estate. |
| **What it enables** | (1) See every item plotted · (2) Click an item to see economics · (3) Filter by daypart, station, category · (4) Spot quadrant clusters |
| **How it works** | Plots items from Toast POS sales × recipe-cost data. CM threshold $8.75, popularity threshold 8%. Items below CM threshold = Plowhorse/Dog. Items above popularity threshold = Star/Plowhorse. |
| **Buttons & flow** | Click an item → Item Economics card. **Filter** → daypart / station / category. **Open Mix Shift** → next-level analysis. |

### Menu · Mix Shift

| | |
|---|---|
| **Overview** | Tracks how the item mix has changed over time — what's selling more / less than before — and surfaces the $ impact. |
| **Why this page exists** | Static matrix is a snapshot. Mix Shift shows the trend: is the menu drifting toward Plowhorses? Is a Star losing ground? |
| **Ideal user(s)** | Primary: GM. Secondary: Chef. |
| **When they use it** | Monthly review. After a menu change to see if it worked. When Today flags a mix-shift trend. |
| **Where they access it** | Desktop primary. |
| **What it enables** | (1) See mix change over a chosen window · (2) See $ impact of the shift · (3) Identify which items are gaining / losing share · (4) Project the trend forward |
| **How it works** | Computes per-item share over rolling windows. $0.71 per item × 2,004 items in the 28-day window = ~$1,420/mo exposure (canonical demo). |
| **Buttons & flow** | **Window selector** (7d / 28d / custom). Click item → Item Economics. **Open Simulations** → what-if pricing. |

### Menu · Item Economics

| | |
|---|---|
| **Overview** | Per-item P&L. Sales, food cost, contribution margin, modifier capture, recent trend. The deep-dive view for a single item. |
| **Why this page exists** | When the operator wants to make a call on one item (reprice the salmon, retire the steak frites), they need the full picture for that item. |
| **Ideal user(s)** | Primary: Chef. Secondary: GM. |
| **When they use it** | When a specific item is flagged on Matrix or Mix Shift. Before deciding on price or recipe changes. |
| **Where they access it** | Desktop primary. |
| **What it enables** | (1) See per-item full P&L · (2) See modifier attach rate · (3) See recent sales trend · (4) Launch a simulation · (5) Create a menu action |
| **How it works** | Loads from Toast sales + recipe-cost upload. If recipe cost > 18 days stale, surfaces a warning + caps confidence. |
| **Buttons & flow** | **Simulate reprice / redesign** → Simulations. **Turn into Action** → pending menu action. **Back to Matrix** → returns with this item highlighted. |

### Menu · Actions

| | |
|---|---|
| **Overview** | Queue of menu-specific pending actions (reprice salmon, retire dish X, redesign Y). Bridge between menu diagnosis and the cross-feature Actions screen. |
| **Why this page exists** | Menu actions have unique guardrails (don't reprice during a promo, don't retire a chef-favorite without sign-off). Menu Actions houses the menu-specific logic before kicking the action over to the global Actions queue. |
| **Ideal user(s)** | Primary: GM + Chef together. |
| **When they use it** | After a Matrix or Item Economics deep-dive surfaces an action. |
| **Where they access it** | Desktop primary. |
| **What it enables** | (1) Review menu-specific actions · (2) Add chef sign-off · (3) Push to global Actions queue · (4) Bundle multiple menu changes into one menu-print cycle |
| **How it works** | Menu-specific actions live here until the operator commits — then they move to global Actions as "pending decision." |
| **Buttons & flow** | **Commit to Actions** → moves to global Actions. **Bundle** → groups multiple. **Math** → Item Economics for that item. |

### Menu · Simulations

| | |
|---|---|
| **Overview** | What-if scenarios for menu changes. "If I raise salmon by $1.50, what happens to attach rate, CM, and total revenue?" |
| **Why this page exists** | Menu changes have second-order effects. Simulations model those before committing. |
| **Ideal user(s)** | Primary: Chef + GM. Secondary: Owner reviewing the change. |
| **When they use it** | Before submitting a menu reprice or redesign. During pricing strategy planning. |
| **Where they access it** | Desktop primary — the simulation UI needs space. |
| **What it enables** | (1) Test a reprice and see projected CM · (2) Test a retire and see mix-shift impact · (3) Test a new dish slot and see cannibalization · (4) Compare multiple scenarios side-by-side |
| **How it works** | Uses elasticity assumptions per item category. Confidence depends on sample size and assumption strength. Outputs always labeled `[SIMULATION]`. |
| **Buttons & flow** | **Run** → computes scenario. **Save** → adds to comparison. **Commit to Action** → turns the simulation into a pending menu action. |

### Menu · Evidence

| | |
|---|---|
| **Overview** | The rules: how CM is computed, what data feeds the matrix, popularity thresholds, elasticity assumptions, LLM restrictions. |
| **Why this page exists** | When a menu number is contested, Evidence is the rulebook. |
| **Ideal user(s)** | Primary: Owner / CFO. Secondary: Engineer, chef wanting to understand methodology. |
| **When they use it** | When a number looks wrong. During audit. Onboarding. |
| **Where they access it** | Desktop primary. |
| **What it enables** | Read every menu-side formula and data source. See exclusions and confidence rules. |
| **How it works** | LE-Evidence-style expandable cards organized into sections (Formula, Filters, Confidence, LLM restrictions). |
| **Buttons & flow** | **Expand all / Collapse all**. Per-card expand. **← Back to Overview**. |

---

## Labor Efficiency

**Group:** Diagnose · **File:** `screens/labor-efficiency.html` · **DOM id:** `screen-labor-efficiency` · **6 subpages**

### Parent overview

Labor Efficiency surfaces shifts where labor cost is outpacing sales. Six subpages: Overview (glance), Heatmap (hourly grid), Staffing Plan (recommended cuts), Benchmarks (peer comparison), Server Coaching (3-axis radar per server), Evidence (rules). Default: Overview.

### Labor · Overview

| | |
|---|---|
| **Overview** | The 5-second labor view. Largest current leak (Oakland Tue Dinner ~$370/wk), mini heatmap preview, recommended action, monitoring status. |
| **Why this page exists** | Operators want the labor headline without learning heatmap-reading. |
| **Ideal user(s)** | Primary: GM. Secondary: Owner. |
| **When they use it** | Daily (after Today). When labor cost % goes red. |
| **Where they access it** | Desktop primary. Tablet works. Phone collapsed. |
| **What it enables** | See top leak, preview heatmap, see recommended action, jump to Staffing Plan or Heatmap. |
| **How it works** | Loads with the highest-$ labor leak. Strip cells show portfolio labor %, RPLH, extra hours/wk, pending recs, confidence (with stale-source warnings inline). |
| **Buttons & flow** | **Open Heatmap / Staffing Plan / Evidence** → respective subpages. **Turn into Action** → pending labor action. |

### Labor · Heatmap

| | |
|---|---|
| **Overview** | Hour-by-hour grid showing how each hour's RPLH compares to the same-daypart benchmark. Red cells = labor outpacing sales. |
| **Why this page exists** | The matrix is portfolio-wide; the heatmap is granular. It's where managers spot the exact bad hour. |
| **Ideal user(s)** | Primary: GM. Secondary: Operations-minded owner. |
| **When they use it** | When the Overview surfaces a leak and the manager wants to see "which hour exactly." Before scheduling decisions. |
| **Where they access it** | Desktop primary — the grid is dense. Tablet works. |
| **What it enables** | (1) See every hour color-coded · (2) Click a cell for details · (3) Toggle period (this wk / last 30) · (4) Filter location / daypart / severity |
| **How it works** | Renders 7-day × 12-hour grid. Score 85+ green, 70–84 amber, <70 red. Empty states for missing data, missing payroll, no baseline, no issues. |
| **Buttons & flow** | Click cell → side detail panel. **Connect payroll** → Data Quality if wage data missing. **Open Staffing Plan** → recommendations. |

### Labor · Staffing Plan

| | |
|---|---|
| **Overview** | Specific recommended staffing changes (cut 1 FOH from Tue dinner Oakland) with confidence tier and $ impact. The action page for labor. |
| **Why this page exists** | The heatmap shows the gap; Staffing Plan turns it into a specific staff-by-staff recommendation a GM can act on. |
| **Ideal user(s)** | Primary: GM. Secondary: Owner approving cuts. |
| **When they use it** | After a Heatmap drill-in. Before weekly schedule publish. |
| **Where they access it** | Desktop primary. Tablet works. |
| **What it enables** | (1) See recommended cuts per shift · (2) Bulk-apply ready-tier · (3) Single-apply per playbook · (4) See guardrails and wage assumptions |
| **How it works** | Sorted by $ exposure. Three confidence tiers (ready / review / too-low). Wage assumptions editable in Settings. |
| **Buttons & flow** | **Apply N actions · $X/wk** *(primary, ready tier only)*. **Turn into Action** per row. **View in Heatmap** → returns to Heatmap focused on that shift. |

### Labor · Benchmarks

| | |
|---|---|
| **Overview** | Peer comparison of labor performance across the operator's locations vs top-quarter peer benchmark. RPLH per location, labor% per location, "closing the gap" calculator. |
| **Why this page exists** | Operators want to know "are we good or bad relative to peers like us?" Benchmarks answers without generating direct dollar recoveries (those live in Staffing Plan). |
| **Ideal user(s)** | Primary: Owner. Secondary: GM. |
| **When they use it** | Monthly / quarterly review. When deciding whether the labor situation is a one-off or a systemic issue. |
| **Where they access it** | Desktop primary. |
| **What it enables** | See location-by-location vs peer benchmark, see threshold rules, see illustrative closing-the-gap math. |
| **How it works** | Compares against top-quarter East Bay peers (42 locations, last 90 days, refreshed quarterly). Closing-the-gap math is illustrative only — not a Staffing Plan substitute. |
| **Buttons & flow** | **See in Heatmap** / **Open Staffing Plan** / **Full methodology in Evidence**. |

### Labor · Server Coaching

| | |
|---|---|
| **Overview** | Three-axis (Revenue / Retention / Reliability) scoring per server. Identifies coaching opportunities and standout performers. Tip% deliberately excluded. |
| **Why this page exists** | Server-level coaching, separate from staffing decisions. Built to support coaching conversations — not scheduling or discipline (those are forbidden per Terms of Service). |
| **Ideal user(s)** | Primary: GM. Secondary: Training coach, FOH lead. |
| **When they use it** | Before weekly server huddles. When pairing new hires with top performers. When investigating a structural concern. |
| **Where they access it** | Desktop primary. |
| **What it enables** | (1) See servers ranked into 5 patterns (Triple / Revenue / Hospitality / Coaching / Structural) · (2) Filter by pattern · (3) Open a server's detail · (4) Read the coaching-only guardrail |
| **How it works** | Scores from Toast POS data. Min 12 shifts in 60 days, min 3 peer servers required. Middle 50% deliberately hidden. Tip% deliberately excluded (correlates with section, not service quality). |
| **Buttons & flow** | **Pattern filter buttons** (all / triple / revenue / hospitality / coaching / structural). Per-server card → coaching detail. |

### Labor · Evidence

| | |
|---|---|
| **Overview** | The labor rulebook: formulas, source health, confidence thresholds, verification guardrails, server-coaching methodology, use restrictions, LLM restrictions. |
| **Why this page exists** | When a labor number is contested or a verification fails, Evidence is where the rule lives. |
| **Ideal user(s)** | Primary: Owner / CFO. Secondary: Engineer, auditor. |
| **When they use it** | Quarterly review. When verifying a recovery. During audit. |
| **Where they access it** | Desktop primary. |
| **What it enables** | Read every labor formula, see source freshness rules, understand confidence math, see what the LLM can and can't do. |
| **How it works** | TOC + 4 sections (Detection / Verification / Server Coaching / Trust & Safety) with expandable cards. |
| **Buttons & flow** | **Expand all / Collapse all**. TOC anchor links. Per-card expand. |

---

## Table Turns

**Group:** Diagnose · **File:** `screens/table-turns.html` · **DOM id:** `screen-table-turns` · **3 subpages** *(see Appendix A for full v32 redesign detail)*

### Parent overview

Table Turns surfaces services where dining duration is running over target and turns the overage into recoverable revenue estimates. Three subpages: Watch (daily view), Decide (playbook comparison), Trust (math + rules). Default: Watch.

### Table Turns · Watch *(was Overview)*

| | |
|---|---|
| **Overview** | The single-viewport story: what's wrong (Fri dinner 18 min long), where the time goes (Stage 4 is the bottleneck), what to do (dessert at 60 min), is it safe (guardrails green). Hour-by-hour toggle in the middle panel. |
| **Why this page exists** | The daily landing page for Table Turns. Tells the whole story in 5 seconds. Replaces what used to be Overview + Stage Flow + Lost Covers + parts of Playbooks. |
| **Ideal user(s)** | Primary: GM. Secondary: Owner skimming. |
| **When they use it** | Daily, often briefly. Before service prep. End of shift. |
| **Where they access it** | Desktop primary. Tablet works. Phone stacks; hour-by-hour toggle desktop/tablet only. |
| **What it enables** | Summary line + strip + 3 panels (Why / Where / What+Safe). Hour-by-hour toggle in place. Service picker. Two primary CTAs. |
| **How it works** | Loads with Fri dinner Oakland (canonical demo). KDS feed status in header. Strip cells in plain English. Doctrine-compliant per-stage detail when KDS connected. |
| **Buttons & flow** | **Decide / Trust** in header. **Turn into Action** → Decide. **See full math** → Trust. **Hour-by-hour toggle** in-page. **Service picker** dropdown. |

### Table Turns · Decide *(was Playbooks)*

| | |
|---|---|
| **Overview** | All playbook options for the selected service, ranked. Bulk-apply for ready tier, single-apply per playbook, plan totals and guardrails sidebar. |
| **Why this page exists** | Watch shows one recommended action; Decide shows all 2–4 options with confidence and cost. Where managers commit. |
| **Ideal user(s)** | Primary: GM. Secondary: Owner approving, training coach planning huddle. |
| **When they use it** | After Watch surfaces a problem. Thursday/Friday morning for weekend playbook commit. |
| **Where they access it** | Desktop primary. Bulk-apply desktop+tablet only. |
| **What it enables** | (1) See all options ranked · (2) Apply one or many · (3) See combined plan totals · (4) See guardrails reference |
| **How it works** | Sorted by $ impact. 3 tiers (≥70% ready, 70–79% review, <70% too-low). $68 gap disclaimer in plan totals. |
| **Buttons & flow** | **Apply N actions · $X/wk** *(primary, ready tier)*. **Turn into Action** per playbook. **Math** → Trust. **← Watch / Trust** header. |

### Table Turns · Evidence *(merged Lost Covers + Evidence)*

| | |
|---|---|
| **Overview** | LE-Evidence-style reference page: TOC + 3 numbered sections (Math, Rules, Restrictions) with expandable cards. Absorbs the old Lost Covers formula trace. |
| **Why this page exists** | The credibility backstop. When the $680 is contested, when a verification fails, when an auditor asks how the math works. |
| **Ideal user(s)** | Primary: Owner / CFO. Secondary: Engineer, auditor. |
| **When they use it** | Quarterly review. When a number looks wrong. Engineer onboarding. |
| **Where they access it** | Desktop primary. |
| **What it enables** | Read the full formula trace, see inputs and exclusions, see the $68 gap explanation, see KDS vs Proxy rules, see guardrails, see LLM restrictions. |
| **How it works** | Static reference. Cards default collapsed. Expand all / Collapse all toolbar. Anchored TOC. |
| **Buttons & flow** | **Expand all / Collapse all**. TOC anchor links. **← Watch / Decide** header. |

---

## Kitchen Speed

**Group:** Diagnose · **File:** `screens/kitchen-speed.html` · **DOM id:** `screen-throughput` · *(no sidebar entry — reached via Profit Recovery crosslinks)*

| | |
|---|---|
| **Overview** | Ticket-time analysis from KDS. Shows where ticket times are running over baseline (e.g., Friday lunch at Berkeley). Aggregate signal only — station-level root cause requires on-site observation. |
| **Why this page exists** | Kitchen speed is one of the four leak feeders (with Labor, Menu, Table Turns) into Profit Recovery. Has its own diagnostic surface because the ticket-time math is distinct. |
| **Ideal user(s)** | Primary: GM. Secondary: Chef de cuisine. |
| **When they use it** | When Profit Recovery surfaces a throughput leak. When tickets feel slow on a recurring shift. |
| **Where they access it** | Desktop primary. |
| **What it enables** | (1) See ticket-time trend per location / daypart · (2) See $ exposure ($354/wk Friday Lunch canonical) · (3) Schedule a kitchen-line observation · (4) Jump to Settings if KDS connection is partial |
| **How it works** | Computes (excess ticket min × covers / turn duration) × avg party × avg check. Aggregate only — does not break down by station. Confidence currently 64% (KDS partial → −16 pts). |
| **Buttons & flow** | **Schedule observation** → ops calendar (demo: toast). **Fix KDS connection** → Data Quality. **← Profit Recovery** header. |

---

# PROVE

## ROI Proof

**Group:** Prove · **File:** `screens/roi-proof.html` · **DOM id:** `screen-scorecard`

| | |
|---|---|
| **Overview** | The owner-ready scorecard. Verified savings only — guardrail-safe monitored recovery that has closed its window. The provable number. |
| **Why this page exists** | Operators need a "this is what SKC made you" number they can show partners / investors / themselves. ROI Proof is that number, with the math behind it. |
| **Ideal user(s)** | Primary: Owner. Secondary: GM presenting to owner / partners. |
| **When they use it** | Monthly close. Quarterly review. Whenever someone asks "is this software worth it?" |
| **Where they access it** | Desktop primary. Tablet for presenting. |
| **What it enables** | (1) See total verified savings last 30 days · (2) Drill into per-action verifications · (3) Export to PDF for owners · (4) See what's in flight (Active Recovery) separately from what's counted |
| **How it works** | Pulls only Verified-state actions. Active Recovery and Open Exposure shown separately so they never inflate the verified number. Per-action audit trail visible. |
| **Buttons & flow** | **Export PDF** *(primary)* → download. Per-action **View audit trail**. **Ask SKC why** → ask panel. |

---

## Operating System

**Group:** Prove · **File:** `screens/operating-system.html` · **DOM id:** `screen-operating-system`

| | |
|---|---|
| **Overview** | The narrative page that explains the "AI Restaurant Profit Manager" loop: how SKC turns detected leaks into verified value, operator habit, GM upside, and compounding restaurant memory. Marketing-grade product story for owners. |
| **Why this page exists** | Owners and prospective customers need to understand what SKC *is* before they trust the dashboards. Operating System is the product story page. |
| **Ideal user(s)** | Primary: Owner during onboarding / renewal. Secondary: Prospect during demo. |
| **When they use it** | Onboarding week. Renewal conversations. When demoing to a partner. |
| **Where they access it** | Desktop primary. Tablet for demos. |
| **What it enables** | (1) Read the SKC retention-loop framing · (2) Open drawers for each loop stage (Detect / Decide / Monitor / Verify / Memorize) · (3) See the digest, GM upside, memory features |
| **How it works** | Static narrative + interactive drawers. Drawers explained: Digest, GM upside, Review, Memory, Detectors, Renewal. |
| **Buttons & flow** | Per-drawer **Open / Close**. Cross-links to ROI Proof, Today, Profit Recovery. |

---

## Reports

**Group:** Prove · **File:** `screens/reports.html` · **DOM id:** `screen-reports`

| | |
|---|---|
| **Overview** | Owner-ready weekly summary report: verified wins, active recovery, open exposure, per-location breakdown, what changed. The "GM-to-owner" weekly artifact. |
| **Why this page exists** | Owners want a regular cadence summary. Operators want a one-click weekly report they don't have to assemble. Reports closes that loop. |
| **Ideal user(s)** | Primary: Owner reading. Secondary: GM generating / scheduling. |
| **When they use it** | Weekly (Monday morning typically). Monthly aggregate. Quarterly for board meetings. |
| **Where they access it** | Desktop primary for generation. Email / PDF for consumption (any device). |
| **What it enables** | (1) Generate this-week report on demand · (2) Schedule recurring (weekly / monthly) · (3) Customize sections · (4) Export PDF · (5) Send via email |
| **How it works** | Pulls from Verified actions (counted), Active Recovery (in-progress), Profit Recovery (open exposure). Auto-scheduled reports send Mondays 7 AM ET. |
| **Buttons & flow** | **Generate now** *(primary)*. **Schedule** → recurring settings. **Export PDF**. **Send via email**. |

---

# SYSTEM

## Data Quality

**Group:** System · **File:** `screens/settings.html` · **DOM id:** `screen-settings` · *(opens Settings file on Data Quality view)*

| | |
|---|---|
| **Overview** | Source-by-source freshness, missing inputs, and confidence impact across every SKC recommendation. The "is our data healthy?" dashboard. |
| **Why this page exists** | Every confidence score depends on data freshness. When a number drops (Labor confidence 78% instead of 85%), the operator needs to know why and what to fix. Data Quality is that diagnosis. |
| **Ideal user(s)** | Primary: GM. Secondary: IT / ops admin owning integrations. |
| **When they use it** | When a confidence score drops. When a "Connect X to unlock" CTA appears anywhere in the app. Weekly health check. |
| **Where they access it** | Desktop primary. |
| **What it enables** | (1) See per-source freshness (Toast POS, 7shifts, KDS, etc.) · (2) See which recommendations are degraded and by how much · (3) Trigger a refresh · (4) Reconnect a broken integration |
| **How it works** | Lists all 7 SKC sources with status (live / partial / stale / disconnected) and a confidence-impact column per affected feature. Refresh and reconnect CTAs inline. |
| **Buttons & flow** | Per-source **Refresh** / **Reconnect** / **Open integration**. **Open Settings (general)** for non-data config. |

---

## Settings

**Group:** System · **File:** `screens/settings.html` · **DOM id:** `screen-config`

| | |
|---|---|
| **Overview** | Workspace configuration: team access, alert thresholds, billing, integration tokens, custom assumptions (wage rates, seat capacity, etc.). |
| **Why this page exists** | Every operator's restaurant is different. Settings is where operator-specific assumptions live — and where billing / team / billing happens. |
| **Ideal user(s)** | Primary: Owner / admin. Secondary: GM for operational settings (wage rates, alert thresholds). |
| **When they use it** | Onboarding. When adding a new location. Monthly billing review. When a Staffing Plan wage assumption needs updating. |
| **Where they access it** | Desktop primary. Some basic settings work on tablet. Mobile read-only. |
| **What it enables** | (1) Add / remove team members and roles · (2) Configure alert thresholds · (3) Manage billing · (4) Edit assumptions (wage rates, seats, targets, realization haircut) · (5) Manage integrations |
| **How it works** | Sectioned settings page. Each section persists changes immediately. Some changes (wage rate, seats) trigger a recompute of affected $ values across the app. |
| **Buttons & flow** | Section-level **Save**. **Open Data Quality** for source-side issues. **Manage billing** → billing flow. |

---

# Appendix A · Table Turns v32 Redesign (full detail)

> The detailed v32 redesign spec for Table Turns. The 3 subpages (Watch / Decide / Trust) are summarized in the Catalog above; the deeper architectural detail (no-scroll constraints, locked canonical fixtures, edge cases, contracts, implementation order) lives here so the engineer has everything in one place.

## A.1 Preamble

### Why this redesign

The previous five-page structure had three problems:

1. **Number drift.** Stage Flow used a different fixture set (74 min / 63 min baseline / 38 seats / $75.50) than the rest of the feature (94 min / 76 min target / 42 seats / $76). Managers opening adjacent pages saw conflicting numbers for the same service.
2. **Duplication.** Stage Flow contained its own hero, summary strip, lost-cover proof, and playbook card — all of which duplicated Overview, Lost Covers, and Playbooks. Three pages were doing each other's job.
3. **No story.** The pages were organized by data type (overview / stages / covers / playbooks / evidence), not by the questions a manager actually asks.

### The new structure

| Page | Job | Replaces |
|---|---|---|
| **Watch** | "What's wrong right now, what do I do, is it safe?" | Overview + Stage Flow (merged with progressive disclosure) |
| **Decide** | "What are all my action options, ranked?" | Playbooks (largely unchanged in purpose) |
| **Trust** | "Can I trust these numbers? What are the rules?" | Lost Covers + Evidence (merged into the LE-Evidence-style TOC + sections page) |

### Design principles (apply to all three pages)

1. **No scrolling on desktop.** Every primary view fits in a 1440 × 900 viewport.
2. **One question per region.**
3. **Headline → evidence → action** flow, top to bottom.
4. **Color carries meaning, not decoration.** Green = fine / safe. Amber = watch. Red = act now. Blue = info only.
5. **Numbers in mono, prose in sans.**
6. **One primary action per page.**
7. **Plain English everywhere.** "Tables you missed" not "lost covers."
8. **Disclosures over duplication.**

### Canonical fixtures (locked for v32)

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

**Playbook fixtures** (Decide page):

| # | Title | Targets | $/wk | Confidence | Tier |
|---|---|---|---|---|---|
| 1 | Dessert menu at 60 min | Stage 4 | $420 | 78% | READY (≥70) |
| 2 | Pre-bus during entrée | Stage 3 → 4 transition | $148 | 74% | READY (≥70) |
| 3 | QR-code self-close | Stage 4 | $44 | 64% | TOO LOW (<70) |

**On the $68 gap** ($680 headline vs $612 playbook sum): playbook estimates are independent point estimates per intervention. They are not strictly additive — overlapping stage effects mean applying multiple playbooks doesn't sum to the headline number. The residual ~$68/wk is unclaimed and may indicate additional optimization not yet codified into a playbook. Documented on Trust → Math.

## A.2 Cross-page contracts

| Contract | Watch shows | Decide shows | Trust shows |
|---|---|---|---|
| Service identity | "Oakland · Friday Dinner" | "Deciding for: Oakland Friday Dinner" | "Oakland Friday Dinner" in formula trace header |
| Total opportunity ($/wk) | ~$680 in strip + hero | ~$680 in context bar | ~$680 in formula result |
| Duration overage | 18 min in strip | 18 min in context bar | 18 min implied (94−76) |
| Tables missed | 9 in strip | Used in plan totals math | 9 in formula trace |
| Avg check | $76 in show-the-formula | $76 implicit in plan math | $76 in formula trace + inputs card |
| Bottleneck stage name | "Stage 4 · Dessert → check paid" | "Targets Stage 4" on Playbook 1 | "Stage 4" called out in formula context |
| Confidence number | 74% in strip | Per-playbook (78/74/64%) | 74% in inputs card |
| Mode (KDS / Proxy) | "KDS: ✓ live" in header | Implicit in plan view | Mode section in Rules |

**State preserved across navigation:**

- Selected daypart on Watch → Decide opens with same service → Trust opens with same service in formula trace
- Selected playbook on Decide ("Math" button) → Trust opens with that playbook's stage anchored

## A.3 Edge cases & data states (apply to all three pages)

| Scenario | Watch behavior | Decide behavior | Trust behavior |
|---|---|---|---|
| **KDS goes stale > 24h** | Numbers frozen, "stale" chip, action CTA disabled | Bulk-apply disabled, individual actions allowed | Math section shows "stale data warning" banner |
| **Proxy mode (no KDS)** | Stage panel collapses to single bar | Playbooks tagged [PROXY], confidence capped | Math section shows proxy-mode variant |
| **No baseline yet** | Headline reads "Baseline still building" | No playbooks shown — "Need 2 weeks history" CTA | Math section shows "No detection possible yet" |
| **Service within target** | "All services within target" empty state | Empty state — "No actions needed" | Math section shows "Sample within baseline; no opportunity detected" |
| **Forgotten open checks (>5%)** | Anomaly banner, action disabled | Bulk-apply disabled | Math section shows anomaly note in inputs card |
| **Confidence drops below 60%** | Watch hides the opportunity entirely | Decide shows nothing for that service | Trust documents the threshold |
| **Trial in monitoring** | "Already in motion" sub-card visible | Playbook shown with "In Actions" chip | Math section unchanged |
| **Verification fails** | Active trial removed, headline returns to detection | Playbook moves back to "available" | Math section unchanged; Restrictions explains "why it didn't count" |

## A.4 Implementation order *(complete as of v32)*

1. ✅ **Watch** — biggest user impact, sets the canonical fixtures every other page must honor.
2. ✅ **Trust** — kills the most duplication when Lost Covers folds in. Locks the doctrine for the other pages to reference. (LE-Evidence-style TOC + sections + expandable cards.)
3. ✅ **Decide** — smallest delta from current Playbooks; mostly a trim + context-bar addition.

After all three implemented:

- ✅ Delete old `tt-subpage-stages` and `tt-subpage-lostcovers` divs
- ✅ Sidebar nav labels: Overview / Stage Flow / Lost Covers / Playbooks / Evidence → Watch / Decide / Trust
- ✅ `TT_SUBPAGE_TITLES` updated to 3 entries
- ✅ `.le-ev-*` CSS unscoped so Trust can use the LE Evidence pattern
- Documentation updates in progress

---

*Last updated: v32 redesign · all 3 Table Turns subpages implemented. Catalog covers all 11 top-level pages + 23 subpages (34 total page sections).*
