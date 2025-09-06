import Dashboard from "./pages/Dashboard";
import Navbar from "./pages/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { getTheme } from "./utilities/muiThemeController";
import useMode from "./hooks/useMode";

function App() {
  const { mode } = useMode();

  return (
    <ThemeProvider theme={getTheme(mode)}>
      <CssBaseline />
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
