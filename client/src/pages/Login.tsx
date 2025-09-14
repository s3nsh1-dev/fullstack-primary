import { Box, TextField } from "@mui/material";
import FormControlThemed from "../components/others/FormControlThemed";
import useMode from "../hooks/useMode";
import { textColor } from "../constants/uiConstants";
import { useState } from "react";
import type { LoginCredentialType } from "../constants/dataTypes";
import { ContainedButton } from "../components/ui-components/StyledComponents";
import useLogin from "../hooks/data-fetching/useLogin";
import type { UserLoginAuthDataType } from "../constants/dataTypes";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const { mode } = useMode();
  const loginMutate = useLogin();
  const { login } = useAuth();
  const resetCredentials: LoginCredentialType = {
    username: "",
    password: "",
  };
  const [userCred, setUserCred] =
    useState<LoginCredentialType>(resetCredentials);
  const handleSubmit = () => {
    loginMutate.mutate(userCred, {
      onSuccess: (data: UserLoginAuthDataType) => {
        login(data.user);
      },
    });
    setUserCred(resetCredentials);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserCred((prev) => {
      return { ...prev, [name]: value };
    });
  };

  return (
    <Box component="form">
      <FormControlThemed htmlFor="username" label="Username">
        <TextField
          autoComplete="username"
          id="username"
          name="username"
          placeholder="Enter Username"
          required
          variant="standard"
          value={userCred.username}
          onChange={handleChange}
          sx={{
            width: "20rem",
            "& input:-webkit-autofill": {
              WebkitBoxShadow: "0 0 0 100px transparent inset !important",
              WebkitTextFillColor: mode ? textColor.dark : textColor.light,
              caretColor: mode ? textColor.dark : textColor.light, // keeps caret visible
              transition: "background-color 5000s ease-in-out 0s",
            },
          }}
        />
      </FormControlThemed>
      <FormControlThemed htmlFor="password" label="Password">
        <TextField
          type="password"
          id="password"
          name="password"
          placeholder="Enter Password"
          required
          variant="standard"
          value={userCred.password}
          onChange={handleChange}
          sx={{
            width: "20rem",
            "& input:-webkit-autofill": {
              WebkitBoxShadow: "0 0 0 100px transparent inset !important",
              WebkitTextFillColor: mode ? textColor.dark : textColor.light,
              caretColor: mode ? textColor.dark : textColor.light, // keeps caret visible
              transition: "background-color 5000s ease-in-out 0s",
            },
          }}
        />
      </FormControlThemed>
      <ContainedButton mode={mode} type="submit" onClick={handleSubmit}>
        Submit
      </ContainedButton>
    </Box>
  );
};

export default Login;
