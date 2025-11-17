import { useState, type FC } from "react";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import useFetchUserVideos from "../../hooks/data-fetching/useFetchUserVideos";
import useAuth from "../../hooks/useAuth";
import EditVideoCard from "./EditVideoCard";
import LoadingAnimation from "../ui-components/LoadingAnimation";

const EditVideoOptions: FC<PropTypes> = ({ pageLimit }) => {
  const { user } = useAuth();
  const [page, setPage] = useState<number>(1);
  const { data, isLoading, isError } = useFetchUserVideos({
    userId: user?.user._id || "",
    page,
    limit: pageLimit,
  });
  if (isError) return <div>...Encountered Error</div>;
  if (isLoading) return <LoadingAnimation />;
  if (!data || data?.videos?.length < 1)
    return <div>No Videos Uploaded Yet</div>;

  const renderVideoCards = data?.videos?.map((video) => {
    return <EditVideoCard key={video._id} video={video} />;
  });

  const handlePagination = (value: number) => setPage(value);

  return (
    <>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, pt: 1 }}>
        {renderVideoCards}
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

export default EditVideoOptions;

type PropTypes = {
  pageLimit: number;
};
