import type { Request, Response, NextFunction } from "express";
import { logService } from "../services/logger.service";

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startTime = Date.now();

  const logData: any = {
    method: req.method,
    url: req.originalUrl,
    // ip: req.ip || req.socket.remoteAddress,
    // userAgent: req.get("user-agent"),
  };

  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    logData.body = req.body;
  }

  logService.http("Incoming request", logData);

  // Override res.end to log response
  const originalEnd = res.end.bind(res);
  res.end = function (...args: Parameters<typeof originalEnd>): Response {
    const duration = Date.now() - startTime;

    // Log response
    logService.http("Request completed", {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      // duration: `${duration}ms`,
      // ip: req.ip || req.socket.remoteAddress,
    });

    // Call original end (type assertion needed due to Express overloads)
    return (
      originalEnd as (...args: Parameters<typeof originalEnd>) => Response
    )(...args);
  } as typeof res.end;

  next();
}
