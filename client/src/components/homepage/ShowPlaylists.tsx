import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useFetchUserPlaylist from "../../hooks/data-fetching/useFetchUserPlaylist";
import CircularProgressCenter from "../ui-components/CircularProgressCenter";
import { useOutletContext } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import SinglePlaylist from "../playlist/SinglePlaylist";

const ShowPlaylists = () => {
  const outletContext = useOutletContext<OutletContextType | undefined>();
  const { user } = useAuth();
  const effectiveUserId = outletContext?.userId ?? user?.user?._id ?? "";

  const { data, isLoading, isError } = useFetchUserPlaylist(effectiveUserId);

  if (isError) return <div>...Encountered Error</div>;
  if (isLoading) return <CircularProgressCenter size={20} />;
  if (!data || data.playlists?.length === 0)
    return <Typography color="textSecondary">No Playlists</Typography>;

  const renderPlaylist = data.playlists.map((playlist) => (
    <SinglePlaylist key={playlist._id} playlist={playlist} />
  ));

  return (
    <Box>
      <Typography color="textSecondary" pb={1} fontSize={13}>
        Total Playlists: {data?.playlists?.length}
      </Typography>
      <Box sx={{ ...gridPlaylistContainer }}>{renderPlaylist}</Box>
    </Box>
  );
};

export default ShowPlaylists;

type OutletContextType = {
  userId: string;
};

const gridPlaylistContainer = {
  display: "grid",
  gridTemplateColumns: {
    xs: "repeat(1, 1fr)",
    sm: "repeat(2, 1fr)",
    md: "repeat(3, 1fr)",
    lg: "repeat(4, 1fr)",
  },
  gap: 2,
};
