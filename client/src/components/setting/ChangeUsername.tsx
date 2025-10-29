import { useState, type ChangeEvent, type FormEvent } from "react";
import useUsernameAvailability from "../../hooks/CRUD-hooks/useUsernameAvailability";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import useUpdateUsername from "../../hooks/CRUD-hooks/useUpdateUsername";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import CircularProgress from "@mui/material/CircularProgress";
import { SettingInput } from "../ui-components/TextStyledComponents";

const ChangeUsername = () => {
  const [username, setUsername] = useState("");
  const {
    data: available,
    isLoading,
    isError,
  } = useUsernameAvailability(username);
  const { mutate: updataUsername } = useUpdateUsername();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setUsername(value);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (regEx.test(username)) {
      updataUsername(username, {
        onSuccess: () => {
          setUsername("");
        },
        onError: (error) => {
          console.error("Request Failed to update username: ", error);
        },
      });
    } else {
      alert("Please user correct formatting");
    }
  };
  return (
    <Box>
      <Stack component={"form"} onSubmit={handleSubmit} gap={0.5}>
        <Box sx={sx1}>
          <SettingInput
            value={username}
            onChange={handleChange}
            variant="outlined"
          />
          {isLoading && <CircularProgress size={14} color="secondary" />}
          {isError && <Typography>something went wrong...</Typography>}
          {available === true && (
            <CheckCircleOutlineIcon color="success" fontSize="small" />
          )}
          {available == false && (
            <HighlightOffIcon color="error" fontSize="small" />
          )}
        </Box>
        <Box sx={sx2}>
          <InfoOutlineIcon color="info" fontSize="small" />
          <Typography variant="caption" color="info" sx={sx3}>
            Username can include letters, digits, dots, and underscores. Length:
            3–30 characters.
          </Typography>
        </Box>
        <Button variant="contained" type="submit" color="secondary" sx={sx4}>
          Submit
        </Button>
      </Stack>
    </Box>
  );
};

export default ChangeUsername;

const regEx: RegExp = /^(?!.*\.\.)(?!.*\.$)[a-zA-Z0-9._]{3,20}$/;
const sx1 = { display: "flex", alignItems: "center", gap: 0.5 };
const sx2 = {
  display: "flex",
  alignItems: "center",
  gap: 0.5,
};
const sx3 = { position: "relative", top: "2px" };
const sx4 = {
  padding: 0,
  px: 1,
  fontSize: "0.9rem",
  height: "100%",
  width: "80px",
};
