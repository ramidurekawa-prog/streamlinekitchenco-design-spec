# COMPONENTS.md

> Inventory of reusable UI: the structural fragments in `components/` and the
> patterns that recur across screens. CLAUDE.md routes here before you build
> something new — **check this list first** so the prototype stops growing
> duplicate, inconsistent pieces, and so the rebuild has a real component contract.
> This is the inventory ("does it exist · when do I use it · where does it live");
> the full markup, slots, modifiers, and tokens for each pattern are in
> [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) (the `DS §` column points to the section).
>
> **Adoption note:** the design system is mid-migration. The canonical class names
> below are the target and are fully wired only on the newest screens
> (labor-efficiency, table-turns, roi-proof, kitchen-speed); other screens still
> use legacy per-feature prefixes. Before reusing a pattern, confirm the canonical
> name in DESIGN-SYSTEM.md and copy from a screen that already uses it.

## Structural fragments (`components/`)

Each is fetched once by `shared/loader.js` and injected (`innerHTML` replace) into a
pre-existing empty container in `index.html`, before the shared scripts run. (See
[ARCHITECTURE.md](ARCHITECTURE.md) for the injection mechanics.)

### `sidebar.html` → `#sidebar`
Left navigation rail: brand, location selector, grouped nav (Home / Operate /
Diagnose / Prove / System), bottom user chip. Nav items call `showScreen(id, this,
title)`; expandable parents (Menu, Labor, Table Turns) toggle via
`navMenu*` / `navLabor*` / `navTt*` handlers in controllers.js (ids like
`navMenuParent` / `navMenuChildren` / `navMenuCaret`); the location `<select>` calls
`setSKCLocation(value)`. Count badges use `ni-badge`.
**Use this when:** a screen/subpage needs to be reachable from primary nav.

### `topbar.html` → `#topbar`
Fixed top bar: current-screen title (`#tbTitle`, written by `showScreen`),
data-health pill (deep-links to Data Quality), clock (`#tbClockDate` /
`#tbClockTime`), and global actions — Ask SKC (`toggleAskPanel()`), Demo
(`SKCDemoController.start()`), QA (`toggleQA()`), theme (`toggleTheme()`). The
GM/Owner + Executive/Expanded toggles were removed; the view is locked to
Owner + Expanded.
**Use this when:** you need the global title slot or a globally-available action.

### `ask-panel.html` → `#layout-ask-panel`
"Ask SKC" assistant: a floating FAB (`#askFab`) plus a right slide-in panel
(`#askPanel`) with suggested-prompt chips (`#askPanelChips`), a thread
(`#askPanelThread`), and an input (`#askPanelInput`). Handlers (core.js):
`toggleAskPanel()` / `closeAskPanel()` / `askPanelQ('…')` (chip → seeds a question) /
`sendPanelMsg()`. It cites existing evidence — it is *not* a freeform LLM. Inline
numbers in messages bind via `data-skc="…"`.
**Use this when:** wiring the assistant trigger, adding a suggested prompt, or
appending a chat message.

### `drawers.html` → `#layout-drawers`
The catch-all overlay layer — every modal/drawer/overlay concatenated into one
fragment, each an overlay+panel id pair driven from core.js. Includes: Simulate Fix
(`#simulateOverlay`), Labor Staffing Plan (`#leStaffingPlanDrawer`) + Labor Evidence
(`#leEvidenceDrawer`), Assign Recovery Action (`#caOverlay`;
`openCA`/`closeCA`/`submitCA`), Demo QA panel (`#qaPanel`), Demo Tour
(`#tourOverlay`), Owner Report (`#orOverlay`), the **generic drawer**
(`#drawer`/`#drawerOverlay` with `#drawerTitle`/`#drawerBody`, populated at runtime),
the Evidence drawer (`#evDrawer`), and the Menu Evidence drawer (`#menuEvDrawer`).
Universal close button: `.ev-close`.
**Use this when:** you need any modal/drawer/overlay — add it here with an
overlay+panel id pair and drive open/close from core.js. Don't create a new
top-level fragment.

## Recurring patterns

Canonical class(es) verified against the code. Full markup / slots / modifiers /
migration maps live in [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md).

