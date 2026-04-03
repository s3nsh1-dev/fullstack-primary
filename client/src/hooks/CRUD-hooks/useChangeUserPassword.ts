import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { env } from "../../utilities/envHelper";

const useChangeUserPassword = () => {
  return useMutation({
    mutationKey: ["user", "password", "change"],
    mutationFn: (updatedCredentials: CredentialsType) =>
      changePassword(updatedCredentials),
  });
};

export default useChangeUserPassword;

const changePassword = async (updatedCredentials: CredentialsType) => {
  try {
    const { data } = await axios.post<ApiResponse>(
      `${URL}/users/change-password`,
      updatedCredentials,
      { withCredentials: true }
    );
    return data;
  } catch (error) {
    throw new Error(`PASSWORD CHANGING REQUEST FAILED: ${error}`);
  }
};

const URL = env.VITE_SERVER_URL;

type CredentialsType = {
  currentPassword: string;
  newPassword: string;
};

type ApiResponse = {
  statusCode: number;
  data: boolean;
  message: string;
  success: boolean;
};
