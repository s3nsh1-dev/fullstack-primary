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

const ShuffleSearchResult: React.FC<PropType> = ({ users, videos, tweets }) => {
  const merge = shuffleAndMerge(users, videos, tweets);
  const navigate = useNavigate();

  const navigateToUserPage = (username: string) => {
    navigate(`/${username}`);
  };

  const navigateToVideoPage = (videoId: string) => {
    navigate(`/videos/${videoId}`);
  };

  const renderMerge = merge.map((item: MergeArrayType) => {
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
  users: UserSearchResult[];
  videos: VideoSearchResult[];
  tweets: TweetSearchResult[];
};

function shuffleAndMerge(
  a: UserSearchResult[],
  b: VideoSearchResult[],
  c: TweetSearchResult[]
): MergeArrayType[] {
  const merged = [...a, ...b, ...c];

  for (let i = merged.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [merged[i], merged[j]] = [merged[j], merged[i]];
  }

  return merged;
}

type MergeArrayType = UserSearchResult | VideoSearchResult | TweetSearchResult;
