import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import convertISOIntoLocalTime from "../../utilities/convertISOIntoLocalTime";

const EditVideoCardVideoFace: React.FC<EditVideoCardVideoFaceProps> = ({
  video,
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ display: "flex" }}>
        <Box
          component={"img"}
          src={video?.thumbnail}
          alt="video-thumbnail"
          sx={{
            height: 100,
            width: 150,
            objectFit: "cover",
            borderTopLeftRadius: 2,
            borderBottomLeftRadius: 2,
          }}
        />
      </Box>
      <Box>
        <Typography
          fontWeight={"bold"}
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 1,
            overflow: "hidden",
          }}
        >
          {video?.title}
        </Typography>
        <Typography
          fontWeight={"bold"}
          color="textSecondary"
          fontSize="0.8rem"
          sx={{
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            WebkitLineClamp: 2,
            overflow: "hidden",
          }}
        >
          {video?.description}
        </Typography>
        <Typography color="textSecondary" fontSize="0.8rem">
          {convertISOIntoLocalTime(video?.createdAt)}
        </Typography>
      </Box>
    </Box>
  );
};

export default EditVideoCardVideoFace;

type EditVideoCardVideoFaceProps = {
  video: {
    _id: string;
    videoFile: string;
    thumbnail: string;
    title: string;
    description: string;
    duration: number;
    createdAt: string; // ISO date string
    isPublished: boolean;
    views: number;
    owner: string;
  };
};
