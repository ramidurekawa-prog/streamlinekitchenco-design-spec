<!-- Copy this file to screen-docs/<screen>-SCREEN.md and fill every field. Delete
     these HTML comments as you go. Keep it factual and current; when the screen
     changes, update this doc and log a line in CHANGELOG.md. This is the one doc
     type meant to be read comfortably by both humans and Claude. -->

# <Screen Name> — screen spec

> One-line purpose — what this screen is, in a sentence.

- **File:** `screens/<file>.html`
- **DOM id:** `screen-<id>` · **route:** `showScreen('<id>', …)`
- **Group:** <Operate | Diagnose | Prove | System | —>
- **Status:** <draft | seeded | current | needs-reconciliation>

## Purpose
<What the screen is and the problem it solves. Why it exists. 2–4 sentences.>

## Access — who & when
- **Primary user:** <GM | Owner | Chef | Engineer/Auditor>
- **Secondary:** <…>
- **When used:** <temporal context — morning, weekly review, on-alert, …>

## Route & how it's reached
<Sidebar item, a CTA from another screen, a deep-link, the boot fallback, etc.
Include the exact `showScreen(...)` / `onclick` where useful.>

## Subpages
<If the screen has subpages, one row each; otherwise "None.">

| Subpage | Purpose | Default? |
|---|---|---|
| … | … | … |

## Page states
- **Loading:** <…>
- **Empty / cold-start:** <…>
- **Error / blocked:** <e.g. a data source down → "Connect X" CTA>
- **Success / populated:** <the normal state>

## Components used
<Patterns/fragments from [COMPONENTS.md](../COMPONENTS.md) — e.g. `page-hdr`,
`sp-strip`, `hero-card`, `item-card`, output-type tags, `dq-banner`,
`crosslink-card`. Name them so the rebuild can map them.>

## Data dependencies
- **Registries / fixtures:** <`OPPORTUNITIES`, `ACTIONS`, `getPortfolioTruth()`,
  `MENU_DATA`, `BENCHMARK_*`, …>
- **Output types shown:** <which doctrine types appear, and on which values>
- **Sources gating confidence:** <which of the 7 data sources>

## Doctrine specifics
<Which dollar values appear, with their output types and states (verified vs
estimated vs modeled). Any state-machine behavior (open → active recovery →
verified → blocked) the screen surfaces. Keep consistent with
[docs/doctrine.md](../docs/doctrine.md) + [docs/canonical-numbers.md](../docs/canonical-numbers.md).>

## Actions
| Trigger (button / interaction) | Effect |
|---|---|
| … | … |

## Navigation in / out
- **In (how you arrive):** <…>
- **Out (where buttons go):** <…>

## Edge cases
<Stale data, proxy mode, sub-floor confidence, anomalies, anything non-obvious.>

## Responsive notes
<Desktop primary? Tablet? Phone behavior (collapsed, read-only, top card only)?>

## Related screens
<Cross-linked features and why a user jumps there.>

## Open questions
<Anything unresolved, stale, or needing a joint decision. If this doc was seeded
from the v32 catalog and the screen was later redesigned, note the reconciliation
needed.>
