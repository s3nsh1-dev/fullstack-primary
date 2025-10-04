import { useParams } from "react-router-dom";
import CircularProgressCenter from "../components/ui-components/CircularProgressCenter";
import ContentNotAvailable from "../components/others/ContentNotAvailable";
import useFetchSingleTweet from "../hooks/data-fetching/useFetchSingleTweet";

const OpenSingleVideoPage = () => {
  const { videoId } = useParams();

  // just a filler
  const { data, isLoading } = useFetchSingleTweet(
    videoId || "INVALID_TWEET-ID"
  );
  if (isLoading) return <CircularProgressCenter size={50} />;
  if (!data) return <ContentNotAvailable text="Tweet Not Available" />;

  return <div>Here is your video : {videoId}</div>;
};

export default OpenSingleVideoPage;
