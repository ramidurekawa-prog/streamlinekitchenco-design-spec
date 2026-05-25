# SKC Design Spec

Visual and interaction reference for the SKC platform. The product is built in Next.js; this repo is the source of truth for visual design, copy, doctrine, and interaction patterns.

**Refactor in progress.** The canonical single-file demo (`skc-demo-v30b-tooltips-floating.html`) is being split into per-feature files. See `skc-design-transition.md` for the plan and the target structure.

## Run it locally

`fetch()` won't work on `file://`, so the demo needs a local server:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Or right-click `index.html` in VS Code → "Open with Live Server".
