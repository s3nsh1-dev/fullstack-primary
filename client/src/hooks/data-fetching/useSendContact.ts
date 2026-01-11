import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const useSendContact = () => {
  return useMutation({
    mutationKey: ["send-contact"],
    mutationFn: async (data: ContactFormData) => callingApi(data),
  });
};

export default useSendContact;

const callingApi = async (dataInput: ContactFormData) => {
  const { data } = await axios<ContactResponse>({
    method: "post",
    withCredentials: true,
    url: `${URL}/contact`,
    data: dataInput,
  });
  if (!data.success) {
    throw new Error(data.message || "ERROR WHILE SENDING MESSAGE");
  }
  return data;
};

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

interface ContactResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: ContactFormData;
}

const URL = import.meta.env.VITE_SERVER_URL;
