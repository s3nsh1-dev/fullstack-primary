import React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import useUpdateVideo from "../../hooks/data-fetching/useUpdateVideo";
const UpdateVideoModal: React.FC<PropType> = ({ open, onClose, video }) => {
  const { mutate: updateVideo } = useUpdateVideo();
  const handleUpdateVideo = () => {
    updateVideo(
      { videoId: video._id, updateContent: videoForm },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };
  const [videoForm, setVideoForm] = React.useState<FormData>(resetForm);
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
        <Button onClick={handleUpdateVideo}>Submit Updates</Button>
      </Box>
    </Modal>
  );
};

export default UpdateVideoModal;

const resetForm = {
  title: "",
  description: "",
  thumbnail: "",
};

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
  video: {
    _id: string;
    videoFile: string;
    thumbnail: string;
    title: string;
    description: string;
    duration: number;
    createdAt: string; // ISO date string
    isPublished: boolean;
    views: number;
    owner: string;
  };
};
