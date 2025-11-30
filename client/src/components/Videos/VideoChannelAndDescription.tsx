import React from "react";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import useMode from "../../hooks/useMode";
import type { SingleVideoType } from "../../hooks/data-fetching/useFetchSingleVideo";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Visibility from "@mui/icons-material/Visibility";
import {
  formatDate,
  formatViews,
  formatDuration,
} from "../../utilities/helperFncForStats";

const VideoChannelAndDescription: React.FC<VideoChannelAndDescriptionProps> = ({
  theme,
  data,
}) => {
  const mode = useMode();
  const [isExpanded, setIsExpanded] = React.useState(false);

  return (
    <Paper
      sx={{
        bgcolor: theme.paperBg,
        borderRadius: 2,
        p: 2,
        border: mode ? "1px solid #e0e0e0" : "none",
        cursor: "pointer",
        transition: "background-color 0.2s",
        // "&:hover": {
        //   bgcolor: mode ? "#f5f5f5" : "#272727",
        // },
      }}
      elevation={mode ? 0 : 0}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        flexWrap="wrap"
        mb={1}
      >
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
          label={`${formatDuration(data.duration)} min`}
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

      <Box sx={{ position: "relative" }}>
        <Collapse in={isExpanded} collapsedSize={40}>
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
        </Collapse>
        {!isExpanded && (
          <Typography
            variant="body2"
            sx={{
              color: theme.text,
              fontWeight: 600,
              mt: 1,
              cursor: "pointer",
            }}
          >
            ...more
          </Typography>
        )}
        {isExpanded && (
          <Typography
            variant="body2"
            sx={{
              color: theme.text,
              fontWeight: 600,
              mt: 1,
              cursor: "pointer",
            }}
          >
            Show less
          </Typography>
        )}
      </Box>

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
};
