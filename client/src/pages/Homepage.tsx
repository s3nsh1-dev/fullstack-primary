import { useState } from "react";
import { Box, ButtonGroup } from "@mui/material";
import { emptyPageText } from "../constants/constants";
import ShowPlaylists from "../components/homepage/ShowPlaylists";
import ShowVideos from "../components/homepage/ShowVideos";
import ShowSubscribed from "../components/homepage/ShowSubscribed";
import ShowTweets from "../components/homepage/ShowTweets";
import useMode from "../hooks/useMode";
import { StyledButton } from "../components/ui-components/StyledComponents";
import { buttonColor } from "../constants/uiConstants";
import useFetchHomepageDetails from "../hooks/data-fetching/useFetchHomepageDetails";
import useAuth from "../hooks/useAuth";
import HomeUserDetails from "../components/homepage/HomeUserDetails";

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
    user?.user._id || "INVALID USER_ID"
  );
  if (isLoading || !data) return <div>...Loading Homepage</div>;
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
      <HomeUserDetails data={data} />
      <Box className="dynamic-content">
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
        <Box className="select-content" m={1}>
          {open.videos && <ShowVideos videos={data.videos} />}
          {open.playlists && <ShowPlaylists playlists={data.playlists} />}
          {open.tweets && <ShowTweets tweets={data.tweets} />}
          {open.subscribed && <ShowSubscribed subscribed={data.subscribers} />}
        </Box>
      </Box>
    </Box>
  );
};

export default Homepage;
