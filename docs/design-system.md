# SKC Design System (v32)

> Single source of truth for every pattern in the app. Locked decisions from the Phase 1 review of `docs/design-system-audit.md`. If you're building a new screen, this is the only file you need open.

## How to use this doc

1. **Read the principles** (Section 1) before designing anything.
2. **Pick the pattern** you need from the index below.
3. **Copy the markup**, adjust slots, apply modifier classes.
4. **Use the canonical vocabulary** (Section 13) for all user-facing copy.

## Index of patterns

| # | Pattern | Class | When to use |
|---|---|---|---|
| 1 | Design principles | — | Always |
| 2 | Color tokens | CSS vars | Always |
| 3 | Type scale | — | Always |
| 4 | Page shell + header | `sp-shell` + `page-hdr` | Every screen |
| 5 | Five-cell strip | `sp-strip` | Diagnostic features with KPI summary |
| 6 | Hero card | `hero-card` + modifier | Every feature parent page |
| 7 | Tab bar | `tab-bar` | When a page has 3+ orthogonal sub-views |
| 8 | Doctrine line | `doctrine-line` | Every feature parent page |
| 9 | Output-type tag | `tag-X` | Every dollar value or metric |
| 10 | Audience badge | `aud-badge` | Every page header right |
| 11 | Item card | `item-card` | Lists of operator-actionable items |
| 12 | Evidence page | `ev-*` | Every feature's methodology page |
| 13 | DQ banner | `dq-banner` | When source health affects the page |
| 14 | Cross-link card | `crosslink-card` | Feature page footers |
| 15 | Vocabulary | — | Every piece of user-facing copy |

---

## 1. Design principles

Adopted from the Table Turns v32 redesign. These are non-negotiable for new screens.

1. **No scrolling on desktop.** Every primary view fits in 1440 × 900. Drill-in content opens as in-page expansion, not below the fold.
2. **One question per region.** Every card, strip cell, or panel answers exactly one question. If it answers two, split it.
3. **Headline → evidence → action**, top to bottom, on every page. Reader knows what's wrong before they know what to do.
4. **Color carries meaning, not decoration.** Green = fine / safe / verified. Amber = watch / review / estimated. Red = act now / blocked / too low. Blue = informational / link only.
5. **Numbers in mono, prose in sans.** Operators learn the visual rule once and read faster.
6. **One primary action per page.** Primary blue button. Everything else is secondary or ghost.
7. **Plain English everywhere.** Region titles read as sentences ("Where the time goes") not categories ("Stage decomposition").
8. **Disclosures over duplication.** Detail content lives behind `<details>` toggles or in-page expansions, never as a duplicate panel.

---

## 2. Color tokens

| Token | Use | Hex (approx) |
|---|---|---|
| `--green` | Fine / safe / verified | #22c55e |
| `--amber` | Watch / review / estimated | #f59e0b |
| `--red` | Act now / blocked / too low | #ef4444 |
| `--blue` | Informational / link | #3b82f6 |
| `--t1` | Primary text | #f4f4f5 (dark mode) |
| `--t2` | Secondary text | #a1a1aa |
| `--t3` | Tertiary text / labels | #71717a |
| `--surface` | Default card background | #18181b |
| `--card` | Nested card background (one level deeper) | #1f1f23 |
| `--border` | All borders | #27272a |
| `--green-d` / `--amber-d` / `--red-d` / `--blue-d` | Tinted backgrounds for callouts | (lighter alpha versions) |
| `--green-b` / `--amber-b` / `--red-b` / `--blue-b` | Tinted borders for callouts | (matching alpha) |

**Rules:**
- Never use a hex value directly in markup. Always reference the token.
- Color = meaning. Don't decorate with red because it looks good — only because something is in act-now state.
- Modifier classes (`is-warn`, `is-good`, `is-bad`) carry the semantic, not inline color.

---

## 3. Type scale

| Role | Font | Size | Weight |
|---|---|---|---|
| Page title | `var(--display)` (sans display) | 18px | 700 |
| Hero title | `var(--display)` | 16–18px | 700 |
| Section/panel title | sans | 13.5px | 600 |
| Body prose | sans | 13.5px | 400 |
| Sub-label | sans | 10–11px | 400 |
| Big dollar value | `var(--mono)` | 24–28px | 700 |
| Mid mono number | `var(--mono)` | 13–14px | 700 |
| Inline mono | `var(--mono)` | 10.5–12px | 400 |
| Eyebrow / uppercase label | sans | 9.5–10px | 700, `letter-spacing: 0.05em`, uppercase |

