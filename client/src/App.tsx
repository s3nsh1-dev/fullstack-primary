import Dashboard from "./pages/Dashboard";
import Navbar from "./pages/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { getTheme } from "./utilities/muiThemeController";
import useMode from "./hooks/useMode";
import Test from "./pages/Test";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

function App() {
  const { mode } = useMode();
  const theme = useTheme();
  const mainSizing = useMediaQuery(theme.breakpoints.down(1313));

  return (
    <Box sx={{ marginTop: mainSizing ? "27px" : "67px" }}>
      <ThemeProvider theme={getTheme(mode)}>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {/* routes with Navbar */}
            <Route element={<Navbar navTitle="" />}>
              <Route path="/" element={<Dashboard />} />
            </Route>
            {/* routes without Navbar */}
            <Route path="/test" element={<Test />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </Box>
  );
}

export default App;
