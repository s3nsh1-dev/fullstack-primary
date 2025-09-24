import React from "react";
import { CardActions, IconButton, Typography } from "@mui/material";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import CommentIcon from "@mui/icons-material/Comment";

const style4 = { position: "relative", top: "2px" };
const style7 = { mt: 0, p: 0, padding: "10px" };
const style8 = {
  borderRadius: "5px",
  padding: "2px 5px",
};
const style9 = { position: "relative", top: "1px" };

const Sample2: React.FC<Sample2Props> = ({ handleShowComments, disabled }) => {
  return (
    <CardActions sx={style7}>
      <IconButton disabled={false} sx={style8}>
        <ThumbUpOffAltIcon fontSize="small" color="primary" />
        <Typography
          variant="caption"
          // color="textSecondary"
          color="primary"
          sx={style4}
        >
          &nbsp;Like
        </Typography>
      </IconButton>
      {!disabled && (
        <IconButton sx={style8} onClick={handleShowComments}>
          <CommentIcon fontSize="small" />
          <Typography variant="caption" color="textSecondary" sx={style9}>
            &nbsp;comments
          </Typography>
        </IconButton>
      )}
    </CardActions>
  );
};

export default Sample2;

type Sample2Props = {
  handleShowComments?: () => void;
  disabled: boolean;
};
