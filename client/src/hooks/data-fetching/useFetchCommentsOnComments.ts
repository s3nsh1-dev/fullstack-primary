import { useMutation } from "@tanstack/react-query";

const URL = import.meta.env.VITE_SERVER_URL;

const useFetchCommentsOnComments = () => {
  return useMutation({
    mutationKey: ["replyOnComments"],
    mutationFn: async (comment_ID: string) => {
      const response = await fetch(`${URL}/comments/c/${comment_ID}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("ERROR WHILE FETCHING COMMENTS");
      const data: ApiResponse = await response.json();
      return data.data;
    },
  });
};
export default useFetchCommentsOnComments;

export type ReplyType = {
  _id: string;
  content: string;
  comment: string;
  owner: {
    _id: string;
    fullname: string;
    avatar: string;
  };
  createdAt: string;
  updatedAt: string;
};

type ResponseData = {
  comments: {
    docs: ReplyType[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    pagingCounter: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: string | null;
    nextPage: string | null;
  };
};

type ApiResponse = {
  statusCode: number;
  data: ResponseData;
  message: string;
  success: boolean;
};
