import React from "react";
import CommentTweetProfileHeader from "./CommentTweetProfileHeader";
import TweetProfileActions from "./TweetProfileActions";
import { Box, Card } from "@mui/material";
import type { TweetType } from "../../hooks/data-fetching/useFetchUserTweets";
import { style2 } from "../../constants/tweets.constants";
import useCheckLikeOnTweet from "../../hooks/data-fetching/useCheckLikeOnTweet";
import CircularProgress from "@mui/material/CircularProgress";
import useAuth from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const IndividualTweet: React.FC<IndividualTweetProps> = ({
  tweet,
  interaction,
}) => {
  const [showComments, setShowComments] = React.useState(false);
  const { data, isLoading, isError } = useCheckLikeOnTweet(tweet._id);
  const { user } = useAuth();
  if (isLoading)
    return (
      <div>
        <CircularProgress />
      </div>
    );
  if (isError) return <div>....Encountered Error</div>;
  if (!data) return <CircularProgress />;

  const handleShowComments = () => {
    setShowComments(!showComments);
  };

  return (
    <Card key={tweet._id} variant="elevation" elevation={4}>
      <Box
        component={Link}
        to={`/tweets/${tweet._id}`}
        sx={{ textDecoration: "none" }}
      >
        <CommentTweetProfileHeader
          imgSrc={tweet.owner.avatar || ""}
          fullname={tweet.owner.fullname || "fake-fullname"}
          style2={style2}
          content={tweet.content}
          username={tweet.owner.username || "fake-username"}
          createdAt={tweet.createdAt}
        />
      </Box>
      {interaction && (
        <>
          <TweetProfileActions
            tweetOwner={user?.user._id === tweet.owner._id}
            tweetId={tweet._id}
            handleShowComments={handleShowComments}
            disabled={false}
            likeStatus={data.data}
            showComments={showComments}
          />
        </>
      )}
    </Card>
  );
};

export default IndividualTweet;

type IndividualTweetProps = {
  tweet: TweetType;
  interaction: boolean;
};
