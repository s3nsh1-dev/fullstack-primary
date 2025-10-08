import ShowTweets from "../components/homepage/ShowTweets";
import { Box } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";

const Tweets = () => {
  return (
    <Box m={1}>
      <HomeTabTitles
        text="Tweets"
        icon={
          <ChatBubbleOutlineIcon sx={{ fontSize: 28, color: "primary.main" }} />
        }
      />
      <ShowTweets interaction={true} />
    </Box>
  );
};

export default Tweets;
