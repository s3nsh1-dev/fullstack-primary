import { Box, Typography, Avatar, IconButton } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import convertISOIntoLocalTime from "../../utilities/convertISOIntoLocalTime";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

const ShowLikeOwner = ({ timestamp }: { timestamp: string }) => {
  const { user } = useAuth();
  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton>
          <ThumbUpIcon fontSize="small" color="primary" />
        </IconButton>
        <Typography sx={{ mr: 1 }} variant="caption" color="textSecondary">
          by
        </Typography>
        <Avatar
          src={user?.user?.avatar}
          alt="my-avatar"
          sx={{ width: 25, height: 25 }}
        />
      </Box>
      <Typography variant="caption" color="textSecondary">
        {convertISOIntoLocalTime(timestamp)}
      </Typography>
    </Box>
  );
};

export default ShowLikeOwner;
