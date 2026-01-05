import React from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import EditNoteIcon from "@mui/icons-material/EditNote";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import useAuth from "../hooks/useAuth";
import useMode from "../hooks/useMode";
import useUploadMyVideo from "../hooks/data-fetching/useUploadMyVideo";
import { DividerRoot } from "../components/ui-components/StyledComponents";
import VideoUploadForm from "../components/Videos/VideoUploadForm";
import FormModal from "../components/others/FormModal";
import ShowVideos from "../components/homepage/ShowVideos";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";
import NotLoggedIn from "./NotLoggedIn";

const MyVideos = () => {
  const { mode } = useMode();
  const { user, loading } = useAuth();
  const { mutate: uploadVideo } = useUploadMyVideo();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  if (!user && !loading) return <NotLoggedIn />;
  const toggleModal = () => setOpenModal((prev) => !prev);
  const theme = {
    bg: mode ? "#fff" : "#282828",
    text: mode ? "#0f0f0f" : "#fff",
    textSecondary: mode ? "#606060" : "#aaa",
    border: mode ? "#e0e0e0" : "#3f3f3f",
    hoverBg: mode ? "#f2f2f2" : "#3f3f3f",
    inputBg: mode ? "#f9f9f9" : "#121212",
    primaryBg: mode ? "#065fd4" : "#3ea6ff",
  };

  return (
    <>
      <Box p={2}>
        <Box sx={sxValue}>
          <HomeTabTitles
            text="My Videos"
            icon={<PlayCircleOutlineIcon color="secondary" />}
          />
          <DividerRoot>
            <Divider textAlign="right">
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Typography fontWeight={"bold"}>
                  <IconButton onClick={toggleModal}>
                    <VideoCallIcon fontSize="large" color="success" />
                  </IconButton>
                  Upload
                </Typography>
                <Typography
                  variant="caption"
                  px={1}
                  sx={{ color: !mode ? "#494949c9" : "#d4d4d4ff" }}
                >
                  -------
                </Typography>
                <Typography fontWeight={"bold"}>
                  <IconButton
                    onClick={() => {
                      navigate("/my-videos/edit");
                    }}
                  >
                    <EditNoteIcon fontSize="large" color="info" />
                  </IconButton>
                  Edit
                </Typography>
              </Box>
            </Divider>
          </DividerRoot>
        </Box>
        <ShowVideos pageLimit={12} />
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
                onSettled: () => {
                  toggleModal();
                },
              });
            }}
            onCancel={toggleModal}
            theme={theme}
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
