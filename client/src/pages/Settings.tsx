import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Stack from "@mui/material/Stack";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";
import UpdateUserAccountDetails from "../components/setting/UpdateUserAccountDetails";

const Settings = () => {
  return (
    <Stack p={1} gap={1}>
      <HomeTabTitles text="Settings" icon={<SettingsOutlinedIcon />} />
      Change Fullname and email
      <UpdateUserAccountDetails />
    </Stack>
  );
};

export default Settings;
