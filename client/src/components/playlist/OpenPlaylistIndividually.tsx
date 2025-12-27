import { useParams } from "react-router-dom";
import useGetSinglePlaylist from "../../hooks/CRUD-hooks/useGetSinglePlaylist";

const OpenPlaylistIndividually = () => {
  const { playlistId } = useParams();
  const { data } = useGetSinglePlaylist(playlistId || "");
  console.log(data);

  return <div>OpenPlaylistIndividually</div>;
};

export default OpenPlaylistIndividually;
