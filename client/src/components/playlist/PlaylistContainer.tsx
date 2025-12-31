import Typography from "@mui/material/Typography";
import SinglePlaylist from "./SinglePlaylist";
import Box from "@mui/material/Box";
import CircularProgressCenter from "../ui-components/CircularProgressCenter";
import type { PlaylistData } from "../../hooks/data-fetching/useFetchUserPlaylist";

const PlaylistContainer = ({ isError, isLoading, data }: PropTypes) => {
  if (isError)
    return <Typography color="error">...Encountered Error</Typography>;
  if (isLoading) return <CircularProgressCenter size={20} />;
  if (!data || data?.length === 0)
    return <Typography color="textSecondary">No Playlists</Typography>;

  const renderPlaylist = data.playlists.map((playlist) => (
    <SinglePlaylist key={playlist._id} playlist={playlist} />
  ));
  return (
    <>
      <Typography color="textSecondary" pb={1} fontSize={13}>
        Total Playlists: {data?.length}
      </Typography>
      <Box sx={{ ...gridPlaylistContainer }}>{renderPlaylist}</Box>
    </>
  );
};

export default PlaylistContainer;
const gridPlaylistContainer = {
  display: "grid",
  gridTemplateColumns: {
    xs: "repeat(1, 1fr)",
    sm: "repeat(2, 1fr)",
    md: "repeat(4, 1fr)",
    lg: "repeat(5, 1fr)",
  },
  gap: 2,
};

interface PropTypes {
  isError: boolean;
  isLoading: boolean;
  data: PlaylistData;
}
