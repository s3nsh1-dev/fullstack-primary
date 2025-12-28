import { type FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import IndividualVideoUI from "../Videos/IndividualVideoUI";
import useFetchUserVideos from "../../hooks/data-fetching/useFetchUserVideos";
import { useOutletContext } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import LoadingAnimation from "../ui-components/LoadingAnimation";
import { useSearchParams } from "react-router-dom";

const ShowVideos: FC<PropTypes> = ({ pageLimit }) => {
  // Safe optional access: may be undefined if not inside an Outlet
  const outletContext = useOutletContext<OutletContextType | undefined>();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get("page") || 1;
  // Prefer outlet userId if present; otherwise fallback to logged-in user
  const effectiveUserId = outletContext?.userId ?? user?.user?._id ?? "";
  const { data, isLoading, isError } = useFetchUserVideos({
    userId: effectiveUserId,
    page: Number(currentPage),
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

  const handlePagination = (value: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", value.toString());
    setSearchParams(newParams);
  };

  return (
    <>
      <Typography pb={1} fontSize={13} color="textSecondary">
        Total Videos: {data.totalVideos}
      </Typography>
      <Box sx={gridPlaylistContainer}>{renderVideoList}</Box>
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

const gridPlaylistContainer = {
  display: "grid",
  gridTemplateColumns: {
    xs: "repeat(1, 1fr)",
    sm: "repeat(2, 1fr)",
    md: "repeat(3, 1fr)",
    lg: "repeat(4, 1fr)",
  },
  gap: 2,
};
