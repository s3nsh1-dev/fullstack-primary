import React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useDeactivateUser from "../../hooks/CRUD-hooks/useDeactivateUser";

const DeactivatePopup: React.FC<PropTypes> = ({ onClose }) => {
  const { mutate: deactivateUser } = useDeactivateUser();
  const handleDeactivate = () => {
    deactivateUser(undefined, {
      onSuccess: (data) => console.log(data),
      onSettled: () => onClose(),
    });
  };

  return (
    <>
      <Typography variant="h6" component="h2">
        Deactivate Account
      </Typography>

      <Typography sx={{ mt: 2 }}>
        Your account will be temporarily disabled. You won’t appear in searches
        or be able to log in until you reactivate.
      </Typography>

      <Typography sx={{ mt: 2 }}>
        You can reactivate anytime by logging back in. None of your data will be
        lost.
      </Typography>

      <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button color="warning" variant="contained" onClick={handleDeactivate}>
          Deactivate
        </Button>
      </Box>
    </>
  );
};

export default DeactivatePopup;

type PropTypes = {
  onClose: () => void;
};
