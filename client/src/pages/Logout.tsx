import {
  TripleBorderFrame,
  ContainedButton,
} from "../components/ui-components/StyledComponents";
import useMode from "../hooks/useMode";
import { Typography, Box, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import useLogout from "../hooks/data-fetching/useLogout";
import useAuth from "../hooks/useAuth";

const Logout = () => {
  const { mode } = useMode();
  const { user, logout } = useAuth();
  const logoutMutate = useLogout();
  const handleSubmit = () => {
    logoutMutate.mutate(user?.accessToken || "INVALID ACCESS TOKEN", {
      onSuccess: () => {
        logout();
      },
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
      <Box sx={{ textAlign: "center", p: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          Are you sure?
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          This action cannot be undone. Once confirmed, you won’t be able to
          interact with the contents or access unless re-login.
        </Typography>
      </Box>

      <ContainedButton mode={mode} type="submit">
        Logout
      </ContainedButton>
    </TripleBorderFrame>
  );
};

export default Logout;
