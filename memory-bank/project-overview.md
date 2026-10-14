# Project Overview

## Purpose

Financial Metrics Dashboard: a web application for displaying and exploring financial metrics.

## Architecture

The application has two main services:

- **Frontend:** React and TypeScript, built with Vite.
- **Backend:** FastAPI, served with Uvicorn.

Docker Compose defines the `frontend` and `backend` services.

## Confirmed technology stack

### Frontend

- React: `^19.2.4` (declared version range)
- React DOM: `^19.2.4` (declared version range)
- TypeScript: `~6.0.2`
- Vite: `^8.0.4`
- Vitest: `^4.1.4`
- Recharts: `^3.8.1`
- Tailwind CSS: `^4.2.2`

Source: `frontend/package.json`.

### Backend

Dependencies declared in `backend/requirements.txt`:

- FastAPI
- Uvicorn with standard extras
- debugpy
- pytest
- pytest-cov
- httpx

The backend dependency file does not pin explicit versions.

## Local development

Start the services with:

```bash
docker compose up --build
```

Documented endpoints:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`
- API documentation: `http://localhost:8000/docs`

The frontend uses the Vite proxy for `/api` by default. If requests fail in Codespaces, investigate the environment and proxy behavior before changing application code.

## Testing and validation

- Backend tests: `docker compose run --rm backend python -m pytest -q`
- Frontend tests: run `npm run test` from `frontend`.
- Frontend build: run `npm run build` from `frontend`.
- Frontend lint: run `npm run lint` from `frontend`.

Report actual command results. Do not claim validation passed unless the command was executed successfully.

## Verified project findings

- Backend routes and mock-data generation are located in `backend/app/routes.py`.
- The API includes `/api/metrics/b2b` and `/api/metrics/b2c`.
- Frontend tests include coverage for `financial-utils`.
- The header's reporting-period label is derived from `computeMonthlyData` output
  by `formatReportingPeriod` in `frontend/src/lib/financial-utils.ts`. It was
  hardcoded in two frontend locations until commit `40a2654`; do not reintroduce
  a literal.
- The Docker configuration is oriented toward development; review it before assuming it is production-ready.

Supporting evidence: `engineering-findings.md` and `verification.md`.

## Agent guidance

Read `AGENTS.md` and the available files under `.agents/rules` before working.

Do not assume that skills or other memory files exist without checking. Keep changes within the requested scope, verify claims against the repository, and request permission before changing host-level configuration.
