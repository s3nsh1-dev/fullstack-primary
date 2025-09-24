// import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import NotLoggedIn from "./NotLoggedIn";
import useAuth from "../hooks/useAuth";

const Settings = () => {
  const { user } = useAuth();
  if (!user) return <NotLoggedIn />;
  return <div>Settings for idk what</div>;
};

export default Settings;
