import type { FC } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import HomeIcon from "@mui/icons-material/Home";

export const Page404: FC<Page404Props> = ({ errorMessage }) => {
  return (
    <Box
      sx={{
        display: "flex",
        margin: "auto",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "85vh",
        textAlign: "center",
        gap: 2,
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem", lg: "5rem" },
          transition: "all 0.3s ease-in-out",
        }}
      >
        404: Page Not Found
      </Typography>
      {errorMessage && (
        <Typography color="error" variant="caption">
          {errorMessage}
        </Typography>
      )}
      <Button
        variant="contained"
        color="secondary"
        sx={{ gap: 0.5 }}
        onClick={() => (window.location.href = "/")}
      >
        <HomeIcon fontSize="small" />
        <Typography
          sx={{ fontWeight: "bold", position: "relative", top: "1px" }}
        >
          Home
        </Typography>
      </Button>
    </Box>
  );
};

type Page404Props = {
  errorMessage?: string;
};
