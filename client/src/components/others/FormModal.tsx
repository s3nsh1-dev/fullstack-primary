import { type FC } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useTheme } from "@mui/material";
import type { ChildrenProps } from "../../constants/genericTypes";

interface UpdatedProps extends ChildrenProps {
  open: boolean;
  toggleModal: () => void;
}

const FormModal: FC<UpdatedProps> = ({ children, open, toggleModal }) => {
  const theme = useTheme();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: 500,
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    [theme.breakpoints.down("sm")]: {
      width: "91vw",
    },
  };

  return (
    <Modal
      open={open}
      onClose={toggleModal}
      aria-labelledby="form-modal"
      aria-describedby="modal-to-display-custom-form"
    >
      <Box sx={style}>{children}</Box>
    </Modal>
  );
};

export default FormModal;
