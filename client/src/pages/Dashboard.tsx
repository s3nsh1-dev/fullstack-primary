import { Box } from "@mui/material";
import Test from "./Test";
import ButtonOne from "../components/ui-components/ButtonOne";
import ButtonTwo from "../components/ui-components/ButtonTwo";
const Dashboard = () => {
  return (
    <Box>
      <Test navTitle="">
        <ButtonOne text="Button One" />
        <ButtonTwo text="Button two" />
      </Test>
    </Box>
  );
};

export default Dashboard;
