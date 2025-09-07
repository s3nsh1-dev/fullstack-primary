import { AppBar, Toolbar, IconButton, Button } from "@mui/material";
import darkModeLogo from "../assets/site_logo_black_croppedVersion.png";
import lightModeLogo from "../assets/site_logo_white_croppedVersion.png";
import useMode from "../hooks/useMode";

const Navbar = () => {
  const { mode, changeMode } = useMode();
  const buttonText = mode ? "Light Mode" : "Dark Mode";
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton></IconButton>
        <IconButton>
          <img src={mode ? darkModeLogo : lightModeLogo} height={50} />
        </IconButton>
        <Button onClick={changeMode}>{buttonText}</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
