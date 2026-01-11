import type { Request, Response, NextFunction } from "express";
import { logService } from "../services/logger.service";

export function requestLogger(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const startTime = Date.now();

  // Log request start
  logService.http("Incoming request", {
    method: req.method,
    url: req.url,
    ip: req.ip || req.socket.remoteAddress,
    userAgent: req.get("user-agent"),
  });

  // Override res.end to log response
  const originalEnd = res.end.bind(res);
  res.end = function (...args: Parameters<typeof originalEnd>): Response {
    const duration = Date.now() - startTime;

    // Log response
    logService.http("Request completed", {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip || req.socket.remoteAddress,
    });

    // Call original end (type assertion needed due to Express overloads)
    return (
      originalEnd as (...args: Parameters<typeof originalEnd>) => Response
    )(...args);
  } as typeof res.end;

  next();
}
