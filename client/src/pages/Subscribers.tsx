import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { Box } from "@mui/material";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";
import useFetchUserSubscribers from "../hooks/data-fetching/useFetchUserSubscribers";
import useAuth from "../hooks/useAuth";
import SubscriberCard from "../components/subscribers/SubscriberCard";
import ContentNotAvailable from "../components/others/ContentNotAvailable";
import CircularProgressCenter from "../components/ui-components/CircularProgressCenter";

const Subscribers = () => {
  const { user } = useAuth();
  const { data, isLoading, isError } = useFetchUserSubscribers(
    user?.user?._id || ""
  );
  if (isLoading) return <CircularProgressCenter size={20} />;
  if (!data) return <ContentNotAvailable text="No Subscribers" />;
  if (isError) return <div>...Encountered Error</div>;

  const renderSubscriberList = data.subscribers.map((sub) => {
    return (
      <SubscriberCard
        key={sub._id}
        subscriber={sub.subscriber.username || ""}
        avatar={sub.subscriber.avatar}
        fullname={sub.subscriber.fullname || ""}
        username={sub.subscriber.username || ""}
        updatedAt={sub.createdAt}
      />
    );
  });

  return (
    <Box m={1}>
      <HomeTabTitles
        text="Subscribers"
        icon={
          <PeopleAltOutlinedIcon sx={{ fontSize: 28, color: "primary.main" }} />
        }
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        {renderSubscriberList}
      </Box>
    </Box>
  );
};

export default Subscribers;
