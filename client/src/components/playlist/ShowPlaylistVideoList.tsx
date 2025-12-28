import type { FC, CSSProperties } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import { useTheme } from "@mui/material/styles";
import type { Theme, SxProps } from "@mui/material/styles";
import {
  formatCount,
  formatDuration,
  formatDate,
} from "../../utilities/helperFncForStats";
import type { PlaylistVideo } from "../../hooks/CRUD-hooks/useGetSinglePlaylist";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useNavigate } from "react-router-dom";

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
  const theme = useTheme();
  const navigate = useNavigate();
  const isDesktop = useMediaQuery(theme.breakpoints.up(1070));

  const handleVideoClick = () => {
    navigate(`/videos/${video._id}`);
  };
  return (
    <Box
      sx={{
        ...videoItemSx(theme),
      }}
      onClick={handleVideoClick}
    >
      {isDesktop && (
        <Typography variant="body2" color="text.secondary" sx={videoIndexSx}>
          {index}
        </Typography>
      )}

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
          {useMediaQuery(theme.breakpoints.up(550)) && (
            <Typography variant="body2" color="text.secondary">
              • {formatDate(video.updatedAt)}
            </Typography>
          )}
        </Stack>
      </Box>
    </Box>
  );
};

export default ShowPlaylistVideoList;

const videoListContainerSx = {
  flex: 1,
  minWidth: 0,
};

const videoIndexSx = {
  display: "flex",
  alignItems: "center",
  minWidth: "24px",
  alignSelf: "center",
};

const videoThumbnailContainerSx = {
  position: "relative",
  width: "180px",
  minWidth: "180px",
  height: "101px", // 180 * 9/16
  borderRadius: "8px",
  overflow: "hidden",
  flexShrink: 0,
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

const videoItemSx = (theme: Theme): SxProps<Theme> => ({
  display: "flex",
  gap: 2,
  p: 1.5,
  mb: 1,
  borderRadius: "12px",
  cursor: "pointer",
  alignItems: "stretch",
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
  flexDirection: "row",
  [theme.breakpoints.down(550)]: {
    flexDirection: "column",
  },
});

interface PropTypes {
  videos: PlaylistVideo[];
}

interface VideoItemProps {
  video: PlaylistVideo;
  index: number;
}
