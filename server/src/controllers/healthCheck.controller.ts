import { asyncHandler } from "../utils/asyncHandler";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";

const healthCheck = asyncHandler(async (req, res) => {
  //TODO: build a healthCheck response that simply returns the OK status as json with a message
  const response = new ApiResponse(200, {}, "SERVICE IS HEALTHY");
  return res.status(200).json(response);
});

const checkUserAuthDetails = asyncHandler(async (req, res) => {
  // TODO: check logged in user basic info
  const user = req.user;
  if (!user) {
    throw new ApiError(401, "UNAUTHORIZED");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, { user }, "LOGGED IN USER'S AUTH DETAILS"));
});

export { healthCheck, checkUserAuthDetails };
