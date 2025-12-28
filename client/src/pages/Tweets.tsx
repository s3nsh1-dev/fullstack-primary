import React from "react";
import ShowTweets from "../components/homepage/ShowTweets";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import FormModal from "../components/others/FormModal";
import CreateTweetForm from "../components/Tweets/CreateTweetForm";
import { DividerRoot } from "../components/ui-components/StyledComponents";
import useAuth from "../hooks/useAuth";
import NotLoggedIn from "./NotLoggedIn";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";

const Tweets = () => {
  const { user, loading } = useAuth();
  const [openModal, setOpenModal] = React.useState<boolean>(false);
  const handleOpenModal = () => setOpenModal((prev) => !prev);

  if (!user && !loading) return <NotLoggedIn />;

  return (
    <>
      <Box p={2}>
        <Box sx={sxValue}>
          <HomeTabTitles
            text="Tweets"
            icon={<ChatBubbleOutlineIcon color="secondary" />}
          />
          <DividerRoot>
            <Divider textAlign="right">
              <Typography fontWeight={"bold"}>
                <IconButton onClick={handleOpenModal}>
                  <AddCircleIcon fontSize="large" color="success" />
                </IconButton>
                Create
              </Typography>
            </Divider>
          </DividerRoot>
        </Box>
        <ShowTweets interaction={true} pageLimit={6} />
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
  gap: 1,
};
