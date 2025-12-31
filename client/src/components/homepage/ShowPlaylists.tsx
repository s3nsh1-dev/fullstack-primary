import Typography from "@mui/material/Typography";
import useFetchUserPlaylist from "../../hooks/data-fetching/useFetchUserPlaylist";
import CircularProgressCenter from "../ui-components/CircularProgressCenter";
import { useOutletContext } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import PlaylistContainer from "../playlist/PlaylistContainer";
import Pagination from "@mui/material/Pagination";
import { useSearchParams } from "react-router-dom";
import Stack from "@mui/material/Stack";

const ShowPlaylists = () => {
  const outletContext = useOutletContext<OutletContextType | undefined>();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get("page") || 1;
  const effectiveUserId = outletContext?.userId ?? user?.user?._id ?? "";

  const { data, isLoading, isError } = useFetchUserPlaylist({
    userId: effectiveUserId,
    limit: LIMIT,
    page: Number(currentPage),
  });

  if (isError) return <div>...Encountered Error</div>;
  if (isLoading) return <CircularProgressCenter size={20} />;
  if (!data || data?.length === 0)
    return <Typography color="textSecondary">No Playlists</Typography>;

  const handlePagination = (value: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", value.toString());
    setSearchParams(newParams);
  };

  return (
    <>
      <PlaylistContainer data={data} isLoading={isLoading} isError={isError} />
      <Stack alignItems={"center"} pt={2}>
        <Pagination
          variant="outlined"
          shape="rounded"
          color="secondary"
          count={data.totalPages}
          page={data.currentPage}
          onChange={(_, value) => handlePagination(value)}
          showFirstButton
          showLastButton
        />
      </Stack>
    </>
  );
};

export default ShowPlaylists;

type OutletContextType = {
  userId: string;
};

const LIMIT = 5;
