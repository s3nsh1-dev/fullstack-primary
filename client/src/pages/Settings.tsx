import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import Stack from "@mui/material/Stack";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";
import DeleteUser from "../components/setting/DeleteUser";
import DeactivateUser from "../components/setting/DeactivateUser";

const Settings = () => {
  return (
    <Stack p={1} gap={1}>
      <HomeTabTitles text="Settings" icon={<SettingsOutlinedIcon />} />
      Delete Account
      <DeleteUser />
      <DeactivateUser />
    </Stack>
  );
};

export default Settings;
