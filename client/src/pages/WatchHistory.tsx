import HistoryIcon from "@mui/icons-material/History";
import { Box } from "@mui/material";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";

const WatchHistory = () => {
  return (
    <Box>
      <HomeTabTitles
        text="Watch History"
        icon={<HistoryIcon sx={{ fontSize: 28, color: "primary.main" }} />}
      />
    </Box>
  );
};

export default WatchHistory;
