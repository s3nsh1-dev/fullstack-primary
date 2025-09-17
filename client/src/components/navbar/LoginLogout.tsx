import { useState } from "react";
import Login from "../../pages/Login";
import Logout from "../../pages/Logout";
import FormModal from "../others/FormModal";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { BoxCenter } from "../ui-components/StyledComponents";
import { IconButton } from "@mui/material";
import useAuth from "../../hooks/useAuth";

const LoginLogout = () => {
  const { user } = useAuth();

  const [open, setOpen] = useState(false);
  const toggleInOut = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      <BoxCenter>
        {!user ? (
          <IconButton onClick={toggleInOut}>
            <AccountCircleIcon fontSize="small" />
          </IconButton>
        ) : (
          <IconButton onClick={toggleInOut}>
            <LogoutIcon fontSize="small" />
          </IconButton>
        )}
      </BoxCenter>
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
