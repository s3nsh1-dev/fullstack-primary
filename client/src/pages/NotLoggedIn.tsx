import { Box, Typography } from "@mui/material";

const NotLoggedIn = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Typography variant="h3">Please Login to view this page</Typography>
    </Box>
  );
};

export default NotLoggedIn;
