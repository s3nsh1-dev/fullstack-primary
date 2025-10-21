// import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import useAuth from "../hooks/useAuth";
import NotLoggedIn from "./NotLoggedIn";

const Settings = () => {
  const { user, loading } = useAuth();
  if (!user && !loading) return <NotLoggedIn />;

  return <div>Settings for idk what</div>;
};

export default Settings;
