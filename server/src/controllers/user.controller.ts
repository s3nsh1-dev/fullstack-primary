import { registerUser } from "./userControllers/registerUser";
import { loginUser } from "./userControllers/loginUser";
import { logoutUser } from "./userControllers/logoutUser";
import { refreshAccessToken } from "./userControllers/refreshAccessToken";
import { changeCurrentPassword } from "./userControllers/changeCurrentPassword";
import { getCurrentUser } from "./userControllers/getCurrentUser";
import { updateAccountDetails } from "./userControllers/updateAccountDetails";
import { getUserChannelProfile } from "./userControllers/getUserChannelProfile";
import { fetchUserById } from "./userControllers/fetchUserById";
import { updateUserAvatar } from "./userControllers/updateUserAvatar";
import { updateUserCoverImage } from "./userControllers/updateUserCoverImage";
import { usernameAvailability } from "./userControllers/usernameAvailability";
import { newUsernameUpdate } from "./userControllers/newUsernameUpdate";
import { deleteUser } from "./userControllers/deleteUser";
// import { updateUsersWithPublicId } from "./userControllers/updateUsersWithPublicId";
import { deactivateUser } from "./userControllers/deactivateUser";
import { reactivateUser } from "./userControllers/reactivateUser";

export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  fetchUserById,
  usernameAvailability,
  newUsernameUpdate,
  deleteUser,
  // updateUsersWithPublicId,
  deactivateUser,
  reactivateUser,
};
