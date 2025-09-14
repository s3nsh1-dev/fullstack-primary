import { Box, IconButton } from "@mui/material";
import BtnContainer from "../others/BtnContainer";
import {
  OutlinedButton,
  ContainedButton,
} from "../ui-components/StyledComponents";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import useMode from "../../hooks/useMode";
import useAuth from "../../hooks/useAuth";

const NavbarActionButtons = () => {
  const { mode, changeMode } = useMode();
  const { user } = useAuth();
  const buttonText = mode ? "Light Mode" : "Dark Mode";

  return (
    <Box
      className="whatever-app-wants"
      sx={{ display: "flex", flexDirection: "row", gap: 2 }}
    >
      <BtnContainer>
        <OutlinedButton mode={mode} onClick={changeMode}>
          {buttonText}
        </OutlinedButton>
      </BtnContainer>
      <BtnContainer>
        {!user ? (
          <IconButton>
            <LoginIcon fontSize="large" />
          </IconButton>
        ) : (
          <IconButton>
            <LogoutIcon fontSize="large" />
          </IconButton>
        )}
      </BtnContainer>
      <BtnContainer>
        <ContainedButton mode={mode}>Sign Up</ContainedButton>
      </BtnContainer>
    </Box>
  );
};

export default NavbarActionButtons;
