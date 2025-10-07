import { useQuery } from "@tanstack/react-query";

const URL = import.meta.env.VITE_SERVER_URL;

const useFetchCommentsOnComments = (comment_ID: string) => {
  return useQuery({
    queryKey: ["replyOnComments", comment_ID],
    queryFn: async () => {
      const response = await fetch(`${URL}/comments/c/${comment_ID}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("ERROR WHILE FETCHING COMMENTS");
      const data: ApiResponse = await response.json();
      return data.data;
    },
    enabled: !!comment_ID,
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
    username: string;
  };
  createdAt: string;
  updatedAt: string;
  isLiked: boolean;
};

type ApiResponse = {
  statusCode: number;
  data: {
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
    commentCount: number;
    isLiked: boolean;
  };
  message: string;
  success: boolean;
};
