import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const useUpdateAccountDetails = () => {
  return useMutation({
    mutationKey: ["change-fullname"],
    mutationFn: (newValue: newAccountDetails) => updateAccountDetails(newValue),
  });
};

export default useUpdateAccountDetails;

const updateAccountDetails = async (newValue: newAccountDetails) => {
  const { data } = await axios.patch<ApiResponse>(
    `${URL}/users/update-account`,
    newValue,
    {
      withCredentials: true,
    }
  );
  return data;
};

const URL = import.meta.env.VITE_SERVER_URL;

interface ApiResponse {
  statusCode: number;
  data: { user: IUser };
  message: string;
  success: boolean;
}

interface IUser {
  _id: string;
  username: string;
  email: string;
  fullname: string;
  avatar: string; // URL string
  coverImage: string; // URL string
}

type newAccountDetails = {
  name: string;
  content: string;
};
