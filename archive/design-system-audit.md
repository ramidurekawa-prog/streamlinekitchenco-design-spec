# Design System Audit (v32)

> Inventory of every pattern divergence across the SKC app. Read this with `docs/Page-spec-docs.md` open. Phase 0 of the uniformity pass — sees the full surface before any refactor decisions are made.

## Top-line finding

The codebase has **structural sameness with visual and lexical drift.** Every feature uses the same conceptual shape (header → strip → hero → grid → evidence), but every feature also invented its own CSS prefix, its own item-card markup, its own chip styles, and its own copy. There are exactly **two genuinely shared patterns** today (the `skc-aud-badge` audience pill and the `skc-tab-bar` tabs). Everything else is per-feature.

The good news: the structural sameness means refactoring is mostly **rename + remap**, not rebuild.

## How to read this audit

Each section below is one pattern type. Per pattern:

1. **What it is** — what concept the pattern carries
2. **Versions today** — every variant in the codebase, with which files use which
3. **What's wrong** — concrete consequences of the divergence
4. **Canonical proposal** — what to standardize on
5. **Refactor cost** — rough sense of effort to unify

After the patterns: **vocabulary inventory** (every term that has multiple spellings) and a **per-feature CSS prefix index** for future reference.

---

# Pattern inventory

## 1. Page header

**What it is:** The top of every screen — title, subtitle, right-side controls (CTAs, audience badge, mode chip).

**Versions today:**

| Pattern | Used by | Markup |
|---|---|---|
| **A · `page-header` global** | Reports, OS, Settings, Today (top-level screens) | `<div class="page-header"><div class="page-header-left">… <div class="page-header-title">…</div> <div class="page-header-sub">…</div></div><div class="page-header-right">…</div></div>` |
| **B · prefixed wrapper, global inner** | Profit Recovery (`pr-page-header*`), ROI Proof (`rp-page-header*`), Labor Heatmap (`le-page-header*`) | Outer div is feature-prefixed, but inner `.page-header-title` and `.page-header-sub` are global |
| **C · subpage shell** | Labor (all subpages), Table Turns (all subpages), Actions (all subpages), Menu (all subpages) | `<div class="XX-sp-header"><div class="XX-sp-hdr-left"><div class="XX-sp-hdr-title">…</div> <div class="XX-sp-hdr-sub">…</div></div><div class="XX-sp-hdr-right">…</div></div>` where XX = `le`, `tt`, `ac`, `menu` |

**What's wrong:**
- Three different visual treatments for the same concept (header).
- Pattern C's `XX-sp-hdr-title` ignores the global typography defined by `page-header-title`, leading to subtle size/weight drift between top-level pages and subpages of the same feature.
- Adding a new screen requires choosing between three patterns with no documented rule.

**Canonical proposal:** **Adopt Pattern C** as the universal page header — rename `XX-sp-*` → `page-hdr-*` (single shared prefix). It has the cleanest left/right split, supports right-side CTAs and chips, and already accommodates subpages. Patterns A and B retired.

**Refactor cost:** Medium. ~10 screens to touch, mostly find-and-replace.

---

## 2. Five-cell strip

**What it is:** The horizontal row of 5 KPI cells just below the header on dense feature pages. Each cell: key (label) / value (big number) / sub (caption).

**Versions today:**

| Pattern | Used by | Markup |
|---|---|---|
| **A · `le-sp-strip`** | Labor (Overview, Staffing, Benchmarks) | `<div class="le-sp-strip"><div class="le-sp-strip-cell"><div class="le-sp-strip-k">…</div>…</div></div>` |
| **B · `tt-sp-strip`** | Table Turns (Watch) | Same markup, `tt-` prefix |
| **C · custom inline grids** | Profit Recovery, ROI Proof | Bespoke grid + cells per page, not a reusable component |
| **D · no strip** | Today, OS, Reports, Settings | Use other summary layouts (cards, narrative) |

