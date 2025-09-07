import type { FC } from "react";
import { Button } from "@mui/material";
import useMode from "../../hooks/useMode";

const buttonColor = {
  default: "#b744ddff",
  hover: "#9655c7ff",
};

const textColor = {
  light: "#f5f5f5",
  dark: "#000000ff",
};

type ButtonOneProps = {
  text?: string;
};

const PurpleButton: FC<ButtonOneProps> = ({ text }) => {
  const { mode, changeMode } = useMode();
  const style = {
    textTransform: "none",
    borderRadius: 0,
    fontWeight: 600,
    fontSize: "1rem",
    boxShadow: mode
      ? "6px 6px 5px rgba(0, 0, 0, 0.3) "
      : "6px 6px 1px rgba(220, 220, 200)",
    backgroundColor: buttonColor.default,
    color: mode ? textColor.dark : textColor.light,
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
