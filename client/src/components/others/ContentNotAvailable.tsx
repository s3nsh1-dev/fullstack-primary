import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import "../../css/text/flicker-text.css";

const ContentNotAvailable = ({ text }: { text: string }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 1,
      }}
    >
      <Typography
        variant="body1"
        fontFamily="monospace"
        color="textSecondary"
        className="text-flicker-in-glow"
      >
        &lt; {text} &gt;
      </Typography>
    </Box>
  );
};

export default ContentNotAvailable;
