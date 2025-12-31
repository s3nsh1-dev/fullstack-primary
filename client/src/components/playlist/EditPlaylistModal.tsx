import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import useUpdatePlaylist from "../../hooks/CRUD-hooks/useUpdatePlaylist";

interface EditPlaylistModalProps {
  handleClose: () => void;
  playlistId: string;
  existingName: string;
  existingDescription: string;
}

const EditPlaylistModal = ({
  handleClose,
  playlistId,
  existingName,
  existingDescription,
}: EditPlaylistModalProps) => {
  const [name, setName] = useState(existingName);
  const [description, setDescription] = useState(existingDescription);

  // Sync state if props change (optional transparency if modal re-opens with different props)
  useEffect(() => {
    setName(existingName);
    setDescription(existingDescription);
  }, [existingName, existingDescription]);

  const { mutate, isPending } = useUpdatePlaylist();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    mutate(
      { playlistId, name, description },
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
        Edit Playlist
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="outlined"
              color="error"
              onClick={handleClose}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isPending}
            >
              {isPending ? "Updating..." : "Update"}
            </Button>
          </Stack>
        </Stack>
      </form>
    </Box>
  );
};

export default EditPlaylistModal;

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
