import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import UserHeader from "./UserHeader";
import type { TweetItem } from "../../hooks/data-fetching/useFetchFeed";

const TweetCard: React.FC<{ tweet: TweetItem }> = ({ tweet }) => {
  return (
    <Card sx={sxValue}>
      <CardContent>
        <UserHeader owner={tweet.owner} createdAt={tweet.createdAt} />

        <Typography variant="body1" sx={{ mt: 1, lineHeight: 1.6 }}>
          {tweet.content}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TweetCard;

const sxValue = {
  maxWidth: 600,
  width: "100%",
  boxShadow: 1,
  "&:hover": { boxShadow: 3 },
  transition: "box-shadow 0.3s",
};
