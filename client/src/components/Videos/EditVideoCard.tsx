import React from "react";
import { Box, IconButton, Typography } from "@mui/material";
import DeleteForever from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import useMode from "../../hooks/useMode";
import IOSTypeSwitch from "../ui-components/IOSTypeSwitch";

const EditVideoCard: React.FC<EditVideoCardProps> = ({ video }) => {
  const { mode } = useMode();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        boxShadow: 2,
        borderRadius: 1,
        margin: "0px 1%",
        border: `2px solid ${mode ? "#A7E399" : "#44444E"}`,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box sx={{ display: "flex" }}>
          <Box
            component={"img"}
            src={imageSource}
            alt="video-thumbnail"
            sx={{
              height: 100,
              width: 150,
            }}
          />
        </Box>
        <Box>
          <Typography fontWeight={"bold"}>Video Title</Typography>
          <Typography
            fontWeight={"bold"}
            color="textSecondary"
            fontSize="0.8rem"
          >
            Video Description
          </Typography>
          <Typography color="textSecondary" fontSize="0.8rem">
            createAt
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mr: { xs: 0, sm: 4 },
        }}
      >
        <IconButton
          sx={{
            borderRadius: 2,
          }}
        >
          <DeleteForever color="error" />
          <Typography
            component={"span"}
            color="error"
            fontSize={"0.8rem"}
            fontWeight={"bold"}
          >
            Remove
          </Typography>
        </IconButton>
        <IconButton
          sx={{
            borderRadius: 2,
          }}
        >
          <EditIcon color="secondary" />
          <Typography
            component={"span"}
            color="secondary"
            fontSize={"0.8rem"}
            fontWeight={"bold"}
          >
            Changes
          </Typography>
        </IconButton>
        <IOSTypeSwitch videoId={video._id} isPublished={video.isPublished} />
      </Box>
    </Box>
  );
};

export default EditVideoCard;

const imageSource =
  "https://images.unsplash.com/photo-1760281853870-7a0bbf208d11?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170";

type EditVideoCardProps = {
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
