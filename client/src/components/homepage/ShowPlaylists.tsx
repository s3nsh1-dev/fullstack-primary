import Typography from "@mui/material/Typography";
import useFetchUserPlaylist from "../../hooks/data-fetching/useFetchUserPlaylist";
import CircularProgressCenter from "../ui-components/CircularProgressCenter";
import { useOutletContext } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import PlaylistContainer from "../playlist/PlaylistContainer";

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
    <PlaylistContainer data={data} isLoading={isLoading} isError={isError} />
  );
};

export default ShowPlaylists;

type OutletContextType = {
  userId: string;
};
