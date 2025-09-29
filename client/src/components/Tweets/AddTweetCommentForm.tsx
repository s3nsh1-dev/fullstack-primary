import React from "react";
import { Box, IconButton } from "@mui/material";
import useMode from "../../hooks/useMode";
import { backgroundColor, textColor } from "../../constants/uiConstants";
import AddBoxIcon from "@mui/icons-material/AddBox";
import useAddCommentOnTweet from "../../hooks/data-fetching/useAddCommentOnTweet";
import { useQueryClient } from "@tanstack/react-query";
import useFetchCommentsOnTweets from "../../hooks/data-fetching/useFetchCommentsOnTweets";

const AddTweetCommentForm = ({ ID }: { ID: string }) => {
  const queryClient = useQueryClient();
  const resetForm = {
    content: "",
  };
  const addCommentMutate = useAddCommentOnTweet();
  const [formData, setFormData] = React.useState(resetForm);
  const { mode } = useMode();
  const { refetch: refetchCommentsForTweet } = useFetchCommentsOnTweets(ID);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formData.content.length > 3) {
      addCommentMutate.mutate(
        { content: formData.content, tweet_ID: ID },
        {
          onSettled: async () => {
            setFormData(resetForm);
            refetchCommentsForTweet();
          },
        }
      );
    } else {
      alert("Comment should be more than 3 characters");
    }
    queryClient.invalidateQueries({ queryKey: ["commentOnTweet", ID] });
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  return (
    <Box
      component="form"
      style={{
        display: "flex",
        justifyContent: "center",
      }}
      onSubmit={(event) => {
        handleSubmit(event);
      }}
    >
      <input
        type="text"
        name="content"
        value={formData.content}
        style={{
          width: "60%",
          backgroundColor: "transparent",
          border: `1px solid ${
            mode ? backgroundColor.dark : backgroundColor.light
          }`,
          color: mode ? textColor.dark : textColor.light,
          padding: "0px 10px",
        }}
        placeholder="add comment"
        onChange={(event) => {
          handleChange(event);
        }}
      />
      <IconButton
        type="submit"
        sx={{
          marginLeft: "5px",
          padding: "5px",
          "&: hover": {
            color: "secondary.main",
          },
        }}
      >
        <AddBoxIcon />
      </IconButton>
    </Box>
  );
};

export default AddTweetCommentForm;
