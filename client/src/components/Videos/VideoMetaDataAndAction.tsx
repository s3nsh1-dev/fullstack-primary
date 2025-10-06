import React from "react";
import useMode from "../../hooks/useMode";
import {
  Typography,
  Paper,
  Stack,
  IconButton,
  Divider,
  Button,
  Box,
} from "@mui/material";
import {
  ThumbUpOutlined,
  ThumbDownOutlined,
  ShareOutlined,
  MoreHoriz,
} from "@mui/icons-material";
import type { SingleVideoType } from "../../hooks/data-fetching/useFetchSingleVideo";
import ChannelProfileSubInfo from "./ChannelProfileSubInfo";
import useToggleLikeOnVideo from "../../hooks/data-fetching/useToggleLikeOnVideo";

const VideoMetaDataAndAction: React.FC<VideoMetaDataAndActionProps> = ({
  theme,
  data,
  channelInfo,
  isLikedByUser,
}) => {
  const mode = useMode();
  const [isLiked, setIsLiked] = React.useState(isLikedByUser);
  const { mutate: toggleLike } = useToggleLikeOnVideo();
  if (!data) return null;

  const handleToggleLike = () => {
    toggleLike(data._id, {
      onSuccess: (response) => {
        // Optimistically update UI
        if ("video" in response) {
          setIsLiked(true);
        } else {
          setIsLiked(false);
        }
      },
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <ChannelProfileSubInfo channelInfo={channelInfo} theme={theme} />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 2 }}
      >
        {/* Action Buttons */}
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Paper
            sx={{
              bgcolor: theme.paperBg,
              display: "flex",
              borderRadius: 5,
              overflow: "hidden",
              border: mode ? "1px solid #e0e0e0" : "none",
            }}
            elevation={mode ? 0 : 0}
          >
            <IconButton
              sx={{
                color: theme.text,
                borderRadius: 0,
                px: 2,
                "&:hover": { bgcolor: theme.hoverBg },
              }}
              onClick={handleToggleLike}
            >
              <ThumbUpOutlined
                sx={{ fontSize: 20 }}
                color={isLiked ? "primary" : "inherit"}
              />
              <Typography
                variant="body2"
                sx={{ ml: 1 }}
                color={isLiked ? "primary" : "inherit"}
              >
                Like
              </Typography>
            </IconButton>
            <Divider
              orientation="vertical"
              flexItem
              sx={{ bgcolor: theme.divider }}
            />
            <IconButton
              disabled
              sx={{
                color: theme.text,
                borderRadius: 0,
                px: 2,
                "&:hover": { bgcolor: theme.hoverBg },
              }}
            >
              <ThumbDownOutlined sx={{ fontSize: 20 }} />
            </IconButton>
          </Paper>

          <Button
            disabled
            startIcon={<ShareOutlined />}
            sx={{
              bgcolor: theme.paperBg,
              color: theme.text,
              borderRadius: 5,
              px: 2,
              textTransform: "none",
              border: mode ? "1px solid #e0e0e0" : "none",
              "&:hover": { bgcolor: theme.hoverBg },
            }}
          >
            Share
          </Button>

          <IconButton
            sx={{
              bgcolor: theme.paperBg,
              color: theme.text,
              border: mode ? "1px solid #e0e0e0" : "none",
              "&:hover": { bgcolor: theme.hoverBg },
            }}
          >
            <MoreHoriz />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default VideoMetaDataAndAction;

type ThemeType = {
  text: string;
  textSecondary: string;
  chipBg: string;
  paperBg: string;
  hoverBg: string;
  divider: string;
  subscribeBg: string;
  subscribeText: string;
  subscribeBgHover: string;
};

type VideoMetaDataAndActionProps = {
  theme: ThemeType;
  data: SingleVideoType;
  channelInfo: UserChannel;
  isLikedByUser: boolean;
};
type UserChannel = {
  _id: string;
  username: string;
  email: string;
  fullname: string;
  avatar: string;
  coverImage: string;
  subscriberCount: number;
  channelSubscribedToCount: number;
  isSubscribed: boolean;
};
