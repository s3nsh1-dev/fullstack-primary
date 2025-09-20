import useMode from "../../hooks/useMode";
import { Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { backgroundColor } from "../../constants/uiConstants";
import useAuth from "../../hooks/useAuth";

const HomeProfilePictures = () => {
  const { mode } = useMode();
  const { user } = useAuth();
  const activeUser = user?.user;
  if (!activeUser) return <div>You are not logged in</div>;
  return (
    <Box
      className="hero-section"
      sx={{
        position: "relative",
        width: "100%",
        height: 250,
        bgcolor: "red",
        mb: 8,
      }}
    >
      {/* Cover Image */}
      <Box
        className="cover-image"
        sx={{
          width: "100%",
          height: "100%",
          //   backgroundImage: `url('/cover.jpg')`,
          backgroundImage: `url(${activeUser.coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          backgroundColor: "green",
        }}
      >
        {/* Edit icon for cover */}
        <Box
          sx={{
            position: "absolute",
            top: 8,
            right: 8,
            backgroundColor: mode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
            borderRadius: "50%",
            p: 0.5,
            cursor: "pointer",
          }}
        >
          <IconButton>
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Avatar */}
      <Box
        className="avatar"
        sx={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          overflow: "hidden",
          border: `3px solid ${
            mode ? backgroundColor.light : backgroundColor.dark
          }`,
          position: "absolute",
          bottom: -60,
          left: 24,
          backgroundImage: `url(${activeUser.avatar})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "blue",
        }}
      >
        {/* Edit icon for avatar */}
        <Box
          sx={{
            position: "absolute",
            bottom: 20,
            right: 35,
            backgroundColor: mode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
            borderRadius: "50%",
            p: 0.5,
            cursor: "pointer",
          }}
        >
          <IconButton>
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default HomeProfilePictures;
