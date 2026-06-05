# Screen docs

One spec per screen — the per-screen intent that must survive the Next.js
migration. CLAUDE.md routes here when creating or editing a screen. Start a new one
from [`_TEMPLATE.md`](_TEMPLATE.md).

> **Status legend:** `seeded` = migrated from the v32 page-spec catalog (now at
> `archive/Page-spec-docs.md`); accurate as of v32, may predate later redesigns.
> `stub` = skeleton to be filled. `current` = verified against the present screen.

| Screen | Fragment | Doc | Status |
|---|---|---|---|
| Home (landing) | `home-dashboard.html` (`screen-dashboard`) | [home-dashboard-SCREEN.md](home-dashboard-SCREEN.md) | stub |
| Today | `today.html` (`screen-home`) | [today-SCREEN.md](today-SCREEN.md) | seeded |
| Profit Recovery | `profit-recovery.html` (`screen-leaks`) | [profit-recovery-SCREEN.md](profit-recovery-SCREEN.md) | seeded |
| Actions | `actions.html` (`screen-actions`) | [actions-SCREEN.md](actions-SCREEN.md) | seeded · **needs reconcile** (now a single board) |
| Menu Optimization | `menu-optimization.html` (`screen-menu`) | [menu-optimization-SCREEN.md](menu-optimization-SCREEN.md) | seeded |
| Labor Efficiency | `labor-efficiency.html` (`screen-labor-efficiency`) | [labor-efficiency-SCREEN.md](labor-efficiency-SCREEN.md) | seeded |
| Benchmarks | `benchmarks.html` (`screen-benchmarks`) | [benchmarks-SCREEN.md](benchmarks-SCREEN.md) | stub |
| Table Turns | `table-turns.html` (`screen-table-turns`) | [table-turns-SCREEN.md](table-turns-SCREEN.md) | seeded |
| Kitchen Speed | `kitchen-speed.html` (`screen-throughput`) | [kitchen-speed-SCREEN.md](kitchen-speed-SCREEN.md) | seeded |
| ROI Proof | `roi-proof.html` (`screen-scorecard`) | [roi-proof-SCREEN.md](roi-proof-SCREEN.md) | seeded |
| Operating System | `operating-system.html` (`screen-operating-system`) | [operating-system-SCREEN.md](operating-system-SCREEN.md) | seeded |
| Reports | `reports.html` (`screen-reports`) | [reports-SCREEN.md](reports-SCREEN.md) | seeded |
| Data Quality | `settings.html` (`screen-settings`) | [data-quality-SCREEN.md](data-quality-SCREEN.md) | seeded |
| Settings | `settings.html` (`screen-config`) | [settings-SCREEN.md](settings-SCREEN.md) | seeded |
| Action Detail | `action-detail.html` | [action-detail-SCREEN.md](action-detail-SCREEN.md) | stub |
| Recovery Detail | `recovery-detail.html` | [recovery-detail-SCREEN.md](recovery-detail-SCREEN.md) | stub |

_Note: `settings.html` carries two screens (Data Quality `screen-settings` + the
nested Settings `screen-config`); Action/Recovery Detail are overlay surfaces, not
sidebar destinations._