**Rules:**
- Numbers always in `var(--mono)`. Prose always in sans.
- Three weights max in any single region (e.g., title 700 / body 400 / eyebrow 700).
- Letter-spacing only on eyebrows and uppercase chips. Never on body prose.

---

## 4. Page shell + header

Every screen wraps in `sp-shell` and starts with `page-hdr`.

### Markup

```html
<div class="screen" id="screen-X">
  <div class="sp-shell">
    <div class="page-hdr">
      <div class="page-hdr-left">
        <div class="page-hdr-title">Feature Name · Subpage Name</div>
        <div class="page-hdr-sub">One-line description. Plain English. Mentions output type if relevant.</div>
      </div>
      <div class="page-hdr-right">
        <span class="aud-badge aud-gm">GM view</span>
        <select class="filter-select" aria-label="Service">…</select>
        <span class="tag-kds">KDS · live</span>
        <button class="btn btn-secondary btn-sm">Other Subpage</button>
        <button class="btn btn-ghost btn-sm">Evidence</button>
      </div>
    </div>
    <div class="sp-body">
      <!-- content -->
    </div>
  </div>
</div>
```

### Slot rules

- **`page-hdr-left`**: title + sub. No buttons, no chips. Title is "Feature · Subpage" (or just "Feature" for top-level pages without subpages).
- **`page-hdr-right`**: in this order — audience badge → filters/selectors → mode chips → secondary nav buttons → ghost evidence button. Primary button (e.g., "Turn into Action") lives in the body, not the header.

### Migration map

| Old class | Becomes |
|---|---|
| `le-sp-shell`, `tt-sp-shell`, `ac-sp-shell`, `menu-sp-shell` | `sp-shell` |
| `XX-sp-header`, `XX-sp-hdr-left/right/title/sub` | `page-hdr`, `page-hdr-left/right/title/sub` |
| `page-header`, `page-header-left/right/title/sub` (global) | Migrate to `page-hdr-*` |
| `pr-page-header*`, `rp-page-header*`, `le-page-header` (prefixed top-level) | Migrate to `page-hdr-*` |

---

## 5. Five-cell strip

Horizontal row of 5 KPI cells just below the page header. Used on diagnostic feature parent pages.

### Markup

```html
<div class="sp-strip">
  <div class="sp-strip-cell is-warn">
    <div class="sp-strip-k">How long tables sit</div>
    <div class="sp-strip-v">94 min</div>
    <div class="sp-strip-sub">18 min over your 76-min target</div>
  </div>
  <div class="sp-strip-cell"> ... </div>
  <div class="sp-strip-cell is-good"> ... </div>
</div>
```

### Modifier classes

- `is-warn` — amber tint (problem worth watching)
- `is-bad` — red tint (problem requiring action)
- `is-good` — green tint (healthy state)
- (no modifier) — neutral (informational)

### Slot rules

- **`sp-strip-k`** (key) — plain-English sentence-style label ("Tables you missed" not "Lost Covers"). Max ~3 words.
- **`sp-strip-v`** (value) — big mono number. Include unit only if it's not obvious from context.
- **`sp-strip-sub`** (sub) — short context line, 4–8 words. Color-cued: amber for warnings, default for context.

### Always-five rule

Strip is always **exactly 5 cells**. If you have 4 metrics, add a guardrail status cell. If you have 6, demote the weakest to a footnote elsewhere.

### Migration map

| Old class | Becomes |
|---|---|
| `le-sp-strip`, `tt-sp-strip` | `sp-strip` |
| `le-sp-strip-cell`, `tt-sp-strip-cell` | `sp-strip-cell` |
| Bespoke summary rows on Profit Recovery, ROI Proof | Migrate to `sp-strip` |

---

## 6. Hero card

**The canonical hero replaces 9 existing implementations.** Slot-based; one base class + modifier per framing.

### Base markup

