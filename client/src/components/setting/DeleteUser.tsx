import { useState } from "react";
import Button from "@mui/material/Button";
import BasicModal from "../ui-components/BasicModal";

const DeleteUser = () => {
  const [open, setOpen] = useState<boolean>(false);
  const handleToggle = () => setOpen((prev) => !prev);

  return (
    <>
      <Button
        variant="contained"
        color="error"
        fullWidth
        onClick={handleToggle}
      >
        Delete Account
      </Button>

      {open && (
        <BasicModal open={open} onClose={() => setOpen(false)}>
          This is warning before deactivating accounts
        </BasicModal>
      )}
    </>
  );
};

export default DeleteUser;
