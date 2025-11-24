import { useState, type FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useLogin from "../hooks/data-fetching/useLogin";
import FormTitle from "../components/ui-components/FormTitle";
import FormControlThemed from "../components/others/FormControlThemed";
import CloseToggleIcon from "../components/ui-components/CloseToggleIcon";
import type {
  LoginCredentialType,
  UserLoginAuthDataType,
} from "../constants/dataTypes";
import {
  ContainedButton,
  FormInput,
} from "../components/ui-components/StyledComponents";
import useAuth from "../hooks/useAuth";
import useMode from "../hooks/useMode";

const Login: FC<LogInProps> = ({ toggleOpen }) => {
  const { mode } = useMode();
  const loginMutate = useLogin();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const resetCredentials: LoginCredentialType = {
    username: "",
    password: "",
  };
  const [userCred, setUserCred] =
    useState<LoginCredentialType>(resetCredentials);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    loginMutate.mutate(userCred, {
      onSuccess: (data: UserLoginAuthDataType) => {
        login(data);
        toggleOpen();
        setUserCred(resetCredentials);
      },
      onError: (err: Error) => {
        setError(err.message);
      },
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserCred((prev) => {
      return { ...prev, [name]: value };
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "15px !important",
        padding: "3% 3% 3% 3%",
      }}
    >
      <CloseToggleIcon toggleOpen={toggleOpen} />
      <FormTitle text="Log In" />
      <FormControlThemed htmlFor="username" label="Username">
        <FormInput
          autoComplete="username"
          id="username"
          name="username"
          placeholder="Enter Username"
          variant="standard"
          value={userCred.username}
          onChange={handleChange}
          required
        />
      </FormControlThemed>
      <FormControlThemed htmlFor="password" label="Password">
        <FormInput
          type="password"
          id="password"
          name="password"
          placeholder="Enter Password"
          variant="standard"
          value={userCred.password}
          onChange={handleChange}
          required
        />
      </FormControlThemed>

      {error && (
        <Box sx={{ color: "error.main", textAlign: "center", mt: 1 }}>
          <Typography variant="body2">{error}</Typography>
        </Box>
      )}

      <ContainedButton mode={mode} type="submit">
        {loginMutate.isPending ? "Logging in..." : "Submit"}
      </ContainedButton>
    </Box>
  );
};

export default Login;

type LogInProps = {
  toggleOpen: () => void;
};
