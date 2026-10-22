import pino from "pino";

import { env } from "../config/env";

export const logger = pino({
  level: env.LOG_LEVEL,

  redact: ["req.headers.authorization", "req.headers.cookie"],

  ...(env.NODE_ENV === "development" && {
    transport: { target: "pino-pretty" },
  }),
});
