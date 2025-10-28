import ApiError from "../../utils/ApiError";
import ApiResponse from "../../utils/ApiResponse";
import { asyncHandler } from "../../utils/asyncHandler";
import { User } from "../../models/user.model";
import { UserStaleType } from "../../constants/ModelTypes";
import { httpOptions as options } from "../../constants";
import { generateAccessAndRefreshTokens } from "./generateAccessAndRefreshTokens";

export const loginUser = asyncHandler(async (req, res) => {
  // req body -> data
  // username or email
  // find the user
  // password check
  // access and refresh token
  // send cookie

  const { username, email, password } = req.body;

  if (!username && !email) {
    throw new ApiError(400, "USERNAME OR EMAIL IS REQUIRED");
  }

  const matchedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!matchedUser) {
    throw new ApiError(404, "USER DOES NOT EXIST");
  }

  const isPasswordValid = await matchedUser.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "USER PASSWORD IS INCORRECT");
  }

  const matchedUserId: string = String(matchedUser._id);
  const { newAccessToken, newRefreshToken } =
    await generateAccessAndRefreshTokens(matchedUserId);

  const loggedInUser: UserStaleType = matchedUser.toObject();
  // removing password and refreshToken field from the User data
  delete loggedInUser.password;
  delete loggedInUser.refreshToken;

  return res
    .status(200)
    .cookie("accessToken", newAccessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken: newAccessToken,
          refreshToken: newRefreshToken,
          loggedIn: true,
        },
        "USER LOGGED IN SUCCESSFULLY"
      )
    );
});
