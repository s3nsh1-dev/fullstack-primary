import bcrypt from "bcrypt";

const REFRESH_TOKEN_SALT_ROUNDS = 10;

const isBcryptHash = (value: string) => value.startsWith("$2");

export const hashRefreshToken = async (refreshToken: string) =>
  bcrypt.hash(refreshToken, REFRESH_TOKEN_SALT_ROUNDS);

export const compareRefreshToken = async (
  incomingRefreshToken: string,
  storedRefreshToken: string | undefined
) => {
  if (!storedRefreshToken) return false;

  if (!isBcryptHash(storedRefreshToken)) {
    return incomingRefreshToken === storedRefreshToken;
  }

  return bcrypt.compare(incomingRefreshToken, storedRefreshToken);
};

export { REFRESH_TOKEN_SALT_ROUNDS };
