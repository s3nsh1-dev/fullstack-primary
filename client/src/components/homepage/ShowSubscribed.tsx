import type { SubscriberType } from "../../constants/dataTypes";
import { Box, Typography } from "@mui/material";
import convertISOIntoLocalTime from "../../utilities/convertISOIntoLocalTime";

const ShowSubscribed = ({ subscribed }: { subscribed: SubscriberType[] }) => {
  const renderSubscriberList = subscribed.map((sub) => (
    <Box
      key={sub._id}
      sx={{
        display: "flex",
        alignItems: "center",
        p: 2, // padding inside the card
        mb: 2, // spacing between cards
        borderRadius: 2, // rounded corners
        boxShadow: 1, // subtle shadow
        backgroundColor: "background.paper", // card background
        "&:hover": {
          boxShadow: 3, // hover effect
        },
      }}
    >
      <Box
        component="img"
        src={sub.avatar}
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
          {sub.fullname}
          <Typography component="span" variant="caption" color="text.secondary">
            &nbsp;@{sub.username}
          </Typography>
        </Typography>
        <Typography variant="caption">
          {convertISOIntoLocalTime(sub.subscribedAt)}
        </Typography>
      </Box>
    </Box>
  ));

  return <Box sx={{ m: 1 }}>{renderSubscriberList}</Box>;
};

export default ShowSubscribed;