```html
<div class="hero-card">
  <span class="hero-eyebrow">
    <span class="hero-eyebrow-dot"></span>
    Top opportunity · Oakland Friday Dinner
  </span>
  <h2 class="hero-title">Tables sit about 18 minutes too long, mostly between dessert and the check.</h2>
  <div class="hero-sub">Guests linger 22 min between finishing dinner and paying — your target is 12. Other stages are inside target.</div>
  <div class="hero-value-block">
    <span class="hero-value-num">~$680</span>
    <span class="hero-value-period">/wk</span>
    <span class="tag-est">EST · not guaranteed</span>
  </div>
  <div class="hero-projection">
    = <strong>$2,944</strong>/mo · ~<strong>$35,328</strong>/yr at this pace
  </div>
  <details class="hero-math">
    <summary>Show the formula</summary>
    <div class="hero-math-body">
      9 tables × $76 avg check = ~$680/wk<br>
      Pattern confidence 74% · revenue est. medium · KDS mode
    </div>
  </details>
  <div class="hero-ctas">
    <button class="btn btn-primary btn-sm">Turn into Action</button>
    <button class="btn btn-secondary btn-sm">See full math</button>
  </div>
</div>
```

### Modifier classes

| Modifier | Use | Visual change |
|---|---|---|
| `hero-single` (default) | Single-question framing (one opportunity, one action) | Standard layout above |
| `hero-ranked` | Portfolio / ranked-list framing (Profit Recovery) | Adds an inline ranked-item list slot after `hero-sub`, before value block |
| `hero-projection` | Numeric-projection framing (Labor Staffing Plan) | Emphasizes `hero-projection` line; CTAs minimized |
| `hero-marketing` | Marketing-grade narrative (Operating System) | Larger display title, no value block, single CTA |

### Slot rules

| Slot | Required? | Notes |
|---|---|---|
| `hero-eyebrow` | Yes | Context label. Optional `hero-eyebrow-dot` for pulse animation when there's a fresh signal. |
| `hero-title` | Yes | The headline question or statement, in display font. Reads as a sentence. |
| `hero-sub` | Optional | One prose line. Don't repeat the headline. |
| `hero-value-block` | Required for diagnostic heroes, omit for `hero-marketing` | Big dollar + period + output-type tag. |
| `hero-projection` | Optional | Monthly/yearly extrapolation. Use `<strong>` for the numbers. |
| `hero-math` | Optional | Collapsible `<details>` with the formula. Always default-collapsed. |
| `hero-ranked-list` | Only for `hero-ranked` modifier | List of opportunities with $/confidence, anchored to the same feature. |
| `hero-ctas` | Yes | One primary + 1–2 secondaries. Primary CTA always present unless empty-state. |

### Migration map

| Old class | Becomes |
|---|---|
| `td-hero`, `pr-hero`, `ac-hero`, `rp-pilot-card`, `le-sf-hero`, `le-bm-hero`, `le-co-hero`, `tt-ov-hero`, `os-hero-h1` | `hero-card` with appropriate modifier |

---

## 7. Tab bar

Already canonical. Rename `skc-tab-bar` → `tab-bar`.

### Markup

```html
<div class="tab-bar">
  <div class="tabs" data-tabs="reports">
    <button class="tab active" data-key="weekly" onclick="switchTab('reports','weekly')">Weekly Report</button>
    <button class="tab" data-key="verified" onclick="switchTab('reports','verified')">Verified Wins</button>
    <button class="tab" data-key="recovery" onclick="switchTab('reports','recovery')">Active Recovery</button>
  </div>
</div>

<div class="tab-panel active" data-tab="reports-weekly"> … </div>
<div class="tab-panel" data-tab="reports-verified"> … </div>
```

### Controller

`switchTab(scope, key)` — toggles `.active` on the matching `.tab` and `.tab-panel`. Lives in `shared/core.js`.

### When to use

- 3 or more orthogonal views of the same data (Reports' Weekly / Verified / Recovery / Risks / Timeline).
- **Don't use** for primary navigation between feature subpages (that's `page-hdr-right` buttons).
- **Don't use** when there are only 2 views (use a toggle inside the relevant card instead — see Watch's "4 stages / Hour-by-hour").

### Migration map

| Old class | Becomes |
|---|---|
| `skc-tab-bar` | `tab-bar` |
| `skc-tabs` | `tabs` |
| `skc-tab` | `tab` |
| `skc-panel` | `tab-panel` |

---

## 8. Doctrine line

