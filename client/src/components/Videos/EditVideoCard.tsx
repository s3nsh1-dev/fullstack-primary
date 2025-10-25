import React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Card from "@mui/material/Card";
import DeleteForever from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import IOSTypeSwitch from "../ui-components/IOSTypeSwitch";
import EditVideoCardVideoFace from "./EditVideoCardVideoFace";
import DeleteConfirmationModal from "./DeleteConfirmationModal";
import UpdateVideoModal from "./UpdateVideoModal";

const EditVideoCard: React.FC<EditVideoCardProps> = ({ video }) => {
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openUpdate, setOpenUpdate] = React.useState(false);

  return (
    <>
      <Card sx={sxCard} elevation={4}>
        <EditVideoCardVideoFace video={video} />
        <Box sx={sxV1}>
          <IconButton
            sx={sxV2}
            onClick={() => {
              setOpenDelete(true);
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
          <Divider orientation="vertical" flexItem sx={sxV3} />
          <IconButton
            sx={sxV2}
            onClick={() => {
              setOpenUpdate(true);
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
          <Divider orientation="vertical" flexItem sx={sxV3} />
          <IOSTypeSwitch video={video} isPublished={video.isPublished} />
        </Box>
      </Card>
      {openDelete && (
        <DeleteConfirmationModal
          open={openDelete}
          onClose={() => {
            setOpenDelete(false);
          }}
          video={video}
        />
      )}
      {openUpdate && (
        <UpdateVideoModal
          open={openUpdate}
          onClose={() => {
            setOpenUpdate(false);
          }}
          video={video}
        />
      )}
    </>
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

const sxV1 = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-evenly",
  margin: { xs: "5px auto", md: "auto 10px auto auto" },
  border: "1px solid grey",
  width: 330,
  height: 50,
  borderRadius: 10,
  backgroundColor: "rgba(128, 128, 128, 0.2)", // light, subtle grey
};

const sxV2 = {
  borderRadius: 2,
};

const sxV3 = {
  borderRightWidth: "0.5px",
  borderColor: "grey.600",
};

const sxCard = {
  display: "flex",
  flexDirection: { xs: "column", md: "row" },
  justifyContent: "space-between",
  borderRadius: 1,
  margin: "0px 1%",
  // border: `1px solid grey`,
};
