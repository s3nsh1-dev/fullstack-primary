import Button from "@mui/material/Button";
import BasicModal from "../ui-components/BasicModal";
import DeleteUserPopup from "./DeleteUserPopup";
import { useState } from "react";

const DeleteUser = () => {
  const [open, setOpen] = useState<boolean>(false);
  const handleToggle = () => setOpen((prev) => !prev);
  const handleDelete = () => setOpen(false);

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
          <DeleteUserPopup onClose={handleDelete} />
        </BasicModal>
      )}
    </>
  );
};

export default DeleteUser;
