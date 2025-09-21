import useFetchLikedContent from "../hooks/data-fetching/useFetchLikedContent";
import useAuth from "../hooks/useAuth";
import { Box } from "@mui/material";

const LikedContent = () => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useFetchLikedContent(
    user?.user?._id || ""
  );
  if (isLoading || !data) return <div>...Loading Liked Content</div>;
  if (isError) return <div>...Encountered Error</div>;

  console.log(data);
  const show = data.map((item) => {
    if (Object.keys(item).includes("video")) {
      return (
        <Box key={item._id}>
          <Box>VIDEOS</Box>
          <Box>{JSON.stringify(item)}</Box>
        </Box>
      );
    }
    if (Object.keys(item).includes("comment")) {
      return (
        <Box key={item._id}>
          <Box>COMMENTS</Box>
          <Box>{JSON.stringify(item)}</Box>
        </Box>
      );
    }
    if (Object.keys(item).includes("tweet")) {
      return (
        <Box key={item._id}>
          <Box>TWEETS</Box>
          <Box>{JSON.stringify(item)}</Box>
        </Box>
      );
    }
  });
  return <div>{show}</div>;
};

export default LikedContent;
