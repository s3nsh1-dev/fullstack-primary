import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import useChangeUserPassword from "../../hooks/CRUD-hooks/useChangeUserPassword";
import { SettingInput } from "../ui-components/TextStyledComponents";
import ShowInfoMessage from "./ShowInfoMessage";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
const ChangeUserPassword = () => {
  const [passwords, setPasswords] =
    React.useState<CredentialsType>(resetPassword);
  const { mutate: changePassword, data, isError } = useChangeUserPassword();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      passwords.currentPassword.length < 1 ||
      passwords.newPassword.length < 1
    ) {
      alert("EMPTY PASSWORD FIELDS");
      setPasswords(resetPassword);
      return;
    }
    changePassword(passwords, {
      onSuccess: () => setPasswords(resetPassword),
      onError: (error) => console.error(error),
    });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPasswords((prev) => {
      return { ...prev, [name]: value.trim() };
    });
  };
  return (
    <Box>
      <Typography gutterBottom>
        Your password is
        <Typography component="span" fontWeight="bold" color="success">
          &nbsp;encrypted&nbsp;
        </Typography>
        to maintain high security.
      </Typography>
      <Stack component={"form"} onSubmit={handleSubmit} gap={1} mb={1}>
        <SettingInput
          name="currentPassword"
          value={passwords.currentPassword}
          onChange={handleChange}
          placeholder="Enter old password"
          type="password"
        />
        <SettingInput
          name="newPassword"
          value={passwords.newPassword}
          onChange={(e) => handleChange(e)}
          placeholder="Enter new password"
          type="password"
        />
        <Button
          type="submit"
          sx={sxButton}
          color="secondary"
          variant="contained"
        >
          Submit
        </Button>
      </Stack>
      {isError && (
        <ShowInfoMessage
          icon={<ErrorOutlineIcon color="error" fontSize="small" />}
          text={errorMessage}
          color="error"
        />
      )}
      {data && (
        <ShowInfoMessage
          icon={<CheckCircleOutlineIcon fontSize="small" color="success" />}
          text={successMessage}
          color="success"
        />
      )}
    </Box>
  );
};

export default ChangeUserPassword;

type CredentialsType = {
  currentPassword: string;
  newPassword: string;
};
const resetPassword = {
  currentPassword: "",
  newPassword: "",
};
const errorMessage = "Something went wrong";
const successMessage = "Password changes successfully";
const sxButton = {
  padding: 0,
  px: 1,
};
