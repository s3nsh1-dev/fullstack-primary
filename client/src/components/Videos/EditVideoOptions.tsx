import useFetchUserVideos from "../../hooks/data-fetching/useFetchUserVideos";
import useAuth from "../../hooks/useAuth";
import CircularProgressCenter from "../ui-components/CircularProgressCenter";
import EditVideoCard from "./EditVideoCard";

const EditVideoOptions = () => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useFetchUserVideos(
    user?.user?._id || ""
  );
  if (isError) return <div>...Encountered Error</div>;
  if (isLoading) return <CircularProgressCenter size={80} />;
  if (!data || data?.videos?.length < 1)
    return <div>No Videos Uploaded Yet</div>;

  const renderVideoCards = data?.videos?.map((video) => {
    return <EditVideoCard key={video._id} video={video} />;
  });

  return <>{renderVideoCards}</>;
};

export default EditVideoOptions;
