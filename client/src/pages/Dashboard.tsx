import { Box, Button } from "@mui/material";
import useMode from "../hooks/useMode";

const Dashboard = () => {
  const { changeMode } = useMode();
  return (
    <Box>
      This is Dashboard
      <Button color="secondary" onClick={changeMode} variant="outlined">
        change Mode
      </Button>
    </Box>
  );
};

export default Dashboard;
