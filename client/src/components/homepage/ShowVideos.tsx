import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IndividualVideoUI from "../Videos/IndividualVideoUI";
import useFetchUserVideos from "../../hooks/data-fetching/useFetchUserVideos";
import { useOutletContext } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import LoadingAnimation from "../ui-components/LoadingAnimation";

const ShowVideos = () => {
  // Safe optional access: may be undefined if not inside an Outlet
  const outletContext = useOutletContext<OutletContextType | undefined>();
  const { user } = useAuth();

  // Prefer outlet userId if present; otherwise fallback to logged-in user
  const effectiveUserId = outletContext?.userId ?? user?.user?._id ?? "";
  const { data, isLoading, isError } = useFetchUserVideos(effectiveUserId);

  if (isError) return <div>...Encountered Error</div>;
  if (isLoading) return <LoadingAnimation />;
  if (!data || data.videos?.length === 0) {
    return <Typography color="textSecondary">No Videos</Typography>;
  }

  const renderVideoList = data.videos?.map((video) => {
    return <IndividualVideoUI video={video} key={video._id} />;
  });

  return (
    <Box sx={{ margin: "auto", display: "flex", justifyContent: "center" }}>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "12px",
        }}
      >
        {renderVideoList}
      </Box>
    </Box>
  );
};
export default ShowVideos;

type OutletContextType = {
  userId: string | undefined;
};
