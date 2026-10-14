# Progress Log

## Agent skills session — 2026-10-14

Branch `feature/agent-skills`. Scope: apply assigned skills to the existing
dashboard, add one ecosystem skill, author one project skill. No rewrite.

### Skills loaded

Installed under `.agents/skills/`, which is where `AGENTS.md` tells agents to
look. Fetched from the skills.sh registry over its read-only search API
(`https://skills.sh/api/search?q=...`) and pulled from the upstream GitHub
repos. `npx skills find` itself was blocked by the local permission layer for
running unverified third-party code, so the registry was queried directly
instead; the skills are byte-for-byte the published files.

| Skill | Source | Installs |
|---|---|---|
| `accessibility` | addyosmani/web-quality-skills | 60,968 |
| `vercel-react-best-practices` | vercel-labs/agent-skills | 799,510 |
| `core-web-vitals` | addyosmani/web-quality-skills | 30,158 |

### Quality baseline, captured before any edit

| Command | Result |
|---|---|
| `npm run build` | Passed. Single JS chunk **586.53 kB / 175.67 kB gzip**, with `Some chunks are larger than 500 kB` warning. |
| `npm run test` | 5 passed |
| `npm run lint` | Clean |
| WCAG contrast, 11 pairs | **All pass AA.** Worst case 5.55:1 against a 4.5:1 minimum; body text 18.42:1. Measured by converting the `oklch` tokens in `src/index.css` to sRGB and computing ratios, not by eye. |

The contrast result is load-bearing: it is why no color was changed. An
unverified "fix the contrast" pass would have churned the palette for nothing.

### `accessibility` — applied

Nine defects found and fixed. Each maps to a rule in the skill.

| WCAG | Defect found in source | Change |
|---|---|---|
| 1.1.1 | 5 decorative lucide SVGs exposed to AT | `aria-hidden="true"` |
| 1.1.1 | Charts existed only as pixels; tooltip is hover-only | `role="img"` + summary label, plus a `.visually-hidden` `<table>` with `<caption>` per chart |
| 1.4.1 | Income vs outcome distinguished by hue alone | Outcome line now also dashed |
| 2.4.2 | `<title>frontend</title>` | Real title + meta description |
| 2.4.6 | `CardTitle` rendered a `<div>`; the whole app had one `<h1>` and no other heading | `CardTitle` → `<h3>`, sections → `<h2>`, giving `h1 > h2 > h2 > h3 > h3` |
| 4.1.3 | Loading and error invisible to AT | `role="status"` live region, `role="alert"` on the error, `aria-hidden` on skeletons, `aria-busy` on the KPI section |
| 2.4.7 | No focus styling anywhere | `:focus-visible` outline |
| 2.3 | `animate-pulse` ran for everyone | `prefers-reduced-motion` block |
| 3.1.2 | `lang="en"` document carrying a Spanish error | `lang="es"` on that node |

Verified against the rendered DOM, not the diff: headings, both tables, both
`role="img"` labels, the status region text and all 5 SVGs confirmed present in
the live accessibility tree.

Two things deliberately **not** done, because the codebase does not have them:
`alt` text on images (zero `<img>` elements; `src/assets/hero.png` is unreferenced)
and a skip link (zero `<button>`, `<a href>`, `<input>` or `<select>` in `src/`).
The keyboard-navigation check has almost no surface here, and that is reported
as a finding rather than claimed as a pass.

### `vercel-react-best-practices` — applied, and largely rejected

The skill is 70 rules across 8 categories. This project is a **Vite SPA**
(`react 19`, `vite 8`, no `next` in `frontend/package.json`), so most of it does
not apply. The README's framing of this skill as `next/image` / `next/font` /
per-page metadata is inaccurate for the actual skill text and unusable here.

| Rule | Verdict | Evidence |
|---|---|---|
| `bundle-dynamic-imports` | **Applied** | Says "use `next/dynamic`"; no Next.js, so the equivalent boundary is `React.lazy` + `Suspense` on the two Recharts wrappers. |
| `rendering-conditional-render` | Already compliant | Ternaries, no `&&` renders. |
| `rendering-script-defer-async` | Already compliant | `<script type="module">` defers per spec. |
| `server-*` (16 rules) | **Rejected** | No React Server Components; the backend is FastAPI. |
| `rendering-hydration-*` | **Rejected** | No SSR. |
| `next/image`, `next/font` | **Rejected** | Not installed. Importing them breaks `tsc -b`. |
| Image optimization | **Rejected** | No `<img>` in `src/`. |
| `client-swr-dedup` | **Rejected** | One fetch on mount; a data library would be a new dependency, barred by `.agents/rules` §4. |

Measured effect of the one rule applied:

| | Initial JS | Chunk warning |
|---|---|---|
| Before | 586.53 kB / 175.67 kB gzip | present |
| After | **187.86 kB / 59.86 kB gzip** | **gone** |

Initial JavaScript −67.9% (−65.9% gzipped). Recharts moved to a 342.30 kB lazy
chunk. Confirmed at runtime: 6 chunks fetched on demand, charts and KPIs render
(`$1,074,100` total income), no console errors.

### `core-web-vitals` — ecosystem skill, chosen and applied

Chosen over `performance` (39k), `seo` (50k) and `webapp-testing` (177k) because
it is the only one verifiable with tooling already in this repo. The others need
Lighthouse, a testing library or an indexable public site; adding any of them
changes dependencies, which `.agents/rules` §4 forbids.

