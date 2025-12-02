import { type FC } from "react";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import EditVideoCard from "./EditVideoCard";
import LoadingAnimation from "../ui-components/LoadingAnimation";
import useFetchVideosWithoutRestriction from "../../hooks/CRUD-hooks/useFetchVideosWithoutRestriction";
import { useSearchParams } from "react-router-dom";

const EditVideoOptions: FC<PropTypes> = ({ pageLimit }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get("page") || 1;

  const { data, isLoading, isError } = useFetchVideosWithoutRestriction({
    page: Number(currentPage),
    limit: pageLimit,
  });
  if (isError) return <div>...Encountered Error</div>;
  if (isLoading) return <LoadingAnimation />;
  if (!data || data?.videos?.length < 1)
    return <div>No Videos Uploaded Yet</div>;

  const renderVideoCards = data?.videos?.map((video) => {
    return <EditVideoCard key={video._id} video={video} />;
  });

  const handlePagination = (value: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", value.toString());
    setSearchParams(newParams);
  };

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
