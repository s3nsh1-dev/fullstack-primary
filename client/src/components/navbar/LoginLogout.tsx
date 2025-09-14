import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import { IconButton } from "@mui/material";
import useAuth from "../../hooks/useAuth";
import useLogin from "../../hooks/data-fetching/useLogin";
import useLogout from "../../hooks/data-fetching/useLogout";
import { sampleuserCredentials as userCredentials } from "../../constants/constants";

const LoginLogout = () => {
  const loginMutate = useLogin();
  const logoutMutate = useLogout();
  const { user, login, logout } = useAuth();

  const handleLogin = () => {
    loginMutate.mutate(userCredentials, {
      onSuccess: (data) => {
        login(data.user);
      },
    });
  };

  const handleLogout = () => {
    logoutMutate.mutate(
      loginMutate.data?.accessToken || "INVALID ACCESS TOKEN",
      {
        onSuccess: () => {
          logout();
        },
      }
    );
  };

  return (
    <>
      {!user ? (
        <IconButton onClick={handleLogin}>
          <LoginIcon fontSize="large" />
        </IconButton>
      ) : (
        <IconButton onClick={handleLogout}>
          <LogoutIcon fontSize="large" />
        </IconButton>
      )}
    </>
  );
};

export default LoginLogout;