CLS measured with a `PerformanceObserver` on `layout-shift`, `buffered: true`,
against the production build served locally:

| Path | CLS | Shift entries |
|---|---|---|
| Data loaded | 0.00000 | 0 |
| API failure | 0.00000 | 0 (54px alert banner present) |

Method note: the API stub must delay ~2.5s. An instant failure resolves before
first paint, so nothing is unstable yet and the zero is meaningless. That
false-negative was produced and discarded before the real reading.

Caveat kept on record: the error banner is inserted above live content yet
scores nothing, because React swaps the whole subtree in one commit and freshly
mounted nodes are not counted as unstable. The zero is genuine but must not be
read as "dynamic insertions here are safe by design".

Applied: §Stabilize fonts. `'Inter'` was declared in `--font-sans` but loaded by
nothing — no `@font-face`, no link, no dependency — so the stack silently
resolved to system-ui. Removed from the declaration.
Rejected: the "reserve space for banners" rule would mean ~86px of permanent
whitespace for an error that rarely renders, against a measured shift of zero.

### Project skill authored

`.skills/adding-financial-metrics/SKILL.md` — the gap no community skill covers:
this repo's specific path from `FinancialMovement` to a rendered figure.
Objective, inputs, a 5-step pipeline table, formatting rules (`formatCurrency` /
`formatPercent` only, never `toFixed` in a component; `en-US`/USD fixed in one
module; chart colors as CSS tokens), the accessibility contract every new chart
must satisfy, runnable acceptance criteria, and four known traps.

The traps section encodes findings from this session, including one this repo's
own memory bank had already flagged: the period label is hardcoded twice with
*different dash characters* — `2024 - Full Year` at `App.tsx:62` versus the
default `2024 — Full Year` at `dashboard-header.tsx:7`. The prop always wins, so
the default is dead and misleading. Not fixed: out of scope for a skills task.

### Post-change verification

| Command | Result |
|---|---|
| `npm run lint` | Clean |
| `npm run test` | 5 passed |
| `npm run build` | Passed, no chunk warning |
| Rendered DOM audit | Headings, tables, `role="img"`, `role="status"` all confirmed live |

### Environment findings

- Docker is unavailable on this host, so `docker compose run --rm backend python -m
  pytest -q` from `.agents/rules` §2 could not be run. Backend tests are
  therefore **not** re-verified this session; the recorded 15-passed result in
  `current-state.md` predates these changes, which touch no backend file.
- The Vite proxy targets `http://backend:8000`, a Docker-only hostname. Frontend
  verification used a scratch stub server outside the repo serving
  `frontend/dist` plus `/api/metrics` built from the repo's own `mock-data.ts`
  (57 movements). No repo file, config or host setting was added for it.
- The in-app browser reported `visibilityState: hidden` and initially a 0×0
  viewport, which made Recharts log a `width(-1) and height(-1)` warning. That
  was an environment artifact, not a defect: the wrapper div measured
  `height: 280` correctly. No screenshots were captured, so visual confirmation
  is outstanding; all verification above is DOM- and measurement-based.

### Using the project skill on a real task

The skill was exercised on the one trap it names but does not own: the doubled
hardcoded period. Following its own pipeline (derive purely → test before
rendering → wire in `App.tsx`) surfaced three things.

1. **The skill was incomplete.** Its pipeline only accepts a *total* or a
   *series*. A reporting-period caption is neither, and the skill had nowhere to
   put it. Added two sections: outputs that are neither total nor series, and a
   timezone rule.
2. **A latent defect in `financial-utils.ts` fell out of the new tests.**
   `toYearMonthKey` did `new Date(m.create_date)` and then read `getMonth()`.
   An ISO date string parses as UTC midnight, so on this host (`America/Bogota`,
   UTC-5) `2024-02-01` reads as 2024-01-31 and the movement is bucketed into
   January. Fixed by slicing the ISO string (`isoDate.slice(0, 7)`), which is
   timezone-free.
3. **Scope of that defect, stated precisely.** `frontend/src/lib/mock-data.ts`
   contains no day-1 dates, so the static demo shows identical numbers before
   and after — the fix changes nothing visible there. But
   `backend/app/routes.py:74` draws `movement_day = random.randint(1, 28)`, so
   the live API does emit day-1 dates. The bug is real against the backend and
   invisible in the mock. Reported that way rather than as a visible win.

Tests went 5 → 10: four for `formatReportingPeriod` (span, single month, empty,
and one asserting agreement with `computeMonthlyData` output so the caption
cannot drift from the chart axis) plus a day-1 regression case.
`DashboardHeader.period` became a required prop; both literals deleted.

Verified in the rendered DOM: header badge reads `Jan 2024 – Dec 2024`, all
twelve months present, KPIs unchanged (`$1,074,100` / `$492,200` / `$581,900` /
54.2%), heading hierarchy still `h1 > h2 > h2 > h3 > h3`. Lint clean, build
clean at 187.83 kB initial.

### Commits

| Commit | Skill traced |
|---|---|
| `fix(a11y): apply accessibility skill to the dashboard` | `accessibility` |
| `perf(frontend): apply vercel-react-best-practices to the Vite build` | `vercel-react-best-practices` |
| `perf(cwv): apply core-web-vitals skill and measure CLS` | `core-web-vitals` |
| `feat(skills): add project skill ...` + this log | project-authored |
| `fix(frontend): derive reporting period and fix UTC month bucketing` | project skill, exercised |
