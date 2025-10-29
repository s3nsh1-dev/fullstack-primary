import React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SiteLogo from "../components/ui-components/SiteLogo";
import ResponsiveDrawer from "../components/navbar/ResponsiveDrawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import DedicatedDrawer from "../components/navbar/DedicatedDrawer";
import NavbarActionButtons from "../components/navbar/NavbarActionButtons";
import NavbarSearchArea from "../components/navbar/NavbarSearchArea";
import { useTheme } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import {
  Main,
  AppBar,
} from "../components/ui-components/NavbarStyledComponents";
const Navbar = () => {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };
  const closeDrawer = () => {
    setOpen(false);
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(792));
  const notMobileButCollapsed = useMediaQuery(theme.breakpoints.down(1313));

  const doNothing = () => {};

  React.useEffect(() => {
    setOpen(false);
  }, [isMobile, notMobileButCollapsed]);

  return (
    <>
      <>
        <AppBar position="fixed" open={open} elevation={1} sx={{}}>
          <Toolbar
            variant="dense"
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", flexWrap: "nowrap" }}>
              <IconButton color="inherit" onClick={toggleDrawer} edge="start">
                <MenuIcon />
              </IconButton>
              <SiteLogo />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <NavbarSearchArea />
              <NavbarActionButtons />
            </Box>
          </Toolbar>
        </AppBar>
        {isMobile ? (
          <DedicatedDrawer
            open={open}
            toggleDrawer={toggleDrawer}
            closeDrawer={closeDrawer}
          />
        ) : notMobileButCollapsed ? (
          <>
            <ResponsiveDrawer
              open={false}
              closeDrawer={notMobileButCollapsed ? closeDrawer : doNothing}
            />
            <DedicatedDrawer
              open={open}
              toggleDrawer={toggleDrawer}
              closeDrawer={closeDrawer}
            />
          </>
        ) : (
          <ResponsiveDrawer
            open={open}
            closeDrawer={notMobileButCollapsed ? closeDrawer : doNothing}
          />
        )}
      </>
      <Main open={open}>
        {<Outlet />}
        {/* {!user && !loading ? <NotLoggedIn /> : <Outlet />} */}
      </Main>
    </>
  );
};

export default Navbar;
