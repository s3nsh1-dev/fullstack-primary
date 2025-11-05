import Button from "@mui/material/Button";
import BasicModal from "../ui-components/BasicModal";
import { useState } from "react";

const DeactivateUser = () => {
  const [open, setOpen] = useState<boolean>(false);
  const handleToggle = () => setOpen((prev) => !prev);

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
        <BasicModal open={open} onClose={() => setOpen(false)}>
          This is warning before deactivating accounts
        </BasicModal>
      )}
    </>
  );
};

export default DeactivateUser;
