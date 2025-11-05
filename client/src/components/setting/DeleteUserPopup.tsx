import React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const DeleteUserPopup: React.FC<PropTypes> = ({ onClose, handleDelete }) => {
  return (
    <>
      <Typography variant="h6" component="h2">
        Confirm Account Deletion
      </Typography>
      <Typography sx={{ mt: 2 }}>
        This action cannot be undone. Are you sure you want to delete your
        account?
      </Typography>
      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button color="error" variant="contained" onClick={handleDelete}>
          Delete
        </Button>
      </Box>
    </>
  );
};

export default DeleteUserPopup;

type PropTypes = {
  handleDelete: () => void;
  onClose: () => void;
};
