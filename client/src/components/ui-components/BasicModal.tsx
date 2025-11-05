import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

export default function BasicModal({ open, onClose, children }: PropTypes) {
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>{children}</Box>
    </Modal>
  );
}

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

type PropTypes = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
};
