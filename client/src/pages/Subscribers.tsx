import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { Box, Typography } from "@mui/material";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";
import useFetchUserSubscribers from "../hooks/data-fetching/useFetchUserSubscribers";
import useAuth from "../hooks/useAuth";
import convertISOIntoLocalTime from "../utilities/convertISOIntoLocalTime";
import NotLoggedIn from "./NotLoggedIn";

const Subscribers = () => {
  const { user } = useAuth();
  const { data, isPending, isError } = useFetchUserSubscribers(
    user?.user?._id || ""
  );
  if (isPending) return <div>...Loading Subscribers</div>;
  if (!data) return <div>No Subscribers</div>;
  if (isError) return <div>...Encountered Error</div>;
  if (!user) return <NotLoggedIn />;

  const renderSubscriberList = data.subscribers.map((sub) => (
    <Box
      key={sub._id}
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2,
        mb: 2,
        borderRadius: 2,
        boxShadow: 1,
        backgroundColor: "background.paper",
      }}
    >
      <Box
        component="img"
        src={sub.subscriberInfo.avatar}
        alt="user-avatar"
        sx={{
          height: 50,
          width: 50,
          borderRadius: "50%",
          marginRight: 2,
        }}
      />
      <Box>
        <Typography>
          {sub.subscriberInfo.fullname ?? "Unknown"}
          {sub.subscriberInfo.username && (
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
            >
              &nbsp;@{sub.subscriberInfo.username}
            </Typography>
          )}
        </Typography>
        <Typography variant="caption">
          {convertISOIntoLocalTime(sub.createdAt).toLocaleString()}
        </Typography>
      </Box>
    </Box>
  ));

  return (
    <Box m={1}>
      <HomeTabTitles
        text="Subscribers"
        icon={
          <PeopleAltOutlinedIcon sx={{ fontSize: 28, color: "primary.main" }} />
        }
      />
      <Box width="100%">{renderSubscriberList}</Box>
    </Box>
  );
};

export default Subscribers;
