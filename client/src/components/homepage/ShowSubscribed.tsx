import { type FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import SubscriberCard from "../subscribers/SubscriberCard";
import useFetchUserSubscribers from "../../hooks/data-fetching/useFetchUserSubscribers";
import { useOutletContext } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import LoadingAnimation from "../ui-components/LoadingAnimation";
import { useSearchParams } from "react-router-dom";

const ShowSubscribed: FC<PropType> = ({ pageLimit }) => {
  const outletContext = useOutletContext<OutletContextType | undefined>();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = searchParams.get("page") || 1;

  const effectiveUserId = outletContext?.userId ?? user?.user?._id ?? "";

  const { data, isLoading, isError } = useFetchUserSubscribers({
    userId: effectiveUserId,
    page: Number(currentPage),
    limit: pageLimit,
  });

  if (isError) return <div>...Encountered Error</div>;
  if (isLoading) return <LoadingAnimation />;
  if (!data || data.subscribers?.length === 0)
    return <Typography color="textSecondary">No Subscribers</Typography>;

  const renderSubscriberList = data.subscribers?.map((sub) => {
    return (
      <SubscriberCard
        key={sub?._id}
        fullname={sub.subscriber?.fullname || ""}
        username={sub.subscriber?.username || ""}
        avatar={sub.subscriber?.avatar}
        updatedAt={sub?.createdAt}
      />
    );
  });

  const handlePagination = (value: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", value.toString());
    setSearchParams(newParams);
  };

  return (
    <Box>
      <Typography pb={1} fontSize={13} color="textSecondary">
        Subscriber Count: {data.totalSubscribers}
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {renderSubscriberList}
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }} pt={1}>
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
      </Box>
    </Box>
  );
};

export default ShowSubscribed;

type OutletContextType = {
  userId: string;
};

type PropType = {
  pageLimit: number;
};
