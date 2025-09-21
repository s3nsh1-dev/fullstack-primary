import useAuth from "../hooks/useAuth";
import useFetchUserTweets from "../hooks/data-fetching/useFetchUserTweets";
import ShowTweets from "../components/homepage/ShowTweets";
import { Box } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";

const Tweets = () => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useFetchUserTweets(
    user?.user?._id || ""
  );
  if (isLoading || !data) return <div>...Loading Liked Content</div>;
  if (isError) return <div>...Encountered Error</div>;

  // console.log(data);

  return (
    <Box m={1}>
      <HomeTabTitles
        text="Tweets"
        icon={
          <ChatBubbleOutlineIcon sx={{ fontSize: 28, color: "primary.main" }} />
        }
      />
      <ShowTweets tweets={data} />
    </Box>
  );
};

export default Tweets;
