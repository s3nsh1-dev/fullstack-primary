import NotLoggedIn from "./NotLoggedIn";
import useAuth from "../hooks/useAuth";
import useFetchUserPlaylist from "../hooks/data-fetching/useFetchUserPlaylist";
import Typography from "@mui/material/Typography";

const Playlist = () => {
  const { user, loading } = useAuth();

  const { data, isLoading, isError } = useFetchUserPlaylist(
    user?.user?._id || ""
  );

  if (isError) return <div>...Encountered Error</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!data || data.playlists?.length === 0)
    return <Typography color="textSecondary">No Playlists</Typography>;
  if (!user && !loading) return <NotLoggedIn />;

  return <div>Playlist</div>;
};

export default Playlist;
