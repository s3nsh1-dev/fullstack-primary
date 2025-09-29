import React from "react";
import { Box, IconButton } from "@mui/material";
import useMode from "../../hooks/useMode";
import { backgroundColor, textColor } from "../../constants/uiConstants";
import AddBoxIcon from "@mui/icons-material/AddBox";
import useAddCommentOnComment from "../../hooks/data-fetching/useAddCommentOnComment";
import useFetchCommentsOnComments from "../../hooks/data-fetching/useFetchCommentsOnComments";

const AddReplyOnComment = ({ ID }: { ID: string }) => {
  const { mode } = useMode();
  const [content, setContent] = React.useState<string>("");
  const addReplyMutate = useAddCommentOnComment();
  const { refetch: refreshRepliesForComment } = useFetchCommentsOnComments(ID);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (content.length > 3) {
      addReplyMutate.mutate(
        { content, comment_ID: ID },
        {
          onSettled: () => {
            setContent("");
            refreshRepliesForComment();
          },
        }
      );
    } else {
      alert("Comment should be more than 3 characters");
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
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
        value={content}
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

export default AddReplyOnComment;
