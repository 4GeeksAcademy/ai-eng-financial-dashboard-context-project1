# Verification and Debugging Rules

## 1. Verify before making claims

- Inspect the actual source files before accepting claims about the project.
- Verify file paths, line numbers, dependencies, routes, and configuration against the current repository.
- Do not report that a dependency, file, test, or feature is missing without checking directly.
- Distinguish verified facts, incorrect claims, and items that remain unverified.

## 2. Diagnose before changing the environment

- When a command, API request, or frontend proxy fails, gather evidence before changing application code.
- Distinguish application defects from environment, Docker, networking, and Codespaces configuration issues.
- Do not modify host networking, firewall rules, system configuration, or files outside the task scope without explicit permission.

## 3. Validate changes

- Run the relevant tests after modifying code.
- For backend changes, use `docker compose run --rm backend python -m pytest -q` when the Docker environment is available.
- For frontend changes involving `financial-utils.ts`, run the frontend test suite with `npm run test` from the `frontend` directory.
- Report the commands executed and their actual results. Never claim a test passed unless it was run and passed.
## 4. Keep changes within scope

- Do not add features, redesign the architecture, or change dependencies unless the task requires it.
- Keep each project phase in its own commit when the workflow calls for phase-specific commits.
- Do not create files intended for a later phase prematurely.
