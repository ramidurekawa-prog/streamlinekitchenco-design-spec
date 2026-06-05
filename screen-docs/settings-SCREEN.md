# Settings — screen spec

> Workspace configuration: team access, alert thresholds, billing, integrations,
> and operator-specific assumptions (wage rates, seats, targets, realization
> haircut).

- **File:** `screens/settings.html`
- **DOM id:** `screen-config` · **route:** `showScreen('config', …)`
- **Group:** System
- **Status:** seeded

## Purpose
Workspace configuration — the place where operator-specific assumptions live and
where team / alerts / billing / integrations are managed. It exists because every
operator's restaurant is different: wage rates, seat capacity, targets, and the
realization haircut all vary, and those assumptions feed the dollar math across the
app. Editing them here **recomputes affected $ values app-wide** (e.g. a wage-rate
change reprices Staffing Plan recoveries; a seats / target change reprices Table
Turns "tables you missed").

**Shared file:** Settings and Data Quality both live in `screens/settings.html`.
This nested **Settings** screen is `screen-config` (route `showScreen('config', …)`),
rendered *inside* the parent **Data Quality** shell `screen-settings` (route
`showScreen('settings', null, 'Data Quality')`). Treat them as two routes over one
file — see [data-quality-SCREEN.md](data-quality-SCREEN.md).

## Access — who & when
- **Primary user:** Owner / admin.
- **Secondary:** GM for operational settings (wage rates, alert thresholds).
- **When used:** onboarding; when adding a new location; monthly billing review;
  when a Staffing Plan wage assumption (or a Table Turns seats / target) needs
  updating.

## Route & how it's reached
- Sidebar **Settings** item under System: `showScreen('config', …)`.
- From Data Quality: **"Open Settings (general)"** for non-data config.
- From within itself, several tabs delegate to Data Quality
  (`showScreen('settings',null,'Data Quality')`, e.g. the Integrations tab).

## Subpages
None. (Organized as in-page tabs, not subpage routes.)

| Tab | Purpose | Default? |
|---|---|---|
| Workspace | Group/plan/POS summary, Alert Thresholds, Team Access, Billing | Yes |
| Locations | Oakland · Berkeley · Walnut Creek · San Jose | — |
| Team | Team members + roles | — |
| Integrations | Delegates to Data Quality | — |
| Alerts | Alert-threshold configuration | — |
| Billing | Standard plan · $399/mo · 4 locations | — |

## Page states
- **Loading:** _TBD — verify against `settings.html`._
- **Empty / cold-start:** onboarding (first-run assumptions unset) — _TBD, verify._
- **Error / blocked:** source-side issues route to Data Quality rather than erroring
  here.
- **Success / populated:** Workspace tab shows Rosewood Group · 4 active locations ·
  Standard plan · Toast POS; Alert Thresholds (Labor cost % ≥ 32%, RPLH gap alert
  > $5.00/hr, Ticket time alert > 15 min, CM drop alert > 5 pts); Team Access
  (Sarah Chen — GM · All locations; Marcus R. — Owner · Read + approve; Devon K. —
  Bar manager · Walnut Creek); Billing $399/mo · current verified ROI 1.4×.

## Components used
- `page-header` (title "Settings").
- `skc-tab-bar` / `skc-tabs` (`data-tabs="config"`) + `skc-panel` tabs.
- `card` grids (`grid-2`) for Workspace / Alert Thresholds / Team Access / Billing.
- `op-ava` avatars for team members; `data-skc="roi-current"` bound ROI value.
- Section buttons fire `showDemoToast(...)` (demo placeholders) or
  `showScreen('settings',null,'Data Quality')`.

## Data dependencies
- **Registries / fixtures:** operator assumptions that drive recompute —
  **wage rates, seats, targets, realization haircut**. In the canonical numbers
  these surface as e.g. the fully-loaded labor cost ($37/hr) behind Staffing Plan,
  the 42-seat Oakland dining room + 76-min target + 36% realization haircut behind
  Table Turns. _Verify the exact editable assumption fields against `settings.html`._
  Workspace fixtures shown: Rosewood Group, 4 locations, $399/mo, ROI 1.4×.
- **Output types shown:** none directly; this screen *sets inputs* that change the
  output values (and thus the $ math) shown elsewhere.
- **Sources gating confidence:** none here — source health lives in Data Quality.

## Doctrine specifics
Settings holds the **operator-set inputs** the doctrine treats as ground truth for
the math (e.g. target dining duration, seats, wage, realization haircut). Changing
them recomputes downstream estimates but **cannot upgrade an output type** — an
`estimated` value stays `estimated` regardless of assumption edits; only a
monitoring window flips a value to `verified`. Keep consistent with
[docs/doctrine.md](../docs/doctrine.md) and
[docs/canonical-numbers.md](../docs/canonical-numbers.md): if an assumption edit
changes a canonical number, every screen that shows it must move together.

## Actions
| Trigger (button / interaction) | Effect |
|---|---|
| Tab switch (Workspace / Locations / Team / Integrations / Alerts / Billing) | `switchTab('config', <key>)` swaps the panel |
| **Edit workspace →** | Opens workspace settings (demo toast) |
| **Edit thresholds →** | Opens alert-threshold settings (demo toast) |
| **Manage team →** | Add / remove team members and roles (demo toast) |
| Section-level **Save** | Persists the section; some edits (wage rate, seats, targets) trigger an app-wide $ recompute |
| **Billing details → / Billing portal →** | Billing flow (demo toast) |
| Integrations tab → **Data Quality →** | `showScreen('settings',null,'Data Quality')` |

## Navigation in / out
- **In (how you arrive):** sidebar **Settings**; "Open Settings (general)" from
  Data Quality; wage-assumption links from Staffing Plan / Table Turns
  (per catalog).
- **Out (where buttons go):** Data Quality (`screen-settings`) for source-side
  issues; billing flow; back to the feature whose assumption was edited.

## Edge cases
- Mobile is **read-only** per catalog; some basic settings work on tablet.
- Recompute side effects: changing wage / seats / target / realization haircut
  ripples into Staffing Plan, Table Turns, and any screen reading the affected
  canonical number — grep and verify they move together.

## Responsive notes
Desktop primary. Some basic settings work on tablet. Mobile read-only.

## Related screens
- **Data Quality** (parent `screen-settings`) — source health; shares this file.
- **Labor → Staffing Plan** — consumes the editable wage assumptions.
- **Table Turns (Watch / Decide / Trust)** — consumes seats, target duration, and
  the realization haircut.
- **ROI Proof / Reports** — reflect the $ outcomes these assumptions feed.

## Open questions
- Seeded from the v32 page-spec catalog (now `archive/Page-spec-docs.md`);
  accurate as of v32. Reconcile against present `screens/settings.html`.
- **Assumptions gap:** the catalog lists editable **wage rates, seats, targets,
  realization haircut** as the headline Settings capability, but the current
  `screen-config` DOM surfaces only Alert Thresholds (Labor %, RPLH gap, Ticket
  time, CM drop) plus Workspace/Team/Billing summaries — the wage / seats / target
  / haircut editors are not visibly present. Confirm where these assumptions are
  actually edited, and whether the recompute is wired.
- Most tab actions are `showDemoToast(...)` placeholders ("in full product");
  confirm which settings persist vs. are demo-only.
- Loading / onboarding empty state — _verify against `settings.html`._