| Pattern | Canonical class(es) | Use this when… | DS § |
|---|---|---|---|
| Page shell | `sp-shell` + `sp-body` | wrapping a (redesigned) feature page | 4 |
| Page header | `page-hdr` + `-left`/`-right`/`-title`/`-sub` | the top of any screen | 4 |
| Five-cell strip | `sp-strip` > `sp-strip-cell` + `-k`/`-v`/`-sub` (`is-warn`/`is-bad`/`is-good`) | a diagnostic page needs a KPI band (always 5 cells) | 5 |
| Hero card | `hero-card` + `hero-eyebrow`/`-title`/`-sub`/`-value-block`/`-projection`/`-math`/`-ctas` (+ modifiers) | the lead "what's wrong · value · action" block | 6 |
| Output-type tag (static) | `tag-det`/`-est`/`-ver`/`-mod`/`-heu`/`-sim`/`-act`/`-open`/`-na`/`-kds`/`-proxy` | hand-labeling a value's doctrine type in markup | 9 |
| Output-type tag (runtime) | `output-label`/`output-chip` + `ot-*`, from `getOutputLabel()` | rendering a tag from data/JS, not static HTML | 9 |
| Inline number highlight | `r-hl` + `.amber`/`.green`/`.red` (usually with `data-skc`) | calling out a canonical number inside prose | — |
| Audience badge | `aud-badge` + `aud-gm`/`aud-owner`/`aud-both` | marking who a page/region is for | 10 |
| Doctrine line | `doctrine-line` | a feature parent page states its doctrine | 8 |
| Tab bar | `skc-tab-bar` > `skc-tabs` > `skc-tab`; panels `skc-panel`; `switchTab(group,key)` | 3+ orthogonal views of the same data | 7 |
| Item card | `item-card` + `-h`/`-t`/`-sub`/`-val`/`-meta`/`-caveat`/`-cta`/`-conf`; tiers `is-ready`/`is-review`/`is-too-low`/`is-blocked`/`is-in-actions` | listing operator-actionable recommendations | 11 |
| Evidence page | `ev-toc`/`ev-toolbar`/`ev-section`/`ev-grid` > `details.ev-card` | a feature's methodology/reference surface | 12 |
| Evidence drawer | `ev-drawer` / `menu-ev-drawer` / `le-ev-*` (in drawers.html) | a contextual evidence pop-out off a specific number | 12 |
| DQ banner | `dq-banner` (+ `data-feature`, `dq-banner-warn`/`-bad`/`-mode`) | a page's numbers depend on a degradable source | 13 |
| Cross-link card | `crosslink-footer` > `crosslink-card` + `-t`/`-body` | footer links to 1–3 related features | 14 |
| Empty state | `empty-state` + `-icon`/`-title`/`-body` (legacy: `le-empty-state`, `ac-empty-state`, …) | a list/feed region can be empty | — |
| Buttons | `btn` + `btn-primary`/`-secondary`/`-ghost`/`-green` (+ `btn-sm`) | any button (one primary per page) | — |
| Tables / rows | **no global class** — feature-local (`ac-table`/`ac-row`, `bm-stat-row`, …) | tabular data → reach for the feature's row class | — |

### Watch-outs (mid-migration deltas between the design doc and the code)
- **Two output-tag systems coexist:** static `tag-*` (hand-authored in HTML) and
  runtime `ot-*` / `output-label` (emitted by `getOutputLabel()`). They are *not*
  the same class family — pick by whether the value is static or data-driven, and
  keep the displayed text doctrine-consistent either way.
- **Tab bar is still `skc-tab-*`**, not the `tab-*` the design doc's migration map
  proposes — the rename hasn't happened. Use what's in the code.
- **`doctrine-line` / `aud-badge` / `page-hdr` are not universal yet.** Most legacy
  screens still use prefixed `*-doctrine`, carry no audience badge, and use
  `page-header*`. Adopt the canonical class when you touch a screen; don't assume
  it's already there.
- **No canonical table component exists.** Copy the nearest feature's row pattern
  rather than inventing a new global one — or propose one in DESIGN-SYSTEM.md first.
