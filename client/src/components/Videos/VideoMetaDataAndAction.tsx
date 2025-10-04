import React from "react";
import useMode from "../../hooks/useMode";
import {
  Typography,
  Paper,
  Chip,
  Stack,
  IconButton,
  Divider,
  Button,
} from "@mui/material";
import {
  ThumbUpOutlined,
  ThumbDownOutlined,
  ShareOutlined,
  MoreHoriz,
  Visibility,
} from "@mui/icons-material";
import type { SingleVideoType } from "../../hooks/data-fetching/useFetchSingleVideo";

const VideoMetaDataAndAction: React.FC<VideoMetaDataAndActionProps> = ({
  theme,
  formatViews,
  formatDate,
  formatDuration,
  data,
}) => {
  const mode = useMode();
  if (!data) return null;
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      spacing={2}
      sx={{ mb: 2 }}
    >
      {/* Views and Date */}
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
        <Visibility sx={{ color: theme.textSecondary, fontSize: 20 }} />
        <Typography variant="body2" sx={{ color: theme.textSecondary }}>
          {formatViews(data?.views)} views
        </Typography>
        <Typography variant="body2" sx={{ color: theme.textSecondary }}>
          •
        </Typography>
        <Typography variant="body2" sx={{ color: theme.textSecondary }}>
          {formatDate(data.createdAt)}
        </Typography>
        <Chip
          label={formatDuration(data.duration)}
          size="small"
          sx={{
            bgcolor: theme.chipBg,
            color: theme.text,
            fontSize: "0.75rem",
            height: 24,
            border: mode ? "1px solid #e0e0e0" : "none",
          }}
        />
      </Stack>

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
          >
            <ThumbUpOutlined sx={{ fontSize: 20 }} />
            <Typography variant="body2" sx={{ ml: 1 }}>
              Like
            </Typography>
          </IconButton>
          <Divider
            orientation="vertical"
            flexItem
            sx={{ bgcolor: theme.divider }}
          />
          <IconButton
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
};

type VideoMetaDataAndActionProps = {
  theme: ThemeType;
  formatViews: (views: number) => string;
  formatDate: (dateString: string) => string;
  formatDuration: (duration: number) => string;
  data: SingleVideoType;
};
