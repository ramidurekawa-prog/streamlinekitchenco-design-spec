# Menu Optimization — screen spec

> Analyzes the menu's profit structure (Star / Plowhorse / Puzzle / Dog) and turns
> mix-shift exposure into specific, guardrailed menu actions.

- **File:** `screens/menu-optimization.html`
- **DOM id:** `screen-menu` · **route:** `showScreen('menu', …)`
- **Group:** Diagnose
- **Status:** seeded

## Purpose
Menu Optimization analyzes the menu's profit structure — which items are **Stars**
(high CM, high popularity), **Plowhorses** (low CM, high popularity), **Puzzles**
(high CM, low popularity), and **Dogs** (low CM, low popularity) — and surfaces
specific actions. The feature pages each diagnose within their own domain; this one
answers "is my menu costing me money this week, and what's the highest-impact menu
move?" without requiring the operator to learn matrix theory. It exists because menu
mix drifts silently: popular low-margin items quietly take share from higher-margin
items, eroding contribution margin over time. **Per project doctrine (DECISIONS.md),
menu/CM fixes lead with portion control; repricing is only a fallback** — the
recommended move is framed as "review price or portion cost," never "reprice" first.

## Access — who & when
- **Primary user:** GM. Matrix and Item Economics are GM **+ Chef** collaboration;
  Item Economics skews Chef-primary; Menu Actions is GM + Chef together; Evidence
  is Owner / CFO primary (engineer / chef secondary).
- **Secondary:** Owner.
- **When used:** weekly menu review; monthly menu-engineering session; before menu
  print runs; when a Plowhorse trend is flagged on Today; before deciding price or
  recipe changes; during audit / onboarding (Evidence).

## Route & how it's reached
Sidebar item under **Diagnose** (an expandable parent — see `navMenu*` handlers in
controllers.js per COMPONENTS.md). The parent route lands on the **Overview**
subpage by default. Also reached via **Profit Recovery** crosslinks (the menu leak,
e.g. salmon $519/wk, is one of the cross-feature ranked rows). Within the screen,
subpages switch via `showMenuSubpage('<id>')` — they are sibling `menu-subpage-*`
divs, not separate `showScreen` routes.

## Subpages
Default subpage: **Overview**.

| Subpage | Purpose | Default? |
|---|---|---|
| Overview | Single-screen menu profit health: headline mix-shift $ (~$1,420/mo), worst Plowhorse, highest-impact action, guardrail / recipe-cost status. | **Yes** |
| Matrix | Classic 2×2 plot (Star / Plowhorse / Puzzle / Dog) — every item placed by CM (y) × popularity (x). Bespoke SVG, not a shared component. | — |
| Mix Shift | How the item mix changed over time and the $ impact of the drift. | — |
| Item Economics | Per-item P&L (sales, food cost, CM, modifier capture, recent trend) — the single-item deep dive. | — |
| Actions | Queue of menu-specific pending actions; menu-only guardrails before handing off to the global Actions queue. | — |
| Simulations | What-if scenarios (price / portion / promote / retire); outputs labeled `[SIMULATION]`. | — |
| Evidence | The rulebook: how CM is computed, what feeds the matrix, thresholds, elasticity assumptions, LLM restrictions. | — |

## Page states
- **Loading:** _TBD — verify against menu-optimization.html._
- **Empty / cold-start:** _TBD — verify against menu-optimization.html_ (e.g. no
  baseline / insufficient history).
- **Error / blocked:** recipe-cost data stale (currently **stale 18d** in the demo)
  surfaces a "Can't prove it yet · Recipe costs stale 18d" blocker, caps confidence,
  and offers a **Fix Cost Data** CTA → Data Quality. Header shows **ESTIMATE ONLY** /
  **NOT PROVEN YET** mode chips. COGS source shown "not connected."
- **Success / populated:** headline exposure + matrix/quadrant counts + highest-impact
  move + cross-link footer to Actions.

## Components used
- **Header:** `doctrine-line` (required on a feature parent page), mode chips
  (`menu-mode-est` / `menu-mode-blocked`), filter bar (`menu-filter*`), source
  pills (`menu-src*`). _Legacy `menu-*` prefixes — not yet migrated to the canonical
  `page-hdr` / `sp-strip` set per COMPONENTS.md._
