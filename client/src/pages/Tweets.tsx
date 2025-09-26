import useAuth from "../hooks/useAuth";
import useFetchUserTweets from "../hooks/data-fetching/useFetchUserTweets";
import ShowTweets from "../components/homepage/ShowTweets";
import { Box } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";

const Tweets = () => {
  const { user } = useAuth();
  const { data, isError, isLoading } = useFetchUserTweets(
    user?.user?._id || ""
  );
  if (isLoading) return <div>...Loading Tweets</div>;
  if (isError) return <div>...Encountered Error</div>;
  if (!data || data.length === 0) return <div>No Tweets</div>;

  return (
    <Box m={1}>
      <HomeTabTitles
        text="Tweets"
        icon={
          <ChatBubbleOutlineIcon sx={{ fontSize: 28, color: "primary.main" }} />
        }
      />
      <ShowTweets data={data} interaction={true} />
    </Box>
  );
};

export default Tweets;
