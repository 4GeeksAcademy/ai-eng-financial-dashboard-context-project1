---
name: adding-financial-metrics
description: Add or change a KPI, chart series or derived figure in the Financial Overview dashboard consistently with this repo's data pipeline. Use when a task asks to "add a metric", "show a new chart", "display profit per category" or changes anything rendered from /api/metrics.
---

# Adding a financial metric to this dashboard

## Objective

Take raw movements from `/api/metrics` to a rendered, formatted, tested figure
without duplicating derivation or formatting logic.

## Inputs required before writing code

1. The exact `FinancialMovement` fields the figure depends on. The API payload is
   snake_case (`create_date`, `operation_type`, `business_type`); UI models are
   camelCase. The boundary is `src/lib/financial-types.ts`.
2. Whether the figure is a **total** (one `KPIMetrics` field, shown in a KPI card)
   or a **series** (one `MonthlyDataPoint` field, shown in a chart).
3. The unit: currency or percentage.

## Pipeline, in this order

| Step | File | Rule |
|---|---|---|
| 1 | `src/lib/financial-types.ts` | Extend `KPIMetrics` **or** `MonthlyDataPoint`. Never re-declare a shape inline in a component. |
| 2 | `src/lib/financial-utils.ts` | Derive inside `computeKPIs` or `computeMonthlyData`. Both are pure functions over `FinancialMovement[]`; keep them pure, no fetch, no React. |
| 3 | `src/lib/financial-utils.test.ts` | Add the case before rendering it. Existing tests cover the zero-income guard; every new ratio needs its own divide-by-zero guard. |
| 4 | `src/components/dashboard/` | Render. KPI cards go through `KPIRow` → `KPICard`; charts are their own module. |
| 5 | `src/App.tsx` | Wire state only through the existing `metrics` / `monthlyData` pair. |

## When the figure is neither a total nor a series

Some outputs are descriptive rather than numeric — a reporting-period caption, a
row count, a "last updated" stamp. These do **not** belong in `KPIMetrics` or
`MonthlyDataPoint`, and adding a third parallel model is usually wrong too.

- Write a pure function that takes the **already-derived** model
  (`MonthlyDataPoint[]`, not `FinancialMovement[]`) so it cannot disagree with
  what the charts render. See `formatReportingPeriod`.
- Test it against `computeMonthlyData` output, not just against hand-built
  fixtures, so the two cannot drift apart.
- Derive it during render in `App.tsx` rather than adding `useState` for it.
- Make the consuming prop required. An optional prop with a literal default is
  how the period ended up hardcoded twice.

## Dates must be bucketed timezone-free

`create_date` is an ISO calendar date. Never route it through `new Date(string)`
to read its month or day: the string parses as UTC midnight, so west of
Greenwich it reads as the previous calendar day and a movement dated the 1st
lands in the prior month.

```ts
// ❌ shifts 2024-02-01 to Jan 2024 at UTC-5
`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`

// ✅
isoDate.slice(0, 7)
```

`backend/app/routes.py` draws `movement_day = random.randint(1, 28)`, so the live
API does emit day-1 dates; the frontend mock data happens not to, which means
this defect is invisible in the static demo and real against the backend. Any
month-bucketing test must include a day-1 fixture, which fails on a UTC-negative
host and passes on a UTC-positive one — pin it with the fixture, not the host.

## Formatting rules

- Currency: `formatCurrency` from `financial-utils`. Percent: `formatPercent`.
  Never call `toFixed`, `toLocaleString` or `Intl` inside a component.
- Locale is `en-US` and currency is USD, fixed in `financial-utils`. A new
  locale is a change to that module only, not per component.
- Month labels come from `formatMonthYearLabel` (`"Jan 2024"`). Do not build
  date labels in chart components.
- Chart colors are CSS custom properties (`var(--chart-income)`,
  `var(--chart-outcome)`, `var(--chart-profit)`) declared in `src/index.css`
  under `:root` and `.dark`. Add a new token there for a new series; never
  hardcode a hex in a chart.

## Accessibility contract

Every chart must ship three things, because the Recharts tooltip is hover-only:

- a wrapper with `role="img"` and an `aria-label` summarising the extremes,
- a `.visually-hidden` `<table>` with a `<caption>` carrying the exact figures,
- a visual channel other than hue when two series share an axis (see the dashed
  outcome line), per WCAG 1.4.1.

## Acceptance criteria

Run from `frontend/`:

```bash
npm run test    # new derivation case passes
npm run lint    # no unused imports after wiring
npm run build   # succeeds; initial index chunk stays under 500 kB
```

Then load the app and confirm the figure appears in both the KPI card or chart
and its `.visually-hidden` table, and that the numbers match.

## Known traps in this repo

- The reporting period used to be hardcoded twice with different dash characters
  (`2024 - Full Year` in `App.tsx` versus a `2024 — Full Year` default in
  `dashboard-header.tsx`). It is now derived once via
  `formatReportingPeriod(monthlyData)` and `period` is a required prop. Do not
  reintroduce a literal, and do not make the prop optional again.
- `ResponsiveContainer` needs a parent with a resolved height. Wrap it in a
  fixed-height element (`h-[280px]`) and give the container `height="100%"`.
- Both charts are `React.lazy`. A new chart must be added to the `Suspense`
  boundary in `App.tsx` with a `ChartCardSkeleton` fallback of matching height,
  or it will shift layout while loading.
- `/api/metrics` is proxied to `http://backend:8000` in `vite.config.ts`. That
  hostname only resolves inside Docker Compose. Outside it, expect a 504 or a
  failed fetch; that is an environment condition, not an app defect.
