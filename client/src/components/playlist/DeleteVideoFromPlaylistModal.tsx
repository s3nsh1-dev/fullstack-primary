import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import useDeleteVideoFromPlaylist from "../../hooks/CRUD-hooks/useDeleteVideoFromPlaylist";

interface DeleteVideoFromPlaylistModalProps {
  handleClose: () => void;
  playlistId: string;
  videoId: string;
  videoTitle: string;
}

const DeleteVideoFromPlaylistModal = ({
  handleClose,
  playlistId,
  videoId,
  videoTitle,
}: DeleteVideoFromPlaylistModalProps) => {
  const { mutate, isPending } = useDeleteVideoFromPlaylist();

  const handleDelete = () => {
    mutate(
      { playlistId, videoId },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
  };

  return (
    <Box sx={style}>
      <Typography variant="h6" component="h2" mb={2}>
        Remove Video from Playlist
      </Typography>
      <Typography variant="body1" mb={3}>
        Are you sure you want to remove <strong>{videoTitle}</strong> from this
        playlist?
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
          {isPending ? "Remove" : "Remove Video"}
        </Button>
      </Stack>
    </Box>
  );
};

export default DeleteVideoFromPlaylistModal;

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
