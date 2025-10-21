import { Box } from "@mui/material";
import useMode from "../hooks/useMode";
import { backgroundColor } from "../constants/uiConstants";
import "../css/div/pageLoadingCubeAnimation.css";

const AppLoadingProgress = () => {
  const { mode } = useMode();
  const style = { border: `0.5px solid ${mode ? "#000" : "#fff"}` };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: mode ? backgroundColor.light : backgroundColor.dark,
      }}
    >
      <div className="loader">
        <div className="cube">
          <div className="face" style={style}></div>
          <div className="face" style={style}></div>
          <div className="face" style={style}></div>
          <div className="face" style={style}></div>
          <div className="face" style={style}></div>
          <div className="face" style={style}></div>
        </div>
      </div>
    </Box>
  );
};

export default AppLoadingProgress;
