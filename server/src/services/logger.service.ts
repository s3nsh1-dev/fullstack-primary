import winston from "winston";
import env from "../utils/dotenvHelper";

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
  env.LOG_LEVEL || (process.env.NODE_ENV === "production" ? "info" : "debug");

const winstonInstance = winston.createLogger({
  level: logLevel,
  format: logFormat,
  defaultMeta: {
    service: "playtube",
    environment: process.env.NODE_ENV || "development",
  },
  transports: [
    new winston.transports.Console({
      format:
        process.env.NODE_ENV === "production" ? logFormat : terminalFormat,
    }),
  ],
  exitOnError: false,
});

if (process.env.NODE_ENV === "production") {
  winstonInstance.add(
    new winston.transports.File({
      filename: "src/logs/error.log",
      level: "error",
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
  winstonInstance.add(
    new winston.transports.File({
      filename: "src/logs/info.log",
      level: "info",
      format: winston.format.combine(onlyLevel("info"), logFormat),
      maxsize: 5242880,
      maxFiles: 5,
    })
  );
  winstonInstance.add(
    new winston.transports.File({
      filename: "src/logs/warn.log",
      level: "warn",
      format: winston.format.combine(onlyLevel("warn"), logFormat),
      maxsize: 5242880,
      maxFiles: 5,
    })
  );
  winstonInstance.add(
    new winston.transports.File({
      filename: "src/logs/debug.log",
      level: "debug",
      format: winston.format.combine(onlyLevel("debug"), logFormat),
      maxsize: 5242880,
      maxFiles: 5,
    })
  );
  winstonInstance.add(
    new winston.transports.File({
      filename: "src/logs/http.log",
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
      ip: req.ip,
      userAgent: req.headers?.["user-agent"],
    };

    this.http(message, requestMetadata);
  }
}

const logService = new WinstonLogger();
export { logService };
