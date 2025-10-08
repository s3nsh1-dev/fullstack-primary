import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import HistoryIcon from "@mui/icons-material/History";
import VideocamIcon from "@mui/icons-material/Videocam";
import TwitterIcon from "@mui/icons-material/Twitter";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import { buttonColor, textColor } from "../../constants/uiConstants";
import useMode from "../../hooks/useMode";
import { Link } from "react-router-dom";
import { sideBarList, sideBarSecondaryList } from "../../constants/constants";
import type { SidebarOptionType } from "../../constants/genericTypes";
import { Box } from "@mui/material";
import useAuth from "../../hooks/useAuth";

const sideBarIconList = [
  <HomeIcon />,
  <ThumbUpIcon />,
  <HistoryIcon />,
  <VideocamIcon />,
  <TwitterIcon />,
  <PeopleOutlineIcon />,
];
const secondaryIconList = [<HelpOutlineIcon />, <SettingsIcon />];

const DrawerContents = ({
  open,
  closeDrawer,
}: {
  open: boolean;
  closeDrawer: () => void;
}) => {
  const { mode } = useMode();
  const { user } = useAuth();

  const style = [
    {
      margin: 1,
      minHeight: 48,
      px: 2.5,
      backgroundColor: "transparent",
      border: `1px solid ${mode ? textColor.dark : textColor.light}`,
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
    <>
      {/* <DrawerHeader /> */}
      <List>
        {sideBarList.map((text: SidebarOptionType, index) => (
          <ListItem key={text.id} disablePadding sx={{ display: "block" }}>
            <Box
              component={Link}
              to={text.name === "Home" ? `/${user?.user.username}` : text.path}
              sx={{ textDecoration: "none" }}
            >
              <ListItemButton sx={style} onClick={closeDrawer}>
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
                  primary={text.name}
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
            </Box>
          </ListItem>
        ))}
      </List>

      <List>
        {sideBarSecondaryList.map((text, index) => (
          <ListItem key={text.id} disablePadding sx={{ display: "block" }}>
            <Box
              component={Link}
              to={text.path}
              sx={{ textDecoration: "none" }}
            >
              <ListItemButton sx={style} onClick={closeDrawer}>
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
                  primary={text.name}
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
            </Box>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default DrawerContents;
