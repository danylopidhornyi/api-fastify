# API Template (backend)

An API template with a backend service located in `backend/`. This README focuses on the repository layout and common developer workflows for the backend service.

**Repository layout**
- `backend/` — main application (TypeScript, Fastify).
- `docker-compose.yml` — compose file to run services locally (Postgres, etc.).

**Quick goals**
- Run the API locally for development
- Run tests
- Format code and use pre-commit hooks

---

## Prerequisites
- Node.js (v18+ recommended)
- Yarn (the project uses Yarn v4 in `backend`)
- Docker & Docker Compose (optional — only if you plan to use the compose setup)

## Setup (first time)
1. Clone the repo and enter the project folder:
   ```bash
   git clone <repo-url>
   cd fastify-api
   ```
2. Install backend dependencies and prepare Husky hooks:
   ```bash
   # from repo root
   yarn --cwd backend install
   # ensures husky hooks are created for contributors
   yarn --cwd backend prepare
   ```

## Development
- Run the backend in watch/dev mode:
  ```bash
  yarn --cwd backend dev
  # or from inside backend:
  # yarn dev
  ```

## Running with Docker Compose
- Start services (Postgres, etc.) and app (if configured in compose):
  ```bash
  docker compose up --build
  ```

## Tests
- Run all tests once:
  ```bash
  yarn --cwd backend test:run
  ```
- Run tests in watch mode:
  ```bash
  yarn --cwd backend test:watch
  ```
- Run a single test file:
  ```bash
  yarn --cwd backend vitest run src/plugins/index.spec.ts
  ```

If Vitest doesn't discover tests under `src/`, we include `src/**/*.spec.ts` in `backend/vitest.config.ts`.

## Formatting & Pre-commit checks
- Format changed files with Prettier:
  ```bash
  yarn --cwd backend format
  ```
- Pre-commit hook runs `lint-staged` (Prettier) and tests. If you want to skip hooks for a local commit:
  ```bash
  git commit --no-verify -m "..."
  ```

## Prisma
- Generate client (if required):
  ```bash
  yarn --cwd backend prisma generate
  ```
- Run migrations locally:
  ```bash
  yarn --cwd backend prisma migrate dev
  ```
- Open Prisma Studio:
  ```bash
  yarn --cwd backend prisma studio
  ```

## Common commands (repo root)
- Install dependencies for backend: `yarn --cwd backend install`
- Run backend: `yarn --cwd backend dev`
- Run tests: `yarn --cwd backend test:run`
- Format: `yarn --cwd backend format`

## Troubleshooting
- If hooks do not run, verify Git hooks path:
  ```bash
  git config --get core.hooksPath
  # should be .husky (repo root)
  ```
- If `Vitest` reports "No test files found", check `backend/vitest.config.ts` `include` patterns include `src/**/*.spec.ts`.
- If tests hang during `app.ready()`, ensure the app is not attempting to bind to a fixed port during tests — tests use `app.inject()` and `app.ready()` only.

## Contributing
- Follow the code style: run `yarn --cwd backend format` before creating a PR.
- Tests should be added for new features. Run `yarn --cwd backend test:run` locally.

## Notes
- The project tracks the application in `backend/` — consider using the `backend` folder as the primary working directory for most commands.
- If you need me to push this README to the remote, tell me and I'll push the commit.

---

If anything in this README is unclear or you want commands adjusted to a different workflow (npm, pnpm, etc.), tell me which you prefer and I will update it.
