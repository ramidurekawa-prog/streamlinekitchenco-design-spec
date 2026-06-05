# Home (landing) — screen spec

> The Home landing surface: a 6-metric KPI dashboard that deep-links into the
> diagnostic features. Boot lands here by default.

- **File:** `screens/home-dashboard.html`
- **DOM id:** `screen-dashboard` · **route:** `showScreen('dashboard', null, 'Home')`
- **Group:** — (top-level Home)
- **Status:** stub — verify against `home-dashboard.html`

## Purpose
A six-card KPI overview that orients the operator and routes them into the
diagnostic features. It is the **boot fallback** (the loader lands here when there's
no saved last-view) and the "Home" sidebar destination. Distinct from **Today**
(`screen-home`, the single-decision operate screen).

## Access — who & when
- **Primary user:** GM / Owner on login.
- **When used:** entry point; a quick portfolio glance before drilling in.

## Route & how it's reached
- Boot fallback: `showScreen('dashboard', null, 'Home')` (see [ARCHITECTURE.md](../ARCHITECTURE.md)).
- Sidebar **Home** item.

## Subpages
None.

## Page states
- **Success / populated:** six KPI cards with current portfolio metrics.
- **Loading / empty / blocked:** _TBD — verify how cards render with degraded sources._

## Components used
- KPI cards (`.dash-*` block at the end of `styles.css`).
- _Confirm whether it adopts `page-hdr` / canonical patterns or is bespoke._

## Data dependencies
- **Registries / fixtures:** `getPortfolioTruth()` and the per-feature figures the
  six cards surface. _Confirm exact bindings._
- **Output types shown:** mixed (verified vs estimated per card) — _confirm._

## Doctrine specifics
The six cards deep-link to **ROI Proof, Profit Recovery, Labor Efficiency, Table
Turns, and Menu Item Economics**. Verified vs estimated framing must stay
doctrine-consistent with the destination screens and `docs/canonical-numbers.md`.

## Actions
| Trigger | Effect |
|---|---|
| Click a KPI card | Deep-links to ROI Proof / Profit Recovery / Labor Efficiency / Table Turns / Menu Item Economics |

## Navigation in / out
- **In:** boot fallback; sidebar Home.
- **Out:** the six card deep-links.

## Edge cases
_TBD._

## Responsive notes
Desktop primary. _Confirm tablet/phone behavior._

## Related screens
Today (the operate counterpart), and the five features the cards link to.

## Open questions
- Not present in the v32 page-spec catalog (added later). Fill from `home-dashboard.html`:
  exact six metrics, their bindings, output types, and states.
