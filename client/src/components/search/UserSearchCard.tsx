import React from "react";
import { Card, Typography, Avatar, Box } from "@mui/material";
import CheckCircle from "@mui/icons-material/CheckCircle";
import type { UserSearchResult } from "../../hooks/searching/useSearchUserQuery";
import { getTimeAgo } from "../../utilities/helperFncForStats";

export const UserSearchCard: React.FC<UserSearchCardProps> = ({
  user,
  onClick,
}) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        cursor: "pointer",
        transition: "background-color 0.2s",
        "&:hover": {
          backgroundColor: "action.hover",
        },
        boxShadow: "none",
        border: "1px solid",
        borderColor: "divider",
        py: 2,
        px: 3,
      }}
    >
      {/* Avatar */}
      <Avatar
        src={user.avatar}
        alt={user.username}
        sx={{
          width: 136,
          height: 136,
          mr: 3,
        }}
      />

      {/* Content */}
      <Box sx={{ flex: 1 }}>
        {/* Name with verified badge */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 0.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            {user.fullname}
          </Typography>
          <CheckCircle sx={{ fontSize: 16, color: "text.secondary" }} />
        </Box>

        {/* Username handle */}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          @{user.username}
        </Typography>

        {/* Join date */}
        <Typography variant="body2" color="text.secondary">
          Joined {getTimeAgo(user.createdAt)}
        </Typography>
      </Box>
    </Card>
  );
};

interface UserSearchCardProps {
  user: UserSearchResult;
  onClick?: () => void;
}
