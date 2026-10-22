import { randomUUID } from "node:crypto";

import cors from "cors";

import express from "express";

import { rateLimit } from "express-rate-limit";

import helmet from "helmet";

import { pinoHttp } from "pino-http";

import { env } from "./config/env";

import { logger } from "./lib/logger";

import { errorHandler } from "./middleware/error-handler";

import { notFound } from "./middleware/not-found";

import { healthRouter } from "./routes/health";

export function createApp() {
  const app = express();

  app.set("trust proxy", env.TRUST_PROXY);

  app.use(
    pinoHttp({
      logger,

      genReqId: (req, res) => {
        const header = req.headers["x-request-id"];

        const id =
          typeof header === "string" && header
            ? header.slice(0, 64)
            : randomUUID();

        res.setHeader("x-request-id", id);

        return id;
      },

      autoLogging: { ignore: (req) => req.url === "/health" },
    }),
  );

  app.use(helmet());

  app.use(cors({ origin: env.CORS_ORIGINS }));

  app.use(express.json({ limit: "100kb" }));

  app.use(healthRouter);

  app.use(
    "/v1",

    rateLimit({
      windowMs: 60_000,
      limit: 120,
      standardHeaders: "draft-8",
      legacyHeaders: false,
    }),
  );

  app.use(notFound);

  app.use(errorHandler);

  return app;
}
