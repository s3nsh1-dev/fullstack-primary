import React from "react";
import { Box, IconButton } from "@mui/material";
import useMode from "../../hooks/useMode";
import { backgroundColor, textColor } from "../../constants/uiConstants";
import AddBoxIcon from "@mui/icons-material/AddBox";

const AddTweetCommentForm = () => {
  const { mode } = useMode();
  return (
    <Box
      component="form"
      style={{
        display: "flex",
        justifyContent: "center",
      }}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <input
        type="text"
        name="comment-on-tweet"
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