The single italic line near the top of a feature page that states the platform doctrine.

### Markup

```html
<div class="doctrine-line">
  <strong>Doctrine:</strong> Revenue opportunity is estimated. Recovered value only counts after guardrails hold during monitoring.
</div>
```

### When to include

- **Required** on every feature parent page (Profit Recovery, Labor, Menu, Table Turns, Kitchen Speed, Actions, ROI Proof).
- **Optional** on subpages (only if the doctrine differs from the parent).
- **Skip** for Today, OS, Reports, Settings (different surfaces).

### Migration map

| Old class | Becomes |
|---|---|
| `pr-doctrine`, `le-doctrine`, `tt-doctrine`, `ac-doctrine` | `doctrine-line` |

---

## 9. Output-type tag

Maps directly to `OUTPUT_TYPES` in `shared/core.js`.

### Markup

```html
<span class="tag-det">DET</span>
<span class="tag-est">EST · not guaranteed</span>
<span class="tag-ver">VER · counted</span>
<span class="tag-kds">KDS · live</span>
<span class="tag-proxy">Proxy · KDS unavailable</span>
```

### Class map

| Class | Output type | Color | Display text |
|---|---|---|---|
| `tag-det` | `deterministic` | green | `DET` or `Measured` |
| `tag-est` | `estimated` | amber | `EST · not guaranteed` |
| `tag-mod` | `modeled` | amber | `MOD · modeled` |
| `tag-heu` | `heuristic` | blue | `HEU · rule-of-thumb` |
| `tag-sim` | `simulation` | blue | `SIM · what-if` |
| `tag-ver` | `verified` | green | `VER · counted` |
| `tag-act` | `active_recovery` | blue | `ACT · in monitoring` |
| `tag-open` | `open_opportunity` | amber | `OPEN · pending` |
| `tag-na` | `unavailable` | red | `N/A · source missing` |
| `tag-kds` | (mode) | blue | `KDS · live` |
| `tag-proxy` | (mode) | amber | `Proxy · KDS unavailable` |

### Rules

- Display text comes from `getOutputLabel()` — don't hardcode.
- Tag follows the value it labels. `~$680 [EST · not guaranteed]` reads naturally.
- Never invent new tag types. If you need a new one, add it to `OUTPUT_TYPES` registry first.

### Migration map

| Old class | Becomes |
|---|---|
| `tt-chip-est`, `le-tag-est`, `tt-chip-est` etc. | `tag-est` |
| `tt-chip-det`, `le-tag-det` | `tag-det` |
| `tt-chip-proxy` | `tag-proxy` |
| `tt-chip-kds` | `tag-kds` |
| `tt-mode-chip` | `tag-kds` or `tag-proxy` (whichever matches) |
| `os-chip`, `os-chip-amber` | `tag-est` or specific tag |
| Hardcoded `[ESTIMATED]` text | `<span class="tag-est">EST · not guaranteed</span>` |

---

## 10. Audience badge

Already canonical. Rename `skc-aud-badge` → `aud-badge`.

### Markup

```html
<span class="aud-badge aud-gm" title="…">GM view</span>
<span class="aud-badge aud-owner" title="…">Owner view</span>
<span class="aud-badge aud-both" title="…">Both</span>
```

### Rule

**Every page header carries an audience badge.** Pages currently missing one (Today, Labor subpages, Table Turns subpages, Actions, Menu) get one added in the refactor.

### Migration map

| Old class | Becomes |
|---|---|
| `skc-aud-badge` | `aud-badge` |
| `skc-aud-gm`, `skc-aud-owner`, `skc-aud-both` | `aud-gm`, `aud-owner`, `aud-both` |

---

## 11. Item card

Used for every "list of operator-actionable items" — playbooks, staffing recommendations, blocked actions, pending decisions, menu items.

### Markup

```html
<div class="item-card is-review">
  <div class="item-card-h">
    <div>
      <div class="item-card-t">1 · Dessert menu at the 60-minute mark</div>
      <div class="item-card-sub">Server presents the dessert menu proactively at minute 60. Targets Stage 4.</div>
    </div>
    <div>
      <div class="item-card-val">$420/wk</div>
      <span class="tag-est">EST</span>
    </div>
  </div>
  <div class="item-card-meta">
    <span>Stage 4 · Dessert→Check</span>
    <span>Target: −10 min</span>
    <span class="item-card-conf">78% · review first</span>
    <span>Owner: Server team · Fri 7–9 PM</span>
  </div>
  <div class="item-card-caveat">
    Confidence between 70–79% — review the math, then proceed.
  </div>
  <div class="item-card-cta">
    <button class="btn btn-primary btn-sm">Turn into Action</button>
    <button class="btn btn-secondary btn-sm">Math</button>
  </div>
</div>
```

