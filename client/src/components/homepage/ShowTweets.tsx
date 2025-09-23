import type { TweetType } from "../../constants/dataTypes";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import convertISOIntoLocalTime from "../../utilities/convertISOIntoLocalTime";
import TwitterIcon from "@mui/icons-material/Twitter";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import CommentIcon from "@mui/icons-material/Comment";

const ShowTweets = ({
  tweets,
  interaction,
}: {
  tweets: TweetType[];
  interaction: boolean;
}) => {
  if (!tweets || tweets.length === 0) {
    return <Typography color="textSecondary">No tweets to show.</Typography>;
  }

  return (
    <Stack spacing={1}>
      {tweets.map((tweet) => (
        <Card key={tweet._id} variant="outlined" sx={{ borderRadius: "10px" }}>
          <CardContent
            sx={{
              p: "10px", // shorthand for padding: 0
              "&:last-child": {
                pb: "10px", // remove bottom padding
              },
            }}
          >
            <Typography variant="body1" color="textPrimary" sx={{ mt: "5px" }}>
              {tweet.content}
            </Typography>
            <Stack direction="row" spacing={1}>
              <TwitterIcon color="primary" fontSize="small" />
              <Typography
                variant="caption"
                color="textSecondary"
                sx={{ position: "relative", top: "2px" }}
              >
                {convertISOIntoLocalTime(tweet.createdAt)}
              </Typography>
            </Stack>
            {interaction && (
              <Stack direction="row" spacing={1} mt={2}>
                <IconButton
                  sx={{
                    borderRadius: "5px",
                    padding: "2px 5px",
                  }}
                >
                  <ThumbUpOffAltIcon fontSize="small" color="primary" />
                  <Typography
                    variant="caption"
                    // color="textSecondary"
                    color="primary"
                    sx={{ position: "relative", top: "2px" }}
                  >
                    &nbsp;Like
                  </Typography>
                </IconButton>
                <IconButton
                  sx={{
                    borderRadius: "5px",
                    padding: "2px 5px",
                  }}
                >
                  <CommentIcon fontSize="small" />
                  <Typography
                    variant="caption"
                    color="textSecondary"
                    sx={{ position: "relative", top: "1px" }}
                  >
                    &nbsp;comments
                  </Typography>
                </IconButton>
              </Stack>
            )}
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default ShowTweets;
