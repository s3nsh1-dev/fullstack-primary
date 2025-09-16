import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import { useState } from "react";
import FormModal from "../others/FormModal";
import Login from "../../pages/Login";
import Logout from "../../pages/Logout";

const LoginLogout = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const toggleInOut = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      {!user ? (
        <IconButton onClick={toggleInOut}>
          <LoginIcon fontSize="large" />
        </IconButton>
      ) : (
        <IconButton onClick={toggleInOut}>
          <LogoutIcon fontSize="large" />
        </IconButton>
      )}
      {open && (
        <FormModal open={open} toggleModal={toggleInOut}>
          {user ? (
            <Logout toggleOpen={toggleInOut} />
          ) : (
            <Login toggleOpen={toggleInOut} />
          )}
        </FormModal>
      )}
    </>
  );
};

export default LoginLogout;
