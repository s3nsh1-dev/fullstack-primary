import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { Box } from "@mui/material";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";
import ShowSubscribed from "../components/homepage/ShowSubscribed";

const Subscribers = () => {
  return (
    <Box m={1}>
      <HomeTabTitles
        text="Subscribers"
        icon={
          <PeopleAltOutlinedIcon sx={{ fontSize: 28, color: "primary.main" }} />
        }
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <ShowSubscribed />
      </Box>
    </Box>
  );
};

export default Subscribers;
