import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import HistoryIcon from "@mui/icons-material/History";
import VideocamIcon from "@mui/icons-material/Videocam";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import { buttonColor, textColor } from "../../constants/uiConstants";
import useMode from "../../hooks/useMode";
// import { DrawerHeader } from "../ui-components/NavbarStyledComponents";
import { sideBarList, sideBarSecondaryList } from "../../constants/constants";

const sideBarIconList = [
  <HomeIcon />,
  <ThumbUpIcon />,
  <HistoryIcon />,
  <VideocamIcon />,
  <FolderOpenIcon />,
  <PeopleOutlineIcon />,
];
const secondaryIconList = [<HelpOutlineIcon />, <SettingsIcon />];

type DrawerContentsProps = {
  open: boolean;
};

const DrawerContents: React.FC<DrawerContentsProps> = ({ open }) => {
  const { mode } = useMode();

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
      <Box>
        {/* <DrawerHeader /> */}
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
    </>
  );
};

export default DrawerContents;
