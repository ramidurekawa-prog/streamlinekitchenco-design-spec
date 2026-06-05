# SKC Design Spec

The **design spec** for SKC (Streamline Kitchen Co.) — a profit-recovery product
for restaurant operators. The shippable product is built in **Next.js in a
separate repo**; this repo is the source of truth for visual design, copy,
doctrine, interaction patterns, and demo numbers. The engineer reads from here;
nothing here ships to production.

This README is the human onboarding overview, and it's intentionally light — the
detailed, authoritative docs live elsewhere (see **Where things live**).

## Run it locally

`fetch()` won't work over `file://`, so the demo needs a local server:

```bash
python3 serve.py
# then open http://localhost:8000
```

`serve.py` sends `no-store`, so you always get the current files. Plain
`python3 -m http.server` will serve stale assets and make buttons look broken.
VS Code → **Live Server** also works.

## What it is, in 30 seconds

- A static HTML/CSS/JS prototype: `index.html` is an empty shell; `shared/loader.js`
  fetches the screen + component fragments and the shared scripts at runtime.
- Every dollar value is labeled with an **output type** that sets its color,
  confidence, and whether it counts toward ROI. Only **verified** counts. This
  "honesty doctrine" is the heart of the product.
- ~15 screens grouped **Operate / Diagnose / Prove / System**, plus a shared design
  system the Next.js rebuild will adopt.

## Where things live

| You want… | Look at |
|---|---|
| The full repo map, conventions, how to add a screen | [CONTEXT.md](CONTEXT.md) |
| The design system (tokens + patterns) | [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) |
| How the runtime / loader works | [ARCHITECTURE.md](ARCHITECTURE.md) |
| Per-screen specs | [screen-docs/](screen-docs/) |
| The product's truth / confidence model | [docs/doctrine.md](docs/doctrine.md) |
| Reusable components and patterns | [COMPONENTS.md](COMPONENTS.md) |
| Ownership, governance, and past decisions | [DECISIONS.md](DECISIONS.md) |
| What changed recently | [CHANGELOG.md](CHANGELOG.md) |

> **For AI coding sessions:** `CLAUDE.md` is the entry point and router — start
> there. This README is for humans and is not treated as a source of project truth
> by automated tooling.

## Current state

- `main` is canonical and always demo-ready; `feature/<name>` for work in progress.
  The engineer pulls `main` (or a tagged version), never feature branches unless
  told.
- For recent changes see [CHANGELOG.md](CHANGELOG.md); for in-flight plans, see the
  working docs under [docs/](docs/).