**What's wrong:**
- A and B are visually identical but ship as two duplicate CSS rule sets.
- C reinvents the wheel per page (and may drift on padding, font size, color rules).
- Adding a 5-cell summary to a new screen has no canonical choice.

**Canonical proposal:** **Unify A + B into `sp-strip` / `sp-strip-cell` / `sp-strip-k` / `sp-strip-v` / `sp-strip-sub`.** Add `is-warn` / `is-good` / `is-bad` modifier classes. Migrate Profit Recovery and ROI Proof's bespoke summaries to this pattern where the shape fits.

**Refactor cost:** Low for A→B unification (rename only). Medium for migrating C.

---

## 3. Hero / top-opportunity card

**What it is:** The big "headline + dollar amount + CTAs" card that anchors every diagnostic page.

**Versions today:**

| Pattern | Used by | Notes |
|---|---|---|
| `td-hero` | Today | Action-first layout, single CTA |
| `pr-hero` | Profit Recovery | Big eyebrow + pulse dot + headline + ranked list below |
| `ac-hero` | Actions Overview | Grid layout with hero + value rail |
| `rp-pilot-card` | ROI Proof | Specialized for pilot phase |
| `le-sf-hero` | Labor Staffing Plan | Different from labor overview |
| `le-bm-hero` | Labor Benchmarks | Different again |
| `le-co-hero` | Labor Server Coaching | Different again (three sub-heroes inside Labor alone) |
| `tt-ov-hero` | Table Turns Watch | Inside an `tt-ov-panel`, nested |
| `os-hero-h1` | Operating System | Marketing-grade text hero |

**What's wrong:**
- **9 hero implementations.** Each has its own eyebrow, headline, value-display, CTA convention.
- Even *within Labor Efficiency* there are 3 different hero patterns (Staffing / Benchmarks / Coaching).
- A manager moving between features re-orients every time.

**Canonical proposal:** Define **one canonical hero** with slots: `hero-eyebrow` (with optional pulse dot), `hero-title` (display font), `hero-sub` (one prose line), `hero-value-block` (big dollar + period + EST chip), `hero-ctas` (one primary + optional secondaries). All variants migrate to it. Specialized cases like the OS marketing hero get a modifier class (`hero-marketing`) instead of a separate component.

**Refactor cost:** High. The hero is visually load-bearing on every page, so changes are visible. ~9 components to unify.

---

## 4. Tab bar

**What it is:** Horizontal tab strip that swaps content panels below it.

**Versions today:**

| Pattern | Used by | Notes |
|---|---|---|
| **`skc-tab-bar` / `skc-tabs` / `skc-tab`** | Reports, Settings | Already canonical. Uses `data-tabs="X"`, `data-key="Y"`, and a `switchTab(X, Y)` controller. Clean. |
| Inline custom tabs | Table Turns Trust *(before LE-Evidence rebuild — now removed)* | Was bespoke, now gone |
| Daypart "tabs" | Labor Heatmap (filter pills) | Different concept (filter chips), not tabs |

**What's wrong:** Mostly fine. The `skc-tab-bar` pattern works and is reused. **Risk:** future contributors invent new tab patterns instead of reaching for `skc-tab-bar`.

**Canonical proposal:** **Promote `skc-tab-bar` to the documented canonical**, rename to `tab-bar` / `tabs` / `tab` (drop `skc-` since everything in this app is SKC). Document the `switchTab(scope, key)` controller convention.

**Refactor cost:** Trivial. Rename only.

---

## 5. Doctrine line

**What it is:** The single italic line near the top of a feature page that states the platform doctrine for that feature ("Only verified counts toward ROI" etc.).

**Versions today:**

