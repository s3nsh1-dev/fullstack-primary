import React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import useChangeUserPassword from "../../hooks/CRUD-hooks/useChangeUserPassword";
import { SettingInput } from "../ui-components/TextStyledComponents";
import ShowInfoMessage from "./ShowInfoMessage";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const ChangeUserPassword = () => {
  const [passwords, setPasswords] =
    React.useState<CredentialsType>(resetPassword);
  const {
    mutate: changePassword,
    isSuccess,
    isError,
  } = useChangeUserPassword();
  const handleSubmit =
    (e: React.FormEvent<HTMLFormElement>) =>
    ({ currentPassword, newPassword }: CredentialsType) => {
      e.preventDefault();
      console.log(currentPassword, newPassword);
      changePassword({ currentPassword, newPassword });
    };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setPasswords((prev) => {
      return { ...prev, [name]: value };
    });
  };
  return (
    <Box>
      <Stack component={"form"} onSubmit={handleSubmit} gap={0.5} mb={1}>
        <SettingInput
          name="currentPassword"
          value={passwords.currentPassword}
          onChange={handleChange}
          placeholder="Enter old password"
        />
        <SettingInput
          name="newPassword"
          value={passwords.newPassword}
          onChange={(e) => handleChange(e)}
          placeholder="Enter new password"
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
      {isSuccess && (
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