### Modifier classes

| Modifier | Use | Visual |
|---|---|---|
| `is-ready` | ≥80% confidence | Green left-border, green `item-card-conf` |
| `is-review` | 70–79% confidence | Amber left-border, amber `item-card-conf`. **Show `item-card-caveat`.** |
| `is-too-low` | <70% confidence | Red left-border, red `item-card-conf`, primary CTA replaced with "Investigate evidence". **Show `item-card-caveat`.** |
| `is-blocked` | Action is blocked by data or guardrail | Gray left-border, blocking-reason caveat |
| `is-in-actions` | Already turned into an action | Subdued border, `In Actions` chip in place of primary CTA |

### Tier rules (strict)

- **≥80%** = `is-ready` (green). Can be single-applied or bulk-applied. Primary CTA: `Turn into Action`.
- **70–79%** = `is-review` (amber). Can be single-applied or bulk-applied. Primary CTA: `Turn into Action`. **Caveat block required.**
- **<70%** = `is-too-low` (red). **Cannot be acted on.** Primary CTA replaced with `Investigate evidence`. **Caveat block required.**

This rule is **doctrine** — applies on every item card in the app. Documented in feature Evidence pages.

### Slot rules

- **`item-card-h`** — Two-column: left has title + sub, right has value + output-type tag.
- **`item-card-t`** — Title. Numbered if part of a sorted list ("1 · Dessert menu…").
- **`item-card-meta`** — Inline chips of stage / target / confidence / owner. Use `·` separator between chips visually.
- **`item-card-caveat`** — Only present for `is-review`, `is-too-low`, `is-blocked`. Bordered callout with the rule that triggered.
- **`item-card-cta`** — One primary + 1 secondary. Never more than 2 CTAs per card.

### Migration map

| Old class | Becomes |
|---|---|
| `le-sf-item`, `tt-pb-item`, `ac-bk-item`, `tt-queue-item` | `item-card` |
| `le-sf-item-conf-green` etc. | `is-ready` modifier |
| `le-sf-item-conf-amber` | `is-review` modifier |
| `le-sf-item-conf-red` | `is-too-low` modifier |

---

## 12. Evidence page

Reference / methodology page for every feature. **Reverts the Table Turns "Trust" rename — every feature's reference page is called Evidence.**

### Structure

```
Page header (page-hdr)
↓
Sticky TOC (ev-toc) — anchor links to sections
↓
Expand/Collapse toolbar (ev-toolbar)
↓
Numbered sections (ev-section) — 2–4 per page
  Each section has:
    Section header (ev-section-h) with num + title + sub
    Grid of expandable cards (ev-grid > details.ev-card)
      Each card:
        Summary (ev-h) — icon + title + chevron
        Body (ev-body) — content (rules, formulas, restrictions)
```

### Markup

```html
<div class="sp-body">
  <nav class="ev-toc">
    <a href="#ev-detection" class="ev-toc-item">
      <span class="ev-toc-num">1</span>
      <span class="ev-toc-label">Detection</span>
      <span class="ev-toc-sub">4 cards</span>
    </a>
    <a href="#ev-verification" class="ev-toc-item">…</a>
  </nav>
  <div class="ev-toolbar">
    <span class="ev-toolbar-hint">Click any card title to expand it · or use:</span>
    <button class="btn btn-ghost btn-sm" onclick="evToggleAll(true)">Expand all</button>
    <button class="btn btn-ghost btn-sm" onclick="evToggleAll(false)">Collapse all</button>
    <span class="ev-refresh-stamp">Last refreshed 4 min ago</span>
  </div>
  <section class="ev-section" id="ev-detection">
    <div class="ev-section-h">
      <span class="ev-section-num">1</span>
      <h2 class="ev-section-title">Detection</h2>
      <span class="ev-section-sub">How leaks are surfaced — formulas, sources, confidence, blockers</span>
    </div>
    <div class="ev-grid">
      <details class="ev-card">
        <summary class="ev-h">
          <span class="ev-icon">ƒ</span>
          The formulas
          <span class="ev-card-chev">▾</span>
        </summary>
        <div class="ev-body">
          <span class="mono">Revenue opportunity = lost covers × avg check</span>
          <div class="ev-row"><span>Confidence floor for action</span><strong>70%</strong></div>
          <div class="ev-rule"><strong>Stale data &gt; 24h</strong> → confidence capped at 80%.</div>
        </div>
      </details>
    </div>
  </section>
</div>
```

