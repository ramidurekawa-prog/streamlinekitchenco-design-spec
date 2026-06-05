# ROI Proof — screen spec

> The owner-ready scorecard: verified savings only — guardrail-safe monitored
> recovery that has closed its window. The provable number, with the math behind it.

- **File:** `screens/roi-proof.html`
- **DOM id:** `screen-scorecard` · **route:** `showScreen('scorecard', …)`
- **Group:** Prove
- **Status:** seeded

## Purpose
The owner-ready scorecard. It shows **verified savings only** — the provable "this
is what SKC made you" number an operator can put in front of partners, investors,
or themselves — with the audit math behind it. It exists because operators need a
defensible ROI figure, not an aspirational one: Active Recovery (in flight) and
Open Exposure (detected but unactioned) are shown **separately** so they can never
inflate the verified total.

## Access — who & when
- **Primary user:** Owner.
- **Secondary:** GM presenting to owner / partners.
- **When used:** monthly close; quarterly review; whenever someone asks "is this
  software worth it?"

## Route & how it's reached
- Sidebar **ROI Proof** item (Prove group): `showScreen('scorecard', this, 'ROI Proof')`
  — _confirm exact label/handler against `components/sidebar.html`._
- Deep-linked from the **Home** dashboard cards (per CLAUDE.md, the six Home cards
  deep-link to ROI Proof) and from **Operating System** crosslinks.
- Verifications that flip to **Verified** in the Actions lifecycle flow their count
  here (per catalog: "Confirm → flips to Verified, adds to ROI Proof").

## Subpages
None. (Organized as in-page tabs via `switchTab('roi', …)`, not separate screens —
see Page states.)

## Page states
- **Loading:** _TBD — verify against `roi-proof.html`._
- **Empty / cold-start:** no verified lines yet — _confirm the cold-start copy
  against `roi-proof.html`; the pilot-header cell reads "Expected verified lines."_
- **Error / blocked:** Blocked Verification value is surfaced but explicitly **not
  counted** (hero doctrine line lists "Blocked Verification … not counted as ROI");
  a `switchTab('roi','blocked')` view exists.
- **Success / populated:** hero "SKC verified **$97/wk** in savings this period,"
  the MVV Open→Active Recovery→Verified narrative cycle, verified-wins list with
  per-action audit trail, and the subscription-coverage panel.

## Components used
- `page-hdr` / page header (`page-header-title`) — _legacy `page-header*`; confirm._
- Hero card (`rp-hero-*`: `-eyebrow` "Verified Savings · Last 30 days", `-headline`,
  `-doctrine`) — the lead verified-value block.
- Tab bar (`skc-tab-bar` > `skc-tab`; `switchTab('roi', key)`) with keys `summary`,
  `verified`, `active`, `blocked`, `timeline`, `weekly`.
- Output-type tag (runtime): `output-chip ot-ver` (e.g. **VER · 91%**, **VER · 88%**)
  on verified values per [COMPONENTS.md](../COMPONENTS.md) DS §9.
- Summary cards (`rp-sum-*`) and bucket rows (`rp-bucket-*`: verified / active /
  open) separating the three states.
- Subscription-vs-verified coverage panel (`rp-coverage-*`, `rp-cov-*` mini chart).
- Per-action **audit trail** elements (`audit*` blocks).
- Ask panel (`#askPanel` / `toggleAskPanel()`) — **Ask SKC why**.
- Crosslinks (`crosslink-*` / inline) to Operating System, Actions, Profit Recovery.

## Data dependencies
- **Registries / fixtures:** `VERIFICATIONS` (the verified line items) and
  `getPortfolioTruth()` (to render Active Recovery / Open Exposure separately).
  Pulls **only Verified-state** actions for the counted figure.
- **Output types shown:** `verified` (VER · green) on the counted savings —
  the **only** type that counts toward ROI; `active_recovery` (ACT · blue) and
  `open_opportunity` (OPEN · amber) shown for context, never counted; Blocked
  Verification and Rejected shown but excluded.
- **Sources gating confidence:** the seven SKC sources behind each verified line;
  the verified hero notes "Operational savings only · accounting not connected,"
  so **Accounting** is the gating absence on the coverage framing — _confirm
  per-line source gating against `roi-proof.html`._

