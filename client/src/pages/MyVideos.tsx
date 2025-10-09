import React from "react";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import ShowVideos from "../components/homepage/ShowVideos";
import { Box, Typography, Divider, IconButton } from "@mui/material";
import { DividerRoot } from "../components/ui-components/StyledComponents";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import FormModal from "../components/others/FormModal";
import VideoUploadForm from "../components/Videos/VideoUploadForm";
import useUploadMyVideo from "../hooks/data-fetching/useUploadMyVideo";
import { useQueryClient } from "@tanstack/react-query";
import useAuth from "../hooks/useAuth";

const MyVideos = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const toggleModal = () => setOpenModal((prev) => !prev);
  const { mutate: uploadVideo } = useUploadMyVideo();

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
              uploadVideo(formData, {
                onSuccess: () => {
                  queryClient.invalidateQueries({
                    queryKey: ["fetchVideos", user?.user?._id],
                  });
                },
              });
              toggleModal();
            }}
            onCancel={toggleModal}
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
