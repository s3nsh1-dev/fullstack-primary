import { styled } from "@mui/material/styles";
import Button, { type ButtonProps } from "@mui/material/Button";
import Box, { type BoxProps } from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField, { type TextFieldProps } from "@mui/material/TextField";
import {
  textColor,
  buttonColor,
  backgroundColor,
} from "../../constants/uiConstants";

interface StyledButtonProps extends ButtonProps {
  mode?: boolean;
}
type StyledTextFieldProps = TextFieldProps & {
  mode?: boolean;
};

export const StyledButton = styled(Button, {
  shouldForwardProp: (prop) => prop !== "mode",
})<StyledButtonProps>(({ mode }) => ({
  variants: "text",
  height: "40px",
  color: mode ? textColor.dark : textColor.light,
  backgroundColor: "transparent",
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
  variants: "contained",
  whiteSpace: "nowrap",
  fontSize: "clamp(0.85rem, 2vw, 1rem)",
  variant: "contained",
  height: "38px",
  boxShadow: mode
    ? "6px 6px 1px rgba(0, 0, 0, 0.7)"
    : "6px 6px 1px rgba(220, 220, 200)",
  backgroundColor: buttonColor.default,
  "&:hover": {
    backgroundColor: buttonColor.hover,
    boxShadow: "none",
  },
}));

export const TripleBorderFrame = styled(Box, {
  shouldForwardProp: (prop) => prop !== "mode",
})<StyledButtonProps>(({ mode }) => ({
  display: "flex",
  flexDirection: "column",
  gap: "15px !important",
  padding: "3% 3% 3% 3%",
  border: `1px solid ${mode ? backgroundColor.dark : backgroundColor.light}`,
  boxShadow: `0 0 0 2px #b744dd, 0 0 0 3px ${
    mode ? backgroundColor.dark : backgroundColor.light
  }`,
}));

export const BoxCenter = styled(Box)({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export const RespText = styled(Typography)({
  whiteSpace: "nowrap", // prevent wrapping
  overflow: "hidden", // hide overflow
  textOverflow: "ellipsis", // show "..." if text too long
  fontSize: "clamp(0.85rem, 2vw, 1rem)", // responsive font
});

export const FormBox = styled(Box)<BoxProps>({
  display: "flex",
  flexDirection: "column",
  gap: "15px !important",
  padding: "3% 3% 3% 3%",
});

export const FormInput = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "mode",
})<StyledTextFieldProps>(({ mode }) => ({
  width: "20rem",
  "& input:-webkit-autofill": {
    WebkitBoxShadow: "0 0 0 100px transparent inset !important",
    WebkitTextFillColor: mode ? textColor.dark : textColor.light,
    caretColor: mode ? textColor.dark : textColor.light,
    transition: "background-color 5000s ease-in-out 0s",
  },
}));

export const DividerRoot = styled("div")(({ theme }) => ({
  width: "100%",
  ...theme.typography.body2,
  color: (theme.vars || theme).palette.text.secondary,
  "& > :not(style) ~ :not(style)": {
    marginTop: theme.spacing(2),
  },
}));
