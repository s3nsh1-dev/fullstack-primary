import { useState } from "react";
import { Box, ButtonGroup, IconButton, Typography } from "@mui/material";
import { emptyPageText } from "../constants/constants";
import ShowPlaylists from "../components/homepage/ShowPlaylists";
import ShowVideos from "../components/homepage/ShowVideos";
import ShowSubscribed from "../components/homepage/ShowSubscribed";
import ShowTweets from "../components/homepage/ShowTweets";
import useMode from "../hooks/useMode";
import { StyledButton } from "../components/ui-components/StyledComponents";
import { backgroundColor, buttonColor } from "../constants/uiConstants";
import EditIcon from "@mui/icons-material/Edit";

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
      <Box
        className="hero-section"
        sx={{
          position: "relative",
          width: "100%",
          height: 250,
          bgcolor: "red",
        }}
      >
        {/* Cover Image */}
        <Box
          className="cover-image"
          sx={{
            width: "100%",
            height: "100%",
            backgroundImage: "url('/cover.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            // borderRadius: 2,
            position: "relative",
            backgroundColor: "green",
          }}
        >
          {/* Edit icon for cover */}
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: mode
                ? "rgba(255,255,255,0.2)"
                : "rgba(0,0,0,0.2)",
              borderRadius: "50%",
              p: 0.5,
              cursor: "pointer",
            }}
          >
            <IconButton>
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Avatar */}
        <Box
          className="avatar"
          sx={{
            width: 200,
            height: 200,
            borderRadius: "50%",
            overflow: "hidden",
            border: `3px solid ${
              mode ? backgroundColor.light : backgroundColor.dark
            }`,
            position: "absolute",
            bottom: -60,
            left: 24,
            backgroundImage: "url('/avatar.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "blue",
          }}
        >
          {/* Edit icon for avatar */}
          <Box
            sx={{
              position: "absolute",
              bottom: 20,
              right: 35,
              backgroundColor: mode
                ? "rgba(255,255,255,0.2)"
                : "rgba(0,0,0,0.2)",
              borderRadius: "50%",
              p: 0.5,
              cursor: "pointer",
            }}
          >
            <IconButton>
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
      <Box sx={{ margin: "63px 5px 5px 5px" }}></Box>
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
