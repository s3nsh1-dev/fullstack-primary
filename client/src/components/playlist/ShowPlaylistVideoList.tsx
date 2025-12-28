import type { FC, CSSProperties } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTheme } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";
import {
  formatCount,
  formatDuration,
  formatDate,
} from "../../utilities/helperFncForStats";
import type { PlaylistVideo } from "../../hooks/CRUD-hooks/useGetSinglePlaylist";

const ShowPlaylistVideoList: FC<PropTypes> = ({ videos }) => {
  if (!videos || videos.length === 0) {
    return <Typography color="textSecondary">No Videos to show</Typography>;
  }
  const renderVideoItem = videos.map((video, index) => (
    <VideoItem key={video._id || index} index={index + 1} video={video} />
  ));

  return (
    <Box sx={videoListContainerSx}>
      <Stack spacing={1}>{renderVideoItem}</Stack>
    </Box>
  );
};

const VideoItem: FC<VideoItemProps> = ({ video, index }) => {
  console.log(video);
  const theme = useTheme();

  return (
    <Box
      sx={{
        ...videoItemSx(theme),
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
        <Box>
          <Typography
            variant="subtitle1"
            fontWeight={600}
            noWrap
            sx={videoTitleSx}
          >
            {video.title}
          </Typography>

          <Typography
            variant="caption"
            color="text.secondary"
            sx={videoDescriptionSx}
          >
            {video.description}
          </Typography>
        </Box>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1 }}>
          <Avatar
            src={video.owner.avatar}
            alt={video.owner.fullname}
            sx={{ width: 24, height: 24 }}
          />
          <Typography variant="body2" color="text.secondary" noWrap>
            {video?.owner?.fullname}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • {formatCount(video.views)} views
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • {formatDate(video.updatedAt)}
          </Typography>
        </Stack>
      </Box>

      <IconButton className="more-btn" sx={moreBtnSx} size="small">
        <MoreVertIcon />
      </IconButton>
    </Box>
  );
};

export default ShowPlaylistVideoList;

const videoListContainerSx = {
  flex: 1,
  minWidth: 0,
};

const videoItemSx = (theme: Theme) => ({
  display: "flex",
  gap: 2,
  p: 1.5,
  mb: 1,
  borderRadius: "12px",
  cursor: "pointer",
  alignItems: "stretch", // Ensure children stretch to full height
  border: `1px solid ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.paper,
  transition: "all 0.2s ease-in-out",
  "&:hover": {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
    transform: "translateY(-2px)",
    boxShadow: theme.shadows[2],
    "& .more-btn": { opacity: 1 },
  },
});

const videoIndexSx = {
  display: "flex",
  alignItems: "center",
  minWidth: "24px",
  alignSelf: "center", // Keep index centered vertically relative to row height roughly, or remove for top align
};

const videoThumbnailContainerSx = {
  position: "relative",
  width: "180px", // Slightly wider for better presence
  minWidth: "180px",
  borderRadius: "8px",
  overflow: "hidden",
  flexShrink: 0,
  // Let the height be determined by the flex stretch
};

const thumbnailImgStyle: CSSProperties = {
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
  justifyContent: "space-between",
};

const videoTitleSx = {
  lineHeight: 1.2,
  mb: 0.5,
};

const videoDescriptionSx = {
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  mt: 0.5,
};

const moreBtnSx = {
  opacity: 0,
  alignSelf: "flex-start", // align more button to top
  mt: 1,
};

interface PropTypes {
  videos: PlaylistVideo[];
}

interface VideoItemProps {
  video: PlaylistVideo;
  index: number;
}
