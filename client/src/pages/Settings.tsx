import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Stack from "@mui/material/Stack";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";

const Settings = () => {
  return (
    <Stack p={1} gap={1}>
      <HomeTabTitles text="Settings" icon={<SettingsOutlinedIcon />} />
      Delete Account
    </Stack>
  );
};

export default Settings;
