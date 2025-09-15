import { Box, TextField, Typography, IconButton } from "@mui/material";
import FormControlThemed from "../components/others/FormControlThemed";
import useMode from "../hooks/useMode";
import { textColor } from "../constants/uiConstants";
import { useState } from "react";
import type { LoginCredentialType } from "../constants/dataTypes";
import {
  ContainedButton,
  TripleBorderFrame,
} from "../components/ui-components/StyledComponents";
import useLogin from "../hooks/data-fetching/useLogin";
import type { UserLoginAuthDataType } from "../constants/dataTypes";
import useAuth from "../hooks/useAuth";
import CloseIcon from "@mui/icons-material/Close";
import FormTitle from "../components/ui-components/FormTitle";

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
        login(data);
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
    <TripleBorderFrame mode={mode} component="form" onSubmit={handleSubmit}>
      <Box
        sx={{
          backgroundColor: "transparent",
          display: "flex",
          justifyContent: "end",
        }}
      >
        <IconButton>
          <CloseIcon />
        </IconButton>
      </Box>
      <FormTitle text="Log In" />
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
      <Box>
        <Typography sx={{ textAlign: "center" }}>
          Don't have an account?{" "}
          <Typography
            component="a"
            href="https://www.google.com"
            sx={{
              color: mode ? "purple" : "magenta",
              fontWeight: "bold",
              fontStyle: "italic",
            }}
          >
            create one
          </Typography>
        </Typography>
      </Box>
    </TripleBorderFrame>
  );
};

export default Login;
