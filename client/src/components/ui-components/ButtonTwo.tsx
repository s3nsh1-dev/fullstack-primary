import { Button } from "@mui/material";
import type { FC } from "react";
import useMode from "../../hooks/useMode";

type ButtonTwoProps = {
  text?: string;
};

const buttonColor = {
  default: "#b744ddff",
  hover: "#9655c7ff",
};

const textColor = {
  light: "#f5f5f5",
  dark: "#000000ff",
};

const ButtonTwo: FC<ButtonTwoProps> = ({ text }) => {
  const { mode } = useMode();

  const style = {
    backgroundColor: "transparent",
    border: `2px solid ${mode ? textColor.light : textColor.dark}`,
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
