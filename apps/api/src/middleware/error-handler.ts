import type { ErrorRequestHandler } from "express";

import { AppError } from "../lib/app-error";

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);

    return;
  }

  if (err instanceof AppError) {
    res
      .status(err.status)
      .json({ error: { code: err.code, message: err.message } });

    return;
  }

  const status = typeof err?.status === "number" ? err.status : 500;

  if (status >= 400 && status < 500) {
    res
      .status(status)
      .json({ error: { code: "BAD_REQUEST", message: "Bad request" } });

    return;
  }

  req.log.error({ err }, "unhandled error");

  res
    .status(500)
    .json({ error: { code: "INTERNAL", message: "Internal server error" } });
};
