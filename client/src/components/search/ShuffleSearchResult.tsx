import React from "react";
import Stack from "@mui/material/Stack";
import type {
  UserSearchResult,
  VideoSearchResult,
  TweetSearchResult,
} from "../../hooks/searching/useSearchUserQuery";
import { UserSearchCard } from "./UserSearchCard";
import { VideoSearchCard } from "./VideoSearchCard";
import IndividualTweet from "../Tweets/IndividualTweet";
import { useNavigate } from "react-router-dom";

const ShuffleSearchResult: React.FC<PropType> = ({ result }) => {
  const navigate = useNavigate();

  const navigateToUserPage = (username: string) => {
    navigate(`/${username}`);
  };

  const navigateToVideoPage = (videoId: string) => {
    navigate(`/videos/${videoId}`);
  };

  const renderMerge = result.map((item: MergeArrayType) => {
    if ("username" in item) {
      return (
        <UserSearchCard
          key={item._id}
          user={item}
          onClick={() => {
            navigateToUserPage(item.username);
          }}
        />
      );
    }
    if ("videoFile" in item) {
      return (
        <VideoSearchCard
          key={item._id}
          video={item}
          onClick={() => {
            navigateToVideoPage(item._id);
          }}
        />
      );
    }
    if ("isLiked" in item) {
      return (
        <IndividualTweet
          key={item._id}
          tweet={item}
          interaction={false}
          isLiked={item.isLiked}
        />
      );
    }
  });
  return <Stack gap={1}>{renderMerge}</Stack>;
};

export default ShuffleSearchResult;

type PropType = {
  result: MergeArrayType[];
};
type MergeArrayType = UserSearchResult | VideoSearchResult | TweetSearchResult;
