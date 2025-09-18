import { Box, Button, ButtonGroup } from "@mui/material";

const emptyPageText: {
  id: number;
  logo: string;
  title: string;
  heading: string;
  description: string;
}[] = [
  {
    id: 0,
    logo: "",
    title: "Videos",
    heading: "No videos uploaded",
    description:
      "This page has yet to upload a video. Search another page in order to find more videos.",
  },
  {
    id: 1,
    logo: "",
    title: "Playlists",
    heading: "No playlist created",
    description: "There are no playlist created on this channel.",
  },
  {
    id: 2,
    logo: "",
    title: "Tweets",
    heading: "No Tweets",
    description: "This channel has yet to make a Tweet.",
  },
  {
    id: 3,
    logo: "",
    title: "Subscribed",
    heading: "No people subscribers",
    description: "This channel has yet to subscribe a new channel.",
  },
];

const Homepage = () => {
  console.log(emptyPageText);
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
              <Button key={button.id} sx={{ width: "100%" }}>
                {button.title}
              </Button>
            ))}
          </ButtonGroup>
        </Box>
        <Box className="select-content"></Box>
      </Box>
    </Box>
  );
};

export default Homepage;
