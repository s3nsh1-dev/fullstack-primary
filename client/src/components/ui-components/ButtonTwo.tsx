import { Button } from "@mui/material";
import type { FC } from "react";
import useMode from "../../hooks/useMode";
import { buttonColor, textColor } from "../../constants/uiConstants";
import type { ButtonTwoProps } from "../../constants/componentPropTypes";

const ButtonTwo: FC<ButtonTwoProps> = ({ text }) => {
  const { mode } = useMode();

  const style = {
    backgroundColor: "transparent",
    border: `2px solid ${mode ? textColor.dark : textColor.light}`,
    ":hover": {
      backgroundColor: buttonColor.default,
    },
  };

  return (
    <Button variant="outlined" sx={style}>
      {text}
    </Button>
  );
};

export default ButtonTwo;
