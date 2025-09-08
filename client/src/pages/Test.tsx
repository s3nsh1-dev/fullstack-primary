import * as React from "react";
import { styled, type Theme, type CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, {
  type AppBarProps as MuiAppBarProps,
} from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import useMode from "../hooks/useMode";
import Button from "@mui/material/Button";
import type { TestProps } from "../constants/componentPropTypes";
import SiteLogo from "../components/ui-components/SiteLogo";
import HomeIcon from "@mui/icons-material/Home";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import HistoryIcon from "@mui/icons-material/History";
import VideocamIcon from "@mui/icons-material/Videocam";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import { buttonColor, textColor } from "../constants/uiConstants";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

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

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

const sideBarList = [
  "Home",
  "Liked Videos",
  "History",
  "My Content",
  "Collections",
  "Subscribers",
];
const sideBarIconList = [
  <HomeIcon />,
  <ThumbUpIcon />,
  <HistoryIcon />,
  <VideocamIcon />,
  <FolderOpenIcon />,
  <PeopleOutlineIcon />,
];
const sideBarSecondaryList = ["Support", "Setting"];
const secondaryIconList = [<HelpOutlineIcon />, <SettingsIcon />];

const Test: React.FC<TestProps> = ({ navTitle, children }) => {
  const [open, setOpen] = React.useState(false);
  const { mode, changeMode } = useMode();
  const handleDrawerOpen = () => {
    setOpen((prev) => !prev);
  };
  const buttonText = mode ? "Light Mode" : "Dark Mode";
  const style = [
    {
      margin: 1,
      minHeight: 48,
      px: 2.5,
      backgroundColor: "transparent",
      border: `2px solid ${mode ? textColor.dark : textColor.light}`,
      color: mode ? textColor.dark : textColor.light, // default color
      "& .MuiListItemText-primary": {
        fontWeight: "bold",
      },
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: mode ? textColor.dark : textColor.light, // match default
      },
      "&:hover": {
        backgroundColor: buttonColor.default,
        color: mode ? textColor.light : textColor.dark, // change button text
        "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
          color: mode ? textColor.light : textColor.dark, // change icon + text
        },
      },
    },
    open
      ? {
          justifyContent: "initial",
        }
      : {
          justifyContent: "center",
        },
  ];

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar position="fixed" open={open}>
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
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          "& .MuiDrawer-paper": {
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          },
        }}
      >
        <Box>
          <DrawerHeader></DrawerHeader>
          <List>
            {sideBarList.map((text, index) => (
              <ListItem key={text} disablePadding sx={{ display: "block" }}>
                <ListItemButton sx={style}>
                  <ListItemIcon
                    sx={[
                      {
                        minWidth: 0,
                        justifyContent: "center",
                      },
                      open
                        ? {
                            mr: 3,
                          }
                        : {
                            mr: "auto",
                          },
                    ]}
                  >
                    {sideBarIconList[index]}
                  </ListItemIcon>
                  <ListItemText
                    primary={text}
                    sx={[
                      open
                        ? {
                            opacity: 1,
                          }
                        : {
                            opacity: 0,
                          },
                    ]}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        <List>
          {sideBarSecondaryList.map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: "block" }}>
              <ListItemButton sx={style}>
                <ListItemIcon
                  sx={[
                    {
                      minWidth: 0,
                      justifyContent: "center",
                    },
                    open
                      ? {
                          mr: 3,
                        }
                      : {
                          mr: "auto",
                        },
                  ]}
                >
                  {secondaryIconList[index]}
                </ListItemIcon>
                <ListItemText
                  primary={text}
                  sx={[
                    open
                      ? {
                          opacity: 1,
                        }
                      : {
                          opacity: 0,
                        },
                  ]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
};

export default Test;
