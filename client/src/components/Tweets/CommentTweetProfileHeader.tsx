import {
  CardActionArea,
  Typography,
  Stack,
  Avatar,
  CardContent,
} from "@mui/material";
import convertISOIntoLocalTime from "../../utilities/convertISOIntoLocalTime";
import TwitterIcon from "@mui/icons-material/Twitter";
import type React from "react";
import {
  style1,
  style3,
  style4,
  style5,
  style6,
} from "../../constants/tweets.constants";

const CommentTweetProfileHeader: React.FC<CommentTweetProfileCardProps> = ({
  style2,
  imgSrc,
  fullname,
  username,
  createdAt,
  content,
}) => {
  return (
    <CardActionArea sx={style1}>
      <Stack direction="column" spacing={1} alignItems="start">
        <Stack direction="row" spacing={1} alignItems="center">
          <Avatar alt="" src={imgSrc} sx={style2} />
          <Stack justifyContent="center">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Typography variant="body1" color="textPrimary" sx={style3}>
                {fullname}
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                fontStyle="italic"
              >
                @{username}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1}>
              <TwitterIcon color="primary" fontSize="small" />
              <Typography variant="caption" color="textSecondary" sx={style4}>
                {convertISOIntoLocalTime(createdAt)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
        <CardContent sx={style5}>
          <Typography variant="body1" color="textPrimary" sx={style6}>
            {content}
          </Typography>
        </CardContent>
      </Stack>
    </CardActionArea>
  );
};

export default CommentTweetProfileHeader;

type CommentTweetProfileCardProps = {
  imgSrc: string;
  fullname: string;
  username: string;
  createdAt: string;
  content: string;
  style2: object;
};
