import type { FC } from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
import { buttonColor, textColor } from "../../constants/uiConstants";
import useMode from "../../hooks/useMode";

const ShowLinerButtons: FC<PropTypes> = ({
  linkTo,
  closeDrawer,
  open,
  content,
  name,
  isDisabled,
}) => {
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
  const sx1 = [
    { minWidth: 0, justifyContent: "center" },
    open ? { mr: 3 } : { mr: "auto" },
  ];
  const sx2 = [open ? { opacity: 1 } : { opacity: 0 }];
  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <Box
        component={isDisabled ? "div" : Link}
        to={linkTo}
        sx={{ textDecoration: "none" }}
      >
        <ListItemButton sx={style} onClick={closeDrawer} disabled={isDisabled}>
          <ListItemIcon sx={sx1}>{content}</ListItemIcon>
          <ListItemText primary={name} sx={sx2} />
        </ListItemButton>
      </Box>
    </ListItem>
  );
};

export default ShowLinerButtons;

type PropTypes = {
  linkTo: string;
  closeDrawer: () => void;
  open: boolean;
  content: React.ReactNode;
  name: string;
  isDisabled?: boolean;
};
