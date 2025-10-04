import React from "react";
import { Typography, Paper, Chip, Stack } from "@mui/material";
import useMode from "../../hooks/useMode";
import type { SingleVideoType } from "../../hooks/data-fetching/useFetchSingleVideo";
import { Visibility } from "@mui/icons-material";

const VideoChannelAndDescription: React.FC<VideoChannelAndDescriptionProps> = ({
  theme,
  data,
  formatViews,
  formatDate,
  formatDuration,
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
    chipBg: string;
  };
  data: SingleVideoType;
  formatViews: (views: number) => string;
  formatDate: (dateString: string) => string;
  formatDuration: (duration: number) => string;
};
