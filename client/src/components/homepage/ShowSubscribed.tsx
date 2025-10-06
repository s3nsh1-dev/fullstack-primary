import type { SubscriberType } from "../../constants/dataTypes";
import { Box, Typography } from "@mui/material";
import SubscriberCard from "../subscribers/SubscriberCard";

const ShowSubscribed = ({ subscribed }: { subscribed: SubscriberType[] }) => {
  if (!subscribed || subscribed.length === 0) {
    return <Typography color="textSecondary">No Subscribers</Typography>;
  }

  const renderSubscriberList = subscribed.map((sub) => {
    return (
      <SubscriberCard
        key={sub._id}
        subscriber={sub.subscriber_id}
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
