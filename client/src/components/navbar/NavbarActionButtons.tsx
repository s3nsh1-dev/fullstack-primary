import Box from "@mui/material/Box";
import LoginLogout from "./LoginLogout";
import SignUpButton from "../../pages/SignUpButton";
import ToggleMode from "./ToggleMode";

const NavbarActionButtons = () => {
  return (
    <Box
      className="whatever-app-wants"
      sx={{ display: "flex", flexDirection: "row" }}
    >
      <ToggleMode />
      <LoginLogout />
      <SignUpButton />
    </Box>
  );
};

export default NavbarActionButtons;
