import React from "react";
import Sample1 from "./Sample1";
import Sample2 from "./Sample2";
import { Card } from "@mui/material";
import useMode from "../../hooks/useMode";
import type { TweetType } from "../../constants/dataTypes";
import useFetchCommentsOnTweets from "../../hooks/data-fetching/useFetchCommentsOnTweets";
// import useFetchCommentsOnComments from "../../hooks/data-fetching/useFetchCommentsOnComments";

const IndividualTweet: React.FC<IndividualTweetProps> = ({
  tweet,
  interaction,
}) => {
  const fetchCommentMutate = useFetchCommentsOnTweets();
  //   const fetchCommentOnCommentMutate = useFetchCommentsOnComments();
  const { mode } = useMode();
  const [showReply, setShowReply] = React.useState(false);
  const [showComments, setShowComments] = React.useState(false);

  const handleShowComments = () => {
    setShowComments(!showComments);
    fetchCommentMutate.mutate(tweet._id, {
      onSuccess: () => {
        // alert("Comments Fetched");
      },
    });
  };
  const handleShowReply = () => {
    setShowReply(!showReply);
    // fetchCommentOnCommentMutate.mutate(comment_id, {});
  };

  const styleMode1 = {
    m: "1%",
    backgroundColor: mode ? "#f7f6f6ff" : "transparent",
  };
  const styleMode2 = {
    m: "0.5% 1% 1% 1%",
    backgroundColor: mode ? "rgb(255,255,255)" : "rgb(0,0,0,0.7)",
  };

  // TODO: Need to Render reply button inside the second Card

  return (
    <Card key={tweet._id} variant="outlined">
      <Sample1 tweet={tweet} />
      {interaction && (
        <>
          <Sample2 handleShowComments={handleShowComments} disabled={false} />
          {showComments && (
            <Card sx={styleMode1}>
              <Sample1 tweet={tweet} />
              <Sample2 handleShowComments={handleShowReply} disabled={false} />
              {showReply && (
                <Card sx={styleMode2}>
                  <Sample1 tweet={tweet} />
                  <Sample2 disabled={true} />
                </Card>
              )}
            </Card>
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
