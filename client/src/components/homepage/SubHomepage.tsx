import React from "react";
import { emptyPageText } from "../../constants/constants";
import ShowPlaylists from "../../components/homepage/ShowPlaylists";
import ShowVideos from "./ShowVideos";
import ShowSubscribed from "../../components/homepage/ShowSubscribed";
import ShowTweets from "../../components/homepage/ShowTweets";
import useMode from "../../hooks/useMode";
import { StyledButton } from "../../components/ui-components/StyledComponents";
import { buttonColor } from "../../constants/uiConstants";
import ButtonGroup from "@mui/material/ButtonGroup";
import { Box } from "@mui/material";
import HomeUserDetails from "./HomeUserDetails";
import type { HomePageFormatType } from "../../hooks/data-fetching/useFetchHomepageDetails";

const SubHomepage: React.FC<SubHomepageProps> = ({
  open,
  data,
  handleOpen,
}) => {
  const { mode } = useMode();
  return (
    <>
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
          {open.videos && <ShowVideos videos={data.user.videos} />}
          {open.playlists && <ShowPlaylists playlists={data.user.playlists} />}
          {open.tweets && (
            <ShowTweets tweets={data.user.tweets} interaction={false} />
          )}
          {open.subscribed && (
            <ShowSubscribed subscribed={data.user.subscribers} />
          )}
        </Box>
      </Box>
    </>
  );
};

export default SubHomepage;

type OpenStateType = {
  videos: boolean;
  playlists: boolean;
  tweets: boolean;
  subscribed: boolean;
};

type SubHomepageProps = {
  open: OpenStateType;
  data: {
    user: HomePageFormatType;
    isSubbed: boolean;
  };
  handleOpen: (value: keyof OpenStateType) => void;
};
