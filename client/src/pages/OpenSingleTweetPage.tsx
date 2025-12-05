import useFetchSingleTweet from "../hooks/data-fetching/useFetchSingleTweet";
import IndividualTweet from "../components/Tweets/IndividualTweet";
import { useParams } from "react-router-dom";
import Box from "@mui/material/Box";
import ContentNotAvailable from "../components/others/ContentNotAvailable";
import LoadingAnimation from "../components/ui-components/LoadingAnimation";
import useAuth from "../hooks/useAuth";

const OpenSingleTweetPage = () => {
  const { tweetId } = useParams<{ tweetId: string }>(); // fetch param from URL
  const { user } = useAuth();
  const { data, isLoading } = useFetchSingleTweet({
    tweetId: tweetId || "",
    userId: user?.user?._id || "",
  });
  if (isLoading) return <LoadingAnimation />;
  if (!data) return <ContentNotAvailable text="Tweet Not Available" />;

  return (
    <Box m={1}>
      <IndividualTweet
        interaction={true}
        tweet={data.tweet}
        isLiked={data.isLiked}
      />
    </Box>
  );
};

export default OpenSingleTweetPage;
