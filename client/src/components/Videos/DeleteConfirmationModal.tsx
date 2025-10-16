import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import useDeleteVideo from "../../hooks/data-fetching/useDeleteVideo";

const DeleteConfirmationModal: React.FC<PropType> = ({
  onClose,
  open,
  videoId,
}) => {
  const { mutate: deleteVideo } = useDeleteVideo();
  const handleDeleteVideo = () => {
    deleteVideo(videoId, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Text in a modal
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography>
        <Button onClick={handleDeleteVideo}>Delete Video Permanently</Button>
      </Box>
    </Modal>
  );
};

export default DeleteConfirmationModal;

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
};
type PropType = {
  onClose: () => void;
  open: boolean;
  videoId: string;
};
