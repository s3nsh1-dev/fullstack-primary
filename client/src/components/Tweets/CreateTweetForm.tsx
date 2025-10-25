import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import useCreateTweet from "../../hooks/data-fetching/useCreateTweet";
import { useQueryClient } from "@tanstack/react-query";
import CancelIcon from "@mui/icons-material/Cancel";
import TwitterIcon from "@mui/icons-material/Twitter";
import useAuth from "../../hooks/useAuth";

const CreateTweetForm: React.FC<CreateTweetFormPropType> = ({ closeModal }) => {
  const { user } = useAuth();
  const { mutate: createTweet } = useCreateTweet();
  const queryClient = useQueryClient();
  const [content, setContent] = React.useState<string>("");
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (content.length <= 3) {
      return alert("Content should be more than 3 characters");
    }
    createTweet(content, {
      onSuccess: () => {
        // After successful
        queryClient.invalidateQueries({
          queryKey: ["userTweets", user?.user._id],
        });
      },
      onSettled: () => {
        setContent("");
        closeModal();
      },
      onError: (err) => {
        alert(`Failed to update tweet: ${err}`);
      },
    });
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
        Create Tweet <TwitterIcon color="primary" />
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
          onClick={() => closeModal()}
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
          <AddCircleIcon fontSize="small" />
          Save
        </Button>
      </Box>
    </Box>
  );
};

export default CreateTweetForm;

type CreateTweetFormPropType = {
  closeModal: () => void;
};
