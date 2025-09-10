import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import type { ButtonProps } from "@mui/material";
import { textColor, buttonColor } from "../../constants/uiConstants";

interface StyledButtonProps extends ButtonProps {
  mode?: boolean;
}

export const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "mode",
})<StyledButtonProps>(({ mode }) => ({
  variants: "text",
  color: mode ? textColor.dark : textColor.light,
}));

export const OutlinedButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "mode",
})<StyledButtonProps>(({ mode }) => ({
  variants: "outlined",
  backgroundColor: "transparent",
  border: `1px solid ${mode ? textColor.dark : textColor.light}`,
  ":hover": {
    backgroundColor: buttonColor.default,
  },
}));

export const ContainedButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "mode",
})<StyledButtonProps>(({ mode }) => ({
  variant: "contained",
  boxShadow: mode
    ? "6px 6px 1px rgba(0, 0, 0, 0.7)"
    : "6px 6px 1px rgba(220, 220, 200)",
  backgroundColor: buttonColor.default,
  "&:hover": {
    backgroundColor: buttonColor.hover,
    boxShadow: "none",
  },
}));
