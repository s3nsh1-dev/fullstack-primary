import type { VideoType } from "../../constants/dataTypes";

const ShowVideos = ({ videos }: { videos: VideoType[] }) => {
  console.log("videos", videos);
  return <div>Show User Videos</div>;
};

export default ShowVideos;
