import ApiError from "../../utils/ApiError";
import { asyncHandler } from "../../utils/asyncHandler";
import { User } from "../../models/user.model";
import ApiResponse from "../../utils/ApiResponse";
import { ParsedUrlQuery } from "querystring";

export const usernameAvailability = asyncHandler(async (req, res) => {
  const { inp } = req.query as { inp: string };
  if (!inp) throw new ApiError(404, "USERNAME NOT RECEIVED");

  const exists = await User.exists({ username: inp });

  if (exists) {
    return res
      .status(200)
      .json(
        new ApiResponse(200, { available: false }, "USERNAME ALREADY EXIST")
      );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, { available: true }, "USERNAME AVAILABLE"));
});

type JSONBodyType = { inp: ParsedUrlQuery };
