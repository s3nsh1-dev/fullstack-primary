import Box from "@mui/material/Box";
import LoginLogout from "./LoginLogout";
import SignUpButton from "../../pages/SignUpButton";
import ToggleMode from "./ToggleMode";
import useAuth from "../../hooks/useAuth";

const NavbarActionButtons = () => {
  const { user } = useAuth();
  return (
    <Box
      className="whatever-app-wants"
      sx={{ display: "flex", flexDirection: "row" }}
    >
      <ToggleMode />
      {user ? <LoginLogout /> : <SignUpButton />}
    </Box>
  );
};

export default NavbarActionButtons;
