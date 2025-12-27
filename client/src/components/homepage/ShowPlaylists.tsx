import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useFetchUserPlaylist from "../../hooks/data-fetching/useFetchUserPlaylist";
import CircularProgressCenter from "../ui-components/CircularProgressCenter";
import { useOutletContext } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import SinglePlaylist from "../playlist/SinglePlaylist";
import { Container } from "@mui/material";

const ShowPlaylists = () => {
  const outletContext = useOutletContext<OutletContextType | undefined>();
  const { user } = useAuth();

  const effectiveUserId = outletContext?.userId ?? user?.user?._id ?? "";

  const { data, isLoading, isError } = useFetchUserPlaylist(effectiveUserId);

  if (isError) return <div>...Encountered Error</div>;
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

export default ShowPlaylists;

type OutletContextType = {
  userId: string;
};
