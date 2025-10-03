import { Typography, Stack, Avatar } from "@mui/material";
import convertISOIntoLocalTime from "../../utilities/convertISOIntoLocalTime";
import TwitterIcon from "@mui/icons-material/Twitter";
import type React from "react";
import { style3, style4 } from "../../constants/tweets.constants";

const ContentProfileHeader: React.FC<ContentProfileCardProps> = ({
  style2,
  imgSrc,
  fullname,
  username,
  createdAt,
}) => {
  return (
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
  );
};

export default ContentProfileHeader;

type ContentProfileCardProps = {
  imgSrc: string;
  fullname: string;
  username: string;
  createdAt: string;
  style2: object;
};

<Stack direction="column" spacing={1} alignItems="start"></Stack>;
