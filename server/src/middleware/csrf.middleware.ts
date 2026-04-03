import crypto from "crypto";
import type { Request, Response, NextFunction } from "express";
import ApiError from "../utils/ApiError";
import { allowedOrigins, csrfCookieName, csrfHeaderName } from "../constants";

const csrfProtectedMethods = new Set(["POST", "PUT", "PATCH", "DELETE"]);

const validateRequestOrigin = (req: Request) => {
  // in Request Header, Origin option will have frontend link name
  const origin = req.header("Origin");

  if (!origin) return;

  if (!allowedOrigins.includes(origin)) {
    throw new ApiError(403, "INVALID REQUEST ORIGIN");
  }
};

export const ensureCsrfRequestIsValid = (req: Request) => {
  if (!csrfProtectedMethods.has(req.method.toUpperCase())) return;

  const hasCookieBasedAuth = Boolean(
    req.cookies?.accessToken || req.cookies?.refreshToken
  );
  const hasBearerAuth = Boolean(req.header("Authorization"));

  if (!hasCookieBasedAuth && hasBearerAuth) {
    return;
  }

  validateRequestOrigin(req);

  const csrfCookieToken = req.cookies?.[csrfCookieName];
  const csrfHeaderToken = req.header(csrfHeaderName);

  if (!csrfCookieToken || !csrfHeaderToken) {
    throw new ApiError(403, "CSRF TOKEN MISSING");
  }

  if (csrfCookieToken !== csrfHeaderToken) {
    throw new ApiError(403, "INVALID CSRF TOKEN");
  }
};

export const verifyCsrf = (req: Request, _: Response, next: NextFunction) => {
  ensureCsrfRequestIsValid(req);
  next();
};

export const generateCsrfToken = () => crypto.randomBytes(32).toString("hex");