| Pattern | Used by | Color |
|---|---|---|
| `pr-doctrine` | Profit Recovery | Blue text on subtle background |
| `le-doctrine` | Labor Heatmap | Same |
| `tt-doctrine` | (old) Table Turns Stage Flow — deleted in v32 redesign | — |
| `ac-doctrine` | Actions Overview | Same |
| **No doctrine line** | Today, OS, Reports, Settings, ROI Proof, Menu | These pages either don't have one or embed the doctrine elsewhere |

**What's wrong:** Same pattern, 4 prefixes. Inconsistency between which pages get a doctrine line and which don't.

**Canonical proposal:** **One class `doctrine-line`.** Decide which feature pages should have one (probably: every feature parent page + Profit Recovery + ROI Proof). Add or remove to bring consistency.

**Refactor cost:** Low.

---

## 6. Output-type chip

**What it is:** The small inline pill that labels a value's confidence/output type — EST / DET / VER / MOD / SIM / HEU / PROXY / KDS / etc.

**Versions today:**

| Pattern | Used by | Variants |
|---|---|---|
| `tt-chip` family | Table Turns | `tt-chip-est`, `tt-chip-det`, `tt-chip-proxy`, `tt-chip-heur`, `tt-chip-kds`, `tt-chip-mon`, `tt-chip-pending`, `tt-chip-stable` |
| `le-tag` family | Labor | `le-tag-det`, `le-tag-est` |
| `os-chip` family | Operating System | `os-chip`, `os-chip-amber` |
| `tt-mode-chip` | Table Turns | KDS / Proxy mode badge |
| Inline `[ESTIMATED]` tags | Multiple | Hardcoded as text in many places |

**What's wrong:**
- **Three CSS families** for the same concept.
- Color rules likely diverge slightly (each family was styled independently).
- The `OUTPUT_TYPES` registry in `shared/core.js` is the source of truth, but CSS doesn't match it 1:1.

**Canonical proposal:** **One `tag-X` family** mapped directly to `OUTPUT_TYPES`: `tag-det` (green), `tag-est` (amber), `tag-mod` (amber), `tag-heu` (blue), `tag-sim` (blue), `tag-ver` (green), `tag-act` (blue), `tag-open` (amber), `tag-na` (red). Plus mode chips: `tag-kds`, `tag-proxy`. Use `getOutputLabel()` from core.js for the display text.

**Refactor cost:** Medium. Visible everywhere but mechanical to migrate.

---

## 7. Audience badge

**What it is:** The "Owner view / GM view / Both" pill in the header right.

**Versions today:**

| Pattern | Used by | Notes |
|---|---|---|
| **`skc-aud-badge` / `skc-aud-gm` / `skc-aud-owner` / `skc-aud-both`** | Profit Recovery, ROI Proof, OS, Reports, Settings | **Already canonical** — used wherever it exists |
| **Missing** | Today, Labor (any subpage), Table Turns (any subpage), Actions, Menu | These pages don't carry an audience badge at all |

**What's wrong:** Inconsistent application — half the pages have it, half don't.

**Canonical proposal:** **Promote `skc-aud-badge` to canonical, rename to `aud-badge`.** Decide which pages should carry an audience badge (probably every page) and add where missing.

**Refactor cost:** Low.

---

## 8. Item card / action row

**What it is:** The repeating card pattern used for "list of items the user can act on" — playbooks, staffing recommendations, blocked actions, pending decisions, etc.

**Versions today:**

| Pattern | Used by | Shape |
|---|---|---|
| `le-sf-item` | Labor Staffing Plan | Title + sub + value block + meta row + caveat + CTAs |
| `tt-pb-item` | Table Turns Decide | Title + sub + value block + stages row + (caveat) + CTAs |
| `ac-bk-item` | Actions (Blocked, Pending, Ready, etc.) | Title + sub + meta + CTAs |
| `tt-queue-item` | (old) Table Turns Stage Flow queue — deleted | — |
| `le-co-card` | Labor Server Coaching | Server card with radar |

