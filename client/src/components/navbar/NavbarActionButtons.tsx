import Box from "@mui/material/Box";
import BtnContainer from "../others/BtnContainer";
import {
  OutlinedButton,
  ContainedButton,
} from "../ui-components/StyledComponents";
import useMode from "../../hooks/useMode";
import LoginLogout from "./LoginLogout";

const NavbarActionButtons = () => {
  const { mode, changeMode } = useMode();

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
        <LoginLogout />
      </BtnContainer>
      <BtnContainer>
        <ContainedButton mode={mode}>Sign Up</ContainedButton>
      </BtnContainer>
    </Box>
  );
};

export default NavbarActionButtons;
