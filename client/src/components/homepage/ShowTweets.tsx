import type { TweetType } from "../../constants/dataTypes";
import {
  Card,
  CardContent,
  Typography,
  Stack,
  IconButton,
  CardActions,
  CardActionArea,
  Avatar,
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
        <Card key={tweet._id} variant="outlined">
          <CardActionArea sx={{ padding: "10px" }}>
            <Stack direction="column" spacing={1} alignItems="start">
              <Stack direction="row" spacing={1}>
                <Avatar
                  alt="Remy Sharp"
                  src=""
                  sx={{ width: 56, height: 56 }}
                />
                <Stack justifyContent="center">
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Typography
                      variant="body1"
                      fontSize="clamp(1rem, 2vw, 1.2rem)"
                      color="textPrimary"
                      fontWeight="bold"
                    >
                      Full Name
                    </Typography>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      fontStyle="italic"
                    >
                      @username
                    </Typography>
                  </Stack>
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
                </Stack>
              </Stack>
              <CardContent
                sx={{
                  p: 0, // shorthand for padding: 0
                  "&:last-child": {
                    pb: 0, // remove bottom padding
                  },
                }}
              >
                <Typography
                  variant="body1"
                  color="textPrimary"
                  sx={{ mt: "5px" }}
                >
                  {tweet.content}
                </Typography>
              </CardContent>
            </Stack>
          </CardActionArea>
          {interaction && (
            <>
              <CardActions sx={{ mt: 0, p: 0, padding: "10px" }}>
                <IconButton
                  disabled={false}
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
                  disabled={false}
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
                    m: "1%",
                    backgroundColor: mode ? "#f7f6f6ff" : "transparent",
                  }}
                >
                  <CardActionArea sx={{ padding: "10px" }}>
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
                  </CardActionArea>
                  <CardActions sx={{ mt: 0, p: 0, padding: "10px" }}>
                    <IconButton
                      disabled={false}
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
                      disabled={false}
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
                        m: "0.5% 1% 1% 1%",
                        backgroundColor: mode
                          ? "rgb(255,255,255)"
                          : "rgb(0,0,0,0.7)",
                      }}
                    >
                      <CardActionArea sx={{ padding: "10px" }}>
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
                      </CardActionArea>
                      <CardActions sx={{ mt: 0, p: 0, padding: "10px" }}>
                        <IconButton
                          disabled={false}
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
                          disabled={false}
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
        </Card>
      ))}
    </Stack>
  );
};

export default ShowTweets;
