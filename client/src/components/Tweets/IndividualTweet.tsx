import React from "react";
import Sample1 from "./Sample1";
import Sample2 from "./Sample2";
// import Sample3 from "./Sample3";
// import Sample4 from "./Sample4";
import Sample5 from "./Sample5";
import { Card } from "@mui/material";
// import useMode from "../../hooks/useMode";
import type { TweetType } from "../../hooks/data-fetching/useFetchUserTweets";
import useFetchCommentsOnTweets from "../../hooks/data-fetching/useFetchCommentsOnTweets";
// import useFetchCommentsOnComments from "../../hooks/data-fetching/useFetchCommentsOnComments";

const IndividualTweet: React.FC<IndividualTweetProps> = ({
  tweet,
  interaction,
}) => {
  const fetchCommentMutate = useFetchCommentsOnTweets();
  // const fetchCommentOnCommentMutate = useFetchCommentsOnComments();
  // const { mode } = useMode();
  // const [showReply, setShowReply] = React.useState(false);
  const [showComments, setShowComments] = React.useState(false);
  const handleShowComments = () => {
    setShowComments(!showComments);
    fetchCommentMutate.mutate(tweet._id, {
      onSuccess: () => {},
    });
  };
  // const handleShowReply = () => {
  //   setShowReply(!showReply);
  //   fetchCommentOnCommentMutate.mutate(
  //     fetchCommentMutate.data?.comments.docs[0]._id || "",
  //     {
  //       onSuccess: () => {},
  //     }
  //   );
  // };

  // const styleMode1 = {
  //   m: "1%",
  //   backgroundColor: mode ? "#f7f6f6ff" : "transparent",
  // };
  // const styleMode2 = {
  //   m: "0.5% 1% 1% 1%",
  //   backgroundColor: mode ? "rgb(255,255,255)" : "rgb(0,0,0,0.7)",
  // };

  // TODO: Need to Render reply button inside the second Card
  console.log("Rendering IndividualTweet");
  return (
    <Card key={tweet._id} variant="outlined">
      <Sample1 tweet={tweet} />
      {interaction && (
        <>
          <Sample2 handleShowComments={handleShowComments} disabled={false} />
          {!fetchCommentMutate.isPending && (
            <div>
              {fetchCommentMutate.data?.comments.docs.map((comment) => (
                <div key={comment._id}>
                  <Sample5 comment={comment} />
                </div>
              ))}
            </div>
          )}
          {/* {showComments && (
            <Card sx={styleMode1}>
              {fetchCommentMutate.isPending ? (
                <div>...Loading Comments</div>
              ) : (
                <>
                  <Sample3 tweet={tweet} />
                  <Sample4
                    handleShowComments={handleShowReply}
                    disabled={false}
                  />
                </>
              )}
              {showReply && (
                <Card sx={styleMode2}>
                  <Sample3 tweet={tweet} />
                  <Sample4 disabled={true} />
                </Card>
              )}
            </Card>
          )} */}
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
