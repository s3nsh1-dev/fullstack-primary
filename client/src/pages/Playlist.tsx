import { useState } from "react";
import NotLoggedIn from "./NotLoggedIn";
import useAuth from "../hooks/useAuth";
import useFetchUserPlaylist from "../hooks/data-fetching/useFetchUserPlaylist";
import Typography from "@mui/material/Typography";
import SinglePlaylist from "../components/playlist/SinglePlaylist";
import Box from "@mui/material/Box";
import CircularProgressCenter from "../components/ui-components/CircularProgressCenter";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { DividerRoot } from "../components/ui-components/StyledComponents";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";

const Playlist = () => {
  const { user, loading } = useAuth();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleOpenModal = () => setOpenModal((prev) => !prev);

  const { data, isLoading, isError } = useFetchUserPlaylist(
    user?.user?._id || ""
  );

  if (!user && !loading) return <NotLoggedIn />;

  if (isError)
    return <Typography color="error">...Encountered Error</Typography>;
  if (isLoading) return <CircularProgressCenter size={20} />;
  if (!data || data.playlists?.length === 0)
    return <Typography color="textSecondary">No Playlists</Typography>;

  const renderPlaylist = data.playlists.map((playlist) => (
    <SinglePlaylist key={playlist._id} playlist={playlist} />
  ));

  return (
    <Box p={2}>
      <Box sx={sxValue}>
        <HomeTabTitles
          text="Playlist"
          icon={<PlaylistPlayIcon color="secondary" />}
        />
        <DividerRoot>
          <Divider textAlign="right">
            <Typography fontWeight={"bold"}>
              <IconButton onClick={handleOpenModal}>
                <AddCircleIcon fontSize="large" color="success" />
              </IconButton>
              Create
            </Typography>
          </Divider>
        </DividerRoot>
      </Box>
      <Typography color="textSecondary" pb={1} fontSize={13}>
        Total Playlists: {data?.playlists?.length}
      </Typography>
      <Box sx={{ ...gridPlaylistContainer }}>{renderPlaylist}</Box>
    </Box>
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
  gap: 2,
};

const sxValue = {
  display: "flex",
  alignItems: "center",
  gap: 1,
};
