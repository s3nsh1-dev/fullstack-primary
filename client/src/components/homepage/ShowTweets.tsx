import type { TweetType } from "../../constants/dataTypes";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  CardActions,
} from "@mui/material";
import convertISOIntoLocalTime from "../../utilities/convertISOIntoLocalTime";
import TwitterIcon from "@mui/icons-material/Twitter";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import CommentIcon from "@mui/icons-material/Comment";
import { useState } from "react";
import useMode from "../../hooks/useMode";

const ShowTweets = ({
  tweets,
  interaction,
}: {
  tweets: TweetType[];
  interaction: boolean;
}) => {
  const { mode } = useMode();
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
        <Card
          key={tweet._id}
          variant="outlined"
          sx={{ borderRadius: "10px", padding: "10px" }}
        >
          <CardContent
            sx={{
              p: 0, // shorthand for padding: 0
              "&:last-child": {
                pb: 0, // remove bottom padding
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
              <>
                <CardActions sx={{ mt: 2, p: 0 }}>
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
                    onClick={handleShowComments}
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
                </CardActions>
                {showComments && (
                  <Card
                    sx={{
                      m: "0.5%",
                      padding: "10px",
                      backgroundColor: mode ? "#f7f6f6ff" : "transparent",
                    }}
                  >
                    <CardContent
                      sx={{
                        p: 0, // shorthand for padding: 0
                        "&:last-child": {
                          pb: 0, // remove bottom padding
                        },
                      }}
                    >
                      <Typography>
                        Lorem ipsum dolor, sit amet consectetur adipisicing
                        elit. Cupiditate non corrupti nostrum, reprehenderit
                        vero provident ea porro voluptatum accusamus aut, fuga
                        quibusdam quos dolorem itaque, saepe sequi perspiciatis?
                        Distinctio, delectus.
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ mt: 2, p: 0 }}>
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
                        onClick={handleShowReply}
                      >
                        <CommentIcon fontSize="small" />
                        <Typography
                          variant="caption"
                          color="textSecondary"
                          sx={{ position: "relative", top: "1px" }}
                        >
                          &nbsp;reply
                        </Typography>
                      </IconButton>
                    </CardActions>
                    {showReply && (
                      <Card
                        sx={{
                          padding: "10px",
                          m: "0.5% 1% 1% 1%",
                          backgroundColor: mode
                            ? "rgb(255,255,255)"
                            : "rgb(0,0,0,0.7)",
                        }}
                      >
                        <CardContent
                          sx={{
                            p: 0, // shorthand for padding: 0
                            "&:last-child": {
                              pb: 0, // remove bottom padding
                            },
                          }}
                        >
                          <Typography>
                            Lorem ipsum dolor, sit amet consectetur adipisicing
                            elit. Nisi architecto velit exercitationem obcaecati
                            provident ea beatae. Consequuntur, ducimus assumenda
                            quis laboriosam, quaerat fuga unde, expedita
                            doloremque dolorem suscipit perferendis veniam?
                          </Typography>
                        </CardContent>
                        <CardActions sx={{ mt: 2, p: 0 }}>
                          <IconButton
                            sx={{
                              borderRadius: "5px",
                              padding: "2px 5px",
                            }}
                          >
                            <ThumbUpOffAltIcon
                              fontSize="small"
                              color="primary"
                            />
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
                            onClick={handleShowReply}
                          >
                            <CommentIcon fontSize="small" />
                            <Typography
                              variant="caption"
                              color="textSecondary"
                              sx={{ position: "relative", top: "1px" }}
                            >
                              &nbsp;reply
                            </Typography>
                          </IconButton>
                        </CardActions>
                      </Card>
                    )}
                  </Card>
                )}
              </>
            )}
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

export default ShowTweets;
