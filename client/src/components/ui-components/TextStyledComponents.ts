import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

export const CaptionTextCenter = styled(Typography)({
  color: "grey",
  fontSize: "0.8rem",
  display: "flex",
  justifyContent: "center",
});

export const SettingInput = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    height: 35,
    backgroundColor: "transparent",
    "& fieldset": {
      borderColor: "gray",
    },
    "&:hover fieldset": {
      backgroundColor: "rgb(0,200,0,0.2)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "gray",
      borderWidth: 1,
      borderRadius: 1,
    },
  },
  "& .MuiInputBase-input": {
    color: "inherit",
    padding: "0 8px",
  },
});
