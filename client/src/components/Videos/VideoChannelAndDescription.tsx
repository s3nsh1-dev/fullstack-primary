import React from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Stack,
  Avatar,
  Button,
} from "@mui/material";
import useMode from "../../hooks/useMode";
import type { SingleVideoType } from "../../hooks/data-fetching/useFetchSingleVideo";

const VideoChannelAndDescription: React.FC<VideoChannelAndDescriptionProps> = ({
  theme,
  data,
  channelInfo,
}) => {
  const mode = useMode();

  return (
    <Paper
      sx={{
        bgcolor: theme.paperBg,
        borderRadius: 2,
        p: 2,
        border: mode ? "1px solid #e0e0e0" : "none",
      }}
      elevation={mode ? 0 : 0}
    >
      <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
        <Avatar
          src={channelInfo.avatar}
          sx={{
            width: 40,
            height: 40,
          }}
        />

        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" sx={{ color: theme.text, fontWeight: 600 }}>
            {channelInfo.fullname}
            <Typography
              component={"span"}
              variant="body2"
              color="textSecondary"
            >
              &nbsp;@{channelInfo.username}
            </Typography>
          </Typography>
          <Typography variant="subtitle1" sx={{ color: theme.textSecondary }}>
            {channelInfo.subscriberCount} subscribers
          </Typography>
        </Box>
        <Button
          variant="contained"
          sx={{
            bgcolor: theme.subscribeBg,
            color: theme.subscribeText,
            borderRadius: 5,
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            "&:hover": { bgcolor: theme.subscribeBgHover },
          }}
        >
          Subscribe
        </Button>
      </Stack>

      <Typography
        variant="body2"
        sx={{
          color: theme.text,
          whiteSpace: "pre-wrap",
          lineHeight: 1.6,
        }}
      >
        {data.description}
      </Typography>

      {!data.isPublished && (
        <Chip
          label="Unlisted"
          size="small"
          sx={{
            bgcolor: theme.hoverBg,
            color: theme.text,
            mt: 2,
            border: mode ? "1px solid #e0e0e0" : "none",
          }}
        />
      )}
    </Paper>
  );
};

export default VideoChannelAndDescription;

type VideoChannelAndDescriptionProps = {
  theme: {
    paperBg: string;
    text: string;
    textSecondary: string;
    subscribeBg: string;
    subscribeText: string;
    subscribeBgHover: string;
    hoverBg: string;
  };
  data: SingleVideoType;
  channelInfo: UserChannel;
};
interface UserChannel {
  _id: string;
  username: string;
  email: string;
  fullname: string;
  avatar: string;
  coverImage: string;
  subscriberCount: number;
  channelSubscribedToCount: number;
  isSubscribed: boolean;
}
