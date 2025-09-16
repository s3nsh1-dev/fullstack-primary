import { IconButton } from "@mui/material";
import lightModeLogo from "../../assets/site_logo_white_croppedVersion.png";
import darkModeLogo from "../../assets/site_logo_black_croppedVersion.png";
import useMode from "../../hooks/useMode";

const SiteLogo = () => {
  const { mode } = useMode();

  return (
    <IconButton>
      <img src={mode ? darkModeLogo : lightModeLogo} height={40} />
    </IconButton>
  );
};

export default SiteLogo;
