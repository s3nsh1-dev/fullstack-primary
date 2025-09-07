import type { FC } from "react";
import { Button } from "@mui/material";
import useMode from "../../hooks/useMode";
import { buttonColor } from "../../constants/uiConstants";
import type { ButtonOneProps } from "../../constants/componentPropTypes";

const PurpleButton: FC<ButtonOneProps> = ({ text }) => {
  const { mode, changeMode } = useMode();
  const style = {
    boxShadow: mode
      ? "6px 6px 1px rgba(0, 0, 0, 0.3) "
      : "6px 6px 1px rgba(220, 220, 200)",
    backgroundColor: buttonColor.default,
    "&:hover": {
      backgroundColor: buttonColor.hover,
    },
  };
  return (
    <Button variant="contained" sx={style} onClick={changeMode}>
      {text}
    </Button>
  );
};

export default PurpleButton;
