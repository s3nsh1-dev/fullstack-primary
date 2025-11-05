import Button from "@mui/material/Button";
import BasicModal from "../ui-components/BasicModal";
import { useState } from "react";
import DeactivatePopup from "./DeactivatePopup";

const DeactivateUser = () => {
  const [open, setOpen] = useState<boolean>(false);
  const handleToggle = () => setOpen((prev) => !prev);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        variant="contained"
        color="warning"
        fullWidth
        onClick={handleToggle}
      >
        Deactivate Account
      </Button>
      {open && (
        <BasicModal open={open} onClose={handleClose}>
          <DeactivatePopup onClose={handleClose} />
        </BasicModal>
      )}
    </>
  );
};

export default DeactivateUser;
