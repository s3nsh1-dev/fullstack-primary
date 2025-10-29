import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Box from "@mui/material/Box";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";
import ChangeUsername from "../components/setting/ChangeUsername";

const Settings = () => {
  return (
    <Box p={1}>
      <HomeTabTitles text="Settings" icon={<SettingsOutlinedIcon />} />
      <ChangeUsername />
    </Box>
  );
};

export default Settings;
