import React from "react";

import { Stack, Avatar, Typography, Box, Button } from "@mui/material";

const ChannelProfileSubInfo: React.FC<ChannelProfileSubInfoProps> = ({
  channelInfo,
  theme,
}) => {
  return (
    <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ mb: 2 }}>
      <Avatar
        src={channelInfo.avatar}
        sx={{
          width: 40,
          height: 40,
        }}
      />

      <Box>
        <Typography variant="h6" sx={{ color: theme.text, fontWeight: 600 }}>
          {channelInfo.fullname}
        </Typography>
        <Typography variant="subtitle1" sx={{ color: theme.textSecondary }}>
          {channelInfo.subscriberCount} subscribers
        </Typography>
      </Box>
      <Button
        variant="contained"
        sx={{
          bgcolor: !channelInfo.isSubscribed ? "grey" : "red",
          color: theme.subscribeText,
          borderRadius: 5,
          textTransform: "none",
          fontWeight: 600,
          px: 3,
          "&:hover": {
            bgcolor: "white",
            color: channelInfo.isSubscribed ? "black" : "red",
          },
        }}
      >
        {channelInfo.isSubscribed ? "Subscribed" : "Subscribe"}
      </Button>
    </Stack>
  );
};

export default ChannelProfileSubInfo;

type ChannelProfileSubInfoProps = {
  theme: {
    paperBg: string;
    text: string;
    textSecondary: string;
    subscribeBg: string;
    subscribeText: string;
    subscribeBgHover: string;
    hoverBg: string;
  };
  channelInfo: UserChannel;
};

type UserChannel = {
  _id: string;
  username: string;
  email: string;
  fullname: string;
  avatar: string;
  coverImage: string;
  subscriberCount: number;
  channelSubscribedToCount: number;
  isSubscribed: boolean;
};
