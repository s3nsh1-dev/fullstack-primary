import NotLoggedIn from "./NotLoggedIn";
import useAuth from "../hooks/useAuth";
import useFetchUserPlaylist from "../hooks/data-fetching/useFetchUserPlaylist";
import Typography from "@mui/material/Typography";
import SinglePlaylist from "../components/playlist/SinglePlaylist";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import CircularProgressCenter from "../components/ui-components/CircularProgressCenter";

const Playlist = () => {
  const { user, loading } = useAuth();

  const { data, isLoading, isError } = useFetchUserPlaylist(
    user?.user?._id || ""
  );

  if (!user && !loading) return <NotLoggedIn />;

  if (isError)
    return <Typography color="error">...Encountered Error</Typography>;
  if (isLoading) return <CircularProgressCenter size={20} />;
  if (!data || data.playlists?.length === 0)
    return <Typography color="textSecondary">No Playlists</Typography>;

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
      <Box sx={gridPlaylistContainer}>
        {data.playlists.map((playlist) => (
          <SinglePlaylist key={playlist._id} playlist={playlist} />
        ))}
      </Box>
    </Container>
  );
};

export default Playlist;

const gridPlaylistContainer = {
  display: "grid",
  gridTemplateColumns: {
    xs: "repeat(1, 1fr)",
    sm: "repeat(2, 1fr)",
    md: "repeat(3, 1fr)",
    lg: "repeat(4, 1fr)",
  },
  gap: 3,
};
