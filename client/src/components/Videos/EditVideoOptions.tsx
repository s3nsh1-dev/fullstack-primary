import Box from "@mui/material/Box";
import useFetchUserVideos from "../../hooks/data-fetching/useFetchUserVideos";
import useAuth from "../../hooks/useAuth";
import EditVideoCard from "./EditVideoCard";
import LoadingAnimation from "../ui-components/LoadingAnimation";

const EditVideoOptions = () => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useFetchUserVideos(
    user?.user?._id || ""
  );
  if (isError) return <div>...Encountered Error</div>;
  if (isLoading) return <LoadingAnimation />;
  if (!data || data?.videos?.length < 1)
    return <div>No Videos Uploaded Yet</div>;

  const renderVideoCards = data?.videos?.map((video) => {
    return <EditVideoCard key={video._id} video={video} />;
  });

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, pt: 1 }}>
        {renderVideoCards}
      </Box>
    </>
  );
};

export default EditVideoOptions;
