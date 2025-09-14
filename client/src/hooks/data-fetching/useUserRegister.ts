import { useMutation } from "@tanstack/react-query";
import type { RegistrationFormType } from "../../constants/dataTypes";

const URL = import.meta.env.VITE_SERVER_URL;

const useUserRegister = () => {
  return useMutation({
    mutationKey: ["register"],
    mutationFn: async (formData: RegistrationFormType) => {
      const formBody = new FormData();
      formBody.append("fullname", formData.fullname);
      formBody.append("email", formData.email);
      formBody.append("username", formData.username);
      formBody.append("password", formData.password);
      if (formData.avatar) formBody.append("avatar", formData.avatar);
      if (formData.coverImage)
        formBody.append("coverImage", formData.coverImage);

      const response = await fetch(`${URL}/users/register`, {
        // headers will be set automatically
        credentials: "include",
        method: "POST",
        body: formBody,
      });

      if (!response.ok) throw new Error("USER REGISTRATION FAILED");

      const data = await response.json();
      return data;
    },
  });
};
export default useUserRegister;
