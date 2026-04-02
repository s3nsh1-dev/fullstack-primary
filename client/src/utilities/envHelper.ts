export type EnvVariableType = "VITE_SERVER_URL";

export const EnvVariable = {
  VITE_SERVER_URL: "VITE_SERVER_URL",
} as const;

export const env = {
  VITE_SERVER_URL: import.meta.env.VITE_SERVER_URL as string,
} as const;

