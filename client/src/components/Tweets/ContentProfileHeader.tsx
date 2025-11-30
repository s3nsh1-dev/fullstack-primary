import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import convertISOIntoLocalTime from "../../utilities/convertISOIntoLocalTime";
import type React from "react";
import { style3, style4 } from "../../constants/tweets.constants";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Box } from "@mui/material";

const ContentProfileHeader: React.FC<ContentProfileCardProps> = ({
  style2,
  imgSrc,
  fullname,
  username,
  createdAt,
}) => {
  return (
    <Box sx={contSx}>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        justifyContent={"space-between"}
      >
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
            <Typography variant="caption" color="textSecondary" sx={style4}>
              {convertISOIntoLocalTime(createdAt)}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
      <TwitterIcon color="primary" fontSize="small" />
    </Box>
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

const contSx = {
  display: " flex",
  justifyContent: "space-between",
  width: "100%",
};
