# Data sources

Every metric SKC shows traces back to one or more data sources. The source determines:
- whether a metric is `deterministic` (measured) or `estimated` (modelled)
- whether actions can be auto-assigned, require GM approval, require owner approval, or are blocked
- whether a result is eligible to roll up into Verified Savings (ROI)

The canonical source registry is `SKC_STATE.data_quality.sources` in `shared/core.js`.

## The 7 sources

| ID | Label | Status (demo) | Sync | Confidence impact | Action rule | Verification rule |
|---|---|---|---|---|---|---|
| `toast` | Toast POS | healthy | every 5 min | 0 pts | allowed | eligible |
| `shifts` | 7shifts | stale (18h) | hourly | −7 pts when stale | GM approval required when stale | blocked when stale |
| `kds` | KDS | partial (6m) | streaming | −14 pts when partial | allowed (with observation) | blocked when partial |
| `recipe` | Recipe cost file | stale (18d) | manual upload | −18 pts when stale | owner approval required | blocked when stale |
| `reviews` | Google Reviews | healthy (1h) | hourly | 0 pts | allowed | eligible |
| `accounting` | Accounting | missing | n/a | n/a | blocked | blocked |
| `inventory` | Inventory | missing | n/a | −20 pts | blocked | blocked |

## What each source provides

### Toast POS
**From Toast (deterministic):** sales by item, voids, comps, refunds, checks per service, party size, average check, clock-in / clock-out, hours worked, wage rates (where exported), tax breakdown.

This is the spine of the platform. Labor, Menu, Throughput, and Table Turns detection all gate on Toast being healthy.

### 7shifts
**From 7shifts:** scheduled vs. actual labor coverage, role assignments, shift trades, overtime forecasts.

When 7shifts is stale, labor recommendations downgrade from `deterministic` to `estimated` and a GM-approval requirement is added before any recovery action ships.

### KDS (Kitchen Display System)
**From KDS:** precise stage timing for each ticket — `seat → order`, `order → food`, `food → check`, `payment`. This is what powers the Table Turns stage decomposition.

When KDS is `partial`, stage timing is reconstructed from POS proxies; recommendations are surfaced but verification is blocked until a monitoring window with healthy KDS.

### Recipe cost file
**Operator-provided (upload).** Per-item food cost — drives Contribution Margin (CM) calculations for the Menu screen.

Currently stale (18 days) in the demo, which is why every CM number is badged `EST · amber` and verification of menu opportunities is blocked.

### Google Reviews
**Scraped automatically (no operator setup).** Drives guardrail "no negative review spike" on monitoring windows.

### Accounting
**Operator-provided (not connected in demo).** When connected, unlocks net-margin and prime-cost confirmation. Without it, the Profit Recovery page shows a banner: *"Accounting not connected — showing operational ROI."*

### Inventory
**Operator-provided (not connected in demo).** Would unlock theoretical-vs-actual food cost variance detection.

## What the operator provides (not from Toast)

- **Wage rates** — needed to convert hours into dollars. Most groups export from payroll; some manual entry.
- **Premium item tags** — which menu items are "specials" or premium ICP-fit dishes.
- **Schedule data** — when 7shifts isn't connected, schedules can be uploaded as CSV.
- **Recipe costs** — already covered above; needs upload + refresh cadence.
- **Seating capacity** — needed for the Table Turns "lost covers" model. Surfaced as a setup prompt on Table Turns when missing.

## Reading the source caveat chips

Anywhere a metric is shown, you may see a chip like `EST · −7 pts · 7shifts stale 18h`. The format is:

```
[output type] · [confidence delta] · [short reason]
```

The chip is rendered by `getOutputLabel(output_type, conf, reason)` in `shared/core.js`. The reason text comes from `dq_warning` on the underlying opportunity object.
