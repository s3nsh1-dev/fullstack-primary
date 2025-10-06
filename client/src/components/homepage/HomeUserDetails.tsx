import React from "react";
import { Box, Typography, Divider, Button, Stack } from "@mui/material";
import convertISOIntoLocalTime from "../../utilities/convertISOIntoLocalTime";
import HomeProfilePictures from "./HomeProfilePictures";
import type { HomePageFormatType } from "../../hooks/data-fetching/useFetchHomepageDetails";
import useAuth from "../../hooks/useAuth";
import { formatCount } from "../../utilities/helperFncForStats";

const HomeUserDetails: React.FC<HomeUserDetailsProps> = ({ data }) => {
  const { user } = useAuth();
  console.log("Content Data", user?.user);
  console.log("fetched data", data);
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
        coverImage={data.user.coverImage}
        avatar={data.user.avatar}
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
              {data.user.fullname}{" "}
              <Typography
                component="span"
                variant="caption"
                color="text.secondary"
              >
                @{data.user.username}
              </Typography>
            </Typography>
            <Typography variant="body2">
              Email:{" "}
              <Typography
                component="span"
                sx={{ fontStyle: "italic" }}
                variant="body2"
              >
                {data.user.email}
              </Typography>
            </Typography>
            <Typography variant="body2">
              Created: {convertISOIntoLocalTime(data.user.createdAt)}
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
              Subscribers: {formatCount(data.user.subscribers.length)}
            </Typography>
            <Typography variant="body2">
              Videos: {formatCount(data.user.videos.length)}
            </Typography>
            <Typography variant="body2">
              Tweets: {formatCount(data.user.tweets.length)}
            </Typography>
          </Box>
        </Box>
        <Button variant="contained" color="error" sx={{ ml: "0px" }}>
          Subscribe
        </Button>
      </Stack>
    </Box>
  );
};

export default HomeUserDetails;

type HomeUserDetailsProps = {
  data: {
    user: HomePageFormatType;
    isSubbed: boolean;
  };
};
