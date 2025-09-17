import React from "react";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import SiteLogo from "../components/ui-components/SiteLogo";
import ResponsiveDrawer from "../components/navbar/ResponsiveDrawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import DedicatedDrawer from "../components/navbar/DedicatedDrawer";
import NavbarActionButtons from "../components/navbar/NavbarActionButtons";
import NavbarSearchArea from "../components/navbar/NavbarSearchArea";
import type { TestProps } from "../constants/componentPropTypes";
import { useTheme } from "@mui/material/styles";
import { Outlet } from "react-router-dom";
import {
  Main,
  AppBar,
} from "../components/ui-components/NavbarStyledComponents";

const Navbar: React.FC<TestProps> = ({ navTitle }) => {
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => {
    setOpen((prev) => !prev);
  };
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(792));
  const notMobileButCollapsed = useMediaQuery(theme.breakpoints.down(1313));

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
              <Typography variant="h6" noWrap component="div">
                {navTitle}
              </Typography>
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
          <DedicatedDrawer open={open} toggleDrawer={toggleDrawer} />
        ) : notMobileButCollapsed ? (
          <>
            <ResponsiveDrawer open={false} />
            <DedicatedDrawer open={open} toggleDrawer={toggleDrawer} />
          </>
        ) : (
          <ResponsiveDrawer open={open} />
        )}
      </>
      <Main open={open}>
        <Outlet />
      </Main>
    </>
  );
};

export default Navbar;
