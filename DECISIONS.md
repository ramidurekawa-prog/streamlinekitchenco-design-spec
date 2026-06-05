# DECISIONS.md

> Governance and the "why." Two parts: **boundaries** (who owns what; what's joint
> and must be discussed before changing) and an **append-only decision log** (so
> settled choices aren't relitigated). CLAUDE.md routes here for ownership,
> governance, or the reasoning behind a past decision.
>
> The log is **append-only**: add new decisions at the top; don't rewrite past
> entries — supersede them with a newer dated entry.

## Ownership boundaries

Design is owned by **Ramidu** (founder/designer); a separate **engineer** consumes
this spec and builds the Next.js product. Some items are jointly owned and must be
discussed before changing.

| Item | Owner |
|---|---|
| Visual design, layout, copy | Ramidu (design) |
| Doctrine (output types + state model) | **Joint — discuss before changing** |
| Canonical numbers | **Joint — discuss before changing** |
| Interaction patterns | Ramidu decides, engineer implements |
| Data-source choices | **Joint — design can't unilaterally require new Toast endpoints** |
| Next.js architecture, components, perf, a11y, deploy | Engineer |
| Pricing, ICP, feature scope | Ramidu (founder), communicated explicitly |

The four **Joint** rows are what CLAUDE.md guardrail #6 protects: don't edit them
unilaterally — raise a GitHub issue or flag for discussion first.

## Acceptable vs. unacceptable divergence

Some drift between this HTML spec and the Next.js implementation is fine; some is
not.

**Acceptable:** real fetched data vs. static demo data; production fonts vs. system
fonts; real loading/empty/error states; the engineer choosing real shadcn/ui
instead of inline styles; framework-idiomatic component structure.

**Unacceptable** (raise as an issue before deviating): different copy; different
numbers for the same canonical leak; different interaction flows (a different
click-count to reach the same screen); inventing UX not present in the spec.

---

## Decision log (append-only, newest first)

### 2026-06-05 · Docs restructured into a static-router model
- **Decision:** CLAUDE.md becomes a static, human-edited **router + guardrails**
  doc; all detail moves into on-demand docs (DESIGN-SYSTEM, CONTEXT, ARCHITECTURE,
  DECISIONS, COMPONENTS, `screen-docs/`, CHANGELOG). README is demoted to
  human-only and excluded as a Claude source. `docs/handoff-notes/` is retired in
  favor of a per-task CHANGELOG line.
- **Context:** the old CLAUDE.md was a self-updating "living document" that drifted
  (it claimed boot calls `showScreen('home')` and cited a "server-coaching"
  load-order wrapper — neither was true), and it leaned on README as project truth.
- **Rationale:** only CLAUDE.md is always in context, so it should carry exactly
  the non-negotiable rules + pointers and nothing that goes stale; everything else
  loads on demand. The promoted DESIGN-SYSTEM.md and the per-screen `screen-docs/`
  become the contract the Next.js rebuild adopts.
- **Status:** active.

### 2026-06-03 · Actions consolidated into a single board
- **Decision:** replace the Actions multi-subpage tree with one scrollable board
  (LIVE line → run-rate hero → action bar → 4-column Kanban
  Blocked → Ready → Monitoring → Verified → Proof → condensed doctrine).
- **Context:** a GM with multiple locations juggles 10–20 in-flight actions; the
  subpage tree fragmented one queue across many clicks.
- **Rationale:** one board matches the wireframe and the real workflow. The board
  numbers were adopted verbatim from the mockups and registered as canonical
  (additive — no existing canonical value changed).
- **Status:** active. Caveat: `archive/Page-spec-docs.md` and the seeded
  `screen-docs/actions-SCREEN.md` still describe the older multi-subpage Actions —
  reconcile that screen-doc with the board next time it's touched.

### 2026-05-26 · Design system locked (v32) and promoted to the spec
- **Decision:** standardize every screen on one canonical pattern set (page
  shell/header, 5-cell strip, hero card, item card, output-type tags, evidence
  page, doctrine line, audience badge, DQ banner, cross-link card) with a fixed
  vocabulary. Captured in [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md).
- **Context:** an audit (`archive/design-system-audit.md`) found "structural
  sameness with visual and lexical drift" — every feature had invented its own CSS
  prefix, item-card markup, chip styles, and copy.
- **Rationale:** the shared structure made unification mostly **rename + remap**,
  not rebuild; one pattern set raises the quality bar and gives the rebuild a real
  UI contract.
- **Status:** active, **mid-migration.** The newest redesigned screens
  (labor-efficiency, table-turns, roi-proof, kitchen-speed) fully adopt the
  canonical classes; other screens still carry legacy prefixed classes per the
  migration maps in DESIGN-SYSTEM.md. Treat those maps as a to-do list, not a
  description of the present state.

### 2026-05-26 · Table Turns redesigned to question-led subpages
- **Decision:** collapse Table Turns' five data-typed pages into **Watch / Decide /
  Evidence**, organized by the questions a manager actually asks.
- **Context:** the old structure had number drift between subpages, duplicated
  heroes/strips/playbooks, and was organized by data type, not by user question.
- **Rationale:** one canonical fixture set per service; progressive disclosure over
  duplicate panels; headline → evidence → action. Full detail seeded into
  `screen-docs/table-turns-SCREEN.md`.
- **Status:** active.

### Foundational · The honesty doctrine (output types + state machine)
- **Decision:** every dollar value carries an output type; **only `verified`
  counts toward ROI**; the presentation layer can never upgrade a type; a degraded
  source downgrades the type and shows a reason chip. State machine:
  `OPEN → ACTIVE RECOVERY → VERIFIED`, and any state can go `BLOCKED`.
- **Context:** the product's credibility with owners depends on never overstating
  recovered value.
- **Rationale:** confidence and ROI eligibility must flow from data, not
  presentation, or the "proof" is worthless. Jointly owned; pervades the whole UI.
- **Status:** active, load-bearing. Full detail: [docs/doctrine.md](docs/doctrine.md).

### Foundational · Menu/CM fixes lead with portion control
- **Decision:** menu and contribution-margin fixes lead with **portion control**;
  repricing is only a fallback.
- **Context:** product guidance on how menu-economics recommendations are framed.
- **Rationale:** portion/cost control protects margin without risking demand;
  raising price is the last lever, not the first.
- **Status:** active.