**What's wrong:**
- **3+ duplicate components** doing the same job with different prefixes.
- Each has its own confidence-tier visual treatment (border-left color, chip color).
- Each has its own CTA convention.

**Canonical proposal:** **One `item-card` component** with slots: header (title + sub + value), meta (chip-row of stage / target / confidence / owner), optional caveat, CTAs. Modifier classes for tier: `is-ready`, `is-review`, `is-too-low`, `is-blocked`. Confidence-chip color rule documented once.

**Refactor cost:** High. The most visually load-bearing component pattern, used in every diagnostic feature.

---

## 9. Evidence pattern

**What it is:** The methodology / rules / formula reference page that backs every feature.

**Versions today:**

| Pattern | Used by | Shape |
|---|---|---|
| **`le-ev-*` (TOC + sections + expandable cards)** | Labor Evidence, Table Turns Trust *(after v32 rebuild)* | Sticky TOC at top, numbered sections, `<details>`-based expandable cards with chevrons. The good pattern. |
| `ac-ev-*` | Actions Evidence | Flat card grid (no TOC, no sections) |
| `menu-ev-*` *(likely)* | Menu Evidence | Flat card grid |
| Modal "evidence drawer" | Profit Recovery uses `openEvDrawer()` | Overlay/modal pattern instead of full page |
| `(no evidence)` | Today, OS, Reports, Settings | These pages don't have an evidence backstop |

**What's wrong:**
- Two structurally different layouts (TOC + expandable vs flat card grid).
- The "evidence drawer" overlay is a third UX surface entirely.
- We **just unscoped `.le-ev-*` styles globally** in the v32 redesign so Trust could reuse them. Other features could now adopt the pattern for free.

**Canonical proposal:** **`le-ev-*` (renamed to `ev-*` or `evidence-*`) is the canonical evidence page.** TOC + sections + expandable cards. Migrate `ac-ev-*` and `menu-ev-*` to it. The evidence drawer in Profit Recovery becomes a deep-link to the relevant feature's Evidence page (no separate modal pattern).

**Refactor cost:** Low to medium. CSS is already global. Just need to update HTML structure on Actions and Menu Evidence subpages.

---

## 10. DQ (Data Quality) banner

**What it is:** The yellow/red banner that appears when a data source is degraded and a feature's confidence is affected.

**Versions today:**

| Pattern | Used by |
|---|---|
| `dq-banner` (generic) | Profit Recovery |
| `dq-today-banner` | Today (currently `display:none` — removed by request) |
| `dq-recovery-banner` | Profit Recovery (legacy?) |
| `dq-proof-note`, `dq-proof-accounting`, `dq-ve-eligibility` | ROI Proof (3 different DQ notes) |
| `dq-reports-note` | Reports |
| `tt-mode-note` / `tt-data-notice` | Table Turns (different pattern entirely) |
| `le-data-notice` | Labor Heatmap |

**What's wrong:**
- One central data-quality system; many UI surfaces for it.
- Each page has its own placeholder div + populator function.

**Canonical proposal:** **One `dq-banner` component** that takes a content payload from the data-quality engine. Each page declares a single `<div data-dq-banner="featureName"></div>`; the engine populates. Specialized notes (proxy-mode notice on Table Turns) become modifier classes.

**Refactor cost:** Medium. Touches several screens + the DQ engine.

---

## 11. Cross-link card

**What it is:** The card at the bottom of a feature page that says "this feature relates to [other feature] — go there if X."

**Versions today:**

| Pattern | Used by |
|---|---|
| `tt-crosslinks` / `tt-cl-card` | Table Turns Stage Flow *(now deleted)* |
| `(inline button row)` | Profit Recovery footer |
| `(no cross-links)` | Most pages |

**What's wrong:** Cross-feature navigation is one of SKC's strongest narrative threads (Labor leak → Profit Recovery → Today decision → Actions monitoring), but the UI for crosslinks is inconsistent or missing.

