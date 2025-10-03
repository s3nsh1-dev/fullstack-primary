import React from "react";
import ContentProfileHeader from "./ContentProfileHeader";
import TweetProfileActions from "./TweetProfileActions";
import {
  Box,
  Card,
  CardActionArea,
  Stack,
  CardContent,
  Typography,
} from "@mui/material";
import type { TweetType } from "../../hooks/data-fetching/useFetchUserTweets";
import {
  style1,
  style2,
  style6,
  style5,
} from "../../constants/tweets.constants";
import useCheckLikeOnTweet from "../../hooks/data-fetching/useCheckLikeOnTweet";
import CircularProgressCenter from "../ui-components/CircularProgressCenter";
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
        <CircularProgressCenter />
      </div>
    );
  if (isError) return <div>....Encountered Error</div>;
  if (!data) return <CircularProgressCenter />;

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
        <CardActionArea sx={style1}>
          <Stack direction="column" spacing={1} alignItems="start">
            <ContentProfileHeader
              imgSrc={tweet.owner.avatar || ""}
              fullname={tweet.owner.fullname || "fake-fullname"}
              style2={style2}
              username={tweet.owner.username || "fake-username"}
              createdAt={tweet.createdAt}
            />
            <CardContent sx={style5}>
              <Typography variant="body1" color="textPrimary" sx={style6}>
                {tweet.content}
              </Typography>
            </CardContent>
          </Stack>
        </CardActionArea>
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
