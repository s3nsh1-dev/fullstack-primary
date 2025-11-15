import { useState, type FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import IndividualVideoUI from "../Videos/IndividualVideoUI";
import useFetchUserVideos from "../../hooks/data-fetching/useFetchUserVideos";
import { useOutletContext } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import LoadingAnimation from "../ui-components/LoadingAnimation";

const ShowVideos: FC<PropTypes> = ({ pageLimit }) => {
  // Safe optional access: may be undefined if not inside an Outlet
  const outletContext = useOutletContext<OutletContextType | undefined>();
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  // Prefer outlet userId if present; otherwise fallback to logged-in user
  const effectiveUserId = outletContext?.userId ?? user?.user?._id ?? "";
  const { data, isLoading, isError } = useFetchUserVideos({
    userId: effectiveUserId,
    page,
    limit: pageLimit,
  });

  if (isError) return <div>...Encountered Error</div>;
  if (isLoading) return <LoadingAnimation />;
  if (!data || data.videos?.length === 0) {
    return <Typography color="textSecondary">No Videos</Typography>;
  }

  const renderVideoList = data.videos?.map((video) => {
    return <IndividualVideoUI video={video} key={video._id} />;
  });

  const handlePagination = (value: number) => setPage(value);

  return (
    <>
      <Typography variant="caption" color="textSecondary">
        Total Videos: {data.totalVideos}
      </Typography>
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
      <Box sx={{ display: "flex", justifyContent: "center", pt: 2 }}>
        <Pagination
          color="secondary"
          variant="outlined"
          shape="rounded"
          page={data.currentPage}
          count={data.totalPages}
          onChange={(_, value) => handlePagination(value)}
          showFirstButton
          showLastButton
        />
      </Box>
    </>
  );
};
export default ShowVideos;

type OutletContextType = {
  userId: string | undefined;
};

type PropTypes = {
  pageLimit: number;
};
