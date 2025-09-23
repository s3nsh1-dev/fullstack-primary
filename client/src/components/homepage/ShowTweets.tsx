import type { TweetType } from "../../constants/dataTypes";
import { Card, Typography, Stack } from "@mui/material";

import { useState } from "react";
import useMode from "../../hooks/useMode";
import Sample1 from "../Tweets/Sample1";
import Sample2 from "../Tweets/Sample2";

const ShowTweets = ({
  tweets,
  interaction,
}: {
  tweets: TweetType[];
  interaction: boolean;
}) => {
  const { mode } = useMode();
  const styleMode1 = {
    m: "1%",
    backgroundColor: mode ? "#f7f6f6ff" : "transparent",
  };
  const styleMode2 = {
    m: "0.5% 1% 1% 1%",
    backgroundColor: mode ? "rgb(255,255,255)" : "rgb(0,0,0,0.7)",
  };

  const [showComments, setShowComments] = useState(true);
  const [showReply, setShowReply] = useState(true);
  if (!tweets || tweets.length === 0) {
    return <Typography color="textSecondary">No tweets to show.</Typography>;
  }
  const handleShowComments = () => {
    setShowComments(!showComments);
  };
  const handleShowReply = () => {
    setShowReply(!showReply);
  };

  return (
    <Stack spacing={1}>
      {tweets.map((tweet) => (
        <Card key={tweet._id} variant="outlined">
          <Sample1 tweet={tweet} />
          {interaction && (
            <>
              <Sample2 handleShowComments={handleShowComments} />
              {showComments && (
                <Card sx={styleMode1}>
                  <Sample1 tweet={tweet} />
                  <Sample2 handleShowComments={handleShowReply} />
                  {showReply && (
                    <Card sx={styleMode2}>
                      <Sample1 tweet={tweet} />
                      <Sample2 handleShowComments={handleShowComments} />
                    </Card>
                  )}
                </Card>
              )}
            </>
          )}
        </Card>
      ))}
    </Stack>
  );
};

export default ShowTweets;
