import { Box, CircularProgress } from "@mui/material";
import useMode from "../hooks/useMode";
import { backgroundColor } from "../constants/uiConstants";

const AppLoadingProgress = () => {
  const { mode } = useMode();
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: mode ? backgroundColor.light : backgroundColor.dark,
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default AppLoadingProgress;
