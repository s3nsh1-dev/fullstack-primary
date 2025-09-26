import React from "react";
import Sample1 from "./Sample1";
import Sample2 from "./Sample2";
import Sample5 from "./Sample5";
import { Card } from "@mui/material";
import type { TweetType } from "../../hooks/data-fetching/useFetchUserTweets";
import useFetchCommentsOnTweets from "../../hooks/data-fetching/useFetchCommentsOnTweets";

const IndividualTweet: React.FC<IndividualTweetProps> = ({
  tweet,
  interaction,
}) => {
  const fetchCommentMutate = useFetchCommentsOnTweets();
  const [showComments, setShowComments] = React.useState(false);
  const handleShowComments = () => {
    setShowComments(!showComments);
    fetchCommentMutate.mutate(tweet._id, {
      onSuccess: () => {},
    });
  };

  return (
    <Card key={tweet._id} variant="outlined">
      <Sample1 tweet={tweet} />
      {interaction && (
        <>
          <Sample2 handleShowComments={handleShowComments} disabled={false} />
          {fetchCommentMutate.isPending ? (
            <div>....Loading Comments</div>
          ) : (
            <div>
              {fetchCommentMutate.data?.comments.docs.map((comment) => (
                <div key={comment._id}>
                  <Sample5 comment={comment} />
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default IndividualTweet;

type IndividualTweetProps = {
  tweet: TweetType;
  interaction: boolean;
};
