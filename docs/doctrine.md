# Doctrine — output type and state model

SKC labels every dollar value, recommendation, and metric with its **output type** so the operator always knows what counts and why. The output type drives confidence display, ROI eligibility, and the color used on screens.

The canonical registry lives in `shared/core.js` under `OUTPUT_TYPES`. This doc summarises it for human consumption; if the registry changes, update this doc.

## The output types

| Type | Short | Color | What it means | Counts toward ROI? |
|---|---|---|---|---|
| `deterministic` | DET | green | Measured directly from source data. Arithmetic only — no model. | Yes, when paired with `verified` status. |
| `estimated` | EST | amber | Calculated from a model or formula. Assumptions stated. Not a measurement. | No. |
| `modeled` | MOD | amber | Derived from a statistical or regression model applied to historical data. | No. |
| `heuristic` | HEU | blue | Based on an operational rule of thumb. Not derived from source data directly. | No. |
| `simulation` | SIM | blue | Result of a what-if scenario. Not observed — hypothetical. | No. |
| `verified` | VER | green | Confirmed by monitoring window with all guardrails passing. | **Yes** — this is the only state that counts. |
| `active_recovery` | ACT | blue | Action assigned or in monitoring. Value is estimated — not yet verified. | No. |
| `open_opportunity` | OPEN | amber | Detected but not yet actioned. Estimated run-rate only. | No. |
| `unavailable` | N/A | red | Source not connected or data missing. Cannot calculate. | No. |
| `illustrative` | ILL | slate | Fabricated for a non-functional preview. No source data behind it — shown only to convey a future capability. | No. |

## The state machine

An opportunity moves through these states:

```
        ┌─────────────────────┐
        │  OPEN (open_opp.)   │  ← detector finds a recurring leak
        │  EST · amber        │  ← shown on Profit Recovery
        └────────┬────────────┘
                 │ operator assigns recovery action
                 ▼
        ┌─────────────────────┐
        │  ACTIVE RECOVERY    │  ← action in progress / monitoring window
        │  EST · blue         │  ← shown on Actions, "in monitoring"
        └────────┬────────────┘
                 │ monitoring window completes & guardrails pass
                 ▼
        ┌─────────────────────┐
        │  VERIFIED           │  ← counts toward ROI
        │  DET · green        │  ← shown on ROI Proof
        └─────────────────────┘
```

Any state can transition to **BLOCKED** if a required data source becomes stale, missing, or degraded mid-flight.

## Status → output type mapping

From `STATUS_TO_OUTPUT_TYPE` in `shared/core.js`:

| Opportunity / action status | Output type |
|---|---|
| `proposed`, `Detected` | `open_opportunity` |
| `assigned`, `monitoring`, `Active Recovery` | `active_recovery` |
| `verified`, `Verified` | `verified` |

## Rules the UI enforces

1. **Only `verified` counts toward ROI.** Active Recovery and Open Exposure are tracked separately and never roll up into reported savings.
2. **The type and confidence flow from data → render.** The presentation layer cannot upgrade an `estimated` to a `verified`. If you see "$370/wk" labelled EST · amber on one screen and the same number on another, it must be EST · amber there too.
3. **A degraded source downgrades the type.** Labor recommendations that depend on stale 7shifts data are surfaced as `estimated` with reduced confidence, never as `deterministic`. The reason (e.g. "7shifts token stale 18h") is shown next to the confidence chip.
4. **Verification requires a monitoring window with guardrails passing.** A single shift below target does not verify — the verification rule (e.g. "2 comparable Tuesday lunches with all guardrails passing") must hold.