- **Matrix:** **bespoke** SVG (`menu-matrix-svg`, `#menuMatrixBubbles`, quadrant
  cells `menu-q-star`/`-plow`/`-puzz`/`-dog`) — no shared chart component.
- **Output-type tags:** static `tag-*` (e.g. `tag-ill` "ILLUSTRATIVE"); per-value
  `menu-val-tag` ("estimate" / "what-if").
- **Cross-link card:** `crosslink-card` footer → Actions lifecycle.
- **Evidence:** LE-Evidence-style expandable cards (`menu-ev-*`); a Menu Evidence
  drawer (`#menuEvDrawer`) exists in `drawers.html`.
- **Buttons:** `btn` + `btn-primary`/`-secondary`/`-ghost` (`btn-sm`).

## Data dependencies
- **Registries / fixtures:** `MENU_DATA.items` (drives `renderMenuMatrix()` — scales
  to 100+ items; static bubbles are a no-JS fallback), `MENU_DATA` per-item economics;
  `LABOR_SUBPAGE_TITLES`-style menu subpage titles _( verify exact constant in data.js)_.
  Source of canonical menu numbers: `shared/core.js`.
- **Output types shown:** **EST · amber** on the mix-shift exposure and per-item lift
  (recipe-cost dependence + 18d staleness keeps it estimated, never deterministic);
  `[SIMULATION]` / `what-if` on Simulations; `ILL` (illustrative) on non-functional
  preview values. Nothing on this screen is **verified** — verification happens after
  a post-change monitoring window closes (in Actions / ROI Proof).
- **Sources gating confidence:** **Toast POS** (sales, live), **Recipe cost** (stale
  18d → caps confidence), **COGS / Inventory** (not connected), Baseline (8wk).
  Demo menu confidence: **71%** (recipe cost stale 18d, −10 pts to base 81).

## Doctrine specifics
- Headline mix-shift exposure: **~$1,420 / mo** (EST · amber), computed as **$0.71
  per item × 2,004 items** over the 28-day window (baseline CM $9.13 → current CM
  $8.42 = −$0.71). Consistent with docs/canonical-numbers.md.
- **Salmon: $519 / wk** (EST · amber) — one line item inside the mix-shift opportunity;
  the value that appears on Profit Recovery / Actions (Blocked, "Approve salmon reprice
  $24→$27").
- **CM threshold $8.75** — items below are flagged Plowhorse or Dog. **Popularity
  threshold 8.0%** — crossing it is the Star/Puzzle (high-CM) vs Plowhorse (low-CM)
  boundary. Both rendered on the matrix axes verbatim.
- **Recipe-cost staleness:** **18 days** currently blocks verification of menu
  opportunities and forces the EST · amber badge; the catalog's "> 18 days stale →
  warning + caps confidence" rule applies on Item Economics. (Demo data is exactly at
  the 18-day mark.)
- **Portion-before-price doctrine:** the recommended move on Overview / Matrix /
  Item Economics reads "review **price or portion cost**" and "Review … **price/
  portion**" — repricing is the fallback lever, not the default. Simulations and the
  Actions handoff must preserve that framing (don't lead reprice/redesign/retire as
  the first recommendation).
- **State:** menu opportunities sit at **OPEN (EST · amber)** here; committing a menu
  action moves it into the **OPEN → ACTIVE RECOVERY → VERIFIED** lifecycle that lives
  in the global Actions screen. Per doctrine.md, the presentation layer can never
  upgrade EST → VER; verified savings only count after the post-change window closes.

