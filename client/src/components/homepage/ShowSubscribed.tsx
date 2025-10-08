import { Box } from "@mui/material";
import SubscriberCard from "../subscribers/SubscriberCard";
import useAuth from "../../hooks/useAuth";
import CircularProgressCenter from "../ui-components/CircularProgressCenter";
import useFetchUserSubscribers from "../../hooks/data-fetching/useFetchUserSubscribers";
import ContentNotAvailable from "../others/ContentNotAvailable";

const ShowSubscribed = () => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useFetchUserSubscribers(
    user?.user?._id || ""
  );
  if (isLoading) return <CircularProgressCenter size={20} />;
  if (!data) return <ContentNotAvailable text="No Subscribers" />;
  if (isError) return <div>...Encountered Error</div>;

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
