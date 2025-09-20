import type { TweetType } from "../../constants/dataTypes";

const ShowTweets = ({ tweets }: { tweets: TweetType[] }) => {
  console.log("tweets", tweets);
  return <div>Showing User Tweets</div>;
};

export default ShowTweets;
