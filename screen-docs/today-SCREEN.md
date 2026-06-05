# Today — screen spec

> The single-decision landing screen: today's highest-value recovery decision (one
> card, big), recent monitoring updates, and an "Ask SKC why" panel.

- **File:** `screens/today.html`
- **DOM id:** `screen-home` · **route:** `showScreen('home', …)`
- **Group:** Operate
- **Status:** seeded

## Purpose
The single-decision landing screen and the home screen on login. It surfaces
today's highest-value recovery decision as one big card, recent monitoring updates,
and an "Ask SKC why" panel. It exists because operators don't want a 20-tile
dashboard at 7am — they want one thing to do today. Today filters the entire
portfolio down to the one decision that matters most right now.

## Access — who & when
- **Primary user:** GM.
- **Secondary:** Owner doing a morning check. (Not the target: engineer, auditor.)
- **When used:** first thing in the morning (highest-frequency entry point); also
  after lunch service for a pre-dinner update. Often the only page they open if
  nothing's pressing.

## Route & how it's reached
- Sidebar **Today** item: `showScreen('home', this, 'Today')` (in `components/sidebar.html`).
- The home screen on login.

## Subpages
None.

## Page states
- **Loading:** _TBD — verify against `today.html`._
- **Empty / cold-start:** "no decisions today" empty state (no pending decision to surface).
- **Error / blocked:** data sources down → "Connect X" CTA.
- **Success / populated:** today's #1 recovery decision card, active monitoring
  updates, and the Ask panel.

## Components used
- Hero / decision card (lead "what's wrong · value · action" block) — _confirm canonical class against `today.html`._
- Ask-panel (`#askPanel` / `toggleAskPanel()`, from `components/ask-panel.html`).
- Monitoring-update feed — _TBD — confirm pattern against `today.html`._
- Output-type tags on the decision's dollar value — _confirm DET/EST/VER per the surfaced opportunity._

## Data dependencies
- **Registries / fixtures:** `getPortfolioTruth()` — supplies the highest-value
  pending decision (which ranks Profit Recovery opportunities). Live status of
  in-flight monitoring trials is pulled from Actions.
- **Output types shown:** the surfaced decision is an open opportunity (EST · amber
  per doctrine) until actioned; monitoring updates reflect Active Recovery (EST ·
  blue). _Confirm exact value + label against `today.html`._
- **Sources gating confidence:** the seven SKC sources that gate the ranked
  Profit Recovery opportunity feeding the hero — _confirm which apply to the
  surfaced decision._

## Doctrine specifics
The hero surfaces the top-ranked open opportunity from `getPortfolioTruth()`. Per
[docs/doctrine.md](../docs/doctrine.md), an open opportunity displays EST · amber
and does not count toward ROI; in-flight monitoring shown in the updates feed is
Active Recovery (EST · blue), also not counted. The screen presents the
portfolio's $1,243/wk estimated Open Exposure framing via the top decision (see
[docs/canonical-numbers.md](../docs/canonical-numbers.md)) — _confirm the exact
hero number and its output-type label against `today.html`._ The presentation
layer cannot upgrade type/confidence; both flow from data → render.

## Actions
| Trigger (button / interaction) | Effect |
|---|---|
| **Review this decision** | Opens the Recovery Detail overlay |
| **Ask SKC why** | Opens the ask panel |
| **Snooze 24h** | Dismisses the decision for the day |
| **See all opportunities** | Navigates to Profit Recovery |
| Dismiss / snooze | Removes the decision from today's view |

## Navigation in / out
- **In (how you arrive):** sidebar **Today**; the home screen on login.
- **Out (where buttons go):** Recovery Detail overlay (**Review this decision**);
  ask panel (**Ask SKC why**); Profit Recovery (**See all opportunities**).

## Edge cases
- No pending decision → empty state ("no decisions today").
- Data sources down → Blocked state with a "Connect X" CTA.
- _Confirm stale-data / proxy-mode behavior against `today.html`._

## Responsive notes
- Desktop (manager's laptop) primary.
- Tablet works full-layout.
- Phone shows just the top decision card with a "see details" link.

## Related screens
- **Recovery Detail** — the decision drill-in.
- **Profit Recovery** — the full ranked leak list ("See all opportunities").
- **Actions** — source of the live monitoring-trial statuses shown in the updates feed.

## Open questions
- Seeded from the v32 page-spec catalog (now `archive/Page-spec-docs.md`); accurate
  as of v32 and may predate later redesigns. Verify against the present
  `screens/today.html`.
- TBD items above: Loading state; exact hero number and its output-type label;
  monitoring-update feed pattern; which sources gate the surfaced decision;
  stale-data / proxy-mode behavior; canonical class names for the hero and feed.
