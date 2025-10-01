import React from "react";
import { Box, Typography, Button, TextField } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import CommentIcon from "@mui/icons-material/Comment";
import useUpdateComment from "../../hooks/data-fetching/useUpdateComment";

const UpdateCommentForm = ({
  commentId,
  closeModal,
  tweetId,
}: {
  tweetId: string;
  commentId: string;
  closeModal: () => void;
}) => {
  const queryClient = useQueryClient();
  const [content, setContent] = React.useState<string>("");
  const updateCommentMutate = useUpdateComment();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (content.length <= 3) {
      return alert("Content should be more than 3 characters");
    }
    updateCommentMutate.mutate(
      { commentId, content },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["commentOnTweet", tweetId],
          });
        },
        onSettled: () => {
          setContent("");
          closeModal();
        },
        onError: (err) => {
          alert(`Failed to update comment. Please try again ${err}`);
        },
      }
    );
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
        Update Comment <CommentIcon color="primary" />
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
        >
          <SaveIcon fontSize="small" />
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateCommentForm;