## Doctrine specifics
This is one of the two surfaces (with Reports) where the **verified-only** rule is
load-bearing. Per [docs/doctrine.md](../docs/doctrine.md), **only `verified` counts
toward ROI**; the screen states this verbatim ("Only verified recovery counts
toward ROI" / "Only guardrail-safe monitored recovery enters Verified Savings.
Active Recovery, Open Exposure, Blocked Value, and Rejected value never count toward
ROI"). Canonical numbers (see
[docs/canonical-numbers.md](../docs/canonical-numbers.md)):

| Value | Output type / state | Role on screen |
|---|---|---|
| **$97/wk** (≈ **$420/mo** run-rate equiv.) | `verified` · VER · green (shown VER · 91% / 88%) | Hero headline + counted "Proven savings" — the Oakland Tuesday Lunch labor recovery, currently the only verified line |
| **$189/wk** | `active_recovery` · ACT · blue | Active Recovery bucket — in monitoring, "cannot be verified yet," not counted |
| **$1,243/wk** | `open_opportunity` · OPEN · amber | Open Exposure context — detected, not counted |

The presentation layer cannot upgrade an estimate to verified; type and confidence
flow data → render. Active Recovery and Open Exposure are rendered in **separate**
buckets/tabs precisely so they never roll into the verified number. Subscription
coverage framing: "$349/mo subscription · $420/mo verified run-rate · 1.2× covered."

## Actions
| Trigger (button / interaction) | Effect |
|---|---|
| **Export PDF** *(primary)* | Downloads the owner scorecard PDF (demo: toast "Generating owner proof PDF…") — _confirm exact handler against `roi-proof.html`._ |
| Per-action **View audit trail** / **Show Proof** | Reveals the per-action audit math (`switchTab('roi','verified')` / audit blocks) |
| Tab buttons (Summary / Verified Wins / Active Recovery / Blocked / Timeline / Weekly) | `switchTab('roi', key)` — swaps the in-page panel |
| **Ask SKC why** | Opens the ask panel (`toggleAskPanel()`) |
| Crosslink → Operating System / Actions / Profit Recovery | `showScreen('operating-system' \| 'actions' \| 'leaks', …)` |

## Navigation in / out
- **In (how you arrive):** sidebar **ROI Proof** (Prove); Home dashboard card
  deep-link; Operating System crosslink; the moment an action verifies in the
  Actions lifecycle.
- **Out (where buttons go):** PDF download (**Export PDF**); ask panel
  (**Ask SKC why**); Operating System / Actions (`screen-actions`) / Profit Recovery
  (`screen-leaks`) via crosslinks.

## Edge cases
- Blocked / Rejected verifications are displayed but excluded from the counted
  total (own tab/bucket).
- Accounting not connected → coverage/verified framing is "Operational savings only."
- _Stale-source / proxy-mode behavior on the verified math: TBD — verify against
  `roi-proof.html`._

## Responsive notes
- Desktop primary.
- Tablet for presenting (this screen is shown to owners/partners).
- _Phone behavior: TBD — verify against `roi-proof.html`._

## Related screens
- **Operating System** — the narrative product story (crosslinked; explains the
  loop that produces this verified number).
- **Actions** — the lifecycle that produces verified lines; verifications land here.
- **Profit Recovery** — source of the Open Exposure context figure.
- **Reports** — the other verified-only surface (weekly owner artifact).

## Open questions
- Seeded from the v32 page-spec catalog (now `archive/Page-spec-docs.md`).
  **ROI Proof was redesigned** since v32 (the present screen carries an MVV
  Open→Active Recovery→Verified narrative cycle, `rp-*`/`os-mvv-*` classes,
  subscription-coverage panel, and a six-key `roi` tab set not described in the
  catalog) — **verify this doc against the current `screens/roi-proof.html`** and
  promote to `current`.
- TBD items above: Loading/empty/phone states; exact Export handler; precise
  per-line source gating; stale/proxy behavior on verified math.
- Catalog's "View audit trail" and "Export PDF" copy may differ from the
  implemented labels/tabs — reconcile.
