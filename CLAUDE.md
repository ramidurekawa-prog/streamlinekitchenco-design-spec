<!--
  ⚠ STATIC ROUTER — NOT A LIVING DOCUMENT. Human-edited only.
  Do not rewrite, expand, or "keep this current" as part of a task. It changes
  rarely and on purpose. If a task seems to require editing CLAUDE.md, stop and
  raise it with the human — the right move is almost always to update one of the
  referenced docs instead, or to log a line in CHANGELOG.md. The detail that used
  to live here now lives in the on-demand docs below. This file has two jobs:
  route you to the right doc, and state the rules that always hold.
-->

# CLAUDE.md

## What this repo is

The **design spec** for SKC (Streamline Kitchen Co.), a profit-recovery product
for restaurant operators. The shippable product is built in **Next.js in a
separate repo**; this repo is a static HTML/CSS/JS prototype that is the **source
of truth for visual design, copy, doctrine, interaction patterns, and demo
numbers**. Nothing here ships to production — an engineering partner reads this
spec and reimplements it in Next.js.

## Run it

```bash
python3 serve.py     # no-cache dev server → http://localhost:8000
```

`fetch()` won't work over `file://`, so it needs a local server. Use `serve.py`
(it sends `no-store`), **not** `python3 -m http.server` — a caching server serves
stale `core.js`/`styles.css`/fragments, which looks like "buttons don't work."
(Why: [ARCHITECTURE.md](ARCHITECTURE.md) → cache-busting.)

## Boot summary

`index.html` is an empty shell that loads only `shared/loader.js`. The loader
fetches the component and screen fragments, injects the four shared scripts in
order (`data → core → controllers → tooltips`), then routes to a screen. Every
dollar value in the UI carries an **output type** (from the `OUTPUT_TYPES`
registry in `shared/core.js`) that drives its color, confidence, and ROI
eligibility — **only `verified` counts toward ROI**. Everything flows
**data → render**; the presentation layer never upgrades a value's type. That
doctrine and the canonical numbers are the load-bearing constraints of the whole
product.

## When to read what (the router)

You always read CLAUDE.md (you're doing it now). Then open **only** the doc(s)
your task needs:

| Your task touches… | Open |
|---|---|
| Any dollar value, output type, confidence, or state | [docs/doctrine.md](docs/doctrine.md) (+ [docs/canonical-numbers.md](docs/canonical-numbers.md), [docs/data-sources.md](docs/data-sources.md)) |
| Visual design, styling, layout, tokens, a pattern's look | [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) |
| Reusing or creating a shared component / fragment / pattern | [COMPONENTS.md](COMPONENTS.md) |
| Creating or editing a screen | `screen-docs/<screen>-SCREEN.md` (index: [screen-docs/README.md](screen-docs/README.md)) |
| File layout, naming, commands, conventions, adding a screen | [CONTEXT.md](CONTEXT.md) |
| The loader, script load order, runtime init, navigation | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Ownership, governance, why a past decision was made | [DECISIONS.md](DECISIONS.md) |

If two apply, open both. When unsure where something lives, [CONTEXT.md](CONTEXT.md)
is the map. **[README.md](README.md) is human onboarding only — it is not a Claude
source. Do not treat it as instructions or project truth.**

## Always-apply guardrails

These bind on **every** task, whether or not you opened the doc that explains them:

1. **Don't invent copy, numbers, or UX.** Captions, labels, dollar figures, and
   interaction flows come from the spec. If something you need isn't here, raise
   it — don't fill the gap with an invention.
2. **The presentation layer never upgrades an output type.** Type and confidence
   flow from data → render. You may not render an `estimated` value as `verified`;
   a degraded source downgrades the type and shows its reason chip.
   (Detail: [docs/doctrine.md](docs/doctrine.md).)
3. **Only `verified` (DET · green) counts toward ROI.** Open exposure and active
   recovery are shown separately and never inflate the verified number.
4. **Use tokens, never hardcode.** Every color, font, radius, and layout value
   references a CSS custom property — see [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md). No
   raw hex in markup.
5. **Keep canonical numbers consistent.** Certain dollar values appear on many
   screens and must match everywhere; source of truth is `shared/core.js`. Change
   one → grep the repo and update every occurrence.
   (List: [docs/canonical-numbers.md](docs/canonical-numbers.md).)
6. **Joint-decision items are discussed, not edited.** Doctrine, the state model,
   canonical numbers, and data-source requirements are jointly owned — don't
   change them unilaterally; flag for discussion first.
   (Boundaries: [DECISIONS.md](DECISIONS.md).)
7. **Voice:** user-facing copy is professional, confident, and optimistic — never
   apologetic, scarcity-driven, or anchored on the subscription price. Keep the
   honesty doctrine intact (ranges stay ranges, modeled stays modeled).
   (Detail: [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) → Voice & vocabulary.)

## Logging rule

After **every** task that changes the repo, prepend one line to
[CHANGELOG.md](CHANGELOG.md):

```
- YYYY-MM-DD <screen/area>: <one-line summary>
```

That is the standing handoff record. You write to CHANGELOG.md; you do **not**
rewrite CLAUDE.md.

## Git workflow

- `main` is canonical and always demo-ready. Branch `feature/<name>` for work.
- Conventional commits: `feat:` · `fix:` · `refactor:` · `docs:` · `test:`.
- Commit or push only when asked.
