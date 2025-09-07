import { AppBar, Toolbar, IconButton, Button } from "@mui/material";
import darkModeLogo from "../assets/site_logo_black_croppedVersion.png";
import lightModeLogo from "../assets/site_logo_white_croppedVersion.png";
import useMode from "../hooks/useMode";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
const MyNavbar = () => {
  const { mode, changeMode } = useMode();
  const buttonText = mode ? "Light Mode" : "Dark Mode";
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen((prev) => !prev);
  };
  return (
    <AppBar position="static">
      <Toolbar>
        <IconButton onClick={handleOpen}>
          {open ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
        <IconButton>
          <img src={mode ? darkModeLogo : lightModeLogo} height={50} />
        </IconButton>
        <Button onClick={changeMode}>{buttonText}</Button>
      </Toolbar>
    </AppBar>
  );
};

export default MyNavbar;
