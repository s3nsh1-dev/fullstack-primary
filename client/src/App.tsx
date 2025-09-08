import Dashboard from "./pages/Dashboard";
import Navbar from "./pages/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { getTheme } from "./utilities/muiThemeController";
import useMode from "./hooks/useMode";
import Test from "./pages/Test";

function App() {
  const { mode } = useMode();

  return (
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
  );
}

export default App;
