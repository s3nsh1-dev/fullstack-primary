import {
  CardActionArea,
  Typography,
  Stack,
  Avatar,
  CardContent,
} from "@mui/material";
import convertISOIntoLocalTime from "../../utilities/convertISOIntoLocalTime";
import type { TweetType } from "../../constants/dataTypes";
import TwitterIcon from "@mui/icons-material/Twitter";

const style1 = { padding: "10px" };
const style2 = { width: 56, height: 56 };
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

const Sample1 = ({ tweet }: { tweet: TweetType }) => {
  return (
    <CardActionArea sx={style1}>
      <Stack direction="column" spacing={1} alignItems="start">
        <Stack direction="row" spacing={1}>
          <Avatar alt="Remy Sharp" src="" sx={style2} />
          <Stack justifyContent="center">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography variant="body1" color="textPrimary" sx={style3}>
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
              <Typography variant="caption" color="textSecondary" sx={style4}>
                {convertISOIntoLocalTime(tweet.createdAt)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <CardContent sx={style5}>
          <Typography variant="body1" color="textPrimary" sx={style6}>
            {tweet.content}
          </Typography>
        </CardContent>
      </Stack>
    </CardActionArea>
  );
};

export default Sample1;
