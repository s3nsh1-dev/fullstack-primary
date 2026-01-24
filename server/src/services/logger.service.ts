import winston from "winston";
import env from "../utils/dotenvHelper";
import path from "path";
import fs from "fs";

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

const terminalFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  })
);

const onlyLevel = (levelName: string) =>
  winston.format((info) => (info.level === levelName ? info : false))();

const logLevel =
  process.env.LOG_LEVEL || (env.NODE_ENV === "production" ? "http" : "debug");

const winstonInstance = winston.createLogger({
  level: logLevel,
  format: logFormat,
  transports: [
    new winston.transports.Console({
      format: env.NODE_ENV === "production" ? logFormat : terminalFormat,
    }),
  ],
  exitOnError: false,
});

if (env.NODE_ENV === "production") {
  const logDir = path.join(process.cwd(), "logs");

  // Ensure log directory exists
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir, { recursive: true });
  }

  winstonInstance.add(
    new winston.transports.File({
      filename: path.join(logDir, "error.log"),
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
  winstonInstance.add(
    new winston.transports.File({
      filename: path.join(logDir, "info.log"),
      level: "info",
      format: winston.format.combine(onlyLevel("info"), logFormat),
      maxsize: 5242880,
      maxFiles: 5,
    })
  );
  winstonInstance.add(
    new winston.transports.File({
      filename: path.join(logDir, "warn.log"),
      level: "warn",
      format: winston.format.combine(onlyLevel("warn"), logFormat),
      maxsize: 5242880,
      maxFiles: 5,
    })
  );
  winstonInstance.add(
    new winston.transports.File({
      filename: path.join(logDir, "debug.log"),
      level: "debug",
      format: winston.format.combine(onlyLevel("debug"), logFormat),
      maxsize: 5242880,
      maxFiles: 5,
    })
  );
  winstonInstance.add(
    new winston.transports.File({
      filename: path.join(logDir, "http.log"),
      level: "http",
      format: winston.format.combine(onlyLevel("http"), logFormat),
      maxsize: 5242880,
      maxFiles: 5,
    })
  );
}

class WinstonLogger {
  error(
    message: string,
    error?: Error | unknown,
    metadata?: Record<string, unknown>
  ): void {
    const logData: Record<string, unknown> = { ...metadata };

    if (error instanceof Error) {
      logData.error = {
        message: error.message,
        stack: error.stack,
        name: error.name,
      };
    } else if (error) {
      logData.error = error;
    }

    winstonInstance.error(message, logData);
  }
  warn(message: string, metadata?: Record<string, unknown>): void {
    winstonInstance.warn(message, metadata);
  }
  info(message: string, metadata?: Record<string, unknown>): void {
    winstonInstance.info(message, metadata);
  }
  http(message: string, metadata?: Record<string, unknown>): void {
    winstonInstance.http(message, metadata);
  }
  debug(message: string, metadata?: Record<string, unknown>): void {
    winstonInstance.debug(message, metadata);
  }
  request(
    req: {
      method?: string;
      url?: string;
      ip?: string;
      headers?: Record<string, unknown>;
    },
    message: string,
    metadata?: Record<string, unknown>
  ): void {
    const requestMetadata = {
      ...metadata,
      method: req.method,
      url: req.url,
      // ip: req.ip,
      // userAgent: req.headers?.["user-agent"],
    };

    this.http(message, requestMetadata);
  }
}

const logService = new WinstonLogger();
export { logService };
