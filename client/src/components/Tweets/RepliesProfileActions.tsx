import React from "react";
import { CardActions, IconButton, Typography } from "@mui/material";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import { style4, style7, style8 } from "../../constants/tweets.constants";

const RepliesProfileActions: React.FC<RepliesProfileActionsProps> = () =>
  //     {
  //   ID,
  //   disabled,
  // }
  {
    return (
      <>
        <CardActions sx={style7}>
          <IconButton disabled={false} sx={style8}>
            <ThumbUpOffAltIcon fontSize="small" color="action" />
            <Typography variant="caption" color="textSecondary" sx={style4}>
              &nbsp;Like
            </Typography>
          </IconButton>
        </CardActions>
      </>
    );
  };

export default RepliesProfileActions;

type RepliesProfileActionsProps = {
  ID: string;
  disabled: boolean;
};
