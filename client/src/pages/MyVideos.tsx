import React from "react";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ShowVideos from "../components/homepage/ShowVideos";
import { Box, Typography, Divider, IconButton } from "@mui/material";
import { DividerRoot } from "../components/ui-components/StyledComponents";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import FormModal from "../components/others/FormModal";
import VideoUploadForm from "../components/Videos/VideoUploadForm";

const MyVideos = () => {
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const toggleModal = () => setOpenModal((prev) => !prev);

  return (
    <>
      <Box m={1}>
        <Box sx={sxValue}>
          <PlayCircleOutlineIcon />
          <Typography variant="h6" fontWeight="bold" whiteSpace={"nowrap"}>
            My Videos
          </Typography>
          <DividerRoot>
            <Divider textAlign="right">
              <Typography>
                <IconButton onClick={toggleModal}>
                  <VideoCallIcon fontSize="large" />
                </IconButton>
                Upload
              </Typography>
            </Divider>
          </DividerRoot>
        </Box>
        <ShowVideos />
      </Box>
      {openModal && (
        <FormModal toggleModal={toggleModal} open={openModal}>
          <VideoUploadForm
            onSubmit={(formData) => {
              console.log("Upload data:", formData);
              // Call your API here
              // uploadVideo(formData);
            }}
            onCancel={() => {
              toggleModal();
            }}
          />
        </FormModal>
      )}
    </>
  );
};

export default MyVideos;

const sxValue = {
  display: "flex",
  alignItems: "center",
  mb: 2,
  gap: 1,
};
