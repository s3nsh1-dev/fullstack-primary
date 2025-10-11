import React from "react";
import { Box, Card, CardActionArea, Typography } from "@mui/material";
import UserHeader from "./UserHeader";
import type { TweetItem } from "../../hooks/data-fetching/useFetchFeed";
import { useNavigate } from "react-router-dom";

const TweetCard: React.FC<{ tweet: TweetItem }> = ({ tweet }) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/tweets/${tweet._id}`);
  };
  return (
    <Card sx={sxValue} elevation={10}>
      <CardActionArea onClick={handleCardClick}>
        <Box p={1} component={"div"}>
          <UserHeader
            owner={tweet.owner}
            createdAt={tweet.createdAt}
            isTweet={true}
          />
          <Typography variant="body1" sx={{ mt: 1, lineHeight: 1.6 }}>
            {tweet.content}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default TweetCard;

const sxValue = {
  maxWidth: 600,
  width: "100%",
  "&:hover": { boxShadow: 3 },
  transition: "box-shadow 0.3s",
};
