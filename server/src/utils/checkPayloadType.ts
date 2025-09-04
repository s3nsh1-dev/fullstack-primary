import type { UserAccessTokenPayloadType } from "../constants";

function isUserAccessTokenPayloadType(
  obj: any
): obj is UserAccessTokenPayloadType {
  return (
    typeof obj === "object" &&
    obj !== null &&
    typeof obj._id === "string" &&
    typeof obj.email === "string" &&
    typeof obj.username === "string" &&
    typeof obj.fullname === "string" &&
    (obj.iat === undefined || typeof obj.iat === "number") &&
    (obj.exp === undefined || typeof obj.exp === "number")
  );
}

export default isUserAccessTokenPayloadType;