**Canonical proposal:** **One `crosslink-card` component** with title + sub + arrow. Standard footer placement on every feature page.

**Refactor cost:** Low. Mostly net-new add.

---

# Vocabulary inventory

Every term that has multiple spellings for the same concept.

## Estimated dollar label

| Variant | Used where |
|---|---|
| `[ESTIMATED]` | Labor Staffing Plan items, Table Turns Decide playbooks |
| `EST · not guaranteed` | Table Turns Watch hero value chip |
| `EST · not guaranteed recoverable revenue` | (old) Table Turns Stage Flow value chip |
| `EST · proxy` | Table Turns proxy mode |
| `(estimated)` parenthetical | Some inline mentions |
| `[ESTIMATED · WAGE UNCONFIRMED]` | Labor Evidence (qualified variant) |

**Canonical proposal:** `[EST · not guaranteed]` everywhere. Qualifiers (`· wage unconfirmed`, `· proxy`) append after `EST`.

## Action verbs

| Variant | Used where |
|---|---|
| `Turn into Action` | Labor Staffing Plan, Table Turns Decide |
| `Create Action` | (old) Table Turns Stage Flow |
| `Apply N actions · $X/wk →` | Labor Staffing Plan bulk, Table Turns Decide bulk |
| `Assign Highest-Value Action` | Profit Recovery hero CTA |
| `Approve` / `Dismiss` / `Snooze` | Actions Pending Decisions |
| `Verify` / `Reject` | Actions Ready to Verify |

**Canonical proposal:** **`Turn into Action`** for the single-item commit. **`Apply N actions · $X/wk →`** for bulk. Profit Recovery's "Assign" reframed as "Turn into Action." State transitions in Actions (Approve / Verify / etc.) stay as-is since they're distinct lifecycle moves.

## Reference page name

| Variant | Used where |
|---|---|
| `Trust` | Table Turns (v32 rename) |
| `Evidence` | Labor, Menu, Actions, every other feature |
| `Show the Math` | Profit Recovery button |
| `Show Evidence` | (old) Table Turns button |
| `Open Evidence` | Labor / Table Turns buttons |
| `Full Evidence Drawer` | (old) Table Turns footer |

**Canonical proposal:** **Rename Trust back to Evidence** for cross-feature consistency. Page name = `Evidence`. Button label = `Open Evidence` (or `See full math` when contextual to a specific number). The Table Turns v32 rebuild's tab labels (Math / Rules / Restrictions) stay — those are *sections inside* Evidence, not the page name.

## Throughput / cover terms

| Variant | Used where |
|---|---|
| `Tables you missed` | Table Turns Watch (new in v32) |
| `Lost covers` | (old) Stage Flow, Lost Covers page |
| `Est. missed covers` | (old) Heatmap, daypart cards |
| `Recovered covers` | (old) Lost Covers monitoring section |

**Canonical proposal:** **`Tables you missed`** (operator-friendly) in user-facing copy. **`Lost covers`** (industry term) in Evidence / formulas / engineer-facing copy. Document the distinction.

## Service-quality / guardrail framing

| Variant | Used where |
|---|---|
| `Service quality` | Table Turns Watch strip (new) |
| `Guardrails` | Labor, Table Turns Decide, Actions |
| `Counter-metric guardrails` | (old) Stage Flow |
| `Is it safe?` | Table Turns Watch panel title (new) |
| `Will it hurt service?` | Table Turns Watch sub-card (new) |

**Canonical proposal:** Two valid contexts: **`Guardrails`** (the rule / engineering term) and **`Is it safe?`** (the user-facing question). Use Guardrails on sidebars, Evidence, formulas. Use Is it safe? on hero / overview / action panels.

## "Not counted" phrasing

| Variant | Used where |
|---|---|
| `not counted as recovery` | Labor, Table Turns Watch |
| `don't count` | Casual mentions |
| `Verified savings only count after…` | Doctrine line |
| `count only after the monitoring window closes` | Various |

