import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTheme } from "@mui/material/styles";
import convertISOIntoLocalTime from "../../utilities/convertISOIntoLocalTime";
import type { PlaylistVideo } from "../../hooks/CRUD-hooks/useGetSinglePlaylist";

const ShowPlaylistVideoList: React.FC<ShowPlaylistVideoListProps> = ({
  videos,
}) => {
  return (
    <Box sx={videoListContainerSx}>
      {videos.length === 0 ? (
        <Box sx={emptyVideosSx}>
          <Typography variant="body1" color="text.secondary">
            This playlist has no videos.
          </Typography>
        </Box>
      ) : (
        <Stack spacing={1}>
          {videos.map((video, index) => (
            <VideoItem
              key={video._id || index}
              index={index + 1}
              video={video}
            />
          ))}
        </Stack>
      )}
    </Box>
  );
};

const VideoItem = ({
  video,
  index,
}: {
  video: PlaylistVideo;
  index: number;
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        ...videoItemSx,
        "&:hover": {
          backgroundColor: theme.palette.action.hover,
          "& .more-btn": { opacity: 1 },
        },
      }}
    >
      <Typography variant="body2" color="text.secondary" sx={videoIndexSx}>
        {index}
      </Typography>

      <Box sx={videoThumbnailContainerSx}>
        <img
          src={video.thumbnail}
          alt={video.title}
          style={thumbnailImgStyle}
        />
        <Box sx={videoDurationSx}>{formatDuration(video.duration)}</Box>
      </Box>

      <Box sx={videoInfoSx}>
        <Typography
          variant="subtitle1"
          fontWeight={600}
          noWrap
          sx={videoTitleSx}
        >
          {video.title}
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" color="text.secondary" noWrap>
            {video?.owner?.fullname}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • {video.views} views
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • {convertISOIntoLocalTime(video.createdAt)}
          </Typography>
        </Stack>
      </Box>

      <IconButton className="more-btn" sx={moreBtnSx} size="small">
        <MoreVertIcon />
      </IconButton>
    </Box>
  );
};

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
};

export default ShowPlaylistVideoList;

// Static Styles
const videoListContainerSx = {
  flex: 1,
  minWidth: 0,
};

const emptyVideosSx = {
  textAlign: "center",
  py: 10,
};

const videoItemSx = {
  display: "flex",
  gap: 2,
  p: 1,
  borderRadius: 3,
  cursor: "pointer",
};

const videoIndexSx = {
  display: "flex",
  alignItems: "center",
  minWidth: "24px",
};

const videoThumbnailContainerSx = {
  position: "relative",
  width: "160px",
  minWidth: "160px",
  height: "90px",
  borderRadius: 2,
  overflow: "hidden",
};

const thumbnailImgStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const videoDurationSx = {
  position: "absolute",
  bottom: 4,
  right: 4,
  bgcolor: "rgba(0,0,0,0.8)",
  color: "white",
  fontSize: "0.75rem",
  padding: "2px 4px",
  borderRadius: 1,
};

const videoInfoSx = {
  flex: 1,
  minWidth: 0,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
};

const videoTitleSx = {
  lineHeight: 1.2,
  mb: 0.5,
};

const moreBtnSx = {
  opacity: 0,
  alignSelf: "center",
};

interface ShowPlaylistVideoListProps {
  videos: PlaylistVideo[];
}
