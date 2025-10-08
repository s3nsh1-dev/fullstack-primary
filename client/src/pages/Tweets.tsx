import React from "react";
import ShowTweets from "../components/homepage/ShowTweets";
import { Box, IconButton } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FormModal from "../components/others/FormModal";
import CreateTweetForm from "../components/Tweets/CreateTweetForm";

const Tweets = () => {
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const handleOpenModal = () => {
    setOpenModal((prev) => !prev);
  };

  return (
    <>
      <Box m={1}>
        <HomeTabTitles
          text="Tweets"
          icon={
            <ChatBubbleOutlineIcon
              sx={{ fontSize: 28, color: "primary.main" }}
            />
          }
        />
        <Box>
          <IconButton onClick={handleOpenModal}>
            <AddCircleIcon fontSize="large" />
          </IconButton>
          Create
        </Box>
        <ShowTweets interaction={true} />
      </Box>
      {openModal && (
        <FormModal toggleModal={() => setOpenModal(false)} open={openModal}>
          <CreateTweetForm closeModal={() => setOpenModal(false)} />
        </FormModal>
      )}
    </>
  );
};

export default Tweets;
