import { useState } from "react";
import NotLoggedIn from "./NotLoggedIn";
import useAuth from "../hooks/useAuth";
import useFetchUserPlaylist from "../hooks/data-fetching/useFetchUserPlaylist";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgressCenter from "../components/ui-components/CircularProgressCenter";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import PlaylistPlayIcon from "@mui/icons-material/PlaylistPlay";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { DividerRoot } from "../components/ui-components/StyledComponents";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";
import PlaylistContainer from "../components/playlist/PlaylistContainer";
import CreatePlaylistModal from "../components/playlist/CreatePlaylistModal";
import Modal from "@mui/material/Modal";
import { useSearchParams } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

const Playlist = () => {
  const { user, loading } = useAuth();
  const [openModal, setOpenModal] = useState<boolean>(false);

  const handleOpenModal = () => setOpenModal((prev) => !prev);
  const handleCloseModal = () => setOpenModal(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get("page") || 1;

  const { data, isLoading, isError } = useFetchUserPlaylist({
    userId: user?.user?._id || "",
    limit: LIMIT,
    page: Number(currentPage),
  });

  const handlePagination = (value: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", value.toString());
    setSearchParams(newParams);
  };

  if (!data || data?.length === 0)
    return <Typography color="textSecondary">No Playlists</Typography>;

  if (!user && !loading) return <NotLoggedIn />;

  return (
    <>
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

        {isError && <Typography color="error">...Encountered Error</Typography>}
        {isLoading && <CircularProgressCenter size={20} />}
        {!isLoading && !isError && (!data || data.playlists?.length === 0) && (
          <Typography color="textSecondary">No Playlists</Typography>
        )}

        {!isLoading && !isError && data && data.playlists?.length > 0 && (
          <PlaylistContainer
            data={data}
            isLoading={isLoading}
            isError={isError}
          />
        )}
      </Box>
      {openModal && (
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="form-modal"
          aria-describedby="modal-to-display-playlist-panel"
        >
          <CreatePlaylistModal handleClose={handleCloseModal} />
        </Modal>
      )}
      <Stack alignItems={"center"} pt={2}>
        <Pagination
          variant="outlined"
          shape="rounded"
          color="secondary"
          count={data.totalPages}
          page={data.currentPage}
          onChange={(_, value) => handlePagination(value)}
          showFirstButton
          showLastButton
        />
      </Stack>
    </>
  );
};

export default Playlist;

const sxValue = {
  display: "flex",
  alignItems: "center",
  gap: 1,
};

const LIMIT = 10;
