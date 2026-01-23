import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import ApiError from "../utils/ApiError";
import { logService } from "../services/logger.service";
import env from "../utils/dotenvHelper";

/**
 * Production-grade error handling middleware
 * Handles all types of errors and returns consistent error responses
 */

interface ErrorResponse {
  success: boolean;
  message: string;
  errors?: any;
  stack?: string;
  statusCode: number;
}

/**
 * Handle Mongoose validation errors
 */
const handleMongooseValidationError = (error: mongoose.Error.ValidationError): ErrorResponse => {
  const errors = Object.values(error.errors).map((err) => ({
    field: err.path,
    message: err.message,
  }));

  return {
    success: false,
    message: "VALIDATION ERROR",
    errors,
    statusCode: 400,
  };
};

/**
 * Handle Mongoose cast errors (invalid ObjectId, etc.)
 */
const handleMongooseCastError = (error: mongoose.Error.CastError): ErrorResponse => {
  return {
    success: false,
    message: `INVALID ${error.path?.toUpperCase() || "RESOURCE"}`,
    errors: `Invalid ${error.kind} for ${error.path}`,
    statusCode: 400,
  };
};

/**
 * Handle Mongoose duplicate key errors
 */
const handleMongooseDuplicateKeyError = (error: any): ErrorResponse => {
  const field = Object.keys(error.keyPattern || {})[0] || "field";
  const value = error.keyValue?.[field] || "value";

  return {
    success: false,
    message: "DUPLICATE ENTRY",
    errors: `${field} '${value}' already exists`,
    statusCode: 409,
  };
};

/**
 * Handle JWT errors
 */
const handleJWTError = (error: Error): ErrorResponse => {
  if (error.name === "JsonWebTokenError") {
    return {
      success: false,
      message: "INVALID TOKEN",
      errors: "Invalid authentication token",
      statusCode: 401,
    };
  }

  if (error.name === "TokenExpiredError") {
    return {
      success: false,
      message: "TOKEN EXPIRED",
      errors: "Authentication token has expired",
      statusCode: 401,
    };
  }

  return {
    success: false,
    message: "AUTHENTICATION ERROR",
    errors: error.message,
    statusCode: 401,
  };
};

/**
 * Handle express-validator errors
 */
const handleValidationError = (error: any): ErrorResponse => {
  // If error has array() method, it's from express-validator
  if (error.array && typeof error.array === "function") {
    const errors = error.array().map((err: any) => ({
      field: err.path || err.param,
      message: err.msg || err.message,
      value: err.value,
    }));

    return {
      success: false,
      message: "VALIDATION ERROR",
      errors,
      statusCode: 400,
    };
  }

  return {
    success: false,
    message: "VALIDATION ERROR",
    errors: error.message || "Invalid input data",
    statusCode: 400,
  };
};

/**
 * Main error handling middleware
 */
export const errorHandler = (
  error: Error | ApiError | mongoose.Error | any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let errorResponse: ErrorResponse;

  // Handle custom ApiError
  if (error instanceof ApiError) {
    errorResponse = {
      success: false,
      message: error.message,
      errors: error.errors,
      statusCode: error.statusCode,
    };

    // Log warning for client errors (4xx), error for server errors (5xx)
    if (error.statusCode >= 500) {
      logService.error("API Error", error, {
        path: req.path,
        method: req.method,
        ip: req.ip,
        userAgent: req.get("user-agent"),
      });
    } else {
      logService.warn("API Error", {
        message: error.message,
        statusCode: error.statusCode,
        path: req.path,
        method: req.method,
        ip: req.ip,
      });
    }
  }
  // Handle Mongoose Validation Error
  else if (error instanceof mongoose.Error.ValidationError) {
    errorResponse = handleMongooseValidationError(error);
    logService.warn("Mongoose Validation Error", {
      errors: errorResponse.errors,
      path: req.path,
      method: req.method,
    });
  }
  // Handle Mongoose Cast Error
  else if (error instanceof mongoose.Error.CastError) {
    errorResponse = handleMongooseCastError(error);
    logService.warn("Mongoose Cast Error", {
      message: error.message,
      path: req.path,
      method: req.method,
    });
  }
  // Handle Mongoose Duplicate Key Error
  else if (error.code === 11000 || error.code === 11001) {
    errorResponse = handleMongooseDuplicateKeyError(error);
    logService.warn("Mongoose Duplicate Key Error", {
      message: errorResponse.message,
      path: req.path,
      method: req.method,
    });
  }
  // Handle JWT Errors
  else if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
    errorResponse = handleJWTError(error);
    logService.warn("JWT Error", {
      name: error.name,
      message: error.message,
      path: req.path,
      method: req.method,
    });
  }
  // Handle express-validator errors
  else if (error.array || (error.errors && Array.isArray(error.errors))) {
    errorResponse = handleValidationError(error);
    logService.warn("Validation Error", {
      errors: errorResponse.errors,
      path: req.path,
      method: req.method,
    });
  }
  // Handle generic errors
  else {
    const statusCode = error.statusCode || error.status || 500;
    const message =
      statusCode === 500
        ? "INTERNAL SERVER ERROR"
        : error.message || "SOMETHING WENT WRONG";

    errorResponse = {
      success: false,
      message,
      statusCode,
    };

    // Log all server errors with full details
    if (statusCode >= 500) {
      logService.error("Unhandled Error", error, {
        path: req.path,
        method: req.method,
        ip: req.ip,
        userAgent: req.get("user-agent"),
        body: req.body,
        query: req.query,
        params: req.params,
      });
    } else {
      logService.warn("Client Error", {
        message: error.message,
        statusCode,
        path: req.path,
        method: req.method,
      });
    }
  }

  // Include stack trace only in development
  if (env.NODE_ENV === "development" && error.stack) {
    errorResponse.stack = error.stack;
  }

  // Send error response
  res.status(errorResponse.statusCode).json({
    success: errorResponse.success,
    message: errorResponse.message,
    errors: errorResponse.errors || null,
    ...(errorResponse.stack && { stack: errorResponse.stack }),
    data: null,
  });
};

/**
 * Handle 404 - Not Found errors
 * This should be placed after all routes but before errorHandler
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const error = new ApiError(
    404,
    `ROUTE NOT FOUND - ${req.method} ${req.originalUrl}`
  );

  logService.warn("Route Not Found", {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });

  next(error);
};