**Canonical proposal:** **`not counted as recovery`** in all user-facing copy. **`only `verified` counts toward ROI`** in doctrine and engineer-facing docs. (Already the convention in `docs/doctrine.md`.)

## Mode (KDS / Proxy)

| Variant | Used where |
|---|---|
| `KDS · live` | Table Turns Watch header (new) |
| `KDS MODE` | Various Table Turns chips |
| `Stage decomposition active` | Mode description |
| `PROXY MODE` | When KDS unavailable |
| `Service-speed proxy` | Old proxy panel |

**Canonical proposal:** **`KDS · live`** (when active) and **`Proxy · KDS unavailable`** (when degraded) as chip text. Full descriptions live in Evidence.

---

# Per-feature CSS prefix index

For future reference: what each prefix scopes.

| Prefix | Feature | Approximate count |
|---|---|---|
| `td-` | Today | ~15 classes |
| `pr-` | Profit Recovery | ~40 classes |
| `le-` | Labor Efficiency | ~120 classes (largest) |
| `tt-` | Table Turns | ~80 classes |
| `menu-` | Menu Optimization | ~50 classes (est.) |
| `ac-` | Actions | ~70 classes |
| `rp-` | ROI Proof | ~30 classes |
| `os-` | Operating System | ~40 classes |
| `dq-` | Data Quality banners (cross-feature) | ~10 classes |
| `skc-` | Shared / unified (audience badge, tabs) | ~10 classes |

**Total estimated:** ~465 feature-prefixed CSS classes. Roughly 60% are reasonable feature-specific styling (heatmap cells, radar SVG, KDS bars). The other 40% (~190 classes) are pattern reimplementations that would collapse into ~30 shared classes if canonical patterns were adopted.

---

# Recommended sequence

If the goal is full uniformity:

1. **Lock the canonical patterns** in `docs/design-system.md` (Phase 1).
2. **Refactor in priority order** (Phase 2):
   1. **Vocabulary first** — search-and-replace the simplest divergences (estimated label, action verbs). Low risk, immediately visible.
   2. **Shared chip / tag family** — migrate `tt-chip-*`, `le-tag-*`, `os-chip-*` to `tag-*`. Touches CSS and HTML across many files but mechanical.
   3. **Item card pattern** — migrate `le-sf-item`, `tt-pb-item`, `ac-bk-item` to `item-card`. Visually load-bearing; do per-feature with screenshots before/after.
   4. **Page header** — migrate `XX-sp-hdr-*` to `page-hdr-*`. Affects every screen.
   5. **Strip** — migrate `le-sp-strip` / `tt-sp-strip` to `sp-strip`. Affects diagnostic features.
   6. **Hero patterns** — the longest refactor. Define canonical hero, migrate 9 implementations. Do one feature at a time.
   7. **Evidence pattern** — migrate `ac-ev-*` and `menu-ev-*` to the global `.le-ev-*` (rename to `.ev-*`).
   8. **Audience badge + doctrine line + crosslinks** — additive across pages, low risk.

## Effort estimate

| Phase | Effort |
|---|---|
| Phase 1 (lock canonical patterns) | 1 focused session |
| Phase 2.1 (vocabulary) | 1 session |
| Phase 2.2 (chip / tag family) | 1 session |
| Phase 2.3 (item card) | 2–3 sessions (visually load-bearing) |
| Phase 2.4 (page header) | 1 session |
| Phase 2.5 (strip) | 1 session |
| Phase 2.6 (hero patterns) | 3–4 sessions |
| Phase 2.7 (evidence) | 1 session |
| Phase 2.8 (badge / doctrine / crosslinks) | 1 session |
| **Total** | **~11–14 sessions** of focused refactor work |

---

*Last updated as part of the v32 uniformity pass. This is Phase 0 — the audit. Phase 1 (locking canonical patterns) and Phase 2 (refactoring) come next.*
