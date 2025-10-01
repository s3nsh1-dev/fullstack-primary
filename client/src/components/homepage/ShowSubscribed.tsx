import type { SubscriberType } from "../../constants/dataTypes";
import { Box, Typography, Card, CardActionArea } from "@mui/material";
import convertISOIntoLocalTime from "../../utilities/convertISOIntoLocalTime";
import { Link } from "react-router-dom";

const ShowSubscribed = ({ subscribed }: { subscribed: SubscriberType[] }) => {
  if (!subscribed || subscribed.length === 0) {
    return <Typography color="textSecondary">No Subscribers</Typography>;
  }

  const renderSubscriberList = subscribed.map((sub) => {
    return (
      <Card
        key={sub._id}
        component={Link}
        to={`/channels/${sub.subscriber_id}/home`}
        sx={{ textDecoration: "none" }}
      >
        <CardActionArea sx={style1}>
          <Box component="img" src={sub.avatar} alt="user-avatar" sx={style2} />
          <Box>
            <Typography>
              {sub.fullname}
              <Typography
                component="span"
                variant="caption"
                color="text.secondary"
              >
                &nbsp;@{sub.username}
              </Typography>
            </Typography>
            <Typography variant="caption">
              {convertISOIntoLocalTime(sub.subscribedAt)}
            </Typography>
          </Box>
        </CardActionArea>
      </Card>
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

const style1 = {
  display: "flex",
  alignItems: "center",
  justifyContent: "start",
  p: 2, // padding inside the card
  borderRadius: 2, // rounded corners
  boxShadow: 1, // subtle shadow
  backgroundColor: "background.paper", // card background
};
const style2 = {
  height: 50,
  width: 50,
  borderRadius: "50%",
  marginRight: 2,
};
