# Operating System — screen spec

> The marketing-grade narrative page for the "AI Restaurant Profit Manager" loop:
> how SKC turns detected leaks into verified value, operator habit, GM upside, and
> compounding restaurant memory — with interactive drawers per loop stage.

- **File:** `screens/operating-system.html`
- **DOM id:** `screen-operating-system` · **route:** `showScreen('operating-system', …)`
- **Group:** Prove
- **Status:** seeded

## Purpose
The product-story page. It explains what SKC **is** — the retention loop that
"finds margin leaks, pushes the decision, monitors the result, verifies the value,
and builds operating memory across every location" — before owners and prospects
trust the dashboards. It exists because owners need the narrative framing
(positioning + renewal health) to make sense of the numbers, and because the
"AI Restaurant Profit Manager" hero is the headline positioning ("Your AI
Restaurant Profit Manager"). Marketing-grade, not a data console.

## Access — who & when
- **Primary user:** Owner during onboarding / renewal.
- **Secondary:** Prospect during a demo.
- **When used:** onboarding week; renewal conversations; when demoing to a partner.

## Route & how it's reached
- Sidebar **Operating System** item (Prove group):
  `showScreen('operating-system', this, 'Operating System')` — _confirm exact
  label/handler against `components/sidebar.html`._
- Crosslinked from **ROI Proof** (`showScreen('operating-system', …)` on that screen).

## Subpages
None. Depth is delivered via in-page **drawers** (see Actions), not subpages.

## Page states
- **Loading:** _TBD — verify against `operating-system.html`._
- **Empty / cold-start:** largely static narrative — minimal empty state; Operating
  Memory shows depth (e.g. "42 entries") that would read lower on a fresh account —
  _confirm cold-start copy against `operating-system.html`._
- **Error / blocked:** non-functional / future-capability modules are explicitly
  labeled (e.g. Push Digest: "SMS/Email/Slack delivery integrations activate in Q3.
  In-app preview is what you see here") rather than erroring.
- **Success / populated:** hero (positioning + Renewal Health), the retention-loop
  narrative, and the six disclosure modules with their drawers.

## Components used
- `page-hdr` / page header (`page-header-title` "SKC Operating System",
  `page-header-sub`) — _legacy `page-header*`; confirm._
- Hero (`os-hero-*`: `-eyebrow` "Positioning", `-h1` "Your AI Restaurant Profit
  Manager", `-sub`, plus a **Renewal Health** panel — e.g. "Memory depth 42 entries,"
  "Next review Friday · 10:00 AM").
- Module cards (`os-mod-*`) and disclosure rows (`os-disclosure-*`) for the six loop
  stages.
- Two-up module panels: **Push Digest System** + **GM Scorecard**; **Value Review
  Cadence** + **Operating Memory** (`os-pd-*`, `os-vr-*`, etc.).
- "Who uses this" band (`os-whouses-*`).
- Generic drawer surface (drawers driven from core.js; opened via `osOpen(key)`) —
  see [COMPONENTS.md](../COMPONENTS.md) `drawers.html`.
- Output-type chips for status (`os-chip-*`, e.g. `os-chip-blue` "Active Recovery").
- Buttons (`btn-primary`/`-secondary`/`-ghost`); demo toasts (`showDemoToast`).
- Crosslinks to Actions and Menu (`showScreen('actions' \| 'menu', …)`).

## Data dependencies
- **Registries / fixtures:** primarily **narrative/illustrative content**, not live
  registries. Some figures echo canonical state (verified cycle, Active Recovery)
  but the page is a product story — _confirm which figures bind to data vs. are
  static against `operating-system.html`._
- **Output types shown:** status chips reference `active_recovery` (ACT · blue);
  future-capability modules are effectively `illustrative` (ILL · slate) per
  doctrine — labeled as previews ("In-app preview · 4/4," "Q3" activation).
- **Sources gating confidence:** N/A as a primary driver (marketing narrative);
  the loop *describes* how the seven sources gate the real surfaces.

## Doctrine specifics
The page narrates the canonical state machine **OPEN → ACTIVE RECOVERY → VERIFIED**
(per [docs/doctrine.md](../docs/doctrine.md)) as the retention loop
(Detect → Decide → Monitor → Verify → Memorize). Honesty doctrine is preserved in
the modules: future capabilities are marked as **in-app previews / Q3 activations**
(illustrative), not as live features; the digest preview and GM scorecard are shown
as previews. Per CLAUDE.md voice rules, value framing is optimistic and outcome-led
and **does not anchor on the subscription price** in value copy. No new canonical
dollar values originate here — _confirm any dollar figures shown match
[docs/canonical-numbers.md](../docs/canonical-numbers.md) against the file._

## Actions
Interactive **drawers** open via `osOpen(key)`; cross-links via `showScreen(…)`.

| Trigger (button / interaction) | Effect |
|---|---|
| **Open Renewal Packet** *(hero primary)* | `osOpen('renewal')` — Renewal Moat scoreboard drawer |
| **Operating Memory** | `osOpen('memory')` — compounding restaurant-memory drawer |
| **Preview Digest** | `osOpen('digest')` — Push Digest System (Weekly Operator Digest) drawer |
| **Open Scorecard Preview** | `osOpen('gm')` — **GM upside** / GM Scorecard drawer |
| **(Value Review)** open | `osOpen('review')` — Value Review Cadence drawer |
| **(Detector Roadmap)** open | `osOpen('detectors')` — Detector Roadmap drawer |
| **Send Test** | `showDemoToast('Test digest sent · Owner SMS + GM email','green')` |
| **Open Pending Decisions** | `showScreen('actions', null, 'Actions')` |
| Menu crosslink | `showScreen('menu', …)` |

The six drawers the catalog calls out map to: **Digest** (`digest`), **GM upside**
(`gm`), **Review** (`review`), **Memory** (`memory`), **Detectors** (`detectors`),
**Renewal** (`renewal`).

## Navigation in / out
- **In (how you arrive):** sidebar **Operating System** (Prove); ROI Proof crosslink.
- **Out (where buttons go):** drawers (in-place, via `osOpen`); Actions
  (`screen-actions`) via **Open Pending Decisions**; Menu (`screen-menu`) crosslink.
  _Confirm whether a Renewal/ROI-Proof crosslink fires `showScreen('scorecard', …)`
  against the file._

## Edge cases
- Future modules (digest delivery integrations) are preview-only until Q3 — copy
  must keep them labeled as previews, never as shipped.
- Operating Memory depth ("42 entries") is account-dependent; a fresh account reads
  lower — _confirm fixture behavior._

## Responsive notes
- Desktop primary.
- Tablet for demos (this is a demo/onboarding surface).
- _Phone behavior: TBD — verify against `operating-system.html`._

## Related screens
- **ROI Proof** — the verified-number proof this narrative leads owners toward
  (crosslinked).
- **Actions** — "Open Pending Decisions" entry into the live lifecycle.
- **Today** / **Profit Recovery** — the operate/diagnose surfaces the loop describes
  (catalog lists ROI Proof, Today, Profit Recovery as cross-links).

## Open questions
- Seeded from the v32 page-spec catalog (now `archive/Page-spec-docs.md`); accurate
  as of v32, may predate later redesigns. The catalog frames drawers as
  Detect/Decide/Monitor/Verify/Memorize stages, but the implemented modules are
  **Push Digest, GM Scorecard, Value Review Cadence, Operating Memory, Detector
  Roadmap, Renewal Moat scoreboard** (drawers `digest`/`gm`/`review`/`memory`/
  `detectors`/`renewal`) — reconcile the loop-stage framing with the shipped module
  set and verify against `screens/operating-system.html`.
- Confirm cross-links named in the catalog (Today, Profit Recovery) exist on the
  current screen (only `actions` and `menu` were observed in a quick grep).
- TBD: Loading/phone states; which figures bind to live data vs. illustrative.
