import { useQuery } from "@tanstack/react-query";

const URL = import.meta.env.VITE_SERVER_URL;
const useFetchCommentsOnVideo = (videoId: string) => {
  return useQuery({
    queryKey: ["videoComments", videoId],
    queryFn: async () => {
      const response = await fetch(`${URL}/comments/v/${videoId}`, {
        method: "GET",
        credentials: "include",
      });
      if (!response.ok) throw new Error("ERROR WHILE FETCHING COMMENTS");
      const data: CommentsResponse = await response.json();
      return data.data.comments;
    },
    enabled: !!videoId,
  });
};

export default useFetchCommentsOnVideo;

type CommentsResponse = {
  statusCode: number;
  data: {
    comments: {
      docs: {
        _id: string;
        content: string;
        video: string;
        owner: {
          _id: string;
          username: string;
          fullname: string;
          avatar: string;
        };
        createdAt: string;
        updatedAt: string;
      }[];
      totalDocs: number;
      limit: number;
      page: number;
      totalPages: number;
      pagingCounter: number;
      hasPrevPage: boolean;
      hasNextPage: boolean;
      prevPage: number | null;
      nextPage: number | null;
    };
    commentCount: number;
    isLiked: boolean;
  };
  message: string;
  success: boolean;
};
