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

- Some frontend period labels are hardcoded in more than one location.
- The Vite development proxy targets `http://backend:8000`.
- A previous Codespaces request encountered a proxy-related 504 error. Diagnose the environment before changing application code.
- The Docker configuration is development-oriented; production readiness has not been established.
- Do not assume previous environment problems are still present without reproducing them.

## Instructions for the next agent

1. Read `AGENTS.md` and `.agents/rules/verification-and-debugging.md`.
2. Read `project-overview.md` and consult `engineering-findings.md` and `verification.md` for supporting evidence.
3. Inspect the current source before relying on this summary.
4. Keep changes within the requested scope.
5. Run relevant tests after code changes and report the actual results.
6. Request permission before changing host-level configuration.

## Scope

This memory bank documents the existing project. It does not authorize new features, architecture changes, dependency upgrades, or unrelated fixes.
