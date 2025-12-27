import NotLoggedIn from "./NotLoggedIn";
import useAuth from "../hooks/useAuth";
import useFetchUserPlaylist from "../hooks/data-fetching/useFetchUserPlaylist";
import Typography from "@mui/material/Typography";
import SinglePlaylist from "../components/playlist/SinglePlaylist";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";

const Playlist = () => {
  const { user, loading } = useAuth();

  const { data, isLoading, isError } = useFetchUserPlaylist(
    user?.user?._id || ""
  );

  console.log(data);

  if (!user && !loading) return <NotLoggedIn />;

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" color="error" align="center">
          Error loading playlists. Please try again later.
        </Typography>
      </Container>
    );
  }

  if (!data || data.playlists?.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={2} alignItems="center">
          <Typography variant="h5" color="textSecondary">
            No Playlists Yet
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Create your first playlist to organize your videos
          </Typography>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Page Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Your Playlists
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {data.playlists.length}{" "}
          {data.playlists.length === 1 ? "playlist" : "playlists"}
        </Typography>
      </Box>

      {/* Playlists Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(1, 1fr)",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 3,
        }}
      >
        {data.playlists.map((playlist) => (
          <SinglePlaylist key={playlist._id} playlist={playlist} />
        ))}
      </Box>
    </Container>
  );
};

export default Playlist;
