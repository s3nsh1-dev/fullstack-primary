import React from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import useUpdateTweet from "../../hooks/data-fetching/useUpdateTweet";
import { useQueryClient } from "@tanstack/react-query";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import TwitterIcon from "@mui/icons-material/Twitter";
import useAuth from "../../hooks/useAuth";

const UpdateTweetContentForm = ({
  tweetId,
  closeModal,
}: {
  tweetId: string;
  closeModal: () => void;
}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [content, setContent] = React.useState<string>("");
  const addReplyMutate = useUpdateTweet();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (content.length > 3) {
      addReplyMutate.mutate({ tweetId, content });
    } else {
      alert("Content should be more than 3 characters");
    }
    setContent("");
    closeModal();
  };
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setContent(event.target.value);
  };
  return (
    <Box
      component="form"
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        gap: 10,
        padding: "20px 0px",
      }}
      onSubmit={(event) => {
        handleSubmit(event);
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{
          textDecoration: "",
          fontFamily: "monospace",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 1,
        }}
      >
        Update Tweet <TwitterIcon color="primary" />
      </Typography>

      <TextField
        id="outlined-basic"
        label="Add Comment"
        variant="filled"
        color="secondary"
        name="content"
        value={content}
        onChange={(event) => handleChange(event)}
        // fullWidth
        multiline
        sx={{ margin: "0px 50px", width: "90%" }}
      />
      <Box display="flex" gap={1}>
        <Button
          variant="contained"
          color="error"
          sx={{ gap: 0.5 }}
          onClick={closeModal}
        >
          <CancelIcon fontSize="small" />
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="success"
          sx={{ gap: 0.5 }}
          onClick={async () => {
            queryClient.invalidateQueries({
              queryKey: ["userTweets", user?.user._id],
            });
            await queryClient.refetchQueries({
              queryKey: ["userTweets", user?.user._id],
            });
          }}
        >
          <SaveIcon fontSize="small" />
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateTweetContentForm;
