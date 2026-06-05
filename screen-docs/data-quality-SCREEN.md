# Data Quality — screen spec

> Source-by-source freshness, missing inputs, and confidence impact across every
> SKC recommendation — the "is our data healthy?" dashboard.

- **File:** `screens/settings.html`
- **DOM id:** `screen-settings` · **route:** `showScreen('settings', null, 'Data Quality')`
- **Group:** System
- **Status:** seeded

## Purpose
The "is our data healthy?" dashboard: source-by-source freshness, missing inputs,
and confidence impact across every SKC recommended action. It exists because every
confidence score depends on data freshness — when a number drops (e.g. Labor
confidence 78% instead of 85%), the operator needs to know **why** and **what to
fix**. Data Quality is that diagnosis surface.

**Shared file:** Data Quality and Settings both live in `screens/settings.html`.
Data Quality is the parent shell `screen-settings`; the **nested Settings** screen
(`screen-config`, route `showScreen('config', …)`) is rendered *inside* the
`screen-settings` markup. Treat them as two routes over one file — see
[settings-SCREEN.md](settings-SCREEN.md).

## Access — who & when
- **Primary user:** GM.
- **Secondary:** IT / ops admin owning the integrations.
- **When used:** when a confidence score drops; when a "Connect X to unlock" CTA
  appears anywhere in the app; weekly health check.

## Route & how it's reached
- Sidebar **Data Quality** item under System: `showScreen('settings', null, 'Data Quality')`.
- Deep-linked from "Connect X" / "Fix block" / reconnect CTAs across the app
  (e.g. `dqFix('shifts')`, and source `reconnect_fn` values in the registry —
  several resolve to `showScreen('settings',null,'Data Quality')`).

## Subpages
None. (Organized as in-page tabs, not subpage routes.)

| Tab | Purpose | Default? |
|---|---|---|
| Overview | Freshness strip, completeness bar, Source Health cards | Yes |
| Integrations | Connected sources + authentication state | — |
| Affected Metrics | Which metrics/features are degraded, by how much | — |
| Blocked Actions | Actions that can't proceed/verify due to data | — |
| Sync History | Recent sync events, connection errors, freshness log | — |
| Data Hygiene | Anomalies in *connected* sources (roadmap · Q3, demo-only) | — |

## Page states
- **Loading:** _TBD — verify against `settings.html`._
- **Empty / cold-start:** _TBD — verify against `settings.html` (all-healthy / first-connect)._
- **Error / blocked:** stale or missing source → reconnect CTA inline
  (e.g. "Reconnect 7shifts first →"). Blocked Actions tab surfaces "1 verification
  blocked · Labor verification (A006) — 7shifts stale 18h."
- **Success / populated:** the normal state — freshness strip (Toast POS · 4m ago;
  7shifts · stale 18h; KDS · partial; Recipe Cost · stale 18d; Google Reviews ·
  1h ago; Accounting · not connected), 78% completeness bar, Source Health cards.

## Components used
- `page-header` (title "Data Quality").
- `os-embed-card` — "Verification blockers · affects renewal cadence" embed from
  Operating System.
- `skc-tab-bar` / `skc-tabs` (`data-tabs="dq"`) + `skc-panel` tabs.
- `dq-global-strip` (freshness strip), `dq-completeness-bar` (78% complete),
  `dq-cards-grid` / `dq-src-card` (Source Health cards), `src-dot` status dots.
- Per-source status chips `dq-src-status-healthy` etc.; `dqFix(id)` reconnect buttons.

## Data dependencies
- **Registries / fixtures:** `SKC_STATE.data_quality.sources` in `shared/core.js`
  (per-source `status`, `lastSync`, `sync_frequency`, `confidence_impact`,
  `action_rule`, `verification_rule`, `affected_opportunity_categories`,
  `reconnect_fn`, `metrics`); `data_quality.global_health` (78); `sync_history`.
  Cross-reference [docs/data-sources.md](../docs/data-sources.md).
- **Output types shown:** N/A for unconnected sources (`unavailable`, red); the
  page governs which type/confidence *other* screens may display.
