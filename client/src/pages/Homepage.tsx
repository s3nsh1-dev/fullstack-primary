import { useState } from "react";
import { Box, ButtonGroup } from "@mui/material";
import { ContainedButton } from "../components/ui-components/StyledComponents";
import { emptyPageText } from "../constants/constants";

type OpenStateType = {
  videos: boolean;
  playlists: boolean;
  tweets: boolean;
  subscribed: boolean;
};

const Homepage = () => {
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
      <Box className="hero-section">
        <Box className="cover-image"></Box>
        <Box className="Avatar"></Box>
      </Box>
      <Box className="dynamic-content">
        <Box className="select-button">
          <ButtonGroup
            variant="contained"
            aria-label="Basic button group"
            sx={{ width: "100%" }}
          >
            {emptyPageText.map((button) => (
              <ContainedButton
                key={button.id}
                sx={{ width: "100%" }}
                onClick={() => handleOpen(button.id as keyof OpenStateType)}
              >
                {button.title}
              </ContainedButton>
            ))}
          </ButtonGroup>
        </Box>
        <Box className="select-content">
          {open.videos && <Box>Showing user videos</Box>}
          {open.playlists && <Box>Showing user playlists</Box>}
          {open.tweets && <Box>Showing user tweets</Box>}
          {open.subscribed && <Box>Showing user subscribed</Box>}
        </Box>
      </Box>
    </Box>
  );
};

export default Homepage;
