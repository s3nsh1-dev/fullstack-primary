import type { PlaylistType } from "../../constants/dataTypes";

const ShowPlaylists = ({ playlists }: { playlists: PlaylistType[] }) => {
  console.log("playlists", playlists);
  return <div>Show user Playlists</div>;
};

export default ShowPlaylists;
