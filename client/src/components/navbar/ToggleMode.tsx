import useMode from "../../hooks/useMode";
import BtnContainer from "../others/BtnContainer";
import { IconButton } from "@mui/material";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import LightModeIcon from "@mui/icons-material/LightMode";

const ToggleMode = () => {
  const { mode, changeMode } = useMode();

  return (
    <BtnContainer>
      <IconButton onClick={changeMode}>
        {mode ? <LightModeIcon /> : <NightsStayIcon />}
      </IconButton>
    </BtnContainer>
  );
};

export default ToggleMode;
