import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ShuffleIcon from "@mui/icons-material/Shuffle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import { styled, useTheme } from "@mui/material/styles";
import type {
  PlaylistWithVideos,
  PlaylistVideo,
} from "../../hooks/CRUD-hooks/useGetSinglePlaylist";

const ShowPlaylistHeader: React.FC<ShowPlaylistHeaderProps> = ({
  playlist,
  videos,
  isOwner,
}) => {
  const theme = useTheme();
  const playlistThumbnail = videos.length > 0 ? videos[0].thumbnail : "";

  return (
    <Box sx={sidebarContainerSx}>
      <PlaylistCoverBox>
        {playlistThumbnail ? (
          <img
            src={playlistThumbnail}
            alt={playlist.name}
            style={thumbnailImgStyle}
          />
        ) : (
          <Box sx={emptyThumbnailSx}>
            <PlaylistPlayIcon sx={playlistPlayIconSx} />
          </Box>
        )}

        <Box sx={overlayGradientSx} />
      </PlaylistCoverBox>

      <Stack spacing={2} sx={{ px: { xs: 1, md: 0 } }}>
        <Typography variant="h4" fontWeight={700} sx={{ lineHeight: 1.2 }}>
          {playlist.name}
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="body2" fontWeight={500} color="primary">
            {playlist?.owner?.fullname}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • {videos.length} videos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            • Updated {new Date().toLocaleDateString()}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            startIcon={<PlayArrowIcon />}
            fullWidth
            sx={playAllBtnSx}
          >
            Play all
          </Button>
          <Button
            variant="outlined"
            startIcon={<ShuffleIcon />}
            fullWidth
            sx={{
              ...shuffleBtnSx,
              color: theme.palette.text.primary,
              "&:hover": {
                ...shuffleBtnSx["&:hover"],
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
            disabled
          >
            Shuffle
          </Button>
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ whiteSpace: "pre-wrap" }}
        >
          {playlist.description}
        </Typography>

        {isOwner && (
          <Box sx={managePlaylistContainerSx}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ mb: 1, display: "block" }}
            >
              Manage Playlist
            </Typography>
            <Stack direction="row" spacing={1}>
              <Button
                size="small"
                startIcon={<EditIcon />}
                variant="text"
                color="inherit"
                sx={crudBtnSx}
              >
                Edit
              </Button>
              <Button
                size="small"
                startIcon={<DeleteIcon />}
                variant="text"
                color="error"
                sx={crudBtnSx}
              >
                Delete
              </Button>
            </Stack>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default ShowPlaylistHeader;

// Styled Components
const PlaylistCoverBox = styled(Box)(({ theme }) => ({
  position: "relative",
  width: "100%",
  aspectRatio: "16/9",
  borderRadius: 16,
  overflow: "hidden",
  background:
    "linear-gradient(135deg, rgba(80,80,80,1) 0%, rgba(30,30,30,1) 100%)",
  boxShadow: theme.shadows[10],
}));

// Static Styles
const sidebarContainerSx = {
  width: { xs: "100%", md: "360px" },
  flexShrink: 0,
  display: "flex",
  flexDirection: "column",
  gap: 2,
  position: { md: "sticky" },
  top: { md: "84px" },
  height: { md: "calc(100vh - 100px)" },
};

const thumbnailImgStyle: React.CSSProperties = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const emptyThumbnailSx = {
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  bgcolor: "action.hover",
};

const playlistPlayIconSx = {
  fontSize: 80,
  opacity: 0.5,
};

const overlayGradientSx = {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  height: "60%",
  background: "linear-gradient(to top, rgba(0,0,0,0.8), transparent)",
};

const playAllBtnSx = {
  borderRadius: 8,
  textTransform: "none",
  py: 1,
  backgroundColor: "white",
  color: "black",
  "&:hover": { backgroundColor: "#f0f0f0" },
};

const shuffleBtnSx = {
  borderRadius: 8,
  textTransform: "none",
  py: 1,
  borderColor: "rgba(255,255,255,0.2)",
  "&:hover": {
    borderColor: "rgba(255,255,255,0.4)",
  },
};

const managePlaylistContainerSx = {
  pt: 2,
  borderTop: "1px solid rgba(255,255,255,0.1)",
};

const crudBtnSx = {
  textTransform: "none",
};

interface ShowPlaylistHeaderProps {
  playlist: PlaylistWithVideos;
  videos: PlaylistVideo[];
  isOwner: boolean;
}
