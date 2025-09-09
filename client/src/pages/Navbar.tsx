import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiAppBar, {
  type AppBarProps as MuiAppBarProps,
} from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import useMode from "../hooks/useMode";
import Button from "@mui/material/Button";
import type { TestProps } from "../constants/componentPropTypes";
import SiteLogo from "../components/ui-components/SiteLogo";
import { Outlet } from "react-router-dom";
import { Main } from "../components/ui-components/NavbarStyledComponents";
import ResponsiveDrawer from "../components/navbar/ResponsiveDrawer";

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
}));

const Navbar: React.FC<TestProps> = ({ navTitle }) => {
  const [open, setOpen] = React.useState(false);
  const { mode, changeMode } = useMode();
  const handleDrawerOpen = () => {
    setOpen((prev) => !prev);
  };
  const buttonText = mode ? "Light Mode" : "Dark Mode";

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <AppBar position="fixed" open={open} elevation={1}>
          <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
              >
                <MenuIcon />
              </IconButton>
              <SiteLogo />
              <Typography variant="h6" noWrap component="div">
                {navTitle}
              </Typography>
            </Box>
            <Box className="whatever-app-wants">
              <Button onClick={changeMode}>{buttonText}</Button>
            </Box>
          </Toolbar>
        </AppBar>
        <ResponsiveDrawer open={open} />
        <DrawerHeader />
      </Box>
      <Main open={open}>
        <Outlet />
      </Main>
    </>
  );
};

export default Navbar;
