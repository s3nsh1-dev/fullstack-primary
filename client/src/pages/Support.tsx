// import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import useAuth from "../hooks/useAuth";
import NotLoggedIn from "./NotLoggedIn";

const Support = () => {
  const { user } = useAuth();
  if (!user) return <NotLoggedIn />;

  return <div>Shows Terms and condition oR some Legal document</div>;
};

export default Support;
