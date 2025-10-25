import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
const CircularProgressCenter = ({ size }: { size?: number }) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
      <CircularProgress color="secondary" size={size} />
    </Box>
  );
};

export default CircularProgressCenter;
