import type { FC } from "react";
import type { Playlist } from "../../hooks/data-fetching/useFetchUserPlaylist";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const SinglePlaylist: FC<PropTypes> = ({ playlist }) => {
  const navigate = useNavigate();
  const videoCount = playlist.videos?.length || 0;
  const firstVideoThumbnail = playlist.videos?.[0]?.thumbnail || "";
  const hasVideos = videoCount > 0;

  const onClick = () => {
    navigate(`/playlists/${playlist._id}`);
  };

  return (
    <PlaylistCard onClick={onClick}>
      {/* Thumbnail Section with Overlay */}
      <ThumbnailContainer>
        {hasVideos ? (
          <ThumbnailImage src={firstVideoThumbnail} alt={playlist.name} />
        ) : (
          <EmptyThumbnail>
            <PlaylistPlayIcon sx={{ fontSize: 80, opacity: 0.3 }} />
          </EmptyThumbnail>
        )}

        {/* Gradient Overlay */}
        <GradientOverlay />

        {/* Video Count Badge */}
        <VideoCountBadge>
          <PlaylistPlayIcon sx={{ fontSize: 20, mr: 0.5 }} />
          <Typography variant="body2" fontWeight={600}>
            {videoCount} {videoCount === 1 ? "video" : "videos"}
          </Typography>
        </VideoCountBadge>
      </ThumbnailContainer>

      {/* Content Section */}
      <ContentSection>
        <Stack spacing={1}>
          {/* Title */}
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{
              ...responsiveText,
              lineHeight: 1.3,
            }}
          >
            {playlist.name}
          </Typography>

          {/* Description */}
          {playlist.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ...responsiveText, lineHeight: 1.5 }}
            >
              {playlist.description}
            </Typography>
          )}

          {/* Metadata */}
          <Typography variant="caption" color="text.secondary">
            {hasVideos ? "View full playlist" : "No videos yet"}
          </Typography>
        </Stack>
      </ContentSection>
    </PlaylistCard>
  );
};

export default SinglePlaylist;

type PropTypes = {
  playlist: Playlist;
};

// Styled Components
const PlaylistCard = styled(Box)(({ theme }) => ({
  position: "relative",
  borderRadius: 12,
  overflow: "hidden",
  backgroundColor: theme.palette.mode === "dark" ? "#1a1a1a" : "#ffffff",
  border: `1px solid ${theme.palette.mode === "dark" ? "#2a2a2a" : "#e0e0e0"}`,
  cursor: "pointer",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  height: "100%",
  display: "flex",
  flexDirection: "column",

  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow:
      theme.palette.mode === "dark"
        ? "0 12px 40px rgba(0, 0, 0, 0.5)"
        : "0 12px 40px rgba(0, 0, 0, 0.15)",
    borderColor: theme.palette.primary.main,

    "& .thumbnail-image": {
      transform: "scale(1.05)",
    },

    "& .gradient-overlay": {
      opacity: 0.7,
    },
  },
}));

const ThumbnailContainer = styled(Box)({
  position: "relative",
  width: "100%",
  paddingTop: "56.25%", // 16:9 aspect ratio
  overflow: "hidden",
  backgroundColor: "#000",
});

const ThumbnailImage = styled("img")({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
  transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  className: "thumbnail-image",
});

const EmptyThumbnail = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: theme.palette.mode === "dark" ? "#2a2a2a" : "#f5f5f5",
  color: theme.palette.text.secondary,
}));

const GradientOverlay = styled(Box)({
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: "50%",
  background: "linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)",
  opacity: 0.5,
  transition: "opacity 0.3s ease",
  className: "gradient-overlay",
});

const VideoCountBadge = styled(Box)({
  position: "absolute",
  bottom: 12,
  right: 12,
  display: "flex",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.85)",
  backdropFilter: "blur(8px)",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: 6,
  fontSize: "0.875rem",
  fontWeight: 600,
  zIndex: 2,
  border: "1px solid rgba(255, 255, 255, 0.1)",
});

const ContentSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  flex: 1,
  display: "flex",
  flexDirection: "column",
}));
const responsiveText = {
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
};
