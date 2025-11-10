import { useState, type ChangeEvent, type FormEvent } from "react";
import useUsernameAvailability from "../../hooks/CRUD-hooks/useUsernameAvailability";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import useUpdateUsername from "../../hooks/CRUD-hooks/useUpdateUsername";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";
import CircularProgress from "@mui/material/CircularProgress";
import { SettingInput } from "../ui-components/TextStyledComponents";
import ShowInfoMessage from "./ShowInfoMessage";
import { useQueryClient } from "@tanstack/react-query";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

const ChangeUsername = () => {
  const [username, setUsername] = useState("");
  const queryClient = useQueryClient();
  const {
    data: available,
    isLoading,
    isError,
  } = useUsernameAvailability(username);
  const {
    mutate: updataUsername,
    isError: error,
    isSuccess: success,
  } = useUpdateUsername();

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
          queryClient.invalidateQueries({ queryKey: ["currentUser"] });
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
      <Typography gutterBottom>
        Our
        <Typography component="span" fontWeight="bold" color="error">
          &nbsp;LIVE&nbsp;
        </Typography>
        update feature will help you with unique names.
      </Typography>

      <Stack component={"form"} onSubmit={handleSubmit} gap={0.5}>
        <Box sx={sx1}>
          <SettingInput
            value={username}
            onChange={handleChange}
            fullWidth
            placeholder="Enter username"
          />
          {isLoading && <CircularProgress size={14} color="secondary" />}
          {isError && <HelpOutlineIcon color="error" fontSize="small" />}
          {available === true && (
            <CheckCircleOutlineIcon color="success" fontSize="small" />
          )}
          {available == false && (
            <HighlightOffIcon color="error" fontSize="small" />
          )}
        </Box>
        <ShowInfoMessage
          icon={<InfoOutlineIcon color="info" fontSize="small" />}
          text={infoMessage}
          color="info"
        />
        <Button variant="contained" type="submit" color="secondary" sx={sx2}>
          Submit
        </Button>
      </Stack>
      {error && (
        <ShowInfoMessage
          icon={<ErrorOutlineIcon color="error" fontSize="small" />}
          text={errorMessage}
          color="error"
        />
      )}
      {success && (
        <ShowInfoMessage
          icon={<CheckCircleOutlineIcon fontSize="small" color="success" />}
          text={successMessage}
          color="success"
        />
      )}
    </Box>
  );
};

export default ChangeUsername;

const regEx: RegExp = /^(?!.*\.\.)(?!.*\.$)[a-zA-Z0-9._]{3,20}$/;
const infoMessage =
  "Username can include letters, digits, dots, and underscores. Length 3–30 characters.";
const sx1 = { display: "flex", alignItems: "center", gap: 0.5 };
const sx2 = {
  padding: 0,
  px: 1,
  // fontSize: "0.9rem",
  // height: "100%",
  // width: "80px",
};
const errorMessage = "Something went wrong";
const successMessage = "Username updated successfully";
