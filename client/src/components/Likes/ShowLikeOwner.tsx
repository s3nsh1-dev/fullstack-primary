import { Box, Typography, Avatar, IconButton } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import convertISOIntoLocalTime from "../../utilities/convertISOIntoLocalTime";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { useTheme, useMediaQuery } from "@mui/material";

const ShowLikeOwner = ({ timestamp }: { timestamp: string }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.up(792));
  const { user } = useAuth();
  return (
    <>
      {!isMobile ? (
        <></>
      ) : (
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
      )}
    </>
  );
};

export default ShowLikeOwner;