## Actions
| Trigger (button / interaction) | Effect |
|---|---|
| **Open Matrix / Mix Shift / Items / Simulations / Actions / Evidence** (Overview) | `showMenuSubpage(...)` to that subpage |
| **Review Actions** (Overview) | → Menu · Actions subpage |
| Click an item / bubble (Matrix) | `menuMatrixSelect(id)` → Item Economics side card for that item |
| **Filter** (Matrix) | daypart / station / category _(verify control set in HTML)_ |
| **Turn into Action** (Matrix / Item Economics) | creates a pending menu action |
| **Simulate Price / Simulate reprice·redesign** (Matrix / Item Economics) | → Simulations |
| **Open Matrix** (Item Economics "Back to Matrix") | returns with the item highlighted |
| **Window selector** 7d / 28d / custom (Mix Shift) | recomputes per-item share + $ impact |
| **Open Actions** (Mix Shift) | → Menu · Actions |
| Select scenario (Simulations) | `menuSimSelect(scenario)` → formula trace + estimated lift (e.g. ~$210/28d, ~$300/28d, ~$355/28d "what-if") |
| **Commit to Action** (Simulations) | turns the simulation into a pending menu action |
| **Add chef sign-off** (Menu · Actions) | menu-specific approval gate _(verify control)_ |
| **Commit to Actions** (Menu · Actions) | pushes the menu action to the **global Actions** queue as "pending decision" |
| **Bundle** (Menu · Actions) | groups multiple menu changes into one menu-print cycle |
| **Math** (Menu · Actions) | → Item Economics for that item |
| **Expand all / Collapse all** (Evidence) | toggles all `menu-ev-*` cards |
| **Fix Cost Data** (header) | → Settings / Data Quality tab (`switchTab('dq','overview')`) |

## Navigation in / out
- **In (how you arrive):** sidebar **Diagnose → Menu Optimization** (lands on
  Overview); **Profit Recovery** crosslink "Open in Menu" (salmon / mix-shift leak);
  a Today Plowhorse-trend flag.
- **Out (where buttons go):** between subpages via `showMenuSubpage`; **Settings /
  Data Quality** (Fix Cost Data); **global Actions** (Commit to Actions); cross-link
  footer → Actions lifecycle. Verified menu savings ultimately surface on **ROI Proof**.

## Edge cases
- **Recipe cost stale ≥ 18d:** EST · amber enforced, verification blocked, confidence
  capped (−10 pts → 71%), blocker card + Fix Cost Data CTA. (Demo sits exactly at 18d.)
- **COGS not connected:** source pill shows "not connected"; affects what can be
  computed _(verify downstream effect)_.
- **Illustrative values:** some preview values carry `ILL` (ILLUSTRATIVE) — no source
  data behind them; must not be read as real.
- Matrix shows the **top 9 dinner items**; the other mapped dinner items (273) are
  folded into the weighted-average CM ($8.42) — not plotted individually.
- _TBD — verify against menu-optimization.html:_ promo-active reprice block, "don't
  retire a chef-favorite without sign-off" guardrail behavior, no-baseline / cold-start.

## Responsive notes
Desktop primary (the matrix plot and simulation UI need screen real estate). Tablet
works for Overview / Matrix / Mix Shift. _Phone behavior TBD — verify against
menu-optimization.html_ (catalog is silent on phone for this feature).

## Related screens
- **Profit Recovery** — cross-feature ranking; the menu leak (salmon $519/wk,
  mix-shift) appears there and crosslinks back.
- **Actions** — where committed menu actions run the OPEN → ACTIVE RECOVERY → VERIFIED
  lifecycle and guardrails are monitored.
- **ROI Proof** — where a verified menu recovery finally counts.
- **Data Quality (Settings)** — fix the stale recipe-cost source.

## Open questions
- Seeded from the **v32 catalog** (now `archive/Page-spec-docs.md`); may predate later
  redesigns. Reconcile this doc against the current `menu-optimization.html` for: exact
  subpage-title constant, Matrix filter controls, Menu · Actions chef-sign-off / bundle
  controls, phone layout, and the loading / empty / no-baseline states.
- Confirm the on-screen Simulations tag (`what-if` / `menu-val-tag`) reads as the
  doctrine `[SIMULATION]` (SIM · blue) label the catalog mandates, and reconcile the
  static `tag-*` vs runtime `ot-*` output-tag systems per COMPONENTS.md watch-outs.
- Confirm the elasticity-assumption + confidence rules and LLM restrictions described
  in Evidence match `shared/core.js` (the `OUTPUT_TYPES` registry is the source of truth).
- **Portion-before-price (DECISIONS.md):** verify every reprice/redesign/retire surface
  (Matrix legend, Item Economics, Simulations, Menu · Actions) leads with portion /
  cost control and treats price as the fallback — flag any copy that inverts that order.
