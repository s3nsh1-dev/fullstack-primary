import React from "react";
import useMode from "../../hooks/useMode";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { backgroundColor } from "../../constants/uiConstants";

const HomeProfilePictures: React.FC<HomeProfilePicturesProps> = ({
  coverImage,
  avatar,
}) => {
  const { mode } = useMode();

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
          backgroundImage: `url(${coverImage})`,
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
          backgroundImage: `url(${avatar})`,
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

type HomeProfilePicturesProps = {
  coverImage: string;
  avatar: string;
};