### Rules

- **TOC required** when the page has ≥2 sections.
- **Expand/collapse toolbar required** on every Evidence page.
- **Last-refreshed timestamp** in the toolbar — proves the page is current.
- **Cards default-collapsed** on every Evidence page. Expanding is an act of intent.
- **Section count**: 2–4 sections per Evidence page. More than 4 = restructure into separate pages or merge cards.

### Migration map

| Old class | Becomes |
|---|---|
| `le-ev-*` (Labor Evidence) | `ev-*` (rename) |
| `tt-ev-*` (Table Turns — now using LE pattern after v32) | `ev-*` |
| `ac-ev-*` (Actions Evidence) | `ev-*` + restructure to TOC + sections |
| `menu-ev-*` (Menu Evidence) | `ev-*` + restructure |
| `openEvDrawer()` modal (Profit Recovery) | Deep-link to feature Evidence page; modal retired |

---

## 13. DQ banner

Inline banner when source health affects the page.

### Markup

```html
<div class="dq-banner" data-feature="labor">
  <svg class="dq-banner-ico">…</svg>
  <div class="dq-banner-body">
    <strong>Payroll wage data partially connected.</strong>
    Excess hours are primary; dollar values use estimated wage rate.
  </div>
  <button class="btn btn-ghost btn-sm" onclick="showScreen('settings',null,'Data Quality')">Connect payroll →</button>
</div>
```

### Rules

- **One canonical class**: `dq-banner`. The DQ engine populates content based on `data-feature` attribute.
- **Variants**: `dq-banner-warn` (amber) and `dq-banner-bad` (red) modifier classes.
- **Specialized notes** (e.g., Proxy mode notice on Table Turns) extend with `dq-banner-mode` modifier.

### Migration map

| Old class | Becomes |
|---|---|
| `dq-today-banner`, `dq-recovery-banner`, `dq-proof-note`, `dq-reports-note` etc. | `dq-banner` with `data-feature` |
| `tt-mode-note`, `tt-data-notice`, `le-data-notice` | `dq-banner dq-banner-mode` |

---

## 14. Cross-link card

Footer card linking related features. **Required on every feature page.**

### Markup

```html
<div class="crosslink-footer">
  <button class="crosslink-card" onclick="showScreen('leaks',null,'Profit Recovery')">
    <div class="crosslink-card-t">Profit Recovery →</div>
    <div class="crosslink-card-body">
      Profit Recovery ranks the opportunity across all features. The Friday dinner table-turn leak is listed there as throughput exposure.
    </div>
  </button>
  <button class="crosslink-card" onclick="showScreen('throughput',null,'Kitchen Speed')">
    <div class="crosslink-card-t">Kitchen Speed →</div>
    <div class="crosslink-card-body">…</div>
  </button>
</div>
```

### Rules

- **1–3 crosslink cards** per page, no more.
- **Title format**: `<Feature Name> →`
- **Body**: 1–2 sentences. State why a manager would jump there from this page.
- **Placement**: footer of the feature page, above any page-level footer nav.

---

## 15. Vocabulary canonical

Every term that had multiple spellings in the audit — locked to one.

### Estimated $ label

**Canonical:** `EST · not guaranteed`

Qualifiers append: `EST · not guaranteed · proxy`, `EST · not guaranteed · wage unconfirmed`. Tag class: `tag-est`.

### Action verbs

| Action | Canonical phrase |
|---|---|
| Single-item commit | `Turn into Action` |
| Bulk commit | `Apply N actions · $X/wk →` |
| Cannot act (sub-action-floor) | `Investigate evidence` |
| State transition: approval | `Approve` |
| State transition: verification | `Verify` |
| State transition: rejection | `Reject` |
| State transition: dismissal | `Dismiss` |
| State transition: snooze | `Snooze` |
| Open the action's detail surface | `Open` |

