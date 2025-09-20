import { Box, Typography, Divider } from "@mui/material";
import convertISOIntoLocalTime from "../../utilities/convertISOIntoLocalTime";
import HomeProfilePictures from "./HomeProfilePictures";
import type { HomePageFormatType } from "../../constants/dataTypes";

const HomeUserDetails = ({ data }: { data: HomePageFormatType }) => {
  console.log();
  return (
    <Box
      mb={1}
      sx={{
        boxShadow: 1,
        backgroundColor: "background.paper",
      }}
    >
      {/* Profile Pictures */}
      <HomeProfilePictures />

      {/* User Info */}
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1,
          alignItems: { xs: "flex-start", sm: "center" },
          px: 2,
          py: 1,
        }}
      >
        {/* Left: Basic Info */}
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            {data.fullname}{" "}
            <Typography
              component="span"
              variant="caption"
              color="text.secondary"
            >
              @{data.username}
            </Typography>
          </Typography>
          <Typography variant="body2">
            Email:{" "}
            <Typography
              component="span"
              sx={{ fontStyle: "italic" }}
              variant="body2"
            >
              {data.email}
            </Typography>
          </Typography>
          <Typography variant="body2">
            Created: {convertISOIntoLocalTime(data.createdAt)}
          </Typography>
        </Box>

        {/* Divider */}
        <Divider
          orientation="vertical"
          flexItem
          sx={{ display: { xs: "none", sm: "block" } }}
        />

        {/* Right: Stats */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
          <Typography variant="body2">
            Subscribers: {data.subscribers.length}
          </Typography>
          <Typography variant="body2">Videos: {data.videos.length}</Typography>
          <Typography variant="body2">Tweets: {data.tweets.length}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default HomeUserDetails;
