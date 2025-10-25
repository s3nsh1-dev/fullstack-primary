import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import SubscriberCard from "../subscribers/SubscriberCard";
import useFetchUserSubscribers from "../../hooks/data-fetching/useFetchUserSubscribers";
import { useOutletContext } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import LoadingAnimation from "../ui-components/LoadingAnimation";

const ShowSubscribed = () => {
  const outletContext = useOutletContext<OutletContextType | undefined>();
  const { user } = useAuth();

  const effectiveUserId = outletContext?.userId ?? user?.user?._id ?? "";

  const { data, isLoading, isError } = useFetchUserSubscribers(effectiveUserId);

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

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {renderSubscriberList}
    </Box>
  );
};

export default ShowSubscribed;

type OutletContextType = {
  userId: string;
};
