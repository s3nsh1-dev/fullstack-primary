import { useState } from "react";
import { Box, ButtonGroup, Typography, Divider } from "@mui/material";
import { emptyPageText } from "../constants/constants";
import ShowPlaylists from "../components/homepage/ShowPlaylists";
import ShowVideos from "../components/homepage/ShowVideos";
import ShowSubscribed from "../components/homepage/ShowSubscribed";
import ShowTweets from "../components/homepage/ShowTweets";
import useMode from "../hooks/useMode";
import { StyledButton } from "../components/ui-components/StyledComponents";
import { buttonColor } from "../constants/uiConstants";
import HomeProfilePictures from "../components/homepage/HomeProfilePictures";
import convertISOIntoLocalTime from "../utilities/convertISOIntoLocalTime";
import useFetchHomepageDetails from "../hooks/data-fetching/useFetchHomepageDetails";
import useAuth from "../hooks/useAuth";

type OpenStateType = {
  videos: boolean;
  playlists: boolean;
  tweets: boolean;
  subscribed: boolean;
};

const Homepage = () => {
  const { mode } = useMode();
  const { user } = useAuth();
  const [open, setOpen] = useState<OpenStateType>({
    videos: true,
    playlists: false,
    tweets: false,
    subscribed: false,
  });
  const { data, isLoading, isError } = useFetchHomepageDetails(
    user?.user._id || ""
  );
  if (!data) return null;
  if (isLoading) return <div>...Loading Homepage</div>;
  if (isError) return <div>...Encountered Error</div>;

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
      <Box
        sx={{
          margin: "63px 5px 5px 5px",
          display: "flex",
          flexDirection: "row",
          gap: 6,
        }}
      >
        <Box sx={{}}>
          <Typography>
            Name: {data.fullname}{" "}
            <Typography
              component={"span"}
              variant="caption"
              color="text.secondary"
            >
              @{data.username}
            </Typography>
          </Typography>
          <Typography>Email: {data.email}</Typography>
          <Typography>
            Created in: {convertISOIntoLocalTime(data.createdAt)}
          </Typography>
        </Box>
        <Divider orientation="vertical" flexItem />
        <Box>
          <Typography>Subscribers: {data.subscribers.length}</Typography>
          <Typography>Videos: {data.videos.length}</Typography>
          <Typography>Tweets: {data.tweets.length}</Typography>
        </Box>
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
          {open.videos && <ShowVideos videos={data.videos} />}
          {open.playlists && <ShowPlaylists playlists={data.playlists} />}
          {open.tweets && <ShowTweets tweets={data.tweets} />}
          {open.subscribed && <ShowSubscribed subscribed={data.subscribed} />}
        </Box>
      </Box>
    </Box>
  );
};

export default Homepage;
