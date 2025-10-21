import React from "react";
import { Box, Typography, Divider, Button, Stack } from "@mui/material";
import convertISOIntoLocalTime from "../../utilities/convertISOIntoLocalTime";
import HomeProfilePictures from "./HomeProfilePictures";
import { formatCount } from "../../utilities/helperFncForStats";
import useToggleSubscription from "../../hooks/data-fetching/useToggleSubscription";

const HomeUserDetails: React.FC<HomeUserDetailsProps> = ({ data }) => {
  console.log(data.isSubbed);
  const subMutate = useToggleSubscription();
  const [subbed, setSubbed] = React.useState(data?.isSubbed);
  const [subCount, setSubCount] = React.useState(data?.totalSubscribers);
  const handleSubscribe = () => {
    subMutate.mutate(data.user?._id, {
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
    <Box
      mb={1}
      sx={{
        boxShadow: 1,
        backgroundColor: "background.paper",
      }}
    >
      {/* Profile Pictures */}
      <HomeProfilePictures
        coverImage={data.user?.coverImage}
        avatar={data.user?.avatar}
      />
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={1}
        justifyContent={"space-between"}
        sx={{ px: 2, py: 1 }}
      >
        {/* User Info */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 1,
            alignItems: { xs: "flex-start", sm: "center" },
          }}
        >
          {/* Left: Basic Info */}

          <Box>
            <Typography variant="h5" fontWeight="bold">
              {data.user?.fullname}{" "}
              <Typography
                component="span"
                variant="caption"
                color="text.secondary"
              >
                @{data.user?.username}
              </Typography>
            </Typography>
            <Typography variant="body2">
              Email:{" "}
              <Typography
                component="span"
                sx={{ fontStyle: "italic" }}
                variant="body2"
              >
                {data.user?.email}
              </Typography>
            </Typography>
            <Typography variant="body2">
              Created: {convertISOIntoLocalTime(data.user?.createdAt)}
            </Typography>
          </Box>

          {/* Divider */}
          <Divider
            orientation="vertical"
            flexItem
            sx={{ display: { xs: "none", sm: "block" }, mx: { xs: 0, sm: 2 } }}
          />

          {/* Right: Stats */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
            <Typography variant="body2">
              Subscribers: {formatCount(subCount)}
            </Typography>
            <Typography variant="body2">
              Videos: {formatCount(data?.totalVideos)}
            </Typography>
            <Typography variant="body2">
              Tweets: {formatCount(data?.totalTweets)}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          onClick={handleSubscribe}
          sx={{
            ml: "0px",
            backgroundColor: subbed ? "grey" : "red",
          }}
        >
          {subbed ? "Subscribed" : "Subscribe"}
        </Button>
      </Stack>
    </Box>
  );
};

export default HomeUserDetails;

type HomeUserDetailsProps = {
  data: {
    user: {
      _id: string;
      username: string;
      email: string;
      fullname: string;
      avatar: string;
      coverImage: string;
      createdAt: string; // ISO date string
    };
    isSubbed: boolean;
    totalSubscribers: number;
    totalVideos: number;
    totalTweets: number;
  };
};
