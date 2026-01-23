import NotLoggedIn from "./NotLoggedIn";
import useAuth from "../hooks/useAuth";
import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

const Messages = () => {
  const { user, loading } = useAuth();
  if (!user && !loading) return <NotLoggedIn />;
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        height: "90vh",
        alignItems: "center",
      }}
    >
      <Typography variant="h2">Messaging(Coming Soon)</Typography>
    </Box>
  );
};

export default Messages;
