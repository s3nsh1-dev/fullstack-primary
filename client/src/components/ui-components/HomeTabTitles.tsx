import { Box, Typography, Divider } from "@mui/material";
import type { FC } from "react";

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
    </Box>
  );
};

export default HomeTabTitles;

type HomeTabTitlesProps = {
  text: string;
  icon: React.ReactElement;
};
