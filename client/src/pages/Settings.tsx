import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import useAuth from "../hooks/useAuth";
import NotLoggedIn from "./NotLoggedIn";
import HomeTabTitles from "../components/ui-components/HomeTabTitles";
import Box from "@mui/material/Box";

const Settings = () => {
  const { user, loading } = useAuth();
  if (!user && !loading) return <NotLoggedIn />;

  return (
    <Box p={1}>
      <HomeTabTitles text="Settings" icon={<SettingsOutlinedIcon />} />
      <ol style={{ listStyleType: "decimal", paddingLeft: "20px" }}>
        <li>Update fullname</li>
        <li>Update username but live checking that username exist or not</li>
        <li>Update password</li>
        <li>Update email</li>
        <li>Delete account</li>
      </ol>
    </Box>
  );
};

export default Settings;
