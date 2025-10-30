import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Box from "@mui/material/Box";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";
// import ChangeUsername from "../components/setting/ChangeUsername";
import ChangeUserPassword from "../components/setting/ChangeUserPassword";

const Settings = () => {
  return (
    <Box p={1}>
      <HomeTabTitles text="Settings" icon={<SettingsOutlinedIcon />} />
      {/* <ChangeUsername /> */}
      <ChangeUserPassword />
    </Box>
  );
};

export default Settings;
