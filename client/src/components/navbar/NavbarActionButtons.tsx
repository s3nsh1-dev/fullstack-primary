import Box from "@mui/material/Box";
import BtnContainer from "../others/BtnContainer";
import { OutlinedButton } from "../ui-components/StyledComponents";
import useMode from "../../hooks/useMode";
import LoginLogout from "./LoginLogout";
import SignUpButton from "../../pages/SignUpButton";

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
      <LoginLogout />
      <SignUpButton />
    </Box>
  );
};

export default NavbarActionButtons;
