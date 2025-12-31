import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import useDeletePlaylist from "../../hooks/CRUD-hooks/useDeletePlaylist";
import { useNavigate, useLocation } from "react-router-dom";

interface DeletePlaylistModalProps {
  handleClose: () => void;
  playlistId: string;
  playlistName: string;
}

const DeletePlaylistModal = ({
  handleClose,
  playlistId,
  playlistName,
}: DeletePlaylistModalProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate, isPending } = useDeletePlaylist();

  const handleDelete = () => {
    mutate(
      { playlistId },
      {
        onSuccess: () => {
          handleClose();
          if (location.pathname.includes(playlistId)) {
            navigate("/playlists");
          }
        },
      }
    );
  };

  return (
    <Box sx={style}>
      <Typography variant="h6" component="h2" mb={2}>
        Delete Playlist
      </Typography>
      <Typography variant="body1" mb={3}>
        Are you sure you want to delete <strong>{playlistName}</strong>? This
        action cannot be undone.
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button variant="outlined" onClick={handleClose} disabled={isPending}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={handleDelete}
          disabled={isPending}
        >
          {isPending ? "Deleting..." : "Delete"}
        </Button>
      </Stack>
    </Box>
  );
};

export default DeletePlaylistModal;

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
} as const;
