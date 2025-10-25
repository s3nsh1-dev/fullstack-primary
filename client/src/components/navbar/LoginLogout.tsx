import { useState } from "react";
import Logout from "../../pages/Logout";
import FormModal from "../others/FormModal";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { BoxCenter } from "../ui-components/StyledComponents";
import IconButton from "@mui/material/IconButton";

const LoginLogout = () => {
  const [open, setOpen] = useState(false);
  const toggleInOut = () => {
    setOpen((prev) => !prev);
  };

  return (
    <>
      {/* when dropdown is created this LogoutIcon will be last option to select */}
      <BoxCenter>
        <IconButton onClick={toggleInOut}>
          <AccountCircleIcon fontSize="small" />
        </IconButton>
      </BoxCenter>
      {open && (
        <FormModal open={open} toggleModal={toggleInOut}>
          <Logout toggleOpen={toggleInOut} />
        </FormModal>
      )}
    </>
  );
};

export default LoginLogout;
