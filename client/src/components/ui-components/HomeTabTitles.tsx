import { Box, Typography, Divider, IconButton } from "@mui/material";
import type { FC } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";

const HomeTabTitles: FC<HomeTabTitlesProps> = ({ text, icon }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        mb: 2,
        gap: 1,
      }}
    >
      {icon}
      <Typography variant="h6" fontWeight="bold">
        {text}
      </Typography>
      <Divider sx={{ flexGrow: 1, ml: 2 }} />
      <Box>
        <IconButton>
          <AddCircleIcon fontSize="large" />
        </IconButton>
        Create
      </Box>
    </Box>
  );
};

export default HomeTabTitles;

type HomeTabTitlesProps = {
  text: string;
  icon: React.ReactElement;
};
