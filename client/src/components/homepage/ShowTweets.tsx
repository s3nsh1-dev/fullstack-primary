import type { TweetType } from "../../constants/dataTypes";
import { Card, CardContent, Typography, Stack } from "@mui/material";
import convertISOIntoLocalTime from "../../utilities/convertISOIntoLocalTime";
import TwitterIcon from "@mui/icons-material/Twitter";

const ShowTweets = ({ tweets }: { tweets: TweetType[] }) => {
  if (!tweets || tweets.length === 0) {
    return <Typography color="textSecondary">No tweets to show.</Typography>;
  }

  return (
    <Stack spacing={1} m={1}>
      {tweets.map((tweet) => (
        <Card key={tweet._id} variant="outlined" sx={{ borderRadius: "10px" }}>
          <CardContent
            sx={{
              p: 2, // shorthand for padding: 0
              "&:last-child": {
                pb: 2, // remove bottom padding
              },
            }}
          >
            <Typography variant="body1" color="textPrimary">
              {tweet.content}
            </Typography>
            <Typography
              variant="caption"
              color="textSecondary"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: "start",
                textAlign: "center",
              }}
            >
              <TwitterIcon color="primary" fontSize="small" />
              {convertISOIntoLocalTime(tweet.createdAt)}
            </Typography>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default ShowTweets;
