import List from "@mui/material/List";
import HomeIcon from "@mui/icons-material/Home";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import HistoryIcon from "@mui/icons-material/History";
import VideocamIcon from "@mui/icons-material/Videocam";
import TwitterIcon from "@mui/icons-material/Twitter";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SettingsIcon from "@mui/icons-material/Settings";
import SendIcon from "@mui/icons-material/Send";
import { sideBarList, sideBarSecondaryList } from "../../constants/constants";
import type { SidebarOptionType } from "../../constants/genericTypes";
import useAuth from "../../hooks/useAuth";
import ShowLinerButtons from "./ShowLinerButtons";

const DrawerContents = ({
  open,
  closeDrawer,
}: {
  open: boolean;
  closeDrawer: () => void;
}) => {
  const { user } = useAuth();

  return (
    <>
      {/* <DrawerHeader /> */}
      <List>
        {sideBarList.map((text: SidebarOptionType, index) => (
          <ShowLinerButtons
            key={text.id}
            linkTo={
              text.name === "Home" ? `/${user?.user.username}` : text.path
            }
            closeDrawer={closeDrawer}
            open={open}
            content={sideBarIconList[index]}
            name={text.name}
          />
        ))}
      </List>

      <List>
        {sideBarSecondaryList.map((text, index) => (
          <ShowLinerButtons
            key={text.id}
            linkTo={text.path}
            closeDrawer={closeDrawer}
            open={open}
            content={secondaryIconList[index]}
            name={text.name}
          />
        ))}
      </List>
    </>
  );
};

export default DrawerContents;

const sideBarIconList = [
  <HomeIcon />,
  <ThumbUpIcon />,
  <HistoryIcon />,
  <VideocamIcon />,
  <TwitterIcon />,
  <PeopleOutlineIcon />,
];
const secondaryIconList = [<SendIcon />, <HelpOutlineIcon />, <SettingsIcon />];
