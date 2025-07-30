import dotenv from "dotenv";
dotenv.config();

type EnvVariableType = {
  PORT: string;
  MONGODB_COMPASS_CONNECTION_STRING: string;
  CORS_ORIGIN: string;
};

const env: EnvVariableType = {
  PORT: process.env.PORT || "3001",
  MONGODB_COMPASS_CONNECTION_STRING:
    process.env.MONGODB_COMPASS_CONNECTION_STRING ||
    "http://mongodb-connection-error.com",
  CORS_ORIGIN: process.env.CORS_ORIGIN || "SPECIFY THE URL",
};

export default env;
