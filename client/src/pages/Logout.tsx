import {
  ContainedButton,
  FormBox,
} from "../components/ui-components/StyledComponents";
import useMode from "../hooks/useMode";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import useLogout from "../hooks/data-fetching/useLogout";
import useAuth from "../hooks/useAuth";
import type { FC } from "react";
import CloseToggleIcon from "../components/ui-components/CloseToggleIcon";

type LogoutProps = {
  toggleOpen: () => void;
};

const Logout: FC<LogoutProps> = ({ toggleOpen }) => {
  const { mode } = useMode();
  const { user, logout } = useAuth();
  const logoutMutate = useLogout();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    logoutMutate.mutate(user?.accessToken || "", {
      onSuccess: () => {
        logout();
        toggleOpen();
      },
    });
  };
  return (
    <FormBox
      component="form"
      onSubmit={(event) =>
        handleSubmit(event as unknown as React.FormEvent<HTMLFormElement>)
      }
    >
      <CloseToggleIcon toggleOpen={toggleOpen} />
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
          Are you sure?
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          This action cannot be undone. Once confirmed, you won’t be able to
          interact with the contents or access unless re-login.
        </Typography>
      </Box>
      <ContainedButton mode={mode} type="submit" sx={{ my: 1 }}>
        Logout
      </ContainedButton>
    </FormBox>
  );
};

export default Logout;
