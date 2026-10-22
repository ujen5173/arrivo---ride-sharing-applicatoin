# @arrivo/api

Express 5 + TypeScript backend for Arrivo.

## Stack

- Express 5 (async errors reach the error handler without wrappers)
- TypeScript, strict, bundled with `tsup`, run in development with `tsx`
- `zod` for environment validation (the process exits with a readable message if config is invalid)
- `pino` and `pino-http` for structured logs with a request id on every request
- `helmet`, `cors`, `express-rate-limit`
- Vitest and Supertest for tests

## Scripts

Run from the repository root with `pnpm --filter @arrivo/api <script>`, or use `pnpm api` for the dev server.

| Script                                                                                                                            | What it does                                |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------- |
| `dev`                                                                                                                             | Watch mode via `tsx`, loads `.env`          |
| `build`                                                                                                                           | Bundle to `dist/server.js` with `tsup`      |
| `start`                                                                                                                           | Run the built server: `node dist/server.js` |
| `lint`                                                                                                                            | ESLint                                      |
| `typecheck`                                                                                                                       | `tsc --noEmit`                              |
| `test`                                                                                                                            | Run tests once                              |
| `test:watch`                                                                                                                      | Run tests in watch mode                     |
| `start` does not read a `.env` file. In production, provide environment variables through the platform. To run the build locally: |

```bash
pnpm --filter @arrivo/api build
cd apps/api
node --env-file=.env dist/server.js
```

## Environment variables

Copy `.env.example` to `.env` for local development

| Variable       | Default       | Description                                                                 |
| -------------- | ------------- | --------------------------------------------------------------------------- |
| `NODE_ENV`     | `development` | `development`, `test` or `production`                                       |
| `PORT`         | `4000`        | Port to listen on                                                           |
| `HOST`         | `0.0.0.0`     | Interface to bind                                                           |
| `LOG_LEVEL`    | `info`        | `fatal`, `error`, `warn`, `info`, `debug`, `trace` or `silent`              |
| `CORS_ORIGINS` | empty         | Comma-separated allowed browser origins. Native apps don't send `Origin`.   |
| `TRUST_PROXY`  | `0`           | Number of reverse proxies in front of the API. Set to `1` behind one proxy. |

## Test Endpoint

### `GET /health`

Liveness check. Returns `200`:

```json
{ "status": "ok", "uptime": 42, "timestamp": "2026-10-22T06:00:00.000Z" }
```

### Errors

Every error uses the same shape:

```json
{ "error": { "code": "NOT_FOUND", "message": "Route not found" } }
```

| Status | Code          | When                                           |
| ------ | ------------- | ---------------------------------------------- |
| `400`  | `BAD_REQUEST` | Malformed request, such as invalid JSON        |
| ``     | `NOT_FOUND`   | Unknown route                                  |
| `500`  | `INTERNAL`    | Unhandled error. Details are logged, not sent. |

## Source layout

```text
src/
├── app.ts               app factory (middleware order lives here)
├── server.ts            process entry: listen, shutdown, crash handlers
├── config/env.ts        validated environment
├── lib/                 logger, AppError
├── middleware/          not-found, error-handler
└── routes/              route modules
```
