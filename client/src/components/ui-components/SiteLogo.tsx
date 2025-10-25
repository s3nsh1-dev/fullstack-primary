import IconButton from "@mui/material/IconButton";
import lightModeLogo from "../../assets/site_logo_white_croppedVersion.png";
import darkModeLogo from "../../assets/site_logo_black_croppedVersion.png";
import useMode from "../../hooks/useMode";
import { Link } from "react-router-dom";

const SiteLogo = () => {
  const { mode } = useMode();

  return (
    <Link to="/">
      <IconButton>
        <img src={mode ? darkModeLogo : lightModeLogo} height={40} />
      </IconButton>
    </Link>
  );
};

export default SiteLogo;
