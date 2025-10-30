import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const ShowInfoMessage: React.FC<PropTypes> = ({ icon, text, color }) => {
  return (
    <Box sx={sx2}>
      {icon}
      <Typography variant="caption" color={color} sx={sx3}>
        {text}
      </Typography>
    </Box>
  );
};

export default ShowInfoMessage;

const sx2 = {
  display: "flex",
  alignItems: "center",
  gap: 0.5,
};
const sx3 = { position: "relative", top: "2px" };
type PropTypes = {
  icon: React.ReactNode;
  text: string;
  color: string;
};
