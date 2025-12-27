import { useParams } from "react-router-dom";
import useGetSinglePlaylist from "../../hooks/CRUD-hooks/useGetSinglePlaylist";
import useAuth from "../../hooks/useAuth";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import { useTheme } from "@mui/material/styles";
import ShowPlaylistHeader from "./ShowPlaylistHeader";
import ShowPlaylistVideoList from "./ShowPlaylistVideoList";

const OpenPlaylistIndividually = () => {
  const { playlistId } = useParams();
  const theme = useTheme();

  // Fetch playlist data
  const {
    data: playlist,
    isLoading,
    isError,
  } = useGetSinglePlaylist(playlistId || "");
  const { user } = useAuth();

  if (isLoading) {
    return (
      <Box sx={loadingBoxSx}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError || !playlist) {
    return (
      <Container sx={errorContainerSx}>
        <Typography variant="h5" color="error">
          Playlist not found or an error occurred.
        </Typography>
      </Container>
    );
  }

  const isOwner = user?.user?._id === playlist.owner._id;

  const videos = (playlist.videos as unknown as Video[]) || [];

  return (
    <Box
      sx={{
        ...pageContainerSx,
        backgroundColor: theme.palette.background.default,
      }}
    >
      <Box sx={contentWrapperSx}>
        {/* Left Sidebar - Playlist Info */}
        <ShowPlaylistHeader
          playlist={playlist}
          videos={videos}
          isOwner={isOwner}
        />

        {/* Right Content - Video List */}
        <ShowPlaylistVideoList videos={videos} />
      </Box>
    </Box>
  );
};

export default OpenPlaylistIndividually;

const loadingBoxSx = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "80vh",
};

const errorContainerSx = {
  py: 8,
  textAlign: "center",
};

const pageContainerSx = {
  minHeight: "calc(100vh - 64px)", // Adjust based on navbar height
  p: { xs: 2, md: 4 },
};

const contentWrapperSx = {
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  gap: { xs: 3, md: 4 },
  maxWidth: "1600px",
  mx: "auto",
};

interface Video {
  _id: string;
  owner: {
    _id: string;
    username: string;
    fullname: string;
    avatar: string;
  };
  videoFile: string;
  thumbnail: string;
  title: string;
  description: string;
  duration: number;
  views: number;
  isPublished: boolean;
  createdAt: string;
}
