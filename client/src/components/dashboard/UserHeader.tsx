import React from "react";
import { Box, Avatar, Typography, IconButton } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import { formatDate } from "../../utilities/helperFncForStats";
import type { Owner } from "../../hooks/data-fetching/useFetchFeed";

const UserHeader: React.FC<{ owner: Owner; createdAt: string }> = ({
  owner,
  createdAt,
}) => {
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
      <IconButton size="small">
        <MoreVert fontSize="small" />
      </IconButton>
    </Box>
  );
};

export default UserHeader;
