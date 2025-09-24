import {
  CardActionArea,
  Typography,
  Stack,
  Avatar,
  CardContent,
} from "@mui/material";
import convertISOIntoLocalTime from "../../utilities/convertISOIntoLocalTime";
import TwitterIcon from "@mui/icons-material/Twitter";
import type { TweetCommentType } from "../../hooks/data-fetching/useFetchCommentsOnTweets";

const style1 = { padding: "10px" };
const style3 = {
  fontSize: "clamp(1rem, 2vw, 1.2rem)",
  fontWeight: "bold",
};
const style4 = { position: "relative", top: "2px" };
const style5 = {
  p: 0, // shorthand for padding: 0
  "&:last-child": {
    pb: 0, // remove bottom padding
  },
};
const style6 = { mt: "5px" };

const Sample3: React.FC<Sample3Props> = ({ comment }) => {
  return (
    <CardActionArea sx={style1}>
      <Stack direction="column" spacing={1} alignItems="start">
        <Stack direction="row" spacing={1}>
          <Avatar alt="Remy Sharp" src={comment.owner.avatar} />
          <Stack justifyContent="center">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography variant="body1" color="textPrimary" sx={style3}>
                {comment.owner.fullname}
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                fontStyle="italic"
              >
                @{comment.owner.username}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <TwitterIcon color="primary" fontSize="small" />
              <Typography variant="caption" color="textSecondary" sx={style4}>
                {convertISOIntoLocalTime(comment.createdAt)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <CardContent sx={style5}>
          <Typography variant="body1" color="textPrimary" sx={style6}>
            {comment.content}
          </Typography>
        </CardContent>
      </Stack>
    </CardActionArea>
  );
};

export default Sample3;

type Sample3Props = {
  comment: TweetCommentType;
};