### Reference page

**Canonical:** `Evidence`.

Page title: `Feature · Evidence`. Button labels: `Open Evidence` (general nav), `See full math` (contextual to a specific number).

Section titles inside Evidence: `Math` / `Rules` / `Restrictions` / `Detection` / `Verification` etc. — section names, not page names.

### Throughput / cover terms

| Context | Canonical |
|---|---|
| User-facing (heroes, strips, panels) | `Tables you missed` |
| Engineer-facing (Evidence formula, code) | `Lost covers` |

### Guardrail framing

| Context | Canonical |
|---|---|
| Engineering / rule context (sidebar cards, Evidence) | `Guardrails` |
| User-facing question (hero / overview panel titles) | `Is it safe?` |

### "Not counted" phrasing

**Canonical:** `not counted as recovery`.

Doctrine line variant: `Only verified counts toward ROI`.

### Mode (KDS / Proxy)

| State | Canonical |
|---|---|
| KDS active | `KDS · live` |
| Proxy mode | `Proxy · KDS unavailable` |

### Confidence tier labels

| Tier | Confidence | Canonical label |
|---|---|---|
| Ready | ≥80% | `XX% · ready` (green) |
| Review | 70–79% | `XX% · review first` (amber) |
| Too low | <70% | `XX% · too low to act` (red) |

### Audience labels

| Use | Canonical |
|---|---|
| GM-facing | `GM view` |
| Owner-facing | `Owner view` |
| Both audiences | `Both` |

---

## 16. Migration sequence

From the audit, in priority order. Each phase is one focused refactor session.

| Phase | Scope | Risk | Sessions |
|---|---|---|---|
| 2.1 | **Vocabulary search-and-replace** | Low | 1 |
| 2.2 | **Output-type tag family** (`tt-chip-*` / `le-tag-*` / `os-chip-*` → `tag-*`) | Low | 1 |
| 2.3 | **Audience badge** rename + apply to missing pages | Low | 1 |
| 2.4 | **Doctrine line** rename + apply consistently | Low | 1 |
| 2.5 | **Page header** unification (`XX-sp-hdr-*` → `page-hdr-*`) | Medium | 1 |
| 2.6 | **Five-cell strip** unification | Low | 1 |
| 2.7 | **Item card** unification (most visually load-bearing) | High | 2–3 |
| 2.8 | **Hero card** canonical (9 implementations → 1) | High | 3–4 |
| 2.9 | **Evidence page** restructure (Actions + Menu adopt `ev-*` pattern) | Medium | 1 |
| 2.10 | **DQ banner** centralization | Medium | 1 |
| 2.11 | **Cross-link cards** added where missing | Low | 1 |
| **Total** | | | **~14 sessions** |

### Why this order

Low-risk vocabulary / tag / badge / doctrine work goes first because it's mechanical and immediately raises the quality bar. Header / strip / item card / hero — the load-bearing visual components — come after, when the engineer has confidence in the canonical patterns.

---

## 17. New-screen checklist

When building a new screen, work through this list in order:

- [ ] Wrap in `sp-shell`
- [ ] Add `page-hdr` with title, sub, audience badge, optional filters/chips, secondary CTAs
- [ ] Decide: is there a doctrine? If yes, add `doctrine-line` below header
- [ ] Decide: is there a 5-cell summary? If yes, add `sp-strip` with 5 cells (always 5)
- [ ] Add hero card (`hero-card` + appropriate modifier) with eyebrow, title, sub, value, math expander, CTAs
- [ ] Layout main content (grid, panels, item cards as needed)
- [ ] Item cards use `item-card` + tier modifier
- [ ] Every dollar value carries an output-type `tag-*`
- [ ] Add `crosslink-card` footer if there are 1–3 related features to point to
- [ ] If source health affects the page, declare a `dq-banner` placeholder
- [ ] If the page has a methodology, build an Evidence page using `ev-*` pattern
- [ ] Run through the design principles (Section 1) — does the page hold?
- [ ] Check the vocabulary list (Section 15) — every term canonical?

---

*Locked v32. Subsequent changes to canonical patterns require updating this doc + flagging in `docs/handoff-notes/vNN.md`.*
