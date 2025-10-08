import { Box, Typography } from "@mui/material";
import SubscriberCard from "../subscribers/SubscriberCard";
import CircularProgressCenter from "../ui-components/CircularProgressCenter";
import useFetchUserSubscribers from "../../hooks/data-fetching/useFetchUserSubscribers";
import { useOutletContext } from "react-router-dom";

const ShowSubscribed = () => {
  const { userId } = useOutletContext<OutletContextType>();
  const { data, isLoading, isError } = useFetchUserSubscribers(userId || "");

  if (isError) return <div>...Encountered Error</div>;
  if (isLoading) return <CircularProgressCenter size={20} />;
  if (!data || data.subscribers?.length === 0)
    return <Typography color="textSecondary">No Subscribers</Typography>;

  const renderSubscriberList = data.subscribers?.map((sub) => {
    return (
      <SubscriberCard
        key={sub._id}
        fullname={sub.subscriber.fullname || ""}
        username={sub.subscriber.username || ""}
        avatar={sub.subscriber.avatar}
        updatedAt={sub.createdAt}
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
