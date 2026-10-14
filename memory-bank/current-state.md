# Current Project State

## Repository status

- The project uses a frontend/backend architecture.
- The repository branch during this documentation phase is `main`.
- The project has documentation and agent rules from the previous phases.
- Verify the current Git status and commit history before making further changes.

## Implemented application structure

- The frontend uses React, TypeScript, and Vite.
- The backend uses FastAPI.
- Docker Compose defines the frontend and backend services.
- Backend API routes and mock-data generation are located in `backend/app/routes.py`.
- The API includes endpoints for general metrics, summaries, comparisons, alerts, B2B metrics, and B2C metrics.

## Validation

- The backend test suite was executed using `docker compose run --rm backend python -m pytest -q`.
- The recorded result was 15 passed tests and 1 warning.
- Frontend tests, build, and lint commands are documented in `project-overview.md`. Check their current results before relying on them.

## Known issues and cautions

- The reporting period is derived from the loaded data by
  `formatReportingPeriod(monthlyData)`; it is no longer hardcoded. Do not
  reintroduce a literal period string.
- Frontend month bucketing reads `create_date` by slicing the ISO string. Do not
  reintroduce `new Date(create_date)` for month or day extraction; it shifts
  day-1 movements into the previous month on UTC-negative hosts.
- The Vite development proxy targets `http://backend:8000`.
- A previous Codespaces request encountered a proxy-related 504 error. Diagnose the environment before changing application code.
- The Docker configuration is development-oriented; production readiness has not been established.
- Do not assume previous environment problems are still present without reproducing them.

## Agent skills and current quality baseline

- Loaded community skills live in `.agents/skills/`: `accessibility`,
  `vercel-react-best-practices`, `core-web-vitals`.
- The project-authored skill lives in `.skills/adding-financial-metrics/`.
- Session detail, including what was rejected and why, is in `progress.md`.
- Frontend build baseline changed: the initial JS chunk is now ~188 kB
  (59.86 kB gzip) with Recharts split into a lazy chunk, and the
  `chunk larger than 500 kB` warning is gone. Treat a reintroduced warning as a
  regression.
- WCAG contrast across all 11 text and graphic pairs measures above the AA
  minimum. Contrast is not a known issue here; do not "fix" it without
  re-measuring.
- Backend tests were re-run in the Codespace on 2026-10-14
  (`docker compose exec backend python -m pytest`): 15 passed, 1 warning. Docker
  is unavailable on the agent's local host, so that run is the current evidence.

## Instructions for the next agent

1. Read `AGENTS.md` and `.agents/rules/verification-and-debugging.md`.
2. Read `.agents/skills/` and `.skills/` before applying conventions to the dashboard.
3. Read `project-overview.md` and consult `engineering-findings.md` and `verification.md` for supporting evidence.
4. Inspect the current source before relying on this summary.
5. Keep changes within the requested scope.
6. Run relevant tests after code changes and report the actual results.
7. Request permission before changing host-level configuration.

## Scope

This memory bank documents the existing project. It does not authorize new features, architecture changes, dependency upgrades, or unrelated fixes.
