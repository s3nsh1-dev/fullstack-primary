import { Box, Typography } from "@mui/material";
import SubscriberCard from "../subscribers/SubscriberCard";
import { useOutletContext } from "react-router-dom";
import type { HomePageFormatType } from "../../hooks/data-fetching/useFetchHomepageDetails";

const ShowSubscribed = () => {
  const { data } = useOutletContext<OutletContextType>();
  if (!data || data.user.subscribers.length === 0) {
    return <Typography color="textSecondary">No Subscribers</Typography>;
  }

  const renderSubscriberList = data.user.subscribers.map((sub) => {
    return (
      <SubscriberCard
        key={sub._id}
        subscriber={sub.username}
        fullname={sub.fullname}
        username={sub.username}
        avatar={sub.avatar}
        updatedAt={sub.subscribedAt}
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

interface OutletContextType {
  data: {
    user: HomePageFormatType;
    isSubbed: boolean;
  };
  interaction: boolean;
}
