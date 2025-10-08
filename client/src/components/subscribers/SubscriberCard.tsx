import React from "react";
import { Box, Card, CardActionArea, Typography } from "@mui/material";
import convertISOIntoLocalTime from "../../utilities/convertISOIntoLocalTime";
import { Link } from "react-router-dom";

const SubscriberCard: React.FC<SubscriberCardProps> = ({
  subscriber,
  avatar,
  fullname,
  username,
  updatedAt,
}) => {
  return (
    <Card
      component={Link}
      to={`/${subscriber}`}
      sx={{ textDecoration: "none" }}
      elevation={4}
    >
      <CardActionArea sx={style1}>
        <Box component="img" src={avatar} alt="user-avatar" sx={style2} />
        <Box>
          <Typography>
            {fullname}
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
            >
              &nbsp;@{username}
            </Typography>
          </Typography>
          <Typography variant="caption">
            {convertISOIntoLocalTime(updatedAt)}
          </Typography>
        </Box>
      </CardActionArea>
    </Card>
  );
};

export default SubscriberCard;

type SubscriberCardProps = {
  subscriber: string;
  avatar: string;
  fullname: string;
  username: string;
  updatedAt: string;
};

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
