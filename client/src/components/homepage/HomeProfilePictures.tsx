import React from "react";
import useMode from "../../hooks/useMode";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import { backgroundColor } from "../../constants/uiConstants";
import FormModal from "../others/FormModal";
import UpdateAvatar from "./UpdateAvatar";
import UpdateCoverImage from "./UpdateCoverImage";

const HomeProfilePictures: React.FC<HomeProfilePicturesProps> = ({
  coverImage,
  avatar,
}) => {
  const { mode } = useMode();
  const sx2 = {
    width: "100%",
    height: "100%",
    backgroundImage: `url(${coverImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    position: "relative",
    backgroundColor: "green",
  };
  const sx3 = {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: mode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
    borderRadius: "50%",
    p: 0.5,
    cursor: "pointer",
  };

  const sx4 = {
    width: 200,
    height: 200,
    borderRadius: "50%",
    overflow: "hidden",
    border: `3px solid ${mode ? backgroundColor.light : backgroundColor.dark}`,
    position: "absolute",
    bottom: -60,
    left: 24,
    backgroundImage: `url(${avatar})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundColor: "blue",
  };
  const sx5 = {
    position: "absolute",
    bottom: 20,
    right: 35,
    backgroundColor: mode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
    borderRadius: "50%",
    p: 0.5,
    cursor: "pointer",
  };

  const [avatarModal, setAvatarModal] = React.useState<boolean>(false);
  const [coverModal, setCoverModal] = React.useState<boolean>(false);
  const toggleAvatarModal = () => setAvatarModal((prev) => !prev);
  const toggleCoverModal = () => setCoverModal((prev) => !prev);

  return (
    <>
      <Box className="hero-section" sx={sx1}>
        {/* Cover Image */}
        <Box className="cover-image" sx={sx2}>
          <Box sx={sx3}>
            <IconButton onClick={toggleCoverModal}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {/* Avatar */}
        <Box className="avatar" sx={sx4}>
          <Box sx={sx5}>
            <IconButton onClick={toggleAvatarModal}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Box>
      {avatarModal && (
        <FormModal open={avatarModal} toggleModal={toggleAvatarModal}>
          <UpdateAvatar
            onClose={() => {
              setAvatarModal(false);
            }}
            currentAvatar={avatar}
          />
        </FormModal>
      )}
      {coverModal && (
        <FormModal open={coverModal} toggleModal={toggleCoverModal}>
          <UpdateCoverImage />
        </FormModal>
      )}
    </>
  );
};

export default HomeProfilePictures;

type HomeProfilePicturesProps = {
  coverImage: string;
  avatar: string;
};

const sx1 = {
  position: "relative",
  width: "100%",
  height: 250,
  bgcolor: "red",
  mb: 8,
};
