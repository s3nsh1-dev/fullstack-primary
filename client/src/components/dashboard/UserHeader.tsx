import React from "react";
import { Box, Avatar, Typography } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import { formatDate } from "../../utilities/helperFncForStats";
import type { Owner } from "../../hooks/data-fetching/useFetchFeed";

const UserHeader: React.FC<{
  owner: Owner;
  createdAt: string;
  isTweet: boolean;
}> = ({ owner, createdAt, isTweet }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      mb={1.5}
    >
      <Box display="flex" alignItems="center" gap={1.5}>
        <Avatar
          src={owner.avatar}
          alt={owner.fullname}
          sx={{ width: 40, height: 40 }}
        />
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            {owner.fullname}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            @{owner.username} · {formatDate(createdAt)}
          </Typography>
        </Box>
      </Box>
      {isTweet ? (
        <TwitterIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
      ) : (
        <OndemandVideoIcon color="error" fontSize="small" sx={{ mr: 1 }} />
      )}
    </Box>
  );
};

export default UserHeader;
