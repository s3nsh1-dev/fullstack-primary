import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import SettingsIcon from "@mui/icons-material/Settings";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DynamicFeedIcon from "@mui/icons-material/DynamicFeed";
import useMode from "../hooks/useMode";
import useAuth from "../hooks/useAuth";

const NotFound = () => {
  const navigate = useNavigate();
  const { mode } = useMode();
  const { user } = useAuth();
  const isLight = mode === true;

  return (
    <Box
      sx={{
        // minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        // bgcolor: isLight ? "#f9f9f9" : "#0f0f0f",
        py: 4,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={isLight ? 2 : 0}
          sx={{
            p: { xs: 4, md: 6 },
            textAlign: "center",
            borderRadius: 4,
            bgcolor: isLight ? "#fff" : "#1a1a1a",
            border: isLight ? "none" : "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* 404 Icon */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: { xs: 100, md: 120 },
              height: { xs: 100, md: 120 },
              borderRadius: "50%",
              bgcolor: isLight
                ? "rgba(244, 67, 54, 0.1)"
                : "rgba(244, 67, 54, 0.2)",
              mb: 3,
            }}
          >
            <ErrorOutlineIcon
              sx={{
                fontSize: { xs: 60, md: 80 },
                color: "error.main",
              }}
            />
          </Box>

          {/* 404 Text */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: "4rem", md: "6rem" },
              fontWeight: 700,
              color: isLight ? "#0f0f0f" : "#fff",
              mb: 2,
              background: isLight
                ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            404
          </Typography>

          {/* Main Message */}
          <Typography
            variant="h4"
            sx={{
              color: isLight ? "#0f0f0f" : "#fff",
              fontWeight: 600,
              mb: 2,
              fontSize: { xs: "1.5rem", md: "2rem" },
            }}
          >
            Page Not Found
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            sx={{
              color: isLight ? "#606060" : "#aaa",
              mb: 4,
              maxWidth: 500,
              mx: "auto",
              fontSize: { xs: "0.95rem", md: "1.1rem" },
            }}
          >
            Oops! The page you're looking for doesn't exist. It might have been
            moved or deleted.
          </Typography>

          {/* Action Buttons */}
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              startIcon={<DynamicFeedIcon />}
              onClick={() => navigate("/")}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                bgcolor: isLight ? "#065fd4" : "#fff",
                color: isLight ? "#fff" : "#0f0f0f",
                "&:hover": {
                  bgcolor: isLight ? "#0554c2" : "#e0e0e0",
                },
              }}
            >
              Feed
            </Button>

            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{
                px: 3,
                py: 1.5,
                borderRadius: 2,
                textTransform: "none",
                fontSize: "1rem",
                fontWeight: 600,
                borderColor: isLight ? "#d0d0d0" : "rgba(255, 255, 255, 0.23)",
                color: isLight ? "#0f0f0f" : "#fff",
                "&:hover": {
                  borderColor: isLight ? "#a0a0a0" : "rgba(255, 255, 255, 0.4)",
                  bgcolor: isLight
                    ? "rgba(0, 0, 0, 0.04)"
                    : "rgba(255, 255, 255, 0.05)",
                },
              }}
            >
              Go Back
            </Button>
          </Box>

          {/* Helpful Links */}
          <Box
            sx={{
              mt: 4,
              pt: 3,
              borderTop: `1px solid ${isLight ? "#e0e0e0" : "#3f3f3f"}`,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: isLight ? "#606060" : "#aaa",
                mb: 1.5,
              }}
            >
              Need help? Try these popular pages:
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              <IconButton
                onClick={() => navigate(`/${user?.user?.username}`)}
                sx={{
                  textTransform: "none",
                  color: isLight ? "#065fd4" : "#3ea6ff",
                  "&:hover": {
                    bgcolor: isLight
                      ? "rgba(6, 95, 212, 0.08)"
                      : "rgba(62, 166, 255, 0.1)",
                  },
                }}
              >
                <HomeIcon color="secondary" />
              </IconButton>
              <IconButton
                onClick={() => navigate("/support")}
                sx={{
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: isLight
                      ? "rgba(6, 95, 212, 0.08)"
                      : "rgba(62, 166, 255, 0.1)",
                  },
                }}
              >
                <PrivacyTipIcon color="warning" />
              </IconButton>

              <IconButton
                onClick={() => navigate("/setting")}
                sx={{
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: isLight
                      ? "rgba(6, 95, 212, 0.08)"
                      : "rgba(62, 166, 255, 0.1)",
                  },
                }}
              >
                <SettingsIcon color="info" />
              </IconButton>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default NotFound;
