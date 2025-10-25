import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const NotLoggedIn = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      height={"91vh"}
    >
      <Typography variant="h5">Please Login to view this page</Typography>
    </Box>
  );
};

export default NotLoggedIn;