- **Sources gating confidence:** **all of them** — this screen *is* the source
  registry view. Catalog framing: **7 sources** — Toast POS, 7shifts, KDS, recipe
  cost, reviews, accounting, inventory — each with status (live / partial / stale
  / disconnected) and a confidence-impact column per affected feature.

## Doctrine specifics
This is the screen that enforces "type and confidence flow from data → render" at
its origin. Per [docs/doctrine.md](../docs/doctrine.md): a degraded source
downgrades the output type and reduces confidence, and the reason chip
(`[output type] · [confidence delta] · [short reason]`, e.g. `EST · −7 pts ·
7shifts stale 18h`) is sourced from here. Only **verified** counts toward ROI, and
verification is **blocked** when a required source is stale/missing — so Data
Quality is upstream of every Active Recovery → Verified transition. Demo confidence
deltas per [docs/data-sources.md](../docs/data-sources.md): 7shifts −7 pts (stale),
KDS −14 pts (partial), recipe cost −18 pts (stale 18d), inventory −20 pts (missing).

## Actions
| Trigger (button / interaction) | Effect |
|---|---|
| Per-source **Refresh** | Re-syncs the source (restore freshness) |
| Per-source **Reconnect** / "Reconnect 7shifts →" (`dqFix('shifts')`) | Starts the reconnect flow for a stale/disconnected source |
| Per-source **Open integration** | Opens the source's integration detail |
| Tab switch (Overview / Integrations / Affected / Blocked / History / Hygiene) | `switchTab('dq', <key>)` swaps the panel |
| **See verification queue** | → Operating System (`showScreen('operating-system', …)`) |
| **Open Settings (general)** | → nested Settings (`screen-config`) for non-data config |
| Data Hygiene **Review** | Demo-only toast — Q3 review flow not yet wired |

## Navigation in / out
- **In (how you arrive):** sidebar **Data Quality**; any "Connect X" / "Fix block"
  / reconnect CTA across the app; source `reconnect_fn` deep-links.
- **Out (where buttons go):** Operating System (verification queue); nested
  Settings (`screen-config`) for general config; back to the originating action
  once a block clears.

## Edge cases
- A source's `action_rule`/`verification_rule` is keyed by its current `status`, so
  the same source can be "allowed" for actions yet "blocked" for verification
  (e.g. KDS degraded). Surface both states distinctly.
- "Connected ≠ clean": the Data Hygiene tab notes auto-exclusion (live today) of
  flagged checks; above 10% flagged volume, detection confidence is reduced
  proportionally; above 20%, monitoring windows pause for affected categories.

## Responsive notes
Desktop primary. _Confirm tablet/phone behavior against `settings.html`._

## Related screens
- **Settings** (nested `screen-config`) — operator config; shares this file.
- **Operating System** — verification-blockers embed and the verification queue.
- **Actions → Blocked** — where data-source blocks land as blocked actions
  ("Fix block" jumps here).
- Every Diagnose feature (Labor, Menu, Table Turns, Kitchen Speed) — their
  confidence chips and "Connect X" CTAs originate from this registry.

## Open questions
- Seeded from the v32 page-spec catalog (now `archive/Page-spec-docs.md`);
  accurate as of v32. Reconcile against present `screens/settings.html`.
- **Source-count divergence:** catalog + [docs/data-sources.md](../docs/data-sources.md)
  describe **7 sources** (incl. **inventory**) with status labels
  **live / partial / stale / disconnected**. The live registry
  (`SKC_STATE.data_quality.sources`) and the rendered strip list **6 sources**
  (no inventory) using status enum `healthy / stale / degraded / missing`, and
  label the recipe source **"Menu / Recipe Cost."** Catalog framing preserved
  above per instructions; reconcile the canonical count + status vocabulary.
- `confidence_impact` deltas differ between the registry (e.g. 7shifts stale −7,
  KDS degraded −16) and [docs/data-sources.md](../docs/data-sources.md) (KDS
  partial −14); confirm the canonical numbers.
- Loading / all-healthy empty state and responsive behavior — _verify against
  `settings.html`._
