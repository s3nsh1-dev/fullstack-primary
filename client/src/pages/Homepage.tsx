import { useState } from "react";
import { Box, ButtonGroup, Typography } from "@mui/material";
import { emptyPageText } from "../constants/constants";
import ShowPlaylists from "../components/homepage/ShowPlaylists";
import ShowVideos from "../components/homepage/ShowVideos";
import ShowSubscribed from "../components/homepage/ShowSubscribed";
import ShowTweets from "../components/homepage/ShowTweets";
import useMode from "../hooks/useMode";
import { StyledButton } from "../components/ui-components/StyledComponents";
import { buttonColor } from "../constants/uiConstants";
import HomeProfilePictures from "../components/homepage/HomeProfilePictures";
import useAuth from "../hooks/useAuth";
import convertISOIntoLocalTime from "../utilities/convertISOIntoLocalTime";

type OpenStateType = {
  videos: boolean;
  playlists: boolean;
  tweets: boolean;
  subscribed: boolean;
};

const Homepage = () => {
  const { mode } = useMode();
  const [open, setOpen] = useState<OpenStateType>({
    videos: true,
    playlists: false,
    tweets: false,
    subscribed: false,
  });
  const { user } = useAuth();
  const activeUser = user?.user;
  if (!activeUser) return <div>You are not logged in</div>;

  const handleOpen = (value: keyof OpenStateType) => {
    setOpen({
      videos: false,
      playlists: false,
      tweets: false,
      subscribed: false,
      [value]: true,
    });
  };
  return (
    <Box>
      <HomeProfilePictures />
      <Box sx={{ margin: "63px 5px 5px 5px" }}>
        <Typography>{activeUser.fullname}</Typography>
        <Typography>{activeUser.email}</Typography>
        <Typography>{convertISOIntoLocalTime(activeUser.createdAt)}</Typography>
        <Typography>{activeUser.username}</Typography>
      </Box>
      <Box className="dynamic-content">
        <Box className="select-button">
          <ButtonGroup
            variant="text"
            color="inherit"
            aria-label="Basic button group"
            sx={{
              width: "100%",
            }}
          >
            {emptyPageText.map((button) => {
              const foo = button.id as keyof OpenStateType;
              return (
                <StyledButton
                  id={button.id}
                  mode={mode}
                  sx={{
                    width: "100%",
                    backgroundColor:
                      open[foo] === false ? buttonColor.default : "transparent",
                  }}
                  onClick={() => handleOpen(button.id as keyof OpenStateType)}
                >
                  {button.title}
                </StyledButton>
              );
            })}
          </ButtonGroup>
        </Box>
        <Box className="select-content">
          {open.videos && <ShowVideos />}
          {open.playlists && <ShowPlaylists />}
          {open.tweets && <ShowTweets />}
          {open.subscribed && <ShowSubscribed />}
        </Box>
      </Box>
    </Box>
  );
};

export default Homepage;
