import useMode from "../../hooks/useMode";
import { IconButton } from "@mui/material";
import NightsStayIcon from "@mui/icons-material/NightsStay";
import LightModeIcon from "@mui/icons-material/LightMode";
import { BoxCenter } from "../ui-components/StyledComponents";

const ToggleMode = () => {
  const { mode, changeMode } = useMode();

  return (
    <BoxCenter sx={{ marginLeft: "10px" }}>
      <IconButton onClick={changeMode}>
        {mode ? (
          <LightModeIcon fontSize="small" />
        ) : (
          <NightsStayIcon fontSize="small" />
        )}
      </IconButton>
    </BoxCenter>
  );
};

export default ToggleMode;
