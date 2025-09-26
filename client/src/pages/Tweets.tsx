import useAuth from "../hooks/useAuth";
import useFetchUserTweets from "../hooks/data-fetching/useFetchUserTweets";
import ShowTweets from "../components/homepage/ShowTweets";
import { Box, CircularProgress } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";

const Tweets = () => {
  const { user, loading } = useAuth();
  const { data, isError, isLoading, isFetched } = useFetchUserTweets(
    user?.user?._id || ""
  );

  if (loading)
    return (
      <div>
        <CircularProgress />;
      </div>
    );

  return (
    <Box m={1}>
      <HomeTabTitles
        text="Tweets"
        icon={
          <ChatBubbleOutlineIcon sx={{ fontSize: 28, color: "primary.main" }} />
        }
      />
      <ShowTweets
        data={data || []}
        isError={isError}
        isLoading={isLoading}
        isFetched={isFetched}
        interaction={true}
      />
    </Box>
  );
};

export default Tweets;
