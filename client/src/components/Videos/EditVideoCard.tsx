import React from "react";
import { Box, IconButton, Typography, Divider, Card } from "@mui/material";
import DeleteForever from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import IOSTypeSwitch from "../ui-components/IOSTypeSwitch";
import convertISOIntoLocalTime from "../../utilities/convertISOIntoLocalTime";

const EditVideoCard: React.FC<EditVideoCardProps> = ({ video }) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        justifyContent: "space-between",
        borderRadius: 1,
        margin: "0px 1%",
        // border: `1px solid grey`,
      }}
      elevation={4}
    >
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
          <Typography fontWeight={"bold"}>{video?.title}</Typography>
          <Typography
            fontWeight={"bold"}
            color="textSecondary"
            fontSize="0.8rem"
          >
            {video?.description}
          </Typography>
          <Typography color="textSecondary" fontSize="0.8rem">
            {convertISOIntoLocalTime(video?.createdAt)}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-evenly",
          margin: { xs: "5px auto", sm: "auto 10px auto auto" },
          // mr: { xs: "auto", sm: 4 },
          border: "1px solid grey",
          width: { xs: "90%", sm: "25%" },
          height: 50,
          borderRadius: 10,
          backgroundColor: "rgba(128, 128, 128, 0.2)", // light, subtle grey
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
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            borderRightWidth: "0.5px",
            borderColor: "grey.600",
          }}
        />
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
        <Divider
          orientation="vertical"
          flexItem
          sx={{
            borderRightWidth: "0.5px",
            borderColor: "grey.600",
          }}
        />
        <IOSTypeSwitch videoId={video._id} isPublished={video.isPublished} />
      </Box>
    </Card>
  );
};

export default EditVideoCard;

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
