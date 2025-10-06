import useFetchCommentsOnVideo from "../../hooks/data-fetching/useFetchCommentsOnVideo";
import { useParams } from "react-router-dom";
import CircularProgressCenter from "../ui-components/CircularProgressCenter";

const VideoCommentSection = () => {
  const { videoId } = useParams();
  const { data, isLoading, isError } = useFetchCommentsOnVideo(
    videoId || "INVALID_VIDEO_ID"
  );
  if (isLoading) return <CircularProgressCenter />;
  if (isError) return <div>....Encountered Error</div>;
  if (!data) return <div>No Comments</div>;

  const renderComments = data.map((comment) => {
    return <div key={comment._id}>{comment.content}</div>;
  });

  return <div>{renderComments}</div>;
};

export default VideoCommentSection;
