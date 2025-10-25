import React from "react";
import { formatCount } from "../../utilities/helperFncForStats";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import useToggleSubscription from "../../hooks/data-fetching/useToggleSubscription";
import useAuth from "../../hooks/useAuth";

const ChannelProfileSubInfo: React.FC<ChannelProfileSubInfoProps> = ({
  channelInfo,
  theme,
}) => {
  const { user } = useAuth();
  const [subbed, setSubbed] = React.useState(channelInfo.isSubbed);
  const [subCount, setSubCount] = React.useState(channelInfo.mySubCount);
  const subscriptionMutate = useToggleSubscription();
  const toggleSubbed = () => {
    if (!user) return alert("Please Login to Subscribe to this channel");
    subscriptionMutate.mutate(channelInfo._id, {
      onSuccess: (response) => {
        if ("channel" in response) {
          setSubbed(true);
          setSubCount((prev) => prev + 1);
        } else {
          setSubbed(false);
          setSubCount((prev) => prev - 1);
        }
      },
    });
  };

  return (
    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
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
          {formatCount(subCount)} subscribers
        </Typography>
      </Box>
      <Button
        variant="contained"
        onClick={toggleSubbed}
        sx={{
          bgcolor: subbed ? "grey" : "red",
          color: theme.subscribeText,
          borderRadius: 5,
          textTransform: "none",
          fontWeight: 600,
          px: 3,
          "&:hover": {
            bgcolor: "white",
            color: subbed ? "black" : "red",
          },
        }}
      >
        {subbed ? "Subscribed" : "Subscribe"}
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
  mySubCount: number;
  meSubbingCount: number;
  isSubbed: boolean;
};
