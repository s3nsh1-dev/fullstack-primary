import React from "react";
import ShowTweets from "../components/homepage/ShowTweets";
import { Box, IconButton, Typography, Divider } from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FormModal from "../components/others/FormModal";
import CreateTweetForm from "../components/Tweets/CreateTweetForm";
import { DividerRoot } from "../components/ui-components/StyledComponents";

const Tweets = () => {
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const handleOpenModal = () => setOpenModal((prev) => !prev);

  return (
    <>
      <Box m={1}>
        <Box sx={sxValue}>
          <ChatBubbleOutlineIcon />
          <Typography variant="h6" fontWeight="bold" whiteSpace={"nowrap"}>
            Tweets
          </Typography>
          <DividerRoot>
            <Divider textAlign="right">
              <Typography>
                <IconButton onClick={handleOpenModal}>
                  <AddCircleIcon fontSize="large" />
                </IconButton>
                Create
              </Typography>
            </Divider>
          </DividerRoot>
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

const sxValue = {
  display: "flex",
  alignItems: "center",
  mb: 2,
  gap: 1,
};
