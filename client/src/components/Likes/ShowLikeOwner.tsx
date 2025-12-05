import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import useAuth from "../../hooks/useAuth";
import convertISOIntoLocalTime from "../../utilities/convertISOIntoLocalTime";
import ThumbsUpDownIcon from "@mui/icons-material/ThumbsUpDown";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const ShowLikeOwner = ({ timestamp }: { timestamp: string }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.up(792));
  const { user } = useAuth();
  return (
    <>
      {!isMobile ? (
        <></>
      ) : (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "end",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton>
              <ThumbsUpDownIcon fontSize="small" color="primary" />
            </IconButton>
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
