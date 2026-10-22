import { createApp } from "./app";

import { env } from "./config/env";

import { logger } from "./lib/logger";

const app = createApp();

const server = app.listen(env.PORT, env.HOST, () => {
  logger.info({ port: env.PORT, host: env.HOST }, "api listening");
});

server.keepAliveTimeout = 65_000;

server.headersTimeout = 66_000;

let shuttingDown = false;

function shutdown(signal: string) {
  if (shuttingDown) return;

  shuttingDown = true;

  logger.info({ signal }, "shutting down");

  setTimeout(() => {
    logger.error("forced shutdown after timeout");

    process.exit(1);
  }, 10_000).unref();

  server.close((err) => {
    if (err) {
      logger.error({ err }, "error while closing server");

      process.exit(1);
    }

    process.exit(0);
  });

  server.closeIdleConnections();
}

process.on("SIGINT", () => shutdown("SIGINT"));

process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (reason) => {
  logger.fatal({ err: reason }, "unhandled rejection");

  process.exit(1);
});

process.on("uncaughtException", (err) => {
  logger.fatal({ err }, "uncaught exception");

  process.exit(1);
});
